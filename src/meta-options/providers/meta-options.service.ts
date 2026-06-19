import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MetaOption } from '../meta-option.entity';
import { Repository } from 'typeorm';
import { CreatePostMetaOptionsDto } from '../dtos/create-post-meta-options.dto';

@Injectable()
export class MetaOptionsService {
  constructor(
    @InjectRepository(MetaOption)
    private readonly metaOptionsRepository: Repository<MetaOption>,
  ) {}

  public async createMetaOption(createMetaOptionDto: CreatePostMetaOptionsDto) {
    const newMetaOption =
      this.metaOptionsRepository.create(createMetaOptionDto);
    const result = await this.metaOptionsRepository.save(newMetaOption);
    return result;
  }
}
