import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  Bell,
  Settings,
  LogOut,
  Eye,
  Wallet,
  ArrowDownLeft,
  Calendar,
  DollarSign,
} from "lucide-react";

export default function DashboardRecipient() {
  return (
    <div className="theme-custom min-h-screen bg-background text-foreground">
      <div className="flex flex-col md:flex-row">
        {/* Sidebar */}
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
            <Button variant="ghost" className="w-full justify-start">
              <ArrowDownLeft className="mr-2 h-4 w-4" />
              Withdrawals
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <Settings className="mr-2 h-4 w-4" />
              Settings
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
                <div className="text-2xl font-bold">$10,234</div>
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
                <div className="text-2xl font-bold">8</div>
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
                <div className="text-2xl font-bold">$1,567</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Next Expected Payment
                </CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$500</div>
                <p className="text-xs text-muted-foreground">In 2 days</p>
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
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                  <ArrowDownLeft className="mr-2 h-4 w-4" />
                  Withdraw Funds
                </Button>
                <Button variant="outline">
                  <Eye className="mr-2 h-4 w-4" />
                  View My Streams
                </Button>
                <Button variant="outline">
                  <CreditCard className="mr-2 h-4 w-4" />
                  Request New Stream
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
                      <TableHead>Stream Name</TableHead>
                      <TableHead>Sender</TableHead>
                      <TableHead>Token</TableHead>
                      <TableHead>Available to Withdraw</TableHead>
                      <TableHead>Next Payment Date</TableHead>
                      <TableHead>Stream End Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[
                      {
                        name: "Salary",
                        sender: "0x9876...5432",
                        token: "USDC",
                        available: "2000",
                        nextPayment: "2023-07-01",
                        endDate: "2024-06-30",
                      },
                      {
                        name: "Dividends",
                        sender: "0x5432...9876",
                        token: "ETH",
                        available: "0.5",
                        nextPayment: "2023-07-15",
                        endDate: "2023-12-31",
                      },
                      {
                        name: "Royalties",
                        sender: "0x1357...2468",
                        token: "DAI",
                        available: "750",
                        nextPayment: "2023-07-05",
                        endDate: "2024-01-31",
                      },
                    ].map((stream, index) => (
                      <TableRow key={index}>
                        <TableCell>{stream.name}</TableCell>
                        <TableCell>{stream.sender}</TableCell>
                        <TableCell>{stream.token}</TableCell>
                        <TableCell>{stream.available}</TableCell>
                        <TableCell>{stream.nextPayment}</TableCell>
                        <TableCell>{stream.endDate}</TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">
                            Withdraw
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Recent Withdrawals</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Token</TableHead>
                      <TableHead>Stream Name</TableHead>
                      <TableHead>Transaction Hash</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[
                      {
                        date: "2023-06-30",
                        amount: "1000",
                        token: "USDC",
                        name: "Salary",
                        hash: "0xabcd...1234",
                      },
                      {
                        date: "2023-06-25",
                        amount: "0.2",
                        token: "ETH",
                        name: "Dividends",
                        hash: "0xefgh...5678",
                      },
                      {
                        date: "2023-06-20",
                        amount: "500",
                        token: "DAI",
                        name: "Royalties",
                        hash: "0xijkl...9012",
                      },
                    ].map((withdrawal, index) => (
                      <TableRow key={index}>
                        <TableCell>{withdrawal.date}</TableCell>
                        <TableCell>{withdrawal.amount}</TableCell>
                        <TableCell>{withdrawal.token}</TableCell>
                        <TableCell>{withdrawal.name}</TableCell>
                        <TableCell>{withdrawal.hash}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>

      {/* Floating Action Button */}
      <Button className="fixed bottom-4 right-4 rounded-full px-4 py-2">
        Withdraw All
      </Button>
    </div>
  );
}
