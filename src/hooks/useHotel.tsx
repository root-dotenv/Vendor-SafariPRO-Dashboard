import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import type { Hotel } from "../pages/my-hotel/hotel.types";

export const useHotel = () => {
  return useQuery<Hotel>({
    queryKey: ["hotel"],
    queryFn: async () => {
      const response = await axios.get(
        `https://hotel.tradesync.software/api/v1/hotels/10aaa2cb-6ad5-469d-9b0d-1b02326cd6d0/`
      );

      return response.data;
    },
  });
};
