import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import ReusableCard from "@/components/ui/cards";
import {
  PAPER_SIZE,
  ORIENTATION,
  COLOR_TYPE,
  DUPLEX,
  PrintOptions as PrintOptionsType
} from "@/types/printJob";

interface PrintOptions {
  paperSize: PAPER_SIZE;
  orientation: ORIENTATION;
  copies: number;
  pageRange: string;
  staple: boolean;
  colorType: COLOR_TYPE;
  resolution: number;
  duplex: DUPLEX;
}

interface PrintOptionsStepProps {
  options: PrintOptions;
  customPageRange: string;
  printOptions?: PrintOptionsType;
  onOptionsChange: (options: Partial<PrintOptions>) => void;
  onCustomPageRangeChange: (value: string) => void;
}

const getDefaultPaperSizes = () => [
  { value: PAPER_SIZE.A4, label: "A4 (210 × 297 mm)" },
  { value: PAPER_SIZE.A3, label: "A3 (297 × 420 mm)" },
  { value: PAPER_SIZE.LETTER, label: "Letter (8.5 × 11 in)" },
  { value: PAPER_SIZE.LEGAL, label: "Legal (8.5 × 14 in)" },
  { value: PAPER_SIZE.TABLOID, label: "Tabloid (11 × 17 in)" }
];

const getDefaultOrientations = () => [
  { value: ORIENTATION.PORTRAIT, label: "Portrait" },
  { value: ORIENTATION.LANDSCAPE, label: "Landscape" }
];

const getDefaultColorTypes = () => [
  { value: COLOR_TYPE.COLOR, label: "Color" },
  { value: COLOR_TYPE.BLACK_WHITE, label: "Black & White" }
];

const getDefaultDuplexOptions = () => [
  { value: DUPLEX.SINGLE_SIDED, label: "Single-sided" },
  { value: DUPLEX.DOUBLE_SIDED_LONG_EDGE, label: "Double-sided (Long Edge)" },
  { value: DUPLEX.DOUBLE_SIDED_SHORT_EDGE, label: "Double-sided (Short Edge)" }
];

export const PrintOptionsStep: React.FC<PrintOptionsStepProps> = ({
  options,
  customPageRange,
  printOptions,
  onOptionsChange,
  onCustomPageRangeChange
}) => {
  const paperSizes = printOptions?.paperSizes || getDefaultPaperSizes();
  const orientations = printOptions?.orientations || getDefaultOrientations();
  const colorTypes = printOptions?.colorTypes || getDefaultColorTypes();
  const duplexOptions =
    printOptions?.duplexOptions || getDefaultDuplexOptions();
  const maxCopies = printOptions?.maxCopies || 100;

  return (
    <>
      <ReusableCard title="Basic Settings">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="paperSize">Paper Size</Label>
            <Select
              value={options.paperSize}
              onValueChange={(value) =>
                onOptionsChange({ paperSize: value as PAPER_SIZE })
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
                onOptionsChange({ orientation: value as ORIENTATION })
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
                  <Label htmlFor={orientation.value}>{orientation.label}</Label>
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
              max={maxCopies}
              value={options.copies}
              onChange={(e) =>
                onOptionsChange({ copies: parseInt(e.target.value) || 1 })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="colorType">Color Type</Label>
            <RadioGroup
              value={
                options.colorType === COLOR_TYPE.COLOR ? "color" : "black_white"
              }
              onValueChange={(value) =>
                onOptionsChange({
                  colorType:
                    value === "color"
                      ? COLOR_TYPE.COLOR
                      : COLOR_TYPE.BLACK_WHITE
                })
              }
            >
              {colorTypes.map((color) => (
                <div key={color.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={color.value} id={color.value} />
                  <Label htmlFor={color.value}>{color.label}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        </div>
      </ReusableCard>

      <ReusableCard title="Advanced Settings">
        <div className="space-y-6">
          <div className="space-y-2">
            <Label>Page Range</Label>
            <RadioGroup
              value={options.pageRange}
              onValueChange={(value) => onOptionsChange({ pageRange: value })}
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
                onChange={(e) => onCustomPageRangeChange(e.target.value)}
              />
            )}
          </div>

          <div className="space-y-2">
            <Label>Resolution (DPI)</Label>
            <div className="px-3">
              <Slider
                value={[options.resolution]}
                onValueChange={(value) =>
                  onOptionsChange({ resolution: value[0] })
                }
                min={150}
                max={600}
                step={50}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-500 mt-1">
                <span>150 DPI</span>
                <span className="font-medium">{options.resolution} DPI</span>
                <span>600 DPI</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Duplex Printing</Label>
            <RadioGroup
              value={
                options.duplex === DUPLEX.SINGLE_SIDED
                  ? "single_sided"
                  : options.duplex === DUPLEX.DOUBLE_SIDED_LONG_EDGE
                  ? "double_sided_long_edge"
                  : options.duplex === DUPLEX.DOUBLE_SIDED_SHORT_EDGE
                  ? "double_sided_short_edge"
                  : "single_sided"
              }
              onValueChange={(value) =>
                onOptionsChange({
                  duplex:
                    value === "single_sided"
                      ? DUPLEX.SINGLE_SIDED
                      : value === "double_sided_long_edge"
                      ? DUPLEX.DOUBLE_SIDED_LONG_EDGE
                      : value === "double_sided_short_edge"
                      ? DUPLEX.DOUBLE_SIDED_SHORT_EDGE
                      : DUPLEX.SINGLE_SIDED
                })
              }
            >
              {duplexOptions.map((duplex) => (
                <div key={duplex.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={duplex.value} id={duplex.value} />
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
                onOptionsChange({ staple: !!checked })
              }
            />
            <Label htmlFor="staple">Staple documents</Label>
          </div>
        </div>
      </ReusableCard>
    </>
  );
};
