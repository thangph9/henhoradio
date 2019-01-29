/* eslint-disable react/sort-comp */
/* eslint-disable prefer-destructuring */
/* eslint-disable react/no-did-update-set-state */
/* eslint-disable arrow-body-style */
/* eslint-disable react/no-array-index-key */
/* eslint-disable class-methods-use-this */
/* eslint-disable react/no-multi-comp */
/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable react/no-unused-state */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable no-param-reassign */
/* eslint-disable no-useless-escape */
/* eslint-disable react/jsx-no-undef */
/* eslint-disable dot-notation */
/* eslint-disable prefer-template */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Redirect } from 'react-router-dom';
import { Form, Input, Icon, Button, Popover, Progress, Select, message } from 'antd';
// import {Link} from 'react-router-dom'
import styles from './styles.less';

const { Option } = Select;

@connect(({ loading, authentication }) => ({
  submitting: loading.effects['form/submitRegularForm'],
  authentication,
}))
@Form.create()
class FormLogin extends PureComponent {
  handleSubmit = e => {
    e.preventDefault();
    const { form } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        this.props.dispatch({
          type: 'authentication/login',
          payload: values,
        });
      }
    });
  };

  handleChange = value => {
    this.setState({ value });
  };

  render() {
    // eslint-disable-next-line react/destructuring-assignment
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSubmit}>
        <Form.Item label="Số điện thoại" style={{ marginBottom: '0px' }}>
          {getFieldDecorator('phone', {
            rules: [
              {
                required: true,
                message: 'Yêu cầu nhập số điện thoại',
              },
              {
                pattern: /\d{9}$/,
                message: 'Nhập sai định dạng hoặc chưa đủ chữ số！',
              },
            ],
          })(<Input />)}
        </Form.Item>
        <Form.Item label="Mật khẩu">
          {getFieldDecorator('password', {
            rules: [
              {
                required: true,
                message: 'Vui lòng nhập mật khẩu!',
              },
            ],
          })(<Input type="password" />)}
        </Form.Item>
        <Form.Item>
          <Button
            size="large"
            type="primary"
            style={{
              background: '#45c000',
              borderColor: '#45c000',
              color: '#fff',
              borderRadius: '30px',
            }}
            htmlType="submit"
            block
          >
            Đăng nhập
          </Button>
        </Form.Item>
        <a href="/forgot">Quên mật khẩu?</a>
      </Form>
    );
  }
}
const passwordStatusMap = {
  ok: <div className={styles.success}>Mức độ：Mạnh</div>,
  pass: <div className={styles.warning}>Mức độ：Vừa</div>,
  poor: <div className={styles.error}>Mức độ：Yếu</div>,
};
const passwordProgressMap = {
  ok: 'success',
  pass: 'normal',
  poor: 'exception',
};
@connect(({ loading }) => ({
  submitting: loading.effects['form/submitRegularForm'],
}))
@Form.create()
class FormRegister extends PureComponent {
  state = {
    visible: false,
    help: '',
    month_selected: [],
    year: [
      2019,
      2018,
      2017,
      2016,
      2015,
      2014,
      2013,
      2012,
      2011,
      2010,
      2009,
      2008,
      2007,
      2006,
      2005,
      2004,
      2003,
      2002,
      2001,
      2000,
      1999,
      1998,
      1997,
      1996,
      1995,
      1994,
      1993,
      1992,
      1991,
      1990,
      1989,
      1988,
      1987,
      1986,
      1985,
      1984,
      1983,
      1982,
      1981,
      1980,
      1979,
      1978,
      1977,
      1976,
      1975,
      1974,
      1973,
      1972,
      1971,
      1970,
      1969,
      1968,
      1967,
      1966,
      1965,
      1964,
      1963,
      1962,
      1961,
      1960,
      1959,
      1958,
      1957,
      1956,
      1955,
      1954,
      1953,
      1952,
      1951,
      1950,
      1949,
      1948,
      1947,
      1946,
      1945,
      1944,
      1943,
      1942,
      1941,
      1940,
      1939,
      1938,
      1937,
      1936,
      1935,
      1934,
      1933,
      1932,
      1931,
      1930,
      1929,
    ],
    month: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    day_in_month_full: [
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      12,
      13,
      14,
      15,
      16,
      17,
      18,
      19,
      20,
      21,
      22,
      23,
      24,
      25,
      26,
      27,
      28,
      29,
      30,
      31,
    ],
    day_in_month_short: [
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      12,
      13,
      14,
      15,
      16,
      17,
      18,
      19,
      20,
      21,
      22,
      23,
      24,
      25,
      26,
      27,
      28,
      29,
      30,
    ],
    day_in_february_normal: [
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      12,
      13,
      14,
      15,
      16,
      17,
      18,
      19,
      20,
      21,
      22,
      23,
      24,
      25,
      26,
      27,
      28,
    ],
    day_in_february_profit: [
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      12,
      13,
      14,
      15,
      16,
      17,
      18,
      19,
      20,
      21,
      22,
      23,
      24,
      25,
      26,
      27,
      28,
      29,
    ],
  };

