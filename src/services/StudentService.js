import React from "react";
import {
  allStages,
  feedbackableStages,
  feedbackableStagesData,
  permissions,
  allTagsForOnlineClass,
  donor,
  campus,
  campusStageOfLearning,
} from "../config";
import EditableLabel from "react-inline-editing";
import Moment from "react-moment";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import StageSelect from "../components/StageSelect";
import UpdateEmail from "../components/UpdateEmail";
import OwnerSelect from "../components/OwnerSelect";
import StatusSelect from "../components/StatusSelect";
import StudentFeedback from "../components/FeedbackPage";
import StageTransitions from "../components/StageTransitions";
import StageTransitionsStudentStatus from "../components/StageTransitionsStudentStatus";
import AudioRecorder from "../components/audioRecording";
import AudiofileUpload from "../components/ulpoadAudioFile";
import TagsForOnlineClass from "../components/tagsForOnlineClass";
import UpdateCampus from "../components/UpdateCampus";
import UpdateDonor from "../components/UpdateDonor";
import JoinedDate from "../components/JoinedDate";
import DeleteRow from "../components/DeleteRow";
const _ = require("underscore");
const animatedComponents = makeAnimated();

// _handleFocus = (text) => {
//   console.log("Focused with text: " + text);
// };

// _handleFocusOut = (text) => {
//   console.log("Left editor with text: " + text);
// };

const keysCampusStageOfLearning = Object.keys(campusStageOfLearning);
const allStagesOptions = Object.keys(allStages).map((x) => {
  return allStages[x];
});
const allTagsOptions = Object.keys(allTagsForOnlineClass).map((x) => {
  return allTagsForOnlineClass[x];
});

const ColumnTransitions = {
  name: "id",
  label: "Transitions",
  options: {
    filter: false,
    sort: false,
    customBodyRender: (value, rowMeta) => {
      return (
        <StageTransitions
          studentId={value}
          studentName={rowMeta.rowData[2]}
          dataType={"columnTransition"}
        />
      );
    },
  },
};

const setColumn = {
  name: "SetName",
  label: "Set",
  options: {
    filter: false,
    sort: true,
    display: false,
  },
};

const nameColumn = {
  name: "name",
  label: "Name",
  options: {
    filter: true,
    sort: true,
    filterType: "textField",
  },
};

const cityColumn = {
  name: "city",
  label: "City",
  options: {
    filter: false,
    sort: true,
    display: false,
  },
};

const stateColumn = {
  name: "state",
  label: "State",
  options: {
    filter: false,
    sort: true,
    display: false,
  },
};

const numberColumn = {
  name: "number",
  label: "Number",
  options: {
    filter: false,
    sort: true,
  },
};

const marksColumn = {
  name: "marks",
  label: "Marks",
  options: {
    filter: false,
    sort: true,
  },
};

const ageColumn = {
  name: "age",
  label: "Age",
  options: {
    filter: false,
    sort: false,
    display: true,
  },
};

const genderColumn = {
  name: "gender",
  label: "Gender",
  options: {
    filter: true,
    sort: true,
    display: false,
  },
};

const campusColumn = {
  name: "campus",
  label: "Campus",
  options: {
    filter: true,
    sort: true,
    display: false,
    customBodyRender: (value, rowMeta, updateValue) => {
      if (permissions.updateStage.indexOf(rowMeta.rowData[15]) > -1) {
        return (
          <UpdateCampus
            allOptions={campus}
            value={value}
            rowMetatable={rowMeta}
            change={(event) => updateValue(event)}
          />
        );
      } else {
        return value;
      }
    },
  },
};

const donorColumn = {
  name: "donor",
  label: "Donor",
  options: {
    filter: true,
    sort: true,
    display: false,
    customBodyRender: (value, rowMeta, updateValue) => {
      if (permissions.updateStage.indexOf(rowMeta.rowData[15]) > -1) {
        return (
          <UpdateDonor
            allOptions={donor}
            value={value}
            rowMetatable={rowMeta}
            change={(event) => updateValue(event)}
          />
        );
      } else {
        let newValue = "";
        value
          ? value.map((item) => {
              newValue = `${newValue}   ${item.donor}`;
            })
          : (newValue = null);

        return newValue;
      }
    },
  },
};

