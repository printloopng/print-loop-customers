import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ReusableCard from "@/components/ui/cards";
import { toast } from "sonner";
import {
  FileText,
  Clock,
  CheckCircle,
  X,
  Download,
  Copy,
  QrCode,
  AlertCircle
} from "lucide-react";
import { handleFormatNaira } from "@/utils/helperFunction";
import {
  useGetUserPrintJobsQuery,
  useCancelPrintJobMutation,
  useDeletePrintJobMutation
} from "@/store/services/printJobsApi";
import { PRINT_STATUS } from "@/types/printJob";

const PrintJobs: React.FC = () => {
  const [page] = useState(1);
  const [statusFilter] = useState<PRINT_STATUS | undefined>();

  const {
    data: printJobsData,
    isLoading,
    error
  } = useGetUserPrintJobsQuery({
    page,
    limit: 10,
    status: statusFilter
  });

  const [cancelPrintJob, { isLoading: isCancelling }] =
    useCancelPrintJobMutation();
  const [deletePrintJob, { isLoading: isDeleting }] =
    useDeletePrintJobMutation();

  const jobs = printJobsData?.data || [];

  const getStatusColor = (status: PRINT_STATUS) => {
    switch (status) {
      case PRINT_STATUS.PENDING:
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case PRINT_STATUS.PROCESSING:
        return "bg-blue-100 text-blue-800 border-blue-200";
      case PRINT_STATUS.COMPLETED:
        return "bg-green-100 text-green-800 border-green-200";
      case PRINT_STATUS.FAILED:
        return "bg-red-100 text-red-800 border-red-200";
      case PRINT_STATUS.CANCELLED:
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: PRINT_STATUS) => {
    switch (status) {
      case PRINT_STATUS.PENDING:
        return <Clock className="h-4 w-4" />;
      case PRINT_STATUS.PROCESSING:
        return <Clock className="h-4 w-4 animate-spin" />;
      case PRINT_STATUS.COMPLETED:
        return <CheckCircle className="h-4 w-4" />;
      case PRINT_STATUS.FAILED:
        return <AlertCircle className="h-4 w-4" />;
      case PRINT_STATUS.CANCELLED:
        return <X className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const handleCancelJob = async (jobId: string) => {
    try {
      await cancelPrintJob({
        jobId,
        data: { reason: "Cancelled by user" }
      }).unwrap();
      toast.success("Print job cancelled successfully");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to cancel print job");
    }
  };

  const handleDeleteJob = async (jobId: string) => {
    try {
      await deletePrintJob(jobId).unwrap();
      toast.success("Print job deleted successfully");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to delete print job");
    }
  };

  const handleDownloadJob = (jobId: string) => {
    console.log("Downloading job:", jobId);
    toast.info("Download feature coming soon");
  };

  const copyAuthCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success("Code copied to clipboard!");
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Print Jobs</h1>
        <p className="text-gray-600 mt-2">
          Manage your print jobs and track their status
        </p>
      </div>

      <div className="space-y-6">
        {isLoading ? (
          <ReusableCard title="Loading..." className="text-center py-12">
            <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4 animate-spin" />
            <p className="text-gray-500">Loading print jobs...</p>
          </ReusableCard>
        ) : error ? (
          <ReusableCard title="Error" className="text-center py-12">
            <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
            <p className="text-red-500">Failed to load print jobs</p>
          </ReusableCard>
        ) : jobs.length === 0 ? (
          <ReusableCard title="No Print Jobs" className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">
              You haven't created any print jobs yet
            </p>
          </ReusableCard>
        ) : (
          jobs.map((job) => (
            <ReusableCard key={job.id} title={`Job #${job.jobNumber}`}>
              <div className="space-y-4">
                {/* Job Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="font-medium">
                        {job.jobNumber || "Untitled Document"}
                      </p>

                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(job.status)}
                    <Badge className={getStatusColor(job.status)}>
                      {job.status}
                    </Badge>
                  </div>
                </div>

                {/* Job Details */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Copies</p>
                    <p className="font-medium">{job.copies}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Paper Size</p>
                    <p className="font-medium">{job.paperSize}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Color</p>
                    <p className="font-medium">{job.colorType}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Price</p>
                    <p className="font-medium">
                      {handleFormatNaira(
                        parseFloat(job.estimatedCost?.toString() || "0") ||
                        parseFloat(job.actualCost?.toString() || "0") ||
                        0
                      )}
                    </p>
                  </div>
                </div>

                {/* Authentication Code */}
                {job.code && job.status === PRINT_STATUS.COMPLETED && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-blue-900">
                          Authentication Code
                        </p>
                        <p className="text-sm text-blue-700">
                          Use this code at the printer to release your job
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-mono font-bold text-blue-600 mb-2">
                          {job.code}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => copyAuthCode(job.code!)}
                          >
                            <Copy className="h-3 w-3 mr-1" />
                            Copy
                          </Button>
                          <Button size="sm" variant="outline">
                            <QrCode className="h-3 w-3 mr-1" />
                            QR
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Job Actions */}
                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="text-sm text-gray-500">
                    <p>Created: {new Date(job.createdAt).toLocaleString()}</p>
                    {job.completedAt && (
                      <p>
                        Completed: {new Date(job.completedAt).toLocaleString()}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {job.status === PRINT_STATUS.COMPLETED && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDownloadJob(job.id)}
                      >
                        <Download className="h-3 w-3 mr-1" />
                        Download
                      </Button>
                    )}
                    {(job.status === PRINT_STATUS.PENDING ||
                      job.status === PRINT_STATUS.PROCESSING) && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleCancelJob(job.id)}
                          disabled={isCancelling}
                          className="text-red-600 hover:text-red-700"
                        >
                          <X className="h-3 w-3 mr-1" />
                          {isCancelling ? "Cancelling..." : "Cancel"}
                        </Button>
                      )}
                    {job.status === PRINT_STATUS.CANCELLED && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteJob(job.id)}
                        disabled={isDeleting}
                        className="text-red-600 hover:text-red-700"
                      >
                        <X className="h-3 w-3 mr-1" />
                        {isDeleting ? "Deleting..." : "Delete"}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </ReusableCard>
          ))
        )}
      </div>
    </div>
  );
};

export default PrintJobs;
