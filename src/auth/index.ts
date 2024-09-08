import prismaClient from "@/lib/prisma"
import { PrismaAdapter } from "@auth/prisma-adapter"
import type { Provider } from "next-auth/providers"
import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { z } from "zod"

export const schema = z.object({
  email: z.string({ required_error: "Email is required" })
      .min(1, "Email is required")
      .email("Invalid email"),
  password: z.string({ required_error: "Password is required" })
      .min(1, "Password is required")
      .min(8, "Password must be more than 8 characters")
      .max(32, "Password must be less than 32 characters"),
})
export type Schema = z.infer<typeof schema>

const providers: Provider[] = [
  Credentials({
    name: "Email",
    credentials: {
      email: {
        label: "Email"
      },
      password: {
        label: "Password"
      }
    },
    // auth function
    async authorize(creds) {
      try {
        if (typeof process.env.NUM_ROUNDS === "undefined") {
          throw new Error("NUM_ROUNDS is not defined in the environment variables")
        }

        const email = creds.email as string
        const password = creds.password as string

        let user = await prismaClient.user.findFirst({
          where: {
            email: email
          }
        });

        if (!user) {
          // TODO: new user registration
          throw new Error("No user found with this email")
        }

        // if the user registered with google, then we don't need to check password
        if (!user.pwdHash) {
          throw new Error("No password found for this user. Try another login method")
        }

        // TODO: send a verification mail
        // // if the user isn't verified, then we don't need to check password
        // if (!user.emailVerified) {
        //   throw new Error("Please verify your account. Check your mail for verification mail")
        // }

        const isSame = await bcrypt.compare(password, user.pwdHash)
        if (isSame) {
          console.log("Login successful")
          return user
        } else {
          throw new Error("Invalid Password")
        }

      } catch (error: any) {
        throw new Error(error)
      }
    },
  })
]

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers,
  adapter: PrismaAdapter(prismaClient),
  session: {
    strategy: "jwt"
  },
  callbacks: {
    async jwt({ token, user }) {
      return token
    },
    async session({ session, token }) {
      return session
    }
  }
})
