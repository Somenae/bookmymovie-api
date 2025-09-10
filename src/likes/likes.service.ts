import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class LikesService {
    constructor(private readonly prisma: PrismaService) {}

    async addLike(req: Request, postId: number) {
        try {
            await this.prisma.posts.update({
                where: { id: postId },
                data: {
                    totalLikes: {
                        increment: 1
                    }
                }
            });

            return await this.prisma.likes.create({
                data: {
                    postId: postId,
                    userId: req['user'].sub
                },
                select: {
                    user: {
                        select: {
                            username: true,
                        }
                    },
                    post: {
                        select: {
                            message: true,
                        }
                    }
                }
            });
        } catch (error) {
            await this.prisma.posts.update({
                where: { id: postId },
                data: {
                    totalLikes: {
                        decrement: 1
                    }
                }
            });
            throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
        }
    }

    async removeLike(req: Request, postId: number) {
        try {
            await this.prisma.posts.update({
                where: { id: postId },
                data: {
                    totalLikes: {
                        decrement: 1
                    }
                }
            });

            return await this.prisma.likes.delete({
                where: {
                    postId_userId: {
                        userId: req['user'].sub,
                        postId: postId
                    }
                }
            });
        } catch (error) {
            throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
        }
    }
}
