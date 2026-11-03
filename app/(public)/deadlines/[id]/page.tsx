import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Countdown } from "@/components/countdown";
import { getDeadline, getDeadlines, getSubject } from "@/lib/data";
import { formatDueAt, siteUrl } from "@/lib/format";

// chỉ build lại khi admin thêm/xoá (revalidatePath trong lib/actions.ts)
export const revalidate = false;
export const dynamicParams = true;

export async function generateStaticParams() {
  return (await getDeadlines()).map((d) => ({ id: d.id }));
}

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const deadline = await getDeadline((await params).id);
  if (!deadline) return { title: "Không tìm thấy deadline" };
  const subject = await getSubject(deadline.subjectSlug);
  const description = `${subject?.name} · ${deadline.type} · Hạn nộp ${formatDueAt(deadline.dueAt)}. ${deadline.description}`;
  return {
    title: deadline.title,
    description,
    alternates: { canonical: `/deadlines/${deadline.id}` },
    openGraph: { type: "article", title: deadline.title, description, url: `/deadlines/${deadline.id}` },
    twitter: { card: "summary_large_image", title: deadline.title, description },
  };
}

export default async function DeadlineDetailPage({ params }: Props) {
  const deadline = await getDeadline((await params).id);
  if (!deadline) notFound();
  const subject = await getSubject(deadline.subjectSlug);

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Trang chủ", item: `${siteUrl}/` },
      { "@type": "ListItem", position: 2, name: "Deadline", item: `${siteUrl}/deadlines` },
      { "@type": "ListItem", position: 3, name: deadline.title, item: `${siteUrl}/deadlines/${deadline.id}` },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb).replace(/</g, "\\u003c") }}
      />
      <nav aria-label="Breadcrumb" className="mb-4 text-sm text-slate-500">
        <Link href="/" className="hover:underline">Trang chủ</Link> /{" "}
        <Link href="/deadlines" className="hover:underline">Deadline</Link> /{" "}
        <span className="text-slate-700">{deadline.title}</span>
      </nav>
      <article
        className="max-w-3xl rounded-2xl border border-slate-200 bg-white p-8"
        style={{ borderTop: `6px solid ${subject?.color ?? "#64748b"}` }}
      >
        <p className="text-sm font-medium text-slate-500">
          {subject ? <Link href={`/subjects/${subject.slug}`} className="hover:underline">{subject.name}</Link> : deadline.subjectSlug}
          {" · "}
          {deadline.type}
        </p>
        <h1 className="mt-2 text-3xl font-bold">{deadline.title}</h1>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <span className="font-medium">Hạn nộp: {formatDueAt(deadline.dueAt)}</span>
          <Countdown dueAt={deadline.dueAt} />
        </div>
        <p className="mt-6 whitespace-pre-line text-slate-700">{deadline.description}</p>
        <p className="mt-8 text-sm text-slate-500">
          Đã làm xong? <Link href="/dashboard" className="font-medium text-red-600 hover:underline">Đánh dấu trong Dashboard</Link>
        </p>
      </article>
    </>
  );
}
