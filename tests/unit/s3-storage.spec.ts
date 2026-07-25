import {
  sanitizeFileName,
  generateS3Key,
  verifyMagicBytes,
  validateUploadFile,
  scanBufferForThreats,
  FOLDER_RULES,
} from "../../src/lib/aws/s3";

describe("AWS S3 Storage Service Unit Tests", () => {
  describe("Filename Sanitization & Path Traversal Prevention", () => {
    it("should strip directory paths and null bytes", () => {
      const malicious = "../../../etc/passwd\0.pdf";
      const sanitized = sanitizeFileName(malicious);
      expect(sanitized).not.toContain("..");
      expect(sanitized).not.toContain("/");
      expect(sanitized).not.toContain("\0");
      expect(sanitized).toBe("passwd.pdf");
    });

    it("should replace illegal characters with underscores", () => {
      const input = "my resume & cover letter (final) v1!.pdf";
      const sanitized = sanitizeFileName(input);
      expect(sanitized).toBe("my_resume___cover_letter__final__v1_.pdf");
    });

    it("should generate a UUID-backed S3 key under specified folder", () => {
      const key = generateS3Key("resumes", "John_Doe_CV.pdf");
      expect(key).toMatch(/^resumes\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}-John_Doe_CV\.pdf$/);
    });
  });

  describe("Magic Bytes Header Validation", () => {
    it("should validate PDF magic bytes (%PDF-)", () => {
      const pdfBuffer = Buffer.from("%PDF-1.7 header content here");
      expect(verifyMagicBytes(pdfBuffer, "application/pdf")).toBe(true);
    });

    it("should validate PNG magic bytes (\\x89PNG)", () => {
      const pngBuffer = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
      expect(verifyMagicBytes(pngBuffer, "image/png")).toBe(true);
    });

    it("should validate JPEG magic bytes (\\xFF\\xD8\\xFF)", () => {
      const jpegBuffer = Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10]);
      expect(verifyMagicBytes(jpegBuffer, "image/jpeg")).toBe(true);
    });

    it("should reject extension spoofing (e.g. text file pretending to be PDF)", () => {
      const fakePdfBuffer = Buffer.from("THIS IS A TEXT FILE NOT A PDF");
      expect(verifyMagicBytes(fakePdfBuffer, "application/pdf")).toBe(false);
    });
  });

  describe("File Validation & Folder Rule Boundaries", () => {
    it("should throw error if file buffer is empty (0 bytes)", () => {
      const emptyBuffer = Buffer.alloc(0);
      expect(() =>
        validateUploadFile(emptyBuffer, "test.pdf", "application/pdf", "resumes")
      ).toThrow("File is empty (0 bytes)");
    });

    it("should enforce maximum size for resumes (10MB)", () => {
      const oversizedBuffer = Buffer.alloc(11 * 1024 * 1024);
      expect(() =>
        validateUploadFile(oversizedBuffer, "test.pdf", "application/pdf", "resumes")
      ).toThrow("exceeds maximum allowed limit of 10 MB");
    });

    it("should enforce maximum size for profile photos (5MB)", () => {
      const oversizedPhoto = Buffer.alloc(6 * 1024 * 1024);
      // Valid PNG header to bypass magic bytes check
      oversizedPhoto[0] = 0x89;
      oversizedPhoto[1] = 0x50;
      oversizedPhoto[2] = 0x4e;
      oversizedPhoto[3] = 0x47;

      expect(() =>
        validateUploadFile(oversizedPhoto, "avatar.png", "image/png", "profile-images")
      ).toThrow("exceeds maximum allowed limit of 5 MB");
    });

    it("should reject disallowed extensions for resumes (e.g. .exe)", () => {
      const pdfBuffer = Buffer.from("%PDF-1.7 header");
      expect(() =>
        validateUploadFile(pdfBuffer, "malware.exe", "application/pdf", "resumes")
      ).toThrow("File extension '.exe' is not allowed for resumes");
    });
  });

  describe("Antivirus Threat Scanner Readiness Hook", () => {
    it("should pass clean file buffer", async () => {
      const cleanBuffer = Buffer.from("%PDF-1.7 valid resume content");
      const result = await scanBufferForThreats(cleanBuffer, "resume.pdf");
      expect(result.isClean).toBe(true);
      expect(result.threatName).toBeUndefined();
    });

    it("should flag EICAR antivirus test signature malware", async () => {
      const eicarBuffer = Buffer.from(
        "X5O!P%@AP[4\\PZX54(P^)7CC)7}$EICAR-STANDARD-ANTIVIRUS-TEST-FILE!$H+H*"
      );
      const result = await scanBufferForThreats(eicarBuffer, "infected.exe");
      expect(result.isClean).toBe(false);
      expect(result.threatName).toBe("EICAR-Test-Signature");
    });
  });
});
