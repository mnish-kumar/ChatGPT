import { configureStore } from '@reduxjs/toolkit';
import userReducer from './reducers/userSlice';
import chatReducer from './reducers/chatSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    chat: chatReducer,
  },
})