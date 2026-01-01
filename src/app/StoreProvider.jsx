"use client";

import { Provider } from "react-redux";

import { useEffect, useState } from "react";
import { checkAuth } from "./lib/features/auth/authThunks";
import { makeStore } from "./lib/store";


export default function ReduxProvider({ children }) {
  const [store] = useState(() => makeStore());

  return <Provider store={store}>{children}</Provider>;
}
