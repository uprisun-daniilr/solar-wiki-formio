export class GoogleMapProvider extends Formio.Providers.providers.address
  .google {
  constructor(...props) {
    super(...props);
  }
  static get name() {
    return "google";
  }

  static get displayName() {
    return "Google Maps";
  }

  updateMap({ lat, lng }) {
    this.marker.setPosition({
      lat,
      lng,
    });
    this.map.setCenter(this.marker.position);
  }

  reverseGeocode(lat, lng) {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode(
      {
        location: {
          lat,
          lng,
        },
      },
      (results, status) => {
        const address = results[0];

        if (status === "OK" && address) {
          let isAddressAllowed = true;
          const autocompleteOptions = this.options.params.autocompleteOptions;

          if (
            autocompleteOptions.componentRestrictions &&
            autocompleteOptions.componentRestrictions.country
          ) {
            const country = address.address_components.find(
              (item) => item.types.indexOf("country") !== -1
            );
            if (!country) {
              isAddressAllowed = false;
            } else if (
              country.short_name.toLowerCase() !==
              autocompleteOptions.componentRestrictions.country.toLowerCase()
            ) {
              isAddressAllowed = false;
            }
          }

          if (!isAddressAllowed) {
            return;
          }

          const input = this.element;
          if (input) {
            this.onSelectAddress(address, this.element);
            this.updateMap({
              lat,
              lng,
            });
          }
        } else {
          console.error("Geocoder failed due to:", status);
        }
      }
    );
  }

  initMap(mapElement, defaultZoom, defaultCenter) {
    this.map = new google.maps.Map(mapElement, {
      zoom: defaultZoom,
      center: this.currentValue || defaultCenter,
    });

    this.marker = new google.maps.Marker({
      position: this.currentValue || defaultCenter,
      map: this.map,
      draggable: true,
    });

    if (!this.element.disabled) {
      google.maps.event.addListener(this.marker, "dragend", (event) => {
        const lat = event.latLng.lat();
        const lng = event.latLng.lng();
        this.reverseGeocode(lat, lng);
      });

      google.maps.event.addListener(this.map, "click", (event) => {
        const lat = event.latLng.lat();
        const lng = event.latLng.lng();
        this.reverseGeocode(lat, lng);
      });
    }

    if (this.element.value) {
      var request = {
        query: this.element.value,
        fields: ["name", "geometry"],
      };

      var service = new google.maps.places.PlacesService(this.map);

      service.findPlaceFromQuery(request, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          this.map.setCenter(results[0].geometry.location);
          this.marker.setPosition(results[0].geometry.location);
        }
      });
    }
  }

  attachAutocomplete(elem, index, onSelectAddress) {
    this.onSelectAddress = onSelectAddress;
    this.element = elem;

    const { defaultCenterLat, defaultCenterLng, isMapEnabled, defaultZoom } =
      this.options.params;

    const mapElement = document.createElement("div");
    mapElement.style.height = "400px";
    mapElement.style["margin-top"] = "16px";
    mapElement.style.width = "100%";
    mapElement.style.background = "#eee";

    if (isMapEnabled) {
      elem.parentNode.insertBefore(mapElement, elem.nextSibling);
    }

    Formio.libraryReady(this.getLibraryName()).then(() => {
      const autocomplete = new google.maps.places.Autocomplete(
        elem,
        this.autocompleteOptions
      );

      autocomplete.addListener("place_changed", () => {
        const place = this.filterPlace(autocomplete.getPlace());

        const location = place.geometry
          ? {
              lat: place.geometry.location.lat(),
              lng: place.geometry.location.lng(),
            }
          : null;

        if (isMapEnabled) {
          this.updateMap(location);
        }

        place.formattedPlace = _.get(
          autocomplete,
          "gm_accessors_.place.se.formattedPrediction",
          place[this.alternativeDisplayValueProperty]
        );
        onSelectAddress(place, elem, index);
      });

      if (isMapEnabled) {
        this.initMap(mapElement, defaultZoom, {
          lat: defaultCenterLat,
          lng: defaultCenterLng,
        });
      }
    });
  }
  static initialize() {
    const addressEditForm = Formio.Components.components.address.editForm;

    Formio.Components.components.address.editForm = (...args) => {
      const editForm = addressEditForm(...args);

      const tabs = editForm.components.find(({ type }) => type === "tabs");

      const provider = tabs.components.find(({ key }) => key === "provider");

      provider.components.push({
        type: "checkbox",
        input: true,
        inputType: "checkbox",
        key: "providerOptions.params.isMapEnabled",
        label: "Show Map",
        defaultValue: false,
        conditional: {
          json: {
            "===": [
              {
                var: "data.provider",
              },
              "google",
            ],
          },
        },
      });

      provider.components.push({
        type: "number",
        input: true,
        key: "providerOptions.params.defaultZoom",
        label: "Zoom",
        defaultValue: 8,
        conditional: {
          json: {
            "===": [
              {
                var: "data.provider",
              },
              "google",
            ],
          },
        },
      });

      provider.components.push({
        type: "number",
        input: true,
        key: "providerOptions.params.defaultCenterLat",
        label: "Default Center Latitude",
        defaultValue: 40.712776,
        conditional: {
          json: {
            "===": [
              {
                var: "data.provider",
              },
              "google",
            ],
          },
        },
      });

      provider.components.push({
        type: "number",
        input: true,
        key: "providerOptions.params.defaultCenterLng",
        label: "Default Center Longitude",
        defaultValue: -74.0059728,
        conditional: {
          json: {
            "===": [
              {
                var: "data.provider",
              },
              "google",
            ],
          },
        },
      });

      return editForm;
    };
  }
}
