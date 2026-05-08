import { Body, Controller, Post } from '@nestjs/common';
import { MetaOptionsService } from './providers/meta-options.service';
import { CreatePostMetaOptionsDto } from './dtos/create-post-meta-options.dto';

@Controller('meta-options')
export class MetaOptionsController {
  constructor(private readonly metaOptionsService: MetaOptionsService) {}

  /**
   * Create Meta Options
   */
  @Post()
  public createMetaOption(
    @Body() createMetaOptionDto: CreatePostMetaOptionsDto,
  ) {
    return this.metaOptionsService.createMetaOption(createMetaOptionDto);
  }
}
