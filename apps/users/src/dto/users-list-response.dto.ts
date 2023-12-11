import { IsNotEmpty } from 'class-validator';

export class UsersListResponseDto {
  userId: string;

  @IsNotEmpty()
  username: string;

  attributes: string[];
}
