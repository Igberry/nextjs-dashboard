// Re-export the already-configured NextAuth handler from the project root.
// The `auth` export from the root `auth.ts` is already a compatible App Router handler.
/* eslint-disable @typescript-eslint/ban-ts-comment, @typescript-eslint/no-explicit-any */
import { auth } from '@/auth';

async function callAuth(req: Request) {
	// `auth` may return a Response or a value (Session|null). Normalize to Response.
		// @ts-ignore - runtime call to NextAuth handler with a different request type
		const result = await auth(req as any);
	if (result instanceof Response) return result;
	return new Response(JSON.stringify(result), {
		status: 200,
		headers: { 'Content-Type': 'application/json' },
	});
}

export const GET = async (req: Request) => {
	return callAuth(req);
};

export const POST = async (req: Request) => {
	return callAuth(req);
};
