// src/layoutProvider/providers.js
"use client";

import { useEffect } from "react";
import { Provider } from "react-redux";
import { useDispatch } from "react-redux";
import { I18nextProvider } from "react-i18next";
import i18n from "@/lib/language/i18n";
import store from "@/redux/store/store";
import { checkSession } from "@/redux/action/authAction";

function AuthProvider({ children }) {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkSession());
  }, [dispatch]);

  return <>{children}</>;
}

export function Providers({ children }) {
  return (
    <I18nextProvider i18n={i18n}>
      <Provider store={store}>
        <AuthProvider>{children}</AuthProvider>
      </Provider>
    </I18nextProvider>
  );
}
