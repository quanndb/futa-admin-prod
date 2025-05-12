"use client";

import TripScheduleDialog from "@/app/trips/[id]/details/trip-schedule-dialog";
import DashboardLayout from "@/components/dashboard-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import tripAPI, { BusType, TripScheDule } from "@/services/API/tripAPI";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ArrowLeft, Calendar, MoreHorizontal, Plus } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

export default function TripDetailsPage() {
  const params = useParams();
  const tripId = params.id as string;

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentTripDetail, setCurrentTripDetail] =
    useState<TripScheDule | null>(null);

  const {
    data: tripScheDules,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["trip-schedule", tripId],
    queryFn: () => tripAPI.getTripSchedules(tripId),
  });

  const { mutate: deleteTripSchedule, isPending } = useMutation({
    mutationFn: (id: string) => tripAPI.deleteTripSchedule(tripId, id),
  });

  const handleAddTripDetail = async () => {};

  const handleEditClick = (tripDetail: TripScheDule) => {
    setCurrentTripDetail(tripDetail);

    setIsEditDialogOpen(true);
  };

  const handleUpdateTripDetail = async () => {
    if (!currentTripDetail) return;
  };

  const handleDeleteClick = (tripDetail: TripScheDule) => {
    setCurrentTripDetail(tripDetail);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteTripDetail = async () => {
    if (!currentTripDetail) return;
    deleteTripSchedule(currentTripDetail.id, {
      onSuccess: () => {
        setIsDeleteDialogOpen(false);
        toast.success("Xóa chuyến đi thành công");
        refetch();
      },
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return <Badge className="bg-green-500">Hoạt động</Badge>;
      case "INACTIVE":
        return <Badge className="bg-red-500">Không hoạt động</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getTypeLabel = (type: BusType) => {
    switch (type) {
      case BusType.SEAT:
        return "Ghế thường";
      case BusType.BED:
        return "Giường nằm";
      case BusType.LIMOUSINE:
        return "Limousine";
      default:
        return type;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN");
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/trips">
              <Button variant="outline" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h1 className="text-3xl font-bold tracking-tight">
              Chi Tiết Chuyến Đi
            </h1>
          </div>
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="mb-4 flex flex-col md:flex-row items-center justify-between">
              <div>
                <h3 className="text-lg font-medium">Lịch Trình và Giá Vé</h3>
                <p className="text-sm text-muted-foreground">
                  Quản lý lịch trình và giá vé cho chuyến đi này.
                </p>
              </div>
              <div>
                <Button onClick={() => setIsAddDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Thêm lịch trình
                </Button>
              </div>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Khoảng Thời Gian</TableHead>
                    <TableHead>Loại</TableHead>
                    <TableHead>Giá</TableHead>
                    <TableHead>Trạng Thái</TableHead>
                    <TableHead className="text-right">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isFetching ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-4">
                        Đang tải dữ liệu...
                      </TableCell>
                    </TableRow>
                  ) : tripScheDules?.page?.total === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-4">
                        Không tìm thấy chi tiết chuyến đi nào
                      </TableCell>
                    </TableRow>
                  ) : (
                    tripScheDules?.data?.map((detail) => (
                      <TableRow key={detail.id}>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="text-futa-primary">
                              {formatDate(detail.fromDate)} -{" "}
                              {formatDate(detail.toDate)}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>{getTypeLabel(detail.type)}</TableCell>
                        <TableCell>
                          {detail.price.toLocaleString("vi-VN")} VNĐ
                        </TableCell>
                        <TableCell>{getStatusBadge(detail.status)}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Mở menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
                              <DropdownMenuItem
                                onClick={() => handleEditClick(detail)}
                              >
                                Chỉnh sửa
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => handleDeleteClick(detail)}
                                className="text-destructive"
                              >
                                Xóa
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
          </CardContent>
        </Card>
      </div>

      {/* Edit Dialog */}
      {tripId && (
        <>
          <TripScheduleDialog
            open={isEditDialogOpen}
            tripId={tripId}
            onClose={() => setIsEditDialogOpen(false)}
            defaultValue={currentTripDetail}
            refetch={refetch}
          />

          {/* Add Dialog */}
          <TripScheduleDialog
            open={isAddDialogOpen}
            tripId={tripId}
            onClose={() => setIsAddDialogOpen(false)}
            isAddModal
            refetch={refetch}
          />
        </>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Xác Nhận Xóa</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa chi tiết chuyến đi này? Hành động này
              không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Hủy
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteTripDetail}
              disabled={isPending}
            >
              {isPending ? "Đang xử lý..." : "Xóa"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
