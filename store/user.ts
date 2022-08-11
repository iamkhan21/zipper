import { atom } from "nanostores";
import { auth } from "@lib/supabase";
import { User } from "@supabase/supabase-js";

export type Credentials = {
  email: string;
  password: string;
};

export const $user = atom<User | null>(null);

export const $authChecked = atom<boolean>(false);

export function checkAuthentication() {
  const user = auth.user();
  $user.set(user);

  setTimeout(() => {
    $authChecked.set(true);
  }, 2000);
}

export function signup(creds: Credentials) {
  return auth.signUp(creds).then(({ user }) => {
    $user.set(user);
  });
}

export function signin(creds: Credentials) {
  return auth.signIn(creds).then(({ user }) => {
    $user.set(user);
  });
}

export function signout() {
  return auth.signOut().then(() => {
    $user.set(null);
  });
}
