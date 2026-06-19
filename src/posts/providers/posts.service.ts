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
  // ১. চেক করা হচ্ছে লেখক (Author) ডাটাবেজে আছেন কিনা
  const author = await this.usersService.findUserById(createPostDto.authorId);
  
  // Type Safety-এর জন্য পোস্ট ভেরিয়েবলটি আগে থেকেই Post টাইপ অথবা null হিসেবে ডিক্লেয়ার করা হলো
  let newPost: Post | null = null; 

  // ২. dto থেকে authorId আলাদা করে নেওয়া হচ্ছে যেন টাইপ মিসম্যাচ না হয়
  // const { authorId, ...postDetails } = createPostDto;

  // ৩. Create Post
  if (author) {
    newPost = this.postsRepository.create({
      ...createPostDto, 
      author: author
    });
  }

  // ৪. Save Post (newPost যদি null না হয়, তবেই সেভ হবে)
  if (newPost) {
    const result = await this.postsRepository.save(newPost);
    return result;
  }

  return null; // author না পাওয়া গেলে null রিটার্ন করবে
}

  public async deletePost(id:number){
    const result= await this.postsRepository.delete(id);
    return result;
  }



}
