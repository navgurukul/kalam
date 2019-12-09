import React from 'react';
import * as Stages from '../data/stages.json'
import Moment from 'react-moment';
import Tooltip from '@material-ui/core/Tooltip';
import Box from '@material-ui/core/Box';
import StageSelect from '../components/StageSelect';
import OwnerSelect from '../components/OwnerSelect';
import StatusSelect from '../components/StatusSelect'
import StudentFeedback from '../components/FeedbackPage';
import UpdateFeedback from '../components/UpdateFeedback';
import Select from 'react-select';

const allStagesOptions = Object.keys(Stages.data).map(x => { return {value: x, label : x in Stages.data ? Stages.data[x].title : x }} );
const allStatusOptions = Object.keys(Stages.status).map(x => { return {value: x, label : x in Stages.status ? Stages.status[x].title : x }} );
const nameColumn = {
  title: 'Set',
  field: 'SetName',
  selectFilter: true,
  sfMulti: true,
  sfTitle: 'set',
};

const titleColumn = { title: 'Name', field: 'name', filtering: false };

const cityColumn = {
  title: 'City',
  field: 'city',
  selectFilter: true,
  sfMulti: true,
  sfTitle: 'cities'
};

const stateColumn = {
  title: 'State',
  field: 'state'
}

const numberColumn = {
  title: 'Number', field: 'number',
  render: rowData => {
    return '+91 ' + rowData.number;
  },
}

const marksColumn = {
  title: 'Marks',
  field: 'marks',
  render: rowData => {
    return rowData.marks;
  },
  filtering: false,
}

const genderColumn = {
  title: 'Gender',
  field: 'gender',
  selectFilter: true,
  sfMulti: false,
  sfTitle: 'gender',
  // render: rowData => {
  //   return rowData.gender == 1 ? 'Female' : 'Male';
  // },
  filtering: false
}

const stagePartnerColumn = {
  title: 'Stage',
  field: 'stageTitle',
  selectFilter: true,
  sfMulti: true,
  filtering: false,
  sfTitle: 'stages',
  render: rowData => {
    return <Tooltip title={rowData.stageDesc}>
      <Box data-id={rowData.stage}>
        {rowData.stageTitle}
      </Box>
    </Tooltip>
  }
}

const stageColumn = {
  title: 'Stage',
  field: 'stageTitle',
  selectFilter: true,
  sfMulti: true,
  filtering: false,
  sfTitle: 'stages',
  render: rowData => {
    const selectedValue = {"value": rowData.stage, "label": rowData.stageTitle};
    return <StageSelect
      allStagesOptions={allStagesOptions}
      studentId= {rowData['id']}
      rowData={rowData}
    />
    
    // return <Tooltip title={rowData.stageDesc}>
    //   <Box data-id={rowData.stage}>
    //     {rowData.stageTitle}
    //   </Box>
    // </Tooltip>
  }
}

const addedAtColumn = {
  title: 'Added At',
  field: 'createdAt',
  render: rowData => {
    return <Moment format="D MMM YYYY" withTitle>{rowData.createdAt}</Moment>
  },
  filtering: false
}

const lastUpdatedColumn = {
  title: 'Last Updated',
  field: 'lastUpdated',
  render: rowData => {
    return <Moment format="D MMM YYYY" withTitle>{rowData.lastUpdated}</Moment>
  },
  filtering: false
}

const stageColumnTransition = {
  title: 'Stage',
  field: 'toStage',
  render: rowData => {
    return rowData['toStage'] in Stages.data ? Stages.data[rowData['toStage']].title : rowData['toStage'];
  }
}

const whenColumnTransition = {
  title: 'When?',
  field: 'createdAt',
  render: rowData => {
    return <Moment format="D MMM YYYY" withTitle>{rowData.createdAt}</Moment>
  },
  defaultSort: 'desc'
}

const descriptionColumnTransition = {
  title: 'Description',
  render: rowData => {
    return rowData['toStage'] in Stages.data && 'description' in Stages.data[rowData['toStage']] ? Stages.data[rowData['toStage']].description : "No Description Added Yet.";
  }
}

