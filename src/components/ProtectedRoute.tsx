import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
    debugger
    const isAuth = !!localStorage.getItem("token");

    return isAuth ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
