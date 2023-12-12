import { UsersService } from './users.service';
import { UsersRepository } from './users.repository';
import { FilterQuery, Types } from 'mongoose';
import { User } from './schemas/user.schema';
import { Test, TestingModule } from '@nestjs/testing';

// Mocking the UsersRepository module
jest.mock('./users.repository'); // Mocking the UsersRepository module

const userId = '657672083125d28526b66eab';
const expectedUser: User = {
  _id: new Types.ObjectId(userId),
  password: 'testPassword',
  username: 'testUsername',
  attributes: [],
};

describe('UsersService', function () {
  let usersService: UsersService;
  let usersRepository: UsersRepository;
  beforeEach(async () => {
    // Clearing all mocks before each test
    jest.resetAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, UsersRepository],
    }).compile();

    usersService = module.get<UsersService>(UsersService) as UsersService;
    usersRepository = module.get<UsersRepository>(
      UsersRepository,
    ) as UsersRepository;
  });
  afterEach(() => {
    // Restoring all mocks after each test
    jest.restoreAllMocks();
  });

  describe('listAllUsers', () => {
    it('should return all users', async () => {
      // We expect that the listAllUsers function should call the find method of UsersRepository with an empty object as argument
      // GIVEN
      jest.spyOn(usersRepository, 'find').mockImplementation(jest.fn());
      // WHEN
      await usersService.listAllUsers();
      // THEN
      expect(usersRepository.find).toHaveBeenCalledWith({});
    });
  });

  describe('getUserByUserId', () => {
    it('should return user by id', async () => {
      // GIVEN
      const mockGetData = jest.fn().mockReturnValue(expectedUser);
      jest.spyOn(usersRepository, 'findById').mockImplementation(mockGetData);
      // WHEN
      const user = await usersService.getUserByUserId(userId);
      // THEN
      expect(usersRepository.findById).toHaveBeenCalledWith(userId);
      expect(user).toBe(expectedUser);
    });
  });

  describe('initUserSeed', () => {
    it('should seed users', async () => {
      // GIVEN
      const deleteAllSpy = jest
        .spyOn(usersRepository, 'deleteAll')
        .mockImplementation(() => Promise.resolve());
      // WHEN
      await usersService.initUserSeed();
      // THEN
      expect(deleteAllSpy).toHaveBeenCalled();
    });
  });

  describe('getUserByUsername', () => {
    it('should return user data if the username exists', async () => {
      // GIVEN
      const mockGetData = jest.fn().mockReturnValue(expectedUser);
      jest.spyOn(usersRepository, 'findOne').mockImplementation(mockGetData);
      const filterQuery: FilterQuery<User> = { username: 'testUsername' };
      // WHEN
      const result = await usersService.getUserByUsername(filterQuery);
      // THEN
      expect(result).toBe(expectedUser);
      expect(usersRepository.findOne).toHaveBeenCalled();
      expect(usersRepository.findOne).toHaveBeenCalledWith(filterQuery);
    });
  });
});
