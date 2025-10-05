import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import ReusableCard from "@/components/ui/cards";
import { Badge } from "@/components/ui/badge";
import PublicHeader from "@/components/layout/PublicHeader";

interface PrintOptions {
  paperSize: string;
  orientation: string;
  copies: number;
  pageRange: string;
  staple: boolean;
  colorType: string;
  resolution: number;
  duplex: string;
}

const PrintOptionsPage: React.FC = () => {
  const navigate = useNavigate();
  const [options, setOptions] = useState<PrintOptions>({
    paperSize: "A4",
    orientation: "portrait",
    copies: 1,
    pageRange: "all",
    staple: false,
    colorType: "color",
    resolution: 300,
    duplex: "none",
  });

  const [customPageRange, setCustomPageRange] = useState("");

  const paperSizes = [
    { value: "A4", label: "A4 (210 × 297 mm)" },
    { value: "A3", label: "A3 (297 × 420 mm)" },
    { value: "Letter", label: "Letter (8.5 × 11 in)" },
    { value: "Legal", label: "Legal (8.5 × 14 in)" },
    { value: "A5", label: "A5 (148 × 210 mm)" },
  ];

  const orientations = [
    { value: "portrait", label: "Portrait" },
    { value: "landscape", label: "Landscape" },
  ];

  const colorTypes = [
    { value: "color", label: "Color" },
    { value: "grayscale", label: "Grayscale" },
    { value: "black-white", label: "Black & White" },
  ];

  const duplexOptions = [
    { value: "none", label: "Single-sided" },
    { value: "long-edge", label: "Double-sided (Long Edge)" },
    { value: "short-edge", label: "Double-sided (Short Edge)" },
  ];

  const calculatePrice = () => {
    let basePrice = 0.1; // Base price per page
    let totalPages = 1; // Default, would be calculated from actual document

    // Color pricing
    if (options.colorType === "color") {
      basePrice = 0.25;
    } else if (options.colorType === "grayscale") {
      basePrice = 0.15;
    }

    // Paper size multiplier
    const sizeMultiplier = {
      A5: 0.7,
      A4: 1.0,
      Letter: 1.0,
      Legal: 1.2,
      A3: 1.5,
    };

    basePrice *=
      sizeMultiplier[options.paperSize as keyof typeof sizeMultiplier] || 1.0;

    // Duplex reduces page count
    if (options.duplex !== "none") {
      totalPages = Math.ceil(totalPages / 2);
    }

    // Staple fee
    const stapleFee = options.staple ? 0.05 : 0;

    const totalPrice = basePrice * totalPages * options.copies + stapleFee;
    return Math.round(totalPrice * 100) / 100;
  };

  const handleContinue = () => {
    // Store options in Redux or context
    navigate("/preview");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <PublicHeader />
      <div className="py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Print Options</h1>
            <p className="text-gray-600 mt-2">Configure your print settings</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Print Options */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Settings */}
              <ReusableCard title="Basic Settings">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="paperSize">Paper Size</Label>
                    <Select
                      value={options.paperSize}
                      onValueChange={(value) =>
                        setOptions((prev) => ({ ...prev, paperSize: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {paperSizes.map((size) => (
                          <SelectItem key={size.value} value={size.value}>
                            {size.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="orientation">Orientation</Label>
                    <RadioGroup
                      value={options.orientation}
                      onValueChange={(value) =>
                        setOptions((prev) => ({ ...prev, orientation: value }))
                      }
                    >
                      {orientations.map((orientation) => (
                        <div
                          key={orientation.value}
                          className="flex items-center space-x-2"
                        >
                          <RadioGroupItem
                            value={orientation.value}
                            id={orientation.value}
                          />
                          <Label htmlFor={orientation.value}>
                            {orientation.label}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="copies">Number of Copies</Label>
                    <Input
                      id="copies"
                      type="number"
                      min="1"
                      max="100"
                      value={options.copies}
                      onChange={(e) =>
                        setOptions((prev) => ({
                          ...prev,
                          copies: parseInt(e.target.value) || 1,
                        }))
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="colorType">Color Type</Label>
                    <RadioGroup
                      value={options.colorType}
                      onValueChange={(value) =>
                        setOptions((prev) => ({ ...prev, colorType: value }))
                      }
                    >
                      {colorTypes.map((color) => (
                        <div
                          key={color.value}
                          className="flex items-center space-x-2"
                        >
                          <RadioGroupItem
                            value={color.value}
                            id={color.value}
                          />
                          <Label htmlFor={color.value}>{color.label}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                </div>
              </ReusableCard>

              {/* Advanced Settings */}
              <ReusableCard title="Advanced Settings">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label>Page Range</Label>
                    <RadioGroup
                      value={options.pageRange}
                      onValueChange={(value) =>
                        setOptions((prev) => ({ ...prev, pageRange: value }))
                      }
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="all" id="all" />
                        <Label htmlFor="all">All pages</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="custom" id="custom" />
                        <Label htmlFor="custom">Custom range</Label>
                      </div>
                    </RadioGroup>
                    {options.pageRange === "custom" && (
                      <Input
                        placeholder="e.g., 1-5, 8, 10-12"
                        value={customPageRange}
                        onChange={(e) => setCustomPageRange(e.target.value)}
                      />
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Resolution (DPI)</Label>
                    <div className="px-3">
                      <Slider
                        value={[options.resolution]}
                        onValueChange={(value) =>
                          setOptions((prev) => ({
                            ...prev,
                            resolution: value[0],
                          }))
                        }
                        min={150}
                        max={600}
                        step={50}
                        className="w-full"
                      />
                      <div className="flex justify-between text-sm text-gray-500 mt-1">
                        <span>150 DPI</span>
                        <span className="font-medium">
                          {options.resolution} DPI
                        </span>
                        <span>600 DPI</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Duplex Printing</Label>
                    <RadioGroup
                      value={options.duplex}
                      onValueChange={(value) =>
                        setOptions((prev) => ({ ...prev, duplex: value }))
                      }
                    >
                      {duplexOptions.map((duplex) => (
                        <div
                          key={duplex.value}
                          className="flex items-center space-x-2"
                        >
                          <RadioGroupItem
                            value={duplex.value}
                            id={duplex.value}
                          />
                          <Label htmlFor={duplex.value}>{duplex.label}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="staple"
                      checked={options.staple}
                      onCheckedChange={(checked) =>
                        setOptions((prev) => ({ ...prev, staple: !!checked }))
                      }
                    />
                    <Label htmlFor="staple">Staple documents</Label>
                  </div>
                </div>
              </ReusableCard>
            </div>

            {/* Price Summary */}
            <div className="space-y-6">
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
                  {options.duplex !== "none" && (
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
                    <span>${calculatePrice()}</span>
                  </div>
                </div>
              </ReusableCard>

              <div className="flex gap-4">
                <Button
                  variant="outline"
                  onClick={() => navigate("/")}
                  className="flex-1"
                >
                  Back
                </Button>
                <Button onClick={handleContinue} className="flex-1">
                  Preview & Pay
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrintOptionsPage;
