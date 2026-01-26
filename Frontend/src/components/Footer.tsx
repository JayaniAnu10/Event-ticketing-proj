import { Mail, MapPin, Phone } from "lucide-react";
import Logo from "./Logo";
import { FiFacebook, FiTwitter } from "react-icons/fi";
import { RxInstagramLogo } from "react-icons/rx";
import { FaLinkedinIn } from "react-icons/fa6";
import { Link } from "react-router-dom";
import useAuth from "@/hooks/useAuth";
import Spinner from "./Spinner";

const Footer = () => {
  const { data: user, isLoading } = useAuth();
  if (isLoading) return <Spinner />;

  return (
    <div className="mt-5">
      <div className="grid grid-cols-1 md:grid-cols-4 border-t border-gray-300 dark:border-gray-200/20 gap-7 mt-20 mx-2  ">
        <div>
          <div className="mt-10">
            <Logo />
          </div>
          <div className="flex items-center mx-2 text-sm mb-4">
            <span className="text-muted-foreground">
              Your premier destination for discovering and booking amazing
              events. Create unforgettable experiences.
            </span>
          </div>
        </div>
        <div className="ml-2  md:my-18">
          <div className="font-bold mb-4">
            <span>Quick Links</span>
          </div>
          <ul className="text-muted-foreground space-y-2">
            <li>
              <Link to={"/events"}>Browse Events</Link>
            </li>
            <li>
              {" "}
              <Link to={"/faq"}>FAQ</Link>
            </li>
            {!isLoading && user?.role === "USER" && (
              <li>
                <Link to={"/profile"}>My Profile</Link>
              </li>
            )}
            {!isLoading && user?.role === "ADMIN" && (
              <li>
                <Link to={"/admin/dashboard"}>Admin DashBoard</Link>
              </li>
            )}
            {!isLoading && !user && (
              <li>
                <Link to={"/signup"}>Sign Up</Link>
              </li>
            )}
          </ul>
        </div>
        <div className="ml-2 md:my-15">
          <div className="font-bold my-4">
            <span>Contact Us</span>
          </div>
          <ul className="text-muted-foreground space-y-2">
            <li className="flex gap-2">
              <Mail className="text-primary w-5 h-5 mt-1" />
              support@eventhub.com
            </li>
            <li className="flex gap-2">
              <Phone className="text-primary w-5 h-5 mt-1" />
              +94112456789
            </li>
            <li className="flex gap-2">
              <MapPin className="text-primary w-5 h-5 mt-1" />
              123 Gamini Street, Colombo 10
            </li>
          </ul>
        </div>

        <div className="ml-2 md:my-15 ">
          <div className="font-bold my-5">
            <span>Follow Us</span>
          </div>
          <div className="flex text-primary mt-8 gap-7">
            <a href="https://facebook.com">
              <FiFacebook className="w-7 h-7" />
            </a>
            <a href="https://twitter.com">
              <FiTwitter className="w-7 h-7" />
            </a>

            <a href="https://instagram.com">
              <RxInstagramLogo className="w-7 h-7" />
            </a>
            <a href="https://linkedin.com">
              <FaLinkedinIn className="w-7 h-7" />
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-200 dark:border-gray-200/20  mx-2  my-8 text-sm text-muted-foreground flex justify-center">
        <p className="block my-5 mx-2">
          © {new Date().getFullYear()} EventHub. All rights reserved. | Made for
          event lovers
        </p>
      </div>
    </div>
  );
};

export default Footer;
