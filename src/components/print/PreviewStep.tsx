import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ReusableCard from "@/components/ui/cards";
import {
  FileText,
  RotateCw,
  ZoomIn,
  ZoomOut,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { PAPER_SIZE, ORIENTATION } from "@/types/printJob";

interface PreviewStepProps {
  fileName: string;
  fileBase64: string;
  fileType: string;
  currentPage: number;
  totalPages: number;
  zoom: number;
  paperSize: PAPER_SIZE;
  orientation: ORIENTATION;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onPreviousPage: () => void;
  onNextPage: () => void;
}

export const PreviewStep: React.FC<PreviewStepProps> = ({
  fileName,
  fileBase64,
  fileType,
  currentPage,
  totalPages,
  zoom,
  paperSize,
  orientation,
  onZoomIn,
  onZoomOut,
  onPreviousPage,
  onNextPage
}) => {
  return (
    <ReusableCard title="Document Preview">
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b pb-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-gray-500" />
              <span className="font-medium">{fileName}</span>
              <Badge variant="outline">PDF</Badge>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onZoomOut}
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
              onClick={onZoomIn}
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
          {fileBase64 ? (
            <div className="text-center">
              {fileType.startsWith("image/") ? (
                <div className="max-w-full max-h-[500px] overflow-auto">
                  <img
                    src={`data:${fileType};base64,${fileBase64}`}
                    alt={fileName}
                    className="max-w-full max-h-full object-contain"
                    style={{ transform: `scale(${zoom / 100})` }}
                  />
                </div>
              ) : fileType === "application/pdf" ? (
                <div className="text-center">
                  <FileText className="h-16 w-16 text-red-400 mx-auto mb-4" />
                  <p className="text-sm text-gray-600 mb-2">PDF Preview</p>
                  <p className="text-xs text-gray-500">
                    Page {currentPage} of {totalPages}
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    {orientation} • {paperSize}
                  </p>
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg max-w-md mx-auto">
                    <p className="text-sm text-gray-600">
                      PDF preview functionality can be implemented with
                      react-pdf library
                    </p>
                  </div>
                </div>
              ) : fileType.includes("word") || fileType.includes("document") ? (
                <div className="text-center">
                  <FileText className="h-16 w-16 text-blue-500 mx-auto mb-4" />
                  <p className="text-sm text-gray-600 mb-2">
                    Word Document Ready
                  </p>
                  <p className="text-xs text-gray-500 mb-4">{fileName}</p>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto">
                    <p className="text-sm text-blue-800">
                      Document preview will be processed during printing. Your
                      Word document is ready to be converted and printed.
                    </p>
                  </div>
                </div>
              ) : fileType.includes("spreadsheet") ||
                fileType.includes("excel") ? (
                <div className="text-center">
                  <FileText className="h-16 w-16 text-green-500 mx-auto mb-4" />
                  <p className="text-sm text-gray-600 mb-2">
                    Excel Spreadsheet Ready
                  </p>
                  <p className="text-xs text-gray-500 mb-4">{fileName}</p>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 max-w-md mx-auto">
                    <p className="text-sm text-green-800">
                      Spreadsheet preview will be processed during printing.
                      Your Excel file is ready to be converted and printed.
                    </p>
                  </div>
                </div>
              ) : fileType.includes("presentation") ||
                fileType.includes("powerpoint") ? (
                <div className="text-center">
                  <FileText className="h-16 w-16 text-orange-500 mx-auto mb-4" />
                  <p className="text-sm text-gray-600 mb-2">
                    PowerPoint Presentation Ready
                  </p>
                  <p className="text-xs text-gray-500 mb-4">{fileName}</p>
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 max-w-md mx-auto">
                    <p className="text-sm text-orange-800">
                      Presentation preview will be processed during printing.
                      Your PowerPoint file is ready to be converted and printed.
                    </p>
                  </div>
                </div>
              ) : fileType === "text/plain" ? (
                <div className="text-center">
                  <FileText className="h-16 w-16 text-gray-500 mx-auto mb-4" />
                  <p className="text-sm text-gray-600 mb-2">Text File Ready</p>
                  <p className="text-xs text-gray-500 mb-4">{fileName}</p>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 max-w-md mx-auto">
                    <p className="text-sm text-gray-800">
                      Text file preview will be processed during printing. Your
                      document is ready to be formatted and printed.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-sm text-gray-600 mb-2">
                    File Ready for Processing
                  </p>
                  <p className="text-xs text-gray-500 mb-4">{fileName}</p>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 max-w-md mx-auto">
                    <p className="text-sm text-gray-800">
                      This file type will be processed during printing. Your
                      document is ready to be converted and printed.
                    </p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center">
              <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-sm text-gray-500">
                No file selected for preview
              </p>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={onPreviousPage}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </span>
          </div>

          <Button
            variant="outline"
            onClick={onNextPage}
            disabled={currentPage === totalPages}
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>
    </ReusableCard>
  );
};
