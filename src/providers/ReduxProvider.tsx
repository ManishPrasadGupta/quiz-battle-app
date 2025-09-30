"use client";

import { Provider } from "react-redux";
import { ReactNode, useRef } from "react";
import { store, AppStore } from "store";

export default function ReduxProvider({ children }: { children: ReactNode }) {
  const storeRef = useRef<AppStore>(undefined);
  if (!storeRef.current) {
    // Create the store instance the first time this renders
    storeRef.current = store();
  }
  return <Provider store={storeRef.current}>{children}</Provider>;
}
