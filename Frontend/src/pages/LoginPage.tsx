import { useMutation } from "@tanstack/react-query";
import Logo from "../components/Logo";
import { useForm } from "react-hook-form";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { getUserFromToken } from "@/utils/getUserFromToken";
import { axiosInstance } from "@/utils/apiClient";
import toast from "react-hot-toast";

interface FormData {
  username: string;
  password: string;
}

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from?.pathname || "/events";

  const loginMutate = useMutation<any, Error, FormData>({
    mutationFn: (data: FormData) =>
      axiosInstance.post("/auth/login", data, {
        withCredentials: true,
      }),

    onSuccess: (res) => {
      localStorage.setItem("accessToken", res.data.token);
      const decoded: any = getUserFromToken(res.data.token);
      const role = decoded.Role;

      if (role === "ADMIN") {
        navigate("/admin/dashboard");
      } else {
        navigate(from);
      }
    },

    onError: (e) => {
      toast.error(e.message);
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormData>({
    mode: "onChange",
  });
  const onSubmit = (data: FormData) => {
    loginMutate.mutate(data);
  };

  return (
    <div
      className="bg-cover min-h-screen"
      style={{ backgroundImage: "var(--login-bg)" }}
    >
      <div className="flex flex-col items-center justify-center">
        <div className="mt-2 -mb-4 md:mt-5 md:mb-3">
          <NavLink to={"/"}>
            <Logo />
          </NavLink>
        </div>
        <div className="relative flex flex-col bg-background/50 rounded-2xl mx-5 border-2 shadow-lg  mt-3 md:mt-0 border-border/10">
          <div className="flex flex-col gap-2 p-4 justify-center items-center ">
            <div className="md:mt-3">
              <span className="text-2xl font-bold">Welcome Back</span>
            </div>
            <div className="text-center">
              <span className="text-muted-foreground md:px-2 text-md">
                Login to your account to continue booking events
              </span>
            </div>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="mx-5 mt-5 text-md">
            <div className="flex flex-col gap-2 mb-4">
              <label className="font-semibold">Email</label>
              <input
                {...register("username", { required: true })}
                type="text"
                placeholder="you@example.com"
                className=" px-3 border rounded-xl h-10 border-popover/30"
              />
              {errors.username?.type === "required" && (
                <p className="text-red-600">Email is required</p>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-semibold">Password</label>
              <input
                {...register("password", { required: true })}
                type="password"
                placeholder="••••••••"
                className="px-3 border rounded-xl h-10 border-popover/30"
              />
              {errors.password?.type === "required" && (
                <p className="text-red-600">Password is required</p>
              )}
            </div>
            <div>
              <button
                disabled={!isValid}
                type="submit"
                className="mt-7 w-full h-13 rounded-4xl  mb-4 bg-violet-600 text-white font-bold tracking-wider cursor-pointer disabled:cursor-not-allowed disabled:opacity-70"
              >
                Login
              </button>
            </div>
          </form>
          <div className="flex mx-4 justify-center text-sm mt-1 mb-3 md:mb-6">
            <p className="text-muted-foreground">
              Don't have an account?&nbsp;{" "}
            </p>
            <Link to={"/signup"}>
              <span className="text-violet-600 font-semibold"> Sign Up</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
