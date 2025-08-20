import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setCredentials } from "@/store/authSlice";
import { Link, useNavigate } from "react-router-dom"; // Import Link


const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Define the validation schema using Zod
const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
});

// Infer the TypeScript type from the schema
type LoginFormValues = z.infer<typeof loginSchema>;

// API function to log in the user
const loginUser = async (data: LoginFormValues) => {

  const response = await axios.post(`${API_URL}/api/auth/login`, data);
  return response.data;
};


const Logo = () => (
    <div className="flex items-center gap-2">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M2 17L12 22L22 17" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M2 12L12 17L22 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      <div>
        <p className="font-bold text-white">levitation</p>
        <p className="text-xs text-gray-400">infotech</p>
      </div>
    </div>
  );

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const mutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      dispatch(setCredentials(data));
      navigate("/add-product");
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || "An error occurred");
    }
  });

  const onSubmit = (data: LoginFormValues) => {
    mutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-[#111827] text-white flex items-center justify-center p-4">
      <div className="w-full max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <Logo />
          <div className="text-sm border border-gray-600 px-3 py-1 rounded-full">
            Connecting People With Technology
          </div>
        </header>

        <main className="grid md:grid-cols-2 gap-16 items-center">
          <div className="hidden md:block">
            <img 
              src="https://images.unsplash.com/photo-1570129477492-45c003edd2be?q=80&w=2070&auto=format&fit=crop" 
              alt="Advertisement at a bus stop" 
              className="w-full h-full object-cover rounded-lg"
              onError={(e) => { e.currentTarget.src = 'https://placehold.co/600x400/111827/FFFFFF?text=Image'; }}
            />
          </div>
          <div className="flex flex-col justify-center">
            <div className="mb-8">
              <Logo />
            </div>
            <h1 className="text-3xl font-bold mb-2">Let the Journey Begin!</h1>
            <p className="text-gray-400 mb-8">
              This is a basic login page which is used for levitation assignment purpose.
            </p>
            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              <div>
                <label htmlFor="email" className="text-sm font-medium text-gray-300">
                  Email Address
                </label>
                <Input 
                  id="email"
                  type="email" 
                  placeholder="Enter Email ID" 
                  className="mt-2 bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                  {...register("email")}
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
              </div>
              <div>
                <label htmlFor="password" className="text-sm font-medium text-gray-300">
                  Current Password
                </label>
                <Input 
                  id="password"
                  type="password" 
                  placeholder="Enter the Password" 
                  className="mt-2 bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
                  {...register("password")}
                />
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
              </div>
              <div className="flex items-center justify-between">
                <Button 
                  className="bg-gray-300 text-black hover:bg-white"
                  type="submit"
                  disabled={mutation.isPending}
                >
                  {mutation.isPending ? "Logging in..." : "Login now"}
                </Button>
                <Link to="/register" className="text-sm text-gray-400 hover:underline">
                  Don't have an account? Sign up
                </Link>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
