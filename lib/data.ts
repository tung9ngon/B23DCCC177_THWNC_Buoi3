import "server-only";
import { promises as fs } from "fs";
import path from "path";
import { Redis } from "@upstash/redis";
import type { UserRole } from "./permissions";
import type { DeadlineView } from "@/components/deadline-row";

export type Subject = {
  slug: string;
  code: string;
  name: string;
  teacher: string;
  schedule: string;
  description: string;
  color: string;
};

export type Deadline = {
  id: string;
  title: string;
  subjectSlug: string;
  type: string;
  description: string;
  dueAt: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
};

// userId -> các deadline đã xong
type Completions = Record<string, string[]>;

const DATA_DIR = path.join(process.cwd(), "data");

// vercel không ghi file được nên trên đó lưu vào redis, chạy local thì vẫn dùng file json
const redisUrl = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
const redis = redisUrl && redisToken ? new Redis({ url: redisUrl, token: redisToken }) : null;
const redisKey = (file: string) => `deadline-hub:${file}`;

async function readJson<T>(file: string): Promise<T> {
  if (redis) {
    const stored = await redis.get<T>(redisKey(file));
    if (stored !== null) return stored;
  }
  // redis chưa có thì lấy dữ liệu mẫu
  const raw = await fs.readFile(path.join(DATA_DIR, file), "utf8");
  return JSON.parse(raw) as T;
}

// ghi file tạm rồi rename cho khỏi hỏng file
async function writeJson(file: string, data: unknown) {
  if (redis) {
    await redis.set(redisKey(file), data);
    return;
  }
  const target = path.join(DATA_DIR, file);
  const tmp = `${target}.${process.pid}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(data, null, 2) + "\n", "utf8");
  await fs.rename(tmp, target);
}

export async function getSubjects() {
  return readJson<Subject[]>("subjects.json");
}

export async function getSubject(slug: string) {
  return (await getSubjects()).find((s) => s.slug === slug);
}

export async function getDeadlines() {
  const list = await readJson<Deadline[]>("deadlines.json");
  return list.sort((a, b) => a.dueAt.localeCompare(b.dueAt));
}

export async function getDeadline(id: string) {
  return (await getDeadlines()).find((d) => d.id === id);
}

export async function createDeadline(input: Omit<Deadline, "id">) {
  const list = await readJson<Deadline[]>("deadlines.json");
  const nextId = Math.max(0, ...list.map((d) => Number(d.id))) + 1;
  const deadline: Deadline = { id: String(nextId), ...input };
  await writeJson("deadlines.json", [...list, deadline]);
  return deadline;
}

export async function deleteDeadline(id: string) {
  const list = await readJson<Deadline[]>("deadlines.json");
  await writeJson(
    "deadlines.json",
    list.filter((d) => d.id !== id),
  );
  const completions = await readJson<Completions>("completions.json");
  for (const userId of Object.keys(completions)) {
    completions[userId] = completions[userId].filter((x) => x !== id);
  }
  await writeJson("completions.json", completions);
}

export async function getUserByEmail(email: string) {
  const users = await readJson<User[]>("users.json");
  return users.find((u) => u.email.toLowerCase() === email.toLowerCase());
}

export async function getCompletedIds(userId: string) {
  const completions = await readJson<Completions>("completions.json");
  return completions[userId] ?? [];
}

export async function toggleCompletion(userId: string, deadlineId: string) {
  const completions = await readJson<Completions>("completions.json");
  const current = completions[userId] ?? [];
  completions[userId] = current.includes(deadlineId)
    ? current.filter((x) => x !== deadlineId)
    : [...current, deadlineId];
  await writeJson("completions.json", completions);
}

export async function getDeadlineViews(): Promise<DeadlineView[]> {
  const [deadlines, subjects] = await Promise.all([getDeadlines(), getSubjects()]);
  const bySlug = new Map(subjects.map((s) => [s.slug, s]));
  return deadlines.map((d) => ({
    id: d.id,
    title: d.title,
    type: d.type,
    dueAt: d.dueAt,
    subjectSlug: d.subjectSlug,
    subjectName: bySlug.get(d.subjectSlug)?.name ?? d.subjectSlug,
    subjectColor: bySlug.get(d.subjectSlug)?.color ?? "#64748b",
  }));
}
