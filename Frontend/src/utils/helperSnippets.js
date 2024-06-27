export const ModalCenteringstyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export function hasEmptyValue(userDataWithoutPasswords) {
  for (let key in userDataWithoutPasswords) {
    if (userDataWithoutPasswords.hasOwnProperty(key) && userDataWithoutPasswords[key] === "") {
      return true;
    }
  }
  return false;
}

export function getCurrentDate(type) {
  const currentDate = new Date();

  const day = currentDate.getDate();
  const month = currentDate.getMonth() + 1;
  const year = currentDate.getFullYear();

  const formattedDay = day < 10 ? '0' + day : day;
  const formattedMonth = month < 10 ? '0' + month : month;

  const formattedDate = type === "slash"
    ? `${formattedDay}/${formattedMonth}/${year}`
    : (type === "dash"
      ? `${year}-${formattedMonth}-${formattedDay}`
      : `${formattedDay}/${formattedMonth}/${year}`
    );

  return formattedDate;
}

export function getType(t) {
  let type = t.toLowerCase()
  switch (type) {
    case "home":
      return "home_quotes"
      break;
    case "auto":
      return "auto_quotes"
      break;
    case "liability":
      return "liability_quotes"
      break;
    case "flood":
      return "flood_quotes"
      break;
    default:
      break;
  }
}