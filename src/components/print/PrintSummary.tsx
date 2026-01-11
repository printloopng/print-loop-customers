import React from "react";
import { Badge } from "@/components/ui/badge";
import ReusableCard from "@/components/ui/cards";
import { FileText, CheckCircle } from "lucide-react";
import { PAPER_SIZE, ORIENTATION, COLOR_TYPE, DUPLEX } from "@/types/printJob";

interface PrintOptions {
  paperSize: PAPER_SIZE;
  orientation: ORIENTATION;
  copies: number;
  colorType: COLOR_TYPE;
  resolution: number;
  duplex: DUPLEX;
  staple: boolean;
}

interface PrintSummaryProps {
  fileName: string;
  fileSize: string;
  totalPages: number;
  options: PrintOptions;
  totalPrice: number;
}

export const PrintSummary: React.FC<PrintSummaryProps> = ({
  fileName,
  fileSize,
  totalPages,
  options,
  totalPrice,
}) => {
  return (
    <ReusableCard title="Print Summary">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-gray-500" />
          <div>
            <p className="font-medium">{fileName}</p>
            <p className="text-sm text-gray-500">{fileSize}</p>
          </div>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Pages:</span>
            <span>{totalPages}</span>
          </div>
          <div className="flex justify-between">
            <span>Copies:</span>
            <span>{options.copies}</span>
          </div>
          <div className="flex justify-between">
            <span>Paper Size:</span>
            <Badge variant="outline">{options.paperSize}</Badge>
          </div>
          <div className="flex justify-between">
            <span>Orientation:</span>
            <Badge variant="outline">{options.orientation}</Badge>
          </div>
          <div className="flex justify-between">
            <span>Color:</span>
            <Badge variant="outline">{options.colorType}</Badge>
          </div>
          <div className="flex justify-between">
            <span>Resolution:</span>
            <span>{options.resolution} DPI</span>
          </div>
          {(options.duplex === DUPLEX.DOUBLE_SIDED_LONG_EDGE ||
            options.duplex === DUPLEX.DOUBLE_SIDED_SHORT_EDGE) && (
            <div className="flex justify-between">
              <span>Duplex:</span>
              <Badge variant="outline">{options.duplex}</Badge>
            </div>
          )}
          {options.staple && (
            <div className="flex justify-between">
              <span>Staple:</span>
              <Badge variant="outline">Yes</Badge>
            </div>
          )}
        </div>

        <hr />

        <div className="flex justify-between text-lg font-semibold">
          <span>Total:</span>
          <span>₦{totalPrice.toLocaleString()}</span>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <CheckCircle className="h-4 w-4 text-green-500" />
          <span className="text-green-700">Ready to print</span>
        </div>
      </div>
    </ReusableCard>
  );
};
