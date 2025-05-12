import axios from "@/services";
import { StatisticResponse } from "@/types/common";
import { Page, PagingRequest } from "@/types/Paging";

export interface GetBookingsRequest extends PagingRequest {
  code?: string;
  departureDate?: string;
  status?: BookingStatus[];
}

export type BookingRequest = {
  departureTrip: BookingTrip;
  returnTrip: BookingTrip | null;
  fullName: string;
  email: string;
  phone: string;
};

export type BookingTrip = {
  tripDetailsId: string;
  departureDate: string;
  seats: string[];
  departureId: string;
  destinationId: string;
};

export type BookingResponse = {
  code: string;
  status: BookingStatus;
  departureTrip: BookingDetailsType;
  returnTrip?: BookingDetailsType;
  paymentLink?: string;
  departureRoute: string;
  returnRoute?: string;
  departureTime: string;
  returnTime?: string;
  totalPrice: number;
  numOfTickets: number;
  createdAt: string;
};

export type BookingDetailsType = {
  numOfTickets: number;
  busType: string;
  fullName: string;
  email: string;
  phone: string;
  departureDate: string;
  route: string;
  departureId: string;
  departure: string;
  departureAddress: string;
  departureTime: string;
  destinationId: string;
  destination: string;
  destinationAddress: string;
  destinationTime: string;
  pricePerSeat: number;
  tickets: Ticket[];
};

export type Ticket = {
  seatNumber: string;
};

export enum BookingStatus {
  WAIT_TO_PAY = "WAIT_TO_PAY",
  OUT_OF_PAY = "OUT_OF_PAY",
  PAYED = "PAYED",
  RETURNED = "RETURNED",
  FAILED = "FAILED",
}

const bookingAPI = {
  getBookings: (
    params: GetBookingsRequest
  ): Promise<{ data: BookingResponse[]; page: Page }> => {
    const url = "/booking/api/v1/bookings";
    return axios.get(url, { params });
  },

  getMyBooking: (
    params: GetBookingsRequest
  ): Promise<{ data: BookingResponse[]; page: Page }> => {
    const url = "/booking/api/v1/me/bookings";
    return axios.get(url, { params });
  },

  getBookingStatistic: (
    year: string
  ): Promise<{ data: StatisticResponse[] }> => {
    const url = `/booking/api/v1/bookings/statistics${
      year ? "?year=" + year : ""
    }`;
    return axios.get(url);
  },

  getBookingRevenueStatistic: (
    year: string
  ): Promise<{ data: StatisticResponse[] }> => {
    const url = `/booking/api/v1/bookings/revenue-statistics${
      year ? "?year=" + year : ""
    }`;
    return axios.get(url);
  },

  createPaymentLink: (
    code: string,
    isUseWallet: boolean
  ): Promise<{ data: BookingResponse }> => {
    const url =
      "/booking/api/v1/bookings/payment?code=" +
      code +
      "&isUseWallet=" +
      isUseWallet;
    return axios.post(url);
  },

  returnTicket: (code: string) => {
    const url = "/booking/api/v1/bookings/return?code=" + code;
    return axios.post(url);
  },

  getBookingDetails: (code: string): Promise<{ data: BookingResponse }> => {
    const url = "/booking/api/v1/bookings/details?code=" + code;
    return axios.get(url);
  },

  getBookedSeats: (
    detailsId: string,
    startDate: string
  ): Promise<{ data: string[] }> => {
    const url =
      "/booking/api/v1/booking-seats/" +
      detailsId +
      "?departureDate=" +
      startDate;
    return axios.get(url);
  },

  book: (data: BookingRequest): Promise<{ data: BookingResponse }> => {
    const url = "/booking/api/v1/bookings";
    return axios.post(url, data);
  },
  createPayment: (
    code: string,
    isUseWallet: boolean
  ): Promise<{ data: BookingResponse }> => {
    const url =
      "/booking/api/v1/bookings/payment?code=" +
      code +
      "&isUseWallet=" +
      isUseWallet;
    return axios.post(url);
  },
};

export default bookingAPI;
