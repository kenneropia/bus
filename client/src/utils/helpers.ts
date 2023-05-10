export const destinations = [
  "Al-Hikmah - Post Office",
  "Al-Hikmah - Airport Road",
  "Al-Hikmah - Tipper Garage",
  "Al-Hikmah - Olunlade",
  "Al-Hikmah - Sango",
  "Al-Hikmah - GRA",
];

export const sections = ["morning (9AM)", "afternoon (12Pm)", "evening (4PM)"];

export function getCurrentDate() {
  const now = new Date();
  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2, "0");

  const dateString = `${year}-${month}`;
  return dateString;
}

export function getSectionOfDay() {
  const hour = new Date().getHours();

  if (hour >= 8 && hour < 12) {
    return `Morning at ${hour}`;
  } else if (hour >= 12 && hour < 16) {
    return `Afternoon at ${hour}`;
  } else {
    return `Evening at ${hour}`;
  }
}
