import React from "react";
import { useLocation } from "react-router-dom";
import Navbar from "./Navbar";

const Layout = ({ children }) => {
  const location = useLocation();
  const noNavbarRoutes = ["/register", "/login", "/otp", "/error"];

  return (
    <div>
      {!noNavbarRoutes.includes(location.pathname) && <Navbar />}
      <main style={{ padding: "20px" }}>{children}</main>
    </div>
  );
};

export default Layout;
