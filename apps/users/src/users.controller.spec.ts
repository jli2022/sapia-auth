import { Test } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './schemas/user.schema';
import { Types } from 'mongoose';

// Mocking the components
jest.mock('./users.service');
jest.mock('./users.repository');

// Define a mock user
const mockUser: User = {
  attributes: [],
  _id: new Types.ObjectId('657672083125d28526b66eab'),
  username: 'testUser',
  password: 'password',
};

describe('UsersController', function () {
  let usersController: UsersController;
  let usersService: UsersService;

  beforeEach(async () => {
    jest.resetAllMocks(); // Reset all mocks before each test
    const moduleRef = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService],
    }).compile();
    usersService = moduleRef.get<UsersService>(UsersService) as UsersService;
    usersController = moduleRef.get<UsersController>(
      UsersController,
    ) as UsersController;
  });
  afterEach(() => {
    jest.restoreAllMocks(); // Restore all mocks after each test
  });

  it('getUserByUserId should return a user', async () => {
    // GIVEN
    const getUserByUserIdSpy = jest
      .spyOn(usersService, 'getUserByUserId')
      .mockImplementation(async () => mockUser);
    // WHEN
    const user = await usersController.getUserByUserId('1');
    // THEN
    expect(user).toEqual(mockUser);
    expect(getUserByUserIdSpy).toHaveBeenCalledWith('1');
  });

  it('should return a user when called with a valid username', async () => {
    // GIVEN
    const username = 'testusername';
    jest.spyOn(usersService, 'getUserByUsername').mockResolvedValue(mockUser);
    // WHEN
    const result = await usersController.getUserByUsername(username);
    // THEN
    expect(result).toEqual(mockUser);
    expect(usersService.getUserByUsername).toHaveBeenCalledWith({ username });
  });

  it('transforms the user data into DTO format', async () => {
    // GIVEN
    const expectedDto = {
      userId: '657672083125d28526b66eab',
      username: 'testUser',
      attributes: [],
    };
    // WHEN
    jest.spyOn(usersService, 'listAllUsers').mockResolvedValue([mockUser]);

    // THEN
    // Assert the returned value should be transformed into DTO format
    await expect(usersController.listUsers()).resolves.toEqual([expectedDto]);
    // Assert listAllUsers method of usersService is called
    expect(usersService.listAllUsers).toHaveBeenCalled();
  });
});
