import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  popularAnime: [],
  animeTrailer: null,
};

const animeSlice = createSlice({
  name: 'anime',
  initialState,
  reducers: {
    addPopularAnime: (state, action) => {
      state.popularAnime = action.payload;
    },
    setAnimeTrailer: (state, action) => {
      state.animeTrailer = action.payload;
    },
  },
});

export const { addPopularAnime, setAnimeTrailer } = animeSlice.actions;
export default animeSlice.reducer; 