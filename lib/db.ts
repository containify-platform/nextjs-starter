import postgres from "postgres";

// postgres() connects lazily, on the first query, so importing this during
// `next build` (which has no DATABASE_URL) never touches the database.
export const sql = postgres(process.env.DATABASE_URL ?? "", { max: 5 });
