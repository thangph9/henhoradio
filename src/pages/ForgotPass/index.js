/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Input, Button, Icon } from 'antd';
import styles from './Forgot.less';

@connect(({ loading }) => ({
  submitting: loading.effects['login/login'],
}))
@Form.create()
class Forgot extends Component {
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form className={styles.main} style={{ marginTop: '30px' }}>
        <p style={{ textAlign: 'center', color: '#fff' }}>
          Nhập địa chỉ email của bạn vào dưới đây và chúng tôi sẽ gửi cho bạn một đường dẫn để bạn
          thay đổi mật khẩu của bạn. Lưu ý nhập địa chỉ email được dùng để đăng nhập tài khoản của
          bạn.
        </p>
        <Form.Item>
          {getFieldDecorator('phone', {
            rules: [{ required: true, message: 'Nhập số điện thoại' }],
          })(
            <Input
              size="large"
              prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="Số điện thoại"
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
              borderRadius: '20px',
            }}
            htmlType="submit"
            block
          >
            Lấy lại mật khẩu
          </Button>
        </Form.Item>
      </Form>
    );
  }
}

export default Forgot;
