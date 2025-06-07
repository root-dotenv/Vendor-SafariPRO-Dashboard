import * as yup from "yup";

/**
 * Validation schema for creating or updating a service.
 * Used by react-hook-form to validate form inputs.
 */
export const serviceSchema = yup.object().shape({
  name: yup.string().required("Service name is required."),
  description: yup.string().required("Description is required."),
  amendment: yup.string().required("Amendment policy is required."),
  is_active: yup.boolean().required(),
});
