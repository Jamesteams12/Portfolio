import { handlers } from "@/auth";
import type { NextRequest } from "next/server";

function makeSessionCookieTransient(response: Response) {
  const headers = new Headers(response.headers);
  const cookies = headers.getSetCookie();

  if (cookies.length === 0) {
    return response;
  }

  headers.delete("set-cookie");

  for (const cookie of cookies) {
    const isSessionCookie =
      /^(?:__Secure-)?authjs\.session-token(?:\.\d+)?=/i.test(cookie);
    headers.append(
      "set-cookie",
      isSessionCookie ? cookie.replace(/;\s*expires=[^;]*/i, "") : cookie,
    );
  }

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

export async function GET(request: NextRequest) {
  return makeSessionCookieTransient(await handlers.GET(request));
}

export async function POST(request: NextRequest) {
  return makeSessionCookieTransient(await handlers.POST(request));
}
