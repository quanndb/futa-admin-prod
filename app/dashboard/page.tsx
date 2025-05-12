"use client";

import { CustomPagination } from "@/components/customPagination";
import DashboardLayout from "@/components/dashboard-layout";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatCurrencyVND } from "@/lib/CurrencyFormater";
import { formatToLocalDateTimeWithTimeZone } from "@/lib/DateConverter";
import bookingAPI from "@/services/API/bookingAPI";
import { TransferType } from "@/services/API/paymentAPI";
import transactionAPI from "@/services/API/transactionAPI";
import tripAPI from "@/services/API/tripAPI";
import { WalletAction, WalletCommandStatus } from "@/services/API/walletAPI";
import { useLoading } from "@/store/LoadingStore";
import { useQuery } from "@tanstack/react-query";
import { Bus, Calendar, CreditCard, DollarSign } from "lucide-react";
import { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

export default function DashboardPage() {
  const [period, setPeriod] = useState("monthly");
  const [year, setYear] = useState("2025");
  const [page, setPage] = useState(1);
  const [keyword, setKeyword] = useState("");
  const { setIsLoading } = useLoading();

  // Tính tổng
  const { data: bookingStatistics } = useQuery({
    queryKey: ["booking-statistics", period, year],
    queryFn: () => {
      if (period === "monthly") {
        return bookingAPI.getBookingStatistic(year);
      } else {
        return bookingAPI.getBookingStatistic("");
      }
    },
  });

  // booking revenue
  const { data: bookingRevenueStatistics } = useQuery({
    queryKey: ["booking-revenue-statistics", period, year],
    queryFn: () => {
      if (period === "monthly") {
        return bookingAPI.getBookingRevenueStatistic(year);
      } else {
        return bookingAPI.getBookingRevenueStatistic("");
      }
    },
  });

  const { data: tripStatistics } = useQuery({
    queryKey: ["trip-statistics", period, year],
    queryFn: () => {
      if (period === "monthly") {
        return tripAPI.getTripStatistic(year);
      } else {
        return tripAPI.getTripStatistic("");
      }
    },
  });

  const { data: totalOut } = useQuery({
    queryKey: ["total-out", period, year],
    queryFn: () => {
      setIsLoading(true);
      const month = String(new Date().getMonth() + 1).padStart(2, "0");
      return transactionAPI
        .getTransactionStatistic({
          startDate:
            period === "monthly" ? `${year}-${month}-01` : `${year}-01-01`,
          endDate:
            period === "monthly" ? `${year}-${month}-31` : `${year}-12-31`,
          transferTypes: [TransferType.OUT],
        })
        .finally(() => setIsLoading(false));
    },
  });

  const { data: transactionsOut } = useQuery({
    queryKey: ["transactions-out", period, year, keyword, page],
    queryFn: () => {
      setIsLoading(true);
      const month = String(new Date().getMonth() + 1).padStart(2, "0");
      return transactionAPI
        .geTransaction({
          startDate:
            period === "monthly" ? `${year}-${month}-01` : `${year}-01-01`,
          endDate:
            period === "monthly" ? `${year}-${month}-31` : `${year}-12-31`,
          transferTypes: [TransferType.OUT],
          pageIndex: page,
          keyword,
          pageSize: 10,
        })
        .finally(() => setIsLoading(false));
    },
  });

  const { data: totalCommandOut } = useQuery({
    queryKey: ["total-command-out", period, year],
    queryFn: () => {
      setIsLoading(true);
      const month = String(new Date().getMonth() + 1).padStart(2, "0");
      return transactionAPI
        .getWalletCommandStatistic({
          startDate:
            period === "monthly" ? `${year}-${month}-01` : `${year}-01-01`,
          endDate:
            period === "monthly" ? `${year}-${month}-31` : `${year}-12-31`,
          actions: [WalletAction.WITHDRAW],
          statuses: [WalletCommandStatus.SUCCESS],
        })
        .finally(() => setIsLoading(false));
    },
  });

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Tổng quan</h1>
          <div className="flex items-center gap-2">
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Chọn kỳ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monthly">Theo tháng</SelectItem>
                <SelectItem value="yearly">Theo năm</SelectItem>
              </SelectContent>
            </Select>
            {period === "monthly" && (
              <Select value={year} onValueChange={setYear}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Chọn năm" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from(
                    { length: new Date().getFullYear() - 2019 + 2 },
                    (_, i) => 2020 + i
                  ).map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Tổng doanh thu
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {period === "monthly"
                  ? // current month
                    bookingRevenueStatistics?.data
                      .find(
                        (item) =>
                          item.key === (new Date().getMonth() + 1).toString()
                      )
                      ?.value.toLocaleString()
                  : // current year
                    bookingRevenueStatistics?.data
                      .find((item) => item.key === year.toString())
                      ?.value.toLocaleString()}{" "}
                VNĐ
              </div>
              <p className="text-xs text-muted-foreground">
                {period === "monthly"
                  ? `Cho tháng ${new Date().getMonth() + 1} ${year}`
                  : `Cho năm ${year}`}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tổng đặt vé</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {period === "monthly"
                  ? // current month
                    bookingStatistics?.data.find(
                      (item) =>
                        item.key === (new Date().getMonth() + 1).toString()
                    )?.value
                  : // current year
                    bookingStatistics?.data.find(
                      (item) => item.key === year.toString()
                    )?.value}
              </div>
              <p className="text-xs text-muted-foreground">
                {period === "monthly"
                  ? `Cho tháng ${new Date().getMonth() + 1} ${year}`
                  : `Cho năm ${year}`}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Tổng chuyến đi
              </CardTitle>
              <Bus className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {period === "monthly"
                  ? // current month
                    tripStatistics?.data.find(
                      (item) =>
                        item.key === (new Date().getMonth() + 1).toString()
                    )?.value
                  : // current year
                    tripStatistics?.data.find(
                      (item) => item.key === year.toString()
                    )?.value}
              </div>
              <p className="text-xs text-muted-foreground">
                {period === "monthly"
                  ? `Cho tháng ${new Date().getMonth() + 1} ${year}`
                  : `Cho năm ${year}`}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Tổng số tiền thanh toán
              </CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {(totalCommandOut?.data?.value || 0).toLocaleString()} VNĐ
              </div>
              <p className="text-xs text-muted-foreground">
                {period === "monthly"
                  ? `Cho tháng ${new Date().getMonth() + 1} ${year}`
                  : `Cho năm ${year}`}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Tổng số tiền ra
              </CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {(totalOut?.data?.value || 0).toLocaleString()} VNĐ
              </div>
              <p className="text-xs text-muted-foreground">
                {period === "monthly"
                  ? `Cho tháng ${new Date().getMonth() + 1} ${year}`
                  : `Cho năm ${year}`}
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="revenue" className="space-y-4">
          <TabsList>
            <TabsTrigger value="revenue">Doanh thu</TabsTrigger>
            <TabsTrigger value="bookings">Đặt vé</TabsTrigger>
            <TabsTrigger value="trips">Chuyến đi</TabsTrigger>
            <TabsTrigger value="transactionsOut">Giao dịch ra</TabsTrigger>
          </TabsList>
          <TabsContent value="revenue" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Tổng quan doanh thu</CardTitle>
                <CardDescription>
                  {period === "monthly"
                    ? `Doanh thu theo tháng cho năm ${year}`
                    : "Tổng quan doanh thu theo năm"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    revenue: {
                      label: "Doanh thu",
                      color: "hsl(var(--chart-1))",
                    },
                  }}
                >
                  <ResponsiveContainer width="100%" height={350}>
                    <LineChart
                      data={bookingRevenueStatistics?.data ?? []}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="key" />
                      <YAxis
                        tickFormatter={(value) =>
                          new Intl.NumberFormat("vi-VN", {
                            notation: "compact",
                            compactDisplay: "short",
                          }).format(value)
                        }
                      />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke="var(--color-revenue)"
                        activeDot={{ r: 8 }}
                        name="Doanh thu: "
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="bookings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Tổng quan đặt vé</CardTitle>
                <CardDescription>
                  {period === "monthly"
                    ? `Doanh thu theo tháng cho năm ${year}`
                    : "Tổng quan doanh thu theo năm"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    bookings: {
                      label: "Đặt vé",
                      color: "hsl(var(--chart-2))",
                    },
                  }}
                >
                  <ResponsiveContainer width="100%" height={350}>
                    <BarChart
                      data={bookingStatistics?.data ?? []}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="key" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend />
                      <Bar
                        dataKey="value"
                        fill="var(--color-bookings)"
                        name="Đặt vé"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="trips" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Tổng quan chuyến đi</CardTitle>
                <CardDescription>
                  {period === "monthly"
                    ? `Doanh thu theo tháng cho năm ${year}`
                    : "Tổng quan doanh thu theo năm"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    trips: {
                      label: "Chuyến đi",
                      color: "hsl(var(--chart-3))",
                    },
                  }}
                >
                  <ResponsiveContainer width="100%" height={350}>
                    <BarChart
                      data={tripStatistics?.data ?? []}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="key" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend />
                      <Bar
                        dataKey="value"
                        fill="var(--color-trips)"
                        name="Chuyến đi"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="transactionsOut" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Tổng quan tiền ra</CardTitle>
                <CardDescription>
                  {period === "monthly"
                    ? `Tiền ra theo tháng ${
                        new Date().getMonth() + 1
                      } cho năm ${year}`
                    : "Tổng quan tiền ra theo năm"}
                  <br />
                  <Input
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    placeholder="Tìm kiếm..."
                    className="max-w-md mt-5"
                  />
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-center">Mã</TableHead>
                      <TableHead className="text-center">Ngân hàng</TableHead>
                      <TableHead className="text-center">
                        Số tài khoản
                      </TableHead>
                      <TableHead className="text-center">Số tiền</TableHead>
                      <TableHead className="text-center">Ngày</TableHead>
                      <TableHead className="text-center">Nội dung</TableHead>
                      <TableHead className="text-center">Mô tả</TableHead>
                      <TableHead className="text-center">Loại</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactionsOut?.data.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium text-futa-primary">
                          {item.code}
                        </TableCell>
                        <TableCell>{item.gateway}</TableCell>
                        <TableCell>{item.accountNumber}</TableCell>
                        <TableCell className="font-semibold text-futa-primary">
                          {formatCurrencyVND(item.transferAmount)}
                        </TableCell>
                        <TableCell>
                          {formatToLocalDateTimeWithTimeZone(item.createdAt)}
                        </TableCell>
                        <TableCell>{item.content}</TableCell>
                        <TableCell>{item.description}</TableCell>
                        <TableCell>{getBadge(item.transferType)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <CustomPagination
                  currentPage={page}
                  totalPages={Math.ceil(
                    (transactionsOut?.page?.total || 1) /
                      (transactionsOut?.page?.pageSize || 10)
                  )}
                  onPageChange={setPage}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}

const getBadge = (type: TransferType) => {
  switch (type) {
    case TransferType.OUT:
      return <Badge className="bg-red-500">Tiền ra</Badge>;
    case TransferType.IN:
      return <Badge className="bg-green-500">Tiền vào</Badge>;
    default:
      return <Badge variant="secondary">{type}</Badge>;
  }
};
