"use client";

import Link from "next/link";
import { useSelector } from "react-redux";
import { RootState } from "store";

export default function ScoreboardPage() {
  const entries = useSelector((s: RootState) => s.scoreboard.entries);
  const quizzes = useSelector((s: RootState) => s.quiz.quizzes);

  const getQuizTitle = (id: string) =>
    quizzes.find((q) => q.id === id)?.title ?? id;

  return (
    <section className="container mx-auto p-6">
      <Link href="/" className="mb-7 text-2xl font-semibold p-6">
        Leaderboard
      </Link>

      <div className="overflow-hidden rounded-lg border p-6 ">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-black">
                Player
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-black">
                Quiz
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-black">
                Score
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-black">
                Date
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white text-black">
            {entries.map((e) => (
              <tr key={e.id}>
                <td className="px-4 py-3 text-sm">{e.name}</td>
                <td className="px-4 py-3 text-sm">{getQuizTitle(e.quizId)}</td>
                <td className="px-4 py-3 text-sm">
                  {e.score} / {e.total}
                </td>
                <td className="px-4 py-3 text-sm text-gray-500">
                  {new Date(e.date).toLocaleString()}
                </td>
              </tr>
            ))}
            {entries.length === 0 && (
              <tr>
                <td
                  className="px-4 py-6 text-center text-sm text-gray-500"
                  colSpan={4}
                >
                  No entries yet. Take a quiz to appear here.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
