import React from "react";
import { InputLabel } from "@mui/material";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

import StageSelect from "../components/StageSelect";
import UpdateEmail from "../components/UpdateEmail";
import OwnerSelect from "../components/OwnerSelect";
import StatusSelect from "../components/StatusSelect";
import StudentFeedback from "../components/FeedbackPage";
// eslint-disable-next-line import/no-cycle
import StageTransitions from "../components/StageTransitions";
import StageTransitionsStudentStatus from "../components/StageTransitionsStudentStatus";
import AudioRecorder from "../components/AudioRecording";
import AudiofileUpload from "../components/uploadAudioFile";
import TagsForOnlineClass from "../components/TagsForOnlineClass";

import UpdateCampus from "../components/UpdateCampus";
import UpdateDonor from "../components/UpdateDonor";
import JoinedDate from "../components/JoinedDate";
import DeleteRow from "../components/DeleteRow";
import UpdateStudentName from "../components/UpdateStudentName";
import SelectReact from "../components/SelectReact";
import RedFlag from "../components/FlagModal";

import SurveyForm from "../components/SurveyForm";
import EvaluationSelect from "../components/EvaluationSelect";
import UpdatePartner from "../components/UpdatePartner";
import DeadLineDateUpdate from "../components/DeadlineDateUpdate";
import EndDateUpdate from "../components/EndDateUpdate";

dayjs.extend(customParseFormat);

const _ = require("underscore");
const {
  allStages,
  feedbackableStages,
  feedbackableStagesData,
  permissions,
  donor,
  campus,
  campusStageOfLearning,
  caste,
} = require("../config");

// const baseURL = import.meta.env.VITE_API_URL;

const keysCampusStageOfLearning = Object.keys(campusStageOfLearning);
// const allStagesOptions = Object.keys(allStages).map((x) => {
//   return allStages[x];
// });
// const allTagsOptions = Object.keys(allTagsForOnlineClass).map((x) => {
//   return allTagsForOnlineClass[x];
// });

const user = window.localStorage.user
  ? JSON.parse(window.localStorage.user).email
  : null;

const Lables = {
  fontSize: "15px",
  fontWeight: "500",
  color: "#808080",
  marginBottom: "5px",
};

//column transitions for student dashboard
const ColumnTransitions = {
  name: "id",
  label: "Transitions",
  options: {
    filter: false,
    sort: false,
    customBodyRender: (value, rowMeta) => (
      <StageTransitions
        studentId={value}
        studentName={rowMeta.rowData[2]}
        dataType="columnTransition"
      />
    ),
  },
};

//columns related to student dashboard's transitions
/*
 stageColumnTransition,
      addedAtColumn,
      feedbackColumnTransition,
      ownerColumnTransition,
      statusColumnTransition,
      timeColumnTransition,
      loggedInUser,
      AudioPlayer,
      transitionIdColumn,
      deadlineColumnTrnasition,
      finishedColumnTransition,
*/

const stageColumnTransition = {
  name: "to_stage",
  label: "Stage",
  options: {
    filter: true,
    sort: true,
    customBodyRender: (rowData, rowMeta) => {
      const currentUser = window.localStorage.user
        ? JSON.parse(window.localStorage.user).email
        : null;
      return permissions.updateStage.indexOf(currentUser) > -1 &&
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

const addedAtColumn = {
  name: "created_at",
  label: "When",
  options: {
    filter: false,
    sort: true,
    customBodyRender: (value, rowMeta) => {
      const currentUser = window.localStorage.user
        ? JSON.parse(window.localStorage.user).email
        : null;

      if (typeof rowMeta.rowData[0] === "number") {
        return <p>{dayjs(value).format("D MMM YYYY")}</p>;
      }
      if (
        permissions.updateStage.indexOf(currentUser) > -1 &&
        (rowMeta.rowData[0].indexOf("Joined") > -1 ||
          keysCampusStageOfLearning.indexOf(rowMeta.rowData[0]) > -1)
      ) {
        return <JoinedDate transitionId={rowMeta.rowData[10]} value={value} />;
      }
      return <p>{dayjs(value).format("D MMM YYYY")}</p>;
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
                    .map((item) => <p key={item}> {item} </p>)
                : null}
            </div>
          ) : null}
        </div>
      );
    },
  },
};

