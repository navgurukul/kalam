import React from "react";
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

class PieRechartReport extends React.Component {
  constructor() {
    super();
    this.state = {
      data: null,
    };
  }

  componentDidMount() {
    axios.get(`${baseUrl}${this.props.url}`).then((response) => {
      this.setState({
        data: response.data.data,
      });
    });
  }

  customizeText(arg) {
    return `${arg.valueText} Students (${arg.percentText})`;
  }

  customizeTooltip = (pointInfo) => {
    const { graphData } = this.state.data;
    const studentNames = graphData.find(
      (element) => element.name === pointInfo.argument
    ).studentNames;

    return {
      text: studentNames.map((studentName) => {
        console.log(studentName);
        return `${studentName}<br/>`;
      }),
    };
  };
  render() {
    if (this.state.data) {
      const {
        graphData,
        note,
        noOfStudentsWithMilestone,
        noOfStudentsWithOutMilestone,
      } = this.state.data;
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
                customizeText={this.customizeText}
              >
                <Font size={15} />
                <Connector visible={true} width={0.5} />
              </Label>
            </Series>
            <Tooltip
              enabled={true}
              customizeTooltip={this.customizeTooltip}
            ></Tooltip>
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
  }
}

export default PieRechartReport;
