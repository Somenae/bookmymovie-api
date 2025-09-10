import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PostsService {

  constructor(private readonly prisma: PrismaService) {}

  create(req: Request, datas: CreatePostDto) {
    return this.prisma.posts.create({ 
      data: {
        ...datas,
        user: {
          connect: {
            username: req['user'].username
          }
        }
      }
     });
  }

  async findAll() {
    return this.prisma.posts.findMany({
      select: {
        id: true,
        message: true,
        totalLikes: true,
        user: {
          select: {
            username: true
          }
        },
        createdAt: true,
      }
    })
  }

  findOne(id: number) {
    return `This action returns a #${id} post`;
  }

  update(id: number, updatePostDto: UpdatePostDto) {
    return `This action updates a #${id} post`;
  }

  async remove(req: Request, id: number) {
    let userId = req['user'].sub;
    let post = await this.prisma.posts.findUnique({
      where: { id: id }
    });

    if (!post) {
      throw new HttpException('Nothing found', HttpStatus.NOT_FOUND);
    }

    if (userId !== post.userId) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }

    return this.prisma.posts.delete({
      where: { id: id }
    });
  }
}
