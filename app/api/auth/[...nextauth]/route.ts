import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import postgres from 'postgres';
import bcrypt from 'bcryptjs';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

const handler = NextAuth({
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'text' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials: Record<'email' | 'password', string> | undefined) {
                if (!credentials?.email || !credentials?.password) return null;

                const users = await sql<{ id: string; email: string; password: string }[]>`
          SELECT id, email, password FROM users WHERE email = ${credentials.email}
        `;

                const user = users[0];
                if (!user) return null;

                const isValid = await bcrypt.compare(credentials.password, user.password);
                if (!isValid) return null;

                return {
                    id: user.id,
                    email: user.email,
                };
            },
        }),
    ],
    pages: {
        signIn: '/login',
    },
    session: {
        strategy: 'jwt',
    },
    secret: process.env.AUTH_SECRET,
});

export { handler as GET, handler as POST };
