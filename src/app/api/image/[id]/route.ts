import { existsSync, readFileSync } from "fs";
import { NextRequest, NextResponse } from "next/server";
import path from "path";

export const GET = async (
  _: NextRequest,
  { params: { id } }: { params: { id: string } }
) => {
  const dirPath = path.join(process.cwd(), "prisma", "data", "images");
  const filePath = path.join(dirPath, id);
  if (existsSync(filePath)) {
    const blob = readFileSync(filePath);

    const headers = new Headers();
    headers.set("Content-Type", "image/png");

    return new NextResponse(blob, {
      status: 200,
      statusText: "OK",
      headers,
    });
  }

  return NextResponse.json({
    success: false,
    error: "获取文件失败",
  });
};
