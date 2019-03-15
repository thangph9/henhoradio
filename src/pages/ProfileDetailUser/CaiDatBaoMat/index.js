/* eslint-disable no-useless-escape */
/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable react/jsx-first-prop-new-line */
/* eslint-disable react/jsx-max-props-per-line */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-unused-vars */
/* eslint-disable class-methods-use-this */
/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable react/jsx-indent-props */
/* eslint-disable react/jsx-indent */
/* eslint-disable react/no-array-index-key */
/* eslint-disable arrow-body-style */
/* eslint-disable dot-notation */
/* eslint-disable no-undef */
/* eslint-disable no-plusplus */
/* eslint-disable react/no-unused-state */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/sort-comp */
import React, { Component } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import {
  Table,
  Icon,
  Input,
  Button,
  Skeleton,
  Radio,
  Checkbox,
  message,
  Tooltip,
  Form,
  Popover,
  Progress,
} from 'antd';
import styles from './caidatbaomat.less';

const { TextArea } = Input;
const RadioGroup = Radio.Group;
const CheckboxGroup = Checkbox.Group;
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
@connect(({ profile, loading, authentication, myprops }) => ({
  profile,
  loading: loading.effects['profile/fetchAdvanced'],
  authentication,
  myprops,
}))
@Form.create()
class CaiDatBaoMat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      help: '',
      helpRePass: '',
      checkCharPass: '',
      valiRePass: '',
      editEmail: false,
      editPhone: false,
      formPass: false,
      valuePhone: '',
      valueEmail: '',
    };
  }

  componentDidMount() {
    this.props.dispatch({
      type: 'myprops/menu_item_profile',
      payload: 1,
    });
    this.props.dispatch({
      type: 'authentication/getuser',
    });
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.authentication.getuser !== nextProps.authentication.getuser) {
      if (
        nextProps.authentication.getuser.status === 'ok' &&
        nextProps.authentication.getuser.timeline !== this.props.authentication.getuser.timeline
      ) {
        this.setState(
          {
            dataUser: nextProps.authentication.getuser.data,
          },
          () => {
            this.setState({
              avatarImage: this.state.dataUser.avatar,
            });
          }
        );
      }
    }
    if (this.props.authentication.changepass !== nextProps.authentication.changepass) {
      if (
        nextProps.authentication.changepass.status === 'ok' &&
        nextProps.authentication.changepass.timeline !==
          this.props.authentication.changepass.timeline
      ) {
        message.success('Thay đổi mật khẩu thành công ');
      }
      if (
        nextProps.authentication.changepass.status === 'error0' &&
        nextProps.authentication.changepass.timeline !==
          this.props.authentication.changepass.timeline
      ) {
        message.error('Mật khẩu cũ không chính xác! Vui lòng kiểm tra lại ');
      }
    }
    if (this.props.authentication.updatephone !== nextProps.authentication.updatephone) {
      if (
        nextProps.authentication.updatephone.status === 'ok' &&
        nextProps.authentication.updatephone.timeline !==
          this.props.authentication.updatephone.timeline
      ) {
        this.props.dispatch({
          type: 'authentication/getuser',
        });
        setTimeout(() => {
          message.success('Cập nhật số điện thoại thành công!');
        }, 500);
      }
    }
    if (this.props.authentication.updateemail !== nextProps.authentication.updateemail) {
      if (
        nextProps.authentication.updateemail.status === 'ok' &&
        nextProps.authentication.updateemail.timeline !==
          this.props.authentication.updateemail.timeline
      ) {
        this.props.dispatch({
          type: 'authentication/getuser',
        });
        setTimeout(() => {
          message.success('Cập Email thoại thành công!');
        }, 500);
      }
    }
  }

  handleSubmit = e => {
    e.preventDefault();
    const { form } = this.props;
    const repassword = form.getFieldValue('repassword');
    const newpassword = form.getFieldValue('newpassword');
    if (!repassword) {
      this.setState({
        helpRePass: 'Nhập lại mật khẩu !',
        valiRePass: 'error',
      });
    } else if (newpassword !== repassword) {
      this.setState({
        helpRePass: 'Nhập lại mật khẩu chưa đúng!',
        valiRePass: 'error',
      });
    }
    this.props.form.validateFields((err, values) => {
      if (!err) {
        if (values.repassword !== values.newpassword) {
          return;
        }
        this.props.dispatch({
          type: 'authentication/changepass',
          payload: values,
        });
      }
    });
  };

  getPasswordStatus = () => {
    const { form } = this.props;
    const value = form.getFieldValue('newpassword');
    if (value && value.length > 9) {
      return 'ok';
    }
    if (value && value.length > 5) {
      return 'pass';
    }
    return 'poor';
  };

  renderPasswordProgress = () => {
    const { form } = this.props;
    const value = form.getFieldValue('newpassword');
    const passwordStatus = this.getPasswordStatus();
    return value && value.length ? (
      <div className={styles[`progress-${passwordStatus}`]}>
        <span style={{ color: 'red' }}>{this.state.checkCharPass}</span>
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

  validRepassword() {
    const { form } = this.props;
    const password = form.getFieldValue('newpassword');
    const repassword = form.getFieldValue('repassword');
    if (password !== repassword) {
      this.setState({
        valiRePass: 'error',
        helpRePass: 'Nhập lại mật khẩu chưa đúng!',
      });
    }
  }

  checkPassword = (rule, value, callback) => {
    const { visible, confirmDirty } = this.state;
    if (!value) {
      this.setState({
        help: 'Nhập mật khẩu！',
        valiPass: 'error',
        visible: !!value,
      });
      callback('error');
    } else if (/^[a-zA-z0-9!@#$%^&*_\-=+|;:]{1,}$/.test(value) === false) {
      this.setState({
        checkCharPass: 'Mật khẩu đang chứa ký tự đặc biệt',
        help: 'Mật khẩu đang chứa ký tự đặc biệt',
        valiPass: 'error',
        visible: true,
      });
    } else {
      this.setState({
        checkCharPass: '',
        valiPass: '',
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
        this.setState({
          valiPass: 'success',
        });
        callback();
      }
    }
  };

  handleClosePass() {
    this.setState({
      visible: false,
    });
  }

  handleChangeRePass(e) {
    this.setState({
      valiRePass: '',
      helpRePass: '',
    });
    const { value } = e.target;
    const { form } = this.props;
    const password = form.getFieldValue('newpassword');
    if (password === value) {
      this.setState({
        valiRePass: 'success',
      });
    }
  }

  handleChangeEmail() {
    this.setState({
      editEmail: true,
    });
  }

  handleChangePhone() {
    this.setState({
      editPhone: true,
    });
  }

  handleDonePhone() {
    if (/^\d{10}$/.test(this.state.valuePhone) === false) {
      message.error('Số điện thoại không đúng!');
      return;
    }
    this.props.dispatch({
      type: 'authentication/updatephone',
      payload: {
        phone: this.state.valuePhone,
      },
    });
    this.setState({
      editPhone: false,
    });
  }

  handleDoneEmail() {
    if (
      /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(
        this.state.valueEmail
      ) === false
    ) {
      message.error('Email không đúng định dạng!');
      return;
    }
    this.props.dispatch({
      type: 'authentication/updateemail',
      payload: {
        email: this.state.valueEmail,
      },
    });
    this.setState({
      editEmail: false,
    });
  }

  handleChangeFormPass() {
    this.setState({
      formPass: true,
    });
  }

  handleCloseFormPass() {
    this.setState({
      formPass: false,
    });
  }

  handleChangeInputPhone(e) {
    this.setState({
      valuePhone: e.target.value,
    });
  }

  handleChangeInputEmail(e) {
    this.setState({
      valueEmail: e.target.value,
    });
  }

  render() {
    const { visible, help, dataUser } = this.state;
    const { getFieldDecorator } = this.props.form;
    if (dataUser) {
      return (
        <div className={styles['cai-dat-bao-mat']}>
          <div className={styles['item']}>
            <div className={styles['title-item']}>
              Điện thoai liên hệ
              {!this.state.editPhone ? (
                <Icon
                  onClick={() => this.handleChangePhone()}
                  type="edit"
                  style={{
                    display: 'inline',
                    marginLeft: '5px',
                    color: '#3260c7',
                    cursor: 'pointer',
                  }}
                />
              ) : (
                <Icon
                  onClick={() => this.handleDonePhone()}
                  type="check-circle"
                  style={{
                    display: 'inline',
                    marginLeft: '5px',
                    color: '#3260c7',
                    cursor: 'pointer',
                  }}
                />
              )}
              {this.state.editPhone ? (
                <Input
                  onChange={e => this.handleChangeInputPhone(e)}
                  size="small"
                  style={{ marginTop: '5px', width: '40%', display: 'block' }}
                  placeholder="Nhập số điện thoại của bạn"
                />
              ) : (
                <div style={{ color: 'rgba(0, 0, 0, 0.45)' }}>
                  Số điện thoại:{' '}
                  <span className={styles['text-item']}>
                    {' '}
                    {dataUser.phones ? dataUser.phones['1'] : dataUser.phone}
                  </span>
                </div>
              )}
            </div>
          </div>
          <div className={styles['item']}>
            <div className={styles['title-item']}>
              Địa chỉ khôi phục{' '}
              {!this.state.editEmail ? (
                <Icon
                  onClick={() => this.handleChangeEmail()}
                  type="edit"
                  style={{
                    display: 'inline',
                    marginLeft: '5px',
                    color: '#3260c7',
                    cursor: 'pointer',
                  }}
                />
              ) : (
                <Icon
                  onClick={() => this.handleDoneEmail()}
                  type="check-circle"
                  style={{
                    display: 'inline',
                    marginLeft: '5px',
                    color: '#3260c7',
                    cursor: 'pointer',
                  }}
                />
              )}
              {this.state.editEmail ? (
                <Input
                  onChange={e => this.handleChangeInputEmail(e)}
                  size="small"
                  style={{ marginTop: '5px', width: '40%', display: 'block' }}
                  placeholder="Nhập email của bạn"
                />
              ) : (
                <div style={{ color: 'rgba(0, 0, 0, 0.45)' }}>
                  Email:{' '}
                  <span className={styles['text-item']}>
                    {' '}
                    {dataUser.email ? dataUser.email : 'Chưa có'}
                  </span>
                </div>
              )}
            </div>
          </div>
          <div className={styles['item']}>
            <div className={styles['title-item']}>
              Thay đổi mật khẩu
              {!this.state.formPass ? (
                <Icon
                  onClick={() => this.handleChangeFormPass()}
                  style={{
                    display: 'inline',
                    marginLeft: '4px',
                    color: '#3260c7',
                    cursor: 'pointer',
                  }}
                  type="edit"
                />
              ) : (
                <Icon
                  onClick={() => this.handleCloseFormPass()}
                  style={{
                    display: 'inline',
                    marginLeft: '4px',
                    color: '#3260c7',
                    cursor: 'pointer',
                  }}
                  type="check-circle"
                />
              )}
              {this.state.formPass && (
                <div className={styles['form-pass']}>
                  <Form onSubmit={this.handleSubmit} className="login-form">
                    <Form.Item>
                      {getFieldDecorator('password', {
                        rules: [
                          {
                            required: true,
                            message: 'Nhập mật khẩu',
                          },
                        ],
                      })(
                        <Input
                          size="large"
                          type="password"
                          autoComplete="password"
                          placeholder="Mật khẩu hiện tại"
                        />
                      )}
                    </Form.Item>
                    <Form.Item help={help} validateStatus={this.state.valiPass} hasFeedback>
                      <Popover
                        content={
                          <div style={{ padding: '4px 0' }}>
                            <Icon
                              onClick={() => this.handleClosePass()}
                              style={{
                                position: 'absolute',
                                right: '10px',
                                top: '10px',
                                cursor: 'pointer',
                              }}
                              type="close"
                            />
                            {passwordStatusMap[this.getPasswordStatus()]}
                            {this.renderPasswordProgress()}
                            <div style={{ marginTop: 10 }}>Mât khẩu ít nhất 6 ký tự</div>
                          </div>
                        }
                        overlayStyle={{ width: 240 }}
                        placement="right"
                        visible={visible}
                      >
                        {getFieldDecorator('newpassword', {
                          rules: [
                            {
                              validator: this.checkPassword,
                            },
                          ],
                        })(
                          <Input
                            size="large"
                            type="password"
                            autoComplete="password"
                            placeholder="Mật khẩu mới"
                          />
                        )}
                      </Popover>
                    </Form.Item>
                    <Form.Item
                      help={this.state.helpRePass}
                      validateStatus={this.state.valiRePass}
                      hasFeedback
                    >
                      {getFieldDecorator('repassword', {
                        rules: [
                          {
                            required: true,
                          },
                        ],
                      })(
                        <Input
                          size="large"
                          autoComplete="repassword"
                          onChange={e => this.handleChangeRePass(e)}
                          onBlur={e => this.validRepassword(e)}
                          type="password"
                          placeholder="Nhập lại mật khẩu"
                        />
                      )}
                    </Form.Item>
                    <Form.Item>
                      <Button block size="large" type="primary" htmlType="submit">
                        Thay đổi mật khẩu
                      </Button>
                    </Form.Item>
                  </Form>
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }
    return (
      <div className={`${styles['cai-dat-bao-mat']} cai-dat-bao-mat`}>
        <div
          style={{
            background: '#fff',
            paddingTop: '24px',
            paddingBottom: '10px',
            borderBottom: '1px solid #f3f5f9',
          }}
        >
          <Skeleton title={false} active paragraph={{ rows: 2 }} />
        </div>
        <div
          style={{
            background: '#fff',
            paddingTop: '24px',
            paddingBottom: '10px',
            borderBottom: '1px solid #f3f5f9',
          }}
        >
          <Skeleton title={false} active paragraph={{ rows: 2 }} />
        </div>
        <div style={{ background: '#fff', paddingTop: '32px', paddingBottom: '18px' }}>
          <Skeleton title={false} active paragraph={{ rows: 1 }} />
        </div>
      </div>
    );
  }
}

export default CaiDatBaoMat;
