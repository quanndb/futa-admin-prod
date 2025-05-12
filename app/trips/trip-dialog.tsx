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
import tripAPI, { TripDTO } from "@/services/API/tripAPI";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";

const tripSchema = z.object({
  code: z.string().nonempty("Không được để trống"),
  name: z.string().nonempty("Không được để trống"),
  description: z.string().optional().nullable(),
});

export default function TripDialog({
  open,
  onClose,
  isAddModal = false,
  defaultValue,
  refetch,
}: {
  open: boolean;
  onClose: () => void;
  isAddModal?: boolean;
  defaultValue?: TripDTO | null;
  refetch?: () => void;
}) {
  const form = useForm<z.infer<typeof tripSchema>>({
    resolver: zodResolver(tripSchema),
    defaultValues: {
      code: "",
      name: "",
      description: "",
    },
  });

  useEffect(() => {
    if (defaultValue) {
      form.setValue("code", defaultValue.code);
      form.setValue("name", defaultValue.name);
      form.setValue("description", defaultValue.description);
    } else {
      form.reset();
    }
  }, [defaultValue]);

  const handleSubmit = (data: z.infer<typeof tripSchema>) => {
    if (isAddModal) {
      tripAPI.create(data as TripDTO).then(() => {
        onClose();
        toast.success("Thành công");
        refetch?.();
        form.reset();
      });
    } else {
      tripAPI.update(defaultValue!.id, data as TripDTO).then(() => {
        onClose();
        toast.success("Thành công");
        refetch?.();
        form.reset();
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isAddModal ? "Thêm" : "Cập nhật"} Chuyến Đi
          </DialogTitle>
          <DialogDescription>Thông tin cho chuyến đi</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="flex flex-col gap-4"
          >
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mã</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Mã chuyến đi" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Tên chuyến đi" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mô tả</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Mô tả chuyến đi"
                      value={field?.value || ""}
                    />
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
            {form.formState.isSubmitting ? "Đang xử lý..." : "Lưu Thay Đổi"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
