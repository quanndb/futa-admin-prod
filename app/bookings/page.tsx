"use client";

import DetailsBookingDialog from "@/app/bookings/detail-booking-dialog";
import DashboardLayout from "@/components/dashboard-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { formatCurrencyVND } from "@/lib/CurrencyFormater";
import bookingAPI, { BookingStatus } from "@/services/API/bookingAPI";
import { useLoading } from "@/store/LoadingStore";
import { useQuery } from "@tanstack/react-query";
import { MoreHorizontal, Search } from "lucide-react";
import { useState } from "react";

export const getStatusBadge = (status: BookingStatus) => {
  switch (status) {
    case BookingStatus.WAIT_TO_PAY:
      return <Badge className="bg-yellow-500">Chờ thanh toán</Badge>;
    case BookingStatus.OUT_OF_PAY:
      return <Badge className="bg-red-500">Hết hạn</Badge>;
    case BookingStatus.PAYED:
      return <Badge className="bg-green-500">Đã thanh toán</Badge>;
    case BookingStatus.RETURNED:
      return <Badge className="bg-blue-500">Đã trả vé</Badge>;
    case BookingStatus.FAILED:
      return <Badge variant="destructive">Thất bại</Badge>;
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
};

export default function BookingsPage() {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<BookingStatus | "all">(
    "all"
  );
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const { setIsLoading } = useLoading();

  const { data: bookingData } = useQuery({
    queryKey: ["bookings", page, searchQuery, statusFilter],
    queryFn: () => {
      setIsLoading(true);
      return bookingAPI
        .getBookings({
          pageIndex: page,
          pageSize: 10,
          keyword: searchQuery,
          status: statusFilter === "all" ? undefined : [statusFilter],
        })
        .finally(() => setIsLoading(false));
    },
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const viewBookingDetails = (booking: any) => {
    setSelectedBooking(booking);
    setIsDetailsDialogOpen(true);
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Quản lý vé</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Danh sách lịch sử đặt vé</CardTitle>
            <CardDescription>
              Danh sách lịch sử đặt vé trên hệ thống
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Tìm kiếm..."
                    className="pl-8 w-[250px]"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              <Select
                value={statusFilter}
                onValueChange={(value) =>
                  setStatusFilter(value as BookingStatus | "all")
                }
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value={BookingStatus.WAIT_TO_PAY}>
                    Chờ thanh toán
                  </SelectItem>
                  <SelectItem value={BookingStatus.PAYED}>
                    Đã thanh toán
                  </SelectItem>
                  <SelectItem value={BookingStatus.RETURNED}>
                    Đã trả vé
                  </SelectItem>
                  <SelectItem value={BookingStatus.FAILED}>Thất bại</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mã đơn</TableHead>
                    <TableHead>Tên khách hàng</TableHead>
                    <TableHead>Chuyến xe</TableHead>
                    <TableHead>Ngày khởi hành</TableHead>
                    <TableHead>Ghế</TableHead>
                    <TableHead>Tổng thanh toán</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead className="text-right">Hành động</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bookingData?.page.total === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-4">
                        No bookings found
                      </TableCell>
                    </TableRow>
                  ) : (
                    bookingData?.data?.map((booking) => (
                      <TableRow key={booking.code}>
                        <TableCell className="font-medium">
                          {booking.code}
                        </TableCell>
                        <TableCell>{booking.departureTrip.fullName}</TableCell>
                        <TableCell>
                          Lượt đi:{" "}
                          <span className="text-futa-primary">
                            {booking.departureTrip.route}
                          </span>
                          <hr className="my-1" />
                          {booking.returnTrip && (
                            <>
                              Lượt về:{" "}
                              <span className="text-futa-primary">
                                {booking.returnTrip.route}
                              </span>
                            </>
                          )}
                        </TableCell>
                        <TableCell>
                          Lượt đi:{" "}
                          <span className="text-futa-primary">
                            {formatDate(booking.departureTime)}
                          </span>
                          <hr className="my-1" />
                          {booking.returnTime && (
                            <>
                              Lượt về:{" "}
                              <span className="text-futa-primary">
                                {formatDate(booking.returnTime)}
                              </span>
                            </>
                          )}
                        </TableCell>
                        <TableCell>
                          Lượt đi:{" "}
                          <span className="text-futa-primary">
                            {booking.departureTrip.tickets
                              .map((ticket) => ticket.seatNumber)
                              .join(", ")}
                          </span>
                          <hr className="my-1" />
                          {booking.returnTrip && (
                            <>
                              Lượt về:{" "}
                              <span className="text-futa-primary">
                                {booking.returnTrip.tickets
                                  .map((ticket) => ticket.seatNumber)
                                  .join(", ")}
                              </span>
                            </>
                          )}
                        </TableCell>
                        <TableCell>
                          {formatCurrencyVND(booking.totalPrice)}
                        </TableCell>
                        <TableCell className="px-0">
                          {getStatusBadge(booking.status)}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Mở menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Hành động</DropdownMenuLabel>
                              <DropdownMenuItem
                                onClick={() => viewBookingDetails(booking)}
                              >
                                Xem chi tiết
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Booking Details Dialog */}
        {selectedBooking && (
          <DetailsBookingDialog
            open={isDetailsDialogOpen}
            onClose={() => setIsDetailsDialogOpen(false)}
            data={selectedBooking}
          />
        )}
      </div>
    </DashboardLayout>
  );
}
