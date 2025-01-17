'use client'

import withIntercept from 'src/lib/client/interceptor'
import * as User from './user'


export const login = withIntercept(User.login)
export const getUserInfo = withIntercept(User.getUserInfo)


