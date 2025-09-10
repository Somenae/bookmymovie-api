import { Controller, Get, Post, Body, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('new')
  create(
    @Request() req: Request,
    @Body() createPostDto: CreatePostDto
  ) {
    return this.postsService.create(req, createPostDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.postsService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Delete('remove/:id')
  remove(
    @Request() req: Request,
    @Param('id') id: string
  ) {
    return this.postsService.remove(req, +id);
  }
}
