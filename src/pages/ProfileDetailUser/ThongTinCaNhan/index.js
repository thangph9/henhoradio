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
import { Table, Icon, Input, Button, Skeleton, Form, Radio, Select, Upload, Modal } from 'antd';
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
        this.setState({
          dataUser: nextProps.authentication.getuser.data,
        });
      }
    }
  }

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
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
    console.log(fileListAvatar);
    this.setState({ fileListAvatar: fileListAvatar.fileList }, () => {
      var image = '';
      if (this.state.fileListAvatar[0] && this.state.fileListAvatar[0].response)
        image = this.state.fileListAvatar[0].response.file.imageid;
      this.setState({
        avatarImage: image,
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

  render() {
    const { getFieldDecorator } = this.props.form;
    const { dataUser } = this.state;
    if (dataUser) {
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
                  rules: [{ required: true, message: 'Vui lòng chọn giới tính' }],
                  initialValue: dataUser.address,
                })(<Input prefix={<Icon type="home" style={{ color: 'rgba(0,0,0,.25)' }} />} />)}
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
            <div>
              <img
                className={styles['img-avatar']}
                alt="img"
                src="https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png"
              />
            </div>
            <div className={styles['upload-button']}>
              <Form.Item>
                <Upload
                  action="/api/upload/avatar/"
                  listType="picture"
                  fileList={this.state.fileListAvatar}
                  onPreview={this.handlePreviewAvatar}
                  onChange={e => this.handleChangeAvatar(e)}
                  onRemove={this.handleRemoveAvatar}
                  beforeUpload={this.beforeUploadAvatar}
                >
                  <Button icon="upload">Chọn ảnh</Button>
                </Upload>

                <Modal
                  visible={this.state.previewVisibleAvatar}
                  footer={null}
                  onCancel={this.handleCancelAvatar}
                >
                  <img
                    alt="example"
                    style={{ width: '100%' }}
                    src={this.state.previewImageAvatar}
                  />
                </Modal>
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
        <Skeleton paragraph={{ rows: 14 }} active />
      </div>
    );
  }
}

export default ThongTinCaNhan;
