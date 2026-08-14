import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
// import { Observable } from 'rxjs';
import { AccessTokenGuard } from '../access-token/access-token.guard';
import { AuthType } from 'src/auth/enums/auth-type.enum';
import { AUTH_TYPE_KEY } from 'src/auth/constants/auth.constants';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  //Set defautl auth type
  private static readonly defaultAuthType = AuthType.Bearer;
  private authTypeGuardMap: Record<AuthType, CanActivate | CanActivate[]>;

  constructor(
    private readonly reflector: Reflector,
    private readonly accessTokenGuard: AccessTokenGuard,
  ) {
    this.authTypeGuardMap = {
      [AuthType.Bearer]: this.accessTokenGuard,
      [AuthType.None]: { canActivate: () => true },
    };
  }
  async canActivate(context: ExecutionContext): Promise<boolean> {
    console.log('AUTH_TYPE_GUARD_MAPPING===>', this.authTypeGuardMap);

    //authType from reflector

    const authTypes = this.reflector.getAllAndOverride<AuthType[]>(
      AUTH_TYPE_KEY,
      [context.getHandler(), context.getClass()],
    ) ?? [AuthenticationGuard.defaultAuthType];
    console.log('AUTH_TYPES===>', authTypes);

    //Array of guards
    const guards = authTypes.map((type) => this.authTypeGuardMap[type]).flat();
    console.log('ALL GUARDS===>', guards);

    //Default error
    let error: Error = new UnauthorizedException();

    //Loop Guards canActivate
    for (const instance of guards) {
      console.log('Instances===>', instance);
      const canActivate = await Promise.resolve(
        instance.canActivate(context),
      ).catch((err: unknown) => {
        error = err instanceof Error ? err : new UnauthorizedException(err);
      });
      console.log('CANACTIVATED===>', canActivate);
      if (canActivate) {
        return true;
      }
    }

    throw error;
  }
}
