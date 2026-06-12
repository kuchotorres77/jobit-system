import { IsNotEmpty, IsString } from 'class-validator';

export class GoogleLoginDto {
  // ID token (credential) que devuelve Google Identity Services en el frontend
  @IsString()
  @IsNotEmpty()
  credential!: string;
}
