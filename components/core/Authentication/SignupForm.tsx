import React, { useState } from "react";
import { Button, TextInput } from "@mantine/core";
import { useForm } from "react-hook-form";
import { Credentials, signup } from "@store/user";

const SignupForm = () => {
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

  function signupUser(data: Credentials) {
    setError(null);
    setLoading(true);

    signup(data).catch((e: Error) => {
      setLoading(false);
      setError(e.message);
      console.error(e);
    });
  }

  return (
    <form onSubmit={handleSubmit(signupUser)}>
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
        {...register("password", { minLength: 8, required: true })}
      />
      <Button
        type="submit"
        fullWidth
        size="md"
        disabled={!isValid}
        loading={loading}
      >
        Sign up
      </Button>
      <p className="py-2 text-red-600">{error}</p>
    </form>
  );
};

export default SignupForm;
