import { Heart, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import LoginButton from "@/components/LoginButton";
import { Button } from "./ui/button";
import { auth } from "@/auth";

const Navbar = async () => {

  return (
    <>
      <header className="navbar w-full">
        <nav className="flex justify-between py-8 px-16">
          <Link href="/" className="flex items-center gap-1">
            <Image
              src="/assets/icons/logo.svg"
              alt="logo"
              width={28}
              height={28}
            />
            <p className="nav-logo">
              Price<span className="text-primary">Tracker</span>
            </p>
          </Link>
          <div className="flex items-center gap-2">
            <Button className="px-2" variant={"sink"}><Search width={20} height={20} /></Button>
            <Button className="px-2" variant={"sink"}><Heart width={20} height={20} /></Button>
            <LoginButton />
          </div>
        </nav>
      </header>
    </>
  );
};

export default Navbar;
