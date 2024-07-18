export const getMonthName = (month) => {
  switch (month) {
    case 0:
      return 'January';
    case 1:
      return 'February';
    case 2:
      return 'March';
    case 3:
      return 'April';
    case 4:
      return 'May';
    case 5:
      return 'June';
    case 6:
      return 'July';
    case 7:
      return 'August';
    case 8:
      return 'September';
    case 9:
      return 'October';
    case 10:
      return 'November';
    case 11:
      return 'December';
    default:
      return 'January';
  }
}

export const formatDate = (date) => {
  const today = new Date();
  if (date.getDate() === today.getDate() && date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear()) {
    return 'Today';
  } else if (date.getDate() === today.getDate() - 1 && date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear()) {
    return 'Yesterday';
  } else if (date.getDate() === today.getDate() + 1 && date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear()) {
    return 'Tomorrow';
  } else if (date.getFullYear() !== today.getFullYear()) {
    return `${date.getFullYear()} ${getMonthName(date.getMonth())} ${date.getDate()}`;
  } else {
    return `${getMonthName(date.getMonth())} ${date.getDate()}`;
  }
}

export const getSezzleDates = () => {
  const day1 = new Date();
  const day2 = new Date(day1.getTime() + (14 * 24 * 60 * 60 * 1000));
  const day3 = new Date(day2.getTime() + (14 * 24 * 60 * 60 * 1000));
  const day4 = new Date(day3.getTime() + (14 * 24 * 60 * 60 * 1000));

  return [day1, day2, day3, day4];
}

export const getSezzleDatesFormated = () => {
  const dates = getSezzleDates();
  return dates.map(date => formatDate(date));
}