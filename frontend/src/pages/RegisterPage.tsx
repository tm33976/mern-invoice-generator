import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

// This makes the component deployment-ready
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Define the validation schema using Zod
const registerSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

// Infer the TypeScript type from the schema
type RegisterFormValues = z.infer<typeof registerSchema>;

// API function to register the user
const registerUser = async (data: RegisterFormValues) => {
  const response = await axios.post(`${API_URL}/api/auth/register`, data);
  return response.data;
};

export default function RegisterPage() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const mutation = useMutation({
    mutationFn: registerUser,
    onSuccess: () => {
      alert("Registration successful! Please log in.");
      navigate("/login"); // Navigate to the login page
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || "An error occurred during registration");
    }
  });

  const onSubmit = (data: RegisterFormValues) => {
    mutation.mutate(data);
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
        <main className="grid md:grid-cols-2 gap-16 items-center">
          <div className="flex flex-col justify-center">
             <h1 className="text-3xl font-bold mb-2">Sign up to begin journey</h1>
            <p className="text-gray-400 mb-8">
              This is a basic signup page which is used for levitation assignment purpose.
            </p>
            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              <div>
                <label className="text-sm font-medium text-gray-300">Enter your name</label>
                <Input 
                  type="text" 
                  placeholder="Enter Name" 
                  className="mt-2 bg-[#161b22] border-gray-700 h-10 text-white placeholder:text-gray-500"
                  {...register("name")}
                />
                 {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
              </div>
               <div>
                <label className="text-sm font-medium text-gray-300">Email Address</label>
                <Input 
                  type="email" 
                  placeholder="Enter Email ID" 
                  className="mt-2 bg-[#161b22] border-gray-700 h-10 text-white placeholder:text-gray-500"
                  {...register("email")}
                />
                 {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
              </div>
              <div>
                <label className="text-sm font-medium text-gray-300">Password</label>
                <Input 
                  type="password" 
                  placeholder="Enter the Password" 
                  className="mt-2 bg-[#161b22] border-gray-700 h-10 text-white placeholder:text-gray-500"
                  {...register("password")}
                />
                 {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
              </div>
              <div className="flex items-center justify-between pt-2">
                <Button 
                  className="bg-gray-300 text-black hover:bg-white rounded-md"
                  type="submit"
                  disabled={mutation.isPending}
                >
                  {mutation.isPending ? "Registering..." : "Register"}
                </Button>
                <Link to="/login" className="text-sm text-gray-400 hover:underline">
                  Already have account?
                </Link>
              </div>
            </form>
          </div>
          <div className="hidden md:block">
            <img 
              src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1973&auto=format&fit=crop" 
              alt="Modern building exterior" 
              className="w-full h-full object-cover rounded-lg"
              onError={(e) => { e.currentTarget.src = 'https://placehold.co/600x400/111827/FFFFFF?text=Image'; }}
            />
          </div>
        </main>
      </div>
  );
}
