import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/providers/users.service';
import { Post } from '../post.entity';
import { Repository } from 'typeorm';
import { TagsService } from 'src/tags/providers/tags.service';
import { CreatePostDto } from '../dtos/create-post.dto';
import { IActiveUser } from 'src/auth/interfaces/active-user.interface';
import { CreateTagDto } from 'src/tags/dtos/create-tag.dto';

@Injectable()
export class CreatePostProvider {
  constructor(
    private readonly usersService: UsersService,
    /**
     * Injecting Post Repository
     */
    @InjectRepository(Post)
    private readonly postsRepository: Repository<Post>,

    /**
     * Inject Tag Service
     */
    private readonly tagService: TagsService,
  ) {}
  public async createPost(createPostDto: CreatePostDto, user: IActiveUser) {
    const author = await this.usersService.findUserById(user.sub);
    let tags: CreateTagDto[] = [];
    if (createPostDto.tags) {
      tags = await this.tagService.findMultipleTags(createPostDto.tags);
    }

    let newPost: Post | null = null;

    // ৩. Create Post
    if (author) {
      newPost = this.postsRepository.create({
        ...createPostDto,
        author: author,
        tags: tags,
      });
    }

    if (newPost) {
      const result = await this.postsRepository.save(newPost);
      return result;
    }

    return null;
  }
}
