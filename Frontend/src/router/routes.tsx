import type RouteConfig from "./routeInteface.ts";
import landingPageRoute from "../modules/RoutedModules/LandingPageModule/module.export.tsx";
import userInfoRoute from "../modules/userInfoModule/module.export.tsx";
import DiceRollerRoute from "../modules/DiceRollerModule/module.export.tsx";

const routes: RouteConfig[] = [
  landingPageRoute,
  DiceRollerRoute,
  userInfoRoute,
];

export { routes };
