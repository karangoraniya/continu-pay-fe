"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  CreditCard,
  Settings,
  Eye,
  ArrowDownLeft,
  Calendar,
  DollarSign,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useAccount, useReadContracts } from "wagmi";
import {
  continuPayAbi,
  contractAddress,
  USDCAddress,
  USDTAddress,
} from "@/utils/helpers";
import { formatEther, formatUnits } from "viem";

// Assuming you have a list of token addresses that are used in your streams
const TOKEN_ADDRESSES = [
  "0xD18230c420f78B4Cb71Ba87fdd7129A8E34730D7", // Example ERC20 token address
  // Add more token addresses as needed
];

const lootContract = {
  address: "0xD18230c420f78B4Cb71Ba87fdd7129A8E34730D7",
  abi: continuPayAbi,
} as const;

export default function DashboardRecipient() {
  const router = useRouter();
  const { address } = useAccount();
  // const result = useReadContracts({
  //   contracts: [
  //     {
  //       ...lootContract,
  //       functionName: "getStreamDetails",
  //       args: [0, "0x0000000000000000000000000000000000000000"],
  //       // args: [6, "0xEEE615593C7f74d439e4ba91dC813aac9aD25348"],
  //     },
  //   ],
  // });
  const { data, isLoading, isError } = useReadContracts({
    contracts: [
      {
        ...lootContract,
        functionName: "getStreamDetails",
        args: [32, "0xfe419fF91447D505F0047C06E8d31BD43ec65b5e"],
      },
    ],
  });
  const streamData = data?.[0]?.result;

  console.log("result", data);

  const formatStreamData = (data: any) => {
    if (!data) return null;
    const [
      deposit,
      ratePerSecond,
      remainingBalance,
      startTime,
      stopTime,
      recipient,
      isRecurring,
      recurringPeriod,
    ] = data;
    return {
      deposit: formatEther(deposit),
      ratePerSecond: formatUnits(ratePerSecond, 18),
      remainingBalance: formatEther(remainingBalance),
      startTime: new Date(Number(startTime) * 1000),
      stopTime: new Date(Number(stopTime) * 1000),
      recipient,
      isRecurring,
      recurringPeriod: Number(recurringPeriod),
    };
  };

  const formattedData = formatStreamData(streamData);

  return (
    <div className="theme-custom min-h-screen bg-background text-foreground">
      <div className="flex flex-col md:flex-row">
        <aside className="w-full md:w-64 bg-card p-4">
          <nav className="space-y-2">
            <Button variant="ghost" className="w-full justify-start">
              <CreditCard className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <Eye className="mr-2 h-4 w-4" />
              My Streams
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start"
              // onClick={run}
              onClick={() => router.push("/withdraw")}
            >
              <ArrowDownLeft className="mr-2 h-4 w-4" />
              Withdrawals
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => router.push("/faucet")}
            >
              <Settings className="mr-2 h-4 w-4" />
              Faucet
            </Button>
          </nav>
        </aside>
        {/* Main Content */}
        <main className="flex-1 p-4">
          {/* Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Incoming Stream Value
                </CardTitle>
                <ArrowDownLeft className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {isLoading ? "Loading..." : `${formattedData?.deposit} USDC`}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Incoming Streams
                </CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Available to Withdraw
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {isLoading
                    ? "Loading..."
                    : `${formattedData?.remainingBalance} USDC`}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Stream End Date
                </CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {isLoading
                    ? "Loading..."
                    : formattedData?.stopTime.toLocaleDateString()}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions and Recent Activity */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col space-y-2">
                <Button
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                  onClick={() => {
                    router.push("/withdraw");
                  }}
                >
                  <ArrowDownLeft className="mr-2 h-4 w-4" />
                  Withdraw Funds
                </Button>
                <Button variant="outline">
                  <Eye className="mr-2 h-4 w-4" />
                  View My Streams
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    router.push("/createstream");
                  }}
                >
                  <CreditCard className="mr-2 h-4 w-4" />
                  Create New Stream
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {[
                    {
                      type: "Received",
                      description: "100 USDC from Stream #1234",
                    },
                    {
                      type: "Withdrawn",
                      description: "50 DAI from Stream #5678",
                    },
                    {
                      type: "New Stream",
                      description: "200 USDT from 0x8765...4321",
                    },
                    {
                      type: "Received",
                      description: "0.5 ETH from Stream #9012",
                    },
                    {
                      type: "Withdrawn",
                      description: "75 USDC from Stream #3456",
                    },
                  ].map((activity, index) => (
                    <li
                      key={index}
                      className="flex justify-between items-center text-sm"
                    >
                      <span className="font-medium">{activity.type}</span>
                      <span className="text-muted-foreground">
                        {activity.description}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Stream Tables */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>My Active Incoming Streams</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Stream ID</TableHead>
                      <TableHead>Recipient</TableHead>
                      <TableHead>Token</TableHead>
                      <TableHead>Available to Withdraw</TableHead>
                      <TableHead>Rate Per Second</TableHead>
                      <TableHead>Start Date</TableHead>
                      <TableHead>End Date</TableHead>
                      <TableHead>Is Recurring</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={8}>Loading...</TableCell>
                      </TableRow>
                    ) : formattedData ? (
                      <TableRow>
                        <TableCell>0</TableCell>
                        <TableCell>{formattedData.recipient}</TableCell>
                        <TableCell>USDC</TableCell>
                        <TableCell>
                          {formattedData.remainingBalance} USDC
                        </TableCell>
                        <TableCell>
                          {formattedData.ratePerSecond} USDC/s
                        </TableCell>
                        <TableCell>
                          {formattedData.startTime.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          {formattedData.stopTime.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          {formattedData.isRecurring ? "Yes" : "No"}
                        </TableCell>
                      </TableRow>
                    ) : (
                      <TableRow>
                        <TableCell colSpan={8}>No active streams</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>

      {/* Floating Action Button */}
      {/* <Button className="fixed bottom-4 right-4 rounded-full px-4 py-2">
        Withdraw All
      </Button> */}
    </div>
  );
}
