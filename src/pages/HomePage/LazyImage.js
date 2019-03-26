/* eslint-disable no-return-assign */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/jsx-indent */
/* eslint-disable react/no-array-index-key */
/* eslint-disable no-plusplus */

import React, { PureComponent } from 'react';
import { connect } from 'dva';
import styles from './index.less';

@connect(({ list, user, authentication, myprops }) => ({
  list,
  user,
  authentication,
  myprops,
}))
class LazyImage extends PureComponent {
  state = {
    loaded: false,
  };

  componentDidMount() {
    const { avatar } = this.props;
    const imgLoader = new Image();
    imgLoader.src = `/images/ft/${avatar}`;
    imgLoader.onload = () => {
      if (this.imgElm && avatar) {
        this.imgElm.style.backgroundImage = `url(/images/ft/${avatar})`;
        this.setState({
          loaded: true,
        });
      }
    };
  }

  componentWillReceiveProps(nextprops) {
    const { avatar } = this.props;
    if (avatar !== nextprops.avatar) {
      this.setState(
        {
          loaded: false,
        },
        () => {
          const imgLoader = new Image();
          imgLoader.src = `/images/ft/${nextprops.avatar}`;
          imgLoader.onload = () => {
            if (this.imgElm && nextprops.avatar) {
              this.imgElm.style.backgroundImage = `url(/images/ft/${nextprops.avatar})`;
              this.setState({
                loaded: true,
              });
            }
          };
        }
      );
    }
  }

  render() {
    return (
      <div className={styles['avatar-image']}>
        <div
          ref={imgElm => (this.imgElm = imgElm)}
          className={styles['background-avatar']}
          style={{
            backgroundImage: `url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAqIAAAGAAQMAAABMQ5IQAAAAA1BMVEX///+nxBvIAAAANklEQVR42u3BAQEAAACCoP6vbojAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIC8A4EAAAFVQt90AAAAAElFTkSuQmCC)`,
            opacity: this.state.loaded ? 1 : 0,
          }}
        />
        {!this.state.loaded && (
          <div className={styles['loading-circle']}>
            <div className={styles['lds-ring']}>
              <div />
              <div />
              <div />
              <div />
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default LazyImage;