const stageColumn = {
  name: "stage",
  label: "Stage",
  options: {
    filter: true,
    sort: true,
    filterOptions: allStagesOptions,
    customBodyRender: (value, rowMeta, updateValue) => {
      const user = JSON.parse(window.localStorage.user);
      const isCampusPathname = window.location.pathname.indexOf("campus");
      if (permissions.updateStage.indexOf(user.mail_id) > -1) {
        return (
          <StageSelect
            allStagesOptions={allStagesOptions}
            rowMetatable={rowMeta}
            stage={value}
            allStages={
              isCampusPathname > -1 ? campusStageOfLearning : allStages
            }
            change={(event) => updateValue(event)}
          />
        );
      } else {
        return value;
      }
    },
  },
};

const onlineClassColumn = {
  name: "tag",
  label: "Online Class Tag",
  options: {
    filter: true,
    sort: true,
    display: false,
    customBodyRender: (value, rowMeta, updateValue) => {
      const tag = value ? value.split(", ") : [];
      const allTagsOptions = Object.keys(tag).map((x) => {
        return { key: x, label: tag[x] };
      });
      return (
        <TagsForOnlineClass
          studentId={rowMeta.rowData[0]}
          tag={tag}
          allTags={allTagsOptions}
          rowMetatable={rowMeta}
          change={(event) => updateValue(event)}
        />
      );
    },
  },
};

const addedAtColumn = {
  name: "created_at",
  label: "When?",
  options: {
    filter: false,
    sort: true,
    customBodyRender: (value, rowMeta) => {
      const user = JSON.parse(window.localStorage.user);
      if (typeof rowMeta.rowData[0] === "number") {
        return (
          <Moment format="D MMM YYYY" withTitle>
            {value}
          </Moment>
        );
      } else if (
        permissions.updateStage.indexOf(user.mail_id) > -1 &&
        (rowMeta.rowData[0].indexOf("Joined") > -1 ||
          keysCampusStageOfLearning.indexOf(rowMeta.rowData[0]) > -1)
      ) {
        return <JoinedDate transitionId={rowMeta.rowData[10]} value={value} />;
      }
      return (
        <Moment format="D MMM YYYY" withTitle>
          {value}
        </Moment>
      );
    },
  },
};

const lastUpdatedColumn = {
  name: "lastUpdated",
  label: "Last Updated",
  options: {
    filter: false,
    sort: true,
    customBodyRender: (value) => {
      return (
        <Moment format="D MMM YYYY" withTitle>
          {value}
        </Moment>
      );
    },
  },
};

const loggedInUserColumn = {
  name: "loggedInUser",
  label: "Logged In User",
  options: {
    filter: false,
    sort: true,
    display: false,
  },
};

const JobKabLagegiColumn = {
  name: "jobKabLagega.expectedDate",
  label: "Job Kab Lagegi",
  options: {
    filter: false,
    sort: true,
    customBodyRender: (value) => {
      if (value) {
        return (
          <Moment format="D MMM YYYY" withTitle>
            {value}
          </Moment>
        );
      }
      return value;
    },
  },
};

const daysPassedColumn = {
  name: "jobKabLagega.daysPassedInCampus",
  label: "Days Passed",
  options: {
    filter: false,
    display: false,
    customBodyRender: (value) => {
      if (value) {
        let parseValue = parseInt(value);
        return <p>{parseValue} days</p>;
      }
      return value;
    },
  },
};

const kitneAurDin = {
  name: "jobKabLagega.kitneAurDin",
  label: "kitne Aur Din",
  options: {
    filter: false,
    display: false,
    customBodyRender: (value) => {
      console.log(value, "value");
      if (value) {
        let parseValue = parseInt(value);
        return <p>{parseValue} days</p>;
      }
      return value;
    },
  },
};

