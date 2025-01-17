'use server';

import crypto from 'node:crypto';
import prisma from 'src/services/prisma';
import withServerAction from 'src/lib/server/middware/with-server-action';
import { ServerActionError } from 'src/lib/server/error';
import { TServerActionContext } from 'src/types/server/server-action';
import * as ServerAction from 'src/constants/server-action';
// ----------------------------------------------------------------------

const HashPassword = (password: string) => {
  const salt = 'jh2op$Fmpt6XdMRQ&FfPbp78@Yt2eP8BEeM';
  password = salt + password.trim();
  return crypto.createHash('md5').update(password).digest('hex');
}

export const login = withServerAction(ServerAction.USER_LOGIN, async (context: TServerActionContext, username: string, password: string) => {
  const user = await prisma.user.findFirst({
    select: {
      awatar: true,
      username: true,
      email: true,
      id: true,
    },
    where: {
      username,
      password: HashPassword(password),
    },
  });
  // if user doesn't exist or password doesn't match
  if (!user) {
    throw new ServerActionError('INVALID_USERNAME_OR_PASSWORD');
  }

  return {
    ...user,
    id: String(user.id),
  };
})

export const getUserInfo = withServerAction(ServerAction.USER_GET_INFO, async (context: TServerActionContext) => {
  const userId = context.session?.id
  const user = await prisma.user.findFirst({
    select: {
      awatar: true,
      username: true,
      email: true,
      id: true,
    },
    where: {
      id: userId
    },
  });
  // if user doesn't exist or password doesn't match
  if (!user) {
    throw new ServerActionError('INVALID_USERNAME_OR_PASSWORD');
  }

  return {
    ...user,
    id: String(user.id),
  };
})


