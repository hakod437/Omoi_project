/**
 * NextAuth.js Configuration
 *
 * Authentication configuration for AnimeVault
 *
 * @module lib/auth
 */

console.log('[NEXTAUTH] 🔧 Loading NextAuth.js configuration...');

import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { prisma } from './prisma'
import bcrypt from 'bcryptjs'

console.log('[NEXTAUTH] ✅ Dependencies loaded successfully');

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        phoneNumber: {
          label: 'Numéro de téléphone',
          type: 'tel',
          placeholder: '0612345678'
        },
        password: {
          label: 'Mot de passe',
          type: 'password'
        }
      },
      async authorize(credentials) {
        console.log('[NEXTAUTH] 🔐 Authorize function called with credentials:', {
          hasPhoneNumber: !!credentials?.phoneNumber,
          hasPassword: !!credentials?.password,
          phoneNumberLength: credentials?.phoneNumber?.length
        });

        if (!credentials?.phoneNumber || !credentials?.password) {
          console.log('[NEXTAUTH] ❌ Missing credentials');
          return null
        }

        try {
          console.log('[NEXTAUTH] 🔍 Looking up user by phoneNumber:', credentials.phoneNumber);

          // Find user by phone number
          const user = await prisma.user.findUnique({
            where: {
              phoneNumber: credentials.phoneNumber
            }
          })

          if (!user) {
            console.log('[NEXTAUTH] ❌ User not found for phoneNumber:', credentials.phoneNumber)
            return null
          }

          console.log('[NEXTAUTH] ✅ User found:', {
            id: user.id,
            displayName: user.displayName,
            hasPassword: !!user.password
          });

          // Verify password
          console.log('[NEXTAUTH] 🔑 Verifying password...');
          const isPasswordValid = await bcrypt.compare(credentials.password, user.password || '')

          if (!isPasswordValid) {
            console.log('[NEXTAUTH] ❌ Invalid password for user:', user.id)
            return null
          }

          console.log('[NEXTAUTH] ✅ Password valid, authentication successful for user:', user.id)

          // Return user object without password
          return {
            id: user.id,
            email: user.email,
            name: user.displayName || user.username,
            phoneNumber: user.phoneNumber,
            image: user.avatar
          }
        } catch (error) {
          console.error('[NEXTAUTH] 💥 Authentication error:', error)
          return null
        }
      }
    })
  ],
  session: {
    strategy: 'jwt'
  },
  pages: {
    signIn: '/test-layout',
    signOut: '/test-layout'
  },
  callbacks: {
    async jwt({ token, user }: { token: any; user: any }) {
      if (user) {
        token.phoneNumber = user.phoneNumber
      }
      return token
    },
    async session({ session, token }: { session: any; token: any }) {
      if (token) {
        session.user.id = token.sub!
        session.user.phoneNumber = token.phoneNumber as string
      }
      return session
    }
  },
  debug: process.env.NODE_ENV === 'development'
}
