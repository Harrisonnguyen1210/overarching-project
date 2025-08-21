export const levenshteinDistance = (a = "", b = "") => {
  const m = a.length, n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;

  const dp = new Array(n + 1);
  for (let j = 0; j <= n; j++) dp[j] = j;

  for (let i = 1; i <= m; i++) {
    let prev = dp[0]; // dp[i-1][j-1]
    dp[0] = i; // dp[i][0]
    for (let j = 1; j <= n; j++) {
      const tmp = dp[j]; // save dp[i-1][j] before overwriting
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[j] = Math.min(
        dp[j] + 1, // deletion
        dp[j - 1] + 1, // insertion
        prev + cost, // substitution
      );
      prev = tmp;
    }
  }
  return dp[n];
};
