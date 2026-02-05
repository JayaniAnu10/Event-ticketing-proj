import { Button } from "@/components/ui/button";
import { useState } from "react";
import ThemeToggle from "./ThemeToggle";
import Logo from "./Logo";
import { Link, NavLink } from "react-router-dom";
import useAuth from "@/hooks/useAuth";
import { useQueryClient } from "@tanstack/react-query";
import { User } from "lucide-react";
import { axiosInstance } from "@/utils/apiClient";

const NavBar = () => {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const { data: user, isLoading } = useAuth();
  const queryClient = useQueryClient();

  const handleLogout = async () => {
    try {
      await axiosInstance.post("/auth/logout");
    } catch (err) {
      console.error("Logout failed", err);
    } finally {
      localStorage.removeItem("accessToken");
      queryClient.setQueryData(["user"], null);
      queryClient.removeQueries({ queryKey: ["user"] });
    }
  };

  return (
    <>
      <nav className="fixed flex justify-between bg-background/80 top-0 right-0 left-0 dark:bg-background/80 backdrop-blur-lg h-18 z-50">
        <NavLink to={"/"}>
          <Logo />
        </NavLink>
        <div className="md:flex hidden p-3 gap-4 mx-2 items-center">
          <Link to="/events">
            <Button
              variant="ghost"
              className="rounded-full hover:text-violet-600"
            >
              Browse Events
            </Button>
          </Link>
          <Link to="/faq">
            <Button
              variant="ghost"
              className="rounded-full hover:text-violet-600"
            >
              FAQ
            </Button>
          </Link>
          <Link to="/contact">
            <Button
              variant="ghost"
              className="rounded-full hover:text-violet-600"
            >
              Contact
            </Button>
          </Link>
          <ThemeToggle />
        </div>
        <div className="md:flex hidden p-3 gap-4 mx-2 items-center">
          {!isLoading && !user && (
            <>
              <Link to={"login"}>
                <Button
                  variant="outline"
                  className="border-violet-600 rounded-full border-2 text-violet-600 hover:text-white hover:bg-violet-600 dark:hover:bg-violet-600 hover:transition-colors duration 300"
                >
                  Login
                </Button>
              </Link>
              <Link to={"signup"}>
                <Button
                  variant="default"
                  className="rounded-full bg-violet-600 hover:scale-110 transition-transform duration-300 text-white"
                >
                  Sign Up
                </Button>
              </Link>
            </>
          )}
          {!isLoading && user?.role === "USER" && (
            <Link to={"/profile"}>
              <Button
                variant="outline"
                className="rounded-full border/25 dark:text-white hover:text-white "
              >
                <User className="w-5 h-5" />
              </Button>
            </Link>
          )}
          {!isLoading && user?.role === "ADMIN" && (
            <Link to={"/admin/dashboard"}>
              <Button
                variant="outline"
                className="rounded-full border/25 dark:text-white bg-violet-600 hover:text-white"
              >
                <span className="">Admin DashBoard</span>
              </Button>
            </Link>
          )}
          {!isLoading && user && (
            <Button
              variant="outline"
              onClick={handleLogout}
              className="rounded-full border-2 border-violet-500 text-violet-600 hover:bg-violet-400 hover:text-white"
            >
              Logout
            </Button>
          )}
        </div>
        <div className="md:hidden flex my-auto  items-center gap-2">
          <ThemeToggle />
          {user?.role === "USER" && (
            <Link to={"/profile"} className="">
              <Button
                variant="outline"
                size="icon"
                className=" md:hidden rounded-full border/25 dark:text-white hover:text-white "
              >
                <User className="w-5 h-5" />
              </Button>
            </Link>
          )}
          <div
            className="md:hidden cursor-pointer pr-4 my-auto block"
            onClick={() => setMenuOpen(!isMenuOpen)}
          >
            <div
              className={`bg-violet-500 w-8 rounded-full h-1 ${
                isMenuOpen ? "rotate-45 top-2" : ""
              } relative transition-all`}
            ></div>
            <div
              className={`bg-violet-500 w-8 rounded-full h-1 mt-1 ${
                isMenuOpen ? "opacity-0" : "opacity-100"
              }`}
            ></div>
            <div
              className={`bg-violet-500 w-8 rounded-full h-1 mt-1 ${
                isMenuOpen ? "-rotate-45 -top-2" : ""
              } relative transition-all`}
            ></div>
          </div>
        </div>

        <div
          className={`md:hidden absolute top-18 left-0 right-0 z-50
    bg-background/95 backdrop-blur-lg
    transition-all duration-300  w-full max-w-screen overflow-hidden
    ${isMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-3 pointer-events-none"}
  `}
        >
          <ul className="flex flex-col items-center font-semibold text-lg text-violet-600">
            {!user && (
              <li className="w-full">
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="block w-full text-center p-4 hover:bg-violet-500 hover:text-white"
                >
                  Login
                </Link>
              </li>
            )}

            <li className="w-full">
              <Link
                to="/events"
                onClick={() => setMenuOpen(false)}
                className="block w-full text-center p-4 hover:bg-violet-500 hover:text-white"
              >
                Browse Events
              </Link>
            </li>

            <li className="w-full">
              <Link
                to="/faq"
                onClick={() => setMenuOpen(false)}
                className="block w-full text-center p-4 hover:bg-violet-500 hover:text-white"
              >
                FAQ
              </Link>
            </li>

            <li className="w-full">
              <Link
                to="/contact"
                onClick={() => setMenuOpen(false)}
                className="block w-full text-center p-4 hover:bg-violet-500 hover:text-white"
              >
                Contact
              </Link>
            </li>

            {/* ADMIN */}
            {!isLoading && user?.role === "ADMIN" && (
              <>
                <li className="w-full">
                  <Link
                    to="/admin/dashboard"
                    onClick={() => setMenuOpen(false)}
                    className="block w-full text-center p-4 hover:bg-violet-600 hover:text-white "
                  >
                    Admin Dashboard
                  </Link>
                </li>

                <li className="w-full">
                  <button
                    onClick={() => {
                      handleLogout();
                      setMenuOpen(false);
                    }}
                    className="w-full text-center p-4 hover:bg-red-500 hover:text-white"
                  >
                    Logout
                  </button>
                </li>
              </>
            )}

            {/* USER */}
            {!isLoading && user?.role === "USER" && (
              <>
                <li className="w-full">
                  <button
                    onClick={() => {
                      handleLogout();
                      setMenuOpen(false);
                    }}
                    className="w-full text-center p-4 hover:bg-red-500 hover:text-white"
                  >
                    Logout
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      </nav>
    </>
  );
};

export default NavBar;
