import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/providers/users.service';
import { CreatePostDto } from '../dtos/create-post.dto';
import { Repository } from 'typeorm';
import { Post } from '../post.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PostsService {
  constructor(
    private readonly usersService: UsersService,
    /**
     * Injecting Post Repository
     */
    @InjectRepository(Post)
    private readonly postsRepository: Repository<Post>,
     ) {}
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

  public async createPost(createPostDto: CreatePostDto) { 
    //Create Post
    const newPost = this.postsRepository.create(createPostDto);
    const result = await this.postsRepository.save(newPost);
    return result;
  }
}
