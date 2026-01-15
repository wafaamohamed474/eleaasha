export const formatTimeToArabic = (time: string): string => {
  if (!time) return "";

  return time
    .replace("AM", "ص")
    .replace("PM", "م")
    .replace("am", "ص")
    .replace("pm", "م");
};

export const convertTo24Hour = (time: string): string => {
  if (!time) return "";

  const normalized = time.trim();

  // Split time and modifier (AM / PM / ص / م)
  const [timePart, modifier] = normalized.split(" ");

  let [hours, minutes] = timePart.split(":").map(Number);

  // Arabic PM (م) or English PM
  if (modifier === "PM" || modifier === "م") {
    if (hours !== 12) hours += 12;
  }

  // Arabic AM (ص) or English AM
  if (modifier === "AM" || modifier === "ص") {
    if (hours === 12) hours = 0;
  }

  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}`;
};
