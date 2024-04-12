import React, { useEffect, useState } from "react";
import axios from "axios";
import Select from "react-select";
import { Button, Checkbox } from "@mui/material";
import { useSnackbar } from "notistack";

const baseUrl = import.meta.env.VITE_API_URL;

function StageManage() {
  const { enqueueSnackbar } = useSnackbar();
  const [schoolStages, setSchoolStages] = useState([]);
  const [transitionStages, setTransitionStage] = useState([]);
  const [stageName, setStageName] = useState("");

  const schoolId = window.location.pathname.split("/")[2];
  const stageId = window.location.pathname.split("/")[4];

  const fetchStages = async () => {
    let url = `${baseUrl}stage/${schoolId}`;
    let data = await axios.get(url);
    const list = data.data.map((item) => ({
      value: item.id,
      label: item.stageName,
    }));
    const stageList = list.filter((item) => {
      if (item.value == stageId) {
        setStageName(item.label);
      } else {
        return item;
      }
    });
    setSchoolStages(list);
    setTransitionStage(stageList);
  };

  const selectedStage = { value: "invalid", label: stageName };

  useEffect(async () => {
    (async () => {
      await fetchStages();
    })();
  }, []);

  const Transition = (item) => {
    if (transitionStages?.includes(item)) {
      const remainStages = transitionStages.filter(
        (selectedStage) => selectedStage.value !== item.value
      );
      setTransitionStage(remainStages);
    } else {
      const index = schoolStages.indexOf(item);
      transitionStages.splice(index, 0, item);
      setTransitionStage([...transitionStages]);
    }
  };

  const submitTransitionStage = async () => {
    // Post the transitionStages for next stage stransition
    try {
      const transitionStagesList = transitionStages.map((item) => item.label);
      const response = await axios.post(`${baseUrl}stage/${stageId}/subStage`, {
        stage_name: stageName,
        school_id: schoolId,
        sub_stages: transitionStagesList,
      });
      enqueueSnackbar(`Added sub stages for Transition Successfully`, {
        variant: "success",
      });
    } catch (e) {
      console.error(e);
      enqueueSnackbar("Error in adding sub stages for Transition", {
        variant: "error",
      });
    }
  };

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
              key={item.value}
              style={{ fontSize: "18px", cursor: "pointer" }}
              onClick={() => Transition(item)}
            >
              <Checkbox
                checked={
                  item.value == stageId || transitionStages?.includes(item)
                }
                disabled={item.value == stageId}
              />
              {item.label}
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
          <p style={{ fontSize: "21px", fontWeight: "bold" }}>Preview</p>
          <Select value={selectedStage} options={transitionStages} />
        </div>
      </div>
    </div>
  );
}

export default StageManage;
