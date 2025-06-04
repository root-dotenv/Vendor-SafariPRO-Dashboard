import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { type RoomType } from "./types";
import styles from "./rooms.module.css";
import { RxEnterFullScreen } from "react-icons/rx";
import { IoBedOutline } from "react-icons/io5";
import { LuUsers } from "react-icons/lu";
import { truncateStr } from "../../utils/truncate";
import { FaCheck } from "react-icons/fa6";
import { MdEdit } from "react-icons/md";

const Rooms = () => {
  const [selectedRoom, setSelectedRoom] = useState<RoomType | null>(null);
  console.log(`SELECTED ROOM :`, selectedRoom);
  const {
    data: roomsTypes,
    error,
    isError,
    isLoading,
  } = useQuery({
    queryKey: ["hotels"],
    queryFn: async () => {
      const response = await axios.get(
        "https://hotel.tradesync.software/api/v1/room-types/"
      );
      console.log(
        `TradeSync API Hotel Types Data Response`,
        response.data.results
      );
      return response.data.results;
    },
  });

  useEffect(() => {
    if (roomsTypes && roomsTypes.length > 0) {
      setSelectedRoom(roomsTypes[0]);
    }
  }, [roomsTypes]);

  console.log(`- - - Debugging`);
  console.log("hotelTypes (data from query):", roomsTypes);
  console.log("error object:", error);
  console.log("isError status:", isError);
  console.log("isLoading status:", isLoading);

  if (isLoading) {
    return (
      <div className="w-screen min-h-screen flex items-center justify-center">
        Loading Animation Goes Here
      </div>
    );
  }

  if (isError) {
    return <div>Error loading rooms: {error?.message || "Unknown error"}</div>;
  }

  const hotelTypes: RoomType[] = roomsTypes || [];

  return (
    <div className={`px-[1rem] py-[1rem] gap-x-[1rem] flex`}>
      {/* - - - Hotel Types */}
      <div className="">
        {/* Filters and Search */}
        <div className="">Filters and Search Goes Here</div>
        {/*  - - - - -  */}
        {/* - - - Rooms Types Cards */}
        <ul className="flex flex-col gap-y-[1rem]">
          {hotelTypes.map((ht) => (
            <li
              className={`${styles.typeCard} grid grid-cols-12 px-[1.5rem] py-[1rem] gap-x-[1.5rem] border-[1px] border-[#EFEFEF] shadow-sm  cursor-pointer transition-[500ms]`}
              key={ht.id}
              onClick={() => setSelectedRoom(ht)}
            >
              {/* - - - Hotel Type Image (LeftSide) */}
              <div className={`col-span-3 flex items-center`}>
                {
                  <img
                    className="w-full p-0 block object-cover rounded"
                    src={ht.image}
                    alt={"custom room type image attribute"}
                  />
                }
              </div>
              {/* - - - Hotel Type Details (RightSide) */}
              <div className={`col-span-9 flex flex-col gap-y-[0.5rem]`}>
                {/* - - -  */}
                <div className="w-full flex items-center justify-between">
                  <span className={`font-semibold text-[1.5rem] capitalize`}>
                    {ht.name}
                  </span>

                  <span
                    className={` ${
                      ht.is_active ? "bg-[#D5F5E6]" : "bg-[#E4F593]"
                    } text-black px-[0.75rem] py-[0.375rem] font-semibold text-[0.75rem] capitalize rounded-[0.625rem]`}
                  >
                    {ht.is_active ? "Available" : "Occupied"}
                  </span>
                </div>
                {/* - - -  */}
                <div className={`flex items-center gap-x-4`}>
                  <span className="flex items-center gap-x-2 text-[0.875rem] font-semibold">
                    <RxEnterFullScreen size={20} color="#535B75" />{" "}
                    {ht.size_sqm || "35 sqm"}
                  </span>
                  <span className="flex items-center gap-x-2 text-[0.875rem] font-semibold">
                    <IoBedOutline size={20} color="#535B75" /> {ht.bed_type}
                  </span>
                  <span className="flex items-center gap-x-2 text-[0.875rem] font-semibold">
                    <LuUsers size={20} color="#535B75" /> {ht.max_occupancy}{" "}
                    Guests
                  </span>
                </div>
                {/* - - -  */}
                <p className="text-[1rem] font-medium truncate-[20ch]">
                  {truncateStr(ht.description, 25)}
                </p>
                {/* - - - */}
                <div className="w-full flex items-center justify-between">
                  <span className="text-[#535B75] font-medium">
                    Availability:{" "}
                    <span className="text-black text-[1rem] font-bold">
                      BR/{ht.room_availability} Rooms
                    </span>
                  </span>
                  <span className="text-black text-[1.5rem] font-semibold">
                    ${ht.base_price}
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

      {/* - - - Hotel Type Details Modal */}
      <div className="bg-[#FFF] rounded-md w-full min-h-screen h-[90vh] sticky top-[110px] overflow-y-scroll shadow-sm p-6">
        {selectedRoom ? (
          <div className="space-y-6">
            {/* - - - Header with name and edit button */}
            <div className="flex justify-between items-center">
              <h2 className="text-[1.75rem] font-bold capitalize">
                {selectedRoom.name}
              </h2>

              {/* - - - Edit Room Type Button */}
              <button className="gap-[6px] bg-[#E4F593] text-black px-4 py-[6px] rounded-md cursor-pointer hover:bg-[#ccdb80] transition text-[0.875rem] flex items-cente">
                <MdEdit size={17} color="#000" /> Edit
              </button>
            </div>

            {/* - - - Status badge */}
            <div
              className={`inline-block ${
                selectedRoom.is_active ? "bg-[#D5F5E6]" : "bg-[#E4F593]"
              } text-black px-3 py-1 font-semibold text-sm capitalize rounded-md`}
            >
              {selectedRoom.is_active ? "Available" : "Occupied"}
            </div>

            {/* - - - Main image */}
            <div className="w-full h-64 rounded-lg overflow-hidden">
              <img
                src={selectedRoom.image}
                alt={selectedRoom.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* - - - Basic info grid */}
            <div className="grid grid-cols-3 gap-4">
              <div className="flex items-center gap-2">
                <RxEnterFullScreen size={20} color="#535B75" />
                <span>{selectedRoom.size_sqm || "N/A"} sqm</span>
              </div>
              <div className="flex items-center gap-2">
                <IoBedOutline size={20} color="#535B75" />
                <span>{selectedRoom.bed_type}</span>
              </div>
              <div className="flex items-center gap-2">
                <LuUsers size={20} color="#535B75" />
                <span>Max {selectedRoom.max_occupancy} Guests</span>
              </div>
            </div>

            {/* - - - Price and availability */}
            <div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg">
              <div>
                <span className="text-gray-600">Availability: </span>
                <span className="font-bold">
                  {selectedRoom.room_availability} Rooms
                </span>
              </div>
              <div className="text-right">
                <span className="text-2xl font-bold">
                  ${selectedRoom.base_price}
                </span>
                <span className="text-gray-600 ml-1">/night</span>
              </div>
            </div>

            {/* - - - Full description */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <p className="text-gray-700">{selectedRoom.description}</p>
            </div>

            {/* - - - Features */}
            <div className="w-full ">
              <h3 className=" text-lg font-semibold mb-2">Features</h3>
              <ul className="w-full grid grid-cols-12 space-x-2">
                {selectedRoom.features.map((feature, index) => (
                  <li
                    key={index}
                    className="col-span-6 flex items-center gap-3"
                  >
                    <span className="bg-[#D5F5E6] rounded-full p-[6px]">
                      <FaCheck size={14} color="#42745c" />
                    </span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* - - - Amenities */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Amenities</h3>
              <ul className="w-full grid grid-cols-12 space-x-2">
                {selectedRoom.amenities.map((amenity, index) => (
                  <li
                    key={index}
                    className="col-span-6 flex items-center gap-2"
                  >
                    <span className="bg-[#D5F5E6] rounded-full p-[6px]">
                      <FaCheck size={14} color="#42745c" />
                    </span>
                    <span>{amenity}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center">
            <div className="text-center text-gray-500">
              <p>No room types available</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Rooms;
