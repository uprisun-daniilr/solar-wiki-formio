import { GoogleMapProvider } from "./components/google-map.provider";
import { UtilityProviderSelectComponent } from "./components/utility-select.component";

(() => {
  window.addEventListener("load", () => {
    GoogleMapProvider.initialize();

    Formio.Providers.addProvider("address", "google", GoogleMapProvider);

    console.log(Formio.Components);
    Formio.Components.addComponent(
      "utilityproviderselect",
      UtilityProviderSelectComponent
    );
    console.log(Formio.Components);
  });
})();
