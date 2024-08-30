"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, CheckCircle, ArrowLeft } from "lucide-react";
import { useAccount, useWriteContract } from "wagmi";
import { continuPayAbi, contractAddress } from "@/utils/helpers";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { USDCAddress, USDTAddress } from "@/utils/helpers";
import toast from "react-hot-toast";

const WithdrawStream = () => {
  const [tokenType, setTokenType] = useState("");
  const [streamId, setStreamId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [withdrawnAmount, setWithdrawnAmount] = useState("");
  const { isConnected, address } = useAccount();
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);
  const {
    data: hash,
    error,
    isPending,
    isError,
    writeContract,
  } = useWriteContract();

  useEffect(() => {
    if (isConnected && !isRedirecting) {
      setIsRedirecting(true);
      const timer = setTimeout(() => {
        router.push("/dashboard");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isConnected, router, isRedirecting]);

  useEffect(() => {
    if (hash) {
      const explorerUrl = `https://opencampus-codex.blockscout.com/tx/${hash}`;
      toast(
        (t) => (
          <span>
            Withdrawal successful!
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
      setIsSuccess(true);
    }
  }, [hash]);

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tokenType || !streamId) {
      toast.error("Please fill in all fields");
      return;
    }
    setIsLoading(true);
    setIsSuccess(false);

    try {
      if (tokenType === "eth") {
        await writeContract({
          abi: continuPayAbi,
          address: contractAddress,
          functionName: "withdrawFromEthStream",
          args: [BigInt(streamId)],
        });
      } else {
        const tokenAddress = tokenType === "usdc" ? USDCAddress : USDTAddress;
        await writeContract({
          abi: continuPayAbi,
          address: contractAddress,
          functionName: "withdrawFromErc20Stream",
          args: ["0xfe419fF91447D505F0047C06E8d31BD43ec65b5e", 34],
        });
      }
    } catch (error) {
      console.error("Withdrawal failed:", error);
      toast.error("Withdrawal failed. Please try again.");
      setIsLoading(false);
    }
  };

  console.log("error", error);

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
            <CardTitle>Withdraw from Stream</CardTitle>
            <CardDescription>
              Withdraw your tokens from an existing stream
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleWithdraw} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="token-type">Token Type</Label>
                <Select value={tokenType} onValueChange={setTokenType}>
                  <SelectTrigger id="token-type">
                    <SelectValue placeholder="Select token" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="eth">ETH</SelectItem>
                    <SelectItem value="usdc">USDC</SelectItem>
                    <SelectItem value="usdt">USDT</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="stream-id">Stream ID</Label>
                <Input
                  id="stream-id"
                  placeholder="Enter stream ID"
                  value={streamId}
                  onChange={(e) => setStreamId(e.target.value)}
                />
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading || isPending}
              >
                {isLoading || isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Withdrawing...
                  </>
                ) : (
                  "Withdraw"
                )}
              </Button>
            </form>
          </CardContent>
          {isSuccess && (
            <CardFooter>
              <div className="w-full p-4 bg-green-100 text-green-700 rounded-md flex items-center justify-center">
                <CheckCircle className="mr-2 h-5 w-5" />
                <span>Withdrawal successful!</span>
              </div>
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  );
};

export default WithdrawStream;
