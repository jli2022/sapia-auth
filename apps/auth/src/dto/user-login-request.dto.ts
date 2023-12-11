import { IsNotEmpty } from 'class-validator';

export class UserLoginRequestDto {
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  password: string;
}
