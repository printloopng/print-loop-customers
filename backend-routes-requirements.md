# Backend Routes Requirements for Print Service Application

## Authentication Routes

### User Authentication

```
POST /api/auth/register
- Body: { name: string, email: string, password: string }
- Response: { user: User, token: string }

POST /api/auth/login
- Body: { email: string, password: string }
- Response: { user: User, token: string }

POST /api/auth/logout
- Headers: { Authorization: "Bearer <token>" }
- Response: { message: string }

POST /api/auth/forgot-password
- Body: { email: string }
- Response: { message: string }

POST /api/auth/reset-password
- Body: { token: string, password: string }
- Response: { message: string }

GET /api/auth/me
- Headers: { Authorization: "Bearer <token>" }
- Response: { user: User }

POST /api/auth/refresh-token
- Headers: { Authorization: "Bearer <token>" }
- Response: { token: string }
```

## File Upload Routes

### Document Management

```
POST /api/files/upload
- Headers: { Authorization: "Bearer <token>", Content-Type: "multipart/form-data" }
- Body: FormData with files
- Response: { files: UploadedFile[], uploadId: string }

GET /api/files/:fileId
- Headers: { Authorization: "Bearer <token>" }
- Response: File stream or metadata

DELETE /api/files/:fileId
- Headers: { Authorization: "Bearer <token>" }
- Response: { message: string }

GET /api/files
- Headers: { Authorization: "Bearer <token>" }
- Query: ?page=1&limit=10&type=pdf
- Response: { files: UploadedFile[], pagination: PaginationInfo }

POST /api/files/:fileId/preview
- Headers: { Authorization: "Bearer <token>" }
- Response: { previewUrl: string, pageCount: number }
```

## Print Job Routes

### Print Job Management

```
POST /api/print-jobs
- Headers: { Authorization: "Bearer <token>" }
- Body: {
    fileId: string,
    options: PrintOptions,
    copies: number,
    pageRange?: string
  }
- Response: { job: PrintJob }

GET /api/print-jobs
- Headers: { Authorization: "Bearer <token>" }
- Query: ?status=pending&page=1&limit=10
- Response: { jobs: PrintJob[], pagination: PaginationInfo }

GET /api/print-jobs/:jobId
- Headers: { Authorization: "Bearer <token>" }
- Response: { job: PrintJob }

PUT /api/print-jobs/:jobId/cancel
- Headers: { Authorization: "Bearer <token>" }
- Response: { job: PrintJob, refund: RefundInfo }

PUT /api/print-jobs/:jobId/status
- Headers: { Authorization: "Bearer <token>" }
- Body: { status: "processing" | "ready" | "completed" | "cancelled" }
- Response: { job: PrintJob }

POST /api/print-jobs/:jobId/authenticate
- Body: { authCode: string }
- Response: { success: boolean, job: PrintJob }

GET /api/print-jobs/:jobId/download
- Headers: { Authorization: "Bearer <token>" }
- Response: File stream
```

## Payment Routes

### Payment Processing

```
POST /api/payments/process
- Headers: { Authorization: "Bearer <token>" }
- Body: {
    jobId: string,
    method: "wallet" | "card" | "paypal",
    amount: number,
    paymentDetails?: object
  }
- Response: { payment: Payment, authCode: string }

GET /api/payments/:paymentId
- Headers: { Authorization: "Bearer <token>" }
- Response: { payment: Payment }

POST /api/payments/:paymentId/refund
- Headers: { Authorization: "Bearer <token>" }
- Body: { reason: string, amount?: number }
- Response: { refund: RefundInfo }

GET /api/payments
- Headers: { Authorization: "Bearer <token>" }
- Query: ?page=1&limit=10&status=completed
- Response: { payments: Payment[], pagination: PaginationInfo }
```

## Wallet Routes

### Wallet Management

```
GET /api/wallet/balance
- Headers: { Authorization: "Bearer <token>" }
- Response: { balance: number, currency: string }

POST /api/wallet/deposit
- Headers: { Authorization: "Bearer <token>" }
- Body: { amount: number, method: "card" | "bank_transfer" }
- Response: { transaction: Transaction, paymentUrl?: string }

POST /api/wallet/withdraw
- Headers: { Authorization: "Bearer <token>" }
- Body: { amount: number, bankDetails: object }
- Response: { transaction: Transaction }

GET /api/wallet/transactions
- Headers: { Authorization: "Bearer <token>" }
- Query: ?type=deposit&page=1&limit=10
- Response: { transactions: Transaction[], pagination: PaginationInfo }

GET /api/wallet/transactions/:transactionId
- Headers: { Authorization: "Bearer <token>" }
- Response: { transaction: Transaction }
```

## Pricing Routes

### Pricing Calculation

```
POST /api/pricing/calculate
- Body: {
    fileId: string,
    options: PrintOptions,
    copies: number
  }
- Response: {
    basePrice: number,
    totalPrice: number,
    breakdown: PriceBreakdown
  }

GET /api/pricing/rates
- Response: {
    colorRates: object,
    paperSizeRates: object,
    additionalFees: object
  }
```

