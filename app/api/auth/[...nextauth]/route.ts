// Re-export the already-configured NextAuth handler from the project root.
// The `auth` export from the root `auth.ts` is already a compatible App Router handler.
import { handler } from '@/auth';

export { handler as GET, handler as POST };
