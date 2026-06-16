import NextAuth from 'next-auth';
import AzureADProvider from 'next-auth/providers/azure-ad';
import CredentialsProvider from 'next-auth/providers/credentials';

const handler = NextAuth({
  providers: [
    AzureADProvider({
      clientId: process.env.VITE_AZURE_CLIENT_ID || 'placeholder',
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET || 'placeholder',
      tenantId: process.env.VITE_AZURE_TENANT_ID || 'common',
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (
          process.env.NEXT_PUBLIC_MOCK_AUTH === 'true' &&
          credentials?.username === 'admin' &&
          credentials?.password === 'admin123'
        ) {
          return { id: '1', name: 'Admin User', email: 'admin@example.com' };
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      // Persist the OAuth access_token to the token right after signin
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }: any) {
      // Send properties to the client, like an access_token from a provider.
      session.accessToken = token.accessToken;
      return session;
    },
  },
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
  },
});

export { handler as GET, handler as POST };
