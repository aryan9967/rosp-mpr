// utils/hospitalUtils.js

/**
 * Calculates string similarity using Levenshtein distance
 * Normalized to return a value between 0 (completely different) and 1 (identical)
 */
function stringSimilarity(s1, s2) {
    const editDistance = levenshteinDistance(s1.toLowerCase(), s2.toLowerCase());
    const maxLength = Math.max(s1.length, s2.length);
    return 1 - editDistance / maxLength;
  }
  
  /**
   * Calculate Levenshtein distance between two strings
   */
  function levenshteinDistance(s1, s2) {
    const m = s1.length;
    const n = s2.length;
    
    // Create distance matrix
    const dp = Array(m + 1).fill().map(() => Array(n + 1).fill(0));
    
    // Initialize first row and column
    for (let i = 0; i <= m; i++) dp[i][0] = i;
    for (let j = 0; j <= n; j++) dp[0][j] = j;
    
    // Fill matrix
    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        if (s1[i - 1] === s2[j - 1]) {
          dp[i][j] = dp[i - 1][j - 1];
        } else {
          dp[i][j] = Math.min(
            dp[i - 1][j] + 1,     // deletion
            dp[i][j - 1] + 1,     // insertion
            dp[i - 1][j - 1] + 1  // substitution
          );
        }
      }
    }
    
    return dp[m][n];
  }
  
  /**
   * Find best matching hospital name from our database
   * Returns the matched hospital if similarity is above threshold
   */
  function findBestMatch(googleHospitalName, ourHospitals, threshold = 0.7) {
    let bestMatch = null;
    let bestScore = 0;
    
    for (const hospital of ourHospitals) {
      const score = stringSimilarity(googleHospitalName, hospital.name);
      if (score > bestScore) {
        bestScore = score;
        bestMatch = hospital;
      }
    }
    
    return bestScore >= threshold ? bestMatch : null;
  }
  
  module.exports = {
    stringSimilarity,
    findBestMatch
  };