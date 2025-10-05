import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ReusableCard from "@/components/ui/cards";
import {
  FileText,
  Clock,
  CheckCircle,
  X,
  Download,
  Eye,
  Copy,
  QrCode,
  AlertCircle,
} from "lucide-react";

interface PrintJob {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: string;
  pages: number;
  copies: number;
  status: "pending" | "processing" | "ready" | "completed" | "cancelled";
  createdAt: string;
  completedAt?: string;
  authCode?: string;
  price: number;
  options: {
    paperSize: string;
    orientation: string;
    colorType: string;
    resolution: number;
    duplex: string;
    staple: boolean;
  };
}

const PrintJobsPage: React.FC = () => {
  const [jobs] = useState<PrintJob[]>([
    {
      id: "job_001",
      fileName: "document.pdf",
      fileType: "PDF",
      fileSize: "2.4 MB",
      pages: 5,
      copies: 2,
      status: "ready",
      createdAt: "2024-01-15 10:30",
      authCode: "123456",
      price: 2.5,
      options: {
        paperSize: "A4",
        orientation: "portrait",
        colorType: "color",
        resolution: 300,
        duplex: "none",
        staple: true,
      },
    },
    {
      id: "job_002",
      fileName: "presentation.pptx",
      fileType: "PPTX",
      fileSize: "5.2 MB",
      pages: 12,
      copies: 1,
      status: "processing",
      createdAt: "2024-01-15 09:15",
      price: 3.0,
      options: {
        paperSize: "A4",
        orientation: "landscape",
        colorType: "color",
        resolution: 300,
        duplex: "long-edge",
        staple: false,
      },
    },
    {
      id: "job_003",
      fileName: "report.docx",
      fileType: "DOCX",
      fileSize: "1.8 MB",
      pages: 8,
      copies: 3,
      status: "completed",
      createdAt: "2024-01-14 16:45",
      completedAt: "2024-01-14 17:02",
      price: 4.2,
      options: {
        paperSize: "A4",
        orientation: "portrait",
        colorType: "grayscale",
        resolution: 300,
        duplex: "none",
        staple: true,
      },
    },
  ]);

  const getStatusColor = (status: PrintJob["status"]) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "processing":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "ready":
        return "bg-green-100 text-green-800 border-green-200";
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: PrintJob["status"]) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "processing":
        return <Clock className="h-4 w-4 animate-spin" />;
      case "ready":
        return <CheckCircle className="h-4 w-4" />;
      case "completed":
        return <CheckCircle className="h-4 w-4" />;
      case "cancelled":
        return <X className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const handleCancelJob = (jobId: string) => {
    // Handle job cancellation
    console.log("Cancelling job:", jobId);
  };

  const handleDownloadJob = (jobId: string) => {
    // Handle job download
    console.log("Downloading job:", jobId);
  };

  const copyAuthCode = (code: string) => {
    navigator.clipboard.writeText(code);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Print Jobs</h1>
          <p className="text-gray-600 mt-2">
            Manage your print jobs and track their status
          </p>
        </div>

        <div className="space-y-6">
          {jobs.length === 0 ? (
            <ReusableCard title="No Print Jobs" className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">
                You haven't created any print jobs yet
              </p>
            </ReusableCard>
          ) : (
            jobs.map((job) => (
              <ReusableCard key={job.id} title={`Job #${job.id}`}>
                <div className="space-y-4">
                  {/* Job Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-gray-500" />
                      <div>
                        <p className="font-medium">{job.fileName}</p>
                        <p className="text-sm text-gray-500">
                          {job.fileType} • {job.fileSize} • {job.pages} pages
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
                      <p className="font-medium">{job.options.paperSize}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Color</p>
                      <p className="font-medium">{job.options.colorType}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Price</p>
                      <p className="font-medium">${job.price.toFixed(2)}</p>
                    </div>
                  </div>

                  {/* Authentication Code */}
                  {job.authCode && job.status === "ready" && (
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
                            {job.authCode}
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => copyAuthCode(job.authCode!)}
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
                      <p>Created: {job.createdAt}</p>
                      {job.completedAt && <p>Completed: {job.completedAt}</p>}
                    </div>
                    <div className="flex gap-2">
                      {job.status === "ready" && (
                        <Button size="sm" variant="outline">
                          <Eye className="h-3 w-3 mr-1" />
                          View Details
                        </Button>
                      )}
                      {job.status === "completed" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDownloadJob(job.id)}
                        >
                          <Download className="h-3 w-3 mr-1" />
                          Download
                        </Button>
                      )}
                      {(job.status === "pending" ||
                        job.status === "processing") && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleCancelJob(job.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <X className="h-3 w-3 mr-1" />
                          Cancel
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
    </div>
  );
};

export default PrintJobsPage;
