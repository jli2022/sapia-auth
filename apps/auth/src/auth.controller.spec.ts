import { Test } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { User } from '../../users/src/schemas/user.schema';
import { mocked } from 'jest-mock';

// Mock the AuthService module
jest.mock('./auth.service');
jest.mock('./auth-lock.repository');

describe('AuthController', function () {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService],
    }).compile();
    authController = moduleRef.get<AuthController>(
      AuthController,
    ) as AuthController;
    authService = moduleRef.get<AuthService>(AuthService) as AuthService;
    // Clear the mock calls before each test
    jest.clearAllMocks();
  });
  afterEach(() => {
    // Restore all mocks after each test
    jest.restoreAllMocks();
  });

  describe('login', () => {
    it('should call AuthService.signAccessToken with the correct user and return a token', async () => {
      // GIVEN
      const user: User = {
        _id: undefined,
        username: 'userA',
        password: 'password',
        attributes: [],
      };
      const mockAccessToken = 'mockAccessToken';
      // Mock the signAccessToken function
      mocked(authService.signAccessToken).mockImplementation(
        () => mockAccessToken,
      );
      // WHEN
      const result = authController.login(user);
      // THEN
      expect(authService.signAccessToken).toHaveBeenCalledWith(user);
      // THEN
      expect(result).toEqual({ access_token: mockAccessToken });
    });
  });
});
