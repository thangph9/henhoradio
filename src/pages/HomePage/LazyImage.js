/* eslint-disable react/sort-comp */
/* eslint-disable no-return-assign */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/jsx-indent */
/* eslint-disable react/no-array-index-key */
/* eslint-disable no-plusplus */

import React, { PureComponent } from 'react';
import { connect } from 'dva';
import styles from './index.less';

function elementInViewport(el) {
  const rect = el.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.top <= (window.innerHeight || document.documentElement.clientHeight)
  );
}
const host = '';

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

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  componentDidMount() {
    const { avatar, number } = this.props;
    if (number < 12 && avatar) {
      const imgLoader = new Image();
      imgLoader.src = `${host}/images/ft/${avatar}`;
      imgLoader.onload = () => {
        if (this.imgElm && avatar) {
          this.imgElm.style.backgroundImage = `url(${host}/images/ft/${avatar})`;
          this.setState({
            loaded: true,
          });
        }
      };
    }
    this.handleScroll.bind(this.props);
    window.addEventListener('scroll', this.handleScroll);
  }

  handleScroll = () => {
    const { avatar } = this.props;
    if (!this.state.loaded && elementInViewport(this.imgElm) && avatar) {
      // Load real image
      const imgLoader = new Image();
      imgLoader.src = `${host}/images/ft/${avatar}`;
      imgLoader.onload = () => {
        if (this.imgElm && avatar) {
          this.imgElm.style.backgroundImage = `url(${host}/images/ft/${avatar})`;
          this.setState({
            loaded: true,
          });
        }
      };
    }
  };

  componentWillReceiveProps(nextprops) {
    const { avatar } = this.props;
    if (avatar !== nextprops.avatar) {
      this.setState(
        {
          loaded: false,
        },
        () => {
          const imgLoader = new Image();
          imgLoader.src = `${host}/images/ft/${nextprops.avatar}`;
          imgLoader.onload = () => {
            if (this.imgElm && nextprops.avatar) {
              this.imgElm.style.backgroundImage = `url(${host}/images/ft/${nextprops.avatar})`;
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
    const { avatar } = this.props;
    return (
      <div className={styles['avatar-image']}>
        <div
          ref={imgElm => (this.imgElm = imgElm)}
          className={styles['background-avatar']}
          style={{
            backgroundImage: `url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAqIAAAGAAQMAAABMQ5IQAAAAA1BMVEX///+nxBvIAAAANklEQVR42u3BAQEAAACCoP6vbojAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIC8A4EAAAFVQt90AAAAAElFTkSuQmCC)`,
          }}
        />
        {!this.state.loaded && avatar && (
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
