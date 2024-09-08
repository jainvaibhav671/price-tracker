"use client";

import { scrapeAndStoreProduct } from "@/lib/actions";
import { useRouter } from "next/navigation";
import React from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useSession } from "next-auth/react";
import { useLoginModal } from "@/lib/store";

const isValidAmazonProductURL = (url: string) => {
  try {
    const parsedURL = new URL(url);
    const hostname = parsedURL.hostname;

    if (
      hostname.includes("amazon.com") ||
      hostname.includes("amazon.") ||
      hostname.endsWith("amazon")
    ) {
      return true;
    }

    return false;
  } catch (error) {
    return false;
  }
};

const Searchbar = () => {
  const router = useRouter()
  const session = useSession()

  const { openModal } = useLoginModal()

  const [searchPrompt, setSearchPrompt] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    console.log(session.data)

    // if not logged in, prompt for login
    if (!session.data) {
      openModal()
      return
    }

    const isValidLink = isValidAmazonProductURL(searchPrompt);
    if (!isValidLink) return alert("Invalid Amazon Link!");

    try {
      setIsLoading(true);
      console.log("fetching product")
      const product = await scrapeAndStoreProduct({ productURL: searchPrompt, includeUsers: false });
      console.log(product)
      setIsLoading(false)

      router.push(`/products/${product?.id}`)

      // TODO: Scrape
    } catch (error) {
      setIsLoading(false);
    }
  };

  return (
    <form className="flex flex-col md:flex-row gap-4 mt-12" onSubmit={handleSubmit}>
      <Input
        type="url"
        value={searchPrompt}
        onChange={(e) => setSearchPrompt(e.target.value)}
        placeholder="Enter product link"
        className="searchbar-input"
      />

      <Button
        disabled={searchPrompt.length == 0}
        variant={"default"}
        type="submit"
      >
        {isLoading ? "Searching" : "Search"}
      </Button>
    </form>
  );
};

export default Searchbar;
