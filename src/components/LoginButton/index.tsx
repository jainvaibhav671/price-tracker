"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import * as Dialog from "@/components/ui/dialog"
import LoginForm from "./LoginForm"
import { useSession } from "next-auth/react"
import UserDropdown from "./UserDropdown"
import { useLoginModal } from "@/lib/store"

export default function LoginButton() {

  const { isOpen, setIsOpen, closeModal } = useLoginModal()

  const session = useSession()
  const [isSignedIn, setIsSignedIn] = useState(false)

  useEffect(() => {
    console.log(session.status)
    setIsSignedIn(session.status === "authenticated")
  }, [session.status])

  const callbackFn = (signedIn: boolean) => {
    closeModal()
    setIsSignedIn(signedIn)
  }

  return <>
    {isSignedIn
      ? <UserDropdown callbackFn={callbackFn} />
      : <Dialog.Dialog open={isOpen} onOpenChange={setIsOpen}>
        <Dialog.DialogTrigger asChild><Button type="button">Login</Button></Dialog.DialogTrigger>
        <Dialog.DialogContent className='p-6'>
          <Dialog.DialogHeader className='flex flex-row items-start gap-4 mr-8'>
            <Image src="/assets/icons/logo.svg" alt="logo" className='mt-2' width={28} height={28} />
            <div>
              <Dialog.DialogTitle className='text-xl'>Manage and check all your tracked products</Dialog.DialogTitle>
              <Dialog.DialogDescription className="text-md mt-2">
                Never miss a bargain with our timely alerts
              </Dialog.DialogDescription>
            </div>
          </Dialog.DialogHeader>
          <LoginForm callbackFn={callbackFn} />
        </Dialog.DialogContent>
      </Dialog.Dialog>
    }
  </>
}
