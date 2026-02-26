export default interface RouteConfig {
  path: string;
  element: React.ReactNode;
  config?: {
    role: string;
  };
}
