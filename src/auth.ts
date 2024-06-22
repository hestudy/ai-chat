import NextAuth from "next-auth";
import credentials from "next-auth/providers/credentials";
import { tryit } from "radash";
import { db } from "./db";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        const user = await db.getInstance().prisma.user.findFirst({
          where: {
            email: credentials.email as string,
          },
        });
        if (user) {
        }
        return null;
      },
    }),
  ],
});