const kitneDinLagenge = {
  name: "jobKabLagega.kitneDinLagenge",
  label: "kitne Din Lagenge",
  options: {
    filter: false,
    display: false,
    customBodyRender: (value) => {
      if (value) {
        let parseValue = parseInt(value);
        return <p>{parseValue} days</p>;
      }
      return value;
    },
  },
};

const deadlineColumn = {
  name: "deadline",
  label: "Deadline",
  options: {
    filter: false,
    sort: false,
    display: false,
    customBodyRender: (rowData, rowMeta) => {
      if (rowData) {
        const studentStage = _.invert(allStages)[rowMeta.rowData[8]];
        let deadline;
        if (feedbackableStages.studentStage) {
          deadline = feedbackableStagesData[studentStage].deadline;
        }
        const diff = new Date().getTime() - new Date(rowData).getTime();
        const hours = Math.floor(diff / 1000 / 60 / 60);
        const remainingTime = deadline - hours;
        if (rowMeta.rowData[17]) {
          return null;
        }
        if (remainingTime < 0) {
          return (
            <p style={{ color: "#FF0000	", letterSpacing: "1px" }}>
              {" "}
              Your deadline is <b>finished</b> please do this work ASAP.
            </p>
          );
        } else if (deadline === 60 && remainingTime < 20) {
          return (
            <p style={{ color: "#f9a800", letterSpacing: "1px" }}>
              {" "}
              <b>{remainingTime}</b> Hours remaining.
            </p>
          );
        } else if (deadline === 48 && remainingTime < 15) {
          return (
            <p style={{ color: "#f9a800", letterSpacing: "1px" }}>
              {" "}
              <b>{remainingTime}</b> Hours remaining.
            </p>
          );
        } else if (deadline === 24 && remainingTime < 6) {
          return (
            <p style={{ color: "#f9a800", letterSpacing: "1px" }}>
              {" "}
              <b>{remainingTime}</b> Hours remaining.
            </p>
          );
        } else {
          return (
            <p style={{ color: "green", letterSpacing: "1px" }}>
              {" "}
              <b>{remainingTime}</b> Hours remaining.{" "}
            </p>
          );
        }
      } else {
        return null;
      }
    },
  },
};

const statusColumn = {
  name: "status",
  label: "Status",
  options: {
    filter: false,
    sort: false,
    display: false,
    customBodyRender: (state) => {
      if (state) {
        return (state.charAt(0).toUpperCase() + state.slice(1))
          .match(/[A-Z][a-z]+|[0-9]+/g)
          .join(" ");
      }
    },
  },
};
const stageColumnTransition = {
  name: "to_stage",
  label: "Stage",
  options: {
    filter: true,
    sort: true,
    customBodyRender: (rowData, rowMeta) => {
      const user = JSON.parse(window.localStorage.user);
      return permissions.updateStage.indexOf(user.mail_id) > -1 &&
        keysCampusStageOfLearning.indexOf(rowData) > -1 ? (
        <div>
          <DeleteRow transitionId={rowMeta.rowData[10]} />
          {allStages[rowData]}
        </div>
      ) : (
        allStages[rowData]
      );
    },
  },
};

const feedbackColumnTransition = {
  name: "feedback",
  label: "Feedback",
  options: {
    filter: false,
    sort: true,
    customBodyRender: (rowData, rowMeta, updateValue) => {
      const ifExistingFeedback =
        rowData || feedbackableStages.indexOf(rowMeta.rowData[0]) > -1;
      return (
        <div>
          {ifExistingFeedback ? (
            <div>
              <StudentFeedback
                rowMetaTable={rowMeta}
                feedback={rowData}
                change={(event) => updateValue(event)}
              />
              {rowData
                ? rowData
                    .split("\n\n")
                    .map((item, i) => <p key={i}> {item} </p>)
                : null}
            </div>
          ) : null}
        </div>
      );
    },
  },
};

