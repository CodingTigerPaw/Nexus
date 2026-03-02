const DiceRollerRoute = {
  path: "/dice",
  loadComponent: () => import("./DiceRoller"),
};

export default DiceRollerRoute;
