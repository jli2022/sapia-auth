import { AuthLockRepository } from './auth-lock.repository';
import { getModelToken } from '@nestjs/mongoose';
import { AuthLock } from './schemas/auth-lock.schema';
import { Test } from '@nestjs/testing';

const mockAuthLockModel = {
  deleteMany: jest.fn(),
  findById: jest.fn(),
};

describe('AuthLockRepository', function () {
  let repository: AuthLockRepository;
  beforeEach(async () => {
    jest.resetAllMocks();
    const moduleRef = await Test.createTestingModule({
      providers: [
        AuthLockRepository,
        {
          provide: getModelToken(AuthLock.name),
          useValue: mockAuthLockModel,
        },
      ],
    }).compile();
    repository = moduleRef.get<AuthLockRepository>(
      AuthLockRepository,
    ) as AuthLockRepository;
  });
  afterEach(() => {
    jest.restoreAllMocks();
  });
  it('should delete all auth locks', async () => {
    // WHEN
    await repository.deleteAll();
    // THEN
    expect(mockAuthLockModel.deleteMany).toHaveBeenCalled();
  });
});
