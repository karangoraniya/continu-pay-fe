import { continuPayAbi, contractAddress } from "@/utils/helpers";
import { useState, useEffect } from "react";
import { useAccount, useReadContracts } from "wagmi";

type StreamDetails = {
  deposit: bigint;
  ratePerSecond: bigint;
  remainingBalance: bigint;
  startTime: bigint;
  stopTime: bigint;
  recipient: string;
  isRecurring: boolean;
  recurringPeriod: bigint;
};

type StreamData = {
  onChainData: StreamDetails | null;
  dbData: any | null; // Replace 'any' with your specific DB data type
  isLoading: boolean;
  error: Error | null;
};

export function useStreamDetails(streamId: number, tokenAddress: string) {
  const { address } = useAccount();
  const [streamData, setStreamData] = useState<StreamData>({
    onChainData: null,
    dbData: null,
    isLoading: true,
    error: null,
  });

  // Fetch on-chain data
  const { data, isError, isLoading } = useReadContracts({
    contracts: [
      {
        address: contractAddress,
        abi: continuPayAbi,
        functionName: "getStreamDetails",
        args: [streamId, tokenAddress],
      },
    ],
  });

  // Fetch data from your database
  useEffect(() => {
    async function fetchDbData() {
      try {
        const response = await fetch(`/api/streams/${streamId}`);
        if (!response.ok) throw new Error("Failed to fetch from DB");
        const dbData = await response.json();
        setStreamData((prev) => ({ ...prev, dbData }));
      } catch (error) {
        setStreamData((prev) => ({ ...prev, error: error as Error }));
      }
    }

    fetchDbData();
  }, [streamId]);

  // Update state when on-chain data changes
  useEffect(() => {
    if (data && data[0]) {
      setStreamData((prev) => ({
        ...prev,
        onChainData: data[0] as unknown as StreamDetails,
        isLoading: false,
      }));
    }
    if (isError) {
      setStreamData((prev) => ({
        ...prev,
        error: new Error("Failed to fetch on-chain data"),
        isLoading: false,
      }));
    }
  }, [data, isError]);

  return streamData;
}

// // hooks/useStreams.ts
// import { useState, useEffect } from "react";
// import { useAccount } from "wagmi";

// export function useStreams() {
//   const { address } = useAccount();
//   const [streams, setStreams] = useState<any[]>([]);

//   useEffect(() => {
//     if (address) {
//       fetchStreams();
//     }
//   }, [address]);

//   const fetchStreams = async () => {
//     const response = await fetch(`/api/streams?recipient=${address}`);
//     const data = await response.json();
//     setStreams(data);
//   };

//   const addStream = async (streamData: any) => {
//     const response = await fetch("/api/streams", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(streamData),
//     });
//     const newStream = await response.json();
//     setStreams([...streams, newStream]);
//   };

//   return { streams, addStream, fetchStreams };
// }
