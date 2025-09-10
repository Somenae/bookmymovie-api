import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('myprofile')
  userProfile(@Request() req: Request) {
      return this.usersService.findProfile(req);
  }

  @UseGuards(JwtAuthGuard)
  @Get('feed')
  getFeed(
    @Request() req: Request
  ) {
    return this.usersService.getFeed(req);
  }

  @UseGuards(JwtAuthGuard)
  @Get('follow/:username')
  followUser(
    @Request() req: Request,
    @Param('username') username: string
  ) {
    return this.usersService.addFollow(req, username);
  }

  @UseGuards(JwtAuthGuard)
  @Get('unfollow/:username')
  unfollowUser(
    @Request() req: Request,
    @Param('username') username: string
  ) {
    return this.usersService.removeFollow(req, username);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':username')
  findOne(
    @Param('username') username: string
  ) {
    return this.usersService.findUser(username);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('myprofile/update')
  update(
    @Request() req: Request, 
    @Body() updateUserDto: UpdateUserDto
  ) {
    return this.usersService.update(req, updateUserDto);
  }
}
