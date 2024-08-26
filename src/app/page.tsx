"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Globe, Lock, RefreshCcw } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useAccount } from "wagmi";

export default function Component() {
  // conditional page rendering

  const { isConnected } = useAccount();
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    if (isConnected && !isRedirecting) {
      setIsRedirecting(true);
      const timer = setTimeout(() => {
        router.push("/dashboard");
      }, 3000); // 3-second delay before redirect
      return () => clearTimeout(timer);
    }
  }, [isConnected, router, isRedirecting]);

  const handleGetStarted = () => {
    if (isConnected) {
      router.push("/dashboard");
    } else {
      toast.error("Please connect wallet to see dashboard");
    }
  };

  const cancelRedirect = () => {
    setIsRedirecting(false);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Stream Payments, Not Just Content
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  ContinuPay revolutionizes digital transactions with real-time,
                  decentralized streaming payments. Pay as you go, seamlessly
                  and securely.
                </p>
              </div>
              <div className="space-x-4">
                <Button
                  onClick={handleGetStarted}
                  className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                >
                  Launch App <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </section>
        <section
          id="features"
          className="w-full py-12 md:py-24 lg:py-32 bg-primary dark:bg-gray-800"
        >
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12 text-primary-foreground">
              Key Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Globe className="mr-2 h-4 w-4" />
                    Decentralized
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Leverage blockchain technology for trustless, peer-to-peer
                    transactions without intermediaries.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <RefreshCcw className="mr-2 h-4 w-4" />
                    Real-time Streaming
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Pay or get paid continuously as services are rendered,
                    ensuring fair and instant compensation.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Lock className="mr-2 h-4 w-4" />
                    Secure & Transparent
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Enjoy the security of blockchain with full transparency of
                    all transactions.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        <section id="how-it-works" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">
              How It Works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold mb-4">
                  1
                </div>
                <h3 className="text-xl font-bold mb-2">Connect Your Wallet</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Link your cryptocurrency wallet to start sending or receiving
                  streaming payments.
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold mb-4">
                  2
                </div>
                <h3 className="text-xl font-bold mb-2">Set Up a Stream</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Define the payment rate and duration for your service or
                  content consumption.
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold mb-4">
                  3
                </div>
                <h3 className="text-xl font-bold mb-2">Start Streaming</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Begin the service or content consumption. Payments flow in
                  real-time as you use or provide the service.
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold mb-4">
                  4
                </div>
                <h3 className="text-xl font-bold mb-2">Monitor & Manage</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Track your streams in real-time and manage your payments with
                  full control and transparency.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
