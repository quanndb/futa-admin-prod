import { getStatusBadge } from "@/app/bookings/page";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatCurrencyVND } from "@/lib/CurrencyFormater";
import { BookingResponse } from "@/services/API/bookingAPI";
import { Bus, Calendar, User } from "lucide-react";

export default function DetailsBookingDialog({
  open,
  onClose,
  data,
}: {
  open: boolean;
  onClose: () => void;
  data: BookingResponse;
}) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Chi tiết đơn đặt</DialogTitle>
          <DialogDescription>
            Thống tin chi tiết đơn đặt: {data.code}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <User className="mr-2 h-4 w-4" />
                  Thông tin khách hàng
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm flex flex-col gap-2">
                  <p className="font-medium">
                    Họ tên:{" "}
                    <span className="text-futa-primary">
                      {data.departureTrip.fullName}
                    </span>
                  </p>
                  <p className="font-medium">
                    Email:{" "}
                    <span className="text-futa-primary">
                      {data.departureTrip.email}
                    </span>
                  </p>
                  <p className="font-medium">
                    SĐT:{" "}
                    <span className="text-futa-primary">
                      {data.departureTrip.phone}
                    </span>
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <Calendar className="mr-2 h-4 w-4" />
                  Thông tin đơn đặt
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm flex flex-col gap-2">
                  <p>
                    <span className="font-medium">
                      Mã đơn:{" "}
                      <span className="text-futa-primary">{data.code}</span>
                    </span>
                  </p>
                  <p>
                    <span className="font-medium">
                      Ngày đặt:{" "}
                      <span className="text-futa-primary">
                        {formatDate(data.createdAt)}
                      </span>
                    </span>
                  </p>
                  <p>
                    <span className="font-medium">
                      Tổng tiền:{" "}
                      <span className="text-futa-primary">
                        {formatCurrencyVND(data.totalPrice)}
                      </span>
                    </span>
                  </p>
                  <div>
                    <span className="font-medium">Trạng thái: </span>
                    {getStatusBadge(data.status)}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <TripCard data={data} title="Lượt đi" />
          {data.returnTrip && <TripCard data={data} title="Lượt về" />}
        </div>
      </DialogContent>
    </Dialog>
  );
}

const TripCard = ({
  data,
  title,
}: {
  data: BookingResponse;
  title: string;
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center">
          <Bus className="mr-2 h-4 w-4" />
          Thông tin chuyến xe {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex flex-col gap-2">
            <p>
              <span className="font-medium">
                Tuyến:{" "}
                <span className="text-futa-primary">{data.departureRoute}</span>
              </span>
            </p>
            <p>
              <span className="font-medium">
                Ngày khởi hành:{" "}
                <span className="text-futa-primary">
                  {formatDate(data.departureTime)}
                </span>
              </span>
            </p>
            <p>
              <span className="font-medium">
                Giá vé:{" "}
                <span className="text-futa-primary">
                  {formatCurrencyVND(data.departureTrip.pricePerSeat)}
                </span>
              </span>
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <p>
              <span className="font-medium">
                Ghế:{" "}
                <span className="text-futa-primary">
                  {data.departureTrip.tickets
                    .map((ticket) => ticket.seatNumber)
                    .join(", ")}
                </span>
              </span>
            </p>
            <p>
              <span className="font-medium">
                Điểm đón:{" "}
                <span className="text-futa-primary">
                  {data.departureTrip.departureAddress}
                </span>
              </span>
            </p>
            <p>
              <span className="font-medium">
                Điểm trả:{" "}
                <span className="text-futa-primary">
                  {data.departureTrip.destinationAddress}
                </span>
              </span>
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
