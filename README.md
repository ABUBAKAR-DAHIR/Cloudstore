<h1 align="center">Cloudstore</h1>

<p align="center">
  <img src="public/logo.svg" alt="Uploader Logo" width="160"/>
</p>

A modern file uploader built with **Next.js** that uses **Tigris Object Storage (S3-compatible)** for direct browser uploads via presigned URLs.

---
## Status
The MVP of this project is done.
We will add more functionalities in the upcoming iterations.

## Vision

Uploader aims to be a simple, production-ready starter for:

- Drag-and-drop uploads
- Direct-to-object-storage uploads with presigned URLs
- File listing & preview
- Deleting uploaded files
- Clean UI + good UX (toasts, loading states, progress)

## Tech Stack

- **Frontend:** Next.js, React, TypeScript, Tailwind CSS
- **UI/UX:**  ShadCN UI components, dark/light theme, sonner toasts
- **Storage:** Tigris Object Storage (S3-compatible)
- **SDK:** AWS SDK v3 (`@aws-sdk/client-s3`, `@aws-sdk/s3-request-presigner`)


## 📂 Project Structure
```text
Cloudstore/
│
├── .next/                          # Next.js build output (auto-generated)
│
├── app/                            # App Router directory
│   ├── favicon.svg
│   ├── globals.css
│   ├── layout.tsx
│   ├── page.tsx
│   │
│   ├── files/
│   │   └── page.tsx                # Files page (listing / UI)
│   │
│   └── api/
│       └── s3/
│           ├── upload/
│           │   └── route.ts         # Presigned PUT URL
│           ├── files/
│           │   └── route.ts         # List files
│           └── delete/
│               └── route.ts         # Delete file
│
├── components/                     # Reusable components
│   ├── ui/                         # shadcn UI components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── skeleton.tsx
│   │   ├── sonner.tsx
│   │   └── spinner.tsx
│   │
│   ├── QueryClientProviderC.tsx
│   ├── ThemeProviderC.tsx
│   ├── Themer.tsx
│   └── uploader.tsx                # Upload UI
│
├── lib/
│   ├── s3Client.ts                 # S3 client configured for Tigris
│   └── utils.ts                    # Utility helpers
│
├── public/
│   ├── file.svg
│
├── .env
├── next.config.ts
├── package.json
├── pnpm-lock.yaml
└── README.md
```
---
## Getting Started

1. **Clone the project**
   ```bash
   git clone Cloudstore
   cd uploader
   ```
2. **Install dependencies**
   ```bash
   pnpm install
   pnpm dev
   ```
3. **Open the project in localhost**
   open http://localhost:3000 in your browser

## Environment Variables

Create a `.env` file in the project root:

```env
AWS_ACCESS_KEY_ID=?
AWS_SECRET_ACCESS_KEY=?
AWS_ENDPOINT_URL_S3=?
AWS_ENDPOINT_URL_IAM=?
AWS_REGION=?
S3_BUCKET_NAME=?
```

## Scripts
- pnpm dev - Start development server
- pnpm build - Build for production
- pnpm start - Start production server
- pnpm lint - Run ESLint

## 👤 Author

This application was developed by **ABUBAKAR DAHIR HASSAN**

## 📄 License
This project is licensed under the MIT license.
