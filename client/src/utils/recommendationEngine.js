// AI Recommendation Engine for AnimeGPT
// Implements collaborative filtering, content-based filtering, and hybrid approaches

// User similarity calculation using collaborative filtering
export const calculateUserSimilarity = (user1, user2) => {
  if (!user1 || !user2 || !user1.ratings || !user2.ratings) return 0;
  
  const commonAnime = Object.keys(user1.ratings).filter(animeId => 
    Object.prototype.hasOwnProperty.call(user2.ratings, animeId)
  );
  
  if (commonAnime.length === 0) return 0;
  
  // Pearson correlation coefficient
  const mean1 = Object.values(user1.ratings).reduce((a, b) => a + b, 0) / Object.keys(user1.ratings).length;
  const mean2 = Object.values(user2.ratings).reduce((a, b) => a + b, 0) / Object.keys(user2.ratings).length;
  
  let numerator = 0;
  let denom1 = 0;
  let denom2 = 0;
  
  commonAnime.forEach(animeId => {
    const val1 = user1.ratings[animeId] - mean1;
    const val2 = user2.ratings[animeId] - mean2;
    numerator += val1 * val2;
    denom1 += val1 * val1;
    denom2 += val2 * val2;
  });
  
  const denominator = Math.sqrt(denom1 * denom2);
  return denominator === 0 ? 0 : numerator / denominator;
};

// Content-based filtering using anime features
export const calculateContentSimilarity = (anime1, anime2) => {
  if (!anime1 || !anime2) return 0;
  
  let similarity = 0;
  let totalWeight = 0;
  
  // Genre similarity (weight: 0.4)
  if (anime1.genres && anime2.genres) {
    const genres1 = new Set(anime1.genres.map(g => g.name.toLowerCase()));
    const genres2 = new Set(anime2.genres.map(g => g.name.toLowerCase()));
    const intersection = new Set([...genres1].filter(x => genres2.has(x)));
    const union = new Set([...genres1, ...genres2]);
    const genreSimilarity = intersection.size / union.size;
    similarity += genreSimilarity * 0.4;
    totalWeight += 0.4;
  }
  
  // Type similarity (weight: 0.2)
  if (anime1.type && anime2.type) {
    const typeSimilarity = anime1.type === anime2.type ? 1 : 0;
    similarity += typeSimilarity * 0.2;
    totalWeight += 0.2;
  }
  
  // Score similarity (weight: 0.2)
  if (anime1.score && anime2.score) {
    const scoreDiff = Math.abs(anime1.score - anime2.score);
    const scoreSimilarity = Math.max(0, 1 - scoreDiff / 10);
    similarity += scoreSimilarity * 0.2;
    totalWeight += 0.2;
  }
  
  // Year similarity (weight: 0.1)
  if (anime1.year && anime2.year) {
    const yearDiff = Math.abs(anime1.year - anime2.year);
    const yearSimilarity = Math.max(0, 1 - yearDiff / 20);
    similarity += yearSimilarity * 0.1;
    totalWeight += 0.1;
  }
  
  // Studio similarity (weight: 0.1)
  if (anime1.studios && anime2.studios) {
    const studio1 = anime1.studios[0]?.name?.toLowerCase();
    const studio2 = anime2.studios[0]?.name?.toLowerCase();
    const studioSimilarity = studio1 === studio2 ? 1 : 0;
    similarity += studioSimilarity * 0.1;
    totalWeight += 0.1;
  }
  
  return totalWeight > 0 ? similarity / totalWeight : 0;
};

// Collaborative filtering recommendations
export const getCollaborativeRecommendations = (currentUser, allUsers, animeData, limit = 10) => {
  if (!currentUser || !currentUser.ratings || Object.keys(currentUser.ratings).length === 0) {
    return [];
  }
  
  // Calculate similarities with other users
  const userSimilarities = allUsers
    .filter(user => user.id !== currentUser.id && user.ratings)
    .map(user => ({
      user,
      similarity: calculateUserSimilarity(currentUser, user)
    }))
    .filter(item => item.similarity > 0.3) // Only consider similar users
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, 20); // Top 20 similar users
  
  // Calculate weighted ratings for anime not in user's watchlist
  const animeScores = {};
  const userWatchedAnime = new Set(Object.keys(currentUser.ratings));
  
  userSimilarities.forEach(({ user, similarity }) => {
    Object.entries(user.ratings).forEach(([animeId, rating]) => {
      if (!userWatchedAnime.has(animeId)) {
        if (!animeScores[animeId]) {
          animeScores[animeId] = { totalScore: 0, totalWeight: 0 };
        }
        animeScores[animeId].totalScore += rating * similarity;
        animeScores[animeId].totalWeight += Math.abs(similarity);
      }
    });
  });
  
  // Convert to recommendations
  const recommendations = Object.entries(animeScores)
    .map(([animeId, { totalScore, totalWeight }]) => ({
      animeId,
      score: totalWeight > 0 ? totalScore / totalWeight : 0,
      confidence: totalWeight
    }))
    .filter(rec => rec.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
  
  return recommendations;
};

