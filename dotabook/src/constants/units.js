const toRem = px => `${px / 16}rem`;

const padding = toRem(10);
const paddingSmall = toRem(5);
const margin = toRem(25);
const marginIcon = toRem(10);

export default {
  margin,
  padding,
  marginIcon,
  paddingSmall,
};
