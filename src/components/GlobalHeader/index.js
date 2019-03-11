import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';
import Debounce from 'lodash-decorators/debounce';
import { Icon, Avatar, Button } from 'antd';
import styles from './styles.less';

// eslint-disable-next-line no-undef

class GlobalHeader extends PureComponent {
  state = {};

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
  componentWillReceiveProps(nextProps) {
    if (nextProps.myprops.menu_header !== this.props.myprops.menu_header) {
      this.setState({
        open: nextProps.myprops.menu_header,
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
  render() {
    return (
      <div className={`${styles.header__header___1t3MH}`}>
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
              className={`${styles['hidden-md-up']} ${styles['header__my-navbar-toggler___2PiaS']}`}
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
              className={`${styles['clearfix']} ${styles['collapse']} ${
                styles['header__navbar-collapse___2AK1h']
              }`}
            >
              <Link
                to={`/home`}
                className={`${styles['hidden-md-up']} ${styles['header__navbar-brand___SzzgD']}`}
              >
                <img src="https://twoo-a.akamaihd.net/static/7156520574362430695506/images/logos/logo-twoo-flat@2x.png" />
              </Link>
              <ul
                className={`${styles['hidden-md-down']} ${styles['header__navbar-nav___9cfBy']} ${
                  styles['header__navbar-left___25OFe']
                }`}
              >
                <li className={`${styles['header__nav-item___MQLXP']}`}>
                  <Link
                    style={{ textDecoration: 'none' }}
                    to={`/Amazon`}
                    className={`${styles['header__nav-link___3W4sc']}`}
                  >
                    <Icon
                      style={{ display: 'block', fontSize: '20px', marginBottom: '2px' }}
                      type="like"
                    />
                    Khám phá
                  </Link>
                </li>
                <li className={`${styles['header__nav-item___MQLXP']}`}>
                  <Link
                    style={{ textDecoration: 'none' }}
                    to={`/ebay`}
                    className={`${styles['header__nav-link___3W4sc']}`}
                  >
                    <Icon
                      style={{ display: 'block', fontSize: '20px', marginBottom: '2px' }}
                      type="search"
                    />
                    Tìm kiếm
                  </Link>
                </li>
                <li className={`${styles['header__nav-item___MQLXP']}`}>
                  <Link
                    style={{ textDecoration: 'none' }}
                    to={`/adidas`}
                    className={`${styles['header__nav-link___3W4sc']}`}
                  >
                    <Icon
                      style={{ display: 'block', fontSize: '20px', marginBottom: '2px' }}
                      type="message"
                    />
                    Chat
                  </Link>
                </li>
                <li className={`${styles['header__nav-item___MQLXP']}`}>
                  <Link
                    style={{ textDecoration: 'none' }}
                    to={`/nike`}
                    className={`${styles['header__nav-link___3W4sc']}`}
                  >
                    <Icon
                      style={{ display: 'block', fontSize: '20px', marginBottom: '2px' }}
                      type="heart"
                    />
                    Người thích bạn
                  </Link>
                </li>
                <li className={`${styles['header__nav-item___MQLXP']}`}>
                  <Link
                    style={{ textDecoration: 'none' }}
                    to={`/nike`}
                    className={`${styles['header__nav-link___3W4sc']}`}
                  >
                    <Icon
                      style={{ display: 'block', fontSize: '20px', marginBottom: '2px' }}
                      type="eye"
                    />
                    Khách thăm
                  </Link>
                </li>
                <li className={`${styles['header__nav-item___MQLXP']}`}>
                  <Link
                    style={{ textDecoration: 'none' }}
                    to={`/nike`}
                    className={`${styles['header__nav-link___3W4sc']}`}
                  >
                    <Icon
                      style={{ display: 'block', fontSize: '20px', marginBottom: '2px' }}
                      type="team"
                    />
                    Bạn bè
                  </Link>
                </li>
              </ul>
              <ul
                style={{ top: '-5px' }}
                className={`${styles['header__navbar-nav___9cfBy']} ${
                  styles['header__navbar-right___2_zf5']
                }`}
              >
                <li
                  style={{ marginLeft: '10px' }}
                  className={`${styles['header__nav-item___MQLXP']}`}
                >
                  <div className={`${styles['auth-buttons__auth___33bfZ']}`}>
                    <span
                      style={{ cursor: 'pointer', paddingTop: '10px' }}
                      className={`${styles['auth-buttons__nav-link___1DCMU']} ${
                        styles['auth-buttons__btn-sign-in___1nV-O']
                      } ${styles['hiden-md']}`}
                      href="/auth/signin?redirect=/"
                    >
                      <Button
                        type="primary"
                        style={{
                          background: '#4CAF50',
                          borderColor: '#4CAF50',
                          color: '#fff',
                          borderRadius: '20px',
                          fontSize: '12px',
                        }}
                        block
                      >
                        Gói cao cấp
                      </Button>
                    </span>
                  </div>
                </li>
                <li
                  style={{ marginLeft: '10px' }}
                  className={`${styles['header__nav-item___MQLXP']}`}
                >
                  <div className={`${styles['auth-buttons__auth___33bfZ']}`}>
                    <span
                      style={{ cursor: 'pointer', paddingTop: '10px', marginRight: '20px' }}
                      className={`${styles['auth-buttons__nav-link___1DCMU']} ${
                        styles['auth-buttons__btn-sign-in___1nV-O']
                      } ${styles['hiden-md']} color-thunder`}
                      href="/auth/signin?redirect=/"
                    >
                      <Button
                        icon="thunderbolt"
                        type="primary"
                        style={{
                          background: '#fff',
                          borderColor: '#6d7c85',
                          color: '#6d7c85',
                          borderRadius: '20px',
                          fontSize: '12px',
                        }}
                        block
                      >
                        Tín dụng
                      </Button>
                    </span>
                  </div>
                </li>
                <li className={`${styles['header__nav-item___MQLXP']}`}>
                  <div className={`${styles['auth-buttons__auth___33bfZ']}`}>
                    <Link
                      style={{ cursor: 'pointer', paddingTop: '13px' }}
                      className={`${styles['auth-buttons__nav-link___1DCMU']} ${
                        styles['auth-buttons__btn-sign-in___1nV-O']
                      }`}
                      to="/home/profile"
                    >
                      <Avatar style={{ backgroundColor: '#f9f9f9' }} size={30} icon="user" />
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
            </div>
          </div>
        </nav>

        <nav
          style={{ height: '52px' }}
          className={`${styles['hidden-lg-up']} ${
            styles['header__mobile-nav-cat-container___2JTtk']
          } ${styles['cate-show']}`}
          id={`${styles['cate-mobile-root']}`}
        >
          <div
            style={{ height: '100%' }}
            className={`${styles['container__container___1fvX0']} ${
              styles['header__padding-remove___uM9bo']
            }`}
          >
            <ul
              style={{ height: '100%' }}
              className={`${styles['header__mobile-nav-cat___1wJ9O']} ${styles['item-align']}`}
            >
              <li className={`${styles['header__nav-item___MQLXP']}`}>
                <Icon
                  style={{ display: 'block', fontSize: '27px', marginBottom: '2px' }}
                  type="like"
                />
              </li>
              <li className={`${styles['header__nav-item___MQLXP']}`}>
                <Icon
                  style={{ display: 'block', fontSize: '27px', marginBottom: '2px' }}
                  type="search"
                />
              </li>
              <li className={`${styles['header__nav-item___MQLXP']}`}>
                <Icon
                  style={{ display: 'block', fontSize: '27px', marginBottom: '2px' }}
                  type="message"
                />
              </li>
              <li className={`${styles['header__nav-item___MQLXP']}`}>
                <Icon style={{ display: 'block', fontSize: '27px' }} type="bell" />
              </li>
              <li className={`${styles['header__nav-item___MQLXP']}`}>
                <Icon
                  onClick={() => this.toggleMenuMobile()}
                  type="ellipsis"
                  style={
                    this.props.myprops.menu_header_mobile
                      ? { display: 'block', fontSize: '25px', color: '#FFA229' }
                      : { display: 'block', fontSize: '25px' }
                  }
                />
              </li>
            </ul>
          </div>
        </nav>
        <div />
      </div>
    );
  }
}
export default GlobalHeader;

export class MenuMobile extends PureComponent {
  handleClickLogout() {
    localStorage.removeItem('antd-pro-authority');
    localStorage.removeItem('token');
    this.props.history.push({ pathname: '/' });
  }
  render() {
    return (
      <ul className={styles['ul-menu-mobile']}>
        <li className={styles['li-link']}>
          <Link
            to="/home/profile"
            className={styles['row']}
            style={{ width: '100%', padding: '19px' }}
          >
            <div className={styles['w-12']}>
              <Icon style={{ fontSize: '25px' }} type="user" />
            </div>
            <div className={styles['w-88']}>Sơ yếu</div>
          </Link>
        </li>
        <li className={styles['li-link']}>
          <Link to="/home" className={styles['row']} style={{ width: '100%', padding: '19px' }}>
            <div className={styles['w-12']}>
              <Icon style={{ fontSize: '25px' }} type="heart" />
            </div>
            <div className={styles['w-88']}>Người thích bạn</div>
          </Link>
        </li>
        <li className={styles['li-link']}>
          <Link to="/home" className={styles['row']} style={{ width: '100%', padding: '19px' }}>
            <div className={styles['w-12']}>
              <Icon style={{ fontSize: '25px' }} type="eye" />
            </div>
            <div className={styles['w-88']}>Khách thăm</div>
          </Link>
        </li>
        <li className={styles['li-link']}>
          <Link to="/home" className={styles['row']} style={{ width: '100%', padding: '19px' }}>
            <div className={styles['w-12']}>
              <Icon style={{ fontSize: '25px' }} type="team" />
            </div>
            <div className={styles['w-88']}>Bạn bè</div>
          </Link>
        </li>
        <li className={styles['li-link']}>
          <Link to="/home" className={styles['row']} style={{ width: '100%', padding: '19px' }}>
            <div className={styles['w-12']}>
              <Icon style={{ fontSize: '25px' }} type="check-circle" />
            </div>
            <div className={styles['w-88']}>Người bạn thích</div>
          </Link>
        </li>
        <li className={styles['li-link']}>
          <Link to="/home" className={styles['row']} style={{ width: '100%', padding: '19px' }}>
            <div className={styles['w-12']}>
              <Icon style={{ fontSize: '25px' }} type="heart" />
            </div>
            <div className={styles['w-88']}>Người phù hợp với bạn</div>
          </Link>
        </li>
        <li className={styles['li-link']}>
          <Link to="/home" className={styles['row']} style={{ width: '100%', padding: '19px' }}>
            <div className={styles['w-12']}>
              <Icon style={{ fontSize: '25px' }} type="smile" />
            </div>
            <div className={styles['w-88']}>Gây Chú ý</div>
          </Link>
        </li>
        <li className={styles['li-link']}>
          <Link to="/home" className={styles['row']} style={{ width: '100%', padding: '19px' }}>
            <div className={styles['w-12']}>
              <Icon style={{ fontSize: '25px' }} type="thunderbolt" />
            </div>
            <div className={styles['w-88']}>Tín dụng</div>
          </Link>
        </li>
        <li className={styles['li-link']}>
          <Link to="/home" className={styles['row']} style={{ width: '100%', padding: '19px' }}>
            <div className={styles['w-12']}>
              <Icon style={{ fontSize: '25px' }} type="plus" />
            </div>
            <div className={styles['w-88']}>Mua gói cao cấp</div>
          </Link>
        </li>
        <li onClick={() => this.handleClickLogout()} className={styles['li-link']}>
          <Link to="/" className={styles['row']} style={{ width: '100%', padding: '19px' }}>
            <div className={styles['w-12']}>
              <Icon style={{ fontSize: '25px' }} type="poweroff" />
            </div>
            <div className={styles['w-88']}>Đăng xuất</div>
          </Link>
        </li>
      </ul>
    );
  }
}
