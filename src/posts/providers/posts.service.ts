import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/providers/users.service';
import { CreatePostDto } from '../dtos/create-post.dto';
import { Repository } from 'typeorm';
import { Post } from '../post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { MetaOption } from 'src/meta-options/meta-option.entity';

@Injectable()
export class PostsService {
  constructor(
    private readonly usersService: UsersService,
    /**
     * Injecting Post Repository
     */
    @InjectRepository(Post)
    private readonly postsRepository: Repository<Post>,
    /**
     * Injecting MetaOptionRepositoy
     */
    @InjectRepository(MetaOption)
    private readonly metaOptionsRepository: Repository<MetaOption>,
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
    //Create MetaOptions
    const metaOptions = createPostDto.metaOptions
      ? this.metaOptionsRepository.create(createPostDto.metaOptions)
      : null;

    if (metaOptions) {
      await this.metaOptionsRepository.save(metaOptions);
    }

    //Create Post
    const newPost = this.postsRepository.create(createPostDto);

    if (metaOptions) {
      newPost.metaOptions = metaOptions;
    }

    const result = await this.postsRepository.save(newPost);
    return result;
  }
}