  getPasswordStatus = () => {
    const { form } = this.props;
    const value = form.getFieldValue('password');
    if (value && value.length > 9) {
      return 'ok';
    }
    if (value && value.length > 5) {
      return 'pass';
    }
    return 'poor';
  };

  handleSubmit = e => {
    e.preventDefault();
    const { form } = this.props;
    // const email = this.props.form.getFieldValue('email');
    // const filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    // if (!filter.test(email)) {
    // return;
    // }
    const day = this.props.form.getFieldValue('day');
    const month = this.props.form.getFieldValue('month');
    const year = this.props.form.getFieldValue('year');
    const gender = this.props.form.getFieldValue('gender');
    if (!gender) {
      this.props.form.setFields({
        gender: {
          errors: [new Error('Chọn giới tính!')],
        },
      });
    }
    if (!day || !month || !year) {
      this.props.form.setFields({
        day: {
          errors: [new Error('Chọn đầy đủ ngày sinh!')],
        },
      });
    }
    form.validateFields((err, values) => {
      // if (this.state.value.length > 0) {
      if (values.password === values.repassword) {
        if (!err && day && month && year && gender) {
          this.props.dispatch({
            type: 'authentication/register',
            payload: values,
          });
        }
      }
      // }
    });
  };

  checkPassword = (rule, value, callback) => {
    const { visible, confirmDirty } = this.state;
    if (!value) {
      this.setState({
        help: 'Nhập mật khẩu！',
        visible: !!value,
      });
      callback('error');
    } else {
      this.setState({
        help: '',
      });
      if (!visible) {
        this.setState({
          visible: !!value,
        });
      }
      if (value.length < 6) {
        callback('error');
      } else {
        const { form } = this.props;
        if (value && confirmDirty) {
          form.validateFields(['confirm'], { force: true });
        }
        callback();
      }
    }
  };

  handleChange = value => {
    this.setState({ value });
  };

  renderPasswordProgress = () => {
    const { form } = this.props;
    const value = form.getFieldValue('password');
    const passwordStatus = this.getPasswordStatus();
    return value && value.length ? (
      <div className={styles[`progress-${passwordStatus}`]}>
        <Progress
          status={passwordProgressMap[passwordStatus]}
          className={styles.progress}
          strokeWidth={6}
          percent={value.length * 10 > 100 ? 100 : value.length * 10}
          showInfo={false}
        />
      </div>
    ) : null;
  };

  validEmailSync = e => {
    const { form } = this.props;
    const email = e.target.value;
    const filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    if (!filter.test(email)) {
      form.setFields({
        email: {
          value: email,
          errors: [new Error('Sai định dạng Email! Vui lòng kiểm tra lại')],
        },
      });
    }
  };

  validRepassword() {
    const { form } = this.props;
    const password = form.getFieldValue('password');
    const repassword = form.getFieldValue('repassword');
    if (password !== repassword) {
      this.props.form.setFields({
        repassword: {
          value: repassword,
          errors: [new Error('Nhập lại mật khẩu sai vui lòng kiểm tra lại!')],
        },
      });
    }
  }