const ownerColumnTransition = {
  name: "to_assign",
  label: "Owner",
  options: {
    filter: false,
    sort: true,
    display: true,
    customBodyRender: (rowData, rowMeta, updateValue) => {
      const ifExistingFeedback =
        feedbackableStages.indexOf(rowMeta.rowData[0]) > -1;
      return (
        <div>
          {ifExistingFeedback ? (
            <OwnerSelect
              currentValue={"Saquib"}
              rowMetaTable={rowMeta}
              value={rowData}
              change={(event) => updateValue(event)}
            />
          ) : null}
        </div>
      );
    },
  },
};
const statusColumnTransition = {
  name: "state",
  label: "Status",
  options: {
    filter: false,
    sort: true,
    display: true,
    customBodyRender: (rowData, rowMeta, updateValue) => {
      const feedbackableStage =
        feedbackableStages.indexOf(rowMeta.rowData[0]) > -1;
      if ((rowData || rowMeta.rowData[3]) && feedbackableStage) {
        return (
          <div>
            <StatusSelect
              feedbackableStagesData={feedbackableStagesData}
              rowMetaTable={rowMeta}
              state={rowData}
              change={(event) => updateValue(event)}
            />
          </div>
        );
      }
      return null;
    },
  },
};

const timeColumnTransition = {
  name: "student_id",
  label: "Time",
  options: {
    filter: false,
    display: false,
  },
};
const transitionIdColumn = {
  name: "id",
  label: "Transition Id",
  options: {
    viewColumns: false,
    filter: false,
    display: false,
  },
};

const deadlineColumnTrnasition = {
  name: "deadline",
  label: "Deadline",
  options: {
    filter: false,
    sort: true,
    customBodyRender: (rowData, rowMeta, updateValue) => {
      const feedbackableStage = feedbackableStagesData[rowMeta.rowData[0]];
      const ifExistingDeadlineDate =
        rowData && !rowMeta.rowData[7] && feedbackableStage;
      if (ifExistingDeadlineDate) {
        const deadline = feedbackableStagesData[rowMeta.rowData[0]].deadline;
        const diff = new Date().getTime() - new Date(rowData).getTime();
        const hours = Math.floor(diff / 1000 / 60 / 60);
        const remainingTime = deadline - hours;
        if (remainingTime < 0 && !rowMeta.rowData[7]) {
          return "Your deadline is fineshed please do this work ASAP.";
        } else if (!rowMeta.rowData[2]) {
          return (
            <p>
              {" "}
              <b>{remainingTime}</b> Hours are remaining.
            </p>
          );
        }
        return null;
      }
    },
  },
};

const finishedColumnTransition = {
  name: "finished_at",
  label: "Finished",
  options: {
    filter: false,
    sort: true,
    customBodyRender: (rowData, rowMeta, updateValue) => {
      const ifExistingFinishedDate = rowData;
      return ifExistingFinishedDate ? (
        <Moment format="D MMM YYYY" withTitle>
          {rowData}
        </Moment>
      ) : null;
    },
  },
};

const loggedInUser = {
  name: "loggedInUser",
  label: "LoggedIn User",
  options: {
    filter: false,
    display: false,
    customBodyRender: (rowData) => {
      if (rowData !== undefined) {
        return rowData.user_name;
      }
      return "guest_username";
    },
  },
};

const AudioPlayer = {
  name: "audio_recording",
  label: "Audio Recording",
  options: {
    filter: false,
    display: false,
    customBodyRender: (value, rowMeta, updateValue) => {
      const ifExistingFeedback =
        rowMeta.rowData[2] ||
        feedbackableStages.indexOf(rowMeta.rowData[0]) > -1;
      return (
        <div>
          {ifExistingFeedback && value ? (
            <AudioRecorder audioUrl={value} />
          ) : null}
          {ifExistingFeedback && !value ? (
            <AudiofileUpload
              studentId={rowMeta.rowData[5]}
              userId={rowMeta.rowData[8] ? rowMeta.rowData[8].id : "guest_id"}
              student_stage={rowMeta.rowData[0]}
              change={(event) => updateValue(event)}
              columnIndex={rowMeta.columnIndex}
            />
          ) : null}
        </div>
      );
    },
  },
};

