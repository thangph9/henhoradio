import React, { PureComponent } from 'react';

import styles from './HeaderTipContent.less';

class HeaderTip extends PureComponent {
  render() {
    const { data } = this.props;
    return (
      <div className={styles.row}>
        <div className={styles.leftSide} style={{ textIndent: '6px' }}>
          Kết quả {data.begin}-{data.end} của {data.total} thành viên
        </div>
      </div>
    );
  }
}
export default HeaderTip;
