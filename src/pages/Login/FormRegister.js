/* eslint-disable class-methods-use-this */
/* eslint-disable react/sort-comp */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable no-unused-vars */
/* eslint-disable camelcase */

import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Input, Button, Popover, Progress, Select, Icon, message, Checkbox } from 'antd';
// import {Link} from 'react-router-dom'
import ReCAPTCHA from 'react-google-recaptcha';
import 'antd/dist/antd.less';
import styles from './styles.less';

const recaptchaRef = React.createRef();
const { Option } = Select;

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
const years = [
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
];
const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
const dayInMonthFull = [
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
];
const addressInVN = [
  'Cần Thơ',
  'Đà Nẵng',
  'Hải Phòng',
  'Hà Nội',
  'TP HCM',
  'An Giang',
  'Bà Rịa - Vũng Tàu',
  'Bắc Giang',
  'Bắc Kạn',
  'Bạc Liêu',
  'Bắc Ninh',
  'Bến Tre',
  'Bình Định',
  'Bình Dương',
  'Bình Phước',
  'Bình Thuận',
  'Cà Mau',
  'Cao Bằng',
  'Đắk Lắk',
  'Đắk Nông',
  'Điện Biên',
  'Đồng Nai',
  'Đồng Tháp',
  'Gia Lai',
  'Hà Giang',
  'Hà Nam',
  'Hà Tĩnh',
  'Hải Dương',
  'Hậu Giang',
  'Hòa Bình',
  'Hưng Yên',
  'Khánh Hòa',
  'Kiên Giang',
  'Kon Tum',
  'Lai Châu',
  'Lâm Đồng',
  'Lạng Sơn',
  'Lào Cai',
  'Long An',
  'Nam Định',
  'Nghệ An',
  'Ninh Bình',
  'Ninh Thuận',
  'Phú Thọ',
  'Quảng Bình',
  'Quảng Nam',
  'Quảng Ngãi',
  'Quảng Ninh',
  'Quảng Trị',
  'Sóc Trăng',
  'Sơn La',
  'Tây Ninh',
  'Thái Bình',
  'Thái Nguyên',
  'Thanh Hóa',
  'Thừa Thiên Huế',
  'Tiền Giang',
  'Trà Vinh',
  'Tuyên Quang',
  'Vĩnh Long',
  'Vĩnh Phúc',
  'Yên Bái',
  'Phú Yên',
];
@connect(({ loading, authentication }) => ({
  validatting: loading.effects['authentication/checkuser'],
  authentication,
}))
@Form.create()
class FormRegister extends PureComponent {
  state = {
    visible: false,
    help: '',
    monthSelected: [],
    value: '',
    valiPass: '',
    helpPhone: '',
    valiPhone: '',
    helpName: '',
    valiName: '',
    helpAddress: '',
    valiAddress: '',
    checkCharPass: '',
    helpRePass: '',
    valiRePass: '',
    checkBoxconfirm: false,
  };

  componentWillReceiveProps(nextProps) {
    const { authentication } = this.props;

    if (authentication.register !== nextProps.authentication.register) {
      if (nextProps.authentication.register.status === 'ok') {
        nextProps.history.push({ pathname: '/register-success' });
      }
      if (
        nextProps.authentication.register.status === 'error' &&
        nextProps.authentication.register.timeline !== authentication.register.timeline
      ) {
        this.setState({
          valiPhone: 'error',
          helpPhone: nextProps.authentication.register.message,
          value: '',
        });
        if (this.props.useCaptcha) recaptchaRef.current.reset();
      }
      if (
        nextProps.authentication.register.status === 'error2' &&
        nextProps.authentication.register.timeline !== authentication.register.timeline
      ) {
        this.setState({
          messageResponsive: nextProps.authentication.register.message,
        });
        if (this.props.useCaptcha) recaptchaRef.current.reset();
      }
    }
    if (authentication.checkuser !== nextProps.authentication.checkuser) {
      if (nextProps.authentication.checkuser.status === 'ok') {
        this.setState({
          valiPhone: 'success',
        });
      }
      if (nextProps.authentication.checkuser.status === 'error') {
        this.setState({
          valiPhone: 'error',
          helpPhone: nextProps.authentication.checkuser.message,
        });
      }
    }
  }

