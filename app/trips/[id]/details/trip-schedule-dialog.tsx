import { Badge } from "@/components/ui/badge";
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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import tripAPI, {
  BusType,
  TripScheDule,
  TripStatus,
} from "@/services/API/tripAPI";
import { useLoading } from "@/store/LoadingStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";

const tripScheduleSchema = z.object({
  fromDate: z.string().nonempty("Không được để trống"),
  toDate: z.string().nonempty("Không được để trống"),
  price: z.number().min(100000, "Giá phải lớn hơn 100.000 VNĐ"),
  type: z.enum([BusType.SEAT, BusType.BED, BusType.LIMOUSINE]),
  status: z.enum([TripStatus.ACTIVE, TripStatus.INACTIVE]),
});

export default function TripScheduleDialog({
  open,
  onClose,
  tripId,
  isAddModal = false,
  defaultValue,
  refetch,
}: {
  open: boolean;
  onClose: () => void;
  tripId: string;
  isAddModal?: boolean;
  defaultValue?: TripScheDule | null;
  refetch?: () => void;
}) {
  const { setIsLoading } = useLoading();
  const form = useForm<z.infer<typeof tripScheduleSchema>>({
    resolver: zodResolver(tripScheduleSchema),
    defaultValues: {
      fromDate: "",
      toDate: "",
      price: 100000,
      type: BusType.SEAT,
      status: TripStatus.ACTIVE,
    },
  });

  useEffect(() => {
    if (defaultValue) {
      form.setValue("fromDate", defaultValue.fromDate);
      form.setValue("toDate", defaultValue.toDate);
      form.setValue("price", defaultValue.price);
      form.setValue("type", defaultValue.type);
      form.setValue("status", defaultValue.status);
    } else {
      form.reset();
    }
  }, [open]);

  const handleSubmit = (data: z.infer<typeof tripScheduleSchema>) => {
    setIsLoading(true);
    if (isAddModal) {
      tripAPI
        .createTripSchedule(tripId, data as TripScheDule)
        .then(() => {
          refetch?.();
          setIsLoading(false);
          onClose();
          form.reset();
          toast.success("Thành công");
        })
        .finally(() => setIsLoading(false));
    } else {
      tripAPI
        .updateTripSchedule(tripId, defaultValue!.id, data as TripScheDule)
        .then(() => {
          refetch?.();
          onClose();
          form.reset();
          toast.success("Thành công");
        })
        .finally(() => setIsLoading(false));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isAddModal ? "Thêm Lịch Trình" : "Chi Tiết Lịch Trình"} Của Chuyến
            Đi
          </DialogTitle>
          <DialogDescription>
            Nhập thông tin cho lịch trình chuyến đi này.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="flex flex-col gap-4"
          >
            <FormField
              control={form.control}
              name="fromDate"
              disabled={!isAddModal}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ngày đi</FormLabel>
                  <FormControl>
                    <Input {...field} type="date" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              disabled={!isAddModal}
              name="toDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ngày về</FormLabel>
                  <FormControl>
                    <Input {...field} type="date" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Giá</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Loại Xe</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Loại Xe" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={BusType.SEAT}>Ghế</SelectItem>
                        <SelectItem value={BusType.BED}>Giường</SelectItem>
                        <SelectItem value={BusType.LIMOUSINE}>
                          Limosine
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tinh Trạng</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Tinh Trạng" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={TripStatus.ACTIVE}>
                          <Badge className="bg-green-500">Hoạt động</Badge>
                        </SelectItem>
                        <SelectItem value={TripStatus.INACTIVE}>
                          <Badge className="bg-red-500">Không hoạt động</Badge>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Hủy
          </Button>
          <Button
            onClick={form.handleSubmit(handleSubmit)}
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? "Đang xử lý..." : "Xử lý"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
