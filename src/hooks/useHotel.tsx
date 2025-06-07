import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import type { Hotel } from "../pages/my-hotel/hotel.types";

export const useHotel = () => {
  return useQuery<Hotel>({
    queryKey: ["hotel"],
    queryFn: async () => {
      const response = await axios.get(
        `https://hotel.tradesync.software/api/v1/hotels/44f1cafe-59f4-43b6-bf01-4a84668e2d29`
      );

      return response.data;
    },
  });
};
