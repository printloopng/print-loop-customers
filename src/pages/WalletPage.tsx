import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import ReusableCard from "@/components/ui/cards";
import {
  CreditCard,
  Plus,
  Minus,
  History,
  DollarSign,
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
} from "lucide-react";

interface Transaction {
  id: string;
  type: "deposit" | "withdrawal" | "payment" | "refund";
  amount: number;
  description: string;
  date: string;
  status: "completed" | "pending" | "failed";
}

const WalletPage: React.FC = () => {
  const [balance, setBalance] = useState(25.5);
  const [addAmount, setAddAmount] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const transactions: Transaction[] = [
    {
      id: "1",
      type: "deposit",
      amount: 50.0,
      description: "Added funds via credit card",
      date: "2024-01-15",
      status: "completed",
    },
    {
      id: "2",
      type: "payment",
      amount: -2.5,
      description: "Print job #001",
      date: "2024-01-14",
      status: "completed",
    },
    {
      id: "3",
      type: "refund",
      amount: 1.25,
      description: "Cancelled print job #002",
      date: "2024-01-13",
      status: "completed",
    },
    {
      id: "4",
      type: "payment",
      amount: -5.0,
      description: "Print job #003",
      date: "2024-01-12",
      status: "completed",
    },
  ];

  const handleAddFunds = async () => {
    if (!addAmount || parseFloat(addAmount) <= 0) return;

    setIsAdding(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setBalance((prev) => prev + parseFloat(addAmount));
    setAddAmount("");
    setIsAdding(false);
  };

  const getTransactionIcon = (type: Transaction["type"]) => {
    switch (type) {
      case "deposit":
        return <ArrowDownLeft className="h-4 w-4 text-green-500" />;
      case "withdrawal":
        return <ArrowUpRight className="h-4 w-4 text-red-500" />;
      case "payment":
        return <Minus className="h-4 w-4 text-red-500" />;
      case "refund":
        return <Plus className="h-4 w-4 text-green-500" />;
      default:
        return <DollarSign className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTransactionColor = (type: Transaction["type"]) => {
    switch (type) {
      case "deposit":
      case "refund":
        return "text-green-600";
      case "withdrawal":
      case "payment":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Wallet</h1>
          <p className="text-gray-600 mt-2">
            Manage your account balance and transaction history
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Balance Card */}
          <ReusableCard title="Account Balance" className="lg:col-span-1">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                <Wallet className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-900">
                  ${balance.toFixed(2)}
                </p>
                <p className="text-sm text-gray-500">Available balance</p>
              </div>
              <Badge
                variant="outline"
                className="bg-green-50 text-green-700 border-green-200"
              >
                Active
              </Badge>
            </div>
          </ReusableCard>

          {/* Add Funds */}
          <ReusableCard title="Add Funds" className="lg:col-span-2">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount to add</Label>
                <div className="flex gap-2">
                  <Input
                    id="amount"
                    type="number"
                    placeholder="0.00"
                    value={addAmount}
                    onChange={(e) => setAddAmount(e.target.value)}
                    min="1"
                    step="0.01"
                  />
                  <Button
                    onClick={handleAddFunds}
                    disabled={
                      !addAmount || parseFloat(addAmount) <= 0 || isAdding
                    }
                  >
                    {isAdding ? "Adding..." : "Add Funds"}
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {[10, 25, 50, 100].map((amount) => (
                  <Button
                    key={amount}
                    variant="outline"
                    size="sm"
                    onClick={() => setAddAmount(amount.toString())}
                  >
                    ${amount}
                  </Button>
                ))}
              </div>

              <p className="text-sm text-gray-500">
                Funds will be added instantly via secure payment processing
              </p>
            </div>
          </ReusableCard>
        </div>

        {/* Transaction History */}
        <ReusableCard title="Transaction History" className="mt-8">
          <div className="space-y-4">
            {transactions.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <History className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                <p>No transactions yet</p>
              </div>
            ) : (
              transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    {getTransactionIcon(transaction.type)}
                    <div>
                      <p className="font-medium">{transaction.description}</p>
                      <p className="text-sm text-gray-500">
                        {transaction.date}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={`font-medium ${getTransactionColor(
                        transaction.type
                      )}`}
                    >
                      {transaction.amount > 0 ? "+" : ""}$
                      {Math.abs(transaction.amount).toFixed(2)}
                    </p>
                    <Badge
                      variant="outline"
                      className={
                        transaction.status === "completed"
                          ? "bg-green-50 text-green-700 border-green-200"
                          : transaction.status === "pending"
                          ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                          : "bg-red-50 text-red-700 border-red-200"
                      }
                    >
                      {transaction.status}
                    </Badge>
                  </div>
                </div>
              ))
            )}
          </div>
        </ReusableCard>

        {/* Wallet Benefits */}
        <ReusableCard title="Wallet Benefits" className="mt-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <CreditCard className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold mb-2">Store Credit</h3>
              <p className="text-sm text-gray-600">
                Refunded money is stored as credit for future use
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Minus className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">Cancel Jobs</h3>
              <p className="text-sm text-gray-600">
                Cancel print jobs and get instant refunds
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <DollarSign className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold mb-2">Prepaid Balance</h3>
              <p className="text-sm text-gray-600">
                Add money ahead of time for faster printing
              </p>
            </div>
          </div>
        </ReusableCard>
      </div>
    </div>
  );
};

export default WalletPage;
