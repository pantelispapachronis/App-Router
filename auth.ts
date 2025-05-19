import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from './auth.config';
import { z } from 'zod';
import type { User } from '@/app/lib/definitions';
import bcrypt from 'bcrypt';
import mysql from 'mysql2/promise';
 
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
    console.log("Database user:", user); // Log the user data from DB
    return user;
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
  }
}
 
export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  callbacks: {
    ...authConfig.callbacks,
    async jwt({ token, user }) {
      // Include the user ID in the token
      if (user) {
        token.id = user.id;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      // Make ID available in the session
      if (session?.user) {
        session.user.id = token.sub as string;
      }
      return session;
    }
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
            if (!user) return null;
            const passwordsMatch = await bcrypt.compare(password, user.password);
   
            if (passwordsMatch) {
              // Explicitly return user with ID
              console.log("Authorized user:", { 
                id: user.id, 
                name: user.name, 
                email: user.email 
              });
              
              return {
                id: user.id,
                name: user.name,
                email: user.email
              };
            }
          }
   
          console.log('Invalid credentials');
          return null;
        },
      }),
    ],
  });