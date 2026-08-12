/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { GetUserParamsDTO } from './dtos/get-users-params.dto';
import { UpdateUserDto } from './dtos/update-user-dto';
import { UsersService } from './providers/users.service';
import { ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import type { ConfigType } from '@nestjs/config';
import profileConfig from './config/profile.config';
import { CreateManyUsersDto } from './dtos/create-many-users.dto';
import { AccessTokenGuard } from 'src/auth/guards/access-token/access-token.guard';
// import { ConfigService } from '@nestjs/config';

@Controller('users')
export class UsersController {
  constructor(
    // private readonly configService: ConfigService,   //Alternative way to use env with configService
    private readonly usersService: UsersService,

    @Inject(profileConfig.KEY)
    private readonly profileConfiguration: ConfigType<typeof profileConfig>,
  ) {}
  @Get()
  @ApiOperation({
    summary: 'Fetches a list of registered users on the application',
  })
  @ApiResponse({
    status: 200,
    description: 'Users fetch successfully based on the query.',
  })
  @ApiQuery({
    name: 'page',
    type: 'number',
    required: false,
    description:
      'The position of the page number that you want the API to return.',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    type: 'number',
    required: false,
    description: 'The number of entries required per query',
    example: 10,
  })
  getUsers(
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
  ) {
    // const environment = this.configService.get<string>('NODE_ENV');
    // console.log(environment);
    console.log(this.profileConfiguration);
    console.log(this.profileConfiguration.apiKey);
    return this.usersService.findAllUsers();
  }

  @Get('/:id')
  getSingleUsers(@Param() getUserParams: GetUserParamsDTO) {
    console.log(getUserParams);
    return `Limit is ${getUserParams.id}`;
  }

  @Post()
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  @UseGuards(AccessTokenGuard)
  @Post('/create-many')
  createManyUsers(@Body() createManyUsersDto: CreateManyUsersDto) {
    return this.usersService.createManyUser(createManyUsersDto);
  }

  @Patch()
  updateUser(@Body() updateUserDto: UpdateUserDto) {
    return updateUserDto;
  }
}
