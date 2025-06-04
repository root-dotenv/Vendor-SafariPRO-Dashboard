import { useHotelContext } from "../../contexts/hotelContext";

export default function HotelServices() {
  const hotel = useHotelContext();
  console.log(`- - - Hotel Services`);
  console.log(hotel);
  return (
    <div>
      <p>Hotel Services</p>
    </div>
  );
}
