import React from 'react';
import { allStages, feedbackableStages, status } from '../config';
import Moment from 'react-moment';
import Box from '@material-ui/core/Box';
import StageSelect from '../components/StageSelect';
import OwnerSelect from '../components/OwnerSelect';
import StatusSelect from '../components/StatusSelect'
import StudentFeedback from '../components/FeedbackPage';
import UpdateFeedback from '../components/UpdateFeedback';

const allStagesOptions = Object.keys(allStages).map(x => { return { value: x, label: allStages[x] } });
const allStatusOptions = Object.keys(status).map(x => { return { value: x, label: status[x] } });

const setColumn = {
  title: 'Set',
  field: 'SetName',
  selectFilter: true,
  sfMulti: true,
  sfTitle: 'set',
};

const nameColumn = {
  title: 'Name',
  field: 'name',
  filtering: true
};

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
    return <Box data-id={rowData.stage}>
        {rowData.stageTitle}
      </Box>
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
    return <StageSelect
      allStagesOptions={allStagesOptions}
      studentId={rowData['id']}
      rowData={rowData}
    />
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
    return allStages[rowData['toStage']];
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

const feedbackColumnTransition = {
  title: 'Feedback',
  field: 'feedback',
  render: rowData => {
    const ifExistingFeedback = rowData.feedback && rowData.feedback.feedback;
    return <div>
      {
         ifExistingFeedback ?
          <div>
            <UpdateFeedback
              rowData={rowData}
              student_stage={rowData['toStage']}
              studentId={rowData['feedback'].studentId}
              userId={rowData['loggedInUser'].id}
              user={'@' + rowData['loggedInUser'].user_name.toString().split(" ").join('').toLowerCase()}
              feedback={rowData['feedback']['feedback']}
            />
            {rowData['feedback']['feedback']}
          </div> 
          : null
      }
      {
        feedbackableStages.indexOf(rowData.toStage)>-1 && !ifExistingFeedback ?
          <StudentFeedback
            rowData={rowData}
            user={'@' + rowData['loggedInUser'].user_name.toString().split(" ").join('').toLowerCase()}
            stage={rowData['toStage']}
            studentId={rowData['studentId']}
            userId={rowData['loggedInUser'].id}
          />
          : null
      }
    </div>
  }
}

const ownerColumnTransition = {
  title: 'Owner',
  field: 'user',
  render: rowData => {
    return rowData['feedback'] || feedbackableStages.indexOf(rowData['toStage'])>-1 ? <div>
      <OwnerSelect rowData={rowData} />
    </div> : null;
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
    if (rowData['feedback']) {
      const state = rowData['feedback']['state'];
      rowData['statusTitle'] = status[state];
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

const StageColumnMyreport = {
  title: 'Stage',
  field: 'student_stage'
}

const feedbackColumnMyreport = {
  title: 'Feedback',
  field: 'feedback'
}

const stausColumnMyreport = {
  title: 'Status',
  field: 'state'
}

const ownerColumnMyreport = {
  title: 'Owner',
  field: 'toAssign'
}

const assignDateColumnMyreport = {
  title: 'AssignDate',
  field: 'createdAt',
  render: rowData => {
    return <Moment format="D MMM YYYY" withTitle>{rowData.createdAt}</Moment>
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
      setColumn,
      nameColumn,
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
      setColumn,
      nameColumn,
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
      feedbackColumnTransition,
      ownerColumnTransition,
      timeColumnTransition,
      statusColumnTransition
    ],
    partnerDashboard: [
      stageColumnTransition,
      whenColumnTransition,
    ],
    softwareCourse: [
      stageColumnTransition,
      whenColumnTransition,
      feedbackColumnTransition,
      ownerColumnTransition,
      timeColumnTransition,
      statusColumnTransition
    ]
  },

  columnMyReports: [
    nameColumn,
    StageColumnMyreport,
    feedbackColumnMyreport,
    stausColumnMyreport,
    ownerColumnMyreport,
    assignDateColumnMyreport
  ],

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
      x.number = x['contacts'][0]['mobile'];
    } catch (e) {
      x.number = null;
    }

    x.gender = x.gender == 1 ? 'Female' : 'Male';
    x.stageTitle = allStages[x.stage];

    x.marks = x.enrolmentKey[0] ? parseInt(x.enrolmentKey[0].totalMarks, 10) : null;
    x.marks = isNaN(x.marks) ? null : x.marks;

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