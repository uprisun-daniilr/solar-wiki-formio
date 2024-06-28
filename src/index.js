import { GoogleMapProvider } from "./components/google-map.provider";
import { UtilityProviderSelectComponent } from "./components/utility-select.component";

(() => {
  console.info("Custom components was loaded.");
  GoogleMapProvider.initialize();

  Formio.Providers.addProvider("address", "google", GoogleMapProvider);

  Formio.Components.addComponent(
    "utilityproviderselect",
    UtilityProviderSelectComponent
  );
})();

$(document).ready(function () {
  $(".btn-wizard-nav-cancel").text("Reset");
});
