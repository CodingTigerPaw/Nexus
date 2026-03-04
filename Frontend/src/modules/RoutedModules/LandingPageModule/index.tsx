import { Link } from "react-router";
import BaseButton from "../../../shared/ui/Button/BaseButton";
import Card from "../../../shared/ui/Card/Card";
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
      </div>
      <div></div>
    </>
  );
};

export default LandingPage;
