const rootForm = instance.root;

const inverterField = rootForm.getComponent("inverter");
const notInListField = rootForm.getComponent("notInList");
const warrantyField = rootForm.getComponent("warranty");
const typeField = rootForm.getComponent("type");
const linkField = rootForm.getComponent("link");
const manufacturerField = rootForm.getComponent("manufacturer");

const fields = [
  inverterField,
  typeField,
  warrantyField,
  linkField,
  manufacturerField,
];

const isChecked = data.notInList;

if (data.notInListPrev !== isChecked && data.notInListPrev !== undefined) {
  data.notInListPrev = isChecked;
  fields.forEach((field) => {
    field.setValue("");
    field.redraw();
  });
}
