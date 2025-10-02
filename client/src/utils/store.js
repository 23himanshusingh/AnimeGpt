import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import animeReducer from './movieSlice';

const store = configureStore({
  reducer: {
    user: userReducer,
    anime: animeReducer,
  },
});

export default store; 