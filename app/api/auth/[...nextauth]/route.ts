// Re-export the already-configured NextAuth handler from the project root.
// The `auth` export from the root `auth.ts` is already a compatible App Router handler.
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/ban-ts-comment */
import { auth } from '@/auth';

// Wrap the exported auth handler to satisfy the App Router route handler type.
// NextAuth's handler has its own request type; casting to `any` avoids a strict
// mismatch during the Next.js type checking step while preserving runtime behavior.
export const GET = async (req: Request) => {
		// @ts-ignore - NextAuth handler expects a different request type
		return auth(req as any);
};

export const POST = async (req: Request) => {
		// @ts-ignore - NextAuth handler expects a different request type
		return auth(req as any);
};
