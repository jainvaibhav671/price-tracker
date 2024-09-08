"use server"

import { signIn, signOut, type Schema } from "@/auth"
import prismaClient from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function register(values: Schema) {
    try {
        const { email, password } = values

        console.log("Registering", email)
        if (typeof process.env.NUM_ROUNDS === "undefined") throw new Error("NUM_ROUNDS is not defined in the environment variables")

        console.log("register", email, password)

        // check if user already exists
        const count = await prismaClient.user.count({ where: { email: email }})
        if (count != 0) return { message: "A user is already registered with this email. Please login" }

        // generate a hashed password and create the User
        const user = await prismaClient.user.create({
            data: {
                email: email,
                pwdHash: await bcrypt.hash(password, parseInt(process.env.NUM_ROUNDS))
            }
        })

        console.log("Registered", user)
        return {
            message: "Registered successfully"
        }

    } catch (error: any) {
        console.log(error.message)
        return {
            message: "Something went wrong"
        }
    }
}

export async function login(values: Schema) {
    try {
        // console.log("Signing in", formData.get("email"))
        console.log("login", values)

        // formData.forEach((value, key) => console.log(key, value))

        await signIn("credentials", {
            redirect: false,
            ...values
        })

        return null
    } catch (error: any) {
        console.log(error.messsage)
        console.log(error)
        return {
            message: "Something went wrong"
        }
    }
}

export async function logout() {
    try {
        await signOut({ redirect: false })
        console.log("Logged out")

        return {
            message: "Logged out successfully"
        }
    } catch (error) {
        console.log(error)
        return {
            message: "Something went wrong"
        }
    }
}

export async function getUserData(userEmail: string) {
    try {
        const userData = await prismaClient.user.findFirst({
            where: {
                email: userEmail
            },
            include: {
                products: true
            }
        })

        if (!userData) return { message: "User not found" }

        return userData
    } catch (error: any) {
        console.log("getUserData: ", error)
        return {
            message: "Something went wrong"
        }
    }
}