  handleChangeGender(value) {
    console.log(value);
  }

  handleChangeDay(value) {
    console.log(value);
  }

  handleChangeMonth(value) {
    const year = this.props.form.getFieldValue('year');
    if (year % 4 === 0 && value === 2) {
      this.setState(
        {
          month_selected: this.state.day_in_february_profit,
        },
        () => {
          const day = this.props.form.getFieldValue('day');
          if (day > 29) {
            this.props.form.setFieldsValue({
              day: 1,
            });
          }
        }
      );
      return;
    }
    if (value === 2) {
      this.setState(
        {
          month_selected: this.state.day_in_february_normal,
        },
        () => {
          const day = this.props.form.getFieldValue('day');
          if (day > 28) {
            this.props.form.setFieldsValue({
              day: 1,
            });
          }
        }
      );
      return;
    }
    if (
      value === 1 ||
      value === 3 ||
      value === 5 ||
      value === 7 ||
      value === 8 ||
      value === 10 ||
      value === 12
    ) {
      this.setState({
        month_selected: this.state.day_in_month_full,
      });
      return;
    }
    if (value === 4 || value === 6 || value === 9 || value === 11) {
      this.setState(
        {
          month_selected: this.state.day_in_month_short,
        },
        () => {
          const day = this.props.form.getFieldValue('day');
          if (day > 30) {
            this.props.form.setFieldsValue({
              day: 1,
            });
          }
        }
      );
    }
  }

  handleChangeYear(value) {
    const month = this.props.form.getFieldValue('month');
    if (value % 4 === 0 && month === 2) {
      this.setState(
        {
          month_selected: this.state.day_in_february_profit,
        },
        () => {
          const day = this.props.form.getFieldValue('day');
          if (day > 29) {
            this.props.form.setFieldsValue({
              day: 1,
            });
          }
        }
      );
      return;
    }
    if (month === 2) {
      this.setState(
        {
          month_selected: this.state.day_in_february_normal,
        },
        () => {
          const day = this.props.form.getFieldValue('day');
          if (day > 28) {
            this.props.form.setFieldsValue({
              day: 1,
            });
          }
        }
      );
    }
  }

