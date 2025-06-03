import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { type RoomType } from "./types";
import styles from "./rooms.module.css";
import { RxEnterFullScreen } from "react-icons/rx";
import { IoBedOutline } from "react-icons/io5";
import { LuUsers } from "react-icons/lu";
import { truncateStr } from "../../utils/truncate";

const Rooms = () => {
  const { data, error, isError, isLoading } = useQuery<RoomType[], Error>({
    queryKey: ["hotel-types"],
    queryFn: async () => {
      const response = await axios.get("http://localhost:3001/room-types");
      console.log("Axios response data:", response.data);
      return response.data;
    },
  });

  console.log(`- - - Debugging`);
  console.log("hotelTypes (data from query):", data);
  console.log("error object:", error);
  console.log("isError status:", isError);
  console.log("isLoading status:", isLoading);

  if (isLoading) {
    return <div>Loading rooms...</div>;
  }

  if (isError) {
    return <div>Error loading rooms: {error?.message || "Unknown error"}</div>;
  }

  const hotelTypes: RoomType[] = data || [];

  return (
    <div className={`px-[1rem] py-[1rem] gap-x-[1rem] flex`}>
      {/* - - - Hotel Types */}
      <div className="">
        {/* Filters and Search */}
        <div className="">Filters and Search Goes Here</div>
        {/*  - - - - -  */}
        {/* - - - Rooms Types Cards */}
        <ul className="flex flex-col gap-y-[1rem]">
          {hotelTypes.map((ht, i) => (
            <li
              className={`${styles.typeCard} grid grid-cols-12 px-[1.5rem] py-[1rem] gap-x-[1.5rem] border-[2px] border-[#EFEFEF]`}
              key={ht.id}
            >
              {/* - - - Hotel Type Image (LeftSide) */}
              <div className={`col-span-3 flex items-center`}>
                {ht.images && ht.images.length > 0 && (
                  <img
                    className="w-full p-0 block object-cover rounded"
                    src={ht.images[0].src}
                    alt={ht.images[0].alt || "Room Image"}
                  />
                )}
              </div>
              {/* - - - Hotel Type Details (RightSide) */}
              <div className={`col-span-9 flex flex-col gap-y-[0.5rem]`}>
                {/* - - -  */}
                <div className="w-full flex items-center justify-between">
                  <span className={`font-semibold text-[1.5rem] capitalize`}>
                    {ht.id}
                  </span>

                  <span
                    className={` ${
                      i == 2 ? "bg-[#D5F5E6]" : "bg-[#E4F593]"
                    } text-black px-[0.75rem] py-[0.375rem] font-semibold text-[0.75rem] capitalize rounded-[0.625rem]`}
                  >
                    {i == 2 ? "Occupied" : "Available"}
                  </span>
                </div>
                {/* - - -  */}
                <div className={`flex items-center gap-x-4`}>
                  <span className="flex items-center gap-x-2 text-[0.875rem] font-semibold">
                    <RxEnterFullScreen size={20} color="#535B75" /> {ht.area}
                  </span>
                  <span className="flex items-center gap-x-2 text-[0.875rem] font-semibold">
                    <IoBedOutline size={20} color="#535B75" /> {ht.bedType}
                  </span>
                  <span className="flex items-center gap-x-2 text-[0.875rem] font-semibold">
                    <LuUsers size={20} color="#535B75" /> {ht.guestCapacity}{" "}
                    Guests
                  </span>
                </div>
                {/* - - -  */}
                <p className="text-[1rem] font-medium truncate-[20ch]">
                  {truncateStr(ht.description, 23)}
                </p>
                {/* - - - */}
                <div className="w-full flex items-center justify-between">
                  <span className="text-[#535B75] font-medium">
                    Availability:{" "}
                    <span className="text-black text-[1rem] font-bold">
                      BR/{ht.availability} Rooms
                    </span>
                  </span>
                  <span className="text-black text-[1.5rem] font-semibold">
                    {ht.price}
                    <span className="text-[#535B75] text-[1.125rem] font-medium">
                      /night
                    </span>
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
      {/* - - - Hotel Type Description */}
      <div className="bg-yellow-500 w-full min-h-screen h-[90vh]"></div>
    </div>
  );
};

export default Rooms;
