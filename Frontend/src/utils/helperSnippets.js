import { formatDistanceToNow } from "date-fns";

export const ModalCenteringstyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export function hasEmptyValue(userDataWithoutPasswords) {
  for (let key in userDataWithoutPasswords) {
    if (
      userDataWithoutPasswords.hasOwnProperty(key) &&
      userDataWithoutPasswords[key] === ""
    ) {
      return true;
    }
  }
  return false;
}

export function formatDate(dateInput) {
  // 1. Handle empty/undefined values
  if (!dateInput) return "";

  let date;

  // 2. Parse different input types
  if (dateInput instanceof Date) {
    date = dateInput; // Already a Date object
  } else if (typeof dateInput === "number") {
    date = new Date(dateInput); // Timestamp
  } else if (typeof dateInput === "string") {
    // Try ISO format (YYYY-MM-DD)
    if (/^\d{4}-\d{2}-\d{2}/.test(dateInput)) {
      const [year, month, day] = dateInput.split("-");
      return `${month}-${day}-${year}`;
    }
    // Try DD/MM/YYYY format
    else if (/^\d{2}\/\d{2}\/\d{4}/.test(dateInput)) {
      const [day, month, year] = dateInput.split("/");
      return `${month}-${day}-${year}`;
    }
    // Fallback to Date parsing
    date = new Date(dateInput);
  } else {
    console.warn("Unsupported date format:", dateInput);
    return "Invalid Date";
  }

  // 3. Format to MM-DD-YYYY
  if (!isNaN(date)) {
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const year = date.getFullYear();
    return `${month}-${day}-${year}`;
  }

  return "Invalid Date";
}

export function getCurrentDate(type) {
  const currentDate = new Date();

  const day = currentDate.getDate();
  const month = currentDate.getMonth() + 1;
  const year = currentDate.getFullYear();

  const formattedDay = day < 10 ? "0" + day : day;
  const formattedMonth = month < 10 ? "0" + month : month;

  const formattedDate =
    type === "slash"
      ? `${formattedDay}/${formattedMonth}/${year}`
      : type === "dash"
      ? `${year}-${formattedMonth}-${formattedDay}`
      : `${formattedDay}/${formattedMonth}/${year}`;

  return formattedDate;
}

export function getType(t) {
  let type = t.toLowerCase();
  switch (type) {
    case "home":
      return "home_quotes";
      break;
    case "auto":
      return "auto_quotes";
      break;
    case "liability":
      return "liability_quotes";
      break;
    case "flood":
      return "flood_quotes";
      break;
    default:
      break;
  }
}

export function formatKey(key) {
  let formattedKey = key.replace(/_/g, " ");
  let words = formattedKey.split(" ");
  words = words.map(
    (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  );
  return words.join(" ");
}

export function formatTimeSince(date) {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
}

export function areKeysFilled(arr) {
  return arr.every((item) => {
    return Object.values(item).every((value) => value !== "");
  });
}
