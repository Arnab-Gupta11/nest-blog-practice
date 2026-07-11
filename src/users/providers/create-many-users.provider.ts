import { ConflictException, Injectable, RequestTimeoutException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { CreateManyUsersDto } from '../dtos/create-many-users.dto';
import { User } from '../user.entity';

@Injectable()
export class CreateManyUsersProvider {
  constructor(
    /**
     * Inject Datasource for transaction
     */
    private readonly dataSourse: DataSource
  ){}

  public async createManyUser(createManyUserDto: CreateManyUsersDto){
    
    const newUsers: User[]=[];

    //Create query runner instance
    const queryRunner= this.dataSourse.createQueryRunner();

    try {

      //Connect queryRunner to datasource
      await queryRunner.connect();

      //Start transaction
      await queryRunner.startTransaction();

    } catch (error) {
      console.log(error);
      throw new RequestTimeoutException('Could not connect to the database');
    }

    try {

      for(const user of createManyUserDto.users){
        const newUser = queryRunner.manager.create(User,user);
        const result= await queryRunner.manager.save(newUser);
        newUsers.push(result);
      }

      //If Successfully commit
      await queryRunner.commitTransaction();
      
    } catch (error) {

     //If unsuccessfull rollback
     await queryRunner.rollbackTransaction();
     throw new ConflictException('Could not complete the transaction',{
      description: String(error)
     })
     
    } finally{

      try {

       //Release Connsection
       await queryRunner.release(); 

      } catch (error) {

       // eslint-disable-next-line no-unsafe-finally
       throw new RequestTimeoutException('Could not release the connection',{
        description: String(error),
       }) 

      }
    }

    return newUsers;

  }

}

