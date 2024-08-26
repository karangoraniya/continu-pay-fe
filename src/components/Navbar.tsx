"use client";
import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { CreditCard } from "lucide-react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useEffect } from "react";

export default function Component() {
  const { isConnected } = useAccount();
  const router = useRouter();

  useEffect(() => {
    if (isConnected) {
      router.push("/dashboard");
    } else if (!isConnected) {
      router.push("/");
    } else {
      toast.error("Please connect wallet to see dashboard");
    }
  }, [isConnected, router]);

  const handleGetStarted = () => {
    if (isConnected) {
      router.push("/dashboard");
    } else {
      toast.error("Please connect wallet to see dashboard");
    }
  };

  return (
    <header className="flex h-20 w-full shrink-0 items-center px-4 md:px-6 justify-between">
      <div className="w-fit">
        <Link href="/" className="flex items-center gap-2" prefetch={false}>
          <CreditCard className="h-6 w-6 text-primary" />
          <span className="font-semibold">ContinuPay</span>
        </Link>
      </div>
      <div className="flex w-full justify-center">
        <NavigationMenu className="hidden lg:flex">
          <NavigationMenuList>
            <NavigationMenuLink asChild>
              <Link
                href="/"
                className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50"
                prefetch={false}
              >
                Home
              </Link>
            </NavigationMenuLink>

            <NavigationMenuLink asChild>
              <Button
                onClick={handleGetStarted}
                className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-background text-accent-foreground px-4 py-2  text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50"
              >
                Launch App
              </Button>
            </NavigationMenuLink>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
      <div className="min-w-fit">
        <ConnectButton />
      </div>
    </header>
  );
}
