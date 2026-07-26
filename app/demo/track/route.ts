import { NextRequest, NextResponse } from "next/server";

const DEFAULT_DEMO_REQUEST_ID = "REQ-DEMO-001";
const SAFE_REQUEST_ID = /^[A-Za-z0-9][A-Za-z0-9-]{2,79}$/;

export function GET(request: NextRequest) {
  const requestedId =
    request.nextUrl.searchParams.get("requestId")?.trim() ?? "";

  const requestId = SAFE_REQUEST_ID.test(requestedId)
    ? requestedId
    : DEFAULT_DEMO_REQUEST_ID;

  const destination = request.nextUrl.clone();
  destination.pathname = `/demo/track/${encodeURIComponent(requestId)}`;
  destination.search = "";

  return NextResponse.redirect(destination);
}
