import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/providers/users.service';
import { CreatePostDto } from '../dtos/create-post.dto';
import { Repository } from 'typeorm';
import { Post } from '../post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { TagsService } from 'src/tags/providers/tags.service';
import { CreateTagDto } from 'src/tags/dtos/create-tag.dto';

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
    private readonly tagService:TagsService

     ) {}


  /**
   *  Get All Post
   */
  public async findAllPosts() {
     /**
      * Get meta option and author details along with post. ====> Best prctice
      */  
    // const result= await this.postsRepository.find({
    //   relations:{
    //     metaOptions:true,
    //     author:true,
    //   }
    // })
    const result= await this.postsRepository.find()
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
  let tags:CreateTagDto[]=[];
  if(createPostDto.tags){
   tags= await this.tagService.findMultipleTags(createPostDto.tags)
  }
  
  let newPost: Post | null = null; 

  // ৩. Create Post
  if (author) {
    newPost = this.postsRepository.create({
      ...createPostDto, 
      author: author,
      tags:tags
    });
  }

  if (newPost) {
    const result = await this.postsRepository.save(newPost);
    return result;
  }

  return null; 
}

  public async deletePost(id:number){
    const result= await this.postsRepository.delete(id);
    return result;
  }



}
