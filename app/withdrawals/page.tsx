"use client";

import WithdrawDialog from "@/app/withdrawals/withdraw-dialog";
import { CustomPagination } from "@/components/customPagination";
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
import paymentAPI from "@/services/API/paymentAPI";
import { WalletAction, WalletCommandStatus } from "@/services/API/walletAPI";
import { useLoading } from "@/store/LoadingStore";
import { useQuery } from "@tanstack/react-query";
import { MoreHorizontal, Search } from "lucide-react";
import { useState } from "react";

export const getStatusBadge = (status: WalletCommandStatus) => {
  switch (status) {
    case WalletCommandStatus.WAIT_TO_RESOLVE:
      return {
        classes: "bg-yellow-100 text-yellow-800",
        text: "Chờ xử lý",
      };
    case WalletCommandStatus.WAIT_TO_PAY:
      return {
        classes: "bg-blue-100 text-blue-800",
        text: "Chờ thanh toán",
      };
    case WalletCommandStatus.REJECTED:
      return {
        classes: "bg-red-100 text-red-800",
        text: "Từ chối",
      };
    case WalletCommandStatus.SUCCESS:
      return {
        classes: "bg-green-100 text-green-800",
        text: "Thành công",
      };
    case WalletCommandStatus.RETURNED:
      return {
        classes: "bg-blue-100 text-blue-800",
        text: "Hoàn tác",
      };
    default:
      return {
        classes: "bg-gray-100 text-gray-800",
        text: "Khác",
      };
  }
};

export default function WithdrawalsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<WalletCommandStatus | "all">(
    "all"
  );
  const [page, setPage] = useState(1);

  const [selectedWithdrawal, setSelectedWithdrawal] = useState<string | null>(
    null
  );
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const { setIsLoading } = useLoading();

  const { data: requests, refetch } = useQuery({
    queryKey: ["withdrawals", searchQuery, statusFilter, page],
    queryFn: () => {
      setIsLoading(true);
      return paymentAPI
        .getWalletCommand({
          pageIndex: page,
          keyword: searchQuery,
          pageSize: 10,
          actions: [WalletAction.WITHDRAW],
          statuses: statusFilter === "all" ? undefined : [statusFilter],
        })
        .finally(() => setIsLoading(false));
    },
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const viewWithdrawalDetails = (withdrawalId: string) => {
    setSelectedWithdrawal(withdrawalId);
    setIsDetailsDialogOpen(true);
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">
            Yêu cầu rút tiền
          </h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Danh sách các yêu cầu rút tiền</CardTitle>
            <CardDescription>Quản lý lệnh rút tiền</CardDescription>
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
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setPage(1);
                    }}
                  />
                </div>
              </div>
              <Select
                value={statusFilter}
                onValueChange={(value) => {
                  setStatusFilter(value as WalletCommandStatus | "all");
                  setPage(1);
                }}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value={WalletCommandStatus.WAIT_TO_RESOLVE}>
                    Chờ xử lý
                  </SelectItem>
                  <SelectItem value={WalletCommandStatus.WAIT_TO_PAY}>
                    Chờ thanh toán
                  </SelectItem>
                  <SelectItem value={WalletCommandStatus.REJECTED}>
                    Từ chối
                  </SelectItem>
                  <SelectItem value={WalletCommandStatus.SUCCESS}>
                    Thành công
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mã</TableHead>
                    <TableHead>Người yêu cầu</TableHead>
                    <TableHead>Số tiền</TableHead>
                    <TableHead>Ngân hàng</TableHead>
                    <TableHead>Tài khoản</TableHead>
                    <TableHead>Người nhận</TableHead>
                    <TableHead>Ngày yêu cầu</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead className="text-right">Hành động</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {requests?.page.total === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-4">
                        No withdrawal requests found
                      </TableCell>
                    </TableRow>
                  ) : (
                    requests?.data.map((withdrawal) => (
                      <TableRow key={withdrawal.id}>
                        <TableCell className="font-medium text-futa-primary">
                          {withdrawal.code}
                        </TableCell>
                        <TableCell>{withdrawal.createdBy}</TableCell>
                        <TableCell>
                          {formatCurrencyVND(withdrawal.amount)}
                        </TableCell>
                        <TableCell>{withdrawal.bankCode}</TableCell>
                        <TableCell>{withdrawal.accountNumber}</TableCell>
                        <TableCell>{withdrawal.receiverName}</TableCell>
                        <TableCell>
                          {formatDate(withdrawal.createdAt)}
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={
                              getStatusBadge(withdrawal.status).classes
                            }
                          >
                            {getStatusBadge(withdrawal.status).text}
                          </Badge>
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
                                onClick={() =>
                                  viewWithdrawalDetails(withdrawal.id)
                                }
                              >
                                Xem chi tiết
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
            <div className="flex items-center justify-between mt-5">
              <span>
                Hiển thị {requests?.page.pageSize} / {requests?.page.total}
              </span>
              <CustomPagination
                currentPage={page}
                totalPages={Math.ceil(
                  (requests?.page.total || 1) / (requests?.page.pageSize || 1)
                )}
                onPageChange={setPage}
              />
            </div>
          </CardContent>
        </Card>
      </div>
      {selectedWithdrawal && (
        <WithdrawDialog
          id={selectedWithdrawal}
          open={isDetailsDialogOpen}
          onClose={() => setIsDetailsDialogOpen(false)}
          refetch={refetch}
        />
      )}
    </DashboardLayout>
  );
}
