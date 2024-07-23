const rootForm = instance.root;

const notInListField = rootForm.getComponent("notInList");
const panelField = rootForm.getComponent("panel");
const warrantyField = rootForm.getComponent("warranty");
const capacityField = rootForm.getComponent("capacity");
const linkField = rootForm.getComponent("link");
const manufacturerField = rootForm.getComponent("manufacturer");

const fields = [
  warrantyField,
  capacityField,
  linkField,
  manufacturerField,
  panelField,
];

const isChecked = data.notInList;

if (data.notInListPrev !== isChecked && data.notInListPrev !== undefined) {
  data.notInListPrev = isChecked;

  fields.forEach((field) => {
    field.setValue("");
    field.redraw();
  });
}
