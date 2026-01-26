import { useForm } from "react-hook-form";
import Logo from "../components/Logo";
import { Link, NavLink } from "react-router-dom";
import useAddUser from "@/hooks/useAddUser";

interface FormData {
  name: string;
  email: string;
  contact: string;
  password: string;
  confirmPassword: string;
}

const SignUpPage = () => {
  const { mutate } = useAddUser();
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormData>();

  const onSubmit = (data: FormData) => {
    // Password match validation
    if (data.password !== data.confirmPassword) {
      return alert("Passwords do not match");
    }

    // Send to backend
    mutate({
      name: data.name,
      email: data.email,
      contact: data.contact,
      password: data.password,
      confirmPassword: data.confirmPassword,
    });
  };

  return (
    <div>
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
          <div className="relative flex flex-col bg-background/50 rounded-2xl mx-5 border-2 md:w-md shadow-lg  mt-3 md:mt-0 border-border/10 mb-6 ">
            <div className="flex flex-col gap-2 p-4 justify-center items-center ">
              <div className="md:mt-3">
                <span className="text-2xl font-bold">Create Account</span>
              </div>
              <div className="text-center">
                <span className="text-muted-foreground text-md">
                  Sign up to start booking amazing events
                </span>
              </div>
            </div>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="mx-5 mt-5 text-md"
            >
              <div className="flex flex-col gap-2 mb-4">
                <label className="font-semibold">Full Name</label>
                <input
                  {...register("name", { required: true })}
                  type="text"
                  placeholder="John Doe"
                  className=" px-3 border rounded-xl h-11 border-popover/30"
                />
                {errors.name?.type === "required" && (
                  <p className="text-red-600">Name is required</p>
                )}
              </div>
              <div className="flex flex-col gap-2 mb-4">
                <label className="font-semibold">Email</label>
                <input
                  {...register("email", { required: true })}
                  type="text"
                  placeholder="you@example.com"
                  className="px-3 border rounded-xl h-11 border-popover/30"
                />
                {errors.email?.type === "required" && (
                  <p className="text-red-600">Email is required</p>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-semibold">Contact</label>
                <input
                  {...register("contact", { required: true })}
                  type="text"
                  placeholder="+94121212121"
                  className="px-3 border rounded-xl h-11 border-popover/30"
                />
                {errors.contact?.type === "required" && (
                  <p className="text-red-600">Contact is required</p>
                )}
              </div>
              <div className="flex flex-col gap-2 mt-5">
                <label className="font-semibold">Password</label>
                <input
                  {...register("password", { required: true, minLength: 6 })}
                  type="password"
                  placeholder="••••••••"
                  className="px-3 border rounded-xl h-11 border-popover/30"
                />
                {errors.password?.type === "required" && (
                  <p className="text-red-600">Password is required</p>
                )}
                {errors.password?.type === "minLength" && (
                  <p className="text-red-600">
                    Password should contain at least 8 characters
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-2 mt-5">
                <label className="font-semibold">Confirm Password</label>
                <input
                  {...register("confirmPassword", { required: true })}
                  type="password"
                  placeholder="••••••••"
                  className="px-3 border rounded-xl h-11 border-popover/30"
                />
                {errors.confirmPassword?.type === "required" && (
                  <p className="text-red-600">Confirm password is required</p>
                )}
              </div>
              <div className="">
                <button
                  disabled={!isValid}
                  type="submit"
                  className="mt-7 w-full  h-13 rounded-4xl  mb-4 bg-violet-600 text-white font-bold tracking-wider cursor-pointer disabled:cursor-not-allowed disabled:opacity-70 text-lg"
                >
                  Create Account
                </button>
              </div>
            </form>
            <div className="flex mx-4 justify-center text-sm mt-1 mb-3 md:mb-6">
              <p className="text-muted-foreground">
                Already have an account?&nbsp;{" "}
              </p>
              <Link to={"/login"}>
                <span className="text-violet-600 font-semibold"> Login</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
