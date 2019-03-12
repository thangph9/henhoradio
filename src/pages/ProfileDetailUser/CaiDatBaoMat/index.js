/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable react/jsx-first-prop-new-line */
/* eslint-disable react/jsx-max-props-per-line */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-unused-vars */
/* eslint-disable class-methods-use-this */
/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable react/jsx-indent-props */
/* eslint-disable react/jsx-indent */
/* eslint-disable react/no-array-index-key */
/* eslint-disable arrow-body-style */
/* eslint-disable dot-notation */
/* eslint-disable no-undef */
/* eslint-disable no-plusplus */
/* eslint-disable react/no-unused-state */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/sort-comp */
import React, { Component } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import { Table, Icon, Input, Button, Skeleton, Radio, Checkbox, message, Tooltip } from 'antd';
import styles from './caidatbaomat.less';

const { TextArea } = Input;
const RadioGroup = Radio.Group;
const CheckboxGroup = Checkbox.Group;
@connect(({ profile, loading, authentication, myprops }) => ({
  profile,
  loading: loading.effects['profile/fetchAdvanced'],
  authentication,
  myprops,
}))
class CaiDatBaoMat extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.props.dispatch({
      type: 'myprops/menu_item_profile',
      payload: 1,
    });
  }

  render() {
    return <div>Cai dat bao mat</div>;
  }
}

export default CaiDatBaoMat;
