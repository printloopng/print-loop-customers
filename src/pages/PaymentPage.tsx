import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import ReusableCard from "@/components/ui/cards";
import {
  CreditCard,
  Wallet,
  CheckCircle,
  Copy,
  QrCode,
  Shield,
  Clock,
} from "lucide-react";
import { ROUTES } from "@/constants/routes";
import { handleFormatNaira } from "@/utils/helperFunction";

interface PaymentMethod {
  id: string;
  type: "wallet" | "card" | "paypal";
  name: string;
  description: string;
  icon: React.ReactNode;
  available: boolean;
}

const PaymentPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedMethod, setSelectedMethod] = useState("wallet");
  const [isProcessing, setIsProcessing] = useState(false);
  const [authCode, setAuthCode] = useState("");
  const [showAuthCode, setShowAuthCode] = useState(false);

  // Mock data
  const walletBalance = 5000;
  const totalAmount = 250;
  const printJobId = "job_001";

  const paymentMethods: PaymentMethod[] = [
    {
      id: "wallet",
      type: "wallet",
      name: "Wallet Balance",
      description: `₦${walletBalance.toLocaleString()} available`,
      icon: <Wallet className="h-5 w-5" />,
      available: walletBalance >= totalAmount,
    },
    {
      id: "card",
      type: "card",
      name: "Credit/Debit Card",
      description: "Visa, Mastercard, American Express",
      icon: <CreditCard className="h-5 w-5" />,
      available: true,
    },
    {
      id: "paypal",
      type: "paypal",
      name: "PayPal",
      description: "Pay with your PayPal account",
      icon: <CreditCard className="h-5 w-5" />,
      available: true,
    },
  ];

  const generateAuthCode = () => {
    // Generate a 6-digit authentication code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    return code;
  };

  const handlePayment = async () => {
    setIsProcessing(true);

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Generate authentication code
    const code = generateAuthCode();
    setAuthCode(code);
    setShowAuthCode(true);
    setIsProcessing(false);
  };

  const copyAuthCode = () => {
    navigator.clipboard.writeText(authCode);
  };

  const handlePrintJob = () => {
    // Navigate to print jobs or success page
    navigate(ROUTES.APP.PRINT_JOBS);
  };

  if (showAuthCode) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4">
          <ReusableCard title="Payment Successful!" className="text-center">
            <div className="space-y-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Print Job Ready!
                </h2>
                <p className="text-gray-600">
                  Your document has been queued for printing
                </p>
              </div>

              <ReusableCard title="Authentication Code" variant="outlined">
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-4xl font-mono font-bold text-blue-600 mb-2">
                      {authCode}
                    </div>
                    <p className="text-sm text-gray-500">
                      Use this code at the printer to release your job
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={copyAuthCode}
                      variant="outline"
                      className="flex-1"
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Code
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <QrCode className="h-4 w-4 mr-2" />
                      Show QR Code
                    </Button>
                  </div>
                </div>
              </ReusableCard>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-blue-900 mb-1">
                      Security Notice
                    </p>
                    <p className="text-blue-700">
                      Your authentication code is valid for 24 hours. Keep it
                      secure and don't share it with others.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  variant="outline"
                  onClick={() => navigate(ROUTES.APP.DASHBOARD)}
                  className="flex-1"
                >
                  Back to Dashboard
                </Button>
                <Button onClick={handlePrintJob} className="flex-1">
                  View Print Jobs
                </Button>
              </div>
            </div>
          </ReusableCard>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Payment</h1>
          <p className="text-gray-600 mt-2">
            Complete your payment to start printing
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payment Methods */}
          <div className="lg:col-span-2">
            <ReusableCard title="Select Payment Method">
              <RadioGroup
                value={selectedMethod}
                onValueChange={setSelectedMethod}
                className="space-y-4"
              >
                {paymentMethods.map((method) => (
                  <div
                    key={method.id}
                    className={`flex items-center space-x-3 p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedMethod === method.id
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    } ${
                      !method.available ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    onClick={() =>
                      method.available && setSelectedMethod(method.id)
                    }
                  >
                    <RadioGroupItem
                      value={method.id}
                      id={method.id}
                      disabled={!method.available}
                    />
                    <div className="flex items-center gap-3 flex-1">
                      {method.icon}
                      <div>
                        <p className="font-medium">{method.name}</p>
                        <p className="text-sm text-gray-500">
                          {method.description}
                        </p>
                      </div>
                    </div>
                    {!method.available && (
                      <Badge
                        variant="outline"
                        className="text-red-600 border-red-200"
                      >
                        Insufficient funds
                      </Badge>
                    )}
                  </div>
                ))}
              </RadioGroup>
            </ReusableCard>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <ReusableCard title="Order Summary">
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Print Job ID:</span>
                  <Badge variant="outline">{printJobId}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Document:</span>
                  <span className="text-sm">document.pdf</span>
                </div>
                <div className="flex justify-between">
                  <span>Pages:</span>
                  <span>5 pages</span>
                </div>
                <div className="flex justify-between">
                  <span>Copies:</span>
                  <span>2 copies</span>
                </div>
                <div className="flex justify-between">
                  <span>Color:</span>
                  <Badge variant="outline">Color</Badge>
                </div>
                <hr />
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total:</span>
                  <span>{handleFormatNaira(totalAmount)}</span>
                </div>
              </div>
            </ReusableCard>

            {/* Wallet Balance */}
            {selectedMethod === "wallet" && (
              <ReusableCard title="Wallet Balance" variant="outlined">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Wallet className="h-5 w-5 text-blue-600" />
                    <span>Available Balance</span>
                  </div>
                  <span className="font-semibold">
                    ₦{walletBalance.toLocaleString()}
                  </span>
                </div>
                {walletBalance < totalAmount && (
                  <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-800">
                      Insufficient balance. Add $
                      {(totalAmount - walletBalance).toFixed(2)} more to your
                      wallet.
                    </p>
                  </div>
                )}
              </ReusableCard>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                onClick={handlePayment}
                disabled={
                  isProcessing ||
                  (selectedMethod === "wallet" && walletBalance < totalAmount)
                }
                className="w-full"
                size="lg"
              >
                {isProcessing ? (
                  <>
                    <Clock className="h-4 w-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  `Pay $${totalAmount.toFixed(2)}`
                )}
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate("/preview")}
                className="w-full"
              >
                Back to Preview
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
