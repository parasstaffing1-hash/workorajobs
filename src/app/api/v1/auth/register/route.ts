import { POST as signupHandler } from "../signup/route";

export const dynamic = "force-dynamic";

export async function POST(request: any) {
  return signupHandler(request);
}
