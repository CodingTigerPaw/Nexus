import { DevTool } from "@hookform/devtools";
import { useForm } from "react-hook-form";
import { Link } from "react-router";
import BaseButton from "../../../shared/ui/atoms/Button/BaseButton";
import Card from "../../../shared/ui/atoms/Card/Card";
import Checkbox from "../../../shared/ui/atoms/checkbox/Checkbox";
import FormField from "../../../shared/ui/molecules/FormField";
import NexusFormField from "../../../shared/ui/molecules/NexusFormField/NexusFormField";
import {
  bigLetterValidator,
  minLengthValidator,
  numberValidator,
} from "../../../shared/validators/loginValidator";
import { ApiError } from "../../../shared/api/client";
import { useLoginMutation } from "../../LoginModule/hooks/useAuthMutations";

type FormData = {
  login: string;
  password: string;
  rememberMe: boolean;
};

const LandingPage = () => {
  // react-hook-form keeps form state local and cheap to re-render.
  const form = useForm<FormData>({
    defaultValues: {
      login: "",
      password: "",
      rememberMe: false,
    },
  });
  const { register, handleSubmit, formState } = form;
  // React Query mutation coordinates request lifecycle and error states.
  const loginMutation = useLoginMutation();

  const onSubmit = async (data: FormData) => {
    await loginMutation.mutateAsync({
      username: data.login,
      password: data.password,
      rememberMe: data.rememberMe,
    });
  };

  const errorMessage =
    loginMutation.error instanceof ApiError ? loginMutation.error.message : "";

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <div className="flex gap-3">
        <Link to="/userInfo">User Info</Link>
        <Link to="/dice">Dice Roller</Link>
      </div>
      <Card background="lightVoid" className="w-full max-w-md">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-3 [&_input]:w-full [&_button]:mx-auto [&_button]:block"
        >
          <NexusFormField
            component={FormField}
            injectRegister="inputProps"
            label="Login"
            type="text"
            placeholder="Login"
            register={register}
            fieldName="login"
            validators={[
              minLengthValidator(8),
              bigLetterValidator,
              numberValidator,
            ]}
          />
          <p>{formState.errors.login?.message as string}</p>

          <div className="mb-2"></div>
          <NexusFormField
            component={FormField}
            injectRegister="inputProps"
            label="Password"
            type="password"
            placeholder="Password"
            register={register}
            fieldName="password"
          />
          <Checkbox label="Remember me" {...register("rememberMe")} />
          {errorMessage && <p className="text-red-500">{errorMessage}</p>}
          <BaseButton
            type="submit"
            size="medium"
            variant="primary"
            hover
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending ? "Sending..." : "Send"}
          </BaseButton>
        </form>
      </Card>
      <DevTool control={form.control} />
    </div>
  );
};

export default LandingPage;
