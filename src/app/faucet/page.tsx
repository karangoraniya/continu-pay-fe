"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import toast from "react-hot-toast";
import { Loader2, ArrowLeft } from "lucide-react";
import { useAccount, useWriteContract } from "wagmi";
import { useRouter } from "next/navigation";
import { USDCAddress, usdABI, USDTAddress } from "@/utils/helpers";

export default function Faucet() {
  const [token, setToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const {
    data: hash,
    error,
    isPending,
    isError,
    writeContract,
  } = useWriteContract();

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

  useEffect(() => {
    if (hash) {
      const explorerUrl = `https://opencampus-codex.blockscout.com/tx/${hash}`;
      toast(
        (t) => (
          <span>
            {token} tokens have been sent to your connected wallet.
            <br />
            <a
              href={explorerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              View on Explorer
            </a>
          </span>
        ),
        {
          duration: 5000,
          style: {
            background: "#333",
            color: "#fff",
          },
        }
      );
      setIsLoading(false);
    }
  }, [hash, token]);

  useEffect(() => {
    if (isError) {
      toast.error("Failed to send tokens. Please try again later.");
      setIsLoading(false);
    }
  }, [isError]);

  const handleFaucetRequest = async () => {
    if (!token) {
      toast.error("Please select a token.");
      return;
    }

    setIsLoading(true);
    try {
      const tokenAddress = token === "USDC" ? USDCAddress : USDTAddress;

      await writeContract({
        abi: usdABI,
        address: tokenAddress,
        functionName: "faucet",
      });
    } catch (error) {
      console.error("Error in handleFaucetRequest:", error);
    }
  };

  return (
    <div className="theme-custom min-h-screen bg-background text-foreground p-4">
      <Button
        variant="ghost"
        className="mb-4"
        onClick={() => router.push("/dashboard")}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Dashboard
      </Button>
      <div className="flex items-center justify-center w-[80vw] my-20 mx-auto">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Token Faucet</CardTitle>
            <CardDescription>
              Request test USDT or USDC tokens for the ContinuPay testnet
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="token">Select Token</Label>
                <Select value={token} onValueChange={setToken}>
                  <SelectTrigger id="token">
                    <SelectValue placeholder="Choose a token" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USDT">USDT</SelectItem>
                    <SelectItem value="USDC">USDC</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              className="w-full"
              onClick={handleFaucetRequest}
              disabled={isLoading || isPending}
            >
              {isLoading || isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending Tokens...
                </>
              ) : (
                "Request Tokens"
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
