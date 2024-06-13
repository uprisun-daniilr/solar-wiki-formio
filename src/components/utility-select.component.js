export class UtilityProviderSelectComponent extends Formio.Components.components
  .select {
  static schema(...extend) {
    return Formio.Components.components.select.schema(
      {
        type: "utilityproviderselect",
        label: "Utility provider select",
        key: "utilityproviderselect",
        dataSrc: "url",
        valueProperty: "value",
        template: "<span>{{ item.label }}</span>",
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
    const form = this.root;
    const address = form.getComponent("address");
    const addressTab = form.getComponent("addressTab");
    console.log("address: ", address);
    console.log("addressTab: ", addressTab);

    if (!address) return [];

    const addressValue = address.getValue();
    console.log("addressValue: ", addressValue);

    const lon = 0;
    const lat = 0;

    const api_key = this.component.api_key;

    if (lat && lon) {
      url = `https://developer.nrel.gov/api/utility_rates/v3.json?api_key=${api_key}&lat=${lat}&lon=${lon}`;
    }

    return super.loadItems(url, search, headers, options, method);
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
      ],
      ...extend
    );
  }
}
