export const getRoot = (component) => {
  if (component.root) {
    return getRoot(component.root);
  } else {
    return component;
  }
};
