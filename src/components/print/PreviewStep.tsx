import React from "react";
import { Badge } from "@/components/ui/badge";
import ReusableCard from "@/components/ui/cards";
import { FileText, CheckCircle } from "lucide-react";
import { PAPER_SIZE, ORIENTATION } from "@/types/printJob";

interface PreviewStepProps {
  fileName: string;
  fileBase64: string;
  fileType: string;
  currentPage: number;
  pageCount: any;
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
  fileType,
  pageCount,
  paperSize,
  orientation
}) => {
  const getFileTypeLabel = () => {
    if (fileType === "application/pdf") return "PDF Document";
    if (fileType.startsWith("image/")) return "Image File";
    if (fileType.includes("word") || fileType.includes("document"))
      return "Word Document";
    if (fileType.includes("spreadsheet") || fileType.includes("excel"))
      return "Excel Spreadsheet";
    if (fileType.includes("presentation") || fileType.includes("powerpoint"))
      return "PowerPoint Presentation";
    if (fileType === "text/plain") return "Text File";
    return "Document";
  };

  const getFileTypeIcon = () => {
    if (fileType === "application/pdf") return "📄";
    if (fileType.startsWith("image/")) return "🖼️";
    if (fileType.includes("word") || fileType.includes("document")) return "📝";
    if (fileType.includes("spreadsheet") || fileType.includes("excel"))
      return "📊";
    if (fileType.includes("presentation") || fileType.includes("powerpoint"))
      return "📽️";
    return "📄";
  };
  return (
    <ReusableCard title="Document Details">
      <div className="flex flex-col gap-4">
        {/* File Info */}
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
          <div className="text-4xl">{getFileTypeIcon()}</div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="h-5 w-5 text-gray-500" />
              <span className="font-medium text-lg">{fileName}</span>
              <Badge variant="outline">{getFileTypeLabel()}</Badge>
            </div>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <span className="font-medium">Pages:</span>
                <span>{pageCount || "N/A"}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">Paper Size:</span>
                <Badge variant="outline">{paperSize}</Badge>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium">Orientation:</span>
                <Badge variant="outline" className="capitalize">
                  {orientation}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="flex items-center gap-2 p-4 bg-green-50 border border-green-200 rounded-lg">
          <CheckCircle className="h-5 w-5 text-green-600" />
          <div>
            <p className="font-medium text-green-900">Document Ready</p>
            <p className="text-sm text-green-700">
              Your document is ready to be processed and printed. Review your
              print settings and proceed to payment.
            </p>
          </div>
        </div>
      </div>
    </ReusableCard>
  );
};
