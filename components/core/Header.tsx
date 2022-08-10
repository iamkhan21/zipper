import React, { FC } from "react";
import { Button } from "@mantine/core";
import { $user, signout } from "@store/user";
import { useStore } from "@nanostores/react";
import { Logout } from "tabler-icons-react";
import Link from "next/link";
import Image from "next/image";

type Props = {
  appName: string;
};

const Header: FC<Props> = ({ appName }) => {
  const user = useStore($user);
  return (
    <header className="py-1 px-5 flex items-center justify-between gap-5">
      <section className="flex items-center gap-2">
        <Image
          src="/images/logo.svg"
          className="logo"
          height={64}
          width={159}
          alt="Logo"
        />
      </section>
      {user && (
        <nav className="flex items-center gap-5">
          <Link href="/">
            <a>Version 2</a>
          </Link>
          <Link href="/zipper">
            <a>Version 1</a>
          </Link>
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
