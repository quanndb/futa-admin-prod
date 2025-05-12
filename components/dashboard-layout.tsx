"use client";

import type React from "react";

import { ThemeSwitcher } from "@/components/theme-switcher";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { avatarEncoder } from "@/lib/LinkConverter";
import { cn } from "@/lib/utils";
import authAPI from "@/services/API/authAPI";
import { useUserInfo } from "@/store/AuthStore";
import {
  Bus,
  Calendar,
  CreditCard,
  LayoutDashboard,
  LogOut,
  MapPin,
  Menu,
  User,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { userInfo, setUserInfo } = useUserInfo();

  const handleLogout = () => {
    setIsLoggingOut(true);
    authAPI.logout();
    setUserInfo(null);
    setIsLoggingOut(false);
    setIsLogoutDialogOpen(false);
    router.push("/login");
  };

  const navigation = [
    { name: "Tổng quan", href: "/dashboard", icon: LayoutDashboard },
    { name: "Điểm trung chuyển", href: "/transit-points", icon: MapPin },
    { name: "Chuyến đi", href: "/trips", icon: Bus },
    { name: "Quản lý vé", href: "/bookings", icon: Calendar },
    { name: "Quản lý lệnh rút tiền", href: "/withdrawals", icon: CreditCard },
  ];

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar cho desktop */}
      <div className="hidden md:flex md:w-64 md:flex-col">
        <div className="flex flex-col flex-grow pt-5 overflow-y-auto bg-white dark:bg-gray-800 border-r dark:border-gray-700">
          <div className="flex items-center flex-shrink-0 px-4">
            <div className="relative w-10 h-10 mr-2">
              <Image
                src="/logo.png"
                alt="Logo Futa"
                fill
                className="object-contain"
              />
            </div>
            <span className="text-xl font-bold text-futa-primary dark:text-futa-primary-dark">
              Futa Admin
            </span>
          </div>
          <div className="mt-5 flex-1 flex flex-col">
            <nav className="flex-1 px-2 pb-4 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    pathname === item.href
                      ? "bg-futa-primary/10 text-futa-primary dark:bg-futa-primary-dark/20 dark:text-futa-primary-dark"
                      : "text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700",
                    "group flex items-center px-2 py-2 text-sm font-medium rounded-md"
                  )}
                >
                  <item.icon
                    className={cn(
                      pathname === item.href
                        ? "text-futa-primary dark:text-futa-primary-dark"
                        : "text-gray-400 group-hover:text-gray-500 dark:text-gray-400 dark:group-hover:text-gray-300",
                      "mr-3 flex-shrink-0 h-5 w-5"
                    )}
                    aria-hidden="true"
                  />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Sidebar cho mobile */}
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden absolute top-4 left-4 z-10"
          >
            <Menu className="h-6 w-6" />
            <span className="sr-only">Mở menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-64">
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center">
                <div className="relative w-8 h-8 mr-2">
                  <Image
                    src="/logo.png"
                    alt="Logo Futa"
                    fill
                    className="object-contain"
                  />
                </div>
                <span className="text-lg font-bold text-futa-primary dark:text-futa-primary-dark">
                  Futa Admin
                </span>
              </div>
            </div>
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    pathname === item.href
                      ? "bg-futa-primary/10 text-futa-primary dark:bg-futa-primary-dark/20 dark:text-futa-primary-dark"
                      : "text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700",
                    "group flex items-center px-2 py-2 text-sm font-medium rounded-md"
                  )}
                >
                  <item.icon
                    className={cn(
                      pathname === item.href
                        ? "text-futa-primary dark:text-futa-primary-dark"
                        : "text-gray-400 group-hover:text-gray-500 dark:text-gray-400 dark:group-hover:text-gray-300",
                      "mr-3 flex-shrink-0 h-5 w-5"
                    )}
                    aria-hidden="true"
                  />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        </SheetContent>
      </Sheet>

      {/* Nội dung chính */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <header className="w-full">
          <div className="relative z-10 flex-shrink-0 h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm flex">
            <div className="flex-1 flex justify-end px-4">
              <div className="ml-4 flex items-center md:ml-6">
                <ThemeSwitcher />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative rounded-full ml-2"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={avatarEncoder(userInfo?.avatar || "")}
                          alt="Admin"
                          className="object-cover"
                        />
                        <AvatarFallback className="bg-futa-primary text-white dark:bg-futa-primary-dark">
                          AD
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Tài khoản của tôi</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/profile">
                        <User className="mr-2 h-4 w-4" />
                        <span>Hồ sơ</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setIsLogoutDialogOpen(true)}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Đăng xuất</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900 p-6">
          {children}
        </main>
      </div>

      {/* Dialog xác nhận đăng xuất */}
      <Dialog open={isLogoutDialogOpen} onOpenChange={setIsLogoutDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Xác nhận đăng xuất</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn đăng xuất khỏi hệ thống? Mọi dữ liệu chưa
              lưu sẽ bị mất.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsLogoutDialogOpen(false)}
            >
              Hủy
            </Button>
            <Button
              variant="destructive"
              onClick={handleLogout}
              disabled={isLoggingOut}
            >
              {isLoggingOut ? "Đang đăng xuất..." : "Đăng xuất"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
