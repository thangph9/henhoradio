/* eslint-disable react/no-unused-state */
/* eslint-disable no-nested-ternary */
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

@connect(({ list, user, authentication, myprops }) => ({
  list,
  user,
  authentication,
  myprops,
}))
class LazyImage extends PureComponent {
  state = {
    loaded: false,
    cdn: '',
  };

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  componentDidMount() {
    const { avatar, number, user } = this.props;
    if (number < 12 && avatar) {
      const imgLoader = new Image();
      imgLoader.src = `${user.getsetting.newfeed}${avatar}`;
      imgLoader.onload = () => {
        if (this.imgElm && avatar) {
          this.imgElm.style.backgroundImage = `url(${user.getsetting.newfeed}${avatar})`;
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
    const { avatar, user } = this.props;
    if (!this.state.loaded && elementInViewport(this.imgElm) && avatar) {
      // Load real image
      const imgLoader = new Image();
      imgLoader.src = `${user.getsetting.newfeed}${avatar}`;
      imgLoader.onload = () => {
        if (this.imgElm && avatar) {
          this.imgElm.style.backgroundImage = `url(${user.getsetting.newfeed}${avatar})`;
          this.setState({
            loaded: true,
          });
        }
      };
    }
  };

  componentWillReceiveProps(nextprops) {
    const { avatar, user } = this.props;
    if (avatar !== nextprops.avatar) {
      this.setState(
        {
          loaded: false,
        },
        () => {
          const imgLoader = new Image();
          imgLoader.src = `${user.getsetting.newfeed}${nextprops.avatar}`;
          imgLoader.onload = () => {
            if (this.imgElm && nextprops.avatar) {
              this.imgElm.style.backgroundImage = `url(${user.getsetting.newfeed}${
                nextprops.avatar
              })`;
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
    const { avatar, gender } = this.props;
    return (
      <div className={styles['avatar-image']}>
        <div
          ref={imgElm => (this.imgElm = imgElm)}
          className={styles['background-avatar']}
          style={{
            backgroundImage:
              gender === 'male'
                ? `url(http://cdn.henhoradio.net/images/ft/0bfed19c-071d-4a16-90d5-037fd22ed912)`
                : gender === 'female'
                ? `url(http://cdn.henhoradio.net/images/ft/73cb3725-aa00-4f91-b6eb-8bff157fd714)`
                : `url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAqIAAAGAAQMAAABMQ5IQAAAAA1BMVEX///+nxBvIAAAANklEQVR42u3BAQEAAACCoP6vbojAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIC8A4EAAAFVQt90AAAAAElFTkSuQmCC)`,
          }}
        />
        {!this.state.loaded && avatar && (
          <div className={styles['loading-circle']}>
            <div className={styles['lds-spinner']}>
              <div />
              <div />
              <div />
              <div />
              <div />
              <div />
              <div />
              <div />
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
