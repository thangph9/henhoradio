/* eslint-disable no-param-reassign */
/* eslint-disable no-cond-assign */
/* eslint-disable react/no-unused-state */
/* eslint-disable react/react-in-jsx-scope */

import { PureComponent } from 'react';
import { connect } from 'dva';
import { Icon } from 'antd';
import styles from './index.less';

@connect(({ loading, authentication }) => ({
  loadingPage: loading.effects['authentication/getallusers'],
  authentication,
}))
class LandingPage extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      number: 0,
      dataAllUser: [],
      leftCard: 1,
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'authentication/getallusers',
    });
  }

  componentWillReceiveProps(nextProps) {
    const { authentication } = this.props;
    if (authentication.getallusers !== nextProps.authentication.getallusers) {
      this.setState({
        dataAllUser: nextProps.authentication.getallusers,
      });
    }
  }

  handleClickMenu(value) {
    const { number } = this.state;
    if (value === number) {
      this.setState({
        number: 0,
      });
    } else {
      this.setState({
        number: value,
      });
    }
  }

  handleClickNextCard() {
    const { leftCard } = this.state;
    const prevState = leftCard;
    this.setState({
      leftCard: prevState + 1,
    });
  }

  handleClickPrevCard() {
    const { leftCard } = this.state;
    const prevState = leftCard;
    this.setState({
      leftCard: prevState - 1,
    });
  }

  render() {
    const { number, dataAllUser, leftCard } = this.state;
    const { loadingPage } = this.props;
    return (
      <div className={styles['landing-page']}>
        <div className={styles.container}>
          <ul className={styles['menu-bar']}>
            <div className={styles.menu}>
              <li onClick={() => this.handleClickMenu(1)} className={styles.item}>
                <a className={styles.btn}>
                  <Icon type="user" />
                  Profile
                </a>
                <div className={number === 1 ? `${styles.smenu} ${styles.active}` : styles.smenu}>
                  <a href="#">Post</a>
                  <a href="#">Question</a>
                </div>
              </li>
              <li onClick={() => this.handleClickMenu(2)} className={styles.item}>
                <a className={styles.btn}>
                  <Icon type="mail" />
                  Message
                </a>
                <div className={number === 2 ? `${styles.smenu} ${styles.active}` : styles.smenu}>
                  <a href="#">New</a>
                  <a href="#">Sent</a>
                  <a href="#">Spam</a>
                </div>
              </li>
              <li onClick={() => this.handleClickMenu(3)} className={styles.item}>
                <a className={styles.btn}>
                  <Icon type="setting" />
                  Setting
                </a>
                <div className={number === 3 ? `${styles.smenu} ${styles.active}` : styles.smenu}>
                  <a href="#">Password</a>
                  <a href="#">Email</a>
                </div>
              </li>
              <li onClick={() => this.handleClickMenu(4)} className={styles.item}>
                <a href="#" className={styles.btn}>
                  <Icon type="poweroff" />
                  Logout
                </a>
              </li>
            </div>
          </ul>
          {!loadingPage && dataAllUser.length > 0 ? (
            <div className={styles['slide-bar']}>
              <div className={styles['slide-bar-container']}>
                <div className={styles['main-slide']}>
                  <div className={styles['left-box']}>
                    {leftCard !== 0 && (
                      <div
                        style={{
                          backgroundImage: `url(/images/ft/${dataAllUser[leftCard - 1].avatar})`,
                        }}
                        className={`${styles['left-image']} ${styles['effect-hover']}`}
                      >
                        <div className={`${styles.content}`}>
                          <h2>
                            {dataAllUser[leftCard - 1].fullname}
                            <br />
                            Giới tính: {dataAllUser[leftCard - 1].gender === 'male' ? 'Nam' : 'Nữ'}
                          </h2>
                          <p>{dataAllUser[leftCard - 1].address}</p>
                        </div>
                        <div
                          style={
                            dataAllUser[leftCard - 1].gender === 'male'
                              ? { backgroundImage: 'linear-gradient(to top,blue,transparent)' }
                              : { backgroundImage: 'linear-gradient(to top,#c21833,transparent)' }
                          }
                          className={styles['background-gradient']}
                        />
                      </div>
                    )}
                  </div>
                  <div className={styles['center-box']}>
                    <div
                      style={{ backgroundImage: `url(/images/ft/${dataAllUser[leftCard].avatar})` }}
                      className={`${styles['center-image']} ${styles['effect-hover']}`}
                    >
                      {leftCard - 1 >= 0 && (
                        <Icon
                          onClick={() => this.handleClickPrevCard()}
                          style={{
                            position: 'absolute',
                            zIndex: 2,
                            top: '50%',
                            fontSize: '35px',
                            transform: 'translateY(-50%)',
                            color: '#0652DD',
                          }}
                          type="left"
                        />
                      )}
                      <div style={{ paddingBottom: '100px' }} className={`${styles.content}`}>
                        <h2>
                          {dataAllUser[leftCard].fullname}
                          <br />
                          Giới tính: {dataAllUser[leftCard].gender === 'male' ? 'Nam' : 'Nữ'}
                        </h2>
                        <p>{dataAllUser[leftCard].address}</p>
                      </div>
                      {dataAllUser.length > leftCard + 1 && (
                        <Icon
                          onClick={() => this.handleClickNextCard()}
                          style={{
                            position: 'absolute',
                            zIndex: 2,
                            top: '50%',
                            right: '0px',
                            fontSize: '35px',
                            transform: 'translateY(-50%)',
                            color: '#0652DD',
                          }}
                          type="right"
                        />
                      )}
                      <div
                        style={
                          dataAllUser[leftCard].gender === 'male'
                            ? { backgroundImage: 'linear-gradient(to top,blue,transparent)' }
                            : { backgroundImage: 'linear-gradient(to top,#c21833,transparent)' }
                        }
                        className={styles['background-gradient']}
                      />
                    </div>
                  </div>
                  <div className={styles['right-box']}>
                    {leftCard + 1 !== dataAllUser.length && (
                      <div
                        style={{
                          backgroundImage: `url(/images/ft/${dataAllUser[leftCard + 1].avatar})`,
                        }}
                        className={`${styles['right-image']} ${styles['effect-hover']}`}
                      >
                        <div className={`${styles.content}`}>
                          <h2>
                            {dataAllUser[leftCard + 1].fullname}
                            <br />
                            Giới tính: {dataAllUser[leftCard + 1].gender === 'male' ? 'Nam' : 'Nữ'}
                          </h2>
                          <p>{dataAllUser[leftCard + 1].address}</p>
                        </div>
                        <div
                          style={
                            dataAllUser[leftCard + 1].gender === 'male'
                              ? { backgroundImage: 'linear-gradient(to top,blue,transparent)' }
                              : { backgroundImage: 'linear-gradient(to top,#c21833,transparent)' }
                          }
                          className={styles['background-gradient']}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className={styles['slide-bar']}>
              <div className={styles['slide-bar-container']}>
                <div className={styles['main-slide']}>
                  <div className={styles['left-box']}>
                    <div style={{ background: '#f2f2f2' }} className={styles['left-image']} />
                  </div>
                  <div className={styles['center-box']}>
                    <div style={{ background: '#f2f2f2' }} className={styles['center-image']}>
                      <div style={{ paddingBottom: '80px' }} className={styles.content} />
                    </div>
                  </div>
                  <div className={styles['right-box']}>
                    <div style={{ background: '#f2f2f2' }} className={styles['right-image']}>
                      <div className={styles.content} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default LandingPage;
