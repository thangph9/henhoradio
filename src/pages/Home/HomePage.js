import React, { PureComponent } from 'react';
import { connect } from 'dva';

@connect(({ loading }) => ({
  submitting: loading.effects['form/submitRegularForm'],
}))
class HomePage extends PureComponent {
  render() {
    return <div>HomePage 1 2 3 5 7 8 9 5 4 3</div>;
  }
}

export default HomePage;
