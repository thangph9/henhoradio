/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable react/jsx-indent */
/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable arrow-body-style */
/* eslint-disable react/no-array-index-key */
/* eslint-disable no-useless-concat */
/* eslint-disable class-methods-use-this */
/* eslint-disable prefer-template */
/* eslint-disable dot-notation */
/* eslint-disable react/require-render-return */
/* eslint-disable prefer-const */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable no-param-reassign */
/* eslint-disable no-unused-vars */
/* eslint-disable react/sort-comp */
/* eslint-disable no-return-assign */
/* eslint-disable react/no-unused-state */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Input, Button, Icon, Avatar, Radio, Checkbox, message } from 'antd';
import { Link, Redirect } from 'react-router-dom';
import styles from './index.less';

const RadioGroup = Radio.Group;
const { TextArea } = Input;
@connect(({ loading, authentication }) => ({
  submitting: loading.effects['form/submitRegularForm'],
  authentication,
}))
class Question extends PureComponent {
  state = {
    dataQuestion: [],
    currentQuestion: 0,
    arrCheck: [],
    effectMain: false,
    statusArrea: true,
    valueInput: '',
    arrAnswer: [],
    validateText: true,
  };

  componentDidMount() {
    this.props.dispatch({
      type: 'authentication/questionregister',
    });
    setTimeout(() => {
      this.setState({
        effectMain: true,
      });
    }, 100);
  }

  onChangeRadio(e, q) {
    let obj = {
      question: q,
      answer: [e.target.value],
      type: '2',
    };
    let arr = this.state.arrAnswer;
    arr[arr.length] = obj;
    if (this.state.currentQuestion + 1 < this.state.dataQuestion.length) {
      setTimeout(() => {
        this.setState({
          currentQuestion: this.state.currentQuestion + 1,
          arrAnswer: arr,
        });
      }, 500);
    }
  }

  onChangeCheckBox(e, q) {
    this.setState({
      arrCheck: e,
    });
  }

  handleClickNext(q, t) {
    let arr = this.state.arrAnswer;

    if (t === '1') {
      let obj = {
        question: q,
        answer: [this.state.valueInput],
        type: '1',
      };
      arr[arr.length] = obj;
      this.setState({
        arrAnswer: arr,
      });
    } else if (t === '3') {
      let obj = {
        question: q,
        answer: this.state.arrCheck,
        type: '3',
      };
      arr[arr.length] = obj;
      this.setState({
        arrAnswer: arr,
      });
    }
    if (this.state.currentQuestion + 1 < this.state.dataQuestion.length) {
      this.setState({
        currentQuestion: this.state.currentQuestion + 1,
        valueInput: '',
      });
    }
  }

  handleClickPrev() {
    this.setState(
      {
        currentQuestion: this.state.currentQuestion - 1,
        valueInput: '',
      },
      () => {
        let arr = this.state.arrAnswer;
        arr.splice(arr.length - 1, 1);
        this.setState({
          arrAnswer: arr,
        });
      }
    );
  }

  handleClickSubmit() {
    // message.info('Đã gửi!');
    this.props.dispatch({
      type: 'authentication/sendanswer',
      payload: {
        answer: this.state.arrAnswer,
      },
    });
  }

  handleChangeInput(e, q) {
    if (
      /^[a-zA-Z0-9àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ][a-zA-Z0-9 .,-àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ!@()]{0,200}$/.test(
        e.target.value
      ) === true
    ) {
      this.setState({
        valueInput: e.target.value,
        validateText: true,
      });
    } else {
      this.setState({
        valueInput: e.target.value,
        validateText: false,
      });
    }
  }

