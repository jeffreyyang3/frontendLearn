import { configureStore } from '@reduxjs/toolkit'
import greetingReducer from '../features/greeting/greetingSlice'

export const store = configureStore({
  reducer: {
    greeting: greetingReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
