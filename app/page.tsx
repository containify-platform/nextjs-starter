import { Suspense } from "react";
import { connection } from "next/server";
import { sql } from "@/lib/db";

async function Visits() {
  await connection(); // a fresh count on every request
  try {
    const [row] = await sql<{ count: number }[]>`
      INSERT INTO visits DEFAULT VALUES RETURNING (SELECT count(*)::int + 1 FROM visits) AS count
    `;
    return (
      <p>
        This page has been visited <strong>{row.count}</strong> {row.count === 1 ? "time" : "times"}, counted in Postgres.
      </p>
    );
  } catch (err) {
    console.error(err);
    return <p className="error">Couldn&apos;t reach the database. Is DATABASE_URL set, and have the migrations run?</p>;
  }
}

export default function Home() {
  return (
    <main>
      <h1>Next.js on Containify</h1>
      <p>
        Edit <code>app/page.tsx</code> and push to deploy a new version.
      </p>
      <Suspense fallback={<p>Counting visits…</p>}>
        <Visits />
      </Suspense>
      <p className="links">
        <a href="https://containify.cloud/docs/guides/nextjs">Next.js guide</a>
        <a href="https://nextjs.org/docs">Next.js docs</a>
      </p>
    </main>
  );
}
