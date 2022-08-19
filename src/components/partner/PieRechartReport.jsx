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
import Container from "@mui/material/Container";
import { Typography, Box } from "@mui/material";
import Loader from "../ui/Loader";

const baseUrl = import.meta.env.VITE_API_URL;

const PieRechartReport = (props) => {
  const { url } = props;
  const [data, setData] = React.useState(null);

  useEffect(() => {
    axios.get(`${baseUrl}${url}`).then((response) => {
      setData(response.data.data);
    });
  }, []);

  const customizeText = (arg) =>
    `${arg.valueText} Students (${arg.percentText})`;

  const customizeTooltip = (pointInfo) => {
    const { graphData } = data;

    const { studentNames } = graphData.find(
      (element) => element.name === pointInfo.argument
    );

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
          <Export enabled />
          <Series argumentField="name" valueField="value">
            <Label visible position="columns" customizeText={customizeText}>
              <Font size={15} />
              <Connector visible width={0.5} />
            </Label>
          </Series>
          <Tooltip enabled customizeTooltip={customizeTooltip} />
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
