import {
  Body,
  Controller,
  Delete,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { TagsService } from './providers/tags.service';
import { CreateTagDto } from './dtos/create-tag.dto';

@Controller('tags')
export class TagsController {
  constructor(
    /**
     * Inject Tag Service
     */
    private readonly tagService: TagsService,
  ) {}

  @Post()
  public async createTag(@Body() createTagDto: CreateTagDto) {
    const result = await this.tagService.createTag(createTagDto);
    return result;
  }

  @Delete('/:id')
  public deletePost(@Param('id', ParseIntPipe) id: number) {
    return this.tagService.deleteTag(id);
  }
}
