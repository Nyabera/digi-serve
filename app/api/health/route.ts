export function GET() {
  return Response.json({
    status: "ok",
    application: "faidia",
    timestamp: new Date().toISOString(),
  });
}
