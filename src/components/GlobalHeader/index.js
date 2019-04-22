import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';
import Debounce from 'lodash-decorators/debounce';
import { Icon, Button } from 'antd';
import styles from './styles.less';

// eslint-disable-next-line no-undef

class GlobalHeader extends PureComponent {
  state = {
    dataUser: {},
    loaded: false,
    menu: [],
    activeMenu: false,
  };

  componentWillUnmount() {
    this.triggerResizeEvent.cancel();
  }
  /* eslint-disable*/
  @Debounce(600)
  triggerResizeEvent() {
    // eslint-disable-line
    const event = document.createEvent('HTMLEvents');
    event.initEvent('resize', true, false);
    window.dispatchEvent(event);
  }
  toggle = () => {
    const { collapsed, onCollapse } = this.props;
    onCollapse(!collapsed);
    this.triggerResizeEvent();
  };
  handleClickOut() {
    localStorage.removeItem('account');
    this.setState({
      open: false,
      openHelp: false,
    });
    this.props.history.push('/login');
  }
  handleClickOpenHelp() {
    this.setState({
      openHelp: !this.state.openHelp,
    });
  }
  toggleMenu() {
    this.setState(
      {
        open: !this.state.open,
      },
      () => {
        this.props.dispatch({
          type: 'myprops/menu_header',
          payload: this.state.open,
        });
      }
    );
  }

  componentWillMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'menu/getmenu',
      payload: 'HomePage',
    });
  }

  componentDidMount() {
    if (localStorage.token) {
      this.props.dispatch({
        type: 'authentication/getonlyuser',
      });
    }
    this.setState({
      sizeHeader: this.header.clientWidth,
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.myprops.menu_header !== this.props.myprops.menu_header) {
      this.setState({
        open: nextProps.myprops.menu_header,
      });
    }
    if (this.props.authentication.getonlyuser !== nextProps.authentication.getonlyuser) {
      this.setState(
        {
          dataUser: nextProps.authentication.getonlyuser,
        },
        () => {
          const { dataUser } = this.state;
          const imgLoader = new Image();
          imgLoader.src = `${nextProps.user.getsetting.cdn}${dataUser.avatar}`;
          imgLoader.onload = () => {
            if (this.imgElm && dataUser.avatar) {
              this.imgElm.style.backgroundImage = `url(${nextProps.user.getsetting.cdn}${
                dataUser.avatar
              })`;
              this.setState({
                loaded: true,
              });
            }
          };
        }
      );
    }
    if (this.props.getmenu !== nextProps.getmenu) {
      this.setState({
        menu: nextProps.getmenu,
      });
    }
  }
  toggleMenuMobile() {
    this.props.dispatch({
      type: 'myprops/menu_header_mobile',
      payload: !this.props.myprops.menu_header_mobile,
    });
  }
  handleClickLogout() {
    localStorage.removeItem('antd-pro-authority');
    localStorage.removeItem('token');
    this.props.history.push({ pathname: '/' });
  }
  handleClickActiveMenu() {
    const { activeMenu } = this.state;
    const newState = !activeMenu;
    this.setState({
      activeMenu: newState,
    });
  }
  render() {
    const { dataUser, activeMenu, sizeHeader } = this.state;
    return (
      <div ref={header => (this.header = header)} className={`${styles.header__header___1t3MH}`}>
        {sizeHeader > 767 ? (
          <nav
            style={{ height: 70 }}
            className={`${styles['header__my-navbar___2Cghd']} ${
              styles['header__navbar-toggleable-sm___pR4tF']
            } ${styles['header__nav-header___3lWCb']} ${styles['screen-header']}`}
          >
            <div
              className={`${styles['container__container___1fvX0']} ${
                styles['header__container___2d-Oi']
              }`}
            >
              <div
                className={`${styles['hidden-md-up']} ${
                  styles['header__my-navbar-toggler___2PiaS']
                }`}
              >
                <button className={`${styles['header__btn-icon___17D-i']}`} type="button">
                  <Icon style={{ display: 'block', fontSize: '20px' }} type="user" />
                </button>
              </div>
              <Link to={`/home`} className={`${styles['header__navbar-brand___SzzgD']} `}>
                <img
                  style={{ position: 'relative', width: '82px', height: '23px' }}
                  src="https://twoo-a.akamaihd.net/static/7156520574362430695506/images/logos/logo-twoo-flat@2x.png"
                />
              </Link>
              <div
                style={{ alignItems: 'center' }}
                className={`${styles['clearfix']} ${styles['collapse']} ${
                  styles['header__navbar-collapse___2AK1h']
                }`}
              >
                <ul
                  style={{ flexBasis: '80%', justifyContent: 'center' }}
                  className={`${styles['hidden-md-down']} ${styles['header__navbar-nav___9cfBy']} ${
                    styles['header__navbar-left___25OFe']
                  }`}
                >
                  {this.state.menu.length > 0 ? (
                    this.state.menu.map((v, i) => {
                      return (
                        <li key={i} className={`${styles['header__nav-item___MQLXP']}`}>
                          <Link
                            style={{ textDecoration: 'none' }}
                            to={v.path}
                            className={`${styles['header__nav-link___3W4sc']}`}
                          >
                            <Icon
                              style={{ display: 'block', fontSize: '20px', marginBottom: '2px' }}
                              type={v.icon}
                            />
                            {v.name}
                          </Link>
                        </li>
                      );
                    })
                  ) : (
                    <li className={`${styles['header__nav-item___MQLXP']}`}>
                      <div className={`${styles['header__nav-link___3W4sc']}`} />
                    </li>
                  )}
                </ul>
                {localStorage.token ? (
                  <ul
                    style={{ top: '-5px' }}
                    className={`${styles['header__navbar-nav___9cfBy']} ${
                      styles['header__navbar-right___2_zf5']
                    }`}
                  >
                    <li className={`${styles['header__nav-item___MQLXP']}`}>
                      <div className={`${styles['auth-buttons__auth___33bfZ']}`}>
                        <Link
                          style={{ cursor: 'pointer', paddingTop: '13px' }}
                          className={`${styles['auth-buttons__nav-link___1DCMU']} ${
                            styles['auth-buttons__btn-sign-in___1nV-O']
                          }`}
                          to="/home/profile-user"
                        >
                          <div
                            ref={imgElm => (this.imgElm = imgElm)}
                            className={styles['background-avatar']}
                            style={{
                              backgroundImage:
                                dataUser.gender === 'male'
                                  ? `url(http://cdn.henhoradio.net/images/ft/ddc8448a-9c0d-4b70-a4c4-19bc3fb7a04c)`
                                  : dataUser.gender === 'female' &&
                                    `url(http://cdn.henhoradio.net/images/ft/3b10bc5e-7741-41e4-88ee-0174e2d6f0cd)`,
                              backgroundColor: this.state.loaded ? 'none' : 'rgb(242, 242, 242)',
                            }}
                          />
                        </Link>
                      </div>
                    </li>
                    <li
                      style={{ marginLeft: '10px' }}
                      className={`${styles['header__nav-item___MQLXP']}`}
                    >
                      <div className={`${styles['auth-buttons__auth___33bfZ']}`}>
                        <span
                          style={{ cursor: 'pointer', paddingTop: '13px' }}
                          className={`${styles['auth-buttons__nav-link___1DCMU']} ${
                            styles['auth-buttons__btn-sign-in___1nV-O']
                          }`}
                          href="/auth/signin?redirect=/"
                        >
                          <Icon style={{ display: 'block', fontSize: '25px' }} type="bell" />
                        </span>
                      </div>
                    </li>
                    <li
                      style={{ marginLeft: '10px' }}
                      className={`${styles['header__nav-item___MQLXP']}`}
                    >
                      <div className={`${styles['auth-buttons__auth___33bfZ']}`}>
                        <span
                          style={{ cursor: 'pointer', paddingTop: '14px' }}
                          className={`${styles['auth-buttons__nav-link___1DCMU']} ${
                            styles['auth-buttons__btn-sign-in___1nV-O']
                          }`}
                          href="/auth/signin?redirect=/"
                        >
                          <Icon
                            onClick={() => this.toggleMenu()}
                            type="ellipsis"
                            style={
                              this.props.myprops.menu_header
                                ? { display: 'block', fontSize: '25px', color: '#FFA229' }
                                : { display: 'block', fontSize: '25px' }
                            }
                          />
                        </span>
                      </div>
                      {this.props.myprops.menu_header ? (
                        <div className={styles['toggle-menu']}>
                          <Link className={styles['li-link']} to={`/account/accountinformation`}>
                            <div className={styles['row']}>
                              <div className={styles['col-9']}>
                                <div className={styles['row-child']}>
                                  <div className={styles['col-2']}>
                                    <Icon type="check-circle" />
                                  </div>
                                  <div className={styles['col-10']}>Nguời bạn thích</div>
                                </div>
                              </div>
                              <div className={styles['col-3']} />
                            </div>
                          </Link>
                          <Link className={styles['li-link']} to={`/account/accountinformation`}>
                            <div className={styles['row']}>
                              <div className={styles['col-9']}>
                                <div className={styles['row-child']}>
                                  <div className={styles['col-2']}>
                                    <Icon type="heart" />
                                  </div>
                                  <div className={styles['col-10']}>Người phù hợp</div>
                                </div>
                              </div>
                              <div className={styles['col-3']} />
                            </div>
                          </Link>
                          <Link className={styles['li-link']} to={`/account/accountinformation`}>
                            <div className={styles['row']}>
                              <div className={styles['col-9']}>
                                <div className={styles['row-child']}>
                                  <div className={styles['col-2']}>
                                    <Icon type="thunderbolt" />
                                  </div>
                                  <div className={styles['col-10']}>Tín dụng</div>
                                </div>
                              </div>
                              <div className={styles['col-3']} />
                            </div>
                          </Link>
                          <Link className={styles['li-link']} to={`/account/accountinformation`}>
                            <div className={styles['row']}>
                              <div className={styles['col-9']}>
                                <div className={styles['row-child']}>
                                  <div className={styles['col-2']}>
                                    <Icon type="smile" />
                                  </div>
                                  <div className={styles['col-10']}>Gây chú ý</div>
                                </div>
                              </div>
                              <div className={styles['col-3']} />
                            </div>
                          </Link>
                          <Link className={styles['li-link']} to={`/account/accountinformation`}>
                            <div className={styles['row']}>
                              <div className={styles['col-9']}>
                                <div className={styles['row-child']}>
                                  <div className={styles['col-2']}>
                                    <Icon type="plus" />
                                  </div>
                                  <div className={styles['col-10']}>Mua gói cao cấp</div>
                                </div>
                              </div>
                              <div className={styles['col-3']} />
                            </div>
                          </Link>
                          <span
                            className={styles['li-link']}
                            onClick={() => this.handleClickLogout()}
                            to={`/account/accountinformation`}
                          >
                            <div className={styles['row']}>
                              <div className={styles['col-9']}>
                                <div className={styles['row-child']}>
                                  <div className={styles['col-2']}>
                                    <Icon type="poweroff" />
                                  </div>
                                  <div className={styles['col-10']}>Đăng xuất</div>
                                </div>
                              </div>
                              <div className={styles['col-3']} />
                            </div>
                          </span>
                        </div>
                      ) : (
                        ''
                      )}
                    </li>
                  </ul>
                ) : (
                  <Link to="/login?ref=0">
                    <Button
                      style={{
                        background: '#FF7102',
                        borderRadius: '30px',
                        color: '#fff',
                        border: 'none',
                      }}
                    >
                      Đăng nhập
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </nav>
        ) : (
          <nav
            style={{ height: '52px' }}
            className={`${styles['hidden-lg-up']} ${
              styles['header__mobile-nav-cat-container___2JTtk']
            } ${styles['cate-show']}`}
            id={`${styles['cate-mobile-root']}`}
          >
            <div
              style={{ height: '100%' }}
              className={
                activeMenu
                  ? `${styles['container__container___1fvX0']} ${
                      styles['header__padding-remove___uM9bo']
                    } ${styles['to-right-icon']}`
                  : `${styles['container__container___1fvX0']} ${
                      styles['header__padding-remove___uM9bo']
                    }`
              }
            >
              <Link to={`/home`} className={`${styles['header__navbar-brand___SzzgD']} `}>
                <img src="https://twoo-a.akamaihd.net/static/7156520574362430695506/images/logos/logo-twoo-flat@2x.png" />
              </Link>
              {localStorage.token ? (
                <ul
                  style={{ top: '-5px' }}
                  className={`${styles['header__navbar-nav___9cfBy']} ${
                    styles['header__navbar-right___2_zf5']
                  }`}
                >
                  <li className={`${styles['header__nav-item___MQLXP']}`}>
                    <div className={`${styles['auth-buttons__auth___33bfZ']}`}>
                      <Link
                        style={{ cursor: 'pointer' }}
                        className={`${styles['auth-buttons__nav-link___1DCMU']} ${
                          styles['auth-buttons__btn-sign-in___1nV-O']
                        }`}
                        to="/home/profile-user"
                      >
                        <div
                          ref={imgElm => (this.imgElm = imgElm)}
                          className={styles['background-avatar']}
                          style={{
                            backgroundImage:
                              dataUser.gender === 'male'
                                ? `url(http://cdn.henhoradio.net/images/ft/ddc8448a-9c0d-4b70-a4c4-19bc3fb7a04c)`
                                : dataUser.gender === 'female' &&
                                  `url(http://cdn.henhoradio.net/images/ft/3b10bc5e-7741-41e4-88ee-0174e2d6f0cd)`,
                            backgroundColor: this.state.loaded ? 'none' : 'rgb(242, 242, 242)',
                          }}
                        />
                      </Link>
                    </div>
                  </li>
                  <li
                    style={{ marginLeft: '10px' }}
                    className={`${styles['header__nav-item___MQLXP']}`}
                  >
                    <div className={`${styles['auth-buttons__auth___33bfZ']}`}>
                      <span
                        style={{ cursor: 'pointer' }}
                        className={`${styles['auth-buttons__nav-link___1DCMU']} ${
                          styles['auth-buttons__btn-sign-in___1nV-O']
                        }`}
                        href="/auth/signin?redirect=/"
                      >
                        <Icon style={{ display: 'block', fontSize: '25px' }} type="bell" />
                      </span>
                    </div>
                  </li>
                  <li
                    style={{ marginLeft: '10px' }}
                    className={`${styles['header__nav-item___MQLXP']}`}
                  >
                    <div className={`${styles['auth-buttons__auth___33bfZ']}`}>
                      <span
                        style={{ cursor: 'pointer' }}
                        className={`${styles['auth-buttons__nav-link___1DCMU']} ${
                          styles['auth-buttons__btn-sign-in___1nV-O']
                        }`}
                        href="/auth/signin?redirect=/"
                      >
                        <Icon
                          onClick={() => this.handleClickActiveMenu()}
                          type="menu-fold"
                          style={
                            this.props.myprops.menu_header
                              ? { display: 'block', fontSize: '25px', color: '#FFA229' }
                              : { display: 'block', fontSize: '25px' }
                          }
                        />
                      </span>
                    </div>
                  </li>
                </ul>
              ) : (
                <Link to="/login?ref=0" style={{ paddingRight: '20px' }}>
                  <Button
                    style={{
                      background: '#FF7102',
                      borderRadius: '30px',
                      color: '#fff',
                      border: 'none',
                    }}
                  >
                    Đăng nhập
                  </Button>
                </Link>
              )}
              {/*

            <ul
              style={{ height: '100%' }}
              className={`${styles['header__mobile-nav-cat___1wJ9O']} ${styles['item-align']}`}
            >
              {this.state.menu.length > 0
                ? this.state.menu.map((v, i) => {
                    return (
                      <li key={i} className={`${styles['header__nav-item___MQLXP']}`}>
                        <Link to={v.path}>
                          <Icon
                            style={{
                              display: 'block',
                              fontSize: '27px',
                              marginBottom: '2px',
                              color: '#333',
                            }}
                            type={v.icon}
                          />
                        </Link>
                      </li>
                    );
                  })
                : ''}
              {
              <li className={`${styles['header__nav-item___MQLXP']}`}>
                <Icon
                  onClick={() => this.toggleMenuMobile()}
                  type="ellipsis"
                  style={
                    this.props.myprops.menu_header_mobile
                      ? { display: 'block', fontSize: '25px', color: '#FFA229' }
                      : { display: 'block', fontSize: '25px', color: '#333' }
                  }
                />
              </li>
              }
            </ul>
            */}
            </div>
            <div className={activeMenu ? `${styles['active-menu']} ${styles.nav}` : styles.nav}>
              <ul>
                {this.state.menu.length > 0
                  ? this.state.menu.map((v, i) => {
                      return (
                        <li key={i}>
                          <Link className={styles['list-item-menu-mobile']} to={v.path}>
                            <Icon style={{ paddingRight: '10px' }} type={v.icon} />
                            {v.name}
                          </Link>
                        </li>
                      );
                    })
                  : ''}
                <li
                  style={{ borderBottom: '1px solid #333' }}
                  onClick={() => this.handleClickLogout()}
                >
                  <div className={styles['list-item-menu-mobile']}>
                    <Icon style={{ paddingRight: '10px' }} type="poweroff" />
                    Đăng xuất
                  </div>
                </li>
              </ul>
            </div>
          </nav>
        )}
        <div />
      </div>
    );
  }
}
export default GlobalHeader;
