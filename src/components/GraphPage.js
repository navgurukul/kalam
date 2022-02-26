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
import { allStages } from "../config/index";

const baseUrl = process.env.API_URL;

class GraphPage extends React.Component {
  constructor() {
    super();
    this.state = {
      data: null,
      partnerId: window.location.pathname.split("/")[2],
    };
  }

  componentDidMount() {
    axios
      .get(`${baseUrl}partners/graph/progress_made/${this.state.partnerId}`)
      .then((response) => {
        // const mappedData = response.data.map(
        //   (element) => (element.name = allStages[element.name])
        // );
        // console.log(mappedData, "mapped data");
        const mappedData = response.data.map((item) => {
          return {
            name: allStages[item.name],
            value: item.value,
            studentNames: item.studentNames,
            percentage: item.percentage,
          };
        });

        this.setState({
          data: mappedData,
        });
        //console.log(this.state.data, "data console");
      });
  }

  customizeText(arg) {
    //console.log(arg, "arg");
    return `${arg.valueText} ${arg.argument} (${(arg.percent * 100).toFixed(
      2
    )}%)`;
  }

  customizeTooltip = (pointInfo) => {
    const graphData = this.state.data;
    //console.log(this.state.data, "state data");
    //console.log(pointInfo, "point info");
    //console.log(graphData, "graph data");
    const studentNames = graphData.find(
      (element) => element.name === pointInfo.argument
    ).studentNames;

    return {
      text: studentNames.sort().map((studentName, index) => {
        return ` ${studentName}`;
      }),
    };
  };
  render() {
    if (this.state.data) {
      const graphData = this.state.data;
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

export default GraphPage;
