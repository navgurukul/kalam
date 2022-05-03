// eslint-disable-next-line import/no-cycle

import { allStages, caste } from "./constants";

export const dConvert = (data) => {
  const x = { ...data };
  const getKeyByValue = (object, value) =>
    Object.keys(object).find((key) => object[key] === value);
  try {
    x.number = x.contacts[0].mobile;
  } catch (e) {
    x.number = null;
  }

  x.gender =
    x.gender === 1 ? "Female" : x.gender === 2 ? "Male" : "Transgender";
  x.stage = allStages[x.stage];
  x.marks = x.enrolmentKey[x.enrolmentKey.length - 1]
    ? parseInt(x.enrolmentKey[x.enrolmentKey.length - 1].total_marks, 10)
    : null;
  x.marks = isNaN(x.marks) ? null : x.marks;
  x.lastUpdated = x.lastTransition ? x.lastTransition.created_at : null;
  x.age = x.dob ? new Date().getFullYear() - +x.dob.slice(0, 4) : "NA";
  x.studentOwner = x.feedbacks ? x.feedbacks.to_assign : x.to_assign;
  x.caste = caste ? getKeyByValue(caste, x.caste) : caste;
  return x;
};

export const dataSetup = (data, totalData, loggedInUser) => {
  if (data.length > 0) {
    // for (let i = 0; i < data.length; i++) {
    //   data[i] = StudentService.dConvert(data[i]);
    // }
    const newData = data.map((v) => ({
      ...dConvert(v),
      loggedInUser,
    }));
    return { data: newData, totalData };
  }
  return { data: [], totalData: 0 };
};

export const dummy = () => {};

export const parseJwt = (token) => {
  try {
    return JSON.parse(window.atob(token.split(".")[1]));
  } catch (e) {
    return null;
  }
};

export const encryptText = (
  plainText = "" //convert to hex
) =>
  plainText
    .split("")
    .map((el, inx) => Number(plainText.charCodeAt(inx)).toString(16))
    .join("");

export const decryptText = (
  cipherText = "" // convert back to ascii
) =>
  !cipherText || cipherText.length === 0
    ? ""
    : cipherText
        .toString("")
        .match(/.{1,2}/g)
        .map((el) => String.fromCharCode(parseInt(el, 16)))
        .join("");
