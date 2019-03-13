/* eslint-disable no-nested-ternary */
/* eslint-disable no-param-reassign */
/* eslint-disable no-var */
/* eslint-disable no-dupe-class-members */
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
  Form,
  Radio,
  Select,
  Upload,
  Modal,
  Tooltip,
  message,
} from 'antd';
import styles from './thongtincanhan.less';

const Option = Select.Option;
const uploadButton = (
  <div>
    <Icon type="plus" />
    <div className="ant-upload-text">Upload</div>
  </div>
);
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
@connect(({ authentication, myprops }) => ({
  authentication,
  myprops,
}))
@Form.create()
class ThongTinCaNhan extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fileListAvatar: [],
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'myprops/menu_item_profile',
      payload: 0,
    });
    dispatch({
      type: 'authentication/getuser',
    });
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.authentication.getuser !== nextProps.authentication.getuser) {
      if (nextProps.authentication.getuser.status === 'ok') {
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
    if (
      this.props.authentication.updateprofileuser !== nextProps.authentication.updateprofileuser
    ) {
      if (
        nextProps.authentication.updateprofileuser.status === 'ok' &&
        this.props.authentication.updateprofileuser.timeline !==
          nextProps.authentication.updateprofileuser.timeline
      ) {
        nextProps.dispatch({
          type: 'authentication/getuser',
        });
        this.setState({
          resetAvatar: false,
        });
        setTimeout(() => {
          message.success('Cập nhật thông tin thành công !');
        }, 500);
      } else {
        message.error('Có lỗi xảy ra !');
      }
    }
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      values.avatar = this.state.avatarImage;
      if (!err) {
        this.props.dispatch({
          type: 'authentication/updateprofileuser',
          payload: values,
        });
      }
    });
  };

  handleChangeDay(e) {
    console.log(e);
  }

  handleChangeMonth(e) {
    console.log(e);
  }

  handleChangeYear(e) {
    console.log(e);
  }

  handleChangeAvatar(e) {
    console.log(e);
  }

  handlePreviewAvatar = file => {
    this.setState({
      previewImageAvatar: file.url || file.thumbUrl,
      previewVisibleAvatar: true,
    });
  };

  handleChangeAvatar(fileListAvatar) {
    this.setState({ fileListAvatar: fileListAvatar.fileList }, () => {
      var image = '';
      if (
        this.state.fileListAvatar[this.state.fileListAvatar.length - 1] &&
        this.state.fileListAvatar[this.state.fileListAvatar.length - 1].response
      )
        image = this.state.fileListAvatar[this.state.fileListAvatar.length - 1].response.file
          .imageid;
      this.setState({
        avatarImage: image,
        resetAvatar: true,
      });
    });
  }

  handleRemoveAvatar = file => {
    console.log(file);
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
    this.setState({
      resetAvatar: false,
      avatarImage: this.state.dataUser.avatar,
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { dataUser, avatarImage } = this.state;
    if (dataUser) {
      return (
        <div className={styles['thong-tin-ca-nhan']}>
          <div className={styles['form-edit']}>
            <Form onSubmit={this.handleSubmit} className="login-form">
              <Form.Item label="Tên đầy đủ">
                {getFieldDecorator('fullname', {
                  rules: [
                    { required: true, message: 'Vui lòng nhập đầy đủ tên của bạn' },
                    {
                      required: true,
                      message: 'Ký tự không hợp lệ!',
                      pattern: /^[a-zA-Z0-9 àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ]{1,30}$/,
                    },
                  ],
                  initialValue: dataUser.fullname,
                })(<Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} />)}
              </Form.Item>
              <Form.Item label="Giới tính">
                {getFieldDecorator('gender', {
                  rules: [{ required: true, message: 'Vui lòng chọn giới tính' }],
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
                    rules: [{ required: true, message: 'Vui lòng chọn giới tính' }],
                    initialValue: dataUser.dob_day,
                  })(
                    <Select style={{ minWidth: '100px' }} onChange={e => this.handleChangeDay(e)}>
                      {dayInMonthFull.map((v, i) => {
                        return (
                          <Option key={i} value={v}>
                            {v}
                          </Option>
                        );
                      })}
                    </Select>
                  )}
                </Form.Item>
                <Form.Item label="Tháng sinh">
                  {getFieldDecorator('monthinfo', {
                    rules: [{ required: true, message: 'Vui lòng chọn giới tính' }],
                    initialValue: dataUser.dob_month,
                  })(
                    <Select style={{ minWidth: '100px' }} onChange={e => this.handleChangeMonth(e)}>
                      {months.map((v, i) => {
                        return (
                          <Option key={i} value={v}>
                            {v}
                          </Option>
                        );
                      })}
                    </Select>
                  )}
                </Form.Item>
                <Form.Item label="Năm sinh">
                  {getFieldDecorator('yearinfo', {
                    rules: [{ required: true, message: 'Vui lòng chọn giới tính' }],
                    initialValue: dataUser.dob_year,
                  })(
                    <Select style={{ minWidth: '100px' }} onChange={e => this.handleChangeYear(e)}>
                      {years.map((v, i) => {
                        return (
                          <Option key={i} value={v}>
                            {v}
                          </Option>
                        );
                      })}
                    </Select>
                  )}
                </Form.Item>
              </div>
              <Form.Item label="Địa chỉ">
                {getFieldDecorator('address', {
                  rules: [
                    { required: true, message: 'Vui lòng chọn địa chỉ' },
                    {
                      required: true,
                      message: 'Ký tự không hợp lệ!',
                      pattern: /^[a-zA-Z0-9 -àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ]{1,50}$/,
                    },
                  ],
                  initialValue: dataUser.address,
                })(<Input prefix={<Icon type="home" style={{ color: 'rgba(0,0,0,.25)' }} />} />)}
              </Form.Item>
              <div className={styles['date-of-birth']}>
                <Form.Item label="Chiều cao">
                  {getFieldDecorator('height', {
                    rules: [{ required: true, message: 'Vui lòng nhập chiều cao' }, {}],
                    initialValue: dataUser.height ? dataUser.height : '',
                  })(
                    <Input type="number" min={0} style={{ width: '70%' }} placeholder="Centimet" />
                  )}
                </Form.Item>
                <Form.Item label="Cân nặng">
                  {getFieldDecorator('weight', {
                    rules: [{ required: true, message: 'Vui lòng nhập cân nặng' }, {}],
                    initialValue: dataUser.weight ? dataUser.weight : '',
                  })(
                    <Input type="number" min={0} placeholder="Kilogram" style={{ width: '70%' }} />
                  )}
                </Form.Item>
              </div>
              <Form.Item label="Trình độc học vấn">
                {getFieldDecorator('education', {
                  rules: [
                    { required: true, message: 'Nhập trình độ học vấn của bạn' },
                    {
                      required: true,
                      message: 'Ký tự không hợp lệ!',
                      pattern: /^[a-zA-Z0-9 -àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ]{1,50}$/,
                    },
                  ],
                  initialValue: dataUser.education ? dataUser.education.education : '',
                })(
                  <Input
                    prefix={<Icon type="book" style={{ color: 'rgba(0,0,0,.25)' }} />}
                    placeholder="Bạn từng học đến cấp độ nào?"
                  />
                )}
              </Form.Item>
              <Form.Item label="Công việc hiện tại">
                {getFieldDecorator('jobs', {
                  rules: [
                    { required: true, message: 'Nhập công việc của bạn' },
                    {
                      required: true,
                      message: 'Ký tự không hợp lệ!',
                      pattern: /^[a-zA-Z0-9 -àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ]{1,50}$/,
                    },
                  ],
                  initialValue: dataUser.jobs ? dataUser.jobs.jobs : '',
                })(
                  <Input
                    prefix={<Icon type="build" style={{ color: 'rgba(0,0,0,.25)' }} />}
                    placeholder="Công việc chính hiện tại?"
                  />
                )}
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Cập nhật thông tin
                </Button>
              </Form.Item>
            </Form>
          </div>
          <div className={styles['basic-center']} />
          <div className={styles['avatar-image']}>
            <div
              className={styles['background-avatar']}
              style={
                avatarImage
                  ? { backgroundImage: `url(/images/ft/${avatarImage})` }
                  : dataUser.avatar
                  ? { backgroundImage: `url(/images/ft/${dataUser.avatar})` }
                  : {
                      backgroundImage: `url('https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png')`,
                    }
              }
            >
              {this.state.resetAvatar ? (
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
                  action="/api/upload/avatar/"
                  listType="picture"
                  fileList={this.state.fileListAvatar}
                  onChange={e => this.handleChangeAvatar(e)}
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
      <div style={{ background: '#fff' }}>
        <Skeleton paragraph={{ rows: 3 }} active />
        <Skeleton paragraph={{ rows: 3 }} active />
        <Skeleton paragraph={{ rows: 2 }} active />
        <Skeleton paragraph={{ rows: 4 }} active />
        <Skeleton paragraph={{ rows: 4 }} active />
      </div>
    );
  }
}

export default ThongTinCaNhan;
