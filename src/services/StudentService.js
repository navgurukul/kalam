import React from 'react';
import * as Stages from '../data/stages.json'
import Moment from 'react-moment';
import Tooltip from '@material-ui/core/Tooltip';
import Box from '@material-ui/core/Box';
import StudentFeedback from '../components/FeedbackPage';
import UpdateFeedback from '../components/UpdateFeedback';

const StudentService = {
  columns: [
    {
      title: 'Set',
      field: 'setName',
      filtering: false,
      selectFilter: true,
      sfMulti: true,
      sfTitle: 'set',
    },
    { title: 'Name', field: 'name', filtering: false },
    {
      title: 'City',
      field: 'city',
      selectFilter: true,
      sfMulti: true,
      sfTitle: 'cities'
    },
    {
      title: 'State',
      field: 'state'
    },
    {
      title: 'Number', field: 'number',
      render: rowData => {
        return '+91 ' + rowData.number;
      },
      filtering: false
    },
    {
      title: 'Marks',
      field: 'marks',
      render: rowData => {
        return rowData.marks;
      },
      filtering: false,
    },
    {
      title: 'Gender',
      field: 'gender',
      selectFilter: true,
      sfMulti: false,
      sfTitle: 'gender',
      // render: rowData => {
      //   return rowData.gender == 1 ? 'Female' : 'Male';
      // },
      filtering: false
    },
    {
      title: 'Stage',
      field: 'stageTitle',
      selectFilter: true,
      sfMulti: true,
      sfTitle: 'stages',
      render: rowData => {
        return <Tooltip title={rowData.stageDesc}>
          <Box data-id={rowData.stage}>
            {rowData.stageTitle}
          </Box>
        </Tooltip>
      }
    },
    {
      title: 'Added At',
      field: 'createdAt',
      render: rowData => {
        return <Moment format="D MMM YYYY" withTitle>{rowData.createdAt}</Moment>
      },
      filtering: false
    },
    {
      title: 'Last Updated',
      field: 'lastUpdated',
      render: rowData => {
        return <Moment format="D MMM YYYY" withTitle>{rowData.lastUpdated}</Moment>
      },
      filtering: false
    },
    {
      title: 'Feedback',
      field: 'id',
      filtering: false,
      render: rowData => {
        return <StudentFeedback studentId={rowData.id} />
      }
    },
    {
      title: 'Update Feedback',
      field: 'id',
      filtering: false,
      render: rowData => {
        return <UpdateFeedback studentId={rowData.id} />
      }
    },
  ],
  columnsTransitions: [
    {
      title: 'Stage',
      field: 'toStage',
      render: rowData => {
        return rowData['toStage'] in Stages.data ? Stages.data[rowData['toStage']].title : rowData['toStage'];;
      }
    },
    {
      title: 'When?',
      field: 'createdAt',
      render: rowData => {
        return <Moment format="D MMM YYYY" withTitle>{rowData.createdAt}</Moment>
      },
      defaultSort: 'desc'
    },
    {
      title: 'Description',
      render: rowData => {
        return rowData['toStage'] in Stages.data && 'description' in Stages.data[rowData['toStage']] ? Stages.data[rowData['toStage']].description : "No Description Added Yet.";
      }
    }
  ],
  setupPre: (columns) => {
    return columns.map( (x) => {
      if ('selectFilter' in x)
        x.options = []
      return x
    })
  },
  setupPost: (columns) => {
    return columns.map( (x) => {
      if ('selectFilter' in x)
        x.options = x.options.map((x)=> {
          return {label: x, value: x}
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
        if (column.options.indexOf(dataRow[column.field])==-1) {
          column.options.push(dataRow[column.field])
        }
      }
      return column
    })
  }
}

export default StudentService;