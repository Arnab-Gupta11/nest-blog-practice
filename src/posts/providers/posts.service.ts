import { PatchPostDTO } from './../dtos/patch-post.dto';
import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/providers/users.service';
import { CreatePostDto } from '../dtos/create-post.dto';
import { Repository } from 'typeorm';
import { Post } from '../post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTagDto } from 'src/tags/dtos/create-tag.dto';
import { TagsService } from 'src/tags/providers/tags.service';
import { Tag } from 'src/tags/tag.entity';

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
     * Inject Tag Service
     */
    private readonly tagService: TagsService,
  ) {}

  /**
   *  Get All Post
   */
  public async findAllPosts() {
    /**
     * Get meta option and author details along with post. ====> Best prctice
     */
    const result = await this.postsRepository.find({
      relations: {
        // metaOptions:true,
        // author:true,
        tags: true,
      },
    });
    return result;
  }

  // public findPostById(userId: string) {
  //   const user = this.usersService.findUserById(userId);
  //   console.log('Found User', user);
  //   if (!user) {
  //     return {
  //       message: 'Post With this user not exist.',
  //     };
  //   }
  //   return {
  //     user,
  //     id: 1,
  //     name: 'Rahim',
  //   };
  // }

  /**
   * Create Post .
   */
  public async createPost(createPostDto: CreatePostDto) {
    const author = await this.usersService.findUserById(createPostDto.authorId);
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

  /**
   * Update Post.
   */
  public async updatePost(patchPostDto: PatchPostDTO) {
    //Find the Tags
    let tags: Tag[] | undefined = undefined;
    if (patchPostDto.tags) {
      tags = await this.tagService.findMultipleTags(patchPostDto.tags);
    }

    //Find the Post
    const post= await this.postsRepository.findOneBy({
      id:patchPostDto.id
    }) 

    //Update the Properties.
    if(post){
      post.title= patchPostDto.title ?? post?.title;
      post.content= patchPostDto.content ?? post?.content;
      post.status=patchPostDto.status ?? post.status;
      post.tags= tags && tags;

      return await this.postsRepository.save(post);
    }

    // ===============TODO================
    /**
     * Alternative way
     // ২. preload ব্যবহার করে অবজেক্ট মার্জ করুন
  const post = await this.postsRepository.preload({
    ...patchPostDto,
    ...(tags && { tags }), // যদি tags থাকে তবেই অবজেক্টে যোগ হবে
  });

  // ৩. পোস্ট না পাওয়া গেলে এক্সেপশন থ্রো করুন
  if (!post) {
    throw new NotFoundException(`Post with ID ${patchPostDto.id} not found`);
  }

  // ৪. সেভ এবং রিটার্ন
  return await this.postsRepository.save(post);
     */

    return null;
  }

  public async deletePost(id: number) {
    const result = await this.postsRepository.delete(id);
    return result;
  }
}
