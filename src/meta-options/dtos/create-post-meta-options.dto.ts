import { ApiProperty } from '@nestjs/swagger';
import { IsJSON, IsNotEmpty } from 'class-validator';

export class CreatePostMetaOptionsDto {
  @ApiProperty({
    example: '{"sidebarEnabled": true}',
    description: 'Valid JSON string',
  })
  @IsNotEmpty()
  @IsJSON()
  metaValue: string;
}
