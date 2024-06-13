import { GoogleMapProvider } from "./components/google-map.provider";
import { UtilityProviderSelectComponent } from "./components/utility-select.component";

window.addEventListener("DOMContentLoaded", () => {
  console.log("Custom components was loaded.");
  GoogleMapProvider.initialize();

  Formio.Providers.addProvider("address", "google", GoogleMapProvider);

  Formio.Components.addComponent(
    "utilityproviderselect",
    UtilityProviderSelectComponent
  );
});
