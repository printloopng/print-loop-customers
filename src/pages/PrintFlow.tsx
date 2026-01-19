import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Stepper from "@/components/ui/stepper";
import { toast } from "sonner";
import { LogIn } from "lucide-react";
import { useAppSelector } from "@/hooks/redux";
import {
  useGetPrintOptionsQuery,
  useCreatePrintJobMutation,
  useGetPresignedUrlMutation,
  useCalculatePriceMutation
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
  const [fileKey, setFileKey] = useState<string>("");
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
  const [pageCount, setPageCount] = useState<number | null>(null);
  const [calculatedPrice, setCalculatedPrice] = useState<number | null>(null);

  const { data: printOptions, error: optionsError } = useGetPrintOptionsQuery();
  const [createPrintJob, { isLoading: isCreatingJob }] =
    useCreatePrintJobMutation();
  const [getPresignedUrl] = useGetPresignedUrlMutation();
  const [calculatePriceMutation] = useCalculatePriceMutation();

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

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setUploadedFiles([]);
    setSelectedFile(null);
    setFileKey("");
    setPageCount(null);

    const file = acceptedFiles[0];
    if (!file) return;

    const fileId = Math.random().toString(36).substr(2, 9);
    const newFile: UploadedFile = {
      id: fileId,
      file,
      preview: URL.createObjectURL(file),
      size: file.size,
      type: file.type,
      status: "uploading",
      progress: 0
    };

    setUploadedFiles([newFile]);
    setSelectedFile(file);
    setIsUploading(true);

    try {
      const presignedData = await getPresignedUrl({
        fileName: file.name,
        fileType: file.type
      }).unwrap();

      const { url, params } = presignedData;

      const formData = new FormData();
      formData.append('file', file);

      formData.append('api_key', params.api_key);
      formData.append('timestamp', String(params.timestamp));
      formData.append('signature', params.signature);

      if (params.folder) formData.append('folder', params.folder);
      if (params.allowed_formats) formData.append('allowed_formats', params.allowed_formats);
      if (params.public_id) formData.append('public_id', params.public_id);
      if (params.tags) formData.append('tags', params.tags);

      const uploadResponse = await fetch(url, {
        method: "POST",
        body: formData
      });

      if (!uploadResponse.ok) {
        throw new Error("Failed to upload file");
      }

      const uploadResult = await uploadResponse.json();
      const fileKey = uploadResult.public_id || params.public_id;
      const pagesCount = uploadResult.pages || 1;

      setFileKey(fileKey);
      setPageCount(pagesCount);

      setUploadedFiles([{ ...newFile, status: "completed", progress: 100 }]);
      toast.success(`File uploaded: ${pagesCount} page${pagesCount !== 1 ? 's' : ''} detected`);
    } catch (error) {
      console.error("Upload failed:", error);
      setUploadedFiles([{ ...newFile, status: "error", progress: 0 }]);
      toast.error("Failed to upload file. Please try again.");
    } finally {
      setIsUploading(false);
    }
  }, [getPresignedUrl]);

  const removeFile = (fileId: string) => {
    setUploadedFiles((prev) =>
      prev.filter((uploadedFile) => uploadedFile.id !== fileId)
    );
    setSelectedFile(null);
    setFileKey("");
    setPageCount(null);
  };


  // Recalculate price when options or pageCount change
  React.useEffect(() => {
    const fetchPrice = async () => {
      if (pageCount && pageCount > 0) {
        try {
          const pageRangeValue = options.pageRange === "custom"
            ? customPageRange
            : options.pageRange !== "all"
              ? options.pageRange
              : undefined;

          const result = await calculatePriceMutation({
            pageCount,
            paperSize: options.paperSize,
            orientation: options.orientation,
            copies: options.copies,
            pageRange: pageRangeValue,
            staple: options.staple,
            colorType: options.colorType === COLOR_TYPE.COLOR ? "color" : "black_white",
            resolution: options.resolution,
            duplex: options.duplex === DUPLEX.SINGLE_SIDED
              ? "single_sided"
              : options.duplex === DUPLEX.DOUBLE_SIDED_LONG_EDGE
                ? "double_sided_long_edge"
                : options.duplex === DUPLEX.DOUBLE_SIDED_SHORT_EDGE
                  ? "double_sided_short_edge"
                  : "single_sided"
          }).unwrap();

          setCalculatedPrice(result.price);
        } catch (error) {
          console.error("Failed to calculate price:", error);
          setCalculatedPrice(null);
        }
      } else {
        setCalculatedPrice(null);
      }
    };
    fetchPrice();
  }, [
    pageCount,
    options.paperSize,
    options.orientation,
    options.copies,
    options.pageRange,
    customPageRange,
    options.staple,
    options.colorType,
    options.resolution,
    options.duplex,
    calculatePriceMutation
  ]);

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

    if (!fileKey) {
      toast.error("File not uploaded. Please re-select your file.");
      return;
    }

    setIsUploading(true);

    try {
      const validPageCount = pageCount && pageCount > 0 ? Math.floor(pageCount) : undefined;

      const result = await createPrintJob({
        fileKey,
        paperSize: options.paperSize,
        orientation: options.orientation,
        copies: options.copies,
        pageRange: options.pageRange === "custom" ? customPageRange : options.pageRange !== "all" ? options.pageRange : undefined,
        staple: options.staple,
        colorType: options.colorType,
        resolution: options.resolution,
        duplex: options.duplex,
        pageCount: validPageCount
      }).unwrap();

      toast.success("Print job created successfully!");

      if (result.payment?.paymentId) {
        navigate(ROUTES.APP.PAYMENT(result.payment?.paymentId));
      } else {
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

  const completedFiles = uploadedFiles.filter((f: any) => f.status === "completed");

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
              <OrderSummary
                printConfig={{
                  paperSize: options.paperSize,
                  orientation: options.orientation,
                  copies: options.copies,
                  colorType: options.colorType,
                  resolution: options.resolution,
                  duplex: options.duplex,
                  staple: options.staple,
                  pageRange: options.pageRange === "custom" ? customPageRange : options.pageRange !== "all" ? options.pageRange : undefined
                }}
                totalPrice={calculatedPrice || 0}
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3">
              <PreviewStep
                fileName={completedFiles[0]?.file?.name || "document.pdf"}
                fileBase64=""
                fileType={completedFiles[0]?.type || ""}
                currentPage={1}
                pageCount={pageCount || 1}
                zoom={100}
                paperSize={options.paperSize}
                orientation={options.orientation}
                onZoomIn={() => { }}
                onZoomOut={() => { }}
                onPreviousPage={() => { }}
                onNextPage={() => { }}
              />
            </div>
            <div className="space-y-6">
              <PrintSummary
                fileName={completedFiles[0]?.file?.name || "document.pdf"}
                fileSize={formatFileSize(completedFiles[0]?.size || 0)}
                pageCount={pageCount || 1}
                options={options}
                totalPrice={calculatedPrice || 0}
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
                    <LogIn className="h-4 " />
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
