"use client";

import TripDialog from "@/app/trips/trip-dialog";
import { CustomPagination } from "@/components/customPagination";
import DashboardLayout from "@/components/dashboard-layout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import tripAPI, { TripDTO } from "@/services/API/tripAPI";
import { useLoading } from "@/store/LoadingStore";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ArrowRight, MoreHorizontal, Plus, Search } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function TripsPage() {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentTrip, setCurrentTrip] = useState<TripDTO | null>(null);

  const { setIsLoading } = useLoading();

  const {
    data: tripsData,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ["trips", page, searchQuery],
    queryFn: () =>
      tripAPI.getTrips({ pageIndex: page, pageSize: 10, keyword: searchQuery }),
  });

  useEffect(() => {
    setIsLoading(isFetching);
  }, [isFetching]);

  const { mutate: deleteTrip, isPending } = useMutation({
    mutationFn: (tripId: string) => tripAPI.delete(tripId),
  });

  const handleEditClick = (trip: TripDTO) => {
    setCurrentTrip(trip);

    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = (trip: TripDTO) => {
    setCurrentTrip(trip);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteTrip = async () => {
    if (!currentTrip) return;
    deleteTrip(currentTrip.id, {
      onSuccess: () => {
        setIsDeleteDialogOpen(false);
        toast.success("Xóa chuyến đi thành công");
        refetch();
      },
    });
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="mb-2">Tất Cả Chuyến Đi</CardTitle>
              <CardDescription>
                Quản lý tất cả các chuyến đi trong hệ thống.
              </CardDescription>
            </div>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Tạo chuyến đi
            </Button>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Tìm kiếm chuyến đi..."
                    className="pl-8 w-[250px]"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mã</TableHead>
                    <TableHead>Tên</TableHead>
                    <TableHead>Mô tả</TableHead>
                    <TableHead>Điểm Trung Chuyển</TableHead>
                    <TableHead>Chi Tiết Chuyến</TableHead>
                    <TableHead className="text-right">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isFetching ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-4">
                        Đang tải dữ liệu...
                      </TableCell>
                    </TableRow>
                  ) : tripsData?.page.total === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-4">
                        Không tìm thấy chuyến đi nào
                      </TableCell>
                    </TableRow>
                  ) : (
                    tripsData?.data.map((trip) => (
                      <TableRow key={trip.id}>
                        <TableCell className="font-medium text-futa-primary">
                          {trip.code}
                        </TableCell>
                        <TableCell>{trip.name}</TableCell>
                        <TableCell>{trip.description}</TableCell>
                        <TableCell>
                          <Link
                            href={`/trips/${trip.id}/transits`}
                            className="flex items-center hover:underline hover:text-futa-primary"
                          >
                            <span>Điểm trung chuyển</span>
                            <ArrowRight className="ml-1 h-4 w-4" />
                          </Link>
                        </TableCell>
                        <TableCell>
                          <Link
                            href={`/trips/${trip.id}/details`}
                            className="flex items-center hover:underline hover:text-futa-primary"
                          >
                            <span>Chi tiết</span>
                            <ArrowRight className="ml-1 h-4 w-4" />
                          </Link>
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
                              <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
                              <DropdownMenuItem
                                onClick={() => handleEditClick(trip)}
                              >
                                Chỉnh sửa
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => handleDeleteClick(trip)}
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
            <CustomPagination
              currentPage={page}
              totalPages={Math.ceil(
                (tripsData?.page.total || 1) / (tripsData?.page.pageSize || 1)
              )}
              onPageChange={setPage}
            />
          </CardContent>
        </Card>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Xác Nhận Xóa</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa chuyến đi "{currentTrip?.name}"? Hành
              động này không thể hoàn tác.
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
              onClick={handleDeleteTrip}
              disabled={isPending}
            >
              {isPending ? "Đang xử lý..." : "Xóa"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <TripDialog
        open={isAddDialogOpen}
        isAddModal
        onClose={() => setIsAddDialogOpen(false)}
        refetch={refetch}
      />
      <TripDialog
        open={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        defaultValue={currentTrip}
        refetch={refetch}
      />
    </DashboardLayout>
  );
}
