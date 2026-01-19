import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ReusableCard from "@/components/ui/cards";
import { toast } from "sonner";
import {
  Wallet,
  CreditCard,
  CheckCircle,
  Copy,
  QrCode,
  Shield,
  Clock,
  Loader2,
} from "lucide-react";
import { ROUTES } from "@/constants/routes";
import { handleFormatNaira } from "@/utils/helperFunction";
import {
  useCreatePaymentMutation,
  useGetPaymentByIdQuery,
  useLazyVerifyPaymentQuery,
} from "@/store/services/paymentsApi";
import { useGetWalletBalanceQuery } from "@/store/services/walletApi";
import { useGetPrintJobByIdQuery } from "@/store/services/printJobsApi";
import { PAYMENT_METHOD, PAYMENT_STATUS } from "@/types/payment";
import { COLOR_TYPE } from "@/types/printJob";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const Payment: React.FC = () => {
  const navigate = useNavigate();
  const { paymentId } = useParams<{ paymentId: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedMethod, setSelectedMethod] = useState<PAYMENT_METHOD>(
    PAYMENT_METHOD.WALLET
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [showAuthCode, setShowAuthCode] = useState(false);

  const { data: payment, isLoading: isLoadingPayment } =
    useGetPaymentByIdQuery(paymentId || "", { skip: !paymentId });

  const printJobId = payment?.printJobId || "";

  const {
    data: printJob,
    isLoading: isLoadingPrintJob,
    refetch: refetchPrintJob,
  } = useGetPrintJobByIdQuery(printJobId, { skip: !printJobId });
  const { data: wallet, isLoading: isLoadingWallet } =
    useGetWalletBalanceQuery();
  const [createPayment, { isLoading: isCreatingPayment }] =
    useCreatePaymentMutation();
  const [verifyPayment] = useLazyVerifyPaymentQuery();

  const walletBalance = wallet?.balance || 0;
  const totalAmount = payment?.amount || printJob?.cost || 0;
  const authCode = printJob?.code || "";

  useEffect(() => {
    const reference = searchParams.get("reference") || searchParams.get("trxref");

    if (reference && paymentId) {
      const verifyPaymentCallback = async () => {
        try {
          const result = await verifyPayment(reference).unwrap();

          if (result.status === 'completed') {
            toast.success(result.message || "Payment successful!");
            refetchPrintJob();
            setShowAuthCode(true);
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

      verifyPaymentCallback();
    }
  }, [searchParams, setSearchParams, verifyPayment, paymentId, refetchPrintJob]);


  useEffect(() => {
    if (payment?.status === PAYMENT_STATUS.COMPLETED && printJob?.code) {
      setShowAuthCode(true);
    }
  }, [payment, printJob]);


  const handlePayment = async () => {
    if (!paymentId) {
      toast.error("Payment ID is missing");
      return;
    }

    if (!printJobId) {
      toast.error("Print job ID is missing");
      return;
    }

    if (totalAmount <= 0) {
      toast.error("Invalid payment amount");
      return;
    }

    if (selectedMethod === PAYMENT_METHOD.WALLET && walletBalance < totalAmount) {
      toast.error("Insufficient wallet balance");
      return;
    }

    if (payment?.status === PAYMENT_STATUS.COMPLETED) {
      toast.info("This payment has already been completed");
      return;
    }

    setIsProcessing(true);

    try {
      const result = await createPayment({
        amount: totalAmount,
        paymentMethod: selectedMethod,
        printJobId: printJobId,
        description: `Payment for print job ${printJob?.jobNumber || printJobId}`,
      }).unwrap();

      if (selectedMethod === PAYMENT_METHOD.WALLET) {
        toast.success("Payment successful!");
        refetchPrintJob();
        setShowAuthCode(true);
      } else if (selectedMethod === PAYMENT_METHOD.PAYSTACK) {
        if ((result as any).authorizationUrl) {
          window.location.href = (result as any).authorizationUrl;
        } else {
          toast.error("Payment URL not available");
        }
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const copyAuthCode = () => {
    if (authCode) {
      navigator.clipboard.writeText(authCode);
      toast.success("Authentication code copied to clipboard!");
    }
  };

  const handlePrintJob = () => {
    navigate(ROUTES.APP.PRINT_JOBS);
  };

  if (isLoadingPayment || isLoadingPrintJob || isLoadingWallet) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-12 w-12 text-blue-500 animate-spin mb-4" />
            <p className="text-gray-600">Loading payment details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!paymentId || !payment) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <ReusableCard title="Error" className="text-center">
            <div className="py-8">
              <p className="text-gray-600 mb-4">
                Payment not found. Please check the payment ID.
              </p>
              <Button onClick={() => navigate(ROUTES.APP.PAYMENTS)}>
                View All Payments
              </Button>
            </div>
          </ReusableCard>
        </div>
      </div>
    );
  }

  if (!printJobId || !printJob) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <ReusableCard title="Error" className="text-center">
            <div className="py-8">
              <p className="text-gray-600 mb-4">
                Print job not found. Please create a print job first.
              </p>
              <Button onClick={() => navigate(ROUTES.APP.DASHBOARD)}>
                Go to Dashboard
              </Button>
            </div>
          </ReusableCard>
        </div>
      </div>
    );
  }

  if (showAuthCode && authCode) {
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
                <p className="text-sm text-gray-500 mt-2">
                  Job Number: {printJob.jobNumber}
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
                onValueChange={(value) =>
                  setSelectedMethod(value as PAYMENT_METHOD)
                }
                className="space-y-4"
              >
                <div
                  className={`flex items-center space-x-3 p-4 border rounded-lg cursor-pointer transition-colors ${selectedMethod === PAYMENT_METHOD.WALLET
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                    } ${walletBalance < totalAmount
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                    }`}
                  onClick={() =>
                    walletBalance >= totalAmount &&
                    setSelectedMethod(PAYMENT_METHOD.WALLET)
                  }
                >
                  <RadioGroupItem
                    value={PAYMENT_METHOD.WALLET}
                    id={PAYMENT_METHOD.WALLET}
                    disabled={walletBalance < totalAmount}
                  />
                  <div className="flex items-center gap-3 flex-1">
                    <Wallet className="h-5 w-5" />
                    <div>
                      <p className="font-medium">Wallet Balance</p>
                      <p className="text-sm text-gray-500">
                        ₦{walletBalance.toLocaleString()} available
                      </p>
                    </div>
                  </div>
                  {walletBalance < totalAmount && (
                    <Badge
                      variant="outline"
                      className="text-red-600 border-red-200"
                    >
                      Insufficient funds
                    </Badge>
                  )}
                </div>

                <div
                  className={`flex items-center space-x-3 p-4 border rounded-lg cursor-pointer transition-colors ${selectedMethod === PAYMENT_METHOD.PAYSTACK
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                    }`}
                  onClick={() => setSelectedMethod(PAYMENT_METHOD.PAYSTACK)}
                >
                  <RadioGroupItem
                    value={PAYMENT_METHOD.PAYSTACK}
                    id={PAYMENT_METHOD.PAYSTACK}
                  />
                  <div className="flex items-center gap-3 flex-1">
                    <CreditCard className="h-5 w-5" />
                    <div>
                      <p className="font-medium">Paystack</p>
                      <p className="text-sm text-gray-500">
                        Credit/Debit Card, Bank Transfer
                      </p>
                    </div>
                  </div>
                </div>
              </RadioGroup>
            </ReusableCard>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <ReusableCard title="Order Summary">
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Print Job ID:</span>
                  <Badge variant="outline">{printJob.jobNumber}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Document:</span>
                  <span className="text-sm truncate max-w-[150px]">
                    {printJob.fileName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Pages:</span>
                  <span>{printJob.pageCount || "N/A"} pages</span>
                </div>
                <div className="flex justify-between">
                  <span>Copies:</span>
                  <span>
                    {printJob.printConfig?.copies || printJob.copies || 1}{" "}
                    {(printJob.printConfig?.copies || printJob.copies || 1) === 1
                      ? "copy"
                      : "copies"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Color:</span>
                  <Badge variant="outline">
                    {(printJob.printConfig?.colorType || printJob.colorType) ===
                      COLOR_TYPE.COLOR
                      ? "Color"
                      : "Black & White"}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>Paper Size:</span>
                  <span className="text-sm">
                    {printJob.printConfig?.paperSize || printJob.paperSize || "N/A"}
                  </span>
                </div>
                <hr />
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total:</span>
                  <span>{handleFormatNaira(totalAmount)}</span>
                </div>
              </div>
            </ReusableCard>

            {/* Wallet Balance */}
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
                    Insufficient balance. Add ₦
                    {(totalAmount - walletBalance).toFixed(2)} more to your
                    wallet.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2 w-full"
                    onClick={() => navigate(ROUTES.APP.WALLET)}
                  >
                    Add Funds
                  </Button>
                </div>
              )}
            </ReusableCard>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                onClick={handlePayment}
                disabled={
                  isProcessing ||
                  isCreatingPayment ||
                  (selectedMethod === PAYMENT_METHOD.WALLET &&
                    walletBalance < totalAmount) ||
                  totalAmount <= 0 ||
                  payment?.status === PAYMENT_STATUS.COMPLETED
                }
                className="w-full"
                size="lg"
              >
                {isProcessing || isCreatingPayment ? (
                  <>
                    <Clock className="h-4 w-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : payment?.status === PAYMENT_STATUS.COMPLETED ? (
                  "Payment Completed"
                ) : (
                  `Pay ${handleFormatNaira(totalAmount)}`
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

export default Payment;
