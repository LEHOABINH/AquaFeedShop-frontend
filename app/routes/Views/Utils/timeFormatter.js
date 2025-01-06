import moment from "moment";

const getFormattedTime = (time) => {
  const now = moment();
  const messageTime = moment.utc(time).local();

  if (now.diff(messageTime, "days") < 1) {
    return messageTime.fromNow();
  }

  return messageTime.format("HH:mm DD/MM/YY");
};

export default getFormattedTime;
