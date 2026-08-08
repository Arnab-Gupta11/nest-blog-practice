import { IntersectionType } from '@nestjs/swagger';
import { IsDate, IsOptional } from 'class-validator';
import { PaginationQueryDto } from 'src/common/pagination/dtos/paginationQuery.dto';
class GetPostsBaseDto {
  @IsDate() @IsOptional() startDate?: Date;
  @IsDate() @IsOptional() endDate?: Date;
}
export class GetPostsDto extends IntersectionType(
  GetPostsBaseDto,
  PaginationQueryDto,
) {}
