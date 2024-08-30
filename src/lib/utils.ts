import { type ClassValue, clsx } from "clsx";
import toast from "react-hot-toast";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function storeStreamInDB(streamData: any) {
  try {
    const response = await fetch("/api/streams", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(streamData),
    });

    if (!response.ok) {
      throw new Error("Failed to store stream data");
    }

    const result = await response.json();
    console.log("Stream stored in database:", result);
  } catch (error) {
    console.error("Error storing stream in database:", error);
    toast.error("Failed to store stream data in database");
  }
}
