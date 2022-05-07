import React, { useState } from "react";
import { Card } from "@mantine/core";
import SigninForm from "@components/Authentication/SigninForm";
import SignupForm from "@components/Authentication/SignupForm";

type FormType = "signin" | "signup";

const Authentication = () => {
  const [activeForm, setActiveForm] = useState<FormType>("signin");

  function selectForm(formName: FormType) {
    return () => setActiveForm(formName);
  }

  const signinLinkClass =
    activeForm === "signin" ? "font-black" : "hover:underline";
  const signupLinkClass =
    activeForm === "signup" ? "font-black" : "hover:underline";

  return (
    <article className="h-full flex items-center justify-center">
      <Card shadow="md" className="max-w-30rem w-full">
        <section className="flex items-center text-xl mb-4">
          <a
            onClick={selectForm("signin")}
            className={`cursor-pointer ${signinLinkClass}`}
          >
            Signin
          </a>
          <span className="px-1"> | </span>
          <a
            onClick={selectForm("signup")}
            className={`cursor-pointer ${signupLinkClass}`}
          >
            Signup
          </a>
        </section>
        {activeForm === "signin" ? <SigninForm /> : <SignupForm />}
      </Card>
    </article>
  );
};

export default Authentication;
