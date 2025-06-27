import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

export const runtime = 'nodejs';

const { GET, POST } = toNextJsHandler(auth);

export { GET, POST }; 