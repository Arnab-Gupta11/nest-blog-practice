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
      * Get meta option details along with post.
      */  
    // const result= await this.postsRepository.find({
    //   relations:{
    //     metaOptions:true
    //   }
    // })
    const result= await this.postsRepository.find()
    return result;
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
  /**
   * Create Post . 
   */
  public async createPost(createPostDto: CreatePostDto) { 
    //Create Post
    const newPost = this.postsRepository.create(createPostDto);
    const result = await this.postsRepository.save(newPost);
    return result;
  }
}