const StageColumnMyreport = {
  label: "Stage",
  name: "student_stage",
  options: {
    filter: true,
    sort: true,
  },
};

const feedbackColumnMyreport = {
  label: "Feedback",
  name: "feedback",
  options: {
    filter: false,
    sort: true,
    customBodyRender: (rowData) => {
      return rowData
        ? rowData.split("\n\n").map((item, i) => <p key={i}> {item} </p>)
        : null;
    },
  },
};

const statusColumnMyreport = {
  label: "Status",
  name: "state",
  options: {
    filter: false,
  },
};

const ownerColumnMyreport = {
  label: "Owner",
  name: "studentOwner",
  options: {
    filter: true,
  },
};

const assignDateColumnMyreport = {
  label: "AssignDate",
  name: "created_at",
  options: {
    filter: false,
    customBodyRender: (rowData) => {
      return (
        <Moment format="D MMM YYYY" withTitle>
          {rowData}
        </Moment>
      );
    },
  },
};

const StageColumnDanglingReport = {
  label: "Stage",
  name: "stage",
};

const TotalFemaleDanglingReport = {
  label: "Female",
  name: "female",
  options: {
    filter: false,
  },
};

const TotalmaleDanglingReport = {
  label: "Male",
  name: "male",
  options: {
    filter: false,
  },
};

const TotalTransDanglingReport = {
  label: "Transgender",
  name: "transgender",
  options: {
    filter: false,
  },
};

const TotalUnspecifiedDanglingReport = {
  label: "Unspecified",
  name: "unspecified",
  options: {
    filter: false,
  },
};

const TotalDanglingReport = {
  label: "Total Dangling",
  name: "total",
  options: {
    filter: false,
  },
};

const EmailColumn = {
  label: "Email",
  name: "email",
  options: {
    filter: false,
    display: true,
    customBodyRender: (rowData, rowMeta, updateValue) => {
      const emailAddress = rowData ? rowData : "Update Email";
      return (
        <UpdateEmail
          email={emailAddress}
          rowMetatable={rowMeta}
          change={(event) => updateValue(event)}
        />
      );
    },
  },
};

const QualificationColumn = {
  label: "Qualification",
  name: "qualification",
  options: {
    filter: false,
    display: false,
  },
};

const ReligionColumn = {
  label: "Religion",
  name: "religon",
  options: {
    filter: false,
    display: false,
  },
};

const CasteColumn = {
  label: "Caste",
  name: "caste",
  options: {
    filter: false,
    display: false,
  },
};

const joinedDate = {
  label: "Joined Date",
  name: "joinedDate",
  options: {
    filter: false,
    customBodyRender: (value, rowMeta) => {
      if (value) {
        return (
          <Moment format="D MMM YYYY" withTitle>
            {value}
          </Moment>
        );
      }
      return value;
    },
  },
};

const lastStageColumn = {
  label: "Last Stage",
  name: "from_stage",
  options: {
    filter: false,
    customBodyRender: (rowData) => {
      return allStages[rowData];
    },
  },
};

const linkForEnglishTestColumn = {
  label: "English Test Link",
  name: "linkForEnglishTest",
};

const linkForOnlineTestColumn = {
  label: "Online Test Link",
  name: "linkForOnlineTest",
  options: {
    customBodyRender: (value) => {
      return value ? (
        <a target="_blank" href={value}>
          Link to Test
        </a>
      ) : null;
    },
  },
};

const stageColumnStatus = {
  label: "Current Stage",
  name: "to_stage",
  options: {
    filter: false,
    customBodyRender: (rowData) => {
      return allStages[rowData];
    },
  },
};
const cityColumnStatus = {
  label: "City",
  name: "city",
};

const stateColumnStatus = {
  label: "State",
  name: "state",
};

