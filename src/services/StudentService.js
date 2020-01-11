import React from 'react';
import { allStages, feedbackableStages, feedbackableStagesData } from '../config';
import Moment from 'react-moment';
import StageSelect from '../components/StageSelect';
import OwnerSelect from '../components/OwnerSelect';
import StatusSelect from '../components/StatusSelect'
import StudentFeedback from '../components/FeedbackPage';
import StageTransitions from '../components/StageTransitions';

const allStagesOptions = Object.keys(allStages).map(x => { return { value: x, label: allStages[x] } });

const ColumnTransitions = {
    name: "id",
    label: "Transitions",
    options: {
      filter: false,
      sort: false,
      customBodyRender: (value) => {
        return <StageTransitions
          studentId={value}
          dataType={'columnTransition'}
        />
      }
    }
}
  
const setColumn = {
    name: "SetName",
    label: "Set",
    options: {
      filter: false,
      sort: true,
      display: false
    }
  }

const nameColumn = {
    name: "name",
    label: "Name",
    options: {
      filter: false,
      sort: true,
    }
  }
  
const cityColumn = {
    name: "city",
    label: "City",
    options: {
      filter: false,
      sort: true,
      display: false
    }
  }

const stateColumn = {
    name: "state",
    label: "State",
    options: {
      filter: false,
      sort: true,
      display: false
    }
  }
  
const numberColumn = {
    name: "number",
    label: "Number",
    options: {
      filter: false,
      sort: true,
    }
  }
  
const marksColumn = {
    name: "marks",
    label: "Marks",
    options: {
      filter: false,
      sort: true,
    }
  }
  
const genderColumn = {
    name: "gender",
    label: "Gender",
    options: {
      filter: true,
      sort: true,
    }
  }
  
const stageColumn = {
    name: "stage",
    label: "Stage",
    options: {
      filter: true,
      sort: true,
      customBodyRender: (value, rowMeta, updateValue) => {
        return <StageSelect
           allStagesOptions={allStagesOptions}
           rowMetatable={rowMeta}
           stage={value}
           allStages={allStages}
           change={ event => updateValue(event) }
        />
      }
    }
  }
  
const addedAtColumn = {
    name: "createdAt",
    label: "When?",
    options: {
      filter: false,
      sort: true,
      customBodyRender: (value) => {
        return <Moment format="D MMM YYYY" withTitle>{value}</Moment>
      }
    }
  }

const lastUpdatedColumn = {
    name: "lastUpdated",
    label: "Last Updated",
    options: {
      filter: false,
      sort: true,
      customBodyRender: (value) => {
        return <Moment format="D MMM YYYY" withTitle>{value}</Moment>
      }

    }
  }

const stageColumnTransition = {
  name: "toStage",
  label: "Stage",
  options: {
    filter: true,
    sort: true,
    customBodyRender: (rowData) => {
      return allStages[rowData];
    }
  }
}

const feedbackColumnTransition = {
  name: "feedback",
  label: "Feedback",
  options: {
    filter: false,
    sort: true,
    customBodyRender: (rowData, rowMeta, updateValue) => {
        const ifExistingFeedback = rowData || feedbackableStages.indexOf(rowMeta.rowData[0]) > -1;
        return <div>
         {
          ifExistingFeedback ?
            <div>
              <StudentFeedback
                rowMetaTable={rowMeta}
                feedback={rowData}
                change={ event => updateValue(event) }
              />
              { rowData ? rowData.split('\n\n').map((item, i) => <p key={i}> {item} </p>): null }
            </div>
            : null
         }
       </div>
    }
  }
}

const ownerColumnTransition = {
  name: "toAssign",
  label: "Owner",
  options: {
    filter: false,
    sort: true,
    display: true,
    customBodyRender: (rowData, rowMeta, updateValue) => {
      const ifExistingFeedback = feedbackableStages.indexOf(rowMeta.rowData[0]) > -1;
      return <div>
        {
          ifExistingFeedback ?
          <OwnerSelect 
            rowMetaTable={rowMeta}
            value={rowData}
            change={ event => updateValue(event) }
          /> : null
        }
      </div>
    }
  }
}
const statusColumnTransition = {
  name: "state",
  label: "Status",
  options: {
    filter: false,
    sort: true,
    display: true,
    customBodyRender: (rowData, rowMeta, updateValue) => {
      if (rowData || rowMeta.rowData[3]) {
        return <div>
          <StatusSelect
            feedbackableStagesData={feedbackableStagesData}
            rowMetaTable={rowMeta}
            state={rowData}
            change={ event => updateValue(event) }
          />
        </div>

      }
      return null;
    }
  }
}

const timeColumnTransition = {
  name: 'studentId',
  lable: 'Time',
  options: {
    filter: false,
    display: false,
  }
}

