import { useEffect } from "react";

import { useNavigate } from "react-router-dom";

import { LoginForm } from "../components/LoginForm";
import { useLoginForm } from "../hooks/useLoginForm";

export function LoginPage() {
  const navigate = useNavigate();
  const { form, onSubmit, isPending, errorMessage } = useLoginForm();

  useEffect(() => {
    if (!isPending && form.formState.isSubmitSuccessful) {
      navigate("/dashboard", { replace: true });
    }
  }, [form.formState.isSubmitSuccessful, isPending, navigate]);

  return (
    <LoginForm
      values={form.getValues()}
      errors={{
        email: form.formState.errors.email?.message,
        senha: form.formState.errors.senha?.message,
      }}
      isPending={isPending}
      errorMessage={errorMessage}
      onEmailChange={(value) => {
        form.setValue("email", value, {
          shouldDirty: true,
          shouldValidate: true,
        });
      }}
      onPasswordChange={(value) => {
        form.setValue("senha", value, {
          shouldDirty: true,
          shouldValidate: true,
        });
      }}
      onSubmit={onSubmit}
    />
  );
}