## Printer Routes

### Printer Management

```
GET /api/printers
- Response: { printers: Printer[] }

GET /api/printers/:printerId/status
- Response: { printer: Printer, status: PrinterStatus }

POST /api/printers/:printerId/jobs/:jobId/release
- Body: { authCode: string }
- Response: { success: boolean, message: string }

GET /api/printers/:printerId/jobs
- Query: ?status=ready&limit=10
- Response: { jobs: PrintJob[] }
```

## User Profile Routes

### User Management

```
GET /api/users/profile
- Headers: { Authorization: "Bearer <token>" }
- Response: { user: User }

PUT /api/users/profile
- Headers: { Authorization: "Bearer <token>" }
- Body: { name?: string, email?: string, avatar?: string }
- Response: { user: User }

PUT /api/users/password
- Headers: { Authorization: "Bearer <token>" }
- Body: { currentPassword: string, newPassword: string }
- Response: { message: string }

DELETE /api/users/account
- Headers: { Authorization: "Bearer <token>" }
- Body: { password: string }
- Response: { message: string }
```

## Admin Routes

### Administrative Functions

```
GET /api/admin/users
- Headers: { Authorization: "Bearer <admin_token>" }
- Query: ?page=1&limit=10&search=email
- Response: { users: User[], pagination: PaginationInfo }

GET /api/admin/print-jobs
- Headers: { Authorization: "Bearer <admin_token>" }
- Query: ?status=all&dateFrom=2024-01-01&dateTo=2024-01-31
- Response: { jobs: PrintJob[], pagination: PaginationInfo }

GET /api/admin/analytics
- Headers: { Authorization: "Bearer <admin_token>" }
- Query: ?period=month&startDate=2024-01-01
- Response: { analytics: AnalyticsData }

PUT /api/admin/printers/:printerId
- Headers: { Authorization: "Bearer <admin_token>" }
- Body: { name?: string, status?: string, settings?: object }
- Response: { printer: Printer }
```

## Data Models

### Core Types

```typescript
interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

interface UploadedFile {
  id: string;
  userId: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  uploadUrl: string;
  status: "uploading" | "completed" | "error";
  createdAt: string;
}

interface PrintJob {
  id: string;
  userId: string;
  fileId: string;
  fileName: string;
  fileType: string;
  fileSize: string;
  pages: number;
  copies: number;
  status: "pending" | "processing" | "ready" | "completed" | "cancelled";
  authCode?: string;
  price: number;
  options: PrintOptions;
  createdAt: string;
  completedAt?: string;
}

interface PrintOptions {
  paperSize: string;
  orientation: string;
  colorType: string;
  resolution: number;
  duplex: string;
  staple: boolean;
  pageRange?: string;
}

interface Payment {
  id: string;
  userId: string;
  jobId: string;
  amount: number;
  method: string;
  status: "pending" | "completed" | "failed" | "refunded";
  transactionId?: string;
  createdAt: string;
}

interface Transaction {
  id: string;
  userId: string;
  type: "deposit" | "withdrawal" | "payment" | "refund";
  amount: number;
  description: string;
  status: "completed" | "pending" | "failed";
  createdAt: string;
}

interface Printer {
  id: string;
  name: string;
  location: string;
  status: "online" | "offline" | "maintenance";
  capabilities: string[];
  settings: object;
}
```

## Authentication & Security

### JWT Token Structure

```typescript
interface JWTPayload {
  userId: string;
  email: string;
  role: "user" | "admin";
  iat: number;
  exp: number;
}
```

### Rate Limiting

- Authentication endpoints: 5 requests per minute
- File upload: 10 requests per minute
- General API: 100 requests per minute

### CORS Configuration

- Allow origins: Frontend domain
- Allow methods: GET, POST, PUT, DELETE, OPTIONS
- Allow headers: Authorization, Content-Type

## Error Responses

### Standard Error Format

```typescript
interface APIError {
  error: string;
  message: string;
  statusCode: number;
  timestamp: string;
  path: string;
}
```

### Common HTTP Status Codes

- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 409: Conflict
- 422: Validation Error
- 429: Too Many Requests
- 500: Internal Server Error

```

## File Storage Requirements

### Supported File Types
- Documents: PDF, DOC, DOCX, PPT, PPTX, TXT
- Images: JPG, JPEG, PNG, GIF
- Maximum file size: 50MB per file
- Storage: AWS S3 or similar cloud storage

### File Processing
- Generate previews for documents
- Extract page count
- Validate file integrity
- Virus scanning

## Database Schema Considerations

### Key Tables
- users
- files
- print_jobs
- payments
- transactions
- printers
- user_sessions

### Indexes
- users.email (unique)
- print_jobs.user_id
- print_jobs.status
- files.user_id
- payments.user_id
- transactions.user_id

This comprehensive route structure supports all the functionality visible in your frontend application, including authentication, file management, print job processing, payment handling, and wallet management.
```
