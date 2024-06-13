export const getRoot = (component) => {
  if (component.root && component.root !== component) {
    return getRoot(component.root);
  } else {
    return component;
  }
};
