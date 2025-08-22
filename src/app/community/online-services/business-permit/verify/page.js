// src/app/community/online-services/business-permit/verify/page.js

import { Suspense } from "react";
import PaymentVerificationContent from "@/app/community/online-services/business-permit/verify/paymentVerificationContent";

export const metadata = {
  title: "Payment Verification",
};

// This is a Server Component that wraps the client component in Suspense.
export default function PaymentVerificationPage() {
  return (
    <Suspense>
      <PaymentVerificationContent />
    </Suspense>
  );
}
