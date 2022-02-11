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
        console.log("response.data.data", response.data.data);
        // this.setState(
        //   {
        //     data: response.data.data,
        //   },
        //   () => {
        //     console.log(this.state.data, "datatatata");
        //   }
        // );
      });
  }

  /*
    {
        name: "krithivTester",
        
    }
    */
  customizeText(arg) {
    return `${arg.valueText} ${arg.argument} (${arg.percentText})`;
  }

  customizeTooltip = (pointInfo) => {
    const { graphData } = this.state.data;
    console.log(this.state.data, "state data");

    const studentNames = graphData.find(
      (element) => element.name === pointInfo.argument
    ).studentNames;
    console.log(studentNames, "studentNames");

    return {
      text: studentNames.sort().map((studentName, index) => {
        return ` ${studentName}`;
      }),
    };
  };
  render() {
    const partnerId = window.location.pathname.split("/")[2];
    // const { partnerId } = this.props;
    console.log(partnerId, "partnerId");
    if (this.state.data) {
      const { graphData, note } = this.state.data;

      console.log(graphData, "graphData");

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
              style={{
                marginTop: "500px",
              }}
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
