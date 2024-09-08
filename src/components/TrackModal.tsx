"use client"

import { addUserEmailToProduct } from '@/lib/actions'
import Image from 'next/image'
import { useState } from 'react'
import { Button } from './ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { useLoginModal } from '@/lib/store'
import { User } from 'next-auth'
import { User as PrismaUser } from '@prisma/client'
import { getUserData } from '@/lib/actions/auth'

type Props = {
  productId: string;
  user: User
}

export default function TrackModal({ user, productId }: Props) {
  let [isOpen, setIsOpen] = useState(false)
  const { openModal } = useLoginModal()

  const toggleOpen = () => setIsOpen(!isOpen)
  const closeModal = () => setIsOpen(false)

  const handleSubmit = async () => {
    if (typeof user === "undefined") {
      openModal()
      return
    }

    const userData = await getUserData(user.email!)

    // @ts-ignore
    if (typeof userData.message != "undefined") {
      return;
    }

    await addUserEmailToProduct(productId, userData as PrismaUser)
    closeModal()
  }

  return (
    <>
      <Dialog onOpenChange={toggleOpen} open={isOpen}>
        <DialogTrigger asChild>
          <Button variant="secondary" type="button">Track</Button>
        </DialogTrigger>
        <DialogContent className=''>
          <DialogHeader className='flex flex-row items-start gap-4 mr-8'>
            <Image src="/assets/icons/logo.svg" alt="logo" className='mt-2' width={28} height={28} />
            <div>
              <DialogTitle className='text-xl'>Stay updated with product pricing alerts right in your inbox!</DialogTitle>
              <DialogDescription className="text-md mt-2">
                Never miss a bargain with our timely alerts
              </DialogDescription>
            </div>
          </DialogHeader>
          <Button onClick={handleSubmit}>Track</Button>
        </DialogContent>
      </Dialog>
    </>
  )
}
