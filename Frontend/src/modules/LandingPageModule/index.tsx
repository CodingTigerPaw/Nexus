import { Link } from "react-router";

const LandingPage = () => {
  return (
    <div>
      <Link to="/userInfo">User Info</Link>
      <Link to="/dice">Dice Roller</Link>
    </div>
  );
};

export default LandingPage;
