/* eslint-disable react/destructuring-assignment */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Input, Icon, Avatar, Radio, Checkbox, message } from 'antd';
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
    valueInput: '',
    arrAnswer: [],
    validateText: true,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'authentication/questionregister',
    });
    setTimeout(() => {
      this.setState({
        effectMain: true,
      });
    }, 100);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.authentication.questionregister !== nextProps.authentication.questionregister) {
      if (nextProps.authentication.questionregister.status === 'ok') {
        this.setState({
          dataQuestion: nextProps.authentication.questionregister.data,
        });
      }
    }
    if (this.props.authentication.sendanswer !== nextProps.authentication.sendanswer) {
      if (
        nextProps.authentication.sendanswer.status === 'ok' &&
        nextProps.authentication.sendanswer.timeline !==
          this.props.authentication.sendanswer.timeline
      ) {
        message.success('Khảo sát thành công! Xin mời đăng nhập ');
        nextProps.history.push({ pathname: '/login', search: '?ref=0' });
      }
    }
  }

  onChangeRadio(e, q) {
    const { arrAnswer, currentQuestion, dataQuestion } = this.state;
    const obj = {
      question: q,
      answer: [e.target.value],
      type: '2',
    };
    const arr = arrAnswer;
    arr[arr.length] = obj;
    if (currentQuestion + 1 < dataQuestion.length) {
      setTimeout(() => {
        this.setState({
          currentQuestion: currentQuestion + 1,
          arrAnswer: arr,
        });
      }, 500);
    }
  }

  onChangeCheckBox(e) {
    this.setState({
      arrCheck: e,
    });
  }

  handleClickNext(q, t) {
    const { arrAnswer, valueInput, arrCheck, currentQuestion, dataQuestion } = this.state;
    const arr = arrAnswer;

    if (t === '1') {
      const obj = {
        question: q,
        answer: [valueInput],
        type: '1',
      };
      arr[arr.length] = obj;
      this.setState({
        arrAnswer: arr,
      });
    } else if (t === '3') {
      const obj = {
        question: q,
        answer: arrCheck,
        type: '3',
      };
      arr[arr.length] = obj;
      this.setState({
        arrAnswer: arr,
      });
    }
    if (currentQuestion + 1 < dataQuestion.length) {
      this.setState({
        currentQuestion: currentQuestion + 1,
        valueInput: '',
      });
    }
  }

  handleClickPrev() {
    const { currentQuestion, arrAnswer } = this.state;
    this.setState(
      {
        currentQuestion: currentQuestion - 1,
        valueInput: '',
      },
      () => {
        const arr = arrAnswer;
        arr.splice(arr.length - 1, 1);
        this.setState({
          arrAnswer: arr,
        });
      }
    );
  }

  handleClickSubmit() {
    const { dispatch } = this.props;
    const { arrAnswer } = this.state;
    dispatch({
      type: 'authentication/sendanswer',
      payload: {
        answer: arrAnswer,
      },
    });
  }

  handleChangeInput(e) {
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
      // eslint-disable-next-line react/no-access-state-in-setstate
      currentQuestion: this.state.currentQuestion + 1,
      valueInput: '',
    });
  }

  render() {
    const { currentQuestion, dataQuestion, arrCheck, effectMain, valueInput } = this.state;
    return (
      <div style={{ background: '#F3F5F9', marginTop: '-20px', height: '100%' }}>
        <div className={styles.container}>
          {dataQuestion.length > 0 && (
            <div className={effectMain ? `${styles.main} ${styles['main-effect']}` : styles.main}>
              <div className={`${styles['number-of-question']} ${styles['center-item']}`}>
                {currentQuestion + 1} of {dataQuestion.length}
              </div>
              <div className={`${styles['current-question']} ${styles['center-item']}`}>
                {dataQuestion[currentQuestion].title}
              </div>
              <div className={styles.avatar}>
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
                      {dataQuestion[currentQuestion].answer.map((v, i) => (
                        <Radio
                          // eslint-disable-next-line react/no-array-index-key
                          key={i}
                          value={v}
                          className={`${styles.radio} question-page ${styles['list-answer']}`}
                        >
                          {v}
                        </Radio>
                      ))}
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
                      {dataQuestion[currentQuestion].answer.map((v, i) => (
                        <Checkbox
                          // eslint-disable-next-line react/no-array-index-key
                          key={i}
                          value={v}
                          className={`${styles.check}  question-page ${styles['list-answer']}`}
                        >
                          {v}
                        </Checkbox>
                      ))}
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
