import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { IActiveUser } from '../interfaces/active-user.interface';
import { REQUEST_USER_KEY } from '../constants/auth.constants';

export const ActiveUser = createParamDecorator<keyof IActiveUser | undefined>(
  (field: keyof IActiveUser | undefined, ctx: ExecutionContext) => {
    const request = ctx
      .switchToHttp()
      .getRequest<{ [REQUEST_USER_KEY]?: IActiveUser }>();

    const user = request[REQUEST_USER_KEY];

    return field ? user?.[field] : user;
  },
);
