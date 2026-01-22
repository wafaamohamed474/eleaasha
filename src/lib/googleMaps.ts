import { importLibrary, setOptions } from "@googlemaps/js-api-loader";

export const loadGoogleMaps = async () => {
  if (typeof window === "undefined") return Promise.reject("Client side only");

  setOptions({
    key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
    v: "weekly",
    // libraries: ["places"], // handled by importLibrary
    language: "ar",
    region: "SA",
  });

  return Promise.all([importLibrary("maps"), importLibrary("places")]);
};
