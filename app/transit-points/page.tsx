"use client";

import TransitPointDialog from "@/app/transit-points/edit-dialog";
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
import transitAPI, {
  TransitPoint,
  TransitPointType,
} from "@/services/API/transitAPI";
import { useLoading } from "@/store/LoadingStore";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Building,
  Home,
  MapPin,
  MoreHorizontal,
  Plus,
  Search,
  Truck,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function TransitPointsPage() {
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");

  const [isOpenDialog, setIsOpenDialog] = useState(false);
  const [isOpenEditDialog, setIsOpenEditDialog] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentTransitPoint, setCurrentTransitPoint] =
    useState<TransitPoint | null>(null);

  const { setIsLoading: setLoading } = useLoading();

  const {
    data: transitPointsPage,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: [
      "transitPointsPage",
      pageIndex,
      pageSize,
      searchQuery,
      typeFilter,
    ],
    queryFn: () =>
      transitAPI.getTransit({
        pageIndex,
        pageSize,
        keyword: searchQuery,
        types:
          typeFilter === "all"
            ? undefined
            : [typeFilter as unknown as TransitPointType],
      }),
  });

  const { mutate: deleteTransitPoint, isPending } = useMutation({
    mutationFn: (id: string) => transitAPI.delete(id),
  });

  useEffect(() => {
    setLoading(isFetching);
  }, [isFetching]);

  const handleDeleteClick = (transitPoint: TransitPoint) => {
    setCurrentTransitPoint(transitPoint);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteTransitPoint = () => {
    if (!currentTransitPoint) return;
    deleteTransitPoint(currentTransitPoint.id, {
      onSuccess: () => {
        refetch();
        toast.success("Xóa diểm trung chuyển thành công");
      },
    });
    setIsDeleteDialogOpen(false);
  };

  const handlePageChange = (newPageIndex: number) => {
    setPageIndex(newPageIndex);
  };

  const handlePageSizeChange = (value: string) => {
    setPageSize(Number.parseInt(value));
    setPageIndex(1);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "PLACE":
        return <MapPin className="h-4 w-4" />;
      case "STATION":
        return <Building className="h-4 w-4" />;
      case "OFFICE":
        return <Home className="h-4 w-4" />;
      case "TRANSPORT":
        return <Truck className="h-4 w-4" />;
      default:
        return <MapPin className="h-4 w-4" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "PLACE":
        return "Địa điểm";
      case "STATION":
        return "Trạm";
      case "OFFICE":
        return "Văn phòng";
      case "TRANSPORT":
        return "Trung chuyển";
      default:
        return type;
    }
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">
            Điểm Trung Chuyển
          </h1>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="mb-2">Tất Cả Điểm Trung Chuyển</CardTitle>
              <CardDescription>
                Quản lý tất cả các điểm trung chuyển trong hệ thống.
              </CardDescription>
            </div>
            <Button onClick={() => setIsOpenDialog(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Thêm
            </Button>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Tìm kiếm điểm trung chuyển..."
                    className="pl-8 w-[250px]"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Lọc theo loại" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả loại</SelectItem>
                    <SelectItem value="PLACE">Địa điểm</SelectItem>
                    <SelectItem value="STATION">Trạm</SelectItem>
                    <SelectItem value="OFFICE">Văn phòng</SelectItem>
                    <SelectItem value="TRANSPORT">Trung chuyển</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  value={pageSize.toString()}
                  onValueChange={handlePageSizeChange}
                >
                  <SelectTrigger className="w-[80px]">
                    <SelectValue placeholder="Số lượng" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tên</TableHead>
                    <TableHead>Địa chỉ</TableHead>
                    <TableHead>Hotline</TableHead>
                    <TableHead>Loại</TableHead>
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
                  ) : transitPointsPage?.page.total === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-4">
                        Không tìm thấy điểm trung chuyển nào
                      </TableCell>
                    </TableRow>
                  ) : (
                    transitPointsPage?.data.map((point) => (
                      <TableRow key={point.id}>
                        <TableCell className="text-futa-primary font-semibold">
                          {point.name}
                        </TableCell>
                        <TableCell>{point.address}</TableCell>
                        <TableCell>{point.hotline}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getTypeIcon(point.type.toString())}
                            <span>{getTypeLabel(point.type.toString())}</span>
                          </div>
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
                                onClick={() => {
                                  setCurrentTransitPoint(point);
                                  setIsOpenEditDialog(true);
                                }}
                              >
                                Chỉnh sửa
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => handleDeleteClick(point)}
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

            {/* Pagination */}
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-muted-foreground">
                Hiển thị {transitPointsPage?.page.pageSize} /{" "}
                {transitPointsPage?.page.total} điểm trung chuyển
              </div>
              <CustomPagination
                currentPage={transitPointsPage?.page.pageIndex || 1}
                totalPages={Math.ceil(
                  (transitPointsPage?.page.total || 1) /
                    (transitPointsPage?.page.pageSize || 1)
                )}
                onPageChange={handlePageChange}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Xác Nhận Xóa</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa điểm trung chuyển "
              {currentTransitPoint?.name}"? Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsDeleteDialogOpen(false);
                setCurrentTransitPoint(null);
              }}
            >
              Hủy
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteTransitPoint}
              disabled={isPending}
            >
              {isPending ? "Đang xử lý..." : "Xóa"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <TransitPointDialog
        open={isOpenDialog}
        isAddModal
        onClose={() => setIsOpenDialog(false)}
        refetch={refetch}
      />

      <TransitPointDialog
        open={isOpenEditDialog}
        defaultValue={currentTransitPoint}
        onClose={() => setIsOpenEditDialog(false)}
        refetch={refetch}
      />
    </DashboardLayout>
  );
}