  componentWillUpdate(nextProps, nextState) {
    const { data, value, useCaptcha } = this.state;
    const { dispatch } = this.props;
    const dataCaptcha = data;
    if (value !== nextState.value && nextState.value.length > 0) {
      dataCaptcha.captcha = nextState.value;
      dataCaptcha.useCaptcha = useCaptcha;
      dispatch({
        type: 'authentication/register',
        payload: dataCaptcha,
      });
    }
  }

  handleSubmit = e => {
    e.preventDefault();
    const { form, dispatch } = this.props;
    const { value, checkBoxconfirm } = this.state;
    const dob_day = form.getFieldValue('dob_day');
    const dob_month = form.getFieldValue('dob_month');
    const dob_year = form.getFieldValue('dob_year');
    const gender = form.getFieldValue('gender');
    const phone = form.getFieldValue('phone');
    const fullname = form.getFieldValue('fullname');
    const address = form.getFieldValue('address');
    const password = form.getFieldValue('password');
    const repassword = form.getFieldValue('repassword');

    if (
      !fullname ||
      /^[a-zA-ZàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ][a-zA-Z àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ]{2,30}$/.test(
        fullname
      ) === false
    ) {
      this.setState({
        helpName: 'Họ và tên không hợp lệ',
        valiName: 'error',
      });
    }
    if (
      !address ||
      /^[a-zA-Z0-9 -àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ]{1,50}$/.test(
        address
      ) === false
    ) {
      this.setState({
        helpAddress: 'Thường trú không hợp lệ',
        valiAddress: 'error',
      });
    }
    if (!phone || /^\d{10}$/.test(phone) === false) {
      this.setState({
        helpPhone: 'Số điện thoại không hợp lệ',
        valiPhone: 'error',
      });
    }
    if (!gender) {
      form.setFields({
        gender: {
          errors: [new Error('Chọn giới tính!')],
        },
      });
    }
    if (!checkBoxconfirm) {
      form.setFields({
        confirmCheck: {
          errors: [new Error('Vui lòng chấp nhận điều khoản')],
        },
      });
      return;
    }
    if (!password) {
      this.setState({
        help: 'Nhập mật khẩu！',
        valiPass: 'error',
      });
    } else if (/^[a-zA-z0-9!@#$%^&*_\-=+|;:]{1,}$/.test(password) === false) {
      this.setState({
        help: 'Mật khẩu đang chứa ký tự đặc biệt',
      });
    }
    if (!repassword) {
      this.setState({
        helpRePass: 'Nhập lại mật khẩu！',
        valiRePass: 'error',
      });
    }
    if (!dob_day || !dob_month || !dob_year) {
      form.setFields({
        dob_day: {
          errors: [new Error('Chọn đầy đủ ngày sinh!')],
        },
      });
    }
    form.validateFields((err, values) => {
      if (values.password !== values.repassword) {
        this.setState({
          valiRePass: 'error',
          helpRePass: 'Nhập lại mật khẩu chưa đúng!',
        });
      }
      if (values.password === values.repassword) {
        if (!err && dob_day && dob_month && dob_year && gender) {
          if (this.props.useCaptcha) {
            recaptchaRef.current.execute();
            this.setState({
              data: values,
            });
          } else {
            dispatch({
              type: 'authentication/register',
              payload: values,
            });
            this.setState({
              data: values,
            });
          }
        }
      }
    });
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

  renderPasswordProgress = () => {
    const { form } = this.props;
    const { checkCharPass } = this.state;
    const value = form.getFieldValue('password');
    const passwordStatus = this.getPasswordStatus();
    return value && value.length ? (
      <div className={styles[`progress-${passwordStatus}`]}>
        <span style={{ color: 'red' }}>{checkCharPass}</span>
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
    const filter = /^([a-zA-Z0-9_])+(([a-zA-Z0-9])+)+([a-zA-Z0-9]{2,4})+$/;
    if (!filter.test(email)) {
      form.setFields({
        email: {
          value: email,
          errors: [new Error('Sai định dạng Email! Vui lòng kiểm tra lại')],
        },
      });
    }
  };

  handleChangeGender = value => {
    // eslint-disable-next-line react/destructuring-assignment
    this.props.form.setFields({
      gender: {
        errors: '',
      },
    });
  };

  handleChangeDay = value => {
    // eslint-disable-next-line react/destructuring-assignment
    this.props.form.setFields({
      dob_day: {
        errors: '',
      },
    });
  };

  handleChangeCaptcha = value => {
    this.setState({ value });
  };

  validRepassword() {
    const { form } = this.props;
    const password = form.getFieldValue('password');
    const repassword = form.getFieldValue('repassword');
    if (password !== repassword) {
      this.setState({
        valiRePass: 'error',
        helpRePass: 'Nhập lại mật khẩu chưa đúng!',
      });
    }
  }

  handleClosePass() {
    this.setState({
      visible: false,
    });
  }

  handleChangePhone(e) {
    this.setState({
      helpPhone: '',
      valiPhone: '',
    });
  }

  handleBlurPhone(e) {
    const { localtion } = this.props;
    const { value } = e.target;
    const { form, dispatch } = this.props;
    const pathname = localtion;
    if (!/^\d{10}$/.test(value)) {
      this.setState({
        helpPhone: 'Số điện thoại không hợp lệ',
        valiPhone: 'error',
      });
    }
    form.validateFields(['phone'], (errors, values) => {
      if (!errors) {
        dispatch({
          type: 'authentication/checkuser',
          payload: value,
        });
      }
    });
  }

  handleChangeName(e) {
    const { value } = e.target;
    this.setState({
      valiName: '',
      helpName: '',
    });
    if (
      /^[a-zA-ZàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ][a-zA-Z àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ]{2,30}$/.test(
        value
      )
    ) {
      this.setState({
        valiName: 'success',
      });
    } else {
      this.setState({
        valiName: 'error',
        helpName: 'Họ và tên không hợp lệ',
      });
    }
  }

  handleChangeAddress(e) {
    this.setState({
      valiAddress: '',
      helpAddress: '',
    });
    if (e) {
      this.setState({
        valiAddress: 'success',
      });
    } else {
      this.setState({
        valiAddress: 'error',
        helpAddress: 'Thường trú không hợp lệ',
      });
    }
  }

  handleChangeRePass(e) {
    this.setState({
      valiRePass: '',
      helpRePass: '',
    });
    const { value } = e.target;
    const { form } = this.props;
    const password = form.getFieldValue('password');
    if (password === value) {
      this.setState({
        valiRePass: 'success',
      });
    }
  }

  onChangeCheckBox(e) {
    this.setState({
      checkBoxconfirm: e.target.checked,
    });
    if (e) {
      this.props.form.setFields({
        confirmCheck: {},
      });
    }
  }

  render() {
    const {
      form: { getFieldDecorator },
      validatting,
    } = this.props;
    const {
      help,
      visible,
      monthSelected,
      helpPhone,
      valiPhone,
      helpName,
      valiName,
      helpAddress,
      valiAddress,
      valiPass,
      helpRePass,
      valiRePass,
    } = this.state;
    const A = [];
    dayInMonthFull.map((v, i) => {
      A[i] = (
        <Option key={v} value={v}>
          {v}
        </Option>
      );
      return A;
    });
    const B = [];
    monthSelected.map((v, i) => {
      B[i] = (
        <Option key={v} value={v}>
          {v}
        </Option>
      );
      return A;
    });
    return (
      <Form onSubmit={this.handleSubmit}>
        <Form.Item
          label="Họ và tên"
          hasFeedback
          help={helpName}
          validateStatus={valiName}
          style={{ width: '45%', display: 'inline-block', marginBottom: '0px' }}
        >
          {getFieldDecorator('fullname', {
            rules: [
              {
                required: true,
                pattern: /^[a-zA-ZàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ][a-zA-Z àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ]{2,30}$/,
              },
            ],
          })(<Input onChange={e => this.handleChangeName(e)} placeholder="Trần Thu Trang" />)}
        </Form.Item>
        <Form.Item
          label="Giới tính"
          style={{ width: '45%', display: 'inline-block', float: 'right', marginBottom: '0px' }}
        >
          {getFieldDecorator('gender', {
            required: true,
            message: 'Nhập giới tính',
            onChange: this.handleChangeGender,
          })(
            <Select placeholder="Bạn là...">
              <Option value="male">Nam</Option>
              <Option value="female">Nữ</Option>
            </Select>
          )}
        </Form.Item>
        <Form.Item label="Ngày sinh" style={{ marginBottom: '0px' }}>
          {getFieldDecorator('dob_day', {
            onChange: this.handleChangeDay,
          })(
            <Select placeholder="Ngày" showSearch>
              {dayInMonthFull.map(v => (
                <Option key={v} value={v}>
                  {v}
                </Option>
              ))}
            </Select>
          )}
          {getFieldDecorator('dob_month', {
            onChange: this.handleChangeMonth,
          })(
            <Select placeholder="Tháng" showSearch>
              {months.map(v => (
                <Option key={v} value={v}>
                  {v}
                </Option>
              ))}
            </Select>
          )}
          {getFieldDecorator('dob_year', {
            onChange: this.handleChangeYear,
          })(
            <Select placeholder="Năm" showSearch>
              {years.map(v => (
                <Option key={v} value={v}>
                  {v}
                </Option>
              ))}
            </Select>
          )}
        </Form.Item>
        <Form.Item
          label="Thường trú"
          help={helpAddress}
          validateStatus={valiAddress}
          style={{ width: '45%', display: 'inline-block', marginBottom: '0px' }}
        >
          {getFieldDecorator('address', {
            onChange: e => this.handleChangeAddress(e),
          })(
            <Select showSearch placeholder="Thường trú">
              {addressInVN.map(v => (
                <Option key={v} value={v}>
                  {v}
                </Option>
              ))}
            </Select>
          )}
        </Form.Item>
        <Form.Item
          label="Bạn ở đây để"
          style={{ width: '45%', display: 'inline-block', float: 'right', marginBottom: '0px' }}
        >
          {getFieldDecorator('intent', {
            onChange: this.handleChangeIntent,
          })(
            <Select placeholder="Chọn...">
              <Option value="pal">Kết bạn mới</Option>
              <Option value="dating">Hẹn hò, kết hôn</Option>
            </Select>
          )}
        </Form.Item>
        <Form.Item
          help={helpPhone}
          validateStatus={validatting ? 'validating' : valiPhone}
          label="Số điện thoại"
          hasFeedback
          style={{ marginBottom: '0px' }}
        >
          {getFieldDecorator('phone', {
            rules: [
              {
                required: true,
                pattern: /^\d{10}$/,
              },
            ],
          })(
            <Input
              onChange={e => this.handleChangePhone(e)}
              placeholder="Số điện thoại là tài khoản đăng nhập"
              onBlur={e => this.handleBlurPhone(e)}
            />
          )}
        </Form.Item>
        <Form.Item
          help={help}
          validateStatus={valiPass}
          hasFeedback
          label="Mật khẩu"
          style={{ marginBottom: '0px' }}
        >
          <Popover
            content={
              <div style={{ padding: '4px 0' }}>
                <Icon
                  onClick={() => this.handleClosePass()}
                  style={{ position: 'absolute', right: '10px', top: '10px', cursor: 'pointer' }}
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
            {getFieldDecorator('password', {
              rules: [
                {
                  validator: this.checkPassword,
                  pattern: /^[a-zA-z0-9!@#$%^&*_\-=+|;:]{1,}$/,
                },
              ],
            })(
              <Input
                type="password"
                autoComplete="password"
                placeholder="Tối thiểu 6 ký tự (không ký tự đặc biệt... )"
              />
            )}
          </Popover>
        </Form.Item>
        <Form.Item help={helpRePass} validateStatus={valiRePass} hasFeedback label="Nhập lại">
          {getFieldDecorator('repassword', {
            rules: [
              {
                required: true,
                message: 'Nhập lại mật khẩu',
              },
            ],
          })(
            <Input
              autoComplete="repassword"
              onChange={e => this.handleChangeRePass(e)}
              onBlur={e => this.validRepassword(e)}
              type="password"
              placeholder="Nhập lại mật khẩu"
            />
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator('confirmCheck', {})(
            <Checkbox onChange={e => this.onChangeCheckBox(e)}>
              Bạn có chấp nhận điều khoản?
            </Checkbox>
          )}
        </Form.Item>
        {this.props.useCaptcha && (
          <ReCAPTCHA
            ref={recaptchaRef}
            onChange={e => this.handleChangeCaptcha(e)}
            sitekey="6LfUm5AUAAAAAB6eXtNTPWLUZT5hCbDabBBmLK23"
            size="invisible"
          />
        )}
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
        {this.state.messageResponsive && (
          <span style={{ color: '#f5222d' }}>{this.state.messageResponsive}</span>
        )}
      </Form>
    );
  }
}
export default FormRegister;
