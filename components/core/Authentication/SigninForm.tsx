import React, { useState } from "react";
import { Button, TextInput } from "@mantine/core";
import { useForm } from "react-hook-form";
import { Credentials, signin } from "@store/user";

const SigninForm = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const {
    handleSubmit,
    register,
    formState: { isValid },
  } = useForm<Credentials>({
    mode: "onChange",
    delayError: 750,
  });

  function signinUser(data: Credentials) {
    setError(null);
    setLoading(true);

    signin(data).catch((e: Error) => {
      setLoading(false);
      setError(e.message);
      console.error(e);
    });
  }

  return (
    <form onSubmit={handleSubmit(signinUser)}>
      <TextInput
        className="mb-2"
        label="Email"
        disabled={loading}
        type="email"
        {...register("email", { required: true })}
      />
      <TextInput
        className="mb-5"
        label="Password"
        type="password"
        disabled={loading}
        {...register("password", { required: true })}
      />

      <Button
        type="submit"
        fullWidth
        size="md"
        disabled={!isValid}
        loading={loading}
      >
        Sign in
      </Button>

      <p className="py-2 text-red-600">{error}</p>
    </form>
  );
};

export default SigninForm;
