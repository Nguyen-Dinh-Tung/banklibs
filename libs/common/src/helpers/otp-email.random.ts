export const otpEmailRandom = (length: number): string => {
  const alphabetNumber = '1234567890';

  let code = '';

  for (let i = 0; i < length; i++) {
    code += alphabetNumber[Math.floor(Math.random() * alphabetNumber.length)];
  }
  return code;
};
