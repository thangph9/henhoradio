import React, { PureComponent } from 'react';

import styles from './HeaderTipContent.less';

class HeaderTip extends PureComponent {
  render() {
    const { data } = this.props;
    return (
      <div className={styles.row}>
        <div className={styles.leftSide}>
          Trang: <strong>{data.current}</strong>
        </div>
        <div className={styles.rightSide}>
          Tìm thấy <strong>{data.total}</strong> thành viên
        </div>
      </div>
    );
  }
}
export default HeaderTip;
