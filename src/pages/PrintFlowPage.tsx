import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useDropzone } from "react-dropzone";
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
import { Badge } from "@/components/ui/badge";
import ReusableCard from "@/components/ui/cards";
import Stepper from "@/components/ui/stepper";

import { useAppSelector } from "@/hooks/redux";
import {
  Upload,
  FileText,
  Image,
  File,
  X,
  CheckCircle,
  AlertCircle,
  RotateCw,
  ZoomIn,
  ZoomOut,
  ChevronLeft,
  ChevronRight,
  LogIn,
} from "lucide-react";
import { ROUTES } from "@/constants/routes";

interface UploadedFile {
  id: string;
  file: File;
  preview: string;
  size: number;
  type: string;
  status: "uploading" | "completed" | "error";
  progress: number;
}

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

const PrintFlowPage: React.FC = () => {
  const navigate = useNavigate();
  const { accessToken } = useAppSelector((state) => state.auth);

  const [currentStep, setCurrentStep] = useState(1);

  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);

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

  const [currentPage, setCurrentPage] = useState(1);
  const [zoom, setZoom] = useState(100);

  const steps = [
    {
      id: "upload",
      title: "Upload Document",
      description: "Select your PDF or DOCX file",
    },
    {
      id: "options",
      title: "Print Options",
      description: "Choose copies and pages",
    },
    {
      id: "preview",
      title: "Review & Confirm",
      description: "Verify your settings",
    },
    {
      id: "payment",
      title: "Your Print Code",
      description: "Save your unique code",
    },
  ];

  const acceptedFileTypes = {
    "application/pdf": [".pdf"],
    "image/jpeg": [".jpg", ".jpeg"],
    "image/png": [".png"],
    "image/gif": [".gif"],
    "application/msword": [".doc"],
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [
      ".docx",
    ],
    "application/vnd.ms-powerpoint": [".ppt"],
    "application/vnd.openxmlformats-officedocument.presentationml.presentation":
      [".pptx"],
    "text/plain": [".txt"],
  };

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

  const getFileIcon = (type: string) => {
    if (type.includes("pdf"))
      return <FileText className="h-8 w-8 text-red-500" />;
    if (type.includes("image"))
      return <Image className="h-8 w-8 text-blue-500" />;
    if (type.includes("word") || type.includes("document"))
      return <FileText className="h-8 w-8 text-blue-600" />;
    if (type.includes("powerpoint") || type.includes("presentation"))
      return <FileText className="h-8 w-8 text-orange-500" />;
    return <File className="h-8 w-8 text-gray-500" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setIsUploading(true);

    acceptedFiles.forEach((file) => {
      const fileId = Math.random().toString(36).substr(2, 9);
      const newFile: UploadedFile = {
        id: fileId,
        file,
        preview: URL.createObjectURL(file),
        size: file.size,
        type: file.type,
        status: "uploading",
        progress: 0,
      };

      setUploadedFiles((prev) => [...prev, newFile]);

      const interval = setInterval(() => {
        setUploadedFiles((prev) =>
          prev.map((f) =>
            f.id === fileId
              ? {
                  ...f,
                  progress: Math.min(f.progress + Math.random() * 30, 100),
                }
              : f
          )
        );
      }, 200);

      setTimeout(() => {
        clearInterval(interval);
        setUploadedFiles((prev) =>
          prev.map((f) =>
            f.id === fileId ? { ...f, status: "completed", progress: 100 } : f
          )
        );
        setIsUploading(false);
      }, 2000);
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedFileTypes,
    multiple: true,
    maxSize: 50 * 1024 * 1024,
  });

  const removeFile = (fileId: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== fileId));
  };

  const calculatePrice = () => {
    let basePrice = 50;
    let totalPages = 1;

    if (options.colorType === "color") {
      basePrice = 100;
    } else if (options.colorType === "grayscale") {
      basePrice = 75;
    }

    const sizeMultiplier = {
      A5: 0.7,
      A4: 1.0,
      Letter: 1.0,
      Legal: 1.2,
      A3: 1.5,
    };

    basePrice *=
      sizeMultiplier[options.paperSize as keyof typeof sizeMultiplier] || 1.0;

    if (options.duplex !== "none") {
      totalPages = Math.ceil(totalPages / 2);
    }

    const stapleFee = options.staple ? 25 : 0;
    const totalPrice = basePrice * totalPages * options.copies + stapleFee;
    return Math.round(totalPrice);
  };

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleProceedToPayment = () => {
    if (accessToken) {
      navigate(ROUTES.APP.PAYMENT);
    } else {
      navigate(ROUTES.AUTH.LOGIN);
    }
  };

  const completedFiles = uploadedFiles.filter((f) => f.status === "completed");

  const canProceedToNext = () => {
    switch (currentStep) {
      case 1:
        return completedFiles.length > 0 && !isUploading;
      case 2:
        return true;
      case 3:
        return true;
      default:
        return false;
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <ReusableCard
            title="Upload Your Document"
            description="Select a PDF or DOCX file to get started"
          >
            <div className="space-y-6">
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${
                  isDragActive
                    ? "border-black bg-gray-50"
                    : "border-gray-300 hover:border-gray-400"
                }`}
              >
                <input {...getInputProps()} />
                <Upload className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                {isDragActive ? (
                  <p className="text-black text-lg">Drop the files here...</p>
                ) : (
                  <div>
                    <p className="text-gray-600 mb-2 text-lg">
                      Drop your document here
                    </p>
                    <p className="text-gray-500 mb-4">or</p>
                    <Button
                      variant="outline"
                      size="lg"
                      className="border-black text-black hover:bg-black hover:text-white"
                    >
                      Browse Files
                    </Button>
                  </div>
                )}
              </div>

              <p className="text-sm text-gray-500 text-center">
                Supports PDF, DOC, DOCX, PPT, PPTX, JPG, PNG, GIF, TXT files up
                to 50MB
              </p>

              {uploadedFiles.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-medium">Uploaded Files</h3>
                  {uploadedFiles.map((file) => (
                    <div
                      key={file.id}
                      className="flex items-center gap-3 p-3 border rounded-lg"
                    >
                      {getFileIcon(file.type)}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {file.file.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatFileSize(file.size)} • {file.type}
                        </p>
                        {file.status === "uploading" && (
                          <div className="w-full bg-gray-200 rounded-full h-1 mt-2">
                            <div
                              className="bg-black h-1 rounded-full transition-all duration-300"
                              style={{ width: `${file.progress}%` }}
                            />
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {file.status === "completed" && (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        )}
                        {file.status === "error" && (
                          <AlertCircle className="h-5 w-5 text-red-500" />
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(file.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </ReusableCard>
        );

      case 2:
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
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
                    <span>₦{calculatePrice().toLocaleString()}</span>
                  </div>
                </div>
              </ReusableCard>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3">
              <ReusableCard title="Document Preview">
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b pb-4">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-gray-500" />
                        <span className="font-medium">
                          {completedFiles[0]?.file.name || "document.pdf"}
                        </span>
                        <Badge variant="outline">PDF</Badge>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setZoom((prev) => Math.max(prev - 25, 50))
                        }
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
                        onClick={() =>
                          setZoom((prev) => Math.min(prev + 25, 200))
                        }
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
                            Page {currentPage} of 5
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {options.orientation} • {options.paperSize}
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
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" />
                      Previous
                    </Button>

                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">
                        Page {currentPage} of 5
                      </span>
                    </div>

                    <Button
                      variant="outline"
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(prev + 1, 5))
                      }
                      disabled={currentPage === 5}
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
                      <p className="font-medium">
                        {completedFiles[0]?.file.name || "document.pdf"}
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatFileSize(completedFiles[0]?.size || 2400000)}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Pages:</span>
                      <span>5</span>
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
                  </div>

                  <hr />

                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total:</span>
                    <span>₦{calculatePrice().toLocaleString()}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-green-700">Ready to print</span>
                  </div>
                </div>
              </ReusableCard>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Print Station</h1>
          <p className="text-gray-600 mt-2">
            Upload, configure, and print your documents
          </p>
        </div>

        <div className="mb-8">
          <Stepper steps={steps} currentStep={currentStep} />
        </div>

        <div className="mb-8">{renderStepContent()}</div>

        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
          >
            Previous
          </Button>

          <div className="flex gap-4">
            {currentStep === 3 ? (
              <Button
                onClick={handleProceedToPayment}
                disabled={!canProceedToNext()}
                size="lg"
                className="bg-black hover:bg-gray-800"
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
            ) : (
              <Button
                onClick={handleNext}
                disabled={!canProceedToNext()}
                size="lg"
                className="bg-black hover:bg-gray-800"
              >
                Continue to {steps[currentStep]?.title}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrintFlowPage;
