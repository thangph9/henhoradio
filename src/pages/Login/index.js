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
import { Form, Input, Icon, Button, Popover, Progress } from 'antd';
// import {Link} from 'react-router-dom'

import styles from './styles.less';

@connect(({ loading, authentication }) => ({
  submitting: loading.effects['form/submitRegularForm'],
  authentication,
}))
@Form.create()
class FormLogin extends PureComponent {
  handleSubmit = e => {
    e.preventDefault();
    const { form } = this.props;
    const email = form.getFieldValue('username');
    const filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    if (!filter.test(email)) {
      return;
    }
    form.validateFields((err, values) => {
      if (!err) {
        console.log(values);
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

  handleBlurEmail(e) {
    const email = e.target.value;
    const filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    if (!filter.test(email)) {
      this.props.form.setFields({
        username: {
          value: email,
          errors: [new Error('Sai định dạng Email! Vui lòng kiểm tra lại')],
        },
      });
    }
  }

  render() {
    // eslint-disable-next-line react/destructuring-assignment
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSubmit}>
        <Form.Item>
          {getFieldDecorator('username', {
            rules: [
              {
                required: true,
                message: 'Vui lòng nhập Email!',
              },
            ],
          })(
            <Input size="large" placeholder="Tên đăng nhập" onBlur={e => this.handleBlurEmail(e)} />
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('password', {
            rules: [
              {
                required: true,
                message: 'Vui lòng nhập mật khẩu!',
              },
            ],
          })(<Input type="password" size="large" placeholder="Mật khẩu" />)}
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Đăng nhập
          </Button>
        </Form.Item>
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
    const email = this.props.form.getFieldValue('email');
    const filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    if (!filter.test(email)) {
      return;
    }
    form.validateFields((err, values) => {
      // if (this.state.value.length > 0) {
      if (values.password === values.repassword) {
        if (!err) {
          console.log(values);
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

  handleChangeOTP() {
    this.setState({
      help_otp: '',
      stt_otp: '',
    });
  }

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

  render() {
    const { getFieldDecorator } = this.props.form;
    const { help, visible } = this.state;
    return (
      <Form onSubmit={this.handleSubmit}>
        <Form.Item>
          {getFieldDecorator('fullname', {
            rules: [
              {
                required: true,
                message: 'Nhập họ tên',
              },
            ],
          })(<Input size="large" placeholder="Họ tên" />)}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('email', {
            rules: [
              {
                required: true,

                message: 'Sai định dạng email',
              },
            ],
          })(
            <Input
              type="text"
              size="large"
              placeholder="Email"
              onBlur={e => this.validEmailSync(e)}
            />
          )}
        </Form.Item>
        <Form.Item help={help}>
          <Popover
            content={
              <div style={{ padding: '4px 0' }}>
                {passwordStatusMap[this.getPasswordStatus()]}
                {this.renderPasswordProgress()}
                <div style={{ marginTop: 10 }}>Mât khẩu lớn hơn 6 ký tự</div>
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
            })(<Input size="large" type="password" placeholder="Mật khẩu" />)}
          </Popover>
        </Form.Item>
        <Form.Item>
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
              size="large"
              type="password"
              placeholder="Nhập lại mật khẩu"
            />
          )}
        </Form.Item>
        <Form.Item>
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
          })(<Input size="large" placeholder="Số điện thoại" />)}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('address', {
            rules: [
              {
                required: true,
                message: 'Yêu cầu nhập địa chỉ',
              },
            ],
          })(<Input size="large" placeholder="Địa chỉ" />)}
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Đăng ký
          </Button>
        </Form.Item>
      </Form>
    );
  }
}

// eslint-disable-next-line react/no-multi-comp
@connect(({ loading }) => ({
  submitting: loading.effects['form/submitRegularForm'],
}))
class Login extends PureComponent {
  state = {
    statusPage: false,
  };

  handleClickToggleStatus() {
    this.setState({
      statusPage: !this.state.statusPage,
    });
  }

  render() {
    console.log(this.props);
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
                      ? 'Đăng nhập bằng tài khoản Email'
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
              />
              <Icon
                style={{ fontSize: '30px', marginRight: '10px', color: '#fff' }}
                type="instagram"
                theme="filled"
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
                      ? 'Đăng nhập bằng tài khoản Email'
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
