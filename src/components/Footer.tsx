import React from "react";
import Link from "next/link";
import { Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-background border-t border-border py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-center text-center">
          <p className="text-sm text-muted-foreground">
            Made with{" "}
            <Heart
              className="inline-block w-4 h-4 mx-1 text-red-500 fill-current"
              aria-hidden="true"
            />{" "}
            by{" "}
            <Link
              href="https://cryptokarigar.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-primary hover:underline"
            >
              Team CryptoKarigar
            </Link>
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            © {new Date().getFullYear()} ContinuPay. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
