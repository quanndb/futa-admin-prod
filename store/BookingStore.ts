import { BookingRequest } from "@/services/API/bookingAPI";
import { create } from "zustand";

const initialState: BookingRequest = {
  departureTrip: {
    tripDetailsId: "",
    departureDate: "",
    seats: [],
    departureId: "",
    destinationId: "",
  },
  returnTrip: null,
  fullName: "",
  email: "",
  phone: "",
};

export type BookingState = {
  booking: BookingRequest;
  setUserInfo: (userInfo: {
    fullName: string;
    email: string;
    phone: string;
  }) => void;
  // departure trip
  setDepartureTrip: (tripDetailsId: string, departureDate: string) => void;
  setDepartureOrigin: (departureId: string) => void;
  setDepartureDestination: (destinationId: string) => void;
  setDepartureSeat: (seatNumber: string) => void;
  getSelectedSeats: () => string[];
  // return trip
  setReturnTrip: (tripDetailsId: string, departureDate: string) => void;
  setReturnOrigin: (departureId: string) => void;
  setReturnDestination: (destinationId: string) => void;
  setReturnSeat: (seatNumber: string) => void;
  getReturnSelectedSeats: () => string[];
  reset: () => void;
};

export const useBooking = create<BookingState>((set, get) => ({
  booking: initialState,
  setUserInfo: ({ fullName, email, phone }) =>
    set((state) => ({
      booking: { ...state.booking, fullName, email, phone },
    })),
  // departure trip
  setDepartureTrip: (tripDetailsId, departureDate) =>
    set((state) => ({
      booking: {
        ...state.booking,
        departureTrip: {
          ...state.booking.departureTrip,
          tripDetailsId,
          departureDate,
        },
      },
    })),
  setDepartureOrigin: (departureId) =>
    set((state) => ({
      booking: {
        ...state.booking,
        departureTrip: { ...state.booking.departureTrip, departureId },
      },
    })),
  setDepartureDestination: (destinationId) =>
    set((state) => ({
      booking: {
        ...state.booking,
        departureTrip: { ...state.booking.departureTrip, destinationId },
      },
    })),
  setDepartureSeat: (seatNumber) =>
    set((state) => {
      const currentSeats = state.booking.departureTrip.seats;
      const isSelected = currentSeats.includes(seatNumber);
      if (isSelected) {
        return {
          booking: {
            ...state.booking,
            departureTrip: {
              ...state.booking.departureTrip,
              seats: currentSeats.filter((seat) => seat !== seatNumber),
            },
          },
        };
      }
      if (currentSeats.length < 5) {
        return {
          booking: {
            ...state.booking,
            departureTrip: {
              ...state.booking.departureTrip,
              seats: [...currentSeats, seatNumber],
            },
          },
        };
      }
      return {};
    }),
  getSelectedSeats: () => get().booking.departureTrip.seats,
  // return trip
  setReturnTrip: (tripDetailsId, departureDate) =>
    set((state) => ({
      booking: {
        ...state.booking,
        returnTrip: {
          ...(state.booking.returnTrip ?? {
            seats: [],
            departureId: "",
            destinationId: "",
          }),
          tripDetailsId,
          departureDate,
        },
      },
    })),
  setReturnOrigin: (departureId) =>
    set((state) => {
      const prevReturnTrip = state.booking.returnTrip ?? {
        tripDetailsId: "",
        departureDate: "",
        seats: [],
        departureId: "",
        destinationId: "",
      };

      return {
        booking: {
          ...state.booking,
          returnTrip: {
            ...prevReturnTrip,
            departureId,
          },
        },
      };
    }),

  setReturnDestination: (destinationId) =>
    set((state) => {
      const prevReturnTrip = state.booking.returnTrip ?? {
        tripDetailsId: "",
        departureDate: "",
        seats: [],
        departureId: "",
        destinationId: "",
      };

      return {
        booking: {
          ...state.booking,
          returnTrip: {
            ...prevReturnTrip,
            destinationId,
          },
        },
      };
    }),

  setReturnSeat: (seatNumber) =>
    set((state) => {
      const prevReturnTrip = state.booking.returnTrip ?? {
        tripDetailsId: "",
        departureDate: "",
        seats: [],
        departureId: "",
        destinationId: "",
      };
      const currentSeats = prevReturnTrip.seats;
      const isSelected = currentSeats.includes(seatNumber);
      if (isSelected) {
        return {
          booking: {
            ...state.booking,
            returnTrip: {
              ...prevReturnTrip,
              seats: currentSeats.filter((seat) => seat !== seatNumber),
            },
          },
        };
      }
      if (currentSeats.length < 5) {
        return {
          booking: {
            ...state.booking,
            returnTrip: {
              ...prevReturnTrip,
              seats: [...currentSeats, seatNumber],
            },
          },
        };
      }
      return {};
    }),
  getReturnSelectedSeats: () => get().booking.returnTrip?.seats ?? [],
  // reset
  reset: () =>
    set(() => ({
      booking: { ...initialState },
    })),
}));
