import type RouteConfig from "./routeInteface.ts";
import createLazyRoute from "./createLazyRoute.ts";
import landingPageRoute from "../modules/RoutedModules/LandingPageModule/module.export.tsx";
import userInfoRoute from "../modules/RoutedModules/userInfoModule/module.export.tsx";
import DiceRollerRoute from "../modules/DiceRollerModule/module.export.tsx";

const routeDefinitions: RouteConfig[] = [
  landingPageRoute,
  DiceRollerRoute,
  userInfoRoute,
];

const routes = routeDefinitions.map(createLazyRoute);

export { routes };
