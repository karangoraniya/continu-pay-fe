"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, RefreshCw, Loader2 } from "lucide-react";
import { format, fromUnixTime, getUnixTime, set } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useAccount, useWriteContract } from "wagmi";
import {
  continuPayAbi,
  contractAddress,
  usdABI,
  USDCAddress,
  USDTAddress,
} from "@/utils/helpers";
import { parseEther, parseUnits } from "viem";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CreateNewStream() {
  const [streamType, setStreamType] = useState("eth");
  const [token, setToken] = useState("ETH");
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [streamName, setStreamName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurrencePeriod, setRecurrencePeriod] = useState("");
  const [startDate, setStartDate] = useState<number>(); // Unix timestamp
  const [endDate, setEndDate] = useState<number>(); // Unix timestamp
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [isApproved, setIsApproved] = useState(false);

  const { isConnected } = useAccount();
  const {
    data: hash,
    error,
    isPending,
    isError,
    writeContract,
  } = useWriteContract();

  // cross

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
    if (isError) {
      toast.error("Transaction failed. Please try again.");
      setIsLoading(false);
      setIsApproving(false);
    }
  }, [isError]);

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

  useEffect(() => {
    if (hash && !isApproving) {
      const explorerUrl = `https://opencampus-codex.blockscout.com/tx/${hash}`;
      toast(
        (t) => (
          <span>
            Transaction successful!
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
        }
      );
      setIsLoading(false);
      // Redirect to dashboard after 3 seconds
      setTimeout(() => {
        router.push("/dashboard");
      }, 3000);
    } else if (hash && isApproving) {
      toast.success("Token approval successful. Creating stream...");
      setIsApproving(false);
      setIsApproved(true);
      triggerTokenTx();
    }
  }, [hash, router, isApproving]);

  const triggerEthTx = async () => {
    try {
      setIsLoading(true);
      const recurringPeriodValue = isRecurring ? parseInt(recurrencePeriod) : 0;
      const triggerTx = writeContract({
        abi: continuPayAbi,
        address: contractAddress,
        functionName: "createEthStream",
        args: [
          streamName,
          description,
          "image",
          recipient,
          startDate,
          endDate,
          isRecurring,
          recurringPeriodValue,
        ],
        value: parseEther(amount),
      });
      // console.log("hash", hash);
    } catch (error) {
      console.log("error", error);
      setIsLoading(false);
    }
  };

  const triggerApprove = async () => {
    try {
      setIsApproving(true);
      setIsLoading(true);
      const tokenAddress = token === "USDT" ? USDTAddress : USDCAddress;
      const amountInSmallestUnit = parseUnits(amount, 18);

      await writeContract({
        abi: usdABI,
        address: tokenAddress,
        functionName: "approve",
        args: [contractAddress, amountInSmallestUnit],
      });
    } catch (error) {
      console.error("Error approving tokens:", error);
      setIsApproving(false);
      setIsLoading(false);
      toast.error("Failed to approve tokens. Please try again.");
    }
  };

  const triggerTokenTx = async () => {
    try {
      setIsLoading(true);
      const tokenAddress = token === "USDT" ? USDTAddress : USDCAddress;
      const amountInSmallestUnit = parseUnits(amount, 18);
      const recurringPeriodValue = isRecurring ? parseInt(recurrencePeriod) : 0;

      await writeContract({
        abi: continuPayAbi,
        address: contractAddress,
        functionName: "createErc20Stream",
        args: [
          streamName,
          description,
          "image",
          tokenAddress,
          recipient,
          amountInSmallestUnit,
          startDate,
          endDate,
          isRecurring,
          recurringPeriodValue,
        ],
      });
    } catch (error) {
      console.error("Error creating ERC20 stream:", error);
      setIsLoading(false);
      toast.error("Failed to create ERC20 stream. Please try again.");
    }
  };

  const handleCreateStream = async () => {
    if (streamType === "eth") {
      await triggerEthTx();
    } else {
      if (!isApproved) {
        await triggerApprove();
      } else {
        await triggerTokenTx();
      }
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImage(file);
    }
  };

  const handleDateTimeChange = (
    date: Date | undefined,
    type: "start" | "end"
  ) => {
    if (date) {
      const unixTimestamp = getUnixTime(date);
      const setter = type === "start" ? setStartDate : setEndDate;
      setter(unixTimestamp);
    }
  };

  const handleTimeChange = (time: string, type: "start" | "end") => {
    const [hours, minutes] = time.split(":").map(Number);
    const setter = type === "start" ? setStartDate : setEndDate;
    const currentTimestamp = type === "start" ? startDate : endDate;

    if (currentTimestamp) {
      const currentDate = fromUnixTime(currentTimestamp);
      const newDate = set(currentDate, { hours, minutes });
      setter(getUnixTime(newDate));
    } else {
      const now = new Date();
      const newDate = set(now, { hours, minutes });
      setter(getUnixTime(newDate));
    }
  };

  const calculateStreamDetails = () => {
    if (startDate && endDate && amount) {
      const durationInSeconds = endDate - startDate;
      const durationInDays = durationInSeconds / 86400; // 86400 seconds in a day
      const ratePerSecond = parseFloat(amount) / durationInSeconds;
      const ratePerDay = ratePerSecond * 86400;

      const formatDuration = () => {
        if (durationInDays >= 1) {
          return `${durationInDays.toFixed(2)} days`;
        } else {
          const hours = durationInSeconds / 3600;
          if (hours >= 1) {
            return `${hours.toFixed(2)} hours`;
          } else {
            const minutes = durationInSeconds / 60;
            return `${minutes.toFixed(2)} minutes`;
          }
        }
      };

      const formatRate = (rate: number) => {
        if (rate < 0.000001) {
          return rate.toExponential(6);
        } else {
          return rate.toFixed(6);
        }
      };

      return {
        duration: formatDuration(),
        ratePerSecond: `${formatRate(ratePerSecond)} ${token}/second`,
        ratePerMinute: `${formatRate(ratePerSecond * 60)} ${token}/minute`,
        ratePerHour: `${formatRate(ratePerSecond * 3600)} ${token}/hour`,
        ratePerDay: `${formatRate(ratePerDay)} ${token}/day`,
      };
    }
    return null;
  };

  const streamDetails = calculateStreamDetails();

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

      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Create New Stream</CardTitle>
          <CardDescription>
            Set up a new payment stream with ContinuPay
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="stream-type">Stream Type</Label>
              <Select value={streamType} onValueChange={setStreamType}>
                <SelectTrigger id="stream-type">
                  <SelectValue placeholder="Select stream type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="eth">ETH Stream</SelectItem>
                  <SelectItem value="erc20">ERC20 Stream</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {streamType === "erc20" && (
              <div className="space-y-2">
                <Label htmlFor="token">Select Token</Label>
                <Select value={token} onValueChange={setToken}>
                  <SelectTrigger id="token">
                    <SelectValue placeholder="Select token" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USDC">USDC</SelectItem>
                    <SelectItem value="USDT">USDT</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="recipient">Recipient Address</Label>
              <Input
                id="recipient"
                placeholder="0x... or ENS name"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Total Amount to Stream</Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
                <span>{streamType === "eth" ? "ETH" : token}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start-date">Start Date and Time</Label>
                <div className="flex space-x-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !startDate && "text-muted-foreground"
                        )}
                      >
                        {startDate ? (
                          format(fromUnixTime(startDate), "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={
                          startDate ? fromUnixTime(startDate) : undefined
                        }
                        onSelect={(date) => handleDateTimeChange(date, "start")}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <Input
                    type="time"
                    value={
                      startDate ? format(fromUnixTime(startDate), "HH:mm") : ""
                    }
                    onChange={(e) => handleTimeChange(e.target.value, "start")}
                    className="w-24"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="end-date">End Date and Time</Label>
                <div className="flex space-x-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !endDate && "text-muted-foreground"
                        )}
                      >
                        {endDate ? (
                          format(fromUnixTime(endDate), "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={endDate ? fromUnixTime(endDate) : undefined}
                        onSelect={(date) => handleDateTimeChange(date, "end")}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <Input
                    type="time"
                    value={
                      endDate ? format(fromUnixTime(endDate), "HH:mm") : ""
                    }
                    onChange={(e) => handleTimeChange(e.target.value, "end")}
                    className="w-24"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="stream-name">Stream Name</Label>
              <Input
                id="stream-name"
                placeholder="My Stream"
                value={streamName}
                onChange={(e) => setStreamName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe your stream..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {/* <div className="space-y-2">
              <Label htmlFor="image-upload">Upload Image</Label>
              <Input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
              />
              {imagePreview && (
                <Image
                  src={imagePreview}
                  width={120}
                  height={120}
                  alt="Stream preview"
                  className="mt-2 max-w-xs rounded-md"
                />
              )}
            </div> */}

            <div className="space-y-2">
              <Button
                type="button"
                variant={isRecurring ? "default" : "outline"}
                onClick={() => setIsRecurring(!isRecurring)}
                className="w-full"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                {isRecurring ? "Recurring Stream" : "One-time Stream"}
              </Button>
              {isRecurring && (
                <Input
                  placeholder="Recurrence Period (e.g., 30 days)"
                  value={recurrencePeriod}
                  onChange={(e) => setRecurrencePeriod(e.target.value)}
                />
              )}
            </div>

            {streamDetails && (
              <Card>
                <CardHeader>
                  <CardTitle>Stream Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p>Duration: {streamDetails.duration}</p>
                    <p>Rate per Second: {streamDetails.ratePerSecond}</p>
                    <p>Rate per Minute: {streamDetails.ratePerMinute}</p>
                    <p>Rate per Hour: {streamDetails.ratePerHour}</p>
                    <p>Rate per Day: {streamDetails.ratePerDay}</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button
            className="w-full"
            onClick={handleCreateStream}
            disabled={isLoading || isPending}
          >
            {isLoading || isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isApproving ? "Approving..." : "Creating Stream..."}
              </>
            ) : streamType === "eth" || isApproved ? (
              "Create Stream"
            ) : (
              "Approve and Create Stream"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
