import { getRandomItem } from "./util/randomiser";
import * as Messages from "./messages";

const MAX_MORNING_HOUR = 12;
const MIN_MORNING_HOUR = 0;
const MIN_AFTERNOON_HOUR = 12;
const MAX_AFTERNOON_HOUR = 17;

export const getGreeting = () => {
  var date = new Date();
  var hour = date.getHours();
  if (isMorning(hour)) {
    return getRandomMessage(Messages.morningGreeting);
  } else if (isAfternoon(hour)) {
    return getRandomMessage(Messages.afternoonGreeting);
  } else {
    return getRandomMessage(Messages.eveningGreeting);
  }
};

const getRandomMessage = (messages) => {
  return getRandomItem(messages);
};

const isMorning = (hour) => {
  return hour >= MIN_MORNING_HOUR && hour < MAX_MORNING_HOUR;
};

const isAfternoon = (hour) => {
  return hour >= MIN_AFTERNOON_HOUR && hour < MAX_AFTERNOON_HOUR;
};
