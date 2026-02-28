import type RouteConfig from "./routeInteface.ts";
import landingPageRoute from "../modules/LandingPageModule/module.export.tsx";
import DiceRoller from "../modules/DiceRoller/DiceRoller.tsx";
import userInfoRoute from "../modules/userInfoModule/module.export.tsx";

const dice = {
  element: <DiceRoller />,
  path: "/dice",
};
const routes: RouteConfig[] = [landingPageRoute, dice, userInfoRoute];

export { routes };
