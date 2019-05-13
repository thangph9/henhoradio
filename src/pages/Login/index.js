/* eslint-disable react/jsx-first-prop-new-line */
/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable react/jsx-closing-bracket-location */
/* eslint-disable react/jsx-indent-props */
/* eslint-disable react/jsx-indent */
/* eslint-disable react/no-array-index-key */
/* eslint-disable react/no-unused-state */
/* eslint-disable class-methods-use-this */
/* eslint-disable react/sort-comp */
/* eslint-disable react/destructuring-assignment */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
// import { Redirect } from 'react-router-dom';
import { Icon } from 'antd';
// import {Link} from 'react-router-dom'
import styles from './styles.less';
import FormLogin from './FormLogin';
import PageLoading from '@/components/PageLoading';
import FormRegister from './FormRegister';

// eslint-disable-next-line react/no-multi-comp
@connect(({ loading, authentication, about, menu }) => ({
  submitting: loading.effects['form/submitRegularForm'],
  authentication,
  getlogin: about.getlogin,
  getmenu: menu.getmenu,
}))
class Login extends PureComponent {
  state = {
    statusPage: false,
    help: '',
    validateStatus: '',
    sizeScreen: 0,
  };

  componentWillMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'menu/getmenu',
      payload: 'Trang đăng ký đăng nhập',
    });
    dispatch({
      type: 'about/getlogin',
    });
  }

  componentDidMount() {
    const { location } = this.props;
    if (location.query.ref === '0') {
      this.setState({
        statusPage: false,
      });
    }
    if (location.query.ref === '1') {
      this.setState({
        statusPage: true,
      });
    }
    window.addEventListener('resize', this.resize.bind(this));
    this.resize();
  }

  componentWillReceiveProps(nextProps) {
    const { getlogin, getmenu } = this.props;
    if (getlogin !== nextProps.getlogin) {
      this.setState({
        login: nextProps.getlogin,
      });
    }
    if (getmenu !== nextProps.getmenu) {
      this.setState({
        menu: nextProps.getmenu,
      });
    }
  }

  resize() {
    this.setState({
      sizeScreen: window.innerWidth,
    });
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize);
  }

  handleClickToggleStatus() {
    const { statusPage } = this.state;
    const {
      history,
      location: { pathname },
    } = this.props;
    this.setState(
      {
        statusPage: !statusPage,
      },
      () => {
        if (statusPage === false) {
          history.push({ pathname, search: '?ref=1' });
        } else history.push({ pathname, search: '?ref=0' });
      }
    );
  }

  render() {
    const { statusPage, sizeScreen, menu, login } = this.state;

    if (login && menu) {
      return (
        <div id="wrapper" style={{ position: 'relative' }} className={styles.homepageRegister}>
          {sizeScreen < 680 ? (
            <div
              className={styles['tw3-homepage--abstract'].concat(
                ' ',
                styles['tw3-homepage--abstract--mobile']
              )}
            >
              <div
                className={styles.homepageContainer__content__form.concat(
                  ' ',
                  styles.registerContainer
                )}
              >
                <div className={styles['tw3-pane'].concat(' ', styles['tw3-pane--left'])}>
                  <div className={styles['tw3-pane__content']}>
                    <div className={styles.logo}>
                      <img
                        alt="img"
                        src="https://twoo-a.akamaihd.net/static/682503600911326952191/images/logos/logo-twoo-flat-white@2x.png"
                        height={42}
                      />
                    </div>

                    <h1
                      style={{ color: '#fff' }}
                      className={styles['h1--step1'].concat(' ', styles.fw500)}
                    >
                      Chat với bạn <strong>mới</strong> khắp thế giới.
                    </h1>
                    <div
                      style={{ background: 'none' }}
                      className={styles['tw3-homepage--abstract--mobile__tabs'].concat(
                        ' ',
                        styles['tw3-tabsHolder']
                      )}
                    >
                      <span
                        style={{ cursor: 'pointer' }}
                        onClick={() => this.handleClickToggleStatus()}
                        className={
                          statusPage === true
                            ? styles['tw3-tab'].concat(
                                ' ',
                                styles.jsHomepageSwitch,
                                ' ',
                                styles.selected
                              )
                            : styles['tw3-tab'].concat(' ', styles.jsHomepageSwitch)
                        }
                      >
                        ĐĂNG KÝ
                      </span>
                      <span
                        style={{ cursor: 'pointer' }}
                        onClick={() => this.handleClickToggleStatus()}
                        className={
                          statusPage === false
                            ? styles['tw3-tab'].concat(
                                ' ',
                                styles.jsHomepageSwitch,
                                ' ',
                                styles.selected
                              )
                            : styles['tw3-tab'].concat(' ', styles.jsHomepageSwitch)
                        }
                      >
                        ĐĂNG NHẬP
                      </span>
                    </div>
                  </div>
                </div>
                <div className={styles['tw3-pane'].concat(' ', styles['tw3-pane--right'])}>
                  <div className={styles['tw3-pane__content']}>
                    <div
                      className={styles.divider.concat(
                        ' ',
                        styles.hor,
                        ' ',
                        styles.full,
                        ' ',
                        styles['mb--default']
                      )}
                    >
                      <span>
                        {statusPage === false
                          ? 'Đăng nhập bằng số điện thoại'
                          : 'Đăng ký tài khoản mới'}
                      </span>
                    </div>
                    {statusPage === false ? (
                      <FormLogin
                        useCaptcha={this.state.login.useCaptcha}
                        {...this.props}
                        help={this.state.help}
                        validateStatus={this.state.validateStatus}
                      />
                    ) : (
                      <FormRegister {...this.props} useCaptcha={this.state.login.useCaptcha} />
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div
              className={styles['tw3-homepage--abstract'].concat(
                ' ',
                styles['tw3-homepage--abstract--desktop']
              )}
            >
              <div className={styles.homepageLinks.concat(' ', styles['homepageLinks--top'])}>
                <div className={styles['homepageLinks--top__left']}>
                  {login.iconHeader.map((value, index) => (
                    <Icon
                      key={index}
                      style={{ fontSize: value.fontSize, marginRight: '10px', color: value.color }}
                      type={value.type}
                      theme={value.theme}
                      className="icon-login-page"
                    />
                  ))}
                </div>
                <div className={styles['homepageLinks--top__right']}>
                  <span
                    onClick={() => this.handleClickToggleStatus()}
                    className={styles['tw3-button'].concat(
                      ' ',
                      styles['tw3-button--orange'],
                      ' ',
                      styles['tw3-button--rounded'],
                      ' ',
                      styles.loginButton
                    )}
                    data-page="login"
                  >
                    {statusPage === false ? 'Đăng ký' : 'Đăng nhập'}
                  </span>
                </div>
              </div>
              <div
                className={styles.homepageContainer__content__form.concat(
                  ' ',
                  styles.registerContainer
                )}
              >
                <div className={styles['tw3-pane'].concat(' ', styles['tw3-pane--left'])}>
                  <div className={styles['tw3-pane__content']}>
                    <div className={styles.logo}>
                      <img alt="img" src={login.logo} height={42} />
                    </div>

                    <h1
                      style={{ color: '#fff' }}
                      className={styles['h1--step1'].concat(' ', styles.fw500)}
                    >
                      {login.title}
                    </h1>
                    <p className={styles['mb--slack']}>{login.introduce}</p>
                  </div>
                </div>
                <div className={styles['tw3-pane'].concat(' ', styles['tw3-pane--right'])}>
                  <div className={styles['tw3-pane__content']}>
                    <div
                      className={styles.divider.concat(
                        ' ',
                        styles.hor,
                        ' ',
                        styles.full,
                        ' ',
                        styles['mb--default']
                      )}
                    >
                      <span>
                        {statusPage === false
                          ? 'Đăng nhập bằng số điện thoại'
                          : 'Đăng ký tài khoản mới'}
                      </span>
                    </div>
                    {statusPage === false ? (
                      <FormLogin {...this.props} useCaptcha={this.state.login.useCaptcha} />
                    ) : (
                      <FormRegister {...this.props} useCaptcha={this.state.login.useCaptcha} />
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div
            style={{ background: '#fff', height: 0 }}
            className={styles.homepageLinks.concat(' ', styles['homepageLinks--bottom'])}
          >
            <div className={styles['homepageLinks--bottom__links']}>
              <ul>
                {menu.map((value, index) => (
                  <li key={index}>
                    <a href={value.path}>{value.name}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      );
    }
    return <PageLoading />;
  }
}

export default Login;
