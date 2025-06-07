/**
 * Represents a single hotel service or add-on.
 */
export interface Service {
  id: string;
  name: string;
  description: string;
  amendment: string;
  is_active: boolean;
}
