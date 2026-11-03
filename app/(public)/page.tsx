import Image from "next/image";
import Link from "next/link";
import { getSubjects } from "@/lib/data";

export const dynamic = "force-static";

export default async function HomePage() {
  const subjects = await getSubjects();

  return (
    <div className="space-y-12">
      <section className="grid items-center gap-8 md:grid-cols-2">
        <div>
          <h1 className="text-4xl font-bold leading-tight">Mọi deadline của lớp, ở cùng một chỗ</h1>
          <p className="mt-4 text-lg text-slate-600">
            Tra cứu hạn nộp bài tập, báo cáo, kiểm tra của {subjects.length} môn học. Đăng nhập để đánh dấu
            những việc đã xong.
          </p>
          <div className="mt-6 flex gap-3">
            <Link href="/deadlines" className="rounded-lg bg-red-600 px-5 py-3 font-semibold text-white hover:bg-red-700">
              Xem deadline
            </Link>
            <Link href="/dashboard" className="rounded-lg border border-slate-300 bg-white px-5 py-3 font-semibold hover:bg-slate-100">
              Dashboard của tôi
            </Link>
          </div>
        </div>
        <Image
          src="/images/hero.png"
          alt="Lịch deadline của lớp"
          width={960}
          height={640}
          priority
          sizes="(min-width: 768px) 50vw, 100vw"
          className="h-auto w-full rounded-2xl"
        />
      </section>

      <section>
        <h2 className="text-2xl font-bold">Môn học</h2>
        <ul className="mt-4 grid gap-4 sm:grid-cols-2">
          {subjects.map((s) => (
            <li key={s.slug}>
              <Link
                href={`/subjects/${s.slug}`}
                className="block rounded-xl border border-slate-200 bg-white p-5 hover:shadow-md"
                style={{ borderTop: `4px solid ${s.color}` }}
              >
                <p className="text-sm text-slate-500">{s.code}</p>
                <p className="text-lg font-semibold">{s.name}</p>
                <p className="mt-1 text-sm text-slate-600">{s.teacher}</p>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
