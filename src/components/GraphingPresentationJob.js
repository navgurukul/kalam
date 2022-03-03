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
import { Typography, Box } from "@material-ui/core";
import Loader from "./Loader";

const baseUrl = process.env.API_URL;

const PieRechartReport = (props) => {
  const [data, setData] = React.useState(null);

  useEffect(() => {
    axios.get(`${baseUrl}${props.url}`).then((response) => {
      setData(response.data.data);
    });
  }, []);

  const customizeText = (arg) => {
    return `${arg.valueText} Students (${arg.percentText})`;
  };

  const customizeTooltip = (pointInfo) => {
    const { graphData } = data;
    const studentNames = graphData.find(
      (element) => element.name === pointInfo.argument
    ).studentNames;

    return {
      text: studentNames.sort().map((studentName, index) => {
        if (index % 6 === 0) {
          return ` ${studentName}<br/>`;
        }
        return ` ${studentName}`;
      }),
    };
  };
  if (data) {
    const {
      graphData,
      note,
      noOfStudentsWithMilestone,
      noOfStudentsWithOutMilestone,
    } = data;

    return (
      <Container maxWidth="md">
        <PieChart
          resolveLabelOverlapping="shift"
          id="pie"
          type="doughnut"
          palette="Bright"
          dataSource={graphData}
          title={note}
        >
          <Legend
            orientation="horizontal"
            itemTextPosition="right"
            horizontalAlignment="center"
            verticalAlignment="bottom"
            columnCount={2}
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
        <Typography align="center">
          Number of students with milestone :- {noOfStudentsWithMilestone}
        </Typography>
        <Typography align="center">
          Number of students without milestone:-
          {noOfStudentsWithOutMilestone}
        </Typography>
      </Container>
    );
  }
  return (
    <Box m={2} pt={3}>
      <Loader />
    </Box>
  );
};

export default PieRechartReport;
