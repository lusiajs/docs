import { attach, type Component, type Instance, type Props } from "lusia";

const instances: Instance[] = [];
const hosts: HTMLElement[] = [];

export function host(): HTMLElement {
  const el = document.createElement("div");
  document.body.append(el);
  hosts.push(el);
  return el;
}

export function mount(component: Component, target: HTMLElement = host(), props?: Props): Instance {
  const instance = attach(component, target, props);
  instances.push(instance);
  return instance;
}

/** Detach every instance and remove every host. Call from afterEach. */
export function resetMounts(): void {
  for (const instance of instances.splice(0)) instance.detach();
  for (const el of hosts.splice(0)) el.remove();
}
