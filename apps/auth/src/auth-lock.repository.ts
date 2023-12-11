import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AbstractRepository } from '@app/common';
import { AuthLock } from './schemas/auth-lock.schema';

@Injectable()
export class AuthLockRepository extends AbstractRepository<AuthLock> {
  protected readonly logger = new Logger(AuthLockRepository.name);

  constructor(@InjectModel(AuthLock.name) authLockModel: Model<AuthLock>) {
    super(authLockModel);
  }
  async deleteAll() {
    await this.model.deleteMany({});
    this.logger.warn('All AuthLock had been deleted. ');
  }
}