  handleClickSkip() {
    this.setState({
      currentQuestion: this.state.currentQuestion + 1,
      valueInput: '',
    });
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.authentication.questionregister !== nextProps.authentication.questionregister) {
      if (nextProps.authentication.questionregister.status === 'ok') {
        this.setState({
          dataQuestion: nextProps.authentication.questionregister.data,
        });
      }
    }
  }

  render() {
    const { currentQuestion, dataQuestion, arrCheck, effectMain, valueInput } = this.state;
    return (
      <div style={{ background: '#F3F5F9', marginTop: '-20px', height: '100%' }}>
        <div className={styles['container']}>
          {dataQuestion.length > 0 && (
            <div
              className={effectMain ? styles['main'] + ' ' + styles['main-effect'] : styles['main']}
            >
              <div className={styles['number-of-question'] + ' ' + styles['center-item']}>
                {currentQuestion + 1} of {dataQuestion.length}
              </div>
              <div className={styles['current-question'] + ' ' + styles['center-item']}>
                {dataQuestion[currentQuestion].title}
              </div>
              <div className={styles['avatar']}>
                <span className={styles['your-name']}>Bạn</span> <Avatar size="large" icon="user" />
              </div>
              <div className={styles['current-answer']}>
                {dataQuestion[currentQuestion].answer &&
                  dataQuestion[currentQuestion].type === '2' && (
                    <RadioGroup
                      style={{ width: '100%' }}
                      onChange={e =>
                        this.onChangeRadio(e, dataQuestion[currentQuestion].question_id)
                      }
                    >
                      {dataQuestion[currentQuestion].answer.map((v, i) => {
                        return (
                          <Radio
                            key={i}
                            value={v}
                            className={
                              styles['radio'] + ' ' + 'question-page' + ' ' + styles['list-answer']
                            }
                          >
                            {v}
                          </Radio>
                        );
                      })}
                    </RadioGroup>
                  )}
                {dataQuestion[currentQuestion].answer &&
                  dataQuestion[currentQuestion].type === '3' && (
                    <Checkbox.Group
                      style={{ width: '100%' }}
                      onChange={e =>
                        this.onChangeCheckBox(e, dataQuestion[currentQuestion].question_id)
                      }
                    >
                      {dataQuestion[currentQuestion].answer.map((v, i) => {
                        return (
                          <Checkbox
                            key={i}
                            value={v}
                            className={
                              styles['check'] + ' ' + 'question-page' + ' ' + styles['list-answer']
                            }
                          >
                            {v}
                          </Checkbox>
                        );
                      })}
                    </Checkbox.Group>
                  )}
                {dataQuestion[currentQuestion].type === '1' && (
                  <div style={{ padding: '30px' }} className={styles['list-answer']}>
                    <div>
                      <TextArea
                        value={valueInput}
                        onChange={e =>
                          this.handleChangeInput(e, dataQuestion[currentQuestion].question_id)
                        }
                        placeholder="Do something..."
                        rows={3}
                      />
                    </div>
                  </div>
                )}
              </div>
              <div
                style={
                  this.state.validateText
                    ? { opacity: 0 }
                    : { opacity: 1, color: 'red', fontSize: '14px' }
                }
              >
                Ký tự không hợp lệ hoặc quá dài !
              </div>
              {currentQuestion > 0 ? (
                <div onClick={() => this.handleClickPrev()} className={styles['prev-check']}>
                  <Icon style={{ fontSize: '25px', marginRight: '10px' }} type="arrow-left" />
                  Quay lại
                </div>
              ) : (
                <div className={styles['prev-check']} />
              )}
              {currentQuestion === dataQuestion.length - 1 ? (
                <div onClick={() => this.handleClickSubmit()} className={styles['button-submit']}>
                  <Icon style={{ fontSize: '25px', marginRight: '10px' }} type="check-circle" />
                  Hoàn tất
                </div>
              ) : (
                <div onClick={() => this.handleClickSkip()} className={styles['button-submit']}>
                  <Icon style={{ fontSize: '25px', marginRight: '10px' }} type="check" />
                  Bỏ qua
                </div>
              )}
              {((dataQuestion[currentQuestion].type === '3' && arrCheck.length > 0) ||
                (dataQuestion[currentQuestion].type === '1' &&
                  valueInput.length > 0 &&
                  this.state.validateText)) &&
              currentQuestion + 1 < dataQuestion.length ? (
                <div
                  onClick={() =>
                    this.handleClickNext(
                      dataQuestion[currentQuestion].question_id,
                      dataQuestion[currentQuestion].type
                    )
                  }
                  className={styles['next-check']}
                >
                  Tiếp tục{' '}
                  <Icon style={{ fontSize: '25px', marginLeft: '10px' }} type="arrow-right" />
                </div>
              ) : (
                <div className={styles['next-check']} />
              )}
            </div>
          )}
        </div>
      </div>
    );
  }
}
export default Question;