const ownerColumnTransitionDashboard = {
  name: "to_assign",
  label: "Owner",
  options: {
    filter: false,
    sort: true,
    display: true,
    customBodyRender: (rowData, rowMeta, updateValue) => {
      //for admissiong dashboard student id is coming at rowMeta.rowData[7]

      const ifExistingFeedback =
        feedbackableStages.indexOf(rowMeta.rowData[0]) > -1;
      const permissionForOwner = permissions.updateStage.indexOf(user) > -1;
      return (
        <div>
          {ifExistingFeedback && permissionForOwner ? (
            <OwnerSelect
              currentValue={rowData}
              rowMetaTable={rowMeta}
              value={rowData}
              studentId={rowMeta.rowData[5]}
              change={(event) => updateValue(event)}
            />
          ) : null}
        </div>
      );
    },
  },
};

const ownerColumnTransitionCampus = {
  name: "to_assign",
  label: "Owner",
  options: {
    filter: false,
    sort: true,
    display: true,
    customBodyRender: (rowData, rowMeta, updateValue) => {
      //for admissiong dashboard student id is coming at rowMeta.rowData[5]

      const ifExistingFeedback =
        feedbackableStages.indexOf(rowMeta.rowData[0]) > -1;
      const permissionForOwner = permissions.updateStage.indexOf(user) > -1;
      return (
        <div>
          {ifExistingFeedback && permissionForOwner ? (
            <OwnerSelect
              currentValue={rowMeta}
              rowMetaTable={rowMeta}
              value={rowData}
              studentId={rowMeta.rowData[7]}
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
      if (rowMeta.rowData[0] === "selectedButNotJoined") {
        return null;
      }
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

const loggedInUserColumn = {
  name: "loggedInUser",
  label: "Logged In User",
  options: {
    filter: false,
    sort: true,
    display: false,
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
      // console.log(value);
      return (
        <div style={{ width: "100%", border: "1px solid black" }}>
          {!ifExistingFeedback && !value ? (
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

const transitionIdColumn = {
  name: "id",
  label: "Transition Id",
  options: {
    viewColumns: false,
    filter: false,
    display: false,
  },
};

const deadlineColumnTrnasition1 = {
  name: "deadline",
  label: "Deadline",
  options: {
    filter: false,
    sort: true,
    customBodyRender: (rowData, rowMeta) => {
      const feedbackableStage = feedbackableStagesData[rowMeta.rowData[0]];
      const ifExistingDeadlineDate =
        rowData && !rowMeta.rowData[7] && feedbackableStage;
      // console.log(rowData)
      if (ifExistingDeadlineDate) {
        const { deadline } = feedbackableStagesData[rowMeta.rowData[0]];
        const diff = new Date().getTime() - new Date(rowData).getTime();
        const hours = Math.floor(diff / 1000 / 60 / 60);
        const remainingTime = deadline - hours;
        if (remainingTime < 0) {
          return "Your deadline is finished please do this work ASAP.";
        }
        if (!rowMeta.rowData[2]) {
          return (
            <p>
              {" "}
              <b>{remainingTime}</b> Hours are remaining.
            </p>
          );
        }
        return <p>{remainingTime}</p>;
      }
    },
  },
};
const deadlineColumnTrnasition = {
  name: "deadline",
  label: "Deadline",
  options: {
    filter: false,
    sort: true,
    customBodyRender: (value, rowData) => (
      <DeadLineDateUpdate value={value} rowData={rowData} />
    ),
  },
};
const finishedColumnTransition = {
  name: "finished_at",
  label: "Finished",
  options: {
    filter: false,
    sort: true,
    customBodyRender: (rowData) => {
      const ifExistingFinishedDate = rowData;
      return ifExistingFinishedDate ? (
        <p>{dayjs(rowData).format("D MMM YYYY")}</p>
      ) : null;
    },
  },
};

//column transitions for campus dashboard
const ColumnTransitionForCampusDashboard = {
  name: "id",
  label: "Transitions",
  options: {
    filter: false,
    sort: false,
    customBodyRender: (value, rowMeta) => (
      <StageTransitions
        studentId={value}
        studentName={rowMeta.rowData[1]}
        dataType="columnTransition2"
      />
    ),
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
    filter: false,
    sort: true,
    filterType: "textField",
    customBodyRender: (rowData, rowMeta, updateValue) => {
      const name = rowData || "Update Name";
      const currentUser = window.localStorage.user
        ? JSON.parse(window.localStorage.user).email
        : null;

      if (permissions.updateStudentName.indexOf(currentUser) > -1) {
        return (
          <UpdateStudentName
            name={name}
            rowMetatable={rowMeta}
            change={(event) => updateValue(event)}
          />
        );
      }
      return rowData;
    },
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

const AltNumberColumn = {
  name: "altNumber",
  label: "Alternative Number",
  options: {
    filter: false,
    sort: true,
    display: false,
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
    sort: true,
    display: false,
  },
};

const dashboardGenderColumn = {
  name: "gender",
  label: "Gender",
  options: {
    filter: true,
    sort: true,
    display: false,
    filterType: "custom",
    filterOptions: {
      display: (filterlist, onChange, index, column) => (
        <div>
          <SelectReact
            options={[
              { value: "All", label: "All" },
              { value: "Male", label: "Male" },
              { value: "Female", label: "Female" },
              { value: "Transgender", label: "Transgender" },
            ]}
            filterList={filterlist}
            onChange={onChange}
            index={index}
            column={column}
            value={
              filterlist[index].length === 0 ? "All" : filterlist[index][0]
            }
          />
        </div>
      ),
    },
  },
};

const genderColumn = {
  name: "gender",
  label: "Gender",
  options: {
    filter: true,
    sort: true,
    display: false,
    filterOptions: { names: ["Male", "Female"] },
  },
};

const dashboardCampusColumn = {
  name: "campus",
  label: "Campus",
  options: {
    filter: true,
    sort: true,
    display: false,
    customBodyRender: (value, rowMeta, updateValue) => {
      const currentUser = window.localStorage.user
        ? JSON.parse(window.localStorage.user).email
        : null;

      if (permissions.updateStage.indexOf(currentUser) > -1) {
        return (
          <UpdateCampus
            allOptions={campus}
            value={value || "No Campus Assigned"}
            rowMetatable={rowMeta}
            change={(event) => updateValue(event)}
          />
        );
      }
      return value;
    },
    filterType: "custom",
    filterOptions: {
      display: (filterlist, onChange, index, column) => (
        <div>
          <InputLabel style={Lables}>Campus</InputLabel>
          <SelectReact
            options={[{ name: "All" }, ...campus].map((x) => ({
              value: x.name,
              label: x.name,
            }))}
            filterList={filterlist}
            onChange={onChange}
            index={index}
            column={column}
            value={filterlist[index].length === 0 ? "All" : filterlist[index]}
          />
        </div>
      ),
    },
  },
};

const campusColumn = {
  name: "campus",
  label: "Campus",
  options: {
    filter: true,
    sort: true,
    display: false,
    filterOptions: { names: campus.map((camp) => camp.name) },
    customBodyRender: (value, rowMeta, updateValue) => {
      if (permissions.updateStage.indexOf(user) > -1) {
        return (
          <UpdateCampus
            allOptions={campus}
            value={value || "No Campus Assigned"}
            rowMetatable={rowMeta}
            change={(event) => updateValue(event)}
          />
        );
      }
      return value;
    },
  },
};
const dashboardDonorColumn = {
  name: "donor",
  label: "Donor",
  options: {
    filter: true,
    sort: true,
    display: false,
    filterType: "custom",
    filterOptions: {
      display: (filterlist, onChange, index, column) => (
        <div>
          <InputLabel style={Lables}>Donor</InputLabel>
          <SelectReact
            options={[{ name: "All" }, ...donor].map((don) => ({
              value: don.name,
              label: don.name,
            }))}
            filterList={filterlist}
            onChange={onChange}
            index={index}
            column={column}
            value={filterlist[index].length === 0 ? "All" : filterlist[index]}
          />
        </div>
      ),
    },
    customBodyRender: (value, rowMeta, updateValue) => {
      if (permissions.updateStage.indexOf(user) > -1) {
        return (
          <UpdateDonor
            allOptions={donor}
            value={value}
            rowMetatable={rowMeta}
            change={(event) => updateValue(event)}
          />
        );
      }
      let newValue = "";
      if (value)
        value.forEach((item) => {
          newValue = `${newValue}   ${item.donor}`;
        });
      else newValue = null;

      return newValue;
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
    filterOptions: { names: donor.map((donorEl) => donorEl.name) },
    customBodyRender: (value, rowMeta, updateValue) => {
      if (permissions.updateStage.indexOf(user) > -1) {
        return (
          <UpdateDonor
            allOptions={donor}
            value={value}
            rowMetatable={rowMeta}
            change={(event) => updateValue(event)}
          />
        );
      }
      let newValue = "";
      if (value)
        value.forEach((item) => {
          newValue = `${newValue}   ${item.donor}`;
        });
      else newValue = null;

      return newValue;
    },
  },
};

const stageColumn = {
  name: "stage",
  label: "Stage",
  options: {
    filter: false,
    display: true,
    sort: true,
    customBodyRender: (value, rowMeta, updateValue) => {
      const currentUser = window.localStorage.user
        ? JSON.parse(window.localStorage.user).email
        : null;

      const isCampusPathname = window.location.pathname.indexOf("campus");
      if (permissions.updateStage.indexOf(currentUser) > -1) {
        return (
          <StageSelect
            rowMetatable={rowMeta}
            stage={value}
            allStages={
              isCampusPathname > -1 ? campusStageOfLearning : allStages
            }
            change={(event) => updateValue(event)}
          />
        );
      }
      return value;
    },
  },
};

const EvaluationColumn = {
  name: "evaluation",
  label: "Evaluation",
  options: {
    filter: false,
    sort: true,
    display: permissions.updateStudentName.indexOf(user) > -1,
    viewColumns: permissions.updateStudentName.indexOf(user) > -1,
    customBodyRender: (value, rowMeta, updateValue) => (
      <EvaluationSelect
        rowMetatable={rowMeta}
        evaluation={value}
        change={(event) => updateValue(event)}
      />
    ),
  },
};

const onlineClassColumn = {
  name: "tag",
  label: "Online Class Tag",
  options: {
    filter: false,
    sort: true,
    display: false,
    customBodyRender: (value, rowMeta, updateValue) => {
      const tag = value ? value.split(", ") : [];
      const allTagsOptions = Object.keys(tag).map((x) => ({
        key: x,
        label: tag[x],
      }));
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

//addedAtColumnCampus
const addedAtColumnCampus = {
  name: "created_at",
  label: "Start Date",
  options: {
    filter: false,
    sort: true,
    customBodyRender: (value, rowMeta) => {
      const currentUser = window.localStorage.user
        ? JSON.parse(window.localStorage.user).email
        : null;

      if (typeof rowMeta.rowData[0] === "number") {
        return <p>{dayjs(value).format("D MMM YYYY")}</p>;
      }
      if (
        permissions.updateStage.indexOf(currentUser) > -1 &&
        (rowMeta.rowData[0].indexOf("Joined") > -1 ||
          keysCampusStageOfLearning.indexOf(rowMeta.rowData[0]) > -1)
      ) {
        return <JoinedDate transitionId={rowMeta.rowData[10]} value={value} />;
      }
      return <p>{dayjs(value).format("D MMM YYYY")}</p>;
    },
  },
};

const lastUpdatedColumn = {
  name: "last_updated",
  label: "Last Updated",
  options: {
    filter: false,
    sort: true,
    customBodyRender: (value) =>
      value ? <p>{dayjs(value).format("D MMM YYYY")}</p> : null,
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
        return <p>{dayjs(value).format("D MMM YYYY")}</p>;
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
        const parseValue = parseInt(value, 10);
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
      if (value) {
        const parseValue = parseInt(value, 10);
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
        const parseValue = parseInt(value, 10);
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
        }
        if (deadline === 60 && remainingTime < 20) {
          return (
            <p style={{ color: "#f9a800", letterSpacing: "1px" }}>
              {" "}
              <b>{remainingTime}</b> Hours remaining.
            </p>
          );
        }
        if (deadline === 48 && remainingTime < 15) {
          return (
            <p style={{ color: "#f9a800", letterSpacing: "1px" }}>
              {" "}
              <b>{remainingTime}</b> Hours remaining.
            </p>
          );
        }
        if (deadline === 24 && remainingTime < 6) {
          return (
            <p style={{ color: "#f9a800", letterSpacing: "1px" }}>
              {" "}
              <b>{remainingTime}</b> Hours remaining.
            </p>
          );
        }
        return (
          <p style={{ color: "green", letterSpacing: "1px" }}>
            {" "}
            <b>{remainingTime}</b> Hours remaining.{" "}
          </p>
        );
      }
      return null;
    },
  },
};

const statusFilterList = [
  "All",
  "needBased",
  "tutionGroup",
  "perfectFit",
  ...feedbackableStagesData.pendingEnglishInterview.status,
].sort();

const dashboardStatusColumn = {
  name: "status",
  label: "Status",
  options: {
    filter: true,
    sort: true,
    // display: true,
    filterType: "custom",
    filterOptions: {
      display: (filterlist, onChange, index, column) => (
        <div>
          <InputLabel style={Lables}>Status</InputLabel>
          <SelectReact
            options={statusFilterList.map((status) => ({
              value: status,
              label: status,
            }))}
            filterList={filterlist}
            onChange={onChange}
            index={index}
            column={column}
            value={filterlist[index].length === 0 ? "All" : filterlist[index]}
          />
        </div>
      ),
    },
    customBodyRender: (state) => {
      if (state) {
        return state.charAt(0).toUpperCase() + state.slice(1);
      }
    },
  },
};

const statusColumn = {
  name: "status",
  label: "Status",
  options: {
    filter: true,
    sort: true,
    display: true,
    filterOptions: {
      names: [
        "needBased",
        "tutionGroup",
        "perfectFit",
        ...feedbackableStagesData.pendingEnglishInterview.status,
      ].sort(),
    },
    customBodyRender: (state) => {
      if (state) {
        return (state.charAt(0).toUpperCase() + state.slice(1))
          .match(/[A-Z][a-z]+|[0-9]+/g)
          .join(" ");
      }
    },
  },
};

const redFlagColumn = {
  label: "Flag",
  name: "redflag",
  options: {
    filter: true,
    display: permissions.updateStudentName.indexOf(user) > -1,
    filterType: "dropdown",
    viewColumns: permissions.updateStudentName.indexOf(user) > -1,

    customBodyRender: (value, rowMeta, updateValue) => (
      <div>
        <RedFlag
          rowMetaTable={rowMeta}
          studentId={rowMeta.rowData[0]}
          comment={value}
          change={(event) => updateValue(event)}
        />
      </div>
    ),
  },
};

//finishedColumnTransitionCampus
const finishedColumnTransitionCampus = {
  name: "finished_at",
  label: "End Date",
  options: {
    filter: false,
    sort: true,
    customBodyRender: (value, rowData) => (
      <EndDateUpdate value={value} rowData={rowData} />
    ),
  },
};

const loggedInUser = {
  name: "loggedInUser",
  label: "LoggedIn User",
  options: {
    filter: false,
    display: false,
    customBodyRender: () => {
      if (localStorage.getItem("user")) {
        const currentUser = JSON.parse(localStorage.getItem("user"))
          ? JSON.parse(localStorage.getItem("user"))
          : {};

        return currentUser.user_name;
      }

      return "guest_username";
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
    customBodyRender: (rowData) =>
      rowData
        ? rowData.split("\n\n").map((item) => <p key={item}> {item} </p>)
        : null,
  },
};

const statusColumnMyreport = {
  label: "Status",
  name: "state",
  options: {
    filter: false,
  },
};

const dashboardOwnerColumnMyreport = {
  label: "Owner",
  name: "studentOwner",
  options: {
    filter: true,
    filterType: "custom",
    filterOptions: {
      display: (filterlist, onChange, index, column) => (
        <div>
          <InputLabel style={Lables}>Owner</InputLabel>
          <SelectReact
            options={["All", ...JSON.parse(localStorage.getItem("owners"))].map(
              (item) => ({
                value: item,
                label: item,
              })
            )}
            filterList={filterlist}
            onChange={onChange}
            index={index}
            column={column}
            value={filterlist[index].length === 0 ? "All" : filterlist[index]}
          />
        </div>
      ),
    },
  },
};
const ownerColumnMyreport = {
  label: "Owner",
  name: "studentOwner",
  options: {
    filter: true,
    filterOptions: { names: JSON.parse(localStorage.getItem("owners")) },
  },
};

const assignDateColumnMyreport = {
  label: "AssignDate",
  name: "created_at",
  options: {
    filter: false,
    customBodyRender: (rowData) => (
      <p format="D MMM YYYY" withTitle>
        {dayjs(rowData).format("D MMM YYYY")}
      </p>
    ),
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
      const emailAddress = rowData || "Update Email";
      return (
        <UpdateEmail
          prevEmail={emailAddress}
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
    customBodyRender: (value) => {
      if (value) {
        return <p>{dayjs(value).format("D MMM YYYY")}</p>;
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
    customBodyRender: (rowData) => allStages[rowData],
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
    customBodyRender: (value) =>
      value ? (
        <a target="_blank" rel="noreferrer noopener" href={value}>
          Link to Test
        </a>
      ) : null,
  },
};

const stageColumnStatus = {
  label: "Current Stage",
  name: "to_stage",
  options: {
    filter: false,
    customBodyRender: (rowData) => allStages[rowData],
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
    customBodyRender: (value) => (
      <StageTransitionsStudentStatus rowData={value} allStages={allStages} />
    ),
  },
};

const dashboardPartnerNameColumn = {
  label: "Partner Name",
  name: "partnerName",
  options: {
    filter: true,
    sort: true,
    filterType: "custom",
    filterOptions: {
      display: (filterlist, onChange, index, column) => (
        <div>
          <InputLabel style={Lables}>Partner</InputLabel>
          <SelectReact
            options={[
              "All",
              ...JSON.parse(localStorage.getItem("partners")),
            ].map((partner) => ({
              value: partner,
              label: partner,
            }))}
            filterList={filterlist}
            onChange={onChange}
            index={index}
            column={column}
            value={filterlist[index].length === 0 ? "All" : filterlist[index]}
          />
        </div>
      ),
    },
    customBodyRender: (value, rowMeta, updateValue) => {
      if (!value && permissions.updateStage.indexOf(user) > -1) {
        return (
          <UpdatePartner
            studentId={rowMeta.rowData[0]}
            value={value}
            change={(event) => updateValue(event)}
          />
        );
      }
      return value;
    },
  },
};

const partnerNameColumn = {
  label: "Partner Name",
  name: "partner.name",
  options: {
    filter: true,
    filterOptions: { names: JSON.parse(localStorage.getItem("partners")) },
    sort: true,
    customBodyRender: (value, rowMeta, updateValue) => {
      const currentUser = window.localStorage.user
        ? JSON.parse(window.localStorage.user).email
        : null;
      if (!value && permissions.updateStage.indexOf(currentUser) > -1) {
        return (
          <UpdatePartner
            studentId={rowMeta.rowData[0]}
            value={value}
            change={(event) => updateValue(event)}
          />
        );
      }
      return value;
    },
  },
};

const navGurukulSurveyForm = {
  label: "Survey Form",
  name: "partnerName",
  options: {
    filter: false,
    sort: true,
    customBodyRender: (value, rowMeta) => {
      const { rowData } = rowMeta;
      return (
        <SurveyForm
          data={{
            studentName: rowData[1],
            studentNumber: rowData[2],
            password: "3FF2hW$(gNhJt6B[6xC{F",
          }}
        />
      );
    },
  },
};

const profileImage = {
  label: "Profile Image",
  name: "image_url",
  options: {
    filter: false,
    sort: false,
    customBodyRender: (value) =>
      value !== null ? (
        <img
          src={value}
          alt="profile"
          style={{
            width: "60px",
            height: "60px",
            borderRadius: "50%",
            objectFit: "cover",
          }}
        />
      ) : (
        <p> </p>
      ),
  },
};

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
      profileImage,
      nameColumn,
      setColumn,
      cityColumn,
      stateColumn,
      numberColumn,
      AltNumberColumn,
      marksColumn,
      EmailColumn,
      dashboardGenderColumn,
      stageColumn,
      addedAtColumn,
      lastUpdatedColumn,
      QualificationColumn,
      ReligionColumn,
      CasteColumn,
      loggedInUserColumn,
      dashboardOwnerColumnMyreport,
      dashboardStatusColumn,
      deadlineColumn,
      dashboardPartnerNameColumn,
      onlineClassColumn,
      ageColumn,
      dashboardCampusColumn,
      dashboardDonorColumn,
    ],
    partnerData: [
      ColumnTransitions,
      nameColumn,
      setColumn,
      cityColumn,
      stateColumn,
      numberColumn,
      AltNumberColumn,
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
      onlineClassColumn,
      ageColumn,
      campusColumn,
      donorColumn,
    ],
    columnTransition: [
      stageColumnTransition,
      addedAtColumn,
      feedbackColumnTransition,
      ownerColumnTransitionDashboard,
      statusColumnTransition,
      timeColumnTransition,
      loggedInUser,
      AudioPlayer,
      transitionIdColumn,
      deadlineColumnTrnasition1,
      finishedColumnTransition,
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
    columnTransition2: [
      stageColumnTransition,
      addedAtColumnCampus,
      finishedColumnTransitionCampus,
      deadlineColumnTrnasition,
      feedbackColumnTransition,
      ownerColumnTransitionCampus,
      statusColumnTransition,
      timeColumnTransition,
      loggedInUser,
      AudioPlayer,
      transitionIdColumn,
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
    ColumnTransitions,
    nameColumn,
    numberColumn,
    AltNumberColumn,
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
  ],
  CampusData: [
    ColumnTransitionForCampusDashboard,
    nameColumn,
    numberColumn,
    AltNumberColumn,
    EmailColumn,
    joinedDate,
    stageColumn,
    JobKabLagegiColumn,
    daysPassedColumn,
    kitneAurDin,
    kitneDinLagenge,
    QualificationColumn,
    partnerNameColumn,
    donorColumn,
    EvaluationColumn,
    redFlagColumn,
    navGurukulSurveyForm,
  ],
  dConvert,
  addOptions: (columns, dataRow) =>
    columns.map((column) => {
      if ("selectFilter" in column) {
        if (column.options.indexOf(dataRow[column.field]) === -1) {
          column.options.push(dataRow[column.field]);
        }
      }
      return column;
    }),
};

export default StudentService;