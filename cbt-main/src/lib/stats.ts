import "server-only";
import { repo } from "@/lib/db";
import { buildStudyPlan, type StudyPlanItem } from "@/lib/engine";
import type { DashboardStats, PracticeSession, WeaknessReport } from "@/lib/types";

export async function getDashboardData(userId: string): Promise<{
  stats: DashboardStats;
  sessions: PracticeSession[];
  weaknesses: WeaknessReport[];
  plan: StudyPlanItem[];
}> {
  const [sessions, weaknesses] = await Promise.all([
    repo.listSessions(userId, 100),
    repo.listWeaknesses(userId, 300),
  ]);

  const completed = sessions
    .filter((s) => s.status === "completed")
    .sort((a, b) => a.started_at.localeCompare(b.started_at));

  const scores = completed.map((s) => s.score_percent ?? 0);
  const questionsAnswered = completed.reduce((sum, s) => sum + s.correct_count + s.wrong_count, 0);
  const correct = completed.reduce((sum, s) => sum + s.correct_count, 0);

  // unique weak topics from the most recent 3 sessions
  const recentIds = new Set(completed.slice(-3).map((s) => s.id));
  const weakTopics = new Set(
    weaknesses.filter((w) => recentIds.has(w.session_id) && w.weakness_score >= 50).map((w) => `${w.subject}::${w.topic}`),
  );

  // streak: consecutive days (ending today or yesterday) with at least one session
  const days = new Set(completed.map((s) => s.started_at.slice(0, 10)));
  let streak = 0;
  const cursor = new Date();
  if (!days.has(cursor.toISOString().slice(0, 10))) cursor.setDate(cursor.getDate() - 1);
  while (days.has(cursor.toISOString().slice(0, 10))) {
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }

  const trend = completed.slice(-12).map((s, i) => ({
    label: `S${i + 1}`,
    score: s.score_percent ?? 0,
    date: s.started_at,
  }));

  const stats: DashboardStats = {
    sessions: completed.length,
    avg_score: scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : null,
    best_score: scores.length ? Math.max(...scores) : null,
    questions_answered: questionsAnswered,
    accuracy: questionsAnswered ? Math.round((correct / questionsAnswered) * 100) : null,
    weak_topics: weakTopics.size,
    streak_days: streak,
    trend,
  };

  return {
    stats,
    sessions: sessions.sort((a, b) => b.started_at.localeCompare(a.started_at)),
    weaknesses,
    plan: buildStudyPlan(weaknesses).slice(0, 8),
  };
}
