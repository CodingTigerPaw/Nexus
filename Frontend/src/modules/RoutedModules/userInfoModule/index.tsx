import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "../../../shared/api/client";
import { useAuthStore } from "../../../zustand/store";

type ApiInfoResponse = {
  name: string;
  frontendOrigin: string[];
  environment: string;
};

const UserInfo = () => {
  // Zustand selectors subscribe only to required fields.
  const username = useAuthStore((state) => state.username);
  const authSession = useAuthStore((state) => state.session);
  const challenge = useAuthStore((state) => state.challenge);
  const logout = useAuthStore((state) => state.logout);

  const infoQuery = useQuery({
    // Query key scopes caching/invalidation for this endpoint.
    queryKey: ["api-info"],
    queryFn: () => apiRequest<ApiInfoResponse>("/api/info"),
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold">User info</h1>
      <p className="mt-2">Username: {username ?? "-"}</p>
      <p className="mt-1">
        Logged in: {authSession?.accessToken ? "yes" : "no"}
      </p>
      {challenge?.requiredAction && (
        <p className="mt-1">Required action: {challenge.requiredAction}</p>
      )}
      <button
        type="button"
        className="mt-3 rounded bg-black px-3 py-2 text-white"
        onClick={logout}
      >
        Logout
      </button>

      <h2 className="mt-6 text-xl font-medium">Backend health</h2>
      {infoQuery.isPending && <p>Loading...</p>}
      {infoQuery.isError && <p>Cannot load backend info.</p>}
      {infoQuery.data && (
        <div className="mt-2 space-y-1">
          <p>Name: {infoQuery.data.name}</p>
          <p>Environment: {infoQuery.data.environment}</p>
          <p>Origin: {infoQuery.data.frontendOrigin.join(", ")}</p>
        </div>
      )}
    </div>
  );
};

export default UserInfo;
