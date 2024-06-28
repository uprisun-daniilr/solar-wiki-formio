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

document.addEventListener("DOMContentLoaded", function () {
  const wizardCancelButtons = document.getElementsByClassName(
    "btn-wizard-nav-cancel"
  );

  if (wizardCancelButtons.length > 0) {
    wizardCancelButtons.forEach((button) => (button.textContent = "Reset"));
  }
});
