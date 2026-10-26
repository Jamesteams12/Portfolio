import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  providers: [
    Credentials({
      credentials: {
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const adminPassword = process.env.ADMIN_PASSWORD;

        if (
          !adminPassword ||
          typeof credentials.password !== "string" ||
          credentials.password !== adminPassword
        ) {
          return null;
        }

        return { id: "admin", name: "Admin" };
      },
    }),
  ],
});
