import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/providers/users.service';
import { CreatePostDto } from '../dtos/create-post.dto';

@Injectable()
export class PostsService {
  constructor(private readonly usersService: UsersService) {}
  public findAllPosts() {
    return [
      {
        id: 1,
        name: 'post1',
      },
      {
        id: 2,
        name: 'post2',
      },
    ];
  }

  public findPostById(userId: string) {
    const user = this.usersService.findUserById(userId);
    console.log('Found User', user);
    if (!user) {
      return {
        message: 'Post With this user not exist.',
      };
    }
    return {
      user,
      id: 1,
      name: 'Rahim',
    };
  }

  public createPost(postData: CreatePostDto) {
    return {
      success: true,
      status: 201,
      message: 'Post created succesfully',
      data: postData,
    };
  }
}
