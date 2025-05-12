"use client";

import TripTransitDialog from "@/app/trips/[id]/transits/transit-points-dialog";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import tripAPI, { TransitType, TripTransit } from "@/services/API/tripAPI";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Clock, GripVertical, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import TimePicker from "react-time-picker";
import { toast } from "react-toastify";

export default function TripTransitsPage() {
  const params = useParams();
  const tripId = params.id as string;

  const [tripTransits, setTripTransits] = useState<TripTransit[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleDeleteTransit = (transitId: string) => {
    setTripTransits((prev) =>
      prev.filter((transit) => transit.id !== transitId)
    );
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    const items = Array.from(tripTransits);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update transit order
    const updatedItems = items.map((item, index) => ({
      ...item,
      transitOrder: index,
    }));

    setTripTransits(updatedItems);
  };

  const handleTimeChange = (transitId: string, time: string) => {
    setTripTransits((prev) =>
      prev.map((transit) => {
        if (transit.id === transitId) {
          return {
            ...transit,
            arrivalTime: time,
          };
        }
        return transit;
      })
    );
  };

  const handleTypeChange = (transitId: string, type: TransitType) => {
    setTripTransits((prev) =>
      prev.map((transit) => {
        if (transit.id === transitId) {
          return {
            ...transit,
            type,
          };
        }
        return transit;
      })
    );
  };

  const handleAddTransitPoint = (tripTransit: TripTransit) => {
    setTripTransits((prev) => [...prev, tripTransit]);
  };

  const handleSave = () => {
    tripAPI.updateTripTransit(tripId, tripTransits).then(() => {
      toast.success("Thành công");
    });
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "PICKUP":
        return <Badge className="bg-green-500">Đón khách</Badge>;
      case "DROP":
        return <Badge className="bg-red-500">Trả khách</Badge>;
      case "BOTH":
        return <Badge className="bg-blue-500">Cả Hai</Badge>;
      default:
        return <Badge className="bg-blue-500">{type}</Badge>;
    }
  };

  const { data: trip } = useQuery({
    queryKey: ["trip", tripId],
    queryFn: () => tripAPI.getById(tripId),
  });

  useEffect(() => {
    if (trip) {
      setTripTransits(trip.data.tripTransits);
    }
  }, [trip?.data?.tripTransits]);

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
              Điểm Trung Chuyển Của Chuyến Đi
            </h1>
          </div>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="mb-2">
                {trip?.data?.name || "Unnamed"}
              </CardTitle>
              <CardDescription>Mã: {trip?.data?.code || "..."}</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Thêm Điểm Trung Chuyển
              </Button>
              <Button onClick={handleSave}>Lưu</Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <h3 className="text-lg font-medium">Lịch Trình Chuyến Đi</h3>
              <p className="text-sm text-muted-foreground">
                Kéo và thả để sắp xếp lại thứ tự điểm trung chuyển.
              </p>
            </div>

            {isLoading ? (
              <div className="text-center py-8 border rounded-md">
                <p className="text-muted-foreground">Đang tải dữ liệu...</p>
              </div>
            ) : trip?.data?.tripTransits.length === 0 ? (
              <div className="text-center py-8 border rounded-md">
                <p className="text-muted-foreground">
                  Chưa có điểm trung chuyển nào được thêm vào chuyến đi này.
                </p>
                <Button
                  className="mt-4"
                  onClick={() => setIsAddDialogOpen(true)}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Thêm Điểm Trung Chuyển
                </Button>
              </div>
            ) : (
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="transitPoints">
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="space-y-2"
                    >
                      {tripTransits.map((transit, index) => (
                        <Draggable
                          key={transit.transitPoint.name}
                          draggableId={transit.transitPoint.name}
                          index={index}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className="flex items-center justify-between p-3 border rounded-md bg-card"
                            >
                              <div className="flex items-center gap-3">
                                <div
                                  {...provided.dragHandleProps}
                                  className="cursor-grab"
                                >
                                  <GripVertical className="h-5 w-5 text-muted-foreground" />
                                </div>
                                <div className="flex flex-col">
                                  <div className="font-medium text-futa-primary">
                                    {transit.transitPoint?.name}
                                  </div>
                                  <div className="text-sm text-muted-foreground">
                                    {transit.transitPoint?.address}
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                  <Clock className="h-4 w-4 text-muted-foreground" />
                                  <TimePicker
                                    value={transit.arrivalTime}
                                    onChange={(time) =>
                                      handleTimeChange(transit.id, time || "")
                                    }
                                    amPmAriaLabel="AM/PM"
                                    disableClock
                                  />
                                </div>
                                {/* <div>{getTypeBadge(transit?.type)}</div> */}
                                <Select
                                  value={transit.type}
                                  onValueChange={(value) =>
                                    handleTypeChange(
                                      transit.id,
                                      value as TransitType
                                    )
                                  }
                                  defaultValue={transit.type}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Loại">
                                      {getTypeBadge(transit?.type)}
                                    </SelectValue>
                                  </SelectTrigger>
                                  <SelectContent>
                                    {/* PICKUP, DROP, BOTH */}
                                    <SelectItem value="PICKUP">
                                      Đón khách
                                    </SelectItem>
                                    <SelectItem value="DROP">
                                      Trả khách
                                    </SelectItem>
                                    <SelectItem value="BOTH">Cả Hai</SelectItem>
                                  </SelectContent>
                                </Select>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() =>
                                    handleDeleteTransit(transit?.id)
                                  }
                                  className="text-destructive"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            )}
          </CardContent>
        </Card>
      </div>
      <TripTransitDialog
        open={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onAddTransitPoint={handleAddTransitPoint}
      />
    </DashboardLayout>
  );
}
