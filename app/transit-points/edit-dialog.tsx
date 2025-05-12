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
import transitAPI, { TransitPoint } from "@/services/API/transitAPI";
import { useLoading } from "@/store/LoadingStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";

const transitSchema = z.object({
  name: z.string().nonempty("Không được để trống"),
  type: z.string().nonempty("Không được để trống"),
  address: z.string().nonempty("Không được để trống"),
  hotline: z.string().optional().nullable(),
});

export default function TransitPointDialog({
  open,
  onClose,
  isAddModal = false,
  defaultValue,
  refetch,
}: {
  open: boolean;
  onClose: () => void;
  isAddModal?: boolean;
  defaultValue?: TransitPoint | null;
  refetch?: () => void;
}) {
  const form = useForm<z.infer<typeof transitSchema>>({
    resolver: zodResolver(transitSchema),
  });

  const { setIsLoading } = useLoading();

  useEffect(() => {
    if (defaultValue) {
      form.reset({
        name: defaultValue.name,
        type: defaultValue.type.toString(),
        address: defaultValue.address,
        hotline: defaultValue.hotline ?? "",
      });
    } else {
      form.reset({
        name: "",
        type: "",
        address: "",
        hotline: "",
      });
    }
  }, [defaultValue, form, open]);

  const handleSubmit = (values: z.infer<typeof transitSchema>) => {
    setIsLoading(true);
    if (isAddModal) {
      transitAPI.create(values as unknown as TransitPoint).then(() => {
        setIsLoading(false);
        toast.success("Thêm điểm trung chuyển mới thành công");
        refetch?.();
        onClose();
      });
    } else {
      transitAPI
        .update(defaultValue!.id, values as unknown as TransitPoint)
        .then(() => {
          setIsLoading(false);
          toast.success("Cập nhật điểm trung chuyển mới thành công");
          refetch?.();
          onClose();
        });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isAddModal ? "Thêm" : "Cập nhật"} Điểm Trung Chuyển Mới
          </DialogTitle>
          <DialogDescription>
            Nhập thông tin cho điểm trung chuyển mới.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="grid gap-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên</FormLabel>
                  <FormControl>
                    <Input
                      id="name"
                      placeholder="VD: Điểm trung chuyển 1"
                      className="col-span-3"
                      {...field}
                      required
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Địa chỉ</FormLabel>
                  <FormControl>
                    <Input
                      id="address"
                      placeholder="VD: 123 Đường Lê Lợi, Quận 1, TP.HCM"
                      className="col-span-3"
                      {...field}
                      required
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="hotline"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hotline</FormLabel>
                  <FormControl>
                    <Input
                      id="hotline"
                      placeholder="VD: 028 1234 5678"
                      className="col-span-3"
                      {...field}
                      value={field.value ?? ""}
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
                  <FormLabel>Loại</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      required
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Chọn loại" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PLACE">Địa điểm</SelectItem>
                        <SelectItem value="STATION">Trạm</SelectItem>
                        <SelectItem value="OFFICE">Văn phòng</SelectItem>
                        <SelectItem value="TRANSPORT">Giao thông</SelectItem>
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
            {form.formState.isSubmitting
              ? "Đang xử lý..."
              : `${isAddModal ? "Thêm" : "Cập nhật"} Điểm Trung Chuyển`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