// Content-based recommendations
export const getContentBasedRecommendations = (userWatchlist, allAnime, limit = 10) => {
  if (!userWatchlist || userWatchlist.length === 0) {
    return [];
  }
  
  // Calculate user's genre preferences
  const genrePreferences = {};
  const typePreferences = {};
  let totalAnime = 0;
  
  userWatchlist.forEach(anime => {
    if (anime.genres) {
      anime.genres.forEach(genre => {
        genrePreferences[genre.name] = (genrePreferences[genre.name] || 0) + 1;
      });
    }
    if (anime.type) {
      typePreferences[anime.type] = (typePreferences[anime.type] || 0) + 1;
    }
    totalAnime++;
  });
  
  // Normalize preferences
  Object.keys(genrePreferences).forEach(genre => {
    genrePreferences[genre] /= totalAnime;
  });
  Object.keys(typePreferences).forEach(type => {
    typePreferences[type] /= totalAnime;
  });
  
  // Score all anime based on user preferences
  const animeScores = allAnime
    .filter(anime => !userWatchlist.find(w => w.mal_id === anime.mal_id))
    .map(anime => {
      let score = 0;
      
      // Genre preference score (60% weight)
      if (anime.genres) {
        anime.genres.forEach(genre => {
          score += (genrePreferences[genre.name] || 0) * 0.6;
        });
      }
      
      // Type preference score (30% weight)
      if (anime.type && typePreferences[anime.type]) {
        score += typePreferences[anime.type] * 0.3;
      }
      
      // Popularity bonus (10% weight)
      if (anime.score) {
        score += (anime.score / 10) * 0.1;
      }
      
      // Normalize score to 0-10 scale
      score = Math.min(score * 10, 10);
      
      return { anime, score };
    })
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
  
  return animeScores.map(item => ({
    animeId: item.anime.mal_id,
    score: item.score,
    confidence: 1.0
  }));
};

// Hybrid recommendations combining both approaches
export const getHybridRecommendations = (currentUser, allUsers, userWatchlist, allAnime, limit = 10) => {
  const collaborativeRecs = getCollaborativeRecommendations(currentUser, allUsers, allAnime, limit);
  const contentRecs = getContentBasedRecommendations(userWatchlist, allAnime, limit);
  
  // Combine and deduplicate recommendations
  const combinedRecs = new Map();
  
  // Add collaborative recommendations
  collaborativeRecs.forEach(rec => {
    combinedRecs.set(rec.animeId, {
      ...rec,
      collaborativeScore: rec.score,
      contentScore: 0,
      finalScore: rec.score * 0.6 // Collaborative gets 60% weight
    });
  });
  
  // Add content-based recommendations
  contentRecs.forEach(rec => {
    if (combinedRecs.has(rec.animeId)) {
      const existing = combinedRecs.get(rec.animeId);
      existing.contentScore = rec.score;
      existing.finalScore = existing.finalScore + rec.score * 0.4; // Content gets 40% weight
    } else {
      combinedRecs.set(rec.animeId, {
        ...rec,
        collaborativeScore: 0,
        contentScore: rec.score,
        finalScore: rec.score * 0.4
      });
    }
  });
  
  // Sort by final score and return
  return Array.from(combinedRecs.values())
    .sort((a, b) => b.finalScore - a.finalScore)
    .slice(0, limit);
};

// Get personalized recommendations for a user
export const getPersonalizedRecommendations = async (userId, userWatchlist, allAnime, limit = 10) => {
  try {
    // For now, we'll use content-based recommendations
    // In a full implementation, you'd fetch user data and other users' data from your backend
    const recommendations = getContentBasedRecommendations(userWatchlist, allAnime, limit);
    
    // Enhance with additional metadata
    const enhancedRecs = recommendations.map(rec => {
      const anime = allAnime.find(a => a.mal_id === parseInt(rec.animeId));
      return {
        ...rec,
        anime: anime,
        reason: getRecommendationReason(rec, userWatchlist, anime)
      };
    });
    
    return enhancedRecs;
  } catch (error) {
    console.error('Error getting personalized recommendations:', error);
    return [];
  }
};

// Generate explanation for why an anime was recommended
export const getRecommendationReason = (recommendation, userWatchlist, anime) => {
  if (!anime || !userWatchlist) return 'Based on your preferences';
  
  const userGenres = new Set();
  userWatchlist.forEach(watchlistAnime => {
    if (watchlistAnime.genres) {
      watchlistAnime.genres.forEach(genre => userGenres.add(genre.name));
    }
  });
  
  const commonGenres = anime.genres?.filter(genre => userGenres.has(genre.name)) || [];
  
  if (commonGenres.length > 0) {
    return `Because you like ${commonGenres.slice(0, 2).map(g => g.name).join(' and ')} anime`;
  }
  
  if (anime.score && anime.score > 8) {
    return 'Highly rated anime that matches your taste';
  }
  
  return 'Based on your watching patterns';
};

// Update user preferences based on new interactions
export const updateUserPreferences = (currentPreferences, newInteraction) => {
  const { animeId, action, value } = newInteraction;
  
  if (!currentPreferences.ratings) {
    currentPreferences.ratings = {};
  }
  
  if (action === 'rate') {
    currentPreferences.ratings[animeId] = value;
  } else if (action === 'watch') {
    currentPreferences.ratings[animeId] = Math.max(currentPreferences.ratings[animeId] || 0, 7);
  } else if (action === 'drop') {
    currentPreferences.ratings[animeId] = Math.min(currentPreferences.ratings[animeId] || 5, 3);
  }
  
  return currentPreferences;
};
