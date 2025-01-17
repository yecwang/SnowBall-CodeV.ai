import NextAuth, { User, type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

// routes
import { paths } from 'src/routes/paths';

// server actions
import { login } from 'src/services/server-actions/user/user';

//
import { JWT_TOKEN_KEY } from 'src/services/config';
import { prepareContext } from 'src/lib/server/middware/with-server-action';
import { TLanguages } from "src/types/locale/locales";

const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
        language: { label: "Language", type: "text" }
      },
      async authorize(credentials): Promise<User | null> {
        const { username, password, language } = credentials ?? {}
        if (!username) {
          throw new Error("Please enter your username");
        }
        if (!password) 
        {
          throw new Error("Please enter your password");
        }

        const lan = language as TLanguages
        const loginResult = await login(prepareContext(lan), username, password);
        if (loginResult.error) {
          throw new Error(loginResult.error.message);
        }
        return loginResult.data;
      },
    }),
  ],
  pages: {
    signIn: paths.auth.jwt.login,
  },
  session: {
    strategy: 'jwt',
  },
  jwt: {
    secret: JWT_TOKEN_KEY,
    maxAge: Number(process.env.JWT_TOKEN_EXPIRES),
  },
  debug: true,
  callbacks: {
    async jwt(params) {
      const { token, account, user } = params;
      if (account) {
        token.user = user;
      }
      return token
    },

    async session(params) {
      const { session, token } = params;
      session.user = {
        ...session.user,
        ...(token.user || {}),
      };
      return session;
    },
  }
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
