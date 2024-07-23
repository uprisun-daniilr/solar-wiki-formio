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
const typeField = rootForm.getComponent("type");
const linkField = rootForm.getComponent("link");
const maxPowerField = rootForm.getComponent("power");

const fields = [
  warrantyField,
  typeField,
  linkField,
  manufacturerField,
  maxPowerField,
];

if (!value || !value.id) return;

const warranty = findDeep(value, "properties.Inverter Overview.Warranty.value");
warrantyField.setValue(warranty ? parseInt(warranty) : "");

const type = findDeep(value, "properties.Inverter Overview.Type.value");
typeField.setValue(type);

const manufacturer = findDeep(value, "Manufacture.title");
manufacturerField.setValue(manufacturer);

const maxPower = findDeep(
  value,
  "properties.Inverter Overview.Maximum Output Power.value"
);
maxPowerField.setValue(maxPower ? parseInt(maxPower) : "");

const link = `${DOMAIN}/info?solution_id=${value.id}&solution_type=inverter`;
linkField.setValue(link);

fields.forEach((field) => field.redraw());
