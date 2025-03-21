import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";

const Layout = ({ user, setUser }) => {
  const location = useLocation();

  // Hide navbar on login and register pages
  const hideNavbarRoutes = ["/login", "/register"];
  const shouldShowNavbar = !hideNavbarRoutes.includes(location.pathname);

  return (
    <div>
      {shouldShowNavbar && <Navbar user={user} setUser={setUser} />}
      <Outlet />
    </div>
  );
};

export default Layout;
