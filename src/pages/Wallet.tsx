import React, { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import ReusableCard from "@/components/ui/cards";
import { toast } from "sonner";
import {
  CreditCard,
  Minus,
  History,
  DollarSign,
  ArrowDownLeft,
  Clock,
  WalletIcon
} from "lucide-react";
import {
  useFundWalletMutation,
  useGetWalletBalanceQuery,
  useGetWalletTransactionsQuery,
  useLazyVerifyWalletFundingQuery
} from "@/store/services/walletApi";
import { TRANSACTION_TYPE } from "@/types/wallet";

const Wallet: React.FC = () => {
  const [addAmount, setAddAmount] = useState("");
  const [page] = useState(1);
  const [searchParams, setSearchParams] = useSearchParams();

  const { data: wallet, isLoading: isLoadingBalance, refetch: refetchBalance } =
    useGetWalletBalanceQuery();
  const { data: transactionsData, isLoading: isLoadingTransactions, refetch: refetchTransactions } =
    useGetWalletTransactionsQuery({
      page,
      limit: 10
    });
  const [fundWallet, { isLoading: isFunding }] = useFundWalletMutation();
  const [verifyWalletFunding] = useLazyVerifyWalletFundingQuery();

  const transactions = transactionsData?.data || [];
  const balance = wallet?.balance || 0;
  const processedRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    const reference = searchParams.get("reference") || searchParams.get("trxref");

    if (reference && !processedRef.current.has(reference)) {
      processedRef.current.add(reference);

      const verifyPayment = async () => {
        try {
          const result = await verifyWalletFunding(reference).unwrap();
          console.log(result);
          if (result.status === 'completed') {
            toast.success(result.message || "Wallet funded successfully!");
            refetchBalance();
            refetchTransactions();
          } else {
            toast.error(result.message || "Payment verification failed");
          }
        } catch (error: any) {
          toast.error(
            error?.message ||
            error?.data?.message ||
            "Failed to verify payment. Please contact support if funds were deducted."
          );
        } finally {
          searchParams.delete("reference");
          searchParams.delete("trxref");
          setSearchParams(searchParams, { replace: true });
        }
      };

      verifyPayment();
    }
  }, [searchParams, setSearchParams, verifyWalletFunding, refetchBalance, refetchTransactions]);

  const handleAddFunds = async () => {
    const amount = parseFloat(addAmount);

    if (!addAmount || isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    if (amount < 100) {
      toast.error("Minimum funding amount is ₦100");
      return;
    }

    try {
      const result = await fundWallet({
        amount: amount
      }).unwrap();

      if (result.authorizationUrl) {
        window.location.href = result.authorizationUrl;
      }
    } catch {
      console.error("Failed to fund wallet");
    }
  };

  const getTransactionIcon = (type: TRANSACTION_TYPE) => {
    switch (type) {
      case TRANSACTION_TYPE.CREDIT:
        return <ArrowDownLeft className="h-4 w-4 text-green-500" />;
      case TRANSACTION_TYPE.DEBIT:
        return <Minus className="h-4 w-4 text-red-500" />;
      default:
        return <span className="h-4 w-4 text-gray-500 text-2xl">₦</span>;
    }
  };

  const getTransactionColor = (type: TRANSACTION_TYPE) => {
    switch (type) {
      case TRANSACTION_TYPE.CREDIT:
        return "text-green-600";
      case TRANSACTION_TYPE.DEBIT:
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Wallet</h1>
        <p className="text-gray-600 mt-2">
          Manage your account balance and transaction history
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <ReusableCard title="Account Balance" className="lg:col-span-1">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
              {isLoadingBalance ? (
                <Clock className="h-8 w-8 text-blue-600 animate-spin" />
              ) : (
                <WalletIcon className="h-8 w-8 text-blue-600" />
              )}
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900">
                ₦{balance.toFixed(2)}
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
                  min="100"
                  step="0.01"
                />
                <Button
                  onClick={handleAddFunds}
                  disabled={
                    !addAmount || parseFloat(addAmount) <= 0 || isFunding
                  }
                >
                  {isFunding ? "Processing..." : "Add Funds"}
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {[100, 500, 1000, 2500].map((amount) => (
                <Button
                  key={amount}
                  variant="outline"
                  size="sm"
                  onClick={() => setAddAmount(amount.toString())}
                >
                  ₦{amount}
                </Button>
              ))}
            </div>

            <p className="text-sm text-gray-500">
              Minimum funding amount is ₦100. Funds will be added instantly via
              secure payment processing.
            </p>
          </div>
        </ReusableCard>
      </div>

      <ReusableCard title="Transaction History" className="mt-8">
        <div className="space-y-4">
          {isLoadingTransactions ? (
            <div className="text-center py-8 text-gray-500">
              <Clock className="h-12 w-12 mx-auto mb-2 text-gray-300 animate-spin" />
              <p>Loading transactions...</p>
            </div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <History className="h-12 w-12 mx-auto mb-2 text-gray-300" />
              <p>No transactions yet</p>
            </div>
          ) : (
            transactions?.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-start gap-3">
                  {getTransactionIcon(transaction.type)}
                  <div>
                    <p className="font-medium">
                      {transaction.description || "Transaction"}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(transaction.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p
                    className={`font-medium ${getTransactionColor(
                      transaction.type
                    )}`}
                  >
                    {transaction.type === TRANSACTION_TYPE.CREDIT ? "+" : "-"}₦
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
  );
};

export default Wallet;
