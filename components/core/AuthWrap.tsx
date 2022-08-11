import React, { FC, ReactNode, useEffect } from "react";
import { $authChecked, $user, checkAuthentication } from "@store/user";
import { useStore } from "@nanostores/react";
import Authentication from "@components/core/Authentication";
import Loader from "@components/shared/Loader";

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
    <article className="h-full flex flex-col items-center justify-center">
      <Loader />
    </article>
  );
};

export default AuthWrap;
