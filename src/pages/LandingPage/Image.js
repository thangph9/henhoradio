/* eslint-disable no-nested-ternary */
/* eslint-disable react/sort-comp */
/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable react/no-will-update-set-state */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-param-reassign */
/* eslint-disable no-cond-assign */
/* eslint-disable react/no-unused-state */
/* eslint-disable no-return-assign */
/* eslint-disable react/react-in-jsx-scope */

import { PureComponent } from 'react';
import { connect } from 'dva';
import styles from './index.less';

@connect(({ loading, authentication }) => ({
  loadingPage: loading.effects['authentication/getallusers'],
  authentication,
}))
class LandingPage extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
    };
  }

  componentDidMount() {
    const { avatar } = this.props;
    const imgLoader = new Image();
    imgLoader.src = `/images/ft/${avatar}`;
    imgLoader.onload = () => {
      if (this.imgElm) {
        this.imgElm.style.backgroundImage = `url(/images/ft/${avatar})`;
        this.setState({
          loaded: true,
        });
      }
    };
  }

  render() {
    const {
      activeImage,
      resultClassBox,
      resultClassImage,
      fullname,
      gender,
      address,
      image,
    } = this.props;
    return (
      <div
        ref={imgElm => (this.imgElm = imgElm)}
        style={{
          backgroundImage: `url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAqIAAAGAAQMAAABMQ5IQAAAAA1BMVEX///+nxBvIAAAANklEQVR42u3BAQEAAACCoP6vbojAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIC8A4EAAAFVQt90AAAAAElFTkSuQmCC)`,
          backgroundColor: this.state.loaded ? 'none' : 'rgb(242, 242, 242)',
        }}
        className={resultClassImage}
      >
        <div className={`${styles.content}`}>
          <h2>
            {fullname}
            <br />
            Giới tính: {gender === 'male' ? 'Nam' : 'Nữ'}
          </h2>
          <p>{address}</p>
        </div>
        <div
          style={
            gender === 'male'
              ? { backgroundImage: 'linear-gradient(to top,blue,transparent)' }
              : { backgroundImage: 'linear-gradient(to top,#c21833,transparent)' }
          }
          className={styles['background-gradient']}
        />
        {resultClassBox === `${styles['center-box']}` && (
          <div className={styles['image-card']}>
            {image.map((v, i) => (
              <span
                key={v}
                onClick={() => this.handleClickImage(i)}
                className={
                  activeImage === i
                    ? `${styles['item-image']} ${styles['active-image']}`
                    : styles['item-image']
                }
              />
            ))}
          </div>
        )}
      </div>
    );
  }
}

export default LandingPage;
