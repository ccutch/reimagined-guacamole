import NextAuth, { type NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import DiscordProvider from "next-auth/providers/discord";
import CredentialsProvider from "next-auth/providers/credentials"

// Prisma adapter for NextAuth, optional and can be removed
import { PrismaAdapter } from "@next-auth/prisma-adapter";

import { env } from "../../../env/server.mjs";
import { prisma } from "../../../server/db/client";

export const authOptions: NextAuthOptions = {
  // Include user.id on session
  callbacks: {
    session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    },
  },
  // Configure one or more authentication providers
  adapter: PrismaAdapter(prisma),
  providers: [
    GithubProvider({
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
    }),
    DiscordProvider({
      clientId: env.DISCORD_CLIENT_ID,
      clientSecret: env.DISCORD_CLIENT_SECRET
    }),
    CredentialsProvider({
      id: "credential-login",
      name: 'Credentials',
      credentials: {
        username: { label: "Username", type: "text"},
        password: {  label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        if (credentials?.username && credentials?.password === env.CREDENTIAL_PASSWORD) {
          return {
            id: credentials.username,
            name: "Connor",
            email: "connormccutcheon95@gmail.com",
            image: "https://robohash.org/ccutch"
          }
        }
        return null
      }
    })
  ],
};

export default NextAuth(authOptions);
