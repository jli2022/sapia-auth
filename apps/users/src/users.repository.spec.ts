import { Test } from '@nestjs/testing';
import { UsersRepository } from './users.repository';
import { Types } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';

const mockUserModel = {
  deleteMany: jest.fn(),
  findById: jest.fn(),
};
const userId = '657672083125d28526b66eab';
const expectedUser: User = {
  _id: new Types.ObjectId(userId),
  password: 'testPassword',
  username: 'testUsername',
  attributes: [],
};

describe('UsersRepository', function () {
  let usersRepository: UsersRepository;
  beforeEach(async () => {
    jest.resetAllMocks();
    const moduleRef = await Test.createTestingModule({
      providers: [
        UsersRepository,
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
      ],
    }).compile();
    usersRepository = moduleRef.get<UsersRepository>(
      UsersRepository,
    ) as UsersRepository;
  });
  // Cleaning up the test environment
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('deleteAll', () => {
    it('should call deleteMany and log a warning', async () => {
      // GIVEN
      jest.spyOn(mockUserModel, 'deleteMany').mockImplementation(jest.fn());
      // WHEN
      await usersRepository.deleteAll();
      // THEN
      expect(mockUserModel.deleteMany).toHaveBeenCalled();
    });
  });

  describe('findById', () => {
    it('should return a user by id', async () => {
      // GIVEN
      jest.spyOn(mockUserModel, 'findById').mockResolvedValue(expectedUser);
      // WHEN
      const user = await usersRepository.findById(userId);
      // THEN
      expect(mockUserModel.findById).toHaveBeenCalledWith(userId);
      expect(user).toBe(expectedUser);
    });
  });
});