  handleChangeIntent(value) {
    console.log(value);
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { help, visible } = this.state;
    return (
      <Form onSubmit={this.handleSubmit}>
        <Form.Item
          label="Tên"
          style={{ width: '45%', display: 'inline-block', marginBottom: '0px' }}
        >
          {getFieldDecorator('name', {
            rules: [
              {
                required: true,
                message: 'Nhập tên bạn',
              },
            ],
          })(<Input placeholder="Ví dụ bạn là Trí" />)}
        </Form.Item>
        <Form.Item
          label="Giới tính"
          style={{ width: '45%', display: 'inline-block', float: 'right', marginBottom: '0px' }}
        >
          {getFieldDecorator('gender', {
            required: true,
            message: 'Nhập giới tính',
          })(
            <Select placeholder="Bạn là..." onChange={e => this.handleChangeGender(e)}>
              <Option value="men">Nam</Option>
              <Option value="woman">Nữ</Option>
            </Select>
          )}
        </Form.Item>
        <Form.Item label="Ngày sinh" style={{ marginBottom: '0px' }}>
          {getFieldDecorator('day', {})(
            <Select
              style={{ width: '30%' }}
              placeholder="Ngày"
              onChange={e => this.handleChangeDay(e)}
            >
              {this.state.month_selected.length > 0
                ? this.state.month_selected.map((v, i) => {
                    return (
                      <Option key={i} value={v}>
                        {v}
                      </Option>
                    );
                  })
                : this.state.day_in_month_full.map((v, i) => {
                    return (
                      <Option key={i} value={v}>
                        {v}
                      </Option>
                    );
                  })}
            </Select>
          )}
          {getFieldDecorator('month', {})(
            <Select
              style={{ width: '30%', marginLeft: '16px' }}
              placeholder="Tháng"
              onChange={e => this.handleChangeMonth(e)}
            >
              {this.state.month.map((v, i) => {
                return (
                  <Option key={i} value={v}>
                    {v}
                  </Option>
                );
              })}
            </Select>
          )}
          {getFieldDecorator('year', {})(
            <Select
              style={{ width: '30%', float: 'right' }}
              placeholder="Năm"
              onChange={e => this.handleChangeYear(e)}
            >
              {this.state.year.map((v, i) => {
                return (
                  <Option key={i} value={v}>
                    {v}
                  </Option>
                );
              })}
            </Select>
          )}
        </Form.Item>
        <Form.Item
          label="Địa chỉ"
          style={{ width: '45%', display: 'inline-block', marginBottom: '0px' }}
        >
          {getFieldDecorator('address', {
            rules: [
              {
                required: true,
                message: 'Yêu cầu nhập địa chỉ',
              },
            ],
          })(<Input placeholder="Ví dụ Hà Nội" />)}
        </Form.Item>
        <Form.Item
          label="Bạn ở đây để"
          style={{ width: '45%', display: 'inline-block', float: 'right', marginBottom: '0px' }}
        >
          {getFieldDecorator('intent', {})(
            <Select placeholder="Chọn..." onChange={e => this.handleChangeIntent(e)}>
              <Option value="chat">Chat</Option>
              <Option value="pal">Kết bạn</Option>
              <Option value="dating">Hẹn hò</Option>
            </Select>
          )}
        </Form.Item>
        <Form.Item label="Số điện thoại" style={{ marginBottom: '0px' }}>
          {getFieldDecorator('phone', {
            rules: [
              {
                required: true,
                message: 'Yêu cầu nhập số điện thoại',
              },
              {
                pattern: /\d{9}$/,
                message: 'Nhập sai định dạng hoặc chưa đủ chữ số！',
              },
            ],
          })(<Input placeholder="Số điện thoại là tài khoản đăng nhập" />)}
        </Form.Item>
        <Form.Item help={help} label="Mật khẩu" style={{ marginBottom: '0px' }}>
          <Popover
            content={
              <div style={{ padding: '4px 0' }}>
                {passwordStatusMap[this.getPasswordStatus()]}
                {this.renderPasswordProgress()}
                <div style={{ marginTop: 10 }}>Mât khẩu ít nhất 6 ký tự</div>
              </div>
            }
            overlayStyle={{ width: 240 }}
            placement="right"
            visible={visible}
          >
            {getFieldDecorator('password', {
              rules: [
                {
                  validator: this.checkPassword,
                },
              ],
            })(<Input type="password" placeholder="Tối thiểu 6 ký tự" />)}
          </Popover>
        </Form.Item>
        <Form.Item label="Nhập lại">
          {getFieldDecorator('repassword', {
            rules: [
              {
                required: true,
                message: 'Nhập lại mật khẩu!',
              },
            ],
          })(
            <Input
              onBlur={e => this.validRepassword(e)}
              type="password"
              placeholder="Nhập lại mật khẩu"
            />
          )}
        </Form.Item>

        <Form.Item>
          <Button
            size="large"
            type="primary"
            style={{
              background: '#45c000',
              borderColor: '#45c000',
              color: '#fff',
              borderRadius: '30px',
            }}
            htmlType="submit"
            block
          >
            Đăng ký
          </Button>
        </Form.Item>
      </Form>
    );
  }
}

// eslint-disable-next-line react/no-multi-comp
@connect(({ loading, authentication }) => ({
  submitting: loading.effects['form/submitRegularForm'],
  authentication,
}))
class Login extends PureComponent {
  state = {
    statusPage: false,
  };

  componentDidMount() {
    if (this.props.location.query.ref === '0') {
      this.setState({
        statusPage: false,
      });
    }
    if (this.props.location.query.ref === '1') {
      this.setState({
        statusPage: true,
      });
    }
  }

