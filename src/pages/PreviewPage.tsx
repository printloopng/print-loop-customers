import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ReusableCard from "@/components/ui/cards";
import {
  FileText,
  RotateCw,
  ZoomIn,
  ZoomOut,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  LogIn,
} from "lucide-react";
import { ROUTES } from "@/constants/routes";
import { useAppSelector } from "@/hooks/redux";

interface PrintJob {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: string;
  pages: number;
  options: {
    paperSize: string;
    orientation: string;
    copies: number;
    colorType: string;
    resolution: number;
    duplex: string;
    staple: boolean;
  };
  price: number;
  status: "pending" | "processing" | "ready" | "completed" | "cancelled";
}

const PreviewPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [zoom, setZoom] = useState(100);
  const { accessToken } = useAppSelector((state) => state.auth);

  const printJob: PrintJob = {
    id: "job_001",
    fileName: "document.pdf",
    fileType: "PDF",
    fileSize: "2.4 MB",
    pages: 5,
    options: {
      paperSize: "A4",
      orientation: "portrait",
      copies: 2,
      colorType: "color",
      resolution: 300,
      duplex: "none",
      staple: true,
    },
    price: 2.5,
    status: "pending",
  };

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 25, 200));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 25, 50));
  };

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, printJob.pages));
  };

  const handleProceedToPayment = () => {
    if (accessToken) {
      navigate(ROUTES.APP.PAYMENT);
    } else {
      navigate(ROUTES.AUTH.LOGIN);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Document Preview</h1>
          <p className="text-gray-600 mt-2">
            Review your document and print settings before proceeding
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <ReusableCard title="Document Preview">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b pb-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-gray-500" />
                      <span className="font-medium">{printJob.fileName}</span>
                      <Badge variant="outline">{printJob.fileType}</Badge>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleZoomOut}
                      disabled={zoom <= 50}
                    >
                      <ZoomOut className="h-4 w-4" />
                    </Button>
                    <span className="text-sm font-medium min-w-[60px] text-center">
                      {zoom}%
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleZoomIn}
                      disabled={zoom >= 200}
                    >
                      <ZoomIn className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <RotateCw className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="border rounded-lg bg-white p-8 min-h-[600px] flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-64 h-80 bg-gray-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
                      <div className="text-center">
                        <FileText className="h-16 w-16 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-500">
                          Page {currentPage} of {printJob.pages}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {printJob.options.orientation} •{" "}
                          {printJob.options.paperSize}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500">
                      Document preview will be displayed here
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <Button
                    variant="outline"
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Previous
                  </Button>

                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">
                      Page {currentPage} of {printJob.pages}
                    </span>
                  </div>

                  <Button
                    variant="outline"
                    onClick={handleNextPage}
                    disabled={currentPage === printJob.pages}
                  >
                    Next
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            </ReusableCard>
          </div>

          <div className="space-y-6">
            <ReusableCard title="Print Summary">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="font-medium">{printJob.fileName}</p>
                    <p className="text-sm text-gray-500">{printJob.fileSize}</p>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Pages:</span>
                    <span>{printJob.pages}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Copies:</span>
                    <span>{printJob.options.copies}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Paper Size:</span>
                    <Badge variant="outline">
                      {printJob.options.paperSize}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Orientation:</span>
                    <Badge variant="outline">
                      {printJob.options.orientation}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Color:</span>
                    <Badge variant="outline">
                      {printJob.options.colorType}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Resolution:</span>
                    <span>{printJob.options.resolution} DPI</span>
                  </div>
                  {printJob.options.duplex !== "none" && (
                    <div className="flex justify-between">
                      <span>Duplex:</span>
                      <Badge variant="outline">{printJob.options.duplex}</Badge>
                    </div>
                  )}
                  {printJob.options.staple && (
                    <div className="flex justify-between">
                      <span>Staple:</span>
                      <Badge variant="outline">Yes</Badge>
                    </div>
                  )}
                </div>

                <hr />

                <div className="flex justify-between text-lg font-semibold">
                  <span>Total:</span>
                  <span>${printJob.price}</span>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-green-700">Ready to print</span>
                </div>
              </div>
            </ReusableCard>

            <div className="space-y-3">
              <Button
                onClick={handleProceedToPayment}
                className="w-full"
                size="lg"
              >
                {accessToken ? (
                  "Proceed to Payment"
                ) : (
                  <>
                    <LogIn className="h-4 w-4 mr-2" />
                    Login to Pay
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate("/print-options")}
                className="w-full"
              >
                Edit Options
              </Button>
              <Button
                variant="ghost"
                onClick={() => navigate("/")}
                className="w-full"
              >
                Upload New Document
              </Button>
              {accessToken && (
                <Button
                  variant="ghost"
                  onClick={() => navigate(ROUTES.APP.PRINT_JOBS)}
                  className="w-full"
                >
                  View My Print Jobs
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewPage;
