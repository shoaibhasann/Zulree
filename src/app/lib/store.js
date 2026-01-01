import { configureStore } from "@reduxjs/toolkit";


export const makeStore = () => {
  return configureStore({
    reducer: {
      
    },
    devTools: process.env.NODE_ENV !== "production"
  });
};