const deadlineColumnTrnasition = {
  name: "deadline",
  label: "Deadline",
  options: {
    filter: false,
    sort: true,
    customBodyRender: (rowData, rowMeta, updateValue) => {
      const ifExistingDeadlineDate = rowData && !rowMeta.rowData[7];
      if (ifExistingDeadlineDate) {
        const deadline = feedbackableStagesData[rowMeta.rowData[0]].deadline;
        const diff = new Date().getTime() - new Date(rowData).getTime()
        const hours = Math.floor(diff / 1000 / 60 / 60);
        const remainigTime = deadline - hours;
        if (remainigTime < 0 && !rowMeta.rowData[7]) {
          return "Your deadline is fineshed please do this work ASAP."
        } else if (!rowMeta.rowData[2]) {
          return <p> <b>{remainigTime}</b> Hours are remaing to do this work please do it ASAP </p>
        }
        return null;
      }
    }
  }
} 

const finishedColumnTransition = {
  name: "finishedAt",
  label: "Finished",
  options: {
    filter: false,
    sort: true,
    customBodyRender: (rowData, rowMeta, updateValue) => {
      const ifExistingFinishedDate = rowData;
      return ifExistingFinishedDate ? <Moment format="D MMM YYYY" withTitle>{rowData}</Moment> : null;
    },
  }
}
const loggedInUser = {
  name: 'loggedInUser',
  lable: "LoggedIn User",
  options: {
    filter: false,
    display: false,
    customBodyRender: (rowData) => {
      return rowData.user_name
    }
  }
}

const StageColumnMyreport = {
  label: 'Stage',
  name: 'student_stage',
  options: {
    filter: true,
    sort: true,
  }
}

const feedbackColumnMyreport = {
  lable: 'Feedback',
  name: 'feedback',
  options: {
    filter: false,
    sort: true,
    customBodyRender: (rowData) => {
      return rowData ? rowData.split ('\n\n').map((item, i) => <p key={i}> {item} </p>) : null;
    }
  }
}

const stausColumnMyreport = {
  label: 'Status',
  name: 'state',
  options: {
    filter: false,
  }
}

const ownerColumnMyreport = {
  lable: 'Owner',
  name: 'toAssign',
  options: {
    filter: false,
  }
}

const assignDateColumnMyreport = {
  lable: 'AssignDate',
  name: 'createdAt',
  options: {
    filter: false,
    customBodyRender: (rowData) => {
      return <Moment format="D MMM YYYY" withTitle>{rowData}</Moment>
    }
  }
}

const StageColumnDanglingReport = {
  lable: 'Stage',
  name: 'stage'
}

const TotalFemaleDanglingReport = {
  lable: 'Female',
  name: 'female'
}

const TotalmaleDanglingReport = {
  lable: 'Male',
  name: 'male'
}

const TotalTransDanglingReport = {
  lable: 'Transgender',
  name: 'transgender'
}

const TotalUnspecifiedDanglingReport = {
  label: 'Unspecified',
  name: 'unspecified'
}

const TotalDanglingReport = {
  lable: 'Total Dangling',
  name: 'total'
}

const EmailColumn = {
  title: 'Email',
  field: 'email'
}

const QualificationColumn = {
  title: 'Qualification',
  field: 'qualification'
}

const ReligonColumn = {
  title: 'Religon',
  field: 'religon'
}

const CasteColumn = {
  title: 'Caste',
  field: 'caste'
}

const StudentService = {
  columns: {
    requestCallback: [
      ColumnTransitions,
      numberColumn,
      addedAtColumn,
      lastUpdatedColumn,
    ],
    softwareCourse: [
      ColumnTransitions,
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
    ],
    columnTransition: [
      stageColumnTransition,
      addedAtColumn,
      feedbackColumnTransition,
      ownerColumnTransition,
      statusColumnTransition,
      timeColumnTransition,
      deadlineColumnTrnasition,
      finishedColumnTransition,
      loggedInUser,
    ],  
  },  
  columnMyReports: [
    nameColumn,
    StageColumnMyreport,
    feedbackColumnMyreport,
    stausColumnMyreport,
    ownerColumnMyreport,
    assignDateColumnMyreport
  ],
  
  columnDanglingReports: [
    StageColumnDanglingReport,
    TotalFemaleDanglingReport,
    TotalmaleDanglingReport,
    TotalTransDanglingReport,
    TotalUnspecifiedDanglingReport,
    TotalDanglingReport
  ],
  
  columnStudentDetails: [
    EmailColumn,
    QualificationColumn,
    ReligonColumn,
    CasteColumn
  ],


  dConvert: (x) => {
    try {
      x.number = x['contacts'][0]['mobile'];
    } catch (e) {
      x.number = null;
    }

    x.gender = x.gender == 1 ? 'Female' : 'Male';

    x.marks = x.enrolmentKey[0] ? parseInt(x.enrolmentKey[0].totalMarks, 10) : null;
    x.marks = isNaN(x.marks) ? null : x.marks;
    x.lastUpdated = x.lastTransition ? x.lastTransition.createdAt : null;
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