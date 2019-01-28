import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';
import Debounce from 'lodash-decorators/debounce';
import { Icon } from 'antd';
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
                <i onClick={() => this.hanldeInfomation()} className={`${styles['ic-ic-user']}`} />
              </button>
            </div>
            <Link to={`/home`} className={`${styles['header__navbar-brand___SzzgD']}`}>
              <img
                style={{ position: 'relative', top: '6px', width: '82px', height: '23px' }}
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
                    <Icon style={{ display: 'block', fontSize: '25px' }} type="like" />
                    Khám phá
                  </Link>
                </li>
                <li className={`${styles['header__nav-item___MQLXP']}`}>
                  <Link
                    style={{ textDecoration: 'none' }}
                    to={`/ebay`}
                    className={`${styles['header__nav-link___3W4sc']}`}
                  >
                    <Icon style={{ display: 'block', fontSize: '25px' }} type="search" />
                    Tìm kiếm
                  </Link>
                </li>
                <li className={`${styles['header__nav-item___MQLXP']}`}>
                  <Link
                    style={{ textDecoration: 'none' }}
                    to={`/adidas`}
                    className={`${styles['header__nav-link___3W4sc']}`}
                  >
                    <Icon style={{ display: 'block', fontSize: '25px' }} type="message" />
                    Chat
                  </Link>
                </li>
                <li className={`${styles['header__nav-item___MQLXP']}`}>
                  <Link
                    style={{ textDecoration: 'none' }}
                    to={`/nike`}
                    className={`${styles['header__nav-link___3W4sc']}`}
                  >
                    <Icon style={{ display: 'block', fontSize: '25px' }} type="heart" />
                    Người bạn thích
                  </Link>
                </li>
                <li className={`${styles['header__nav-item___MQLXP']}`}>
                  <Link
                    style={{ textDecoration: 'none' }}
                    to={`/nike`}
                    className={`${styles['header__nav-link___3W4sc']}`}
                  >
                    <Icon style={{ display: 'block', fontSize: '25px' }} type="eye" />
                    Khách thăm
                  </Link>
                </li>
                <li className={`${styles['header__nav-item___MQLXP']}`}>
                  <Link
                    style={{ textDecoration: 'none' }}
                    to={`/nike`}
                    className={`${styles['header__nav-link___3W4sc']}`}
                  >
                    <Icon style={{ display: 'block', fontSize: '25px' }} type="team" />
                    Bạn bè
                  </Link>
                </li>
              </ul>
              <ul
                className={`${styles['header__navbar-nav___9cfBy']} ${
                  styles['header__navbar-right___2_zf5']
                }`}
              >
                {this.state.open ? (
                  <li className={`${styles['header__nav-item___MQLXP']}`}>
                    <div className={`${styles['auth-buttons__auth___33bfZ']}`}>
                      {localStorage.account ? (
                        <span
                          style={{ cursor: 'pointer' }}
                          onClick={() => this.handleOpenAccount('open')}
                          className={`${styles['auth-buttons__nav-link___1DCMU']} ${styles[
                            'auth-buttons__btn-sign-in___1nV-O'
                          ] +
                            ' ' +
                            styles['language-dropdown__dropdown-toggle___3DM4H']}`}
                        >
                          <Icon style={{ display: 'block', fontSize: '25px' }} type="user" />
                          Tài khoản
                        </span>
                      ) : (
                        <Link
                          to={'/login'}
                          className={`${styles['auth-buttons__nav-link___1DCMU']} ${
                            styles['auth-buttons__btn-sign-in___1nV-O']
                          }`}
                        >
                          Đăng nhập
                        </Link>
                      )}
                      {!localStorage.account && (
                        <Link
                          to={'/register'}
                          className={`${styles['auth-buttons__nav-link___1DCMU']} ${
                            styles['auth-buttons__btn-register___3sIO1']
                          }`}
                          href="/auth/register"
                        >
                          Tạo tài khoản
                        </Link>
                      )}
                    </div>
                    <div
                      style={{
                        position: 'absolute',
                        top: '30px',
                        left: '0px',
                        boxShadow: 'rgba(78, 89, 93, 0.15) 0px 8px 11px 0px',
                        zIndex: 10,
                        background: 'rgb(255, 255, 255)',
                        padding: '9px 0px',
                      }}
                      className="jsx-1151532622 jsx-1655770887 content"
                    >
                      <div style={{ minWidth: '159px' }}>
                        <Link
                          to={`/account/accountinformation`}
                          onClick={() => this.handleOpenAccount('open')}
                          className={
                            styles['jsx-2989784357'] +
                            ' ' +
                            styles['dropdown-item'] +
                            ' ' +
                            styles['item-login']
                          }
                        >
                          Thông tin tài khoản
                        </Link>
                        <Link
                          to={`/account/dealinday`}
                          onClick={() => this.handleOpenAccount('open')}
                          className={
                            styles['jsx-2989784357'] +
                            ' ' +
                            styles['dropdown-item'] +
                            ' ' +
                            styles['item-login']
                          }
                        >
                          Deal sốc trong ngày
                        </Link>
                        <Link
                          to={`/account/helpbuy`}
                          onClick={() => this.handleOpenAccount('open')}
                          className={
                            styles['jsx-2989784357'] +
                            ' ' +
                            styles['dropdown-item'] +
                            ' ' +
                            styles['item-login']
                          }
                          href="/vn/account/addresses"
                        >
                          Mua hộ
                        </Link>

                        <hr />
                        <div>
                          <div
                            onClick={() => this.handleClickOut()}
                            className={
                              styles['jsx-2989784357'] +
                              ' ' +
                              styles['dropdown-item'] +
                              ' ' +
                              styles['item-login']
                            }
                          >
                            Thoát
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ) : (
                  <li className={`${styles['header__nav-item___MQLXP']}`}>
                    <div className={`${styles['auth-buttons__auth___33bfZ']}`}>
                      {localStorage.account ? (
                        <span
                          style={{ cursor: 'pointer', paddingTop: '10px' }}
                          onClick={() => this.handleOpenAccount('open')}
                          className={`${styles['auth-buttons__nav-link___1DCMU']} ${
                            styles['auth-buttons__btn-sign-in___1nV-O']
                          }`}
                          href="/auth/signin?redirect=/"
                        >
                          <Icon style={{ display: 'block', fontSize: '28px' }} type="user" />
                        </span>
                      ) : (
                        <Link
                          to={'/login'}
                          className={`${styles['auth-buttons__nav-link___1DCMU']} ${
                            styles['auth-buttons__btn-sign-in___1nV-O']
                          }`}
                          href="/auth/signin?redirect=/"
                        >
                          Đăng nhập
                        </Link>
                      )}
                      {!localStorage.account && (
                        <Link
                          to={'/register'}
                          className={`${styles['auth-buttons__nav-link___1DCMU']} ${
                            styles['auth-buttons__btn-register___3sIO1']
                          }`}
                          href="/auth/register"
                        >
                          Tạo tài khoản
                        </Link>
                      )}
                    </div>
                  </li>
                )}
                <li className={`${styles['header__nav-item___MQLXP']}`}>
                  <div className={`${styles['auth-buttons__auth___33bfZ']}`}>
                    <span
                      style={{ cursor: 'pointer', paddingTop: '10px' }}
                      onClick={() => this.handleOpenAccount('open')}
                      className={`${styles['auth-buttons__nav-link___1DCMU']} ${
                        styles['auth-buttons__btn-sign-in___1nV-O']
                      }`}
                      href="/auth/signin?redirect=/"
                    >
                      <Icon style={{ display: 'block', fontSize: '28px' }} type="bell" />
                    </span>
                  </div>
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
                  Amazon
                </Link>
              </li>
              <li className={`${styles['header__nav-item___MQLXP']}`}>
                <Link to={`/ebay`} className={`${styles['header__nav-link___3W4sc']}`}>
                  Ebay
                </Link>
              </li>
              <li className={`${styles['header__nav-item___MQLXP']}`}>
                <Link to={`/adidas`} className={`${styles['header__nav-link___3W4sc']}`}>
                  Adidas
                </Link>
              </li>
              <li className={`${styles['header__nav-item___MQLXP']}`}>
                <Link to={`/nike`} className={`${styles['header__nav-link___3W4sc']}`}>
                  Nike
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
