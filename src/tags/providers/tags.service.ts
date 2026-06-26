import { Injectable } from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { Tag } from '../tag.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTagDto } from '../dtos/create-tag.dto';

@Injectable()
export class TagsService {
  constructor(
    /**
     * Inject Tag Repository.
     */
    @InjectRepository(Tag)
    private readonly tagRepository:Repository<Tag>
  ){}

  //Create Tag
  public async createTag(createTagDto:CreateTagDto){
    const result= this.tagRepository.create(createTagDto);
    return await this.tagRepository.save(result);
  }

  // Get Multiple tags by Id 
  public async findMultipleTags(tag:number[]){
    const result = this.tagRepository.find({
      where:{
        id:In(tag)
      }
    })
    
    return result;


  }

  //Delete tag
  public async deleteTag(id:number){
    const result= await this.tagRepository.delete(id);
    return result;
  }



}
