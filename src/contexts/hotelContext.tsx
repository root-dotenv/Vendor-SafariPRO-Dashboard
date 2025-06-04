// contexts/HotelContext.tsx
import { createContext, useContext } from "react";
import type { Hotel } from "../pages/my-hotel/hotel.types";

const HotelContext = createContext<Hotel | null>(null);

export const HotelProvider = HotelContext.Provider;

export const useHotelContext = () => {
  const context = useContext(HotelContext);
  if (!context) {
    throw new Error("useHotelContext must be used within a HotelProvider");
  }
  return context;
};
