"use client";

import type React from "react";

import { ThemeSwitcher } from "@/components/theme-switcher";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Toaster } from "@/components/ui/toaster";
import { JwtDecoder } from "@/lib/authUtils";
import authAPI from "@/services/API/authAPI";
import { useUserInfo } from "@/store/AuthStore";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { setUserInfo } = useUserInfo();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    authAPI
      .login({ email, password })
      .then((res) => {
        localStorage.setItem("accessToken", res.data.accessToken);
        setUserInfo(JwtDecoder.getUserInfo());
        authAPI.getMyAuthorities().then((sub) => {
          if (sub.data.role) {
            toast.success("Đăng nhập thành công");
            router.push("/dashboard");
          } else {
            toast.error("Bạn không có quyền truy cập");
            localStorage.removeItem("accessToken");
            setUserInfo(null);
          }
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    if (localStorage.getItem("accessToken")) {
      router.push("/dashboard");
    }
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="absolute top-4 right-4">
        <ThemeSwitcher />
      </div>
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <div className="relative w-32 h-32">
              <Image
                src="/logo.png"
                alt="Logo Futa"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>
          <CardTitle className="text-2xl text-center text-futa-primary dark:text-futa-primary-dark">
            Futa Admin
          </CardTitle>
          <CardDescription className="text-center">
            Nhập thông tin đăng nhập để truy cập vào trang quản trị
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="text"
                placeholder="admin@futa.vn"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Mật khẩu</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                  <span className="sr-only">
                    {showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                  </span>
                </Button>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              className="w-full bg-futa-primary hover:bg-futa-primary/90 dark:bg-futa-primary-dark dark:hover:bg-futa-primary-dark/90"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
            </Button>
          </CardFooter>
        </form>
      </Card>
      <Toaster />
    </div>
  );
}
