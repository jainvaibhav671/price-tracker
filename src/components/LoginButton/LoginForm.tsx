import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { KeyRound, Mail } from "lucide-react"
import { useState } from "react"
import { login, register } from "@/lib/actions/auth"
import { type Schema, schema } from "@/auth"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"

type Props = {
    callbackFn: (signedIn: boolean) => void
}

export default function LoginForm({ callbackFn }: Props) {
    const { toast } = useToast()
    const [formType, setFormType] = useState<"Login" | "Register">("Login")
    const switchForm = () => setFormType(formType === "Login" ? "Register" : "Login")

    const router = useRouter()
    const form = useForm<Schema>({
        resolver: zodResolver(schema),
        defaultValues: {
            email: "",
            password: ""
        }
    })

    const onSubmit = form.handleSubmit(async (data) => {
        console.log("data", data)

        let message;

        // register and login
        if (formType === "Register") message = await register(data)
        else message = await login(data)

        console.log("message", message)
        if (message) {
            toast({
                description: message.message
            })
        } else router.refresh()
        callbackFn(message == null)
    })

    return <Form {...form}>
        <form onSubmit={onSubmit} className='space-y-8 mt-4'>
            <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel className="text-md font-semibold">Email</FormLabel>
                        <div className="flex gap-2 justify-center items-center border rounded-lg px-3 py-2">
                            <Mail height={18} width={18} />
                            <FormControl>
                                <Input className="bg-background/30" type="email" placeholder="Enter your email" {...field} />
                            </FormControl>
                        </div>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel className="text-md font-semibold">Password</FormLabel>
                        <div className="flex gap-2 justify-center items-center border rounded-lg px-3 py-2">
                            <KeyRound height={18} width={18} />
                            <FormControl>
                                <Input className="bg-background/30" type="password" placeholder="Password" {...field} />
                            </FormControl>
                        </div>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <div className="flex flex-col gap-2">
                <Button type="submit">{formType}</Button>
                <p>Don&apos;t have an account? <span onClick={switchForm} className="underline underline-offset-2 cursor-pointer text-blue-500">{formType === "Login" ? "Register" : "Login"}</span></p>
            </div>
        </form>
    </Form>
}
