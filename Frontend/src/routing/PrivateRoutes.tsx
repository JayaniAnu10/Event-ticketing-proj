import Spinner from "@/components/Spinner";
import useAuth from "@/hooks/useAuth";
import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";

type PrivateRouteProps = {
  requiredRole?: "ADMIN" | "USER";
  children: ReactNode;
};

const privateRoutes = ({ children, requiredRole }: PrivateRouteProps) => {
  const location = useLocation();
  const { data, isLoading } = useAuth();

  if (isLoading)
    return (
      <div className="mt-30 flex justify-center items-center">
        <Spinner />
      </div>
    );

  if (!data) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole && data.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default privateRoutes;
