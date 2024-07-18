import { format, fromUnixTime } from "date-fns";
/**
 * @param  {} unixTime
 * @returns "Returns readable date in the format June 6th 2022"
 */
export const getReadableDate = (unixTime) => {
  return format(new Date(fromUnixTime(unixTime)), "PPP");
};
