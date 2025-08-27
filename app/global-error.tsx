"use client"

import Error from "next/error";

export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string };
}) {
  // 仅在开发环境下记录错误详情
  if (process.env.NODE_ENV === 'development') {
    console.error('Global error:', error);
  }

  return (
    <html>
      <body>
        <Error statusCode={500} />
      </body>
    </html>
  );
}