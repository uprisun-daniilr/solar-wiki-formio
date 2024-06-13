import { GoogleMapProvider } from "./components/google-map.provider";
import { UtilityProviderSelectComponent } from "./components/utility-select.component";

(() => {
  window.addEventListener("load", () => {
    GoogleMapProvider.initialize();

    Formio.Providers.addProvider("address", "google", GoogleMapProvider);

    Formio.Components.addComponent(
      "utilityproviderselect",
      UtilityProviderSelectComponent
    );
  });
})();
