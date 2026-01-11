import React from "react";
import { Badge } from "@/components/ui/badge";
import ReusableCard from "@/components/ui/cards";
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

interface OrderSummaryProps {
  options: PrintOptions;
  totalPrice: number;
}

export const OrderSummary: React.FC<OrderSummaryProps> = ({
  options,
  totalPrice,
}) => {
  return (
    <ReusableCard title="Order Summary">
      <div className="space-y-4">
        <div className="flex justify-between">
          <span>Paper Size:</span>
          <Badge variant="outline">{options.paperSize}</Badge>
        </div>
        <div className="flex justify-between">
          <span>Orientation:</span>
          <Badge variant="outline">{options.orientation}</Badge>
        </div>
        <div className="flex justify-between">
          <span>Copies:</span>
          <span>{options.copies}</span>
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
        <hr />
        <div className="flex justify-between text-lg font-semibold">
          <span>Total:</span>
          <span>₦{totalPrice.toLocaleString()}</span>
        </div>
      </div>
    </ReusableCard>
  );
};
