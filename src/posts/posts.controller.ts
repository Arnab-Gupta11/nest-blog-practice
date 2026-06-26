import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { PostsService } from './providers/posts.service';
import { CreatePostDto } from './dtos/create-post.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PatchPostDTO } from './dtos/patch-post.dto';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  public getPostById() {
    return this.postsService.findAllPosts();
  }

  @ApiOperation({
    summary: 'Create a new blog post',
  })
  @ApiResponse({
    status: 201,
    description: 'You get a 201 response if your post is created successfully',
  })
  @Post()
  public createPost(@Body() createPostDto: CreatePostDto) {
    return this.postsService.createPost(createPostDto);
  }

  @ApiOperation({
    summary: 'Update blog post',
  })
  @ApiResponse({
    status: 201,
    description: 'You get a 200 response if your blog is updated successfully',
  })
  @Patch()
  public updatePost(@Body() patchPostDto: PatchPostDTO) {
    return this.postsService.updatePost(patchPostDto);
  }

  @Delete('/:id')
  public deletePost(@Param('id',ParseIntPipe) id: number) {
    return this.postsService.deletePost(id);
  }

}
