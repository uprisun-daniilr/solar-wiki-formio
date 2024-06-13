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
      schema: UtilityProviderSelectComponent.schema(),
    };
  }

  loadItems(url, search, headers, options, method) {
    const form = this.root;
    console.log(form);
    const lat = form.getComponent("latitude").getValue();
    const lon = form.getComponent("longitude").getValue();

    const api_key = this.component.api_key;

    if (lat && lon) {
      url = `https://developer.nrel.gov/api/utility_rates/v3.json?api_key=${api_key}&lat=${lat}&lon=${lon}`;
    }

    return super.loadItems(url, search, headers, options, method);
  }

  static initialize() {
    UtilityProviderSelectComponent.editForm = (...args) => {
      const editForm = Formio.Components.components.address.editForm(...args);
      console.log(editForm.components);
      // const tabs = editForm.components.find(({ type }) => type === "tabs");

      // const provider = tabs.components.find(({ key }) => key === "provider");

      // provider.components.push({
      //   key: "data",
      //   components: [
      //     {
      //       type: "textfield",
      //       input: true,
      //       label: "API Key",
      //       key: "api_key",
      //       weight: 20,
      //       placeholder: "Enter your API key",
      //       tooltip: "The API key for the data source",
      //     },
      //   ],
      // });

      return editForm;
    };
  }
}
