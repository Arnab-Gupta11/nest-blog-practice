import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt } from 'class-validator';

export class GetUserParamsDTO {
  @ApiProperty({
    description: 'Get User with a specific id',
    example: 1234,
    required: true,
  })
  @IsInt()
  @Type(() => Number)
  id: number;
}
