import { Link } from "react-router";

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
      </div>
      <div></div>
    </>
  );
};

export default LandingPage;
