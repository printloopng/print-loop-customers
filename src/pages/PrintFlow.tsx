import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Stepper from "@/components/ui/stepper";
import { toast } from "sonner";
import { LogIn } from "lucide-react";
import { useAppSelector } from "@/hooks/redux";
import {
  useGetPrintOptionsQuery,
  useCreatePrintJobMutation
} from "@/store/services/printJobsApi";
import { PAPER_SIZE, ORIENTATION, COLOR_TYPE, DUPLEX } from "@/types/printJob";
import {
  FileUploadStep,
  OrderSummary,
  PrintOptionsStep,
  PreviewStep,
  PrintSummary
} from "@/components/print";
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
  paperSize: PAPER_SIZE;
  orientation: ORIENTATION;
  copies: number;
  pageRange: string;
  staple: boolean;
  colorType: COLOR_TYPE;
  resolution: number;
  duplex: DUPLEX;
}

const PrintFlow: React.FC = () => {
  const navigate = useNavigate();
  const { accessToken } = useAppSelector((state) => state.auth);

  const [currentStep, setCurrentStep] = useState(1);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileBase64, setFileBase64] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);

  const [options, setOptions] = useState<PrintOptions>({
    paperSize: PAPER_SIZE.A4,
    orientation: ORIENTATION.PORTRAIT,
    copies: 1,
    pageRange: "all",
    staple: false,
    colorType: COLOR_TYPE.COLOR,
    resolution: 600,
    duplex: DUPLEX.SINGLE_SIDED
  });
  const [customPageRange, setCustomPageRange] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [zoom, setZoom] = useState(100);

  const { data: printOptions, error: optionsError } = useGetPrintOptionsQuery();
  const [createPrintJob, { isLoading: isCreatingJob }] =
    useCreatePrintJobMutation();

  React.useEffect(() => {
    if (printOptions) {
      console.log("Print options loaded:", printOptions);
    }
    if (optionsError) {
      console.error("Print options error:", optionsError);
    }
  }, [printOptions, optionsError]);

  const steps = [
    {
      id: "upload",
      title: "Upload Document",
      description: "Select your PDF or DOCX file"
    },
    {
      id: "options",
      title: "Print Options",
      description: "Choose copies and pages"
    },
    {
      id: "preview",
      title: "Review & Confirm",
      description: "Verify your settings"
    },
    {
      id: "payment",
      title: "Your Print Code",
      description: "Save your unique code"
    }
  ];

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = reader.result as string;
        resolve(base64String); // Return full data URL format
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setUploadedFiles([]);
    setSelectedFile(null);
    setFileBase64("");

    const file = acceptedFiles[0];
    if (!file) return;

    // Convert file to base64 for preview
    const base64 = await fileToBase64(file);

    const fileId = Math.random().toString(36).substr(2, 9);
    const newFile: UploadedFile = {
      id: fileId,
      file,
      preview: URL.createObjectURL(file),
      size: file.size,
      type: file.type,
      status: "completed",
      progress: 100
    };

    setUploadedFiles([newFile]);
    setSelectedFile(file);
    setFileBase64(base64);
    toast.success("File selected successfully!");
  }, []);

  const removeFile = (fileId: string) => {
    setUploadedFiles((prev) =>
      prev.filter((uploadedFile) => uploadedFile.id !== fileId)
    );
    setSelectedFile(null);
    setFileBase64("");
  };

  const calculatePrice = () => {
    const defaultPricing = {
      colorPricePerPage: 25,
      blackWhitePricePerPage: 10,
      staplePrice: 0.05
    };

    if (!printOptions) {
      return defaultPricing.blackWhitePricePerPage;
    }

    const colorTypeOption = printOptions.colorTypes?.find(
      (ct) =>
        ct.value ===
        (options.colorType === COLOR_TYPE.COLOR ? "color" : "black_white")
    );

    const duplexOption = printOptions.duplexOptions?.find(
      (d) =>
        d.value ===
        (options.duplex === DUPLEX.SINGLE_SIDED
          ? "single_sided"
          : options.duplex === DUPLEX.DOUBLE_SIDED_LONG_EDGE
            ? "double_sided_long_edge"
            : options.duplex === DUPLEX.DOUBLE_SIDED_SHORT_EDGE
              ? "double_sided_short_edge"
              : "single_sided")
    );

    const staplingService = printOptions.additionalServices?.find(
      (s) => s.name.toLowerCase() === "stapling"
    );

    const paperSizeOption = printOptions.paperSizes?.find(
      (ps) => ps.value === options.paperSize
    );

    let pricePerPage =
      colorTypeOption?.costPerPage ||
      (options.colorType === COLOR_TYPE.COLOR
        ? defaultPricing.colorPricePerPage
        : defaultPricing.blackWhitePricePerPage);

    const sizeMultiplier = paperSizeOption?.costMultiplier || 1.0;
    pricePerPage *= sizeMultiplier;

    const duplexMultiplier = duplexOption?.costMultiplier || 1.0;
    pricePerPage *= duplexMultiplier;

    let totalPages = 1;

    if (options.duplex !== DUPLEX.SINGLE_SIDED) {
      totalPages = Math.ceil(totalPages / 2);
    }

    const stapleFee = options.staple
      ? staplingService?.cost || defaultPricing.staplePrice
      : 0;

    const totalPrice = pricePerPage * totalPages * options.copies + stapleFee;

    return Math.round(totalPrice * 100) / 100;
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

  const handleProceedToPayment = async () => {
    if (!accessToken) {
      navigate(ROUTES.AUTH.LOGIN);
      return;
    }

    if (!selectedFile) {
      toast.error("Please select a file first");
      return;
    }

    if (!fileBase64) {
      toast.error("File data not available. Please re-select your file.");
      return;
    }

    setIsUploading(true);

    try {
      const printJob = await createPrintJob({
        fileBase64,
        paperSize: options.paperSize,
        orientation: options.orientation,
        copies: options.copies,
        pageRange: options.pageRange === "custom" ? customPageRange : undefined,
        staple: options.staple,
        colorType: options.colorType,
        resolution: options.resolution,
        duplex: options.duplex
      }).unwrap();

      toast.success("Print job created successfully!");

      // Navigate to payment detail page using paymentId from print job response
      if (printJob.paymentId) {
        navigate(ROUTES.APP.PAYMENT(printJob.paymentId));
      } else {
        // Fallback: navigate to payments list if paymentId is not available
        toast.error("Payment ID not found in print job response");
        navigate(ROUTES.APP.PAYMENTS);
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to create print job");
    } finally {
      setIsUploading(false);
    }
  };

  const handleOptionsChange = (newOptions: Partial<PrintOptions>) => {
    setOptions((prev) => ({ ...prev, ...newOptions }));
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
          <FileUploadStep
            uploadedFiles={uploadedFiles}
            isUploading={isUploading}
            onDrop={onDrop}
            onRemoveFile={removeFile}
          />
        );

      case 2:
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <PrintOptionsStep
                options={options}
                customPageRange={customPageRange}
                printOptions={printOptions}
                onOptionsChange={handleOptionsChange}
                onCustomPageRangeChange={setCustomPageRange}
              />
            </div>
            <div className="space-y-6">
              <OrderSummary options={options} totalPrice={calculatePrice()} />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3">
              <PreviewStep
                fileName={completedFiles[0]?.file.name || "document.pdf"}
                fileBase64={fileBase64}
                fileType={completedFiles[0]?.type || ""}
                currentPage={currentPage}
                totalPages={5}
                zoom={zoom}
                paperSize={options.paperSize}
                orientation={options.orientation}
                onZoomIn={() => setZoom((prev) => Math.min(prev + 25, 200))}
                onZoomOut={() => setZoom((prev) => Math.max(prev - 25, 50))}
                onPreviousPage={() =>
                  setCurrentPage((prev) => Math.max(prev - 1, 1))
                }
                onNextPage={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, 5))
                }
              />
            </div>
            <div className="space-y-6">
              <PrintSummary
                fileName={completedFiles[0]?.file.name || "document.pdf"}
                fileSize={formatFileSize(completedFiles[0]?.size || 2400000)}
                totalPages={5}
                options={options}
                totalPrice={calculatePrice()}
              />
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
                disabled={!canProceedToNext() || isCreatingJob || isUploading}
                size="lg"
                className="bg-black hover:bg-gray-800"
              >
                {isUploading ? (
                  "Uploading..."
                ) : isCreatingJob ? (
                  "Creating..."
                ) : accessToken ? (
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

export default PrintFlow;
