import { atom } from "nanostores";
import userbase, { UserResult as User } from "userbase-js";

const APP_ID = process.env.NEXT_PUBLIC_USERBASE_APP_ID as string;

export type Credentials = {
  username: string;
  password: string;
};

export const $user = atom<User | null>(null);
export const $authChecked = atom<boolean>(false);

export function checkAuthentication() {
  userbase
    .init({
      appId: APP_ID,
    })
    .then((session) => {
      if (session.user) {
        $user.set(session.user);
      } else {
        $user.set(null);
      }
    })
    .catch((e) => console.error(e))
    .finally(() =>
      setTimeout(() => {
        $authChecked.set(true);
      }, 1000)
    );
}

export function signup(creds: Credentials) {
  return userbase.signUp(creds).then((user) => {
    $user.set(user);
  });
}

export function signin(creds: Credentials) {
  return userbase.signIn(creds).then((user) => {
    $user.set(user);
  });
}

export function signout() {
  return userbase.signOut().then(() => {
    $user.set(null);
  });
}
