/* eslint-disable react/react-in-jsx-scope */

import { PureComponent } from 'react';
import { connect } from 'dva';

@connect(({ list }) => ({
  list,
}))
class Suggestion extends PureComponent {
  render() {
    return <div>Xin chao</div>;
  }
}

export default Suggestion;
