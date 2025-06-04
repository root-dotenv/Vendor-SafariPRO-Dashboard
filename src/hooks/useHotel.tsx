import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import type { Hotel } from "../pages/my-hotel/hotel.types";

export const useHotel = () => {
  return useQuery<Hotel>({
    queryKey: ["hotel"],
    queryFn: async () => {
      const response = await axios.get(
        `https://hotel.tradesync.software/api/v1/hotels/165cb32f-7cbc-48a0-adf5-8380e59226f1/`
      );
      return response.data;
    },
  });
};
