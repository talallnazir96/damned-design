export const isBillingInvalid = (billing) => {
  if (!billing) return "No billing address provided";
  if (!billing.first_name) return "No first name provided for billing";
  if (!billing.last_name) return "No last name provided for billing";
  if (!billing.address_1) return "No address provided for billing";
  if (!billing.city) return "No city provided for billing";
  if (!billing.state) return "No state provided";
  if (!billing.zipcode) return "No country provided for billing";
  if (!billing.email) return "No email provided for billing";
  if (!billing.phone) return "No phone provided for billing";
  return false;
}

export const isShippingInvalid = (shipping) => {
  if (!shipping) return "No shipping address provided";
  if (!shipping.first_name) return "No first name provided for shipping";
  if (!shipping.last_name) return "No last name provided for shipping";
  if (!shipping.address_1) return "No address provided for shipping";
  if (!shipping.city) return "No city provided for shipping";
  if (!shipping.state) return "No state provided";
  if (!shipping.zipcode) return "No postcode provided for shipping";
  if (!shipping.country) return "No country provided for shipping";
  return false;
}