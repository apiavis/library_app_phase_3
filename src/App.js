import React from 'react';
import Main from './components/Main';
import { connect } from 'react-redux';

import './css/bootstrap.min.css';
import './css/layout.css';

const App = (props) => {
  if (props.errorMsg) console.error('ERROR! \n', props.errorMsg);
  return <Main />;
};

const mapStateToProps = (state) => {
  return {
    errorMsg: state.library.errorMsg
  };
};

export default connect(mapStateToProps)(App);