import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  topAiringAnime: [],
  nowPlayingAnime: [],
  topRatedAnime: [],
  topAnimeMovies: [],
  animeTrailer: null,
};

const animeSlice = createSlice({
  name: 'anime',
  initialState,
  reducers: {
    addTopAiringAnime: (state, action) => {
      state.topAiringAnime = action.payload;
    },
    addNowPlayingAnime: (state, action) => {
      state.nowPlayingAnime = action.payload;
    },
    addTopRatedAnime: (state, action) => {
      state.topRatedAnime = action.payload;
    },
    addTopAnimeMovies: (state, action) => {
      state.topAnimeMovies = action.payload;
    },
    setAnimeTrailer: (state, action) => {
      state.animeTrailer = action.payload;
    },
  },
});

export const { 
  addTopAiringAnime, 
  addNowPlayingAnime, 
  addTopRatedAnime, 
  addTopAnimeMovies, 
  setAnimeTrailer 
} = animeSlice.actions;
export default animeSlice.reducer; 