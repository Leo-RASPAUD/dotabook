const toRem = px => `${px / 16}rem`;

const paddingSmall = toRem(5);
const padding = toRem(10);
const paddingLarge = toRem(25);

const margin = toRem(25);
const marginSmall = toRem(10);
const marginIcon = toRem(10);

const borderRadius = toRem(5);

export default {
  margin,
  padding,
  marginIcon,
  paddingSmall,
  marginSmall,
  paddingLarge,
  borderRadius,
};
