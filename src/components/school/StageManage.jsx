import React, { useEffect, useState } from "react";
import axios from "axios";
import Select from "react-select";
import { Button, Checkbox } from "@mui/material";
import SelectReact from "../smallComponents/SelectReact";

const baseUrl = import.meta.env.VITE_API_URL;

function StageManage() {
  const [schoolStages, setSchoolStages] = useState([]);
  const [transitionStages, setTransitionStage] = useState([]);
  // const [transitionStagesList, setTransitionStageList] = useState([]);
  const [stageName, setStageName] = useState("");

  const schoolId = window.location.pathname.split("/")[2];
  const stageId = window.location.pathname.split("/")[4];

  const fetchStages = async () => {
    let url = `${baseUrl}stage/${schoolId}`;
    let data = await axios.get(url);
    console.log("data", data.data);
    const stageList = data.data.filter((item) => {
      if (item.id == stageId) {
        setStageName(item.stageName);
      } else {
        return item;
      }
    });
    console.log("stageList", stageList);
    setSchoolStages(data.data);
    setTransitionStage(stageList);
    // setLoading(false);
    // setSchoolStageDialog(false);
  };

  useEffect(async () => {
    (async () => {
      await fetchStages();
      //   setRefresh(false);
    })();
  }, []);

  const Transition = (item) => {
    console.log("item", item);
    if (transitionStages?.includes(item)) {
      const remainStages = transitionStages.filter(
        (selectedStage) => selectedStage.id !== item.id
      );
      console.log("remainStages", remainStages);
      setTransitionStage(remainStages);
    } else {
      const index = schoolStages.indexOf(item);
      console.log("index", index);
      transitionStages.splice(index, 0, item);
      setTransitionStage([...transitionStages]);
    }
  };

  const submitTransitionStage = async () => {
    // Post the transitionStages for next stage stransition
    // /stage/{stage_id}/subStage
    const transitionStagesList = transitionStages.map((item) => item.stageName);
    const response = await axios.post(`${baseUrl}stage/${stageId}/subStage`, {
      stage_name: stageName,
      school_id: schoolId,
      sub_stages: transitionStagesList,
    });
    console.log("response", response);
  };

  console.log("transitionStages", transitionStages);

  return (
    <div style={{ margin: "0 7% 0 7%" }}>
      <p style={{ fontSize: "21px" }}>
        Please choose the relevant stages that a student can be transitioned to
        from the <span style={{ fontWeight: "bold" }}>{stageName} stage</span>
      </p>
      <div style={{ paddingTop: "3px", display: "flex" }}>
        <div style={{ marginRight: "150px" }}>
          <p style={{ fontSize: "21px", fontWeight: "bold" }}>
            Available Transitions
          </p>
          {schoolStages?.map((item) => (
            <p
              key={item.id}
              style={{ fontSize: "18px", cursor: "pointer" }}
              onClick={() => Transition(item)}
            >
              <Checkbox
                checked={item.id == stageId || transitionStages?.includes(item)}
                disabled={item.id == stageId}
                // onChange={() => Transition(item)}
              />
              {item.stageName}
            </p>
          ))}
          <Button
            variant="contained"
            color="primary"
            onClick={submitTransitionStage}
          >
            Save Transition & Return
          </Button>
        </div>
        <div style={{ width: "21%" }}>
          {/* <Select
            // className="filterSelectGlobal"
            // id="schoolSelect"
            value={stageName}
            //   onChange={changeSchool}
            options={transitionStages.map((item) => ({
              value: item.id,
              label: item.stageName,
            }))}
            // placeholder="Get Student Details By School"
            isClearable={false}
            menuPortalTarget={document.body}
            styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
            // components={animatedComponents}
            closeMenuOnSelect
          /> */}
          <SelectReact
            value={stageName}
            options={transitionStages.map((item) => ({
              value: item.id,
              label: item.stageName,
            }))}
          />
        </div>
      </div>
    </div>
  );
}

export default StageManage;
