export class UtilityProviderSelectComponent extends Formio.Components.components
  .select {
  static schema(...extend) {
    return SelectComponent.schema(
      {
        type: "utilityProviderSelect",
        label: "Utility provider select",
        key: "utilityProviderSelect",
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
      group: "basic",
      icon: "fa fa-list",
      weight: 70,
      schema: CustomSelectComponent.schema(),
    };
  }

  loadItems(url, search, headers, options, method) {
    const form = this.root;
    console.log(form);
    const lat = form.getComponent("latitude").getValue();
    const lon = form.getComponent("longitude").getValue();

    if (lat && lon) {
      url = `https://developer.nrel.gov/api/utility_rates/v3.json?api_key=DEMO_KEY&lat=${lat}&lon=${lon}`;
    }

    return super.loadItems(url, search, headers, options, method);
  }
}
