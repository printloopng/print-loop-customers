import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ReusableCard from "@/components/ui/cards";
import {
  CreditCard,
  Wallet,
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
  ArrowRight,
} from "lucide-react";
import { ROUTES } from "@/constants/routes";
import { handleFormatNaira } from "@/utils/helperFunction";
import { useGetUserPaymentsQuery } from "@/store/services/paymentsApi";
import { PAYMENT_STATUS, PAYMENT_METHOD } from "@/types/payment";

const PaymentsPage: React.FC = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data: paymentsData, isLoading } = useGetUserPaymentsQuery({
    page,
    limit,
  });

  const payments = paymentsData?.data || [];
  const totalPages = paymentsData?.meta?.totalPages || 1;

  const getStatusIcon = (status: PAYMENT_STATUS) => {
    switch (status) {
      case PAYMENT_STATUS.COMPLETED:
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case PAYMENT_STATUS.FAILED:
        return <XCircle className="h-4 w-4 text-red-500" />;
      case PAYMENT_STATUS.PENDING:
      case PAYMENT_STATUS.PROCESSING:
        return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: PAYMENT_STATUS) => {
    const variants: Record<PAYMENT_STATUS, string> = {
      [PAYMENT_STATUS.COMPLETED]: "bg-green-50 text-green-700 border-green-200",
      [PAYMENT_STATUS.FAILED]: "bg-red-50 text-red-700 border-red-200",
      [PAYMENT_STATUS.PENDING]: "bg-yellow-50 text-yellow-700 border-yellow-200",
      [PAYMENT_STATUS.PROCESSING]: "bg-blue-50 text-blue-700 border-blue-200",
      [PAYMENT_STATUS.CANCELLED]: "bg-gray-50 text-gray-700 border-gray-200",
    };

    return (
      <Badge variant="outline" className={variants[status]}>
        {status}
      </Badge>
    );
  };

  const getMethodIcon = (method: PAYMENT_METHOD) => {
    switch (method) {
      case PAYMENT_METHOD.WALLET:
        return <Wallet className="h-4 w-4" />;
      case PAYMENT_METHOD.CARD:
        return <CreditCard className="h-4 w-4" />;
      default:
        return <CreditCard className="h-4 w-4" />;
    }
  };

  const handlePay = (paymentId: string) => {
    navigate(`${ROUTES.APP.PAYMENTS}/${paymentId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Payments</h1>
          <p className="text-gray-600 mt-2">
            View and manage all your payment transactions
          </p>
        </div>

        <ReusableCard title="Payment History">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="h-12 w-12 text-blue-500 animate-spin mb-4" />
              <p className="text-gray-600">Loading payments...</p>
            </div>
          ) : payments.length === 0 ? (
            <div className="text-center py-20">
              <CreditCard className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">No payments found</p>
              <Button onClick={() => navigate(ROUTES.APP.DASHBOARD)}>
                Go to Dashboard
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {payments.map((payment) => (
                <div
                  key={payment.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      {getMethodIcon(payment.method)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium">
                          {payment.description || `Payment ${payment.reference}`}
                        </p>
                        {getStatusIcon(payment.status)}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>Ref: {payment.reference}</span>
                        {payment.printJobId && (
                          <span>Job: {payment.printJobId.slice(0, 8)}...</span>
                        )}
                        <span>
                          {new Date(payment.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-semibold text-lg">
                        {handleFormatNaira(payment.amount)}
                      </p>
                      {getStatusBadge(payment.status)}
                    </div>

                    {payment.status === PAYMENT_STATUS.PENDING && (
                      <Button
                        onClick={() => handlePay(payment.id)}
                        size="sm"
                      >
                        Pay Now
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    Previous
                  </Button>
                  <span className="text-sm text-gray-600">
                    Page {page} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page >= totalPages}
                  >
                    Next
                  </Button>
                </div>
              )}
            </div>
          )}
        </ReusableCard>
      </div>
    </div>
  );
};

export default PaymentsPage;
