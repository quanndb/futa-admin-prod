"use client";

import type React from "react";

import accountAPI, { Profile } from "@/services/API/accountAPI";
import { useQuery } from "@tanstack/react-query";

import DashboardLayout from "@/components/dashboard-layout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatToLocalDateTimeWithTimeZone } from "@/lib/DateConverter";
import { avatarEncoder } from "@/lib/LinkConverter";
import authAPI from "@/services/API/authAPI";
import { useState } from "react";
import { toast } from "react-toastify";

export default function ProfilePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [profileData, setProfileData] = useState<Profile>({} as Profile);

  const [formData, setFormData] = useState({
    name: profileData.fullName,
    email: profileData.email,
    phone: profileData.phoneNumber,
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: () =>
      accountAPI.getProfile().then((res) => {
        setProfileData(res.data);
        setFormData({
          name: res.data.fullName,
          email: res.data.email,
          phone: res.data.phoneNumber,
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        return res.data;
      }),
  });

  const { data: userAuthorities } = useQuery({
    queryKey: ["userAuthorities"],
    queryFn: () => authAPI.getMyAuthorities(),
  });

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    accountAPI
      .updateProfile({
        fullName: formData.name,
        phoneNumber: formData.phone,
      })
      .then(() => toast.success("Thông tin cơ bản đã cập nhật"))
      .finally(() => setIsLoading(false));
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Validate passwords
    if (formData.newPassword !== formData.confirmPassword) {
      setIsLoading(false);
      toast.error("Mật khẩu không khớp nhau.");
      return;
    }
    accountAPI
      .changePassword({
        oldPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      })
      .then(() => {
        toast.success("Mật khẩu đã cập nhật");
        setFormData({
          ...formData,
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      })
      .finally(() => setIsLoading(false));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <h1 className="text-3xl font-bold tracking-tight">Thông tín cơ bản</h1>

        <div className="grid gap-6 md:grid-cols-[300px_1fr]">
          <Card>
            <CardHeader>
              <CardTitle>Thông tin cá nhân</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarImage
                  src={avatarEncoder(profileData.avatarUrl || "")}
                  alt={profileData.fullName}
                />
                <AvatarFallback>
                  {profileData?.fullName
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1 text-center">
                <h3 className="font-medium text-lg">{profileData.fullName}</h3>
                <p className="text-sm text-muted-foreground">
                  {profileData.email}
                </p>
              </div>
              <Separator className="my-4" />
              <div className="w-full space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Role:</span>
                  <span className="text-sm font-medium">
                    {userAuthorities?.data?.role}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Phone:</span>
                  <span className="text-sm font-medium">
                    {profileData.phoneNumber}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Joined:</span>
                  <span className="text-sm font-medium">
                    {profileData.createdAt &&
                      formatToLocalDateTimeWithTimeZone(profileData.createdAt)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Tabs defaultValue="general">
              <TabsList>
                <TabsTrigger value="general">Thông tin chung</TabsTrigger>
                <TabsTrigger value="security">Mật khẩu</TabsTrigger>
              </TabsList>

              <TabsContent value="general" className="space-y-4 mt-4">
                <Card>
                  <form onSubmit={handleProfileUpdate}>
                    <CardHeader>
                      <CardTitle>Thông tin cá nhân</CardTitle>
                      <CardDescription>
                        Thay đổi thông tin cá nhân của bạn
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Họ tên</Label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          disabled
                          value={formData.email}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Số điện thoại</Label>
                        <Input
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                        />
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button type="submit" disabled={isLoading}>
                        {isLoading ? "Đang thay đổi..." : "Thay đổi"}
                      </Button>
                    </CardFooter>
                  </form>
                </Card>
              </TabsContent>

              <TabsContent value="security" className="space-y-4 mt-4">
                <Card>
                  <form onSubmit={handlePasswordChange}>
                    <CardHeader>
                      <CardTitle>Thay đổi mật khẩu</CardTitle>
                      <CardDescription>Thay đổi mật khẩu</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="currentPassword">
                          Mật khẩu hiện tại
                        </Label>
                        <Input
                          id="currentPassword"
                          name="currentPassword"
                          type="password"
                          value={formData.currentPassword}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="newPassword">Mật khẩu mới</Label>
                        <Input
                          id="newPassword"
                          name="newPassword"
                          type="password"
                          value={formData.newPassword}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">
                          Xác nhân mật khẩu
                        </Label>
                        <Input
                          id="confirmPassword"
                          name="confirmPassword"
                          type="password"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button type="submit" disabled={isLoading}>
                        {isLoading ? "Đang cập nhật..." : "Cập nhật"}
                      </Button>
                    </CardFooter>
                  </form>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
