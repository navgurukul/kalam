# Kalam

A.P.J. Abdul Kalam, in full **Avul Pakir Jainulabdeen Abdul Kalam**, (born October 15, 1931, Rameswaram, India—died July 27, 2015, Shillong), Indian scientist and politician who played a leading role in the development of India’s missile and nuclear weapons programs. He was president of India from 2002 to 2007.

Kalam earned a degree in aeronautical engineering from the Madras Institute of Technology and in 1958 joined the Defence Research and Development Organisation (DRDO). In 1969 he moved to the Indian Space Research Organisation, where he was project director of the SLV-III, the first satellite launch vehicle that was both designed and produced in India.

*Welcome to THE ReadMe*🙌

<br>

## Download and install the dependenices

```sh
  npm install
```

<br>

## Development Ethos

- _It's OK to break stuff on development. Take the ownership and send the fix._
- _Help other people while reviewing the PR. and Be respectful if somebody needs to improve something on their code. The goal is to work together and have some fun._
- _If you can, use a ton of emojis while reviewing the PR or replying to comments in the PR. 😉_
- _Don't shy away from sending a PR, we are more than happy to help you out in the process._

<br>

## Understanding the File Structure

### The file structure is like this

```no
|--src # Source Files
   |--assets # assets that belongs commonly in all components.
   |--components # Components and their child components.
      |--assessment # components related to assessments
      |--campus # components for campus lists, campus wise student data, etc.
      |--contact # components for adding/editing contacts
      |--dashboard # dashboard components
      |--donor # components for donor lists, donor wise student data, etc.
      |--feedback # components for feedback
      |--layout # components for header, footer, navs, etc
      |--muiTables # custom components for MUI Tables
      |--onlineTest # components for online test
      |--outreach # components for outreach data
      |--owner # components for Owner List, owner wise student data, etc.
      |--pages # different pages for Login, Landing Page, etc.
      |--partner # components for partner lists, partner wise student data, etc.
      |--report # components for student reports
      |--smallComponents # small misc components used in multiple pages
      |--student # components for student data, progress cards, status, etc.
      |--ui # UI components for AlertDialog, Loader, VideoSlider, etc.
   |--config # config files from medhavi
   |--routers # components for the main router and other supporting components
   |--services # files for StudentService having different column definitions and global service for other constants
   |--store # redux store
      |--slices # slices for different reducers
      |--store.js # driver code to create redux store
   |--styles # css styles
   |--theme # code for generating custom MUI Theme
   |--utils # files for uitlity code
   |--app.jsx # entry point of the react app
   |--favicon.ico
|--.env.development # env variables for development
|--.eslintrc.json # config for eslint
|--.prettierrc # config for prettier
|--deploy.sh # script to deploy to gh-pages for production
|--dev-deploy.sh # script to deploy to gh-pages for dev
|--package.json
|--ReadMe.md
|--vite.config.js # configuration file for vite

```

<br>

### The above structure may look complicated at first, but you'll come to understand how simple it is!😉

<br>

## Tech Stack

- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [Material UI](https://mui.com/)
- [MUI Datatables](http://www.material-ui-datatables.com/)

<br>

## Scripts that makes our day-to-day life easy

In the project directory, you can run:

```sh
npm run dev
```

Runs the app in the development mode<br>
Open <http://localhost:8080> to view it in browser

<br>

```sh
npm run build
```

Creates a production build of the app

<br>

```sh
npm run preview
```

Runs the production build on local server.<br>
Open <http://localhost:8080> to view it in browser
