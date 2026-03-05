import { Link } from "react-router";
import BaseButton from "../../../shared/ui/atoms/Button/BaseButton";
import Card from "../../../shared/ui/atoms/Card/Card";
import Checkbox from "../../../shared/ui/atoms/checkbox/Checkbox";
import Input from "../../../shared/ui/atoms/Input/Input";
import Label from "../../../shared/ui/atoms/Label/Label";
import FormField from "../../../shared/ui/molecules/FormField";
const LandingPage = () => {
  const data = async () => {
    const health = await fetch("http://localhost:5080/health");
    console.log(await health.json());
  };
  data();

  return (
    <>
      <div>
        <Link to="/userInfo">User Info</Link>
        <Link to="/dice">Dice Roller</Link>
        <Link to="/login">
          <BaseButton
            onClick={() => console.log("clicked")}
            size="medium"
            variant="primary"
            hover
          />
        </Link>
        <Card background="blue">
          <p>Card Content</p>
        </Card>
        <Checkbox />
        <Label>Label Text</Label>
        <Input placeholder="Enter text" />
      </div>
      <div>
        <FormField
          label="Username"
          type="text"
          placeholder="Enter your username"
        />
        <FormField label="Accept Terms" type="checkbox" />
      </div>
    </>
  );
};

export default LandingPage;
