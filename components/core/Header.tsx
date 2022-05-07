import React, { FC } from "react";
import { Button } from "@mantine/core";
import { $user, signout } from "@store/user";
import { useStore } from "@nanostores/react";
import { Logout } from "tabler-icons-react";

type Props = {
  appName: string;
};

const Header: FC<Props> = ({ appName }) => {
  const user = useStore($user);
  return (
    <header className="py-1 px-5 flex items-center justify-between gap-5">
      <section className="flex items-center gap-2">
        <img src="/logo.svg" width={24} alt="Logo" />
        <h1 className="text-xl font-black">{appName}</h1>
      </section>
      {user && (
        <nav>
          <Button
            color="red"
            onClick={signout}
            variant="outline"
            compact
            rightIcon={<Logout size={16} />}
          >
            Sign out
          </Button>
        </nav>
      )}
    </header>
  );
};

export default Header;
