/**
 * @interface RoomType
 * @description Defines the structure for a single hotel room type based on updated backend API.
 */
export interface RoomType {
  id: string;
  name: string;
  code: string;
  description: string;
  image: string;
  size_sqm: string | null | number;
  base_price: string;
  features: string[];
  amenities: string[];
  is_active: boolean;
  max_occupancy: number;
  bed_type: string;
  room_availability: number;
}

/**
 * @interface DB
 * @description Represents the root structure of your db.json file.
 */
export interface DB {
  "room-types": RoomType[];
}
