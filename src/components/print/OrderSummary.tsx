import React from "react";
import { Badge } from "@/components/ui/badge";
import ReusableCard from "@/components/ui/cards";
import { PrintConfig, DUPLEX } from "@/types/printJob";

interface OrderSummaryProps {
  printConfig: PrintConfig;
  totalPrice: number;
}

export const OrderSummary: React.FC<OrderSummaryProps> = ({
  printConfig,
  totalPrice,
}) => {
  return (
    <ReusableCard title="Order Summary">
      <div className="space-y-4">
        <div className="flex justify-between">
          <span>Paper Size:</span>
          <Badge variant="outline">{printConfig.paperSize}</Badge>
        </div>
        <div className="flex justify-between">
          <span>Orientation:</span>
          <Badge variant="outline">{printConfig.orientation}</Badge>
        </div>
        <div className="flex justify-between">
          <span>Copies:</span>
          <span>{printConfig.copies}</span>
        </div>
        <div className="flex justify-between">
          <span>Color:</span>
          <Badge variant="outline">{printConfig.colorType}</Badge>
        </div>
        <div className="flex justify-between">
          <span>Resolution:</span>
          <span>{printConfig.resolution} DPI</span>
        </div>
        {(printConfig.duplex === DUPLEX.DOUBLE_SIDED_LONG_EDGE ||
          printConfig.duplex === DUPLEX.DOUBLE_SIDED_SHORT_EDGE) && (
            <div className="flex justify-between">
              <span>Duplex:</span>
              <Badge variant="outline">{printConfig.duplex}</Badge>
            </div>
          )}
        {printConfig.staple && (
          <div className="flex justify-between">
            <span>Staple:</span>
            <Badge variant="outline">Yes</Badge>
          </div>
        )}
        {printConfig.pageRange && (
          <div className="flex justify-between">
            <span>Page Range:</span>
            <Badge variant="outline">{printConfig.pageRange}</Badge>
          </div>
        )}
        <hr />
        <div className="flex justify-between text-lg font-semibold">
          <span>Total:</span>
          <span>₦{totalPrice.toLocaleString()}</span>
        </div>
      </div>
    </ReusableCard>
  );
};
