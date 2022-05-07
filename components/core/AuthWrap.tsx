import React, { FC, ReactNode, useEffect } from "react";
import { $authChecked, $user, checkAuthentication } from "@store/user";
import { useStore } from "@nanostores/react";
import Authentication from "@components/Authentication";

type Props = {
  children?: ReactNode;
};

const AuthWrap: FC<Props> = ({ children }) => {
  const isAuthChecked = useStore($authChecked);
  const user = useStore($user);

  useEffect(() => {
    checkAuthentication();
  }, []);

  return isAuthChecked ? (
    user ? (
      <>{children}</>
    ) : (
      <Authentication />
    )
  ) : (
    <p>Loading</p>
  );
};

export default AuthWrap;