const ColumnTransitionsStatus = {
  name: "transitions",
  label: "Transitions",
  options: {
    filter: false,
    sort: false,
    customBodyRender: (value) => {
      return (
        <StageTransitionsStudentStatus rowData={value} allStages={allStages} />
      );
    },
  },
};

const partnerNameColumn = {
  label: "Partner Name",
  name: "partnerName",
};
const StudentService = {
  columns: {
    requestCallback: [
      ColumnTransitions,
      numberColumn,
      addedAtColumn,
      lastUpdatedColumn,
    ],
    softwareCourse: [
      ColumnTransitions,
      setColumn,
      nameColumn,
      cityColumn,
      stateColumn,
      numberColumn,
      marksColumn,
      EmailColumn,
      genderColumn,
      stageColumn,
      addedAtColumn,
      lastUpdatedColumn,
      QualificationColumn,
      ReligionColumn,
      CasteColumn,
      loggedInUserColumn,
      ownerColumnMyreport,
      statusColumn,
      deadlineColumn,
      partnerNameColumn,
      onlineClassColumn,
      ageColumn,
      campusColumn,
      donorColumn,
    ],
    columnTransition: [
      stageColumnTransition,
      addedAtColumn,
      feedbackColumnTransition,
      ownerColumnTransition,
      statusColumnTransition,
      timeColumnTransition,
      deadlineColumnTrnasition,
      finishedColumnTransition,
      loggedInUser,
      AudioPlayer,
      transitionIdColumn,
    ],
    columnStudentStatus: [
      ColumnTransitionsStatus,
      nameColumn,
      cityColumnStatus,
      stateColumnStatus,
      marksColumn,
      genderColumn,
      stageColumnStatus,
      lastStageColumn,
      linkForEnglishTestColumn,
      linkForOnlineTestColumn,
      campusColumn,
      donorColumn,
    ],
  },
  columnMyReports: [
    nameColumn,
    StageColumnMyreport,
    feedbackColumnMyreport,
    statusColumnMyreport,
    ownerColumnMyreport,
    assignDateColumnMyreport,
  ],

  columnDanglingReports: [
    StageColumnDanglingReport,
    TotalFemaleDanglingReport,
    TotalmaleDanglingReport,
    TotalTransDanglingReport,
    TotalUnspecifiedDanglingReport,
    TotalDanglingReport,
  ],
  DonorData: [
    nameColumn,
    numberColumn,
    EmailColumn,
    genderColumn,
    stageColumn,
    QualificationColumn,
    campusColumn,
  ],
  CampusData: [
    ColumnTransitions,
    numberColumn,
    nameColumn,
    EmailColumn,
    genderColumn,
    joinedDate,
    stageColumn,
    JobKabLagegiColumn,
    daysPassedColumn,
    kitneAurDin,
    kitneDinLagenge,
    QualificationColumn,
    partnerNameColumn,
    campusColumn,
    donorColumn,
  ],

  dConvert: (x) => {
    try {
      x.number = x["contacts"][0]["mobile"];
    } catch (e) {
      x.number = null;
    }

    x.gender = x.gender == 1 ? "Female" : "Male";
    x.stage = allStages[x.stage];
    x.marks = x.enrolmentKey[0]
      ? parseInt(x.enrolmentKey[0].total_marks, 10)
      : null;
    x.marks = isNaN(x.marks) ? null : x.marks;
    x.lastUpdated = x.lastTransition ? x.lastTransition.created_at : null;
    x.age = x.dob ? new Date().getFullYear() - +x.dob.slice(0, 4) : "NA";
    x.studentOwner = x.feedbacks ? x.feedbacks.to_assign : x.to_assign;
    return x;
  },

  addOptions: (columns, dataRow) => {
    return columns.map((column) => {
      if ("selectFilter" in column) {
        if (column.options.indexOf(dataRow[column.field]) == -1) {
          column.options.push(dataRow[column.field]);
        }
      }
      return column;
    });
  },
};

export default StudentService;
