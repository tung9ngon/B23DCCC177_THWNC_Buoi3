import { ImageResponse } from "next/og";
import { readFile } from "fs/promises";
import path from "path";
import { getDeadline, getSubject } from "@/lib/data";
import { formatDueAt } from "@/lib/format";

export const alt = "Ảnh chia sẻ deadline";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// font mặc định không có dấu tiếng việt
async function loadFonts() {
  const dir = path.join(process.cwd(), "assets");
  const [regular, bold] = await Promise.all([
    readFile(path.join(dir, "BeVietnamPro-Regular.ttf")),
    readFile(path.join(dir, "BeVietnamPro-Bold.ttf")),
  ]);
  return [
    { name: "Be Vietnam Pro", data: regular, weight: 400 as const, style: "normal" as const },
    { name: "Be Vietnam Pro", data: bold, weight: 700 as const, style: "normal" as const },
  ];
}

export default async function OpengraphImage({ params }: { params: Promise<{ id: string }> }) {
  const deadline = await getDeadline((await params).id);
  const subject = deadline ? await getSubject(deadline.subjectSlug) : undefined;
  const color = subject?.color ?? "#dc2626";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 64,
          fontFamily: "Be Vietnam Pro",
          color: "#0f172a",
          background: `linear-gradient(135deg, #ffffff 55%, ${color}33 100%)`,
          borderTop: `24px solid ${color}`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 30, color: "#475569" }}>
          <div style={{ width: 20, height: 20, borderRadius: 10, background: color }} />
          {subject ? `${subject.code} · ${subject.name}` : "Class Deadline Hub"}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ display: "flex", fontSize: 30, fontWeight: 700, color }}>{deadline?.type ?? "Deadline"}</div>
          <div style={{ display: "flex", fontSize: 68, fontWeight: 700, lineHeight: 1.15 }}>
            {deadline?.title ?? "Không tìm thấy deadline"}
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 32 }}>
          <div style={{ display: "flex" }}>{deadline ? `Hạn nộp: ${formatDueAt(deadline.dueAt)}` : ""}</div>
          <div style={{ display: "flex", fontWeight: 700, color: "#dc2626" }}>Class Deadline Hub</div>
        </div>
      </div>
    ),
    { ...size, fonts: await loadFonts() },
  );
}
