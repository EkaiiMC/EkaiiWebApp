-- Create the materialized view for the current month's votes
CREATE MATERIALIZED VIEW "MonthlyLeaderboard" AS
SELECT
  rank() OVER (ORDER BY COUNT(v.id) DESC) AS "rank",
  u.name AS username,
  u.id AS "userId",
  COUNT(v.id) AS "voteCount"
FROM
  "Vote" as v
JOIN
  "User" u ON v."userId" = u.id
WHERE
  EXTRACT(MONTH FROM v."createdAt") = EXTRACT(MONTH FROM CURRENT_DATE)
  AND EXTRACT(YEAR FROM v."createdAt") = EXTRACT(YEAR FROM CURRENT_DATE)
GROUP BY
  u.name,
  u.id;
ORDER BY
  "voteCount" DESC;

-- Create the function to refresh the materialized view
CREATE OR REPLACE FUNCTION refresh_current_month_votes()
RETURNS VOID AS $$
BEGIN
  REFRESH MATERIALIZED VIEW "MonthlyLeaderboard";
END;
$$ LANGUAGE plpgsql;

-- Create the trigger to refresh the materialized view periodically
DO $$
BEGIN
IF current_database() = 'ekaii' THEN
  CREATE EXTENSION IF NOT EXISTS pg_cron;
  PERFORM cron.schedule('refresh_current_month_votes', '*/5 * * * *', 'SELECT refresh_current_month_votes()');
END IF;
END $$;

