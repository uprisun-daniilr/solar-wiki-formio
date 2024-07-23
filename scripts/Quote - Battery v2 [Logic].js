function findDeep(obj, key) {
  const keys = key.split(".");
  for (let k of keys) {
    if (obj && typeof obj === "object" && k in obj) {
      obj = obj[k];
    } else {
      return null;
    }
  }
  return obj;
}

const DOMAIN = "https://gosolar.info";
const rootForm = instance.root;
const manufacturerField = rootForm.getComponent("manufacturer");
const warrantyField = rootForm.getComponent("warranty");
const capacityField = rootForm.getComponent("capacity");
const linkField = rootForm.getComponent("link");

const fields = [warrantyField, capacityField, linkField, manufacturerField];

if (!value || !value.id) return;

const warranty = findDeep(
  value,
  "properties.Warranty & Life Information.Warranty.value"
);
warrantyField.setValue(warranty ? parseInt(warranty) : "");

const capacity = findDeep(
  value,
  "properties.Battery Overview.Total Capacity.value"
);
capacityField.setValue(capacity ? parseInt(capacity) : "");

const manufacturer = findDeep(value, "Manufacture.title");
manufacturerField.setValue(manufacturer);

const link = `${DOMAIN}/info?solution_id=${value.id}&solution_type=battery`;
linkField.setValue(link);

fields.forEach((field) => field.redraw());
