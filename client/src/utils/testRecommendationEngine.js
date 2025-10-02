// Test file for recommendation engine
// This can be run in browser console to test the algorithms

import { 
  getContentBasedRecommendations, 
  getHybridRecommendations,
  calculateUserSimilarity 
} from './recommendationEngine.js';

// Test data
const testWatchlist = [
  {
    mal_id: 1,
    title: "Attack on Titan",
    genres: [{name: "Action"}, {name: "Dark Fantasy"}],
    type: "TV",
    userRating: 9
  },
  {
    mal_id: 2,
    title: "Demon Slayer",
    genres: [{name: "Action"}, {name: "Supernatural"}],
    type: "TV",
    userRating: 8
  }
];

const testAnime = [
  {
    mal_id: 1,
    title: "Attack on Titan",
    genres: [{name: "Action"}, {name: "Dark Fantasy"}],
    type: "TV",
    score: 9.0
  },
  {
    mal_id: 2,
    title: "Demon Slayer",
    genres: [{name: "Action"}, {name: "Supernatural"}],
    type: "TV",
    score: 8.9
  },
  {
    mal_id: 6,
    title: "Jujutsu Kaisen",
    genres: [{name: "Action"}, {name: "Supernatural"}],
    type: "TV",
    score: 8.6
  },
  {
    mal_id: 7,
    title: "Tokyo Ghoul",
    genres: [{name: "Action"}, {name: "Horror"}],
    type: "TV",
    score: 8.0
  }
];

// Test functions
export const testContentBased = () => {
  console.log('Testing Content-Based Recommendations...');
  const recs = getContentBasedRecommendations(testWatchlist, testAnime, 5);
  console.log('Content-Based Results:', recs);
  return recs;
};

export const testUserSimilarity = () => {
  console.log('Testing User Similarity...');
  const user1 = { id: "user1", ratings: { "1": 9, "2": 8 } };
  const user2 = { id: "user2", ratings: { "1": 9, "2": 8, "6": 9 } };
  const similarity = calculateUserSimilarity(user1, user2);
  console.log('User Similarity:', similarity);
  return similarity;
};

export const testHybrid = () => {
  console.log('Testing Hybrid Recommendations...');
  const currentUser = { id: "user1", ratings: { "1": 9, "2": 8 } };
  const allUsers = [
    { id: "user2", ratings: { "1": 9, "2": 8, "6": 9 } }
  ];
  const recs = getHybridRecommendations(currentUser, allUsers, testWatchlist, testAnime, 5);
  console.log('Hybrid Results:', recs);
  return recs;
};

// Run all tests
export const runAllTests = () => {
  console.log('=== AI Recommendation Engine Tests ===');
  testContentBased();
  testUserSimilarity();
  testHybrid();
  console.log('=== Tests Complete ===');
};

// Make functions available globally for console testing
if (typeof window !== 'undefined') {
  window.testRecommendationEngine = {
    testContentBased,
    testUserSimilarity,
    testHybrid,
    runAllTests
  };
}
