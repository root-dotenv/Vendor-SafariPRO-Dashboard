import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import type { Hotel } from "../pages/my-hotel/hotel.types";

export const useHotel = () => {
  return useQuery<Hotel>({
    queryKey: ["hotel"],
    queryFn: async () => {
      const response = await axios.get(
        `https://hotel.tradesync.software/api/v1/hotels/bf085741-2796-406c-86ef-0216a5bccc8b`
      );

      return response.data;
    },
  });
};
