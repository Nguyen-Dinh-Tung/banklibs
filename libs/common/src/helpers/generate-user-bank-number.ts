export function generateRandomString(length: number) {
  const string = '1234567890';

  let bankNumber = '';

  for (let i = 0; i < length; i++) {
    bankNumber += string[Math.floor(Math.random() * string.length)];
  }

  return bankNumber;
}
