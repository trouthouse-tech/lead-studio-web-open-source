import { combineReducers } from "@reduxjs/toolkit";
import { appReducer } from "./appSlice";

export const rootReducer = combineReducers({
  app: appReducer,
});
