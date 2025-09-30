import Link from "next/link";

export default function LandingPage() {
  return (
    <section className="mx-auto mt-10 max-w-3xl text-center ">
      <h1 className="mb-3 text-4xl font-bold">Welcome to the Quiz App</h1>
      <p className="mb-8 text-gray-600">
        Choose a quiz, test your knowledge, and compete on the leaderboard.
      </p>
      <div className="flex items-center justify-center gap-4">
        <Link href="/quiz" className="btn btn-primary">
          Browse Quizzes
        </Link>
        <Link href="/scoreboard" className="btn btn-outline">
          View Scoreboard
        </Link>
      </div>
    </section>
  );
}
