import { useState, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from "@/components/ui/table";
import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '@/store/store';
import { PlusCircle } from 'lucide-react';
import { logout } from '@/store/authSlice';
import { useNavigate } from 'react-router-dom';

// Define the type for a single product
interface Product {
  name: string;
  quantity: number;
  rate: number;
}

// Define the validation schema for the product form
const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  quantity: z.coerce.number().min(1, "Quantity must be at least 1"),
  rate: z.coerce.number().min(0.01, "Price must be greater than 0"),
});

type ProductFormValues = z.infer<typeof productSchema>;

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// API function to generate the PDF
const generateInvoicePdf = async ({ products, token, user }: { products: Product[], token: string, user: { name: string, email: string } }) => {
  const payload = {
    personName: user.name,
    personEmail: user.email,
    products,
  };

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    responseType: 'blob',
  };

  const response = await axios.post(`${API_URL}/api/invoices/generate-pdf`, payload, config);
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

export default function AddProductPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const { userInfo } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
  });

  const pdfMutation = useMutation({
    mutationFn: generateInvoicePdf,
    onSuccess: (data: Blob) => {
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'invoice.pdf');
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
      setProducts([]);
    },
    onError: (error: any) => {
      alert(error.response?.data?.message || "Failed to generate PDF. Please try again.");
    }
  });

  const handleAddProduct: SubmitHandler<ProductFormValues> = (data) => {
    setProducts([...products, data]);
    reset();
  };

  const handleGeneratePdf = () => {
    if (products.length === 0) {
      alert("Please add at least one product to generate an invoice.");
      return;
    }
    if (userInfo) {
      pdfMutation.mutate({ 
        products, 
        token: userInfo.token,
        user: { name: userInfo.name, email: userInfo.email }
      });
    }
  };
  
  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const { subTotal, gst } = useMemo(() => {
    const subTotal = products.reduce((acc, p) => acc + p.quantity * p.rate, 0);
    const gst = subTotal * 0.18;
    return { subTotal, gst };
  }, [products]);

  return (
    <div className="min-h-screen bg-[#0d1117] text-white">
        <header className="bg-[#161b22] border-b border-gray-800">
            <div className="container mx-auto flex justify-between items-center px-4 py-3">
            <Logo />
            <Button 
                onClick={handleLogout}
                className="bg-green-500 text-white hover:bg-green-600 h-8 px-4 rounded-md"
            >
                Logout
            </Button>
            </div>
        </header>
        <main className="container mx-auto p-4 md:p-8">
            <div className="space-y-8 max-w-5xl mx-auto">
            <div>
                <h1 className="text-3xl font-bold">Add Products</h1>
                <p className="text-gray-400 mt-2">This is a basic page which is used for levitation assignment purpose.</p>
            </div>

            <form onSubmit={handleSubmit(handleAddProduct)} className="space-y-4">
                <div className="grid md:grid-cols-3 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Product Name</label>
                    <Input placeholder="Enter the product name" {...register("name")} className="bg-[#161b22] border-gray-700 h-10"/>
                    {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Product Price</label>
                    <Input type="number" step="0.01" placeholder="Enter the price" {...register("rate")} className="bg-[#161b22] border-gray-700 h-10"/>
                    {errors.rate && <p className="text-red-500 text-xs">{errors.rate.message}</p>}
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Quantity</label>
                    <Input type="number" placeholder="Enter the Qty" {...register("quantity")} className="bg-[#161b22] border-gray-700 h-10"/>
                    {errors.quantity && <p className="text-red-500 text-xs">{errors.quantity.message}</p>}
                </div>
                </div>
                <div className="flex justify-center pt-4">
                    <Button type="submit" variant="outline" className="bg-transparent border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white rounded-md">
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Product
                    </Button>
                </div>
            </form>

            <div className="border border-gray-800 rounded-lg overflow-hidden">
                <Table>
                <TableHeader>
                    <TableRow className="bg-gray-200 hover:bg-gray-200">
                    <TableHead className="text-black font-semibold">Product name</TableHead>
                    <TableHead className="text-black font-semibold">Price</TableHead>
                    <TableHead className="text-black font-semibold">Quantity</TableHead>
                    <TableHead className="text-right text-black font-semibold">Total Price</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {products.length > 0 ? (
                    products.map((product, index) => (
                        <TableRow key={index} className="border-gray-800">
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell>INR {product.rate.toFixed(2)}</TableCell>
                        <TableCell>{product.quantity}</TableCell>
                        <TableCell className="text-right">INR {(product.rate * product.quantity).toFixed(2)}</TableCell>
                        </TableRow>
                    ))
                    ) : (
                    <TableRow>
                        <TableCell colSpan={4} className="text-center text-gray-500 py-12">
                        No products added yet.
                        </TableCell>
                    </TableRow>
                    )}
                </TableBody>
                {products.length > 0 && (
                    <TableFooter>
                    <TableRow className="border-gray-800 font-medium hover:bg-transparent">
                        <TableCell colSpan={3} className="text-right">Sub-Total</TableCell>
                        <TableCell className="text-right">INR {subTotal.toFixed(2)}</TableCell>
                    </TableRow>
                    <TableRow className="border-gray-800 font-medium hover:bg-transparent">
                        <TableCell colSpan={3} className="text-right">Incl + GST 18%</TableCell>
                        <TableCell className="text-right">INR {(subTotal + gst).toFixed(2)}</TableCell>
                    </TableRow>
                    </TableFooter>
                )}
                </Table>
            </div>

            <div className="flex justify-center pt-4">
                <Button 
                onClick={handleGeneratePdf} 
                disabled={products.length === 0 || pdfMutation.isPending}
                className="bg-gray-600 text-white hover:bg-gray-700 w-full md:w-auto rounded-md"
                >
                {pdfMutation.isPending ? "Generating..." : "Generate PDF Invoice"}
                </Button>
            </div>
            </div>
        </main>
    </div>
  );
}
