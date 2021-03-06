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
import { Icon } from 'antd';
import Image from './Image';
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
      activeMenu: false,
      loaded: 0,
      activeImage: 0,
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
      this.setState(
        {
          dataAllUser: nextProps.authentication.getallusers,
        },
        () => {
          const { dataAllUser } = this.state;
          const arr = [];
          for (let i = 0; i < dataAllUser.length; i += 1) {
            if (i === 6) break;
            arr[i] = dataAllUser[i].avatar;
          }
          const data = dataAllUser;
          data.forEach(element => {
            element.image = arr;
          });
          this.setState({
            dataAllUser: data,
          });
        }
      );
    }
  }

  handleClickImage(value) {
    this.setState({
      activeImage: value,
    });
  }

  renderBox(value) {
    const { dataAllUser, activeImage } = this.state;
    if (value > dataAllUser.length + 5 || value < 0) return '';
    return (
      <Image
        dataAllUser={dataAllUser}
        activeImage={activeImage}
        resultClass={this.resultClassBox(value)}
        valueLoaded={value}
        avatar={dataAllUser[this.resultIndexUser(this.resultClassBox(value))].avatar}
        fullname={dataAllUser[this.resultIndexUser(this.resultClassBox(value))].fullname}
        gender={dataAllUser[this.resultIndexUser(this.resultClassBox(value))].gender}
        address={dataAllUser[this.resultIndexUser(this.resultClassBox(value))].address}
        image={dataAllUser[this.resultIndexUser(this.resultClassBox(value))].image}
        resultClassImage={this.resultClassImage(value)}
      />
    );
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
    const { loaded } = this.state;
    const prevLoad = loaded;
    this.setState({
      loaded: prevLoad + 1,
      nextClicked: true,
      activeImage: 0,
    });
  }

  handleClickPrevCard() {
    const { loaded } = this.state;
    const prevLoad = loaded;
    this.setState({
      loaded: prevLoad - 1,
      nextClicked: true,
      activeImage: 0,
    });
  }

  handleClickActiveMenu() {
    const { activeMenu } = this.state;
    const newState = !activeMenu;
    this.setState({
      activeMenu: newState,
    });
  }

  resultClassBox(v) {
    if (v % 5 === 1) return `${styles['right-box']}`;
    if (v % 5 === 2) return `${styles['center-box']}`;
    if (v % 5 === 3) return `${styles['left-box']}`;
    return `${styles.none}`;
  }

  resultClassImage(v) {
    if (v % 5 === 1) return `${styles['right-image']} ${styles['effect-hover']}`;
    if (v % 5 === 2) return `${styles['center-image']} ${styles['effect-hover']}`;
    if (v % 5 === 3) return `${styles['left-image']} ${styles['effect-hover']}`;
    return 'abc';
  }

  resultIndexUser(value) {
    const { nextClicked, loaded, prevClicked } = this.state;
    if (nextClicked || prevClicked) {
      if (value === `${styles['left-box']}`) {
        return loaded;
      }
      if (value === `${styles['center-box']}`) {
        return loaded + 1;
      }
      return loaded + 2;
    }
    if (value === `${styles['left-box']}`) {
      return 0;
    }
    if (value === `${styles['center-box']}`) {
      return 1;
    }
    return 2;
  }

  render() {
    const { number, dataAllUser, activeMenu, loaded } = this.state;
    const { loadingPage } = this.props;
    return (
      <div className={styles['landing-page']}>
        <div className={styles['menu-hidden']}>
          <div className={activeMenu ? styles['to-left-icon'] : ''}>
            <Icon onClick={() => this.handleClickActiveMenu()} type="menu-unfold" />
          </div>
        </div>
        <div className={activeMenu ? `${styles['active-menu']} ${styles.nav}` : styles.nav}>
          <ul>
            <li onClick={() => this.handleClickMenu(1)}>
              <a>
                <Icon style={{ paddingRight: '5px' }} type="mail" />
                Message
              </a>
              <div
                className={number === 1 ? `${styles['s-menu']} ${styles.active}` : styles['s-menu']}
              >
                <a href="#">New</a>
                <a href="#">Sent</a>
                <a href="#">Spam</a>
              </div>
            </li>
            <li onClick={() => this.handleClickMenu(2)}>
              <a>
                <Icon style={{ paddingRight: '5px' }} type="setting" />
                Setting
              </a>
              <div
                className={number === 2 ? `${styles['s-menu']} ${styles.active}` : styles['s-menu']}
              >
                <a href="#">Password</a>
                <a href="#">Email</a>
              </div>
            </li>
            <li onClick={() => this.handleClickMenu(3)}>
              <a>
                <Icon style={{ paddingRight: '5px' }} type="user" />
                Profile
              </a>
              <div
                className={number === 3 ? `${styles['s-menu']} ${styles.active}` : styles['s-menu']}
              >
                <a href="#">Post</a>
                <a href="#">Question</a>
              </div>
            </li>
            <li>
              <a href="#">
                <Icon style={{ paddingRight: '5px' }} type="poweroff" />
                Logout
              </a>
            </li>
          </ul>
        </div>
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
                {loaded >= 0 && (
                  <div className={styles['arrow-left']}>
                    <Icon
                      onClick={() => this.handleClickPrevCard()}
                      style={{
                        position: 'absolute',
                        zIndex: 2,
                        top: '50%',
                        left: '-5%',
                        fontSize: '35px',
                        transform: 'translateY(-50%)',
                        color: '#0652DD',
                      }}
                      type="left"
                    />
                  </div>
                )}
                <div className={styles['main-slide']}>
                  <div className={this.resultClassBox(loaded + 4)}>
                    {this.resultClassBox(loaded + 4) === `${styles['right-box']}`
                      ? loaded + 2 < dataAllUser.length && this.renderBox(loaded + 4)
                      : this.resultClassBox(loaded + 4) === `${styles['left-box']}`
                      ? loaded >= 0 && this.renderBox(loaded + 4)
                      : this.resultClassBox(loaded + 4) === `${styles['center-box']}` &&
                        this.renderBox(loaded + 4)}
                  </div>
                  <div className={this.resultClassBox(loaded + 3)}>
                    {this.resultClassBox(loaded + 3) === `${styles['right-box']}`
                      ? loaded + 2 < dataAllUser.length && this.renderBox(loaded + 3)
                      : this.resultClassBox(loaded + 3) === `${styles['left-box']}`
                      ? loaded >= 0 && this.renderBox(loaded + 3)
                      : this.resultClassBox(loaded + 3) === `${styles['center-box']}` &&
                        this.renderBox(loaded + 3)}
                  </div>
                  <div className={this.resultClassBox(loaded + 2)}>
                    {this.resultClassBox(loaded + 2) === `${styles['right-box']}`
                      ? loaded + 2 < dataAllUser.length && this.renderBox(loaded + 2)
                      : this.resultClassBox(loaded + 2) === `${styles['left-box']}`
                      ? loaded >= 0 && this.renderBox(loaded + 2)
                      : this.resultClassBox(loaded + 2) === `${styles['center-box']}` &&
                        this.renderBox(loaded + 2)}
                  </div>
                  <div className={this.resultClassBox(loaded + 1)}>
                    {this.resultClassBox(loaded + 1) === `${styles['right-box']}`
                      ? loaded + 2 < dataAllUser.length && this.renderBox(loaded + 1)
                      : this.resultClassBox(loaded + 1) === `${styles['left-box']}`
                      ? loaded >= 0 && this.renderBox(loaded + 1)
                      : this.resultClassBox(loaded + 1) === `${styles['center-box']}` &&
                        this.renderBox(loaded + 1)}
                  </div>
                  <div className={this.resultClassBox(loaded)}>
                    {this.resultClassBox(loaded) === `${styles['right-box']}`
                      ? loaded + 2 < dataAllUser.length && this.renderBox(loaded)
                      : this.resultClassBox(loaded) === `${styles['left-box']}`
                      ? loaded >= 0 && this.renderBox(loaded)
                      : this.resultClassBox(loaded) === `${styles['center-box']}` &&
                        this.renderBox(loaded)}
                  </div>
                </div>
                {dataAllUser.length > loaded + 2 && (
                  <div className={styles['arrow-right']}>
                    <Icon
                      onClick={() => this.handleClickNextCard()}
                      style={{
                        position: 'absolute',
                        zIndex: 2,
                        top: '50%',
                        right: '-5%',
                        fontSize: '35px',
                        transform: 'translateY(-50%)',
                        color: '#0652DD',
                      }}
                      type="right"
                    />
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className={styles['slide-bar']}>
              <div className={styles['slide-bar-container']}>
                <div className={styles['main-slide']}>
                  <div className={styles['left-box']}>
                    <div
                      style={{ background: '#f2f2f2', opacity: 1 }}
                      className={styles['left-image']}
                    />
                  </div>
                  <div className={styles['center-box']}>
                    <div
                      style={{ background: '#f2f2f2', opacity: 1 }}
                      className={styles['center-image']}
                    >
                      <div style={{ paddingBottom: '80px' }} className={styles.content} />
                    </div>
                  </div>
                  <div className={styles['right-box']}>
                    <div
                      style={{ background: '#f2f2f2', opacity: 1 }}
                      className={styles['right-image']}
                    >
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
