// src/layoutProvider/providers.js
"use client";

import { useEffect } from "react";
import { Provider, useDispatch, useSelector } from "react-redux";
import { I18nextProvider } from "react-i18next";
import i18n from "@/lib/language/i18n";
import store from "@/redux/store/store";
import { checkSession } from "@/redux/action/authAction";
import AuthLoadingOverlay from "@/components/community/local-services/authLoadingOverlay";

function AuthProvider({ children }) {
  const dispatch = useDispatch();

  // The following logic for proactive session checking is commented out
  // to restrict the check to the service card call.
  // const { isSessionChecking, sessionChecked } = useSelector(
  //   (state) => state.auth
  // );

  // useEffect(() => {
  //   if (!sessionChecked) {
  //     dispatch(checkSession());
  //   }
  // }, [dispatch, sessionChecked]);

  // if (isSessionChecking || !sessionChecked) {
  //   return (
  //     <AuthLoadingOverlay
  //       isVisible={true}
  //       serviceName="Authentication Service"
  //     />
  //   );
  // }

  // The AuthProvider now simply renders its children immediately.
  // The session checking logic will now be handled by the service card component.
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
