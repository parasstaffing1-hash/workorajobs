import { ImageResponse } from "next/og";

export const alt = "Workora Jobs";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        background: "#f8fafc",
        color: "#0f172a",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        justifyContent: "space-between",
        padding: 72,
        width: "100%",
      }}
    >
      <div style={{ alignItems: "center", display: "flex", gap: 18 }}>
        <div
          style={{
            alignItems: "center",
            background: "#0f766e",
            borderRadius: 18,
            color: "white",
            display: "flex",
            fontSize: 36,
            fontWeight: 800,
            height: 72,
            justifyContent: "center",
            width: 72,
          }}
        >
          W
        </div>
        <div style={{ fontSize: 34, fontWeight: 700 }}>Workora Jobs</div>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            color: "#0f766e",
            fontSize: 30,
            fontWeight: 700,
            marginBottom: 20,
          }}
        >
          AI-powered global staffing
        </div>
        <div
          style={{
            fontSize: 72,
            fontWeight: 800,
            letterSpacing: -2,
            lineHeight: 1.02,
          }}
        >
          Hire trusted talent across borders.
        </div>
      </div>
      <div style={{ color: "#475569", fontSize: 26 }}>
        Enterprise recruitment foundation for modern teams.
      </div>
    </div>,
    size,
  );
}
