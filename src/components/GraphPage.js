import React, { useEffect } from "react";
import PieChart, {
  Legend,
  Export,
  Series,
  Label,
  Font,
  Connector,
  Tooltip,
} from "devextreme-react/pie-chart";

import axios from "axios";
import Container from "@material-ui/core/Container";
import { Box } from "@material-ui/core";
import Loader from "./Loader";
import { allStages } from "../config/index";

const baseUrl = process.env.API_URL;

const GraphPage = () => {
  const [state, setState] = React.useState({
    data: null,
    partnerId: window.location.pathname.split("/")[2],
  });

  useEffect(() => {
    axios
      .get(`${baseUrl}partners/graph/progress_made/${state.partnerId}`)
      .then((response) => {
        const mappedData = response.data.map((item) => {
          return {
            name: allStages[item.name],
            value: item.value,
            studentNames: item.studentNames,
            percentage: item.percentage,
          };
        });

        setState({
          ...state,
          data: mappedData,
        });
      });
  }, []);

  const customizeText = (arg) => {
    //console.log(arg, "arg");
    return `${arg.valueText} ${arg.argument} (${(arg.percent * 100).toFixed(
      2
    )}%)`;
  };

  const customizeTooltip = (pointInfo) => {
    const graphData = state.data;
    const studentNames = graphData.find(
      (element) => element.name === pointInfo.argument
    ).studentNames;

    return {
      text: studentNames.sort().map((studentName) => {
        return ` ${studentName}`;
      }),
    };
  };

  if (state.data) {
    const graphData = state.data;
    const note = "Progress Made Graph";

    return (
      <Container
        // minWidth="lg"
        style={{
          height: "800px",
        }}
      >
        <PieChart
          resolveLabelOverlapping="shift"
          id="pie"
          type="doughnut"
          palette="Bright"
          dataSource={graphData}
          title={note}
          style={{
            height: "750px",
            // margin: "100x 0px",
          }}
        >
          <Legend
            orientation="horizontal"
            itemTextPosition="right"
            horizontalAlignment="center"
            verticalAlignment="bottom"
            columnCount={4}
            style={
              {
                // marginBottom: "100px",
              }
            }
          >
            <Font size={16} />
          </Legend>
          <Export enabled={true} />
          <Series argumentField="name" valueField="value">
            <Label
              visible={true}
              position="columns"
              customizeText={customizeText}
            >
              <Font size={15} />
              <Connector visible={true} width={0.5} />
            </Label>
          </Series>
          <Tooltip enabled={true} customizeTooltip={customizeTooltip}></Tooltip>
        </PieChart>
      </Container>
    );
  }

  return (
    <Box m={2} pt={3}>
      <Loader />
    </Box>
  );
};

export default GraphPage;
