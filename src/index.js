import { GoogleMapProvider } from "./google-map.provider";

(() => {
  window.addEventListener("load", () => {
    GoogleMapProvider.initialize();
    Formio.Providers.addProvider("address", "google", GoogleMapProvider);
  });
})();
