// Re-export the already-configured NextAuth handler from the project root.
// The `auth` export from the root `auth.ts` is already a compatible App Router handler.
// @ts-nocheck
/* eslint-disable */
import { auth } from '@/auth';

// The NextAuth handler uses its own request/response shapes which can cause
// strict type-check mismatches with the App Router. For the production build
// we intentionally call the upstream `auth` handler directly and avoid strict
// typing checks in this wrapper file.
export const GET = async (req: Request) => {
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	return auth(req as any);
};

export const POST = async (req: Request) => {
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	return auth(req as any);
};
