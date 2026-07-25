import { NextRequest, NextResponse } from "next/server";
import { getAuthUserId } from "@/lib/auth/get-auth-user";
import {
  uploadToS3,
  deleteFromS3,
  getSignedDownloadUrl,
  getSignedUploadUrl,
  UploadFolder,
  FOLDER_RULES,
} from "@/lib/aws/s3";

/**
 * POST /api/v1/uploads
 * Uploads a file to AWS S3 or generates a presigned upload URL.
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const userId = await getAuthUserId(request, "ANY");
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Authentication required to upload files." },
        { status: 401 }
      );
    }

    const contentType = request.headers.get("content-type") || "";

    // Case 1: JSON Request for Presigned Upload URL
    if (contentType.includes("application/json")) {
      const body = await request.json();
      const { folder, fileName, fileType, fileSize } = body as {
        folder: UploadFolder;
        fileName: string;
        fileType: string;
        fileSize: number;
      };

      if (!folder || !fileName || !fileType || !fileSize) {
        return NextResponse.json(
          {
            success: false,
            error: "Missing required fields: folder, fileName, fileType, fileSize",
          },
          { status: 400 }
        );
      }

      if (!FOLDER_RULES[folder]) {
        return NextResponse.json(
          { success: false, error: `Invalid upload folder: '${folder}'` },
          { status: 400 }
        );
      }

      const presigned = await getSignedUploadUrl(folder, fileName, fileType, fileSize, userId);

      return NextResponse.json({
        success: true,
        data: presigned,
      });
    }

    // Case 2: Multipart FormData Direct Server Upload
    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const file = formData.get("file") as File | null;
      const folder = (formData.get("folder") as UploadFolder) || "resumes";

      if (!file) {
        return NextResponse.json(
          { success: false, error: "No file attached in multipart form data ('file' key missing)." },
          { status: 400 }
        );
      }

      if (!FOLDER_RULES[folder]) {
        return NextResponse.json(
          { success: false, error: `Invalid upload folder: '${folder}'` },
          { status: 400 }
        );
      }

      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const result = await uploadToS3({
        fileBuffer: buffer,
        originalFileName: file.name,
        contentType: file.type || "application/octet-stream",
        folder,
        userId,
      });

      return NextResponse.json({
        success: true,
        data: result,
      });
    }

    return NextResponse.json(
      { success: false, error: "Unsupported Content-Type header. Expected multipart/form-data or application/json." },
      { status: 415 }
    );
  } catch (error: unknown) {
    const err = error as Error;
    console.error("[API Upload Error]:", err.message);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to process upload request" },
      { status: 400 }
    );
  }
}

/**
 * GET /api/v1/uploads?key=resumes/uuid-name.pdf&expiresIn=3600
 * Generates a presigned download URL for private files.
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const userId = await getAuthUserId(request, "ANY");
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Authentication required to access private files." },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const key = searchParams.get("key");
    const expiresIn = parseInt(searchParams.get("expiresIn") || "3600", 10);

    if (!key) {
      return NextResponse.json(
        { success: false, error: "Query parameter 'key' is required." },
        { status: 400 }
      );
    }

    const signedUrl = await getSignedDownloadUrl(key, expiresIn);

    return NextResponse.json({
      success: true,
      data: {
        key,
        signedUrl,
        expiresInSeconds: expiresIn,
      },
    });
  } catch (error: unknown) {
    const err = error as Error;
    console.error("[API Signed URL Error]:", err.message);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to generate signed download URL" },
      { status: 400 }
    );
  }
}

/**
 * DELETE /api/v1/uploads?key=resumes/uuid-name.pdf
 * Deletes a file from AWS S3 storage.
 */
export async function DELETE(request: NextRequest): Promise<NextResponse> {
  try {
    const userId = await getAuthUserId(request, "ANY");
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Authentication required to delete files." },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const key = searchParams.get("key");

    if (!key) {
      return NextResponse.json(
        { success: false, error: "Query parameter 'key' is required for deletion." },
        { status: 400 }
      );
    }

    const success = await deleteFromS3(key);
    if (!success) {
      return NextResponse.json(
        { success: false, error: `Failed to delete S3 file with key '${key}'` },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Successfully deleted file '${key}'`,
    });
  } catch (error: unknown) {
    const err = error as Error;
    console.error("[API Delete Error]:", err.message);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to delete file" },
      { status: 400 }
    );
  }
}
