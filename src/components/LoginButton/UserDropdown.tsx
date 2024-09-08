import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { LogOut, User2 } from "lucide-react"
import { logout } from "@/lib/actions/auth"
import Link from "next/link"

type Props = {
    callbackFn: (signedIn: boolean) => void
}


export default function UserDropdown({ callbackFn }: Props ) {

    const logOutWrapper = () => {
        logout().then(() => callbackFn(false))
    }

    return <>
        <DropdownMenu>
            <DropdownMenuTrigger asChild><Button variant={"ghost"} className="px-2" type="button"><User2 width={20} height={20} /></Button></DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem><Link href="/dashboard">Tracked Products</Link></DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logOutWrapper} className="flex gap-1"><LogOut width={20} height={20} /><span>Logout</span></DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    </>
}
