/* eslint-disable class-methods-use-this */
/* eslint-disable react/no-will-update-set-state */
/* eslint-disable react/sort-comp */
/* eslint-disable no-return-assign */
/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable react/jsx-indent */
/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/no-array-index-key */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable no-param-reassign */

import React, { Component } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import {
  Icon,
  Input,
  Button,
  Skeleton,
  Form,
  Radio,
  Select,
  Upload,
  Tooltip,
  message,
  Checkbox,
} from 'antd';
import styles from './thongtincanhan.less';

// eslint-disable-next-line prefer-destructuring
const Option = Select.Option;
const years = [
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
const height = [
  145,
  146,
  147,
  148,
  149,
  150,
  151,
  152,
  153,
  154,
  155,
  156,
  157,
  158,
  159,
  160,
  161,
  162,
  163,
  164,
  165,
  166,
  167,
  168,
  169,
  170,
  171,
  172,
  173,
  174,
  175,
  176,
  177,
  178,
  179,
  180,
  181,
  182,
  183,
  184,
  185,
  186,
  187,
  188,
  189,
  190,
  191,
  192,
];
const weight = [
  30,
  31,
  32,
  33,
  34,
  35,
  36,
  37,
  38,
  39,
  40,
  41,
  42,
  43,
  44,
  45,
  46,
  47,
  48,
  49,
  50,
  51,
  52,
  53,
  54,
  55,
  56,
  57,
  58,
  59,
  60,
  61,
  62,
  63,
  64,
  65,
  66,
  67,
  68,
  69,
  70,
  71,
  72,
  73,
  74,
  75,
  76,
  77,
  78,
  79,
  80,
  81,
  82,
  83,
  84,
  85,
  86,
  87,
  88,
  89,
  90,
  91,
  92,
  93,
  94,
  95,
  96,
  97,
  98,
  99,
  100,
];
const addressInVN = [
  'Hà Nội',
  'TP HCM',
  'Cần Thơ',
  'Đà Nẵng',
  'Hải Phòng',
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
@connect(({ authentication, myprops, loading, user }) => ({
  authentication,
  loading: loading.effects['authentication/getonlyuser'],
  myprops,
  user,
}))
@Form.create()
class ThongTinCaNhan extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loadedAvatar: false,
      loadingUpdateAvatar: false,
    };
  }

  componentDidMount() {
    const { dispatch, authentication, user } = this.props;
    dispatch({
      type: 'myprops/menu_item_profile',
      payload: 0,
    });
    this.setState(
      {
        dataUser: authentication.getonlyuser,
      },
      () => {
        this.setState(
          {
            avatarImage: this.state.dataUser.avatar,
          },
          () => {
            const { avatarImage } = this.state;
            const imgLoader = new Image();
            imgLoader.src = `${user.getsetting.cdn}${avatarImage}`;
            imgLoader.onload = () => {
              if (this.imgElm && avatarImage) {
                this.imgElm.style.backgroundImage = `url(${user.getsetting.cdn}${avatarImage})`;
                this.setState({
                  loadedAvatar: true,
                });
              }
            };
          }
        );
      }
    );
  }

  componentWillReceiveProps(nextProps) {
    const { authentication } = this.props;
    if (authentication.getonlyuser !== nextProps.authentication.getonlyuser) {
      console.log(nextProps.authentication.getonlyuser.status);
      if (nextProps.authentication.getonlyuser.status) {
        this.setState({
          confirmSubmit: true,
        });
      }
      this.setState(
        {
          dataUser: nextProps.authentication.getonlyuser,
          avatarImage: nextProps.authentication.getonlyuser.avatar,
          resetAvatar: false,
        },
        () => {
          const { avatarImage } = this.state;
          const imgLoader = new Image();
          imgLoader.src = `${nextProps.user.getsetting.cdn}${avatarImage}`;
          imgLoader.onload = () => {
            if (this.imgElm && avatarImage) {
              this.imgElm.style.backgroundImage = `url(${
                nextProps.user.getsetting.cdn
              }${avatarImage})`;
              this.setState({
                loadedAvatar: true,
              });
            }
          };
        }
      );
    }
  }

  handleSubmit = e => {
    // eslint-disable-next-line no-unused-vars
    const { form, dispatch } = this.props;
    const { avatarImage } = this.state;
    e.preventDefault();
    /*  
    const jobs = form.getFieldValue('jobs');
    const assets = form.getFieldValue('assets');
    const hobbys = form.getFieldValue('hobbys');
    const marriage = form.getFieldValue('marriage');
    const hometown = form.getFieldValue('hometown');
    */
    form.validateFields((err, values) => {
      values.avatar = avatarImage;
      values.vov = this.state.dataUser.vov;
      values.active_friend = this.state.dataUser.active_friend;
      if (!err) {
        dispatch({
          type: 'authentication/updateprofileuser',
          payload: values,
        });
      }
    });
  };

  beforeUploadAvatar = file => {
    const isJPG =
      file.type === 'image/jpeg' ||
      file.type === 'image/png' ||
      file.type === 'image/webm' ||
      file.type === 'image/webp';
    if (!isJPG) {
      message.error('You can only upload JPG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 12;
    if (!isLt2M) {
      message.error('Image must smaller than 12MB!');
    }
    return isJPG && isLt2M;
  };

  handleResetAvatar() {
    const { dataUser } = this.state;
    this.setState({
      resetAvatar: false,
      avatarImage: dataUser.avatar,
    });
  }

  componentWillUpdate(nextProps, nextStates) {
    if (this.state.avatarImage !== nextStates.avatarImage) {
      this.setState(
        {
          loadedAvatar: false,
        },
        () => {
          const { avatarImage } = nextStates;
          const imgLoader = new Image();
          imgLoader.src = `${nextProps.user.getsetting.cdn}${avatarImage}`;
          imgLoader.onload = () => {
            if (this.imgElm && avatarImage) {
              this.imgElm.style.backgroundImage = `url(${
                nextProps.user.getsetting.cdn
              }${avatarImage})`;
              this.setState({
                loadedAvatar: true,
                loadingUpdateAvatar: false,
              });
            }
          };
        }
      );
    }
  }

  handleChangeUpload(e) {
    let image = '';
    if (e.file.response) {
      if (e.file.response.status === 'ok') {
        image = e.file.response.file.imageId;
        this.setState({
          avatarImage: image,
          resetAvatar: true,
          loadingUpdateAvatar: true,
        });
      }
    }
  }

  handleChangeHeight(e) {
    console.log(e);
  }

  handleChangeWeight(e) {
    console.log(e);
  }

  onChangeEducation(e) {
    console.log(e);
  }

  onChangeMarriage(e) {
    console.log(e);
    this.props.form.setFields({
      marriage: {
        errors: null,
      },
    });
  }

  handleChangehometown(e) {
    console.log(e);
    this.props.form.setFields({
      hometown: {
        errors: null,
      },
    });
  }

  handleChangeHobbys() {
    this.props.form.setFields({
      hobbys: {
        errors: null,
      },
    });
  }

  handleChangeJobs() {
    this.props.form.setFields({
      jobs: {
        errors: null,
      },
    });
  }

  handleChangeAssets() {
    this.props.form.setFields({
      assets: {
        errors: null,
      },
    });
  }

  onChangeCheckBox(e) {
    this.setState({
      dataUser: { ...this.state.dataUser, vov: e.target.checked },
    });
  }

  onChangeCheckBoxActiveFriend(e) {
    this.setState({
      dataUser: { ...this.state.dataUser, active_friend: e.target.checked },
    });
  }

  onChangeVOV(e) {
    console.log(e);
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { loading } = this.props;
    const { dataUser } = this.state;
    if (dataUser && !loading) {
      return (
        <div className={styles['thong-tin-ca-nhan']}>
          <div className={styles['form-edit']}>
            <Form onSubmit={this.handleSubmit} className="login-form">
              <Form.Item label="Tên đầy đủ">
                {getFieldDecorator('fullname', {
                  rules: [{ required: true, message: 'Vui lòng nhập đầy đủ tên của bạn' }],
                  initialValue: dataUser.fullname,
                })(<Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} />)}
              </Form.Item>
              <Form.Item label="Giới tính">
                {getFieldDecorator('gender', {
                  initialValue: dataUser.gender,
                })(
                  <Radio.Group buttonStyle="solid">
                    <Radio.Button value="male">Nam</Radio.Button>
                    <Radio.Button value="female">Nữ</Radio.Button>
                  </Radio.Group>
                )}
              </Form.Item>
              <div className={styles['date-of-birth']}>
                <Form.Item label="Ngày sinh">
                  {getFieldDecorator('dateinfo', {
                    initialValue: dataUser.dob_day,
                  })(
                    <Select style={{ minWidth: '100px' }}>
                      {dayInMonthFull.map((v, i) => (
                        <Option key={i} value={v}>
                          {v}
                        </Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
                <Form.Item label="Tháng sinh">
                  {getFieldDecorator('monthinfo', {
                    initialValue: dataUser.dob_month,
                  })(
                    <Select style={{ minWidth: '100px' }}>
                      {months.map((v, i) => (
                        <Option key={i} value={v}>
                          {v}
                        </Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
                <Form.Item label="Năm sinh">
                  {getFieldDecorator('yearinfo', {
                    initialValue: dataUser.dob_year,
                  })(
                    <Select style={{ minWidth: '100px' }}>
                      {years.map((v, i) => (
                        <Option key={i} value={v}>
                          {v}
                        </Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
              </div>
              <Form.Item label="Thường trú">
                {getFieldDecorator('address', {
                  onChange: e => this.handleChangehometown(e),
                  initialValue: dataUser.address || '',
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
              <Form.Item label="Quê quán">
                {getFieldDecorator('hometown', {
                  initialValue: dataUser.hometown || '',
                })(
                  <Input
                    placeholder="Quê quán"
                    prefix={<Icon type="home" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  />
                )}
              </Form.Item>
              <div className={styles['date-of-birth']}>
                <Form.Item label="Chiều cao (cm)" style={{ width: '100px' }}>
                  {getFieldDecorator('height', {
                    initialValue: dataUser.height || '',
                    onChange: e => this.handleChangeHeight(e),
                  })(
                    <Select showSearch placeholder="Centimet">
                      {height.map(v => (
                        <Option key={v} value={v}>
                          {v}
                        </Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
                <Form.Item label="Cân nặng (kg)" style={{ width: '100px' }}>
                  {getFieldDecorator('weight', {
                    initialValue: dataUser.weight || '',
                    onChange: e => this.handleChangeWeight(e),
                  })(
                    <Select showSearch placeholder="kilogram">
                      {weight.map(v => (
                        <Option key={v} value={v}>
                          {v}
                        </Option>
                      ))}
                    </Select>
                  )}
                </Form.Item>
              </div>
              <Form.Item label="Trình độc học vấn">
                {getFieldDecorator('education', {
                  initialValue: dataUser.education ? dataUser.education.education : '',
                  onChange: e => this.onChangeEducation(e),
                })(
                  <Select showSearch>
                    <Option value="Chưa tốt nghiệp phổ thông">Chưa tốt nghiệp phổ thông</Option>
                    <Option value="Tốt nghiệp cấp 3">Tốt nghiệp cấp 3</Option>
                    <Option value="Trung cấp">Trung cấp</Option>
                    <Option value="Cao đẳng">Cao đẳng</Option>
                    <Option value="Đại học">Đại học</Option>
                    <Option value="Thạc sỹ">Thạc sỹ</Option>
                    <Option value="Tiến sỹ">Tiến sỹ</Option>
                    <Option value="Giáo sư">Giáo sư</Option>
                  </Select>
                )}
              </Form.Item>
              <Form.Item label="Sở thích, tính cách">
                {getFieldDecorator('hobbys', {
                  initialValue: dataUser.hobbys ? dataUser.hobbys.hobbys : '',
                })(
                  <Input.TextArea
                    rows={2}
                    onChange={() => this.handleChangeHobbys()}
                    placeholder="Ví dụ: nghe nhạc...."
                    prefix={<Icon type="smile" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  />
                )}
              </Form.Item>
              <Form.Item label="Công việc hiện tại">
                {getFieldDecorator('jobs', {
                  initialValue: dataUser.jobs ? dataUser.jobs.jobs : '',
                })(
                  <Input.TextArea
                    rows={2}
                    onChange={() => this.handleChangeJobs()}
                    prefix={<Icon type="build" style={{ color: 'rgba(0,0,0,.25)' }} />}
                    placeholder="Ngành nghề chính?"
                  />
                )}
              </Form.Item>
              <Form.Item label="Tài sản hiện có">
                {getFieldDecorator('assets', {
                  initialValue: dataUser.assets ? dataUser.assets.assets : '',
                })(
                  <Input.TextArea
                    rows={2}
                    onChange={() => this.handleChangeAssets()}
                    placeholder="Ví dụ: nhà cửa...."
                    prefix={<Icon type="sketch" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  />
                )}
              </Form.Item>
              <Form.Item label="Tình trạng hôn nhân">
                {getFieldDecorator('marriage', {
                  initialValue: dataUser.marriage || '',
                  onChange: e => this.onChangeMarriage(e),
                })(
                  <Select showSearch placeholder="Chọn ...">
                    <Option value="Độc thân">Độc thân</Option>
                    <Option value="Đã ly hôn">Đã ly hôn</Option>
                    <Option value="Mẹ đơn thân">Mẹ đơn thân</Option>
                    <Option value="Cha đơn thân">Cha đơn thân</Option>
                    <Option value="Hôn nhân phức tạp">Hôn nhân phức tạp</Option>
                  </Select>
                )}
              </Form.Item>
              <Form.Item label="Chọn đài lên sóng">
                {getFieldDecorator('location', {
                  initialValue: dataUser.location || 'VOVHN',
                  onChange: e => this.onChangeVOV(e),
                })(
                  <Select placeholder="Lựa chọn">
                    <Option value="VOVHN">VOV giao thông Hà Nội</Option>
                    <Option value="VOVHCM">VOV giao thông Hồ Chí Minh</Option>
                  </Select>
                )}
              </Form.Item>
              <Form.Item>
                {getFieldDecorator('vov', {})(
                  <Checkbox checked={dataUser.vov} onChange={e => this.onChangeCheckBox(e)}>
                    Đăng ký lên sóng VOV
                  </Checkbox>
                )}
              </Form.Item>
              <Form.Item>
                {getFieldDecorator('active_friend', {})(
                  <Checkbox
                    checked={dataUser.active_friend}
                    onChange={e => this.onChangeCheckBoxActiveFriend(e)}
                  >
                    Mở kết bạn
                  </Checkbox>
                )}
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Cập nhật thông tin
                </Button>
              </Form.Item>
              {this.state.confirmSubmit && (
                <span style={{ color: 'red' }}>
                  Thông tin cập nhập của bạn đã được gửi đi ban biên tập sẽ xác nhận và cập nhập.
                  cảm ơn bạn tham website
                </span>
              )}
            </Form>
          </div>
          <div className={styles['basic-center']} />
          <div className={styles['avatar-image']}>
            <div
              ref={imgElm => (this.imgElm = imgElm)}
              className={styles['background-avatar']}
              style={{
                backgroundImage:
                  dataUser.gender === 'male'
                    ? `url(http://cdn.henhoradio.net/images/ft/ddc8448a-9c0d-4b70-a4c4-19bc3fb7a04c)`
                    : dataUser.gender === 'female' &&
                      `url(http://cdn.henhoradio.net/images/ft/3b10bc5e-7741-41e4-88ee-0174e2d6f0cd)`,
                backgroundColor: this.state.loadedAvatar ? 'none' : 'rgb(242, 242, 242)',
              }}
            >
              {this.state.loadingUpdateAvatar && (
                <div className={styles['loading-circle']}>
                  <div className={styles['lds-spinner']}>
                    <div />
                    <div />
                    <div />
                    <div />
                    <div />
                    <div />
                    <div />
                    <div />
                    <div />
                    <div />
                    <div />
                    <div />
                  </div>
                </div>
              )}
              {this.state.resetAvatar && !this.state.loadingUpdateAvatar ? (
                <Tooltip placement="right" title="Huỷ bỏ">
                  <Icon
                    style={{ float: 'right', fontSize: '18px' }}
                    onClick={() => this.handleResetAvatar()}
                    type="close"
                  />
                </Tooltip>
              ) : (
                ''
              )}
            </div>
            <div className={`${styles['upload-button']} upload-avatar`}>
              <Form.Item>
                <Upload
                  onChange={e => this.handleChangeUpload(e)}
                  action="/upload/images"
                  name="file"
                  beforeUpload={this.beforeUploadAvatar}
                >
                  <Button icon="upload">Chọn ảnh</Button>
                </Upload>
              </Form.Item>
            </div>

            <div className={styles['more-information']}>
              <div className={styles['item-info']}>
                Tên tài khoản: <span>{dataUser.phone}</span>
              </div>
              <div className={styles['item-info']}>
                Ngày đăng ký: <span>{moment(dataUser.createat).format('DD/MM/YYYY')}</span>
              </div>
            </div>
          </div>
        </div>
      );
    }
    return (
      <div className={`${styles['thong-tin-ca-nhan']} thong-tin-ca-nhan`}>
        <div className={styles['form-edit']}>
          <div>
            {' '}
            <Skeleton paragraph={{ rows: 1 }} />
          </div>
          <div style={{ paddingTop: '25px', width: '115px' }}>
            {' '}
            <Skeleton paragraph={{ rows: 1 }} />
          </div>
          <div style={{ paddingTop: '45px' }}>
            {' '}
            <div style={{ display: 'flex' }}>
              <div style={{ flexGrow: 1, paddingRight: '3px' }} className="date-of-birth-profile">
                <Skeleton paragraph={{ rows: 0 }} />
                <Skeleton title={false} paragraph={{ rows: 1 }} />
              </div>
              <div style={{ flexGrow: 1, paddingRight: '3px' }} className="date-of-birth-profile">
                <Skeleton paragraph={{ rows: 0 }} />
                <Skeleton title={false} paragraph={{ rows: 1 }} />
              </div>
              <div style={{ flexGrow: 1, paddingRight: '3px' }} className="date-of-birth-profile">
                <Skeleton paragraph={{ rows: 0 }} />
                <Skeleton title={false} paragraph={{ rows: 1 }} />
              </div>
            </div>
          </div>
          <div style={{ paddingTop: '35px' }}>
            {' '}
            <Skeleton paragraph={{ rows: 1 }} />
          </div>
          <div style={{ paddingTop: '35px' }}>
            {' '}
            <div style={{ display: 'flex' }}>
              <div style={{ flexGrow: 1, paddingRight: '5px' }} className="date-of-birth-profile">
                <Skeleton paragraph={{ rows: 0 }} />
                <Skeleton title={false} paragraph={{ rows: 1 }} />
              </div>
              <div style={{ flexGrow: 1, paddingRight: '5px' }} className="date-of-birth-profile">
                <Skeleton paragraph={{ rows: 0 }} />
                <Skeleton title={false} paragraph={{ rows: 1 }} />
              </div>
            </div>
          </div>
          <div style={{ paddingTop: '25px' }}>
            {' '}
            <Skeleton paragraph={{ rows: 1 }} />
          </div>
          <div style={{ paddingTop: '30px' }}>
            {' '}
            <Skeleton paragraph={{ rows: 1 }} />
          </div>
          <div className="button-stelekon" style={{ paddingTop: '40px' }}>
            {' '}
            <Skeleton title={false} paragraph={{ rows: 1 }} />
          </div>
        </div>

        <div className={styles['basic-center']} />
        <div className={styles['avatar-image']} style={{ position: 'relative' }}>
          <div className={styles['background-avatar']} style={{ background: '#f2f2f2' }} />
          <div className="upload-stelekon" style={{ width: '100%' }}>
            {' '}
            <Skeleton title={false} paragraph={{ rows: 1 }} />
          </div>
          <div style={{ width: '100%', transform: 'translateY(70px)' }}>
            <Skeleton title={false} paragraph={{ rows: 1 }} />
            <Skeleton title={false} paragraph={{ rows: 1 }} />
          </div>
        </div>
      </div>
    );
  }
}

export default ThongTinCaNhan;
