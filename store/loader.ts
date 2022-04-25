import { atom } from "nanostores";

export const $loader = atom<string | null>(null);

export function enableLoader(msg: string) {
  $loader.set(msg);
}

export function disableLoader() {
  $loader.set(null);
}
