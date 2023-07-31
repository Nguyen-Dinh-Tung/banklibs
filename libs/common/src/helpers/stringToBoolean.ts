export enum BoolenText {
  false = 'fasle',
  true = 'true',
}
export const stringToBoolean = (text: string) => {
  const transformObj = {
    false: false,
    true: true,
  };
  return transformObj[text];
};
