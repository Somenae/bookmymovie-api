import { Controller, Get, Param, ParseIntPipe, Request, UseGuards } from '@nestjs/common';
import { LikesService } from './likes.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('likes')
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @UseGuards(JwtAuthGuard)
  @Get('like/:postId')
  addLike(
    @Request() req: Request,
    @Param('postId', ParseIntPipe) postId: number
  ) {
    return this.likesService.addLike(req, postId)
  }

  @UseGuards(JwtAuthGuard)
  @Get('unlike/:postId')
  removeLike(
    @Request() req: Request,
    @Param('postId', ParseIntPipe) postId: number
  ) {
    return this.likesService.removeLike(req, postId);
  }
}
