import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import type { Hotel } from "../pages/my-hotel/hotel.types";

export const useHotel = () => {
  return useQuery<Hotel>({
    queryKey: ["hotel"],
    queryFn: async () => {
      const response = await axios.get(
        `https://hotel.tradesync.software/api/v1/hotels/19db360e-bf01-4865-93e0-4880a6bd33f0`
      );

      return response.data;
    },
  });
};
