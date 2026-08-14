import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { PostsService } from './providers/posts.service';
import { CreatePostDto } from './dtos/create-post.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PatchPostDTO } from './dtos/patch-post.dto';
import { GetPostsDto } from './dtos/get-posts.dto';
import { ActiveUser } from 'src/auth/decorators/active-user.decorator';
import type { IActiveUser } from 'src/auth/interfaces/active-user.interface';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  public getAllPosts(@Query() GetALlPostsQuery: GetPostsDto) {
    console.log('Checking Query=================>', GetALlPostsQuery);
    return this.postsService.findAllPosts(GetALlPostsQuery);
  }

  @ApiOperation({
    summary: 'Create a new blog post',
  })
  @ApiResponse({
    status: 201,
    description: 'You get a 201 response if your post is created successfully',
  })
  @Post()
  public createPost(
    @Body() createPostDto: CreatePostDto,
    @ActiveUser() user: IActiveUser,
  ) {
    console.log('Active User', user);
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
  public deletePost(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.deletePost(id);
  }
}
