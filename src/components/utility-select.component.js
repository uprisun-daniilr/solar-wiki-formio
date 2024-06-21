import { getRoot } from "./helper";

export class UtilityProviderSelectComponent extends Formio.Components.components
  .select {
  static schema(...extend) {
    return Formio.Components.components.select.schema(
      {
        type: "utilityproviderselect",
        label: "Utility provider select",
        key: "utilityproviderselect",
        dataSrc: "url",
        valueProperty: "",
        selectValues: "outputs.utility_info",
        template: "<span>{{ item.utility_name }}</span>",
        data: {
          url: "",
        },
      },
      ...extend
    );
  }

  static get builderInfo() {
    return {
      title: "Utility provider select",
      group: "advanced",
      icon: "fa fa-list",
      weight: 70,
      schema: UtilityProviderSelectComponent.schema(),
    };
  }

  loadItems(url, search, headers, options, method) {
    const form = getRoot(this);

    const address = form.getComponent("address");

    if (!address) return [];

    const addressValue = address.getValue();

    const location =
      addressValue?.data?.address?.geometry?.location ||
      addressValue?.geometry?.location;

    if (!location) {
      return;
    }

    let { lat, lng } = location;

    lat = typeof lat === "function" ? lat() : lat;
    lng = typeof lng === "function" ? lng() : lng;

    const api_key = this.component.api_key;
    const radius = this.component.radius || 0;

    if (lat && lng) {
      url = `https://developer.nrel.gov/api/utility_rates/v3.json?api_key=${api_key}&lat=${lat}&lon=${lng}&radius=${radius}`;
    }

    return super
      .loadItems(url, search, headers, options, method)
      .then((items) => {
        console.log({ items });
        items.push({ utility_name: "Other", id: "other" });

        return items;
      });
  }

  static editForm(...extend) {
    return Formio.Components.components.select.editForm(
      [
        {
          key: "data",
          components: [
            {
              type: "textfield",
              input: true,
              label: "API Key",
              key: "api_key",
              weight: 20,
              placeholder: "Enter your API key",
              tooltip: "The API key for the data source",
            },
          ],
        },
        {
          key: "data",
          components: [
            {
              type: "textfield",
              input: true,
              label: "Radius",
              key: "radius",
              weight: 20,
              placeholder: "Enter search radius from 0 to 200",
            },
          ],
        },
      ],
      ...extend
    );
  }
}
