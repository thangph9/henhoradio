/* eslint-disable react/destructuring-assignment */
/* eslint-disable no-param-reassign */
/* eslint-disable no-unused-vars */
/* eslint-disable react/sort-comp */
/* eslint-disable no-return-assign */
/* eslint-disable react/no-unused-state */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
// import { Redirect } from 'react-router-dom';
import { Form, Input, Button } from 'antd';
import { Link, Redirect } from 'react-router-dom';
import ReCAPTCHA from 'react-google-recaptcha';
import { getAuthority } from '@/utils/authority';
// import styles from './styles.less';
const recaptchaRef = React.createRef();
// eslint-disable-next-line no-unused-vars
@connect(({ loading, authentication }) => ({
  submitting: loading.effects['form/submitRegularForm'],
  authentication,
}))
@Form.create()
class FormLogin extends PureComponent {
  state = {
    help: '',
    validateStatus: '',
    value: '',
    timeline: 0,
  };

  componentWillReceiveProps(nextProps) {
    const { authentication } = this.props;
    if (authentication.login !== nextProps.authentication.login) {
      if (
        nextProps.authentication.login.status === 'error' &&
        nextProps.authentication.login.timeline !== authentication.login.timeline
      ) {
        this.setState({
          help: nextProps.authentication.login.message,
          validateStatus: 'error',
          value: '',
        });
        recaptchaRef.current.reset();
      }
      if (nextProps.authentication.login.status === 'ok') {
        nextProps.history.push({ pathname: '/home' });
      }
    }
  }

  handleChangeCaptcha = value => {
    this.setState({ value });
  };

  handleSubmit = e => {
    e.preventDefault();
    recaptchaRef.current.execute();
  };

  sendSubmit(value) {
    const { form, dispatch } = this.props;
    form.validateFields((err, values) => {
      if (value && value.length > 0) {
        if (!err) {
          values.captcha = value;
          dispatch({
            type: 'authentication/login',
            payload: values,
          });
        }
      }
    });
  }

  componentWillUpdate(nextProps, nextState) {
    if (this.state.value !== nextState.value) {
      this.sendSubmit(nextState.value);
    }
  }

  handleChangePhone(value) {
    this.setState({
      help: '',
      validateStatus: '',
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { help, validateStatus } = this.state;
    return (
      <Form onSubmit={e => this.handleSubmit(e)}>
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
          })(<Input onChange={e => this.handleChangePhone(e)} />)}
        </Form.Item>
        <Form.Item help={help} validateStatus={validateStatus} style={{ marginBottom: '0px' }}>
          {getFieldDecorator('hidden', {})(<Input type="hidden" />)}
        </Form.Item>
        <Form.Item label="Mật khẩu">
          {getFieldDecorator('password', {
            rules: [
              {
                required: true,
                message: 'Vui lòng nhập mật khẩu!',
              },
            ],
          })(<Input autocomplete="password" type="password" />)}
        </Form.Item>
        <Form.Item>
          <ReCAPTCHA
            ref={recaptchaRef}
            onChange={e => this.handleChangeCaptcha(e)}
            sitekey="6LfUm5AUAAAAAB6eXtNTPWLUZT5hCbDabBBmLK23"
            size="invisible"
          />
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
        <Link to="/forgot">Quên mật khẩu?</Link>
      </Form>
    );
  }
}
export default FormLogin;
