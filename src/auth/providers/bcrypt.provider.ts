import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { HashingProvider } from './hashing.provider';
@Injectable()
export class BcryptProvider implements HashingProvider {
  //Create Hash Password
  public async hashPassword(data: string | Buffer): Promise<string> {
    //Generate salt
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(data, salt);
  }

  //Compare Password
  comparePassword(data: string | Buffer, encrypted: string): Promise<boolean> {
    return bcrypt.compare(data, encrypted);
  }
}
