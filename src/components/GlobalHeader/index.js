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
          } ${styles['header__nav-header___3lWCb']}`}
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
            <Link to={`/home`} className={`${styles['header__navbar-brand___SzzgD']}`}>
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
                    Người bạn thích
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
                      }`}
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
                      style={{ cursor: 'pointer', paddingTop: '10px' }}
                      className={`${styles['auth-buttons__nav-link___1DCMU']} ${
                        styles['auth-buttons__btn-sign-in___1nV-O']
                      }`}
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
                    <span
                      style={{ cursor: 'pointer', paddingTop: '13px' }}
                      className={`${styles['auth-buttons__nav-link___1DCMU']} ${
                        styles['auth-buttons__btn-sign-in___1nV-O']
                      }`}
                      href="/auth/signin?redirect=/"
                    >
                      <Avatar style={{ backgroundColor: '#f9f9f9' }} size={30} icon="user" />
                    </span>
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
                        style={{ display: 'block', fontSize: '25px' }}
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
          className={`${styles['hidden-lg-up']} ${
            styles['header__mobile-nav-cat-container___2JTtk']
          } ${styles['cate-show']}`}
          id={`${styles['cate-mobile-root']}`}
        >
          <div
            className={`${styles['container__container___1fvX0']} ${
              styles['header__padding-remove___uM9bo']
            }`}
          >
            <ul className={`${styles['header__mobile-nav-cat___1wJ9O']}`}>
              <li className={`${styles['header__nav-item___MQLXP']}`}>
                <Link to={`/amazon`} className={`${styles['header__nav-link___3W4sc']}`}>
                  Khám phá
                </Link>
              </li>
              <li className={`${styles['header__nav-item___MQLXP']}`}>
                <Link to={`/ebay`} className={`${styles['header__nav-link___3W4sc']}`}>
                  Tìm kiếm
                </Link>
              </li>
              <li className={`${styles['header__nav-item___MQLXP']}`}>
                <Link to={`/adidas`} className={`${styles['header__nav-link___3W4sc']}`}>
                  Chat
                </Link>
              </li>
              <li className={`${styles['header__nav-item___MQLXP']}`}>
                <Link to={`/nike`} className={`${styles['header__nav-link___3W4sc']}`}>
                  Bạn Bè
                </Link>
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
