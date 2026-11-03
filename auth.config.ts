import type { NextAuthConfig } from "next-auth";

// dùng chung với middleware (edge) nên không import fs, bcrypt
export const authConfig = {
  pages: { signIn: "/login" },
  session: { strategy: "jwt" },
  providers: [],
  callbacks: {
    jwt({ token, user, account }) {
      if (user) {
        // login github thì user.id bị random mỗi lần nên lấy id github
        token.id = account?.type === "oauth" ? `${account.provider}-${account.providerAccountId}` : user.id!;
        token.role = user.role;
      }
      return token;
    },
    session({ session, token }) {
      session.user.id = token.id;
      session.user.role = token.role;
      return session;
    },
  },
} satisfies NextAuthConfig;
