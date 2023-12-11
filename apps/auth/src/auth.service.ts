import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserLoginRequestDto } from './dto/user-login-request.dto';
import { UsersMsClient } from './msClients/users-ms-client';
import { lastValueFrom } from 'rxjs';
import { AuthLockRepository } from './auth-lock.repository';
import { AuthLock } from './schemas/auth-lock.schema';
import * as bcrypt from 'bcrypt';
import { User } from '../../users/src/schemas/user.schema';

@Injectable()
export class AuthService {
  protected readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private usersMsClient: UsersMsClient,
    private authLockRepository: AuthLockRepository,
  ) {}

  async getUserByUserId(userId: string): Promise<User> {
    return await lastValueFrom(this.usersMsClient.getUserByUserId(userId));
  }

  async validateUserLogin(userLoginRequest: UserLoginRequestDto) {
    const { username, password } = userLoginRequest;
    const user = await lastValueFrom(
      this.usersMsClient.getUserByUsername(username),
    );
    if (!user) {
      this.logger.debug('User not found by username: ${username}');
      throw new UnauthorizedException('Credentials are not valid.');
    }
    this.logger.log(user);
    let authLock = await this.authLockRepository.findOne({
      userId: user._id.toString(),
    });
    this.logger.log(authLock);
    if (!authLock) {
      authLock = await this.authLockRepository.create({
        failedAttempts: [],
        lockExpiredAt: undefined,
        userId: user._id.toString(),
      });
    }

    const isLocking =
      authLock.lockExpiredAt && authLock.lockExpiredAt > new Date();
    if (isLocking) {
      this.logger.log('isLocking', authLock.lockExpiredAt);
      throw new UnauthorizedException('This user had been locked.');
    } else {
      if (authLock.lockExpiredAt) authLock = await this.unLockUser(authLock);
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      await this.tryClockUser(authLock);
      throw new UnauthorizedException('Credentials are not valid.');
    }

    await this.unLockUser(authLock);
    return user;
  }

  private async unLockUser(authLock: AuthLock) {
    await this.authLockRepository.findOneAndUpdate(
      { userId: authLock.userId },
      {
        $set: {
          failedAttempts: [],
          lockExpiredAt: undefined,
        },
      },
    );
    return {
      ...authLock,
      failedAttempts: [],
      lockExpiredAt: undefined,
    };
  }

  private async tryClockUser(authLock: AuthLock) {
    const needLockAccount =
      AuthService.isThirdFailedLogingAttemptsInFiveMinutes(authLock);

    if (needLockAccount) {
      this.logger.log('locked now', authLock.failedAttempts);
      const lockExpiredAt = new Date();
      lockExpiredAt.setMinutes(lockExpiredAt.getMinutes() + 1);
      await this.authLockRepository.findOneAndUpdate(
        {
          userId: authLock.userId,
        },
        {
          $set: { lockExpiredAt: lockExpiredAt },
        },
      );
      throw new UnauthorizedException('This user had been locked.');
    } else {
      this.logger.log('adding attmpts', authLock.failedAttempts);
      await this.authLockRepository.findOneAndUpdate(
        {
          userId: authLock.userId,
        },
        {
          $set: {
            failedAttempts: [...authLock.failedAttempts, new Date()],
          },
        },
      );
    }
  }

  private static isThirdFailedLogingAttemptsInFiveMinutes(authLock: AuthLock) {
    if (!authLock.failedAttempts || authLock.failedAttempts.length < 3)
      return false;

    const firstFailedAttempt = new Date(
      Math.min(...authLock.failedAttempts.map((date) => date.getTime())),
    );

    const diff = new Date().getTime() - firstFailedAttempt.getTime();
    return Math.floor(diff / 1000 / 60) <= 5;
  }

  signAccessToken(user: User) {
    return this.jwtService.sign({
      sub: user._id.toString(),
    });
  }

  async initialCollections() {
    await this.authLockRepository.deleteAll();
  }
}
