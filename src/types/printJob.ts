export enum PRINT_STATUS {
  PENDING = "pending",
  PROCESSING = "processing",
  COMPLETED = "completed",
  FAILED = "failed",
  CANCELLED = "cancelled",
}

export enum PAPER_SIZE {
  A4 = "A4",
  A3 = "A3",
  LETTER = "Letter",
  LEGAL = "Legal",
  TABLOID = "Tabloid",
}

export enum ORIENTATION {
  PORTRAIT = "portrait",
  LANDSCAPE = "landscape",
}

export enum COLOR_TYPE {
  BLACK_WHITE = "black_white",
  COLOR = "color",
}

export enum DUPLEX {
  SINGLE_SIDED = "single_sided",
  DOUBLE_SIDED_LONG_EDGE = "double_sided_long_edge",
  DOUBLE_SIDED_SHORT_EDGE = "double_sided_short_edge",
}

export interface PrintJob {
  id: string;
  jobNumber: string;
  status: PRINT_STATUS;
  paperSize: PAPER_SIZE;
  orientation: ORIENTATION;
  copies: number;
  pageRange?: string;
  staple: boolean;
  colorType: COLOR_TYPE;
  resolution: number;
  duplex: DUPLEX;
  totalPages?: number;
  estimatedCost?: number | string;
  actualCost?: number | string;
  completedAt?: string;
  failureReason?: string;
  code?: string;
  printerId?: string;
  printerName?: string;
  fileURL: string;
  fileName: string;
  userId: string;
  paymentId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePrintJobRequest {
  fileBase64: string;
  paperSize: PAPER_SIZE;
  orientation: ORIENTATION;
  copies: number;
  pageRange?: string;
  staple?: boolean;
  colorType: COLOR_TYPE;
  resolution?: number;
  duplex: DUPLEX;
}

export interface UploadFileResponse {
  fileURL: string;
  fileName: string;
  fileSize: number;
}

export interface PrintOptions {
  paperSizes: {
    value: string;
    label: string;
    costMultiplier: number;
  }[];
  orientations: {
    value: string;
    label: string;
  }[];
  colorTypes: {
    value: string;
    label: string;
    costPerPage: number;
  }[];
  duplexOptions: {
    value: string;
    label: string;
    costMultiplier: number;
  }[];
  resolutions: {
    value: number;
    label: string;
  }[];
  additionalServices: {
    name: string;
    cost: number;
    description: string;
  }[];
  maxCopies: number;
  supportedFileTypes: string[];
}

export interface PrintJobStats {
  total: number;
  pending: number;
  processing: number;
  completed: number;
  failed: number;
  cancelled: number;
  totalSpent: number;
}

export interface CancelPrintJobRequest {
  reason?: string;
}

export interface PrintJobQueryParams {
  page?: number;
  limit?: number;
  status?: PRINT_STATUS;
  startDate?: string;
  endDate?: string;
}
