import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class CreateUserDto {
    @IsString()
    @MinLength(5)
    @IsNotEmpty()
    username: string;

    @IsString()
    @MinLength(5)
    @IsNotEmpty()
    password: string;

    @IsString()
    @IsEmail()
    @IsNotEmpty()
    email: string;
}
