/**
 * This file demonstrates how to use the RTK Query services in your components
 * You can use these examples as a reference when implementing features
 */

import React from "react";
import {
  useGetUserPrintJobsQuery,
  useCreatePrintJobMutation,
  useUploadPrintFileMutation,
  useGetPrintOptionsQuery,
  useCancelPrintJobMutation,
} from "@/store/services/printJobsApi";

import {
  useCreatePaymentMutation,
  useGetUserPaymentsQuery,
  useLazyVerifyPaymentQuery,
} from "@/store/services/paymentsApi";

import {
  useFundWalletMutation,
  useGetWalletBalanceQuery,
  useGetWalletTransactionsQuery,
} from "@/store/services/walletApi";

import {
  useGetNotificationsQuery,
  useMarkNotificationReadMutation,
  useMarkAllNotificationsReadMutation,
} from "@/store/services/notificationsApi";

import { PRINT_STATUS, COLOR_TYPE, DUPLEX, ORIENTATION, PAPER_SIZE } from "@/types/printJob";

// Example: Print Jobs
export const PrintJobsExample = () => {
  // Get print jobs with pagination and filtering
  const {
    data: printJobs,
    isLoading,
    error,
  } = useGetUserPrintJobsQuery({
    page: 1,
    limit: 10,
    status: PRINT_STATUS.PENDING,
  });

  // Upload file mutation
  const [uploadFile, { isLoading: isUploading }] = useUploadPrintFileMutation();

  // Create print job mutation
  const [createPrintJob, { isLoading: isCreating }] = useCreatePrintJobMutation();

  // Get print options
  const { data: printOptions } = useGetPrintOptionsQuery();

  // Cancel print job mutation
  const [cancelPrintJob] = useCancelPrintJobMutation();

  const handleFileUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const result = await uploadFile(formData).unwrap();
      console.log("File uploaded:", result.fileURL);

      // After upload, create print job
      await createPrintJob({
        fileURL: result.fileURL,
        fileName: result.fileName,
        paperSize: PAPER_SIZE.A4,
        orientation: ORIENTATION.PORTRAIT,
        copies: 1,
        colorType: COLOR_TYPE.BLACK_WHITE,
        duplex: DUPLEX.SINGLE_SIDED,
        staple: false,
      }).unwrap();
    } catch (err) {
      console.error("Error:", err);
    }
  };

  const handleCancelJob = async (jobId: string) => {
    try {
      await cancelPrintJob({
        jobId,
        data: { reason: "User cancelled" },
      }).unwrap();
    } catch (err) {
      console.error("Error:", err);
    }
  };

  return (
    <div>
      {isLoading && <p>Loading print jobs...</p>}
      {printJobs?.data.map((job) => (
        <div key={job.id}>
          <p>Job #{job.jobNumber}</p>
          <p>Status: {job.status}</p>
          <button onClick={() => handleCancelJob(job.id)}>Cancel</button>
        </div>
      ))}
    </div>
  );
};

// Example: Payments
export const PaymentsExample = () => {
  const { data: payments } = useGetUserPaymentsQuery({ page: 1, limit: 10 });
  const [createPayment] = useCreatePaymentMutation();
  const [verifyPayment] = useLazyVerifyPaymentQuery();

  const handleCreatePayment = async () => {
    try {
      const result = await createPayment({
        amount: 1000,
        method: "CARD" as any,
        description: "Payment for print job",
      }).unwrap();
      console.log("Payment created:", result);
    } catch (err) {
      console.error("Error:", err);
    }
  };

  const handleVerifyPayment = async (reference: string) => {
    try {
      const result = await verifyPayment(reference).unwrap();
      if (result.verified) {
        console.log("Payment verified successfully");
      }
    } catch (err) {
      console.error("Error:", err);
    }
  };

  return (
    <div>
      <button onClick={handleCreatePayment}>Create Payment</button>
      {payments?.data.map((payment) => (
        <div key={payment.id}>
          <p>Reference: {payment.reference}</p>
          <p>Amount: ${payment.amount}</p>
          <p>Status: {payment.status}</p>
        </div>
      ))}
    </div>
  );
};

// Example: Wallet
export const WalletExample = () => {
  const { data: wallet } = useGetWalletBalanceQuery();
  const { data: transactions } = useGetWalletTransactionsQuery({ page: 1, limit: 10 });
  const [fundWallet] = useFundWalletMutation();

  const handleFundWallet = async () => {
    try {
      const result = await fundWallet({ amount: 5000 }).unwrap();
      // Redirect to payment gateway
      window.location.href = result.authorizationUrl;
    } catch (err) {
      console.error("Error:", err);
    }
  };

  return (
    <div>
      <p>Balance: ${wallet?.balance}</p>
      <button onClick={handleFundWallet}>Fund Wallet</button>
      {transactions?.data.map((transaction) => (
        <div key={transaction.id}>
          <p>
            {transaction.type}: ${transaction.amount}
          </p>
          <p>Status: {transaction.status}</p>
        </div>
      ))}
    </div>
  );
};

// Example: Notifications
export const NotificationsExample = () => {
  const { data: notifications } = useGetNotificationsQuery({ page: 1, limit: 10 });
  const [markAsRead] = useMarkNotificationReadMutation();
  const [markAllAsRead] = useMarkAllNotificationsReadMutation();

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await markAsRead(notificationId).unwrap();
    } catch (err) {
      console.error("Error:", err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead().unwrap();
    } catch (err) {
      console.error("Error:", err);
    }
  };

  return (
    <div>
      <button onClick={handleMarkAllAsRead}>Mark All as Read</button>
      {notifications?.data.map((notification) => (
        <div key={notification.id} onClick={() => handleMarkAsRead(notification.id)}>
          <p>{notification.title}</p>
          <p>{notification.message}</p>
          <p>{notification.isRead ? "Read" : "Unread"}</p>
        </div>
      ))}
    </div>
  );
};
