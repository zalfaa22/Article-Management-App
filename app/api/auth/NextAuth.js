import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from '../../../lib/axios';

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      async authorize(credentials) {
        try {
          const user = await axios.post('/api/auth/login', {
            username: credentials.username,
            password: credentials.password,
          });
          return user.data;
        } catch (error) {
          throw new Error(error.response.data.message);
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.role = token.role;
      return session;
    }
  }
});
