import { getStatusBadge } from "@/app/withdrawals/page";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatCurrencyVND } from "@/lib/CurrencyFormater";
import { formatToLocalDateTime } from "@/lib/DateConverter";
import paymentAPI from "@/services/API/paymentAPI";
import { WalletCommand, WalletCommandStatus } from "@/services/API/walletAPI";
import { useLoading } from "@/store/LoadingStore";
import { useMutation } from "@tanstack/react-query";
import {
  Calendar,
  CheckCircle,
  DollarSign,
  QrCode,
  User,
  XCircle,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function WithdrawDialog({
  open,
  onClose,
  id,
  refetch,
}: {
  open: boolean;
  onClose: () => void;
  id: string;
  refetch?: () => void;
}) {
  const [selected, setSelected] = useState<WalletCommand>();
  const { setIsLoading } = useLoading();
  const { mutate: getById } = useMutation({
    mutationFn: (id: string) => {
      return paymentAPI.getWalletCommandById(id);
    },
    onSuccess: (res) => {
      setSelected(res.data);
    },
  });

  useEffect(() => {
    if (!open) return;
    setIsLoading(true);
    getById(id);
    setIsLoading(false);
  }, [open]);

  useEffect(() => {
    if (selected?.status === WalletCommandStatus.WAIT_TO_PAY && open) {
      const interval = setInterval(() => {
        getById(id);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [selected]);

  const handleResolve = (
    status: WalletCommandStatus.REJECTED | WalletCommandStatus.WAIT_TO_PAY
  ) => {
    paymentAPI.resoleWithdraw(id, status).then((res) => {
      setSelected(res.data);
      refetch?.();
      toast.success("Thành công");
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Chi tiết lệnh rút tiền</DialogTitle>
          <DialogDescription>
            Thông tin chi tiết lệnh rút tiền
          </DialogDescription>
        </DialogHeader>
        {selected && (
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
                  <div className="text-sm">
                    <p className="text-medium text-futa-primary">
                      {selected.createdBy}
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center">
                    <Calendar className="mr-2 h-4 w-4" />
                    Thông tin yêu cầu
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm">
                    <p>
                      <span className="font-medium">Mã yêu cầu: </span>
                      <span className="text-futa-primary">{selected.code}</span>
                    </p>
                    <p>
                      <span className="font-medium">Ngày yêu cầu: </span>
                      <span className="text-futa-primary">
                        {formatToLocalDateTime(selected.createdAt)}
                      </span>
                    </p>
                    <div>
                      <span className="font-medium">Trạng thái: </span>
                      <Badge
                        className={getStatusBadge(selected.status).classes}
                      >
                        {getStatusBadge(selected.status).text}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <DollarSign className="mr-2 h-4 w-4" />
                  Thông tin rút tiền
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p>
                      <span className="font-medium">Số tiền: </span>
                      <span className="text-futa-primary">
                        {formatCurrencyVND(selected.amount)}
                      </span>
                    </p>
                    <p>
                      <span className="font-medium">Ngân hàng: </span>
                      <span className="text-futa-primary">
                        {selected.bankCode}
                      </span>
                    </p>
                  </div>
                  <div>
                    <p>
                      <span className="font-medium">Tài khoản: </span>
                      <span className="text-futa-primary">
                        {selected.accountNumber}
                      </span>
                    </p>
                    <p>
                      <span className="font-medium">Tên người nhận: </span>
                      <span className="text-futa-primary">
                        {selected.receiverName}
                      </span>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            {selected.paymentLink &&
              selected.status === WalletCommandStatus.WAIT_TO_PAY && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center">
                      <QrCode className="mr-2 h-4 w-4" />
                      QR Thanh toán
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-center">
                      <Image
                        src={selected.paymentLink}
                        alt="qr-code"
                        width={200}
                        height={200}
                      />
                    </div>
                  </CardContent>
                </Card>
              )}

            <DialogFooter className="mt-3">
              {selected.status === WalletCommandStatus.WAIT_TO_RESOLVE ? (
                <div className="flex justify-end gap-2">
                  <Button
                    variant="destructive"
                    onClick={() => handleResolve(WalletCommandStatus.REJECTED)}
                  >
                    <XCircle className="mr-2 h-4 w-4" />
                    Từ chối
                  </Button>
                  <Button
                    onClick={() =>
                      handleResolve(WalletCommandStatus.WAIT_TO_PAY)
                    }
                    className="bg-secondary hover:bg-secondary/80 text-white"
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Tiếp nhận
                  </Button>
                </div>
              ) : (
                <Button onClick={onClose}>Đóng</Button>
              )}
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
