// eslint-disable-next-line import/no-cycle
import { dConvert } from "../services/StudentService";

export const dataSetup = (data, totalData, loggedInUser) => {
  if (data.length > 0) {
    // for (let i = 0; i < data.length; i++) {
    //   data[i] = StudentService.dConvert(data[i]);
    // }
    const newData = data.map((v) => ({
      ...dConvert(v),
      loggedInUser: loggedInUser.email.split("@")[0],
    }));
    return { data: newData, totalData };
  }
  return { data: [], totalData: 0 };
};

export const dummy = () => {};

export const encryptText = (
  plainText //convert to hex
) =>
  plainText
    .split("")
    .map((el, inx) => Number(plainText.charCodeAt(inx)).toString(16))
    .join("");

export const decryptText = (
  cipherText // convert back to ascii
) =>
  cipherText
    .toString("")
    .match(/.{1,2}/g)
    .map((el) => String.fromCharCode(parseInt(el, 16)))
    .join("");
