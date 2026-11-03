import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getSubject, getSubjects } from "@/lib/data";

export const dynamicParams = false;

export async function generateStaticParams() {
  return (await getSubjects()).map((s) => ({ slug: s.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const subject = await getSubject((await params).slug);
  if (!subject) return {};
  return {
    title: subject.name,
    description: subject.description,
    alternates: { canonical: `/subjects/${subject.slug}` },
  };
}

export default async function SubjectPage({ params }: Props) {
  const subject = await getSubject((await params).slug);
  if (!subject) notFound();

  return (
    <article className="max-w-3xl rounded-2xl border border-slate-200 bg-white p-8" style={{ borderTop: `6px solid ${subject.color}` }}>
      <p className="text-sm font-medium text-slate-500">{subject.code}</p>
      <h1 className="mt-1 text-3xl font-bold">{subject.name}</h1>
      <p className="mt-4 text-slate-700">{subject.description}</p>
      <dl className="mt-6 grid gap-3 sm:grid-cols-2">
        <div>
          <dt className="text-sm text-slate-500">Giảng viên</dt>
          <dd className="font-medium">{subject.teacher}</dd>
        </div>
        <div>
          <dt className="text-sm text-slate-500">Lịch học</dt>
          <dd className="font-medium">{subject.schedule}</dd>
        </div>
      </dl>
      <Link href="/deadlines" className="mt-8 inline-block rounded-lg bg-red-600 px-4 py-2 font-semibold text-white">
        Xem deadline các môn
      </Link>
    </article>
  );
}
