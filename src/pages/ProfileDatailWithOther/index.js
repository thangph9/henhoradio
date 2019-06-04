/* eslint-disable class-methods-use-this */
/* eslint-disable no-return-assign */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/no-array-index-key */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable camelcase */
/* eslint-disable no-plusplus */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Icon, Input, Button, Skeleton, Radio, Checkbox, message } from 'antd';
import { Link } from 'react-router-dom';
import styles from './index.less';

const { TextArea } = Input;
const RadioGroup = Radio.Group;
const CheckboxGroup = Checkbox.Group;
@connect(({ profile, loading, authentication, user }) => ({
  profile,
  loading: loading.effects['profile/fetchAdvanced'],
  authentication,
  user,
}))
class AdvancedProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editing: false,
      list: [],
      question: [],
      title: [],
      type: '0',
      arrRadio: [],
      arrCheck: [],
      arrTextAria: [],
      yourQuestion: [],
      submitEnable: true,
      'item-editing': undefined,
      groupQuestion: [],
      listQuestion: undefined,
      validateText: true,
      loaded: false,
      care: false,
    };
    this.columns = [
      {
        title: 'STT',
        dataIndex: 'index',
        key: 'index',
        width: '6%',
        align: 'center',
      },
      {
        title: 'Câu hỏi',
        dataIndex: 'question',
        key: 'question',
        width: '42%',
        align: 'center',
      },
      {
        title: 'Trả lời',
        dataIndex: 'answer',
        key: 'answer',
        align: 'center',
        width: '42%',
      },
    ];
  }

  componentDidMount() {
    const { dispatch, location } = this.props;
    const { id } = location.query;
    dispatch({
      type: 'authentication/getuserbyid',
      payload: id,
    });
  }

  componentWillReceiveProps(nextProps) {
    const { authentication, location, dispatch } = this.props;
    if (authentication.getuserbyid !== nextProps.authentication.getuserbyid) {
      this.setState(
        {
          dataUser: nextProps.authentication.getuserbyid.result,
          question: nextProps.authentication.getuserbyid.question,
          title: nextProps.authentication.getuserbyid.title,
          group: nextProps.authentication.getuserbyid.group,
          yourQuestion: nextProps.authentication.getuserbyid.yourQuestion,
          care: nextProps.authentication.getuserbyid.care,
        },
        () => {
          const { dataUser } = this.state;
          const imgLoader = new Image();
          imgLoader.src = `${nextProps.user.getsetting.cdn}${dataUser.avatar}`;
          imgLoader.onload = () => {
            if (this.imgElm && dataUser.avatar) {
              this.imgElm.style.backgroundImage = `url(${nextProps.user.getsetting.cdn}${
                dataUser.avatar
              })`;
              this.setState({
                loaded: true,
              });
            }
          };
          const { title, question } = this.state;
          const arrGroup = [];
          title.forEach(element => {
            arrGroup.push(element.group_id);
          });
          this.setState({
            groupQuestion: Array.from(new Set(arrGroup)),
          });
          const arr = [];
          for (let i = 0; i < title.length; i++) {
            for (let j = 0; j < question.length; j++) {
              if (question[j].question_id === title[i].question_id) {
                const obj = {};
                obj.question_id = question[j].question_id;
                obj.title = title[i].title;
                obj.answer = question[j].answer;
                obj.groupid = title[i].group_id;
                arr.push(obj);
              }
            }
          }
          this.setState({
            list: arr,
          });
        }
      );
    }
    if (authentication.updateprofilequestion !== nextProps.authentication.updateprofilequestion) {
      if (
        nextProps.authentication.updateprofilequestion.status === 'ok' &&
        authentication.updateprofilequestion.timeline !==
          nextProps.authentication.updateprofilequestion.timeline
      ) {
        const { id } = location.query;
        dispatch({
          type: 'authentication/getuserbyid',
          payload: {
            id,
          },
        });
        setTimeout(() => {
          message.success('Thay đổi dữ liệu thành công');
        }, 500);
      }
    }
  }

  getTitleGroup(value) {
    const { group } = this.state;
    return group.find(e => e.group_id === value).title;
  }

  getTitleQuestion(value) {
    const { title } = this.state;
    return title.find(element => element.question_id === value).title;
  }

  getAnswerQuestion(value) {
    const { list } = this.state;
    const answer = list.find(element => element.question_id === value);
    if (answer) return answer.answer.toString();
    return '';
  }

  checkQuestionAnswered(value) {
    const { list } = this.state;
    const question = list.find(element => element.question_id === value);
    if (question) return true;
    return false;
  }

  handleClickQuestionItem(element, value) {
    this.setState({
      [`question-number-${element}`]: value,
      listQuestion: undefined,
      editing: false,
    });
  }

  handleClickListQuestion(v) {
    const { listQuestion } = this.state;
    if (listQuestion === v) {
      this.setState({
        listQuestion: undefined,
        editing: false,
      });
    } else {
      this.setState({
        listQuestion: v,
        editing: true,
      });
    }
  }

  handleChangeRadioEditing(e) {
    if (e.target.value.length > 0) {
      this.setState({
        submitEnable: false,
      });
    } else {
      this.setState({
        submitEnable: true,
      });
    }
    this.setState({
      arrRadio: [e.target.value],
    });
  }

  handleChangeCheckEditing(e) {
    if (e.length > 0 || (e[0] !== undefined && e[0] === '')) {
      this.setState({
        submitEnable: false,
      });
    } else {
      this.setState({
        submitEnable: true,
      });
    }

    if (e[0] !== undefined && e[0] === '') {
      e.splice(0, 1);
      this.setState({
        arrCheck: e,
      });
    } else {
      this.setState({
        arrCheck: e,
      });
    }
  }

  handleChangeTexeAria(e) {
    if (e.target.value.length > 0) {
      this.setState({
        submitEnable: false,
      });
    } else {
      this.setState({
        submitEnable: true,
      });
    }
    this.setState({
      arrTextAria: [e.target.value],
    });
  }

  checkYourQuestion(question_id) {
    const { yourQuestion } = this.state;
    const result = yourQuestion.find(element => element.question_id === question_id);
    if (result) return true;
    return false;
  }

  handleCancer() {
    this.setState({
      'item-editing': undefined,
      editing: false,
      questionEditing: undefined,
      submitEnable: true,
      validateText: true,
    });
  }

  handleSubmitEdit(value) {
    const { dispatch } = this.props;
    const { arrTextAria, arrRadio, arrCheck } = this.state;
    if (value.type === '1') {
      dispatch({
        type: 'authentication/updateprofilequestion',
        payload: {
          question_id: value.question_id,
          answer: arrTextAria,
        },
      });
    } else if (value.type === '2') {
      dispatch({
        type: 'authentication/updateprofilequestion',
        payload: {
          question_id: value.question_id,
          answer: arrRadio,
        },
      });
    } else if (value.type === '3') {
      dispatch({
        type: 'authentication/updateprofilequestion',
        payload: {
          question_id: value.question_id,
          answer: arrCheck,
        },
      });
    }
    this.setState({
      'item-editing': undefined,
      editing: false,
      questionEditing: undefined,
      submitEnable: true,
    });
  }

  handleClickChangeCare() {
    const { id } = this.props.location.query;
    this.props.dispatch({
      type: 'authentication/changecare',
      payload: {
        userid: id,
        care: !this.state.care,
        type: 'user',
      },
    });
  }

  handleClickEdit(v, e) {
    const { title } = this.state;
    const type = title.find(element => element.question_id === e);
    const { list } = this.state;
    if (type.type === '1') {
      const answer = list.find(element => element.question_id === e);
      if (answer) {
        this.setState({
          arrTextAria: answer.answer,
          submitEnable: false,
        });
      }
    }
    if (type.type === '2') {
      const answer = list.find(element => element.question_id === e);
      if (answer) {
        this.setState({
          arrRadio: answer.answer,
          submitEnable: false,
        });
      }
    }
    if (type.type === '3') {
      const answer = list.find(element => element.question_id === e);
      if (answer) {
        this.setState({
          arrCheck: answer.answer,
          submitEnable: false,
        });
      }
    }
    this.setState({
      editing: true,
      'item-editing': v,
      questionEditing: type,
      type: type.type,
    });
  }

  render() {
    const { dataUser, list, groupQuestion, listQuestion, editing } = this.state;
    const dataTable = [];
    list.forEach((v, i) => {
      const productTable = {};
      productTable.key = `${i}`;
      productTable.index = i + 1;
      productTable.question = v.title;
      productTable.answer = v.answer.toString();
      dataTable.push(productTable);
    });
    return (
      <div className={styles.profile}>
        {dataUser ? (
          <div className={styles['avatar-user']}>
            <div className={styles['container-avatar']}>
              <div
                ref={imgElm => (this.imgElm = imgElm)}
                className={styles['background-avatar']}
                style={{
                  backgroundImage:
                    dataUser.gender === 'male'
                      ? `url(http://cdn.henhoradio.net/images/ft/0bfed19c-071d-4a16-90d5-037fd22ed912)`
                      : dataUser.gender === 'female'
                      ? `url(http://cdn.henhoradio.net/images/ft/73cb3725-aa00-4f91-b6eb-8bff157fd714)`
                      : `url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAqIAAAGAAQMAAABMQ5IQAAAAA1BMVEX///+nxBvIAAAANklEQVR42u3BAQEAAACCoP6vbojAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIC8A4EAAAFVQt90AAAAAElFTkSuQmCC)`,
                  backgroundColor: this.state.loadedAvatar ? 'none' : 'rgb(242, 242, 242)',
                }}
              />
              <div className={`${styles['account-infomation']} ${styles['desktop-infomation']}`}>
                <div className={styles['name-of-user']}>{dataUser.fullname}</div>
                <div className={styles['age-address']}>
                  <span className={styles['age-of-user']}>
                    {new Date().getFullYear() - dataUser.dob_year}
                  </span>
                  <span className={styles['address-of-user']}>{dataUser.address}</span>
                </div>
              </div>
              {this.state.care !== undefined && (
                <div
                  onClick={() => this.handleClickChangeCare()}
                  data-care-star={this.state.care}
                  className={styles['care-star']}
                >
                  <Icon type="star" theme="filled" /> Quan tâm
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className={styles['avatar-user']}>
            <div className={styles['container-avatar']}>
              <div
                className={styles['background-avatar']}
                style={{
                  backgroundImage: `url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAqIAAAGAAQMAAABMQ5IQAAAAA1BMVEX///+nxBvIAAAANklEQVR42u3BAQEAAACCoP6vbojAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIC8A4EAAAFVQt90AAAAAElFTkSuQmCC)`,
                }}
              />
            </div>
          </div>
        )}
        <div className={styles.container}>
          {editing && <div className={styles.editing} />}
          {dataUser && (
            <div className={`${styles['account-infomation']} ${styles['mobile-infomation']}`}>
              <div className={styles['name-of-user']}>Họ tên: {dataUser.fullname}</div>
              <div className={styles['age-of-user']}>
                Tuổi : {new Date().getFullYear() - dataUser.dob_year}
              </div>
              Địa chỉ : {dataUser.address}
            </div>
          )}
          <div className={styles['edit-form']}>
            <div className={`${styles['edit-form-left']} text-form`}>
              {dataUser ? (
                groupQuestion.map(element => (
                  <div key={element}>
                    {this.state['item-editing'] && this.state['item-editing'] === element ? (
                      <div>
                        <div className={`${styles['form-edit-item']} ${styles['essay-editing']}`}>
                          <div className={styles['question-item']}>
                            <div className={styles['theme-question']}>
                              <span> {this.getTitleGroup(element)}</span>
                            </div>
                            <span className={styles['question-title']}>
                              {this.state.title.filter(e => e.group_id === element).length > 0 &&
                                this.getTitleQuestion(
                                  !this.state[`question-number-${element}`]
                                    ? this.state.title.filter(e => e.group_id === element)[0]
                                        .question_id
                                    : this.state[`question-number-${element}`]
                                )}
                            </span>
                          </div>
                          <div
                            className={`${styles['answer-item']} answer-item ${
                              styles['active-editing']
                            }`}
                          >
                            {this.state.type === '1' && (
                              <div style={{ width: '100%' }}>
                                <TextArea
                                  onChange={e => this.handleChangeTexeAria(e)}
                                  style={{ fontSize: '18px', color: 'black', fontWeight: 600 }}
                                  rows={8}
                                />
                                <div
                                  className={styles['validate-text']}
                                  style={this.state.validateText ? { opacity: 0 } : { opacity: 1 }}
                                >
                                  Ký tự không hợp lệ hoặc quá dài !
                                </div>
                              </div>
                            )}
                            {this.state.type === '2' && (
                              <div className={`${styles['radio-group']} radio-form`}>
                                <RadioGroup onChange={e => this.handleChangeRadioEditing(e)}>
                                  {this.state.questionEditing.answer.map((v, i) => (
                                    <div key={i} className={styles['radio-question']}>
                                      <Radio
                                        style={{
                                          color: '#fff',
                                          fontSize: '18px',
                                          display: 'flex',
                                          alignItems: 'center',
                                          padding: '20px',
                                        }}
                                        value={v}
                                      >
                                        {v}
                                      </Radio>
                                    </div>
                                  ))}
                                </RadioGroup>
                              </div>
                            )}
                            {this.state.type === '3' && (
                              <div className={`${styles['radio-group']} radio-form`}>
                                <CheckboxGroup
                                  style={{ width: '100%' }}
                                  onChange={e => this.handleChangeCheckEditing(e)}
                                >
                                  {this.state.questionEditing.answer.map((v, i) => (
                                    <div key={i} className={styles['radio-question']}>
                                      <Checkbox
                                        style={{
                                          color: '#fff',
                                          fontSize: '18px',
                                          display: 'flex',
                                          alignItems: 'center',
                                          padding: '20px',
                                        }}
                                        value={v}
                                      >
                                        {v}
                                      </Checkbox>
                                    </div>
                                  ))}
                                </CheckboxGroup>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className={styles['button-editing']}>
                          <Button
                            onClick={() => this.handleCancer()}
                            style={{ marginRight: '5px' }}
                            shape="round"
                            size="large"
                          >
                            CANCER
                          </Button>
                          <Button
                            disabled={this.state.submitEnable}
                            onClick={() => this.handleSubmitEdit(this.state.questionEditing)}
                            style={{ marginRight: '5px' }}
                            type="primary"
                            shape="round"
                            icon="check"
                            size="large"
                          >
                            SAVE
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div
                        className={styles['form-edit-item']}
                        style={listQuestion === element ? { zIndex: 3 } : {}}
                      >
                        <div
                          onClick={() => this.handleClickListQuestion(element)}
                          className={styles['question-item']}
                        >
                          <div className={styles['theme-question']}>
                            <span> {this.getTitleGroup(element)}</span>
                            {listQuestion && listQuestion === element ? (
                              <Icon type="caret-up" />
                            ) : (
                              <Icon type="caret-down" />
                            )}
                          </div>
                          <span className={styles['question-title']}>
                            {this.state.title.filter(e => e.group_id === element).length > 0 &&
                              this.getTitleQuestion(
                                !this.state[`question-number-${element}`]
                                  ? this.state.title.filter(e => e.group_id === element)[0]
                                      .question_id
                                  : this.state[`question-number-${element}`]
                              )}
                          </span>
                        </div>
                        {listQuestion && listQuestion === element && (
                          <div className={styles['list-question-hidden']}>
                            {this.state.title
                              .filter(e => e.group_id === element)
                              .map((v, i) => {
                                if (
                                  v.title ===
                                  this.getTitleQuestion(
                                    !this.state[`question-number-${element}`]
                                      ? this.state.title.filter(e => e.group_id === element)[0]
                                          .question_id
                                      : this.state[`question-number-${element}`]
                                  )
                                ) {
                                  return '';
                                }
                                return (
                                  <div
                                    onClick={() =>
                                      this.handleClickQuestionItem(element, v.question_id)
                                    }
                                    key={i}
                                    className={styles['item-question']}
                                  >
                                    <span>{v.title}</span>
                                    {!this.checkQuestionAnswered(v.question_id) && (
                                      <span className={styles['chua-hoan-thien']}>
                                        Chưa hoàn thiện
                                      </span>
                                    )}
                                  </div>
                                );
                              })}
                          </div>
                        )}
                        {listQuestion && listQuestion === element ? (
                          ''
                        ) : (
                          <div className={`${styles['answer-item']} answer-item`}>
                            <span className={styles['answer-title']}>
                              {!localStorage.token ? (
                                <i
                                  style={{
                                    display: 'inline',
                                    fontSize: '16px',
                                    color: '#aeb4bf',
                                    fontWeight: '600',
                                  }}
                                >
                                  Bạn cần{' '}
                                  <Link className={styles['answer-span']} to="/login">
                                    đăng nhập
                                  </Link>{' '}
                                  để sử dụng chức năng này
                                </i>
                              ) : (
                                (this.checkYourQuestion(
                                  !this.state[`question-number-${element}`]
                                    ? this.state.title.filter(e => e.group_id === element)[0]
                                        .question_id
                                    : this.state[`question-number-${element}`]
                                ) ||
                                  !this.checkQuestionAnswered(
                                    !this.state[`question-number-${element}`]
                                      ? this.state.title.filter(e => e.group_id === element)[0]
                                          .question_id
                                      : this.state[`question-number-${element}`]
                                  )) && <span> Trả lời: </span>
                              )}
                              {localStorage.token && (
                                <i
                                  style={{
                                    display: 'inline',
                                    fontSize: '16px',
                                    color: '#aeb4bf',
                                    fontWeight: '600',
                                  }}
                                >
                                  {this.checkYourQuestion(
                                    !this.state[`question-number-${element}`]
                                      ? this.state.title.filter(e => e.group_id === element)[0]
                                          .question_id
                                      : this.state[`question-number-${element}`]
                                  ) ||
                                  !this.checkQuestionAnswered(
                                    !this.state[`question-number-${element}`]
                                      ? this.state.title.filter(e => e.group_id === element)[0]
                                          .question_id
                                      : this.state[`question-number-${element}`]
                                  ) ? (
                                    this.state.title.filter(e => e.group_id === element).length >
                                      0 &&
                                    this.getAnswerQuestion(
                                      !this.state[`question-number-${element}`]
                                        ? this.state.title.filter(e => e.group_id === element)[0]
                                            .question_id
                                        : this.state[`question-number-${element}`]
                                    )
                                  ) : (
                                    <span>
                                      Bạn cần{' '}
                                      <span
                                        className={styles['answer-span']}
                                        onClick={() =>
                                          this.handleClickEdit(
                                            element,
                                            !this.state[`question-number-${element}`]
                                              ? this.state.title.filter(
                                                  e => e.group_id === element
                                                )[0].question_id
                                              : this.state[`question-number-${element}`]
                                          )
                                        }
                                      >
                                        trả lời
                                      </span>{' '}
                                      câu hỏi này để xem câu trả lời của đối phương
                                    </span>
                                  )}
                                </i>
                              )}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div>
                  <div className={`${styles['form-edit-item']} preload-by-id`}>
                    <div style={{ paddingTop: '8px', paddingBottom: '35px' }}>
                      <Skeleton paragraph={{ rows: 1 }} active />
                    </div>
                    <div style={{ paddingBottom: '8px' }} className="answer-preload">
                      <Skeleton title={false} paragraph={{ rows: 1 }} active />
                    </div>
                  </div>
                  <div className={`${styles['form-edit-item']} preload-by-id`}>
                    <div style={{ paddingTop: '8px', paddingBottom: '35px' }}>
                      <Skeleton paragraph={{ rows: 1 }} active />
                    </div>
                    <div style={{ paddingBottom: '8px' }} className="answer-preload">
                      <Skeleton title={false} paragraph={{ rows: 1 }} active />
                    </div>
                  </div>
                  <div className={`${styles['form-edit-item']} preload-by-id`}>
                    <div style={{ paddingTop: '8px', paddingBottom: '35px' }}>
                      <Skeleton paragraph={{ rows: 1 }} active />
                    </div>
                    <div style={{ paddingBottom: '8px' }} className="answer-preload">
                      <Skeleton title={false} paragraph={{ rows: 1 }} active />
                    </div>
                  </div>
                  <div className={`${styles['form-edit-item']} preload-by-id`}>
                    <div style={{ paddingTop: '8px', paddingBottom: '35px' }}>
                      <Skeleton paragraph={{ rows: 1 }} active />
                    </div>
                    <div style={{ paddingBottom: '8px' }} className="answer-preload">
                      <Skeleton title={false} paragraph={{ rows: 1 }} active />
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div style={{ flexBasis: '5%' }} />
            {dataUser ? (
              <div className={styles['edit-form-right']}>
                <div className={styles['right-item']}>
                  <div className={styles['left-icon']}>
                    <Icon style={{ fontSize: '25px', cursor: 'pointer' }} type="profile" />
                  </div>
                  <div className={styles['right-body']}>
                    <div className={styles['right-title']}>Ngoại hình</div>
                    <div className={styles['right-content']}>
                      <div className={styles['box-ngoai-hinh']}>
                        <span className={styles['item-span']}>Chiều cao: </span>
                        <i className={styles['thong-tin-ngoai-hinh']}>
                          {dataUser.height ? `${dataUser.height} cm` : 'Chưa xác định'}
                        </i>
                      </div>
                      <div className={styles['box-ngoai-hinh']}>
                        <span className={styles['item-span']}>Cân nặng:</span>
                        <i className={styles['thong-tin-ngoai-hinh']}>
                          {dataUser.weight ? `${dataUser.weight} kg` : 'Chưa xác định'}
                        </i>
                      </div>
                    </div>
                  </div>
                </div>
                <div className={styles['right-item']}>
                  <div className={styles['left-icon']}>
                    <Icon style={{ fontSize: '25px', cursor: 'pointer' }} type="profile" />
                  </div>
                  <div className={styles['right-body']}>
                    <div className={styles['right-title']}>Nghề nghiệp</div>
                    <div className={styles['right-content']}>
                      <div className={styles['box-ngoai-hinh']}>
                        <span className={styles['item-span']}>Công việc hiện tại: </span>
                        <i className={styles['thong-tin-ngoai-hinh']}>
                          {dataUser.jobs ? dataUser.jobs.jobs : 'Chưa xác định'}
                        </i>
                      </div>
                    </div>
                  </div>
                </div>
                <div className={styles['right-item']}>
                  <div className={styles['left-icon']}>
                    <Icon style={{ fontSize: '25px', cursor: 'pointer' }} type="profile" />
                  </div>
                  <div className={styles['right-body']}>
                    <div className={styles['right-title']}>Trình độ học vấn:</div>
                    <div className={styles['right-content']}>
                      <div className={styles['box-ngoai-hinh']}>
                        <span className={styles['item-span']}>Cấp bậc:</span>
                        <i className={styles['thong-tin-ngoai-hinh']}>
                          {dataUser.education ? dataUser.education.education : 'Chưa xác định'}
                        </i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ flexBasis: '40%' }} className="skeleton">
                <div style={{ paddingBottom: '20px', paddingTop: '15px' }}>
                  <Skeleton paragraph={{ rows: 2 }} />
                </div>
                <div style={{ paddingBottom: '20px', paddingTop: '15px' }}>
                  <Skeleton paragraph={{ rows: 1 }} />
                </div>
                <div style={{ paddingBottom: '20px', paddingTop: '15px' }}>
                  <Skeleton paragraph={{ rows: 1 }} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default AdvancedProfile;
