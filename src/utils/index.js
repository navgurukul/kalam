// eslint-disable-next-line import/no-cycle

import { allStages, caste } from "./constants";

export const dConvert = (data, isCampus) => {
  const x = { ...data };

  // **************************Need to see**************************************************
  let isProgrammingSchool = true;
  let customStage;
  if (x.school) {
    isProgrammingSchool = x.school[0].id === 1;
    // let customStage;
    if (!isProgrammingSchool) {
      if (!x.student_school_stage) {
        customStage = x.stage;
      } else {
        customStage = {
          value: x.student_school_stage?.id,
          label: x.student_school_stage?.stageName,
        };
      }
    }
  }

  // ****************************************************************************

  const getKeyByValue = (object, value) =>
    Object.keys(object).find((key) => object[key] === value);
  try {
    x.number = x.contacts[0].mobile;
  } catch (e) {
    x.number = null;
  }

  x.altNumber = x.contacts[0]?.alt_mobile || "";
  x.gender =
    x.gender === 1 ? "Female" : x.gender === 2 ? "Male" : "Transgender";

  // *****************************Need to see***********************************************
  // x.stage = isCampus
  //   ? { ...x.stage, stage: allStages[x.stage.stage] }
  //   : isProgrammingSchool && customStage;
  // : allStages[x.stage];

  x.stage = isCampus
    ? { ...x.stage, stage: allStages[x.stage.stage] }
    : isProgrammingSchool
    ? allStages[x.stage]
    : customStage;

  // x.stage = isCampus
  //   ? { ...x.stage, stage: allStages[x.stage.stage] }
  //   : allStages[x.stage];
  // console.log("allStages", allStages);
  // console.log("x.school", x.school);
  // console.log("x", x);
  // console.log("allStages[x.stage]", allStages[x.stage]);
  // console.log("allStages[x.stage.stage]", allStages[x.stage.stage]);
  // console.log("x.stage", x.stage);
  // console.log("isCampus", isCampus);
  // console.log("customStage", customStage);
  // console.log("isProgrammingSchool", isProgrammingSchool);
  // ****************************************************************************

  x.marks = x.enrolmentKey.length
    ? parseInt(x.enrolmentKey[0].total_marks, 10)
    : // ?  { marks:parseInt(x.enrolmentKey[0].total_marks, 10),id:x.enrolmentKey[0]}
      null;
  // x.enrolmentKey = x.enrolmentKey.length ? x.enrolmentKey[0].key : null;
  // x.marks = isNaN(x.marks) ? "N/A" : x.marks;
  x.marks = isNaN(x.marks)
    ? { marks: "N/A", id: x.enrolmentKey }
    : { marks: x.marks, id: x.enrolmentKey };
  // x.marks = isNaN(x.marks) ? "N/A" : x.marks;
  x.lastUpdated = x.lastTransition ? x.lastTransition.created_at : null;
  x.age = x.dob ? new Date().getFullYear() - +x.dob.slice(0, 4) : "NA";
  x.studentOwner = x.feedbacks ? x.feedbacks.to_assign : x.to_assign;
  x.caste = caste ? getKeyByValue(caste, x.caste) : caste;
  return x;
};

// export const dConvert = (data, isCampus) => {
//   const x = { ...data };
//   const getKeyByValue = (object, value) =>
//     Object.keys(object).find((key) => object[key] === value);
//   try {
//     x.number = x.contacts[0].mobile;
//   } catch (e) {
//     x.number = null;
//   }

//   x.altNumber = x.contacts[0]?.alt_mobile || "";
//   x.gender =
//     x.gender === 1 ? "Female" : x.gender === 2 ? "Male" : "Transgender";
//   x.stage = isCampus
//     ? { ...x.stage, stage: allStages[x.stage.stage] }
//     : allStages[x.stage];
//   x.marks = x.enrolmentKey.length
//     ? parseInt(x.enrolmentKey[0].total_marks, 10)
//     : // ?  { marks:parseInt(x.enrolmentKey[0].total_marks, 10),id:x.enrolmentKey[0]}
//       null;
//   // x.enrolmentKey = x.enrolmentKey.length ? x.enrolmentKey[0].key : null;
//   // x.marks = isNaN(x.marks) ? "N/A" : x.marks;
//   x.marks = isNaN(x.marks)
//     ? { marks: "N/A", id: x.enrolmentKey }
//     : { marks: x.marks, id: x.enrolmentKey };
//   // x.marks = isNaN(x.marks) ? "N/A" : x.marks;
//   x.lastUpdated = x.lastTransition ? x.lastTransition.created_at : null;
//   x.age = x.dob ? new Date().getFullYear() - +x.dob.slice(0, 4) : "NA";
//   x.studentOwner = x.feedbacks ? x.feedbacks.to_assign : x.to_assign;
//   x.caste = caste ? getKeyByValue(caste, x.caste) : caste;
//   return x;
// };

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

export const getColumnIndex = (columnList, columnName) =>
  columnList.findIndex((columnItem) => columnItem.name === columnName);

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

export const toTitleCase = (str) =>
  `${str.charAt(0).toUpperCase()}${str.substr(1)}`;
