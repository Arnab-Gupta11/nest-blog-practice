import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/providers/users.service';
import { Post } from '../post.entity';
import { Repository } from 'typeorm';
import { TagsService } from 'src/tags/providers/tags.service';
import { CreatePostDto } from '../dtos/create-post.dto';
import { IActiveUser } from 'src/auth/interfaces/active-user.interface';
import { CreateTagDto } from 'src/tags/dtos/create-tag.dto';
import { User } from 'src/users/user.entity';

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
    let tags: CreateTagDto[] = [];
    let author: User | null = null;
    try {
      author = await this.usersService.findUserById(user.sub);
      if (createPostDto.tags) {
        tags = await this.tagService.findMultipleTags(createPostDto.tags);
      }
    } catch (error) {
      throw new ConflictException(error);
    }

    if (createPostDto.tags?.length !== tags.length) {
      throw new BadRequestException('please check your tag IDs');
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
      try {
        const result = await this.postsRepository.save(newPost);
        return result;
      } catch (error) {
        throw new ConflictException(error, {
          description: 'Ensure post slug is unique and not a duplicate.',
        });
      }
    }

    // return null;
  }
}
