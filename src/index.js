import { GoogleMapProvider } from "./components/google-map.provider";
import { UtilityProviderSelectComponent } from "./components/utility-select.component";

console.log(Formio.Components);
window.addEventListener("load", () => {
  console.log("Loaded");
  GoogleMapProvider.initialize();

  Formio.Providers.addProvider("address", "google", GoogleMapProvider);

  console.log(Formio.Components);
  Formio.Components.addComponent(
    "utilityproviderselect",
    UtilityProviderSelectComponent
  );
  console.log(Formio.Components);
});
