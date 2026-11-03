import NextAuth, { CredentialsSignin } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { authConfig } from "./auth.config";
import { getUserByEmail } from "@/lib/data";

const credentialsSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(6),
});

export const githubEnabled = Boolean(
  process.env.AUTH_GITHUB_ID && process.env.AUTH_GITHUB_SECRET,
);

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: { email: {}, password: {} },
      async authorize(raw) {
        const parsed = credentialsSchema.safeParse(raw);
        if (!parsed.success) throw new CredentialsSignin();
        const user = await getUserByEmail(parsed.data.email);
        if (!user || !(await bcrypt.compare(parsed.data.password, user.passwordHash))) {
          throw new CredentialsSignin();
        }
        return { id: user.id, name: user.name, email: user.email, role: user.role };
      },
    }),
    ...(githubEnabled
      ? [
          GitHub({
            // login bằng github mặc định là user
            profile(profile) {
              return {
                id: String(profile.id),
                name: profile.name ?? profile.login,
                email: profile.email,
                image: profile.avatar_url,
                role: "user" as const,
              };
            },
          }),
        ]
      : []),
  ],
});
