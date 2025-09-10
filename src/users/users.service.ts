import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.findByUsername(createUserDto.email);
    
    if (existingUser) {
      throw new ConflictException('User with this username already exists');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    
    return await this.prisma.users.create({
      data: {
        ...createUserDto,
        password: hashedPassword,
      },
      select: {
        id: true,
        username: true,
        email: true,
        createdAt: true,
      },
    });
  }

  async findAll() {
    return await this.prisma.users.findMany({
      select: {
        username: true,
        post: {
          select: {
            message: true,
            totalLikes: true,
            createdAt: true,
          }
        }
      }
    });
  }

  update(req: Request, updateUserDto: UpdateUserDto) {
    return this.prisma.users.update({
      where: {
        username: req['user'].username
      },
      data: updateUserDto
    })
  }

  async findByUsername(username: string) {
    /* DO NOT USE TO RETURN PUBLIC DATA
    Method used by validate user for auth
    Adding anything more breaks it
    Needs to add a separate method for user's profile consultation */
    return await this.prisma.users.findUnique({ 
      where: { 
        username: username 
      }
    });
  }

  async findUser(username: string){
    return await this.prisma.users.findUnique({ 
      where: { 
        username: username 
      },
      select: {
        username: true,
        post: true,
        following: true
      }
    });
  }

  async findProfile(req: Request) {
    return await this.prisma.users.findUnique({ 
      where: { 
        username: req["user"].username 
      },
      select: {
        username: true,
        post: true,
        following: {
          select: {
            username: true,
          }
        },
        followers: {
          select: {
            username: true,
          }
        }
      }
    });
  }

  async addFollow(req: Request, username: string) {
    await this.prisma.users.update({
      where: { username },
      data: {
        followers: {
          connect: { username: req['user'].username }
        }
      }
    });

    return this.prisma.users.update({
      where: { username: req['user'].username },
      data: {
        following: {
          connect: { username: username }
        }
      },
      select: {
        username: true,
        following: {
          select: {
            username: true
          }
        }
      }
    });
  }

  async removeFollow(req: Request, username: string) {
    await this.prisma.users.update({
      where: { username },
      data: {
        followers: {
          disconnect: { username: req['user'].username }
        }
      }
    });

    return this.prisma.users.update({
      where: { username: req['user'].username },
      data: {
        following: {
          disconnect: { username: username }
        }
      },
      select: {
        username: true,
        following: {
          select: {
            username: true,
          }
        }
      }
    });
  }

  async getFeed(req: Request) {
    return await this.prisma.users.findUnique({
      where: {
        username: req['user'].username
      },
      select: {
        following: {
          select: {
            username: true,
            post: {
              select: {
                message: true,
                totalLikes: true,
                createdAt: true,
              }
            }
          }
        }
      }
    })
  }
}



/* const deleteTagAndChildren = async (parentId) => {
  const prisma = new PrismaClient()

  // Start a transaction
  const deletedRecords = await prisma.$transaction([
    prisma.tag.deleteMany({
      where: {
        parentId: parentId,
      },
    }),
    prisma.tag.delete({
      where: {
        id: parentId,
      },
    }),
  ])

  return deletedRecords
} */