import AutoComplete from "@/components/autocomplete";
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import transitAPI, { TransitPoint } from "@/services/API/transitAPI";
import { TripTransit } from "@/services/API/tripAPI";
import { AutocompleteOption } from "@/types/common";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import TimePicker from "react-time-picker";
import { z } from "zod";

const tripTransitSchema = z.object({
  transitPointId: z.string().nonempty("Không được để trống"),
  arrivalTime: z.string().nonempty("Không được để trống"),
  type: z.enum(["PICKUP", "DROP", "BOTH"]),
});

export default function TripTransitDialog({
  open,
  onClose,
  onAddTransitPoint,
}: {
  open: boolean;
  onClose: () => void;
  onAddTransitPoint: (data: TripTransit) => void;
}) {
  const [selectedOption, setSelectedOption] =
    useState<AutocompleteOption | null>(null);
  const loadOptions = (
    inputValue: string,
    callback: (options: AutocompleteOption[]) => void
  ) => {
    transitAPI
      .getTransit({
        keyword: inputValue,
        sortBy: "name.asc",
      })
      .then((res) => {
        const options = res.data.map((tp) => ({
          label: tp.name,
          value: tp.id,
          desc: tp.address,
        }));
        callback(options);
      })
      .catch((error) => {
        console.error("Error loading options:", error);
        callback([]);
      });
  };

  const form = useForm<z.infer<typeof tripTransitSchema>>({
    resolver: zodResolver(tripTransitSchema),
    defaultValues: {
      transitPointId: "",
      arrivalTime: "",
      type: "PICKUP",
    },
  });

  const handleTransitPointChange = (
    selectedOption: AutocompleteOption | null
  ) => {
    if (selectedOption) {
      setSelectedOption(selectedOption);
      form.setValue("transitPointId", selectedOption.value);
    }
  };

  const handleSubmit = (data: z.infer<typeof tripTransitSchema>) => {
    onAddTransitPoint({
      transitPointId: data.transitPointId,
      arrivalTime: data.arrivalTime,
      type: data.type,
      transitPoint: {
        name: selectedOption?.label,
        address: selectedOption?.desc,
      } as TransitPoint,
    } as TripTransit);
    form.reset();
    setSelectedOption(null);
    onClose();
  };

  return (
    <div>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Thêm Điểm Trung Chuyển</DialogTitle>
            <DialogDescription>
              Thêm điểm trung chuyển vào chuyến đi này.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="flex flex-col gap-4"
            >
              <FormField
                control={form.control}
                name="transitPointId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Điểm Trung Chuyển</FormLabel>
                    <AutoComplete
                      loadOptions={loadOptions}
                      onChangeValue={handleTransitPointChange}
                      value={selectedOption}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="arrivalTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="mr-3">Thời Gian Đến</FormLabel>
                    <TimePicker amPmAriaLabel="Select AM/PM" {...field} />
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
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn loại" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PICKUP">Đón khách</SelectItem>
                        <SelectItem value="DROP">Trả khách</SelectItem>
                        <SelectItem value="BOTH">Cả hai</SelectItem>
                      </SelectContent>
                    </Select>
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
            <Button onClick={form.handleSubmit(handleSubmit)}>
              {form.formState.isSubmitting
                ? "Đang xử lý..."
                : "Thêm Điểm Trung Chuyển"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
