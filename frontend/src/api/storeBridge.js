let storeRef = null;

export function setApiStore(store) {
  storeRef = store;
}

export function getApiStore() {
  return storeRef;
}
