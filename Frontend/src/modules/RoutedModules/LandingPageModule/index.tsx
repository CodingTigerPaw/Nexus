import { Link } from "react-router";
import BaseButton from "../../../shared/ui/atoms/Button/BaseButton";
import Card from "../../../shared/ui/atoms/Card/Card";
import Checkbox from "../../../shared/ui/atoms/checkbox/Checkbox";
import Input from "../../../shared/ui/atoms/Input/Input";
import Label from "../../../shared/ui/atoms/Label/Label";
import NexusFormField from "../../../shared/ui/molecules/NexusFormField/NexusFormField";
import FormField from "../../../shared/ui/molecules/FormField";
import { DevTool } from "@hookform/devtools";
import {
  bigLetterValidator,
  minLengthValidator,
  numberValidator,
} from "../../../shared/validators/loginValidator";
import { useForm } from "react-hook-form";
import Header from "../../../shared/ui/atoms/Header/Header";
const LandingPage = () => {
  const form = useForm();
  const { register, handleSubmit, formState } = form;

  const sendToZustand = async (data: unknown) => {
    console.log("data", data);
  };
  return (
    <>
      <div>
        <Link to="/userInfo">User Info</Link>
        <Link to="/dice">Dice Roller</Link>
        <Link to="/login"></Link>
        <Card background="lightVoid">
          <form onSubmit={handleSubmit(sendToZustand)}>
            <Checkbox />
            <NexusFormField
              component={FormField}
              injectRegister="inputProps"
              label="test"
              type="text"
              placeholder="my placeholder"
              register={register}
              fieldName="test"
              validators={[
                minLengthValidator(8),
                bigLetterValidator,
                numberValidator,
              ]}
            />
            <p>{formState.errors.test?.message as string}</p>

            <div className="mb-2"></div>
            <NexusFormField
              component={FormField}
              injectRegister="inputProps"
              label="test"
              type="text"
              placeholder="test"
              register={register}
              fieldName="test2"
            />
            <BaseButton type="submit" size="medium" variant="primary" hover>
              Send
            </BaseButton>
          </form>
        </Card>
        <DevTool control={form.control} /> {/* set up the dev tool */}
        <Label>Label Text</Label>
        <Input placeholder="Enter text" />
      </div>
      <Header size="large">Landing Page</Header>
    </>
  );
};

export default LandingPage;