const feedbackColumnTransition = {
  title: 'Feedback',
  field: 'feedback',
  render: rowData => {
    return <div>
      {rowData['feedback'] && rowData['feedback']['feedback'] ? <div><UpdateFeedback rowData={rowData} student_stage={rowData['toStage']} studentId={rowData['feedback'].studentId} userId={rowData['loggedInUser'].id} user={'@' + rowData['loggedInUser'].user_name.toString().split(" ").join('').toLowerCase()} feedback={rowData['feedback']['feedback']} />{rowData['feedback']['feedback']}</div> : null}
      {rowData['toStage'] in Stages.feedbackable && (!rowData['feedback'] || !rowData['feedback']['feedback'] ) ? <StudentFeedback rowData={rowData} user={'@' + rowData['loggedInUser'].user_name.toString().split(" ").join('').toLowerCase()} stage={rowData['toStage']} studentId={rowData['studentId']} userId={rowData['loggedInUser'].id} /> : null}
    </div>
  }
}

const ownerColumnTransition = {
  title: 'Owner',
  field: 'user',
  render: rowData => {
    return rowData['feedback'] || rowData['toStage'] in Stages.feedbackable ? <div>
        <OwnerSelect rowData={rowData} />
        </div>: null;
  }
}

const timeColumnTransition = {
  title: 'Time',
  field: 'createdAt',
  render: rowData => {
    return rowData['feedback'] ? <Moment format="D MMM YYYY" withTitle>{rowData['feedback'].createdAt}</Moment> : null;
  },
  defaultSort: 'desc'
}

const statusColumnTransition = {
  title: 'Status',
  field: 'status',
  render: rowData => {
    if (rowData['feedback']){
      const state = rowData['feedback']['state'];
      rowData['statusTitle'] = state in Stages.status ? Stages.status[state].title : state;
    }
    return rowData['feedback'] ? <div>
      <StatusSelect
      allStatusOptions={allStatusOptions}
      studentId={rowData['feedback'].studentId}
      rowData={rowData}
    />
    </div> : null;
  }
}


const StudentService = {
  columns: {
    requestCallback: [
      numberColumn,
      addedAtColumn,
      lastUpdatedColumn,
    ],
    partnerDashboard: [
      nameColumn,
      titleColumn,
      cityColumn,
      stateColumn,
      numberColumn,
      marksColumn,
      genderColumn,
      stagePartnerColumn,
      addedAtColumn,
      lastUpdatedColumn
    ],
    softwareCourse: [
      nameColumn,
      titleColumn,
      cityColumn,
      stateColumn,
      numberColumn,
      marksColumn,
      genderColumn,
      stageColumn,
      addedAtColumn,
      lastUpdatedColumn,
    ]
  },

  columnTransitions: {
    requestCallback: [
      stageColumnTransition,
      whenColumnTransition,
      descriptionColumnTransition,
      feedbackColumnTransition,
      ownerColumnTransition,
      timeColumnTransition,
      statusColumnTransition
    ],
    partnerDashboard: [
      stageColumnTransition,
      whenColumnTransition,
      descriptionColumnTransition
    ],
    softwareCourse: [
      stageColumnTransition,
      whenColumnTransition,
      descriptionColumnTransition,
      feedbackColumnTransition,
      ownerColumnTransition,
      timeColumnTransition,
      statusColumnTransition
    ]
  },

  setupPre: (columns) => {
    return columns.map((x) => {
      if ('selectFilter' in x)
        x.options = []
      return x
    })
  },

  setupPost: (columns) => {
    return columns.map((x) => {
      if ('selectFilter' in x)
        x.options = x.options.map((x) => {
          return { label: x, value: x }
        })
      return x
    })
  },
  
  dConvert: (x) => {
    try {
      x['number'] = x['contacts'][0]['mobile'];
    } catch (e) {
      x['number'] = null;
    }

    x['gender'] = x['gender'] == 1 ? 'Female' : 'Male';
    x['stageTitle'] = x['stage'] in Stages.data ? Stages.data[x['stage']].title : x['stage'];
    x['stageDesc'] = x['stage'] in Stages.data && 'description' in Stages.data[x['stage']] ? Stages.data[x['stage']].description : "No Description Added Yet."

    x.marks = x.enrolmentKey[0] ? parseInt(x.enrolmentKey[0].totalMarks, 10) : null;
    x.marks = isNaN(x.marks) ? null : x.marks;

    let transitions = x['transitions'];
    let latestTS = transitions.length ? transitions[0].createdAt : null;

    if (transitions.length > 1) {
      for (let i = 1; i < transitions.length; i++) {
        latestTS = transitions[i]['createdAt'] > latestTS ? transitions[i]['createdAt'] : latestTS
      }
    }

    x['lastUpdated'] = latestTS;

    return x
  },
  addOptions: (columns, dataRow) => {
    return columns.map((column) => {
      if ('selectFilter' in column) {
        if (column.options.indexOf(dataRow[column.field]) == -1) {
          column.options.push(dataRow[column.field])
        }
      }
      return column
    })
  }
}

export default StudentService;