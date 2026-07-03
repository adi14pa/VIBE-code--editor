import NextAuth from "next-auth";

import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./lib/db";
import { getAccountByUserId, getUserById } from "./modules/auth/actions";



import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";

export const { handlers, signIn, signOut, auth } = NextAuth({
  secret: process.env.AUTH_SECRET,
  adapter: PrismaAdapter(prisma as any),  

  // callbacks: {
  //   async signIn({ user, account }) {
  //     if (!user || !account) return false;

  //     const existingUser = await prisma.user.findUnique({
  //       where: { email: user.email! },
  //     });

  //     if (!existingUser) {
  //       const newUser = await prisma.user.create({
  //         data: {
  //           email: user.email!,
  //           name: user.name,
  //           image: user.image,

  //           accounts: {
  //             create: {
  //               type: account.type,
  //               provider: account.provider,
  //               providerAccountId: account.providerAccountId,
  //               refreshToken: account.refresh_token,
  //               accessToken: account.access_token,
  //               expiresAt: account.expires_at,
  //               tokenType: account.token_type,
  //               scope: account.scope,
  //               idToken: account.id_token,
  //               sessionState:
  //                 account.session_state !== undefined
  //                   ? JSON.stringify(account.session_state)
  //                   : undefined,
  //             },
  //           },
  //         },
  //       });
  //       if (!newUser) return false;
  //     } else {
  //       const existingAccount = await prisma.account.findUnique({
  //         where: {
  //           provider_providerAccountId: {
  //             provider: account.provider,
  //             providerAccountId: account.providerAccountId,
  //           },
  //         },
  //       });

  //       if (!existingAccount) {
  //         await prisma.account.create({
  //           data: {
  //             userId: existingUser.id,
  //             provider: account.provider,
  //             type: account.type,
  //             providerAccountId: account.providerAccountId,
  //             refreshToken: account.refresh_token,
  //             accessToken: account.access_token,
  //             expiresAt: account.expires_at,
  //             tokenType: account.token_type,
  //             scope: account.scope,
  //             idToken: account.id_token,
  //             sessionState: account.session_state?.toString(),
  //           },
  //         });
  //       }
  //     }

  //     return true;
  //   },
  //   async jwt({ token }) {
  //     if (!token.sub) return token;

  //     const existingUser = await getUserById(token.sub);
  //     if (!existingUser) return token;

  //     const existingAccount = await getAccountByUserId(existingUser.id);

  //     token.name = existingUser.name;
  //     token.email = existingUser.email;
  //     token.role = existingUser.role;

  //     return token;
  //   },
  //   async session({ session, token }) {
  //     if (token.sub && session.user) {
  //       session.user.id = token.sub;
  //     }

  //     if (token.sub && session.user) {
  //       session.user.role = token.role as any;
  //     }
  //     return session;
  //   },
  // },

  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID!,
      clientSecret: process.env.AUTH_GITHUB_SECRET!,
    }),
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
  ],

  pages: {
    signIn: "/auth/sign-in",
    
  },

  debug: true,
});
