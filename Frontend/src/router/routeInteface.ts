export default interface RouteConfig {
  path: string;
  element: React.ReactNode;
  // Reserved place for future route guards/authorization metadata.
  config?: {
    role: string;
  };
}
