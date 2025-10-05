import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import ReusableCard from "@/components/ui/cards";
import { Progress } from "@/components/ui/progress";
import PublicHeader from "@/components/layout/PublicHeader";
import {
  Upload,
  FileText,
  Image,
  File,
  X,
  CheckCircle,
  AlertCircle,
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

const UploadPage: React.FC = () => {
  const navigate = useNavigate();
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);

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

      // Simulate upload progress
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
    maxSize: 50 * 1024 * 1024, // 50MB
  });

  const removeFile = (fileId: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== fileId));
  };

  const handleContinue = () => {
    const completedFiles = uploadedFiles.filter(
      (f) => f.status === "completed"
    );
    if (completedFiles.length > 0) {
      // Store files in Redux or context for next step
      navigate("/print-options");
    }
  };

  const completedFiles = uploadedFiles.filter((f) => f.status === "completed");

  return (
    <div className="min-h-screen bg-gray-50">
      <PublicHeader />
      <div className="py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Upload Documents
            </h1>
            <p className="text-gray-600 mt-2">
              Upload your documents to get started with printing
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Upload Area */}
            <ReusableCard
              title="Upload Files"
              description="Drag and drop or click to select files"
              size="sm"
            >
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                  isDragActive
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-300 hover:border-gray-400"
                }`}
              >
                <input {...getInputProps()} />
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                {isDragActive ? (
                  <p className="text-blue-600">Drop the files here...</p>
                ) : (
                  <div>
                    <p className="text-gray-600 mb-2">
                      Drag & drop files here, or click to select
                    </p>
                    <p className="text-sm text-gray-500">
                      Supports PDF, DOC, DOCX, PPT, PPTX, JPG, PNG, GIF, TXT
                    </p>
                    <p className="text-sm text-gray-500">Max file size: 50MB</p>
                  </div>
                )}
              </div>
            </ReusableCard>

            {/* File List */}
            <ReusableCard
              title="Uploaded Files"
              description={`${completedFiles.length} files ready`}
            >
              <div className="space-y-4">
                {uploadedFiles.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <File className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                    <p>No files uploaded yet</p>
                  </div>
                ) : (
                  uploadedFiles.map((file) => (
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
                          <Progress
                            value={file.progress}
                            className="mt-2 h-1"
                          />
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
                  ))
                )}
              </div>
            </ReusableCard>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center mt-8">
            <Button
              variant="outline"
              onClick={() => navigate(ROUTES.APP.DASHBOARD)}
            >
              Dashboard
            </Button>
            <Button
              onClick={handleContinue}
              disabled={completedFiles.length === 0 || isUploading}
            >
              Continue to Print Options ({completedFiles.length})
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadPage;
