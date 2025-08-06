import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from './auth.config';
import { z } from 'zod';
import type { User } from '@/app/lib/definitions';
import bcrypt from 'bcrypt';
import mysql from 'mysql2/promise';

// Helper για timestamped logs
const ts = () =>
  new Date().toLocaleString('en-EN', { timeZone: 'Europe/Athens' });

const log = (...args: any[]) => console.log(`[${ts()}]`, ...args);
const elog = (...args: any[]) => console.error(`[${ts()}]`, ...args);

// MySQL connection pool
const connectionPool = mysql.createPool({
  host: '172.16.0.96', // update as needed
  user: 'db_user', // update as needed
  password: 'userPass!', // update as needed
  database: 'app_db', // update as needed
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

async function getUser(email: string): Promise<User | undefined> {
  try {
    const conn = await connectionPool.getConnection();
    const [rows] = await conn.query<mysql.RowDataPacket[]>(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    conn.release();

    const user = rows[0] as User | undefined;
    return user;
  } catch (error) {
    elog('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
  }
}

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  callbacks: {
    ...authConfig.callbacks,
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.sub as string;
      }
      return session;
    },
  },
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          const user = await getUser(email);
          if (!user) {
            log('Invalid credentials: user not found', { email });
            return null;
          }

          const passwordsMatch = await bcrypt.compare(password, user.password);

          if (passwordsMatch) {
          console.log('\n─────── User authenticated successfully ──────\n');
          console.log(`[${ts()}]\n`);
          console.log('Id:', user.id);
          console.log('Name:', user.name);
          console.log('Email:', user.email);
          // console.log({
          //   id: user.id,
          //   name: user.name,
          //   email: user.email,
          // });
          console.log('──────────────────────────────────────────────\n');


            return {
              id: user.id,
              name: user.name,
              email: user.email,
            };
          }
        }

        log('Invalid credentials');
        return null;
      },
    }),
  ],
});