  handleClickToggleStatus() {
    this.setState(
      {
        statusPage: !this.state.statusPage,
      },
      () => {
        const pathname = this.props.location.pathname;
        if (this.state.statusPage === false) {
          this.props.history.push({ pathname, search: '?ref=0' });
        } else this.props.history.push({ pathname, search: '?ref=1' });
      }
    );
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.authentication.login !== nextProps.authentication.login) {
      if (
        nextProps.authentication.login.status === 'error' &&
        nextProps.authentication.login.timeline !== this.props.authentication.login.timeline
      ) {
        message.warning(nextProps.authentication.login.message);
      }
    }
    if (this.props.authentication.register !== nextProps.authentication.register) {
      if (nextProps.authentication.register.status === 'ok') {
        console.log(nextProps);
        nextProps.history.push({ pathname: '/registerresult' });
      }
    }
  }

  render() {
    if (localStorage['antd-pro-authority'] && localStorage.token) {
      return <Redirect to="/home" />;
    }
    return (
      <div id="wrapper" style={{ position: 'relative' }} className={styles['homepageRegister']}>
        <div
          className={
            styles['tw3-homepage--abstract'] + ' ' + styles['tw3-homepage--abstract--mobile']
          }
        >
          <div
            className={
              styles['homepageContainer__content__form'] + ' ' + styles['registerContainer']
            }
          >
            <div className={styles['tw3-pane'] + ' ' + styles['tw3-pane--left']}>
              <div className={styles['tw3-pane__content']}>
                <div className={styles['logo']}>
                  <img
                    alt="img"
                    src="https://twoo-a.akamaihd.net/static/682503600911326952191/images/logos/logo-twoo-flat-white@2x.png"
                    height={42}
                  />
                </div>

                <h1
                  style={{ color: '#fff' }}
                  className={styles['h1--step1'] + ' ' + styles['fw500']}
                >
                  Chat với bạn <strong>mới</strong> khắp thế giới.
                </h1>
                <div
                  style={{ background: 'none' }}
                  className={
                    styles['tw3-homepage--abstract--mobile__tabs'] + ' ' + styles['tw3-tabsHolder']
                  }
                >
                  <span
                    style={{ cursor: 'pointer' }}
                    onClick={() => this.handleClickToggleStatus()}
                    className={
                      this.state.statusPage === true
                        ? styles['tw3-tab'] +
                          ' ' +
                          styles['jsHomepageSwitch'] +
                          ' ' +
                          styles['selected']
                        : styles['tw3-tab'] + ' ' + styles['jsHomepageSwitch']
                    }
                  >
                    ĐĂNG KÝ
                  </span>
                  <span
                    style={{ cursor: 'pointer' }}
                    onClick={() => this.handleClickToggleStatus()}
                    className={
                      this.state.statusPage === false
                        ? styles['tw3-tab'] +
                          ' ' +
                          styles['jsHomepageSwitch'] +
                          ' ' +
                          styles['selected']
                        : styles['tw3-tab'] + ' ' + styles['jsHomepageSwitch']
                    }
                  >
                    ĐĂNG NHẬP
                  </span>
                </div>
              </div>
            </div>
            <div className={styles['tw3-pane'] + ' ' + styles['tw3-pane--right']}>
              <div className={styles['tw3-pane__content']}>
                <div
                  className={
                    styles['divider'] +
                    ' ' +
                    styles['hor'] +
                    ' ' +
                    styles['full'] +
                    ' ' +
                    styles['mb--default']
                  }
                >
                  <span>
                    {this.state.statusPage === false
                      ? 'Đăng nhập bằng số điện thoại'
                      : 'Đăng ký tài khoản mới'}
                  </span>
                </div>
                {this.state.statusPage === false ? (
                  <FormLogin {...this.props} />
                ) : (
                  <FormRegister {...this.props} />
                )}
              </div>
            </div>
          </div>
        </div>
        <div
          className={
            styles['tw3-homepage--abstract'] + ' ' + styles['tw3-homepage--abstract--desktop']
          }
        >
          <div className={styles['homepageLinks'] + ' ' + styles['homepageLinks--top']}>
            <div className={styles['homepageLinks--top__left']}>
              <Icon
                style={{ fontSize: '30px', marginRight: '10px', color: '#fff' }}
                type="facebook"
                theme="filled"
                className="icon-login-page"
              />
              <Icon
                style={{ fontSize: '30px', marginRight: '10px', color: '#fff' }}
                type="instagram"
                theme="filled"
                className="icon-login-page"
              />
            </div>
            <div className={styles['homepageLinks--top__right']}>
              <span
                onClick={() => this.handleClickToggleStatus()}
                className={
                  styles['tw3-button'] +
                  ' ' +
                  styles['tw3-button--orange'] +
                  ' ' +
                  styles['tw3-button--rounded'] +
                  ' ' +
                  styles['loginButton']
                }
                data-page="login"
              >
                {this.state.statusPage === false ? 'Đăng ký' : 'Đăng nhập'}
              </span>
            </div>
          </div>
          <div
            className={
              styles['homepageContainer__content__form'] + ' ' + styles['registerContainer']
            }
          >
            <div className={styles['tw3-pane'] + ' ' + styles['tw3-pane--left']}>
              <div className={styles['tw3-pane__content']}>
                <div className={styles['logo']}>
                  <img
                    alt="img"
                    src="https://twoo-a.akamaihd.net/static/682503600911326952191/images/logos/logo-twoo-flat-white@2x.png"
                    height={42}
                  />
                </div>

                <h1
                  style={{ color: '#fff' }}
                  className={styles['h1--step1'] + ' ' + styles['fw500']}
                >
                  Chat với bạn <strong>mới</strong> khắp thế giới.
                </h1>
                <p className={styles['mb--slack']}>
                  Gặp hàng triệu người từ khắp nơi bất kể bạn ở đâu. Chat vui vẻ, kết bạn và tìm một
                  nửa của mình. Bởi vì cuộc đời chính là những người bạn gặp gỡ.
                </p>
              </div>
            </div>
            <div className={styles['tw3-pane'] + ' ' + styles['tw3-pane--right']}>
              <div className={styles['tw3-pane__content']}>
                <div
                  className={
                    styles['divider'] +
                    ' ' +
                    styles['hor'] +
                    ' ' +
                    styles['full'] +
                    ' ' +
                    styles['mb--default']
                  }
                >
                  <span>
                    {this.state.statusPage === false
                      ? 'Đăng nhập bằng số điện thoại'
                      : 'Đăng ký tài khoản mới'}
                  </span>
                </div>
                {this.state.statusPage === false ? (
                  <FormLogin {...this.props} />
                ) : (
                  <FormRegister {...this.props} />
                )}
              </div>
            </div>
          </div>
        </div>
        <div
          style={{ background: '#fff', height: 0 }}
          className={styles['homepageLinks'] + ' ' + styles['homepageLinks--bottom']}
        >
          <div className={styles['homepageLinks--bottom__links']}>
            <ul>
              <li>
                <a href="/about">Thông tin</a>
              </li>
              <li>
                <a href="http://www.massivemedia.eu">Việc làm</a>
              </li>
              <li>
                <a href="/download">Ứng dụng</a>
              </li>
              <li>
                <a href="/faq">Hỏi đáp</a>
              </li>
              <li>
                <a href="/about/terms">Đ. khoản &amp; Đ. kiện</a>
              </li>
              <li>
                <a href="/about/privacy">Riêng tư</a>
              </li>
              <li>
                <a href="/about/cookie">Cookie</a>
              </li>
              <li>
                <a href="/about/safety">An toàn</a>
              </li>
              <li>
                <a href="https://www.twoo.com/blog">Blog</a>
              </li>
            </ul>
          </div>
          <div className={styles['homepageLinks--bottom__counter']}>
            <h1 style={{ color: '#fff' }} className={styles['newFontSize']}>
              1.821.475.870
            </h1>
            <p style={{ color: '#fff' }}>trò chuyện trên Twoo</p>
          </div>
        </div>
      </div>
    );
  }
}

export default Login;
