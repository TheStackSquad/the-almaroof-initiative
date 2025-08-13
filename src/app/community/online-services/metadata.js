// src/app/community/online-services/services/metadata.js
import { RouteValidator } from "@/utils/route/routeValidator";

export async function generateMetadata({ params }) {
  const validator = new RouteValidator(params.params);
  const metadata = validator.getPageMetadata();

  return {
    title: `${metadata.title} | Oshodi-Isolo LGA`,
    description: metadata.description,
    openGraph: {
      title: metadata.title,
      description: metadata.description,
      type: "website",
    },
  };
}
