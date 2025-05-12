import axios from "@/services";
import { TransitPoint } from "@/services/API/transitAPI";
import { StatisticResponse } from "@/types/common";
import { Page, PagingRequest } from "@/types/Paging";
import { TripDetails } from "./../../../futa-client/src/services/API/tripAPI";

export type TripFilterRequest = {
  departureId: string;
  destinationId: string;
  departureDate: string;
  "departureTime.fromTime": string;
  "departureTime.toTime": string;
  busType?: BusType[];
  orderBy?: TripOrderBy[];
};

export enum BusType {
  SEAT = "SEAT",
  BED = "BED",
  LIMOUSINE = "LIMOUSINE",
}

export type TypeDetails = {
  id: string;
  type: BusType;
  seatCapacity: number;
  firstFloorSeats: Seat[];
  secondFloorSeats?: Seat[];
};

export type Seat = {
  id: string;
  seatNumber?: string;
  seatOrder: number;
};

export enum TripOrderBy {
  PRICE = "PRICE",
  DEPARTURE_TIME = "DEPARTURE_TIME",
}

export type TripResponse = {
  id: string;
  departureDate: string;
  details: TripDetails;
  tripTransits: TripTransit[];
};

export type DetailsTransit = {
  tripDetailsId: string;
  departureDate: string;
  pricePerSeat: number;
  firstFloorSeats: Seat[];
  secondFloorSeats: Seat[];
  type: BusType;
  departure: string;
  departureTime: string;
  destination: string;
  destinationTime: string;
  transitPoints: TripTransit[];
};

export type TripDetails = {
  id: string;
  fromDate: string;
  toDate: string;
  price: number;
  type: BusType;
  typeDetails: TypeDetails;
  status: TripStatus;
};

export enum TripStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

export type TripTransit = {
  id: string;
  transitPointId: string;
  transitPoint: TransitPoint;
  arrivalTime: string;
  transitOrder: number;
  type: TransitType;
};

export enum TransitType {
  PICKUP = "PICKUP",
  DROP = "DROP",
  BOTH = "BOTH",
}

export interface TripPagingRequest extends PagingRequest {
  codes?: string[];
}

export type TripDTO = {
  id: string;
  code: string;
  name: string;
  description?: string;
  createdAt: string;
};

export type TripDetailsDTO = {
  id: string;
  code: string;
  name: string;
  description?: string;
  createdAt: string;
  tripTransits: TripTransit[];
};

export type TripScheDule = {
  id: string;
  tripId: string;
  fromDate: string;
  toDate: string;
  price: number;
  type: BusType;
  status: TripStatus;
};

const tripAPI = {
  getTrips: (
    params: TripPagingRequest
  ): Promise<{ data: TripDTO[]; page: Page }> => {
    const url = "/trip/api/v1/trips";
    return axios.get(url, { params });
  },

  getTripStatistic: (year?: string): Promise<{ data: StatisticResponse[] }> => {
    const url = `/trip/api/v1/trips/statistics${year ? "?year=" + year : ""}`;
    return axios.get(url);
  },

  getTripDetails: ({
    id,
    departureDate,
  }: {
    id: string;
    departureDate: string;
  }): Promise<{ data: DetailsTransit }> => {
    const url = `/trip/api/v1/detail-transits/${id}?departureDate=${departureDate}`;
    return axios.get(url);
  },

  getById: (id: string): Promise<{ data: TripDetailsDTO }> => {
    const url = `/trip/api/v1/trips/${id}`;
    return axios.get(url);
  },

  getTripSchedules: (
    id: string
  ): Promise<{ data: TripScheDule[]; page: Page }> => {
    const url = `/trip/api/v1/trips/${id}/details`;
    return axios.get(url);
  },

  createTripSchedule: (
    id: string,
    data: TripScheDule
  ): Promise<{ data: TripScheDule }> => {
    const url = `/trip/api/v1/trips/${id}/details`;
    return axios.post(url, data);
  },

  updateTripSchedule: (
    tripId: string,
    scheduleId: string,
    data: TripScheDule
  ): Promise<{ data: TripScheDule }> => {
    const url = `/trip/api/v1/trips/${tripId}/details/${scheduleId}`;
    return axios.post(url, data);
  },

  deleteTripSchedule: (tripId: string, scheduleId: string): Promise<void> => {
    const url = `/trip/api/v1/trips/${tripId}/details/${scheduleId}`;
    return axios.delete(url);
  },

  create: (data: TripDTO): Promise<TripDTO> => {
    const url = "/trip/api/v1/trips";
    return axios.post(url, data);
  },

  update: (id: string, data: TripDTO): Promise<TripDTO> => {
    const url = `/trip/api/v1/trips/${id}`;
    return axios.post(url, data);
  },

  delete: (id: string): Promise<void> => {
    const url = `/trip/api/v1/trips/${id}`;
    return axios.delete(url);
  },

  updateTripTransit: (
    id: string,
    data: TripTransit[]
  ): Promise<TripTransit> => {
    const url = `/trip/api/v1/trips/${id}/transits`;
    return axios.post(url, { transits: data });
  },
};

export default tripAPI;
