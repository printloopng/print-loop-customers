import React from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import ReusableCard from "@/components/ui/cards";
import {
  Upload,
  FileText,
  Image,
  File,
  X,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

interface UploadedFile {
  id: string;
  file: File;
  preview: string;
  size: number;
  type: string;
  status: "uploading" | "completed" | "error";
  progress: number;
}

interface FileUploadStepProps {
  uploadedFiles: UploadedFile[];
  isUploading: boolean;
  onDrop: (files: File[]) => void;
  onRemoveFile: (fileId: string) => void;
}

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
  "application/vnd.openxmlformats-officedocument.presentationml.presentation": [
    ".pptx",
  ],
  "text/plain": [".txt"],
};

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

export const FileUploadStep: React.FC<FileUploadStepProps> = ({
  uploadedFiles,
  isUploading,
  onDrop,
  onRemoveFile,
}) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedFileTypes,
    multiple: true,
    maxSize: 50 * 1024 * 1024,
  });

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
          Supports PDF, DOC, DOCX, PPT, PPTX, JPG, PNG, GIF, TXT files up to
          50MB
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
                        {file.status === "completed" && !isUploading && (
                          <p className="text-xs text-green-600 mt-1">
                            Ready to upload when you proceed
                          </p>
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
                    onClick={() => onRemoveFile(file.id)}
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
};
