import { createSlice } from '@reduxjs/toolkit'

type GreetingState = {
  message: string
  enthusiasm: number
}

const initialState: GreetingState = {
  message: 'Hello, Redux Toolkit',
  enthusiasm: 1,
}

const greetingSlice = createSlice({
  name: 'greeting',
  initialState,
  reducers: {
    addEnthusiasm: (state) => {
      state.enthusiasm += 1
    },
    resetGreeting: () => initialState,
  },
})

export const { addEnthusiasm, resetGreeting } = greetingSlice.actions
export default greetingSlice.reducer
