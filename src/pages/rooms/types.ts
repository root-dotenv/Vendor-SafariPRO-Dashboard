/**
 * @interface Image
 * @description Represents a single image for a room type.
 */
export interface Image {
  src: string;
  alt: string;
}

/**
 * @interface Facilities
 * @description Defines the boolean flags for various in-room facilities.
 */
export interface Facilities {
  wifi: boolean;
  safeLock: boolean;
  TV: boolean;
  AC: boolean;
  MiniFridge: boolean;
  CoffeeMaker: boolean;
}

/**
 * @interface RoomType
 * @description Defines the structure for a single hotel room type.
 */
export interface RoomType {
  id: "deluxe" | "standard" | "luxury" | "suite" | "family-room";
  area: string;
  bedType: string;
  guestCapacity: number;
  price: string;
  availability: number;
  description: string;
  features: string[];
  facilities: Facilities;
  images: Image[];
  amenities: string[];
}

/**
 * @interface DB
 * @description Represents the root structure of your db.json file.
 */
export interface DB {
  "room-types": RoomType[];
}
