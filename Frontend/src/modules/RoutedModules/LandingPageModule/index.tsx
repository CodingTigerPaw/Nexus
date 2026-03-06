import { Link } from "react-router";
import BaseButton from "../../../shared/ui/atoms/Button/BaseButton";
import Card from "../../../shared/ui/atoms/Card/Card";
import Checkbox from "../../../shared/ui/atoms/checkbox/Checkbox";
import Input from "../../../shared/ui/atoms/Input/Input";
import Label from "../../../shared/ui/atoms/Label/Label";
import NexusFormField from "../../../shared/ui/molecules/NexusFormField";
import FormField from "../../../shared/ui/molecules/FormField";
import { useForm } from "react-hook-form";
const LandingPage = () => {
  const form = useForm();
  const { register, handleSubmit } = form;

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
          <label className="flex cursor-pointer items-center gap-2">
            <input type="checkbox" className="peer hidden" />
            <span className="relative flex h-5 w-5 items-center justify-center rounded-md border border-gray-400 bg-white transition-all duration-300 peer-checked:border-void peer-checked:bg-void peer-focus:ring-2 peer-focus:ring-indigo-300 peer-focus:ring-offset-2">
              <svg
                className="h-4 w-4 scale-0 text-white transition-transform duration-300 peer-checked:scale-100"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="3"
              >
                <path
                  d="M20 6L9 17l-5-5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </span>
            <span className="text-gray-700 peer-checked:text-void">
              Opcja do wyboru
            </span>
          </label>

          <form onSubmit={handleSubmit(sendToZustand)}>
            <NexusFormField
              molecule={FormField}
              injectRegister="inputProps"
              label="test"
              type="text"
              placeholder="test"
              register={register}
              fieldName="test"
            />
            <div className="mb-2"></div>
            <NexusFormField
              molecule={FormField}
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
        <Checkbox />
        <Label>Label Text</Label>
        <Input placeholder="Enter text" />
      </div>
      <div></div>
    </>
  );
};

export default LandingPage;
