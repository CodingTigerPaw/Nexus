import type RouteConfig from "./routeInteface";
import landingPageRoute from "../modules/LandingPageModule/module.export";
import DiceRoller from "../modules/DiceRoller/DiceRoller.tsx";

const dice = {
  element: <DiceRoller />,
  path: "/dice",
};
const routes: RouteConfig[] = [landingPageRoute, dice];

export { routes };
