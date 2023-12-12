import * as bcrypt from 'bcrypt';

import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../../users/src/schemas/user.schema';
import { ConfigService } from '@nestjs/config';
import { UserLoginRequestDto } from './dto/user-login-request.dto';
import { UsersMicroserviceClient } from '../../users/src/users-microservice-client.service';
import { AuthLockRepository } from './auth-lock.repository';
import { Types } from 'mongoose';
import { of } from 'rxjs';
import { UnauthorizedException } from '@nestjs/common';

const userId = '657672083125d28526b66eab';
const expectedUser: User = {
  _id: new Types.ObjectId(userId),
  password: 'testPassword',
  username: 'testUsername',
  attributes: [],
};
const mockModel = {
  deleteMany: jest.fn(),
  findById: jest.fn(),
};

// Use jest to mock the JwtService
jest.mock('@nestjs/jwt'); // Use jest to mock the JwtService
jest.mock('@nestjs/config');

describe('AuthService', function () {
  let service: AuthService;
  let configService: ConfigService;
  let jwtService: JwtService;
  let usersMsClient: UsersMicroserviceClient;
  let authLockRepository: AuthLockRepository;
  // Set up before each test
  beforeEach(() => {
    configService = new ConfigService();
    jwtService = new JwtService();
    usersMsClient = new UsersMicroserviceClient();
    authLockRepository = new AuthLockRepository(mockModel as any);
    service = new AuthService(
      configService,
      jwtService,
      usersMsClient,
      authLockRepository,
    );

    // Clearing all mocks
    jest.resetAllMocks();
  });
  // Cleaning up after each test
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('initialCollections', () => {
    it('should call deleteAll method of authLockRepository', async () => {
      // GIVEN
      const deleteAllSpy = jest
        .spyOn(authLockRepository, 'deleteAll')
        .mockResolvedValue(undefined);
      // WHEN
      await service.initialCollections();
      // THEN
      expect(deleteAllSpy).toHaveBeenCalled();
    });
  });

  describe('getUserByUserId', () => {
    it('should call usersMsClient.getUserByUserId with correct parameters', async () => {
      // GIVEN
      jest
        .spyOn(usersMsClient, 'getUserByUserId')
        .mockImplementation(() => of(expectedUser));
      // WHEN
      const result = await service.getUserByUserId(userId);
      // THEN
      expect(result).toEqual(expectedUser);
      expect(usersMsClient.getUserByUserId).toHaveBeenCalledWith(userId);
    });
  });

  describe('signAccessToken', function () {
    it('should sign an access token', () => {
      // GIVEN
      const signSpy = jest
        .spyOn(jwtService, 'sign')
        .mockReturnValue('testToken');
      // WHEN
      const result = service.signAccessToken(expectedUser);
      // THEN
      expect(signSpy).toHaveBeenCalledWith({
        sub: expectedUser._id.toString(),
      });
      // Check if the result is correct
      expect(result).toBe('testToken');
    });
  });

  describe('Local Authentication', function () {
    const userLoginRequestDto: UserLoginRequestDto = {
      username: 'username',
      password: 'password',
    };
    const authLock: any = {
      userId: userId,
      failedAttempts: [],
      lockExpiredAt: null,
    };

    // Test the validateUserLogin function
    it('should validate user login', async () => {
      jest
        .spyOn(usersMsClient, 'getUserByUsername')
        .mockReturnValue(of(expectedUser));
      jest.spyOn(authLockRepository, 'findOne').mockResolvedValue(authLock);
      jest
        .spyOn(authLockRepository, 'findOneAndUpdate')
        .mockResolvedValue(authLock);
      jest.spyOn(bcrypt, 'compare').mockImplementation(() => of(true));
      // WHEN
      const result = await service.validateUserLogin(userLoginRequestDto);
      // THEN
      expect(result).toEqual(expectedUser);
    });

    // Test the validateUserLogin function when the user is not found
    it('should not validate user login when user is not found', async () => {
      // GIVEN
      jest.spyOn(usersMsClient, 'getUserByUsername').mockReturnValue(of(null));

      // Call the method to test and expect it to throw an UnauthorizedException
      await expect(
        service.validateUserLogin(userLoginRequestDto),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});
