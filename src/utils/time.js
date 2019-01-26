const secondsToHms = s => {
  const hours = ((s - (s % 3600)) / 3600) % 60;
  const minutes = ((s - (s % 60)) / 60) % 60;
  const seconds = s % 60 < 10 ? `0${s % 60}` : s % 60;
  const hoursDisplay = hours > 0 ? `${hours}:` : '';
  return `${hoursDisplay}${minutes}:${seconds}`;
};

export default {
  secondsToHms,
};
