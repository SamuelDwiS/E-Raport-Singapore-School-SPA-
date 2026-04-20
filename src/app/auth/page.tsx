import SignInForm from "@/components/auth/SignInForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Next.js SignIn Page | TailAdmin - Next.js Dashboard Template",
  description: "This is Next.js Signin Page TailAdmin Dashboard Template",
};

export default function SignIn() {
  return(
  <> 
  <div className="flex h-screen w-full items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md text-center">
        <h1 className="text-2xl font-bold mb-4">Login Page</h1>
        <p className="text-gray-600">Halaman login akan ditambahkan di sini nanti.</p>
        <p><a href="/mentor" className="text-blue-500 hover:underline">Go to Mentor Page</a></p>
        <p><a href="/teacher" className="text-blue-500 hover:underline">Go to Teacher Page</a></p>
        <p><a href="/parent " className="text-blue-500 hover:underline">Go to wali Page</a></p>
      </div>
    </div>;
    </>);
}
