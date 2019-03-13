/* eslint-disable camelcase */
/* eslint-disable no-param-reassign */
/* eslint-disable no-return-assign */
/* eslint-disable prefer-template */
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
import { Table, Icon, Input, Button, Skeleton, Radio, Checkbox, message, Tooltip } from 'antd';
import styles from './index.less';

const { TextArea } = Input;
const RadioGroup = Radio.Group;
const CheckboxGroup = Checkbox.Group;
@connect(({ profile, loading, authentication }) => ({
  profile,
  loading: loading.effects['profile/fetchAdvanced'],
  authentication,
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
    const { dispatch } = this.props;
    const { id } = this.props.location.query;
    dispatch({
      type: 'authentication/getuserbyid',
      payload: {
        id,
      },
    });
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.authentication.getuserbyid !== nextProps.authentication.getuserbyid) {
      if (nextProps.authentication.getuserbyid.status === 'ok') {
        this.setState(
          {
            dataUser: nextProps.authentication.getuserbyid.data,
            question: nextProps.authentication.getuserbyid.question,
            title: nextProps.authentication.getuserbyid.title,
            group: nextProps.authentication.getuserbyid.group,
            yourQuestion: nextProps.authentication.getuserbyid.yourQuestion,
          },
          () => {
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
      } else if (nextProps.authentication.getuserbyid.status === 'error1') {
        nextProps.history.push({ pathname: `home/profile/404` });
      }
    }
    if (
      this.props.authentication.updateprofilequestion !==
      nextProps.authentication.updateprofilequestion
    ) {
      if (
        nextProps.authentication.updateprofilequestion.status === 'ok' &&
        this.props.authentication.updateprofilequestion.timeline !==
          nextProps.authentication.updateprofilequestion.timeline
      ) {
        const { id } = this.props.location.query;
        this.props.dispatch({
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

  handleClickListQuestion(v) {
    if (this.state.listQuestion === v) {
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

  handleClickQuestionItem(element, value) {
    this.setState({
      [`question-number-${element}`]: value,
      listQuestion: undefined,
      editing: false,
    });
  }

  getTitleGroup(value) {
    const { group } = this.state;
    return group.find(e => {
      return e.group_id === value;
    }).title;
  }

  checkQuestionAnswered(value) {
    const { list } = this.state;
    const question = list.find(element => {
      return element.question_id === value;
    });
    if (question) return true;
    return false;
  }

  getTitleQuestion(value) {
    const { title } = this.state;
    return title.find(element => {
      return element.question_id === value;
    }).title;
  }

  getAnswerQuestion(value) {
    const { list } = this.state;
    const answer = list.find(element => {
      return element.question_id === value;
    });
    if (answer) return answer.answer.toString();
    return '';
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
    if (e.length > 0) {
      this.setState({
        submitEnable: false,
      });
    } else {
      this.setState({
        submitEnable: true,
      });
    }
    this.setState({
      arrCheck: [e],
    });
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
    const result = this.state.yourQuestion.find(element => {
      return element.question_id === question_id;
    });
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
    if (value.type === '1') {
      this.props.dispatch({
        type: 'authentication/updateprofilequestion',
        payload: {
          question_id: value.question_id,
          answer: this.state.arrTextAria,
        },
      });
    } else if (value.type === '2') {
      this.props.dispatch({
        type: 'authentication/updateprofilequestion',
        payload: {
          question_id: value.question_id,
          answer: this.state.arrRadio,
        },
      });
    } else if (value.type === '3') {
      this.props.dispatch({
        type: 'authentication/updateprofilequestion',
        payload: {
          question_id: value.question_id,
          answer: this.state.arrCheck,
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

  handleClickEdit(v, e) {
    const { title } = this.state;
    const type = title.find(element => {
      return element.question_id === e;
    });
    const { list } = this.state;
    if (type.type === '1') {
      const answer = list.find(element => {
        return element.question_id === e;
      });
      if (answer) {
        this.setState({
          arrTextAria: answer.answer,
          submitEnable: false,
        });
      }
    }
    if (type.type === '2') {
      const answer = list.find(element => {
        return element.question_id === e;
      });
      if (answer) {
        this.setState({
          arrRadio: answer.answer,
          submitEnable: false,
        });
      }
    }
    if (type.type === '3') {
      const answer = list.find(element => {
        return element.question_id === e;
      });
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
    const { dataUser, list, groupQuestion, listQuestion } = this.state;
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
      <div className={styles['profile']}>
        {dataUser ? (
          <div className={styles['avatar-user']}>
            <div className={styles['container-avatar']}>
              <div
                className={styles['background-avatar']}
                style={
                  dataUser.avatar
                    ? { backgroundImage: `url(/images/ft/${dataUser.avatar})` }
                    : {
                        backgroundImage: `url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRRfrBguCWgYZbzZNuUieTET8xYdUatKh5t1emOHuR3Cjzihd82')`,
                      }
                }
              />
              <div className={styles['account-infomation']}>
                <div className={styles['name-of-user']}>{dataUser.fullname}</div>
                <div className={styles['age-address']}>
                  <span className={styles['age-of-user']}>
                    {new Date().getFullYear() - dataUser.dob_year}
                  </span>
                  <span className={styles['address-of-user']}>{dataUser.address}</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className={styles['avatar-user']}>
            <div className={styles['container-avatar']}>
              <div
                className={styles['background-avatar']}
                style={{
                  backgroundImage: `url(https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRRfrBguCWgYZbzZNuUieTET8xYdUatKh5t1emOHuR3Cjzihd82)`,
                }}
              />
            </div>
          </div>
        )}
        <div className={styles.container}>
          {this.state.editing && <div className={styles['editing']} />}
          <div className={styles['edit-form']}>
            <div className={`${styles['edit-form-left']} text-form`}>
              {dataUser ? (
                groupQuestion.map(element => {
                  return (
                    <div key={element}>
                      {this.state['item-editing'] && this.state['item-editing'] === element ? (
                        <div>
                          <div className={`${styles['form-edit-item']} ${styles['essay-editing']}`}>
                            <div className={styles['question-item']}>
                              <div className={styles['theme-question']}>
                                <span> {this.getTitleGroup(element)}</span>
                              </div>
                              <span className={styles['question-title']}>
                                {this.state.title.filter(e => {
                                  return e.group_id === element;
                                }).length > 0 &&
                                  this.getTitleQuestion(
                                    !this.state[`question-number-${element}`]
                                      ? this.state.title.filter(e => {
                                          return e.group_id === element;
                                        })[0].question_id
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
                                    style={
                                      this.state.validateText ? { opacity: 0 } : { opacity: 1 }
                                    }
                                  >
                                    Ký tự không hợp lệ hoặc quá dài !
                                  </div>
                                </div>
                              )}
                              {this.state.type === '2' && (
                                <div className={`${styles['radio-group']} radio-form`}>
                                  <RadioGroup onChange={e => this.handleChangeRadioEditing(e)}>
                                    {this.state.questionEditing.answer.map((v, i) => {
                                      return (
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
                                      );
                                    })}
                                  </RadioGroup>
                                </div>
                              )}
                              {this.state.type === '3' && (
                                <div className={`${styles['radio-group']} radio-form`}>
                                  <CheckboxGroup
                                    style={{ width: '100%' }}
                                    onChange={e => this.handleChangeCheckEditing(e)}
                                  >
                                    {this.state.questionEditing.answer.map((v, i) => {
                                      return (
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
                                      );
                                    })}
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
                              {this.state.title.filter(e => {
                                return e.group_id === element;
                              }).length > 0 &&
                                this.getTitleQuestion(
                                  !this.state[`question-number-${element}`]
                                    ? this.state.title.filter(e => {
                                        return e.group_id === element;
                                      })[0].question_id
                                    : this.state[`question-number-${element}`]
                                )}
                            </span>
                          </div>
                          {listQuestion && listQuestion === element && (
                            <div className={styles['list-question-hidden']}>
                              {this.state.title
                                .filter(e => {
                                  return e.group_id === element;
                                })
                                .map((v, i) => {
                                  if (
                                    v.title ===
                                    this.getTitleQuestion(
                                      !this.state[`question-number-${element}`]
                                        ? this.state.title.filter(e => {
                                            return e.group_id === element;
                                          })[0].question_id
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
                                {(this.checkYourQuestion(
                                  !this.state[`question-number-${element}`]
                                    ? this.state.title.filter(e => {
                                        return e.group_id === element;
                                      })[0].question_id
                                    : this.state[`question-number-${element}`]
                                ) ||
                                  !this.checkQuestionAnswered(
                                    !this.state[`question-number-${element}`]
                                      ? this.state.title.filter(e => {
                                          return e.group_id === element;
                                        })[0].question_id
                                      : this.state[`question-number-${element}`]
                                  )) && <span> Trả lời: </span>}
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
                                      ? this.state.title.filter(e => {
                                          return e.group_id === element;
                                        })[0].question_id
                                      : this.state[`question-number-${element}`]
                                  ) ||
                                  !this.checkQuestionAnswered(
                                    !this.state[`question-number-${element}`]
                                      ? this.state.title.filter(e => {
                                          return e.group_id === element;
                                        })[0].question_id
                                      : this.state[`question-number-${element}`]
                                  ) ? (
                                    this.state.title.filter(e => {
                                      return e.group_id === element;
                                    }).length > 0 &&
                                    this.getAnswerQuestion(
                                      !this.state[`question-number-${element}`]
                                        ? this.state.title.filter(e => {
                                            return e.group_id === element;
                                          })[0].question_id
                                        : this.state[`question-number-${element}`]
                                    )
                                  ) : (
                                    <span>
                                      Bạn cần trả lời câu hỏi này để xem câu trả lời của đối phương
                                      <Tooltip
                                        placement="topLeft"
                                        title="Chỉnh sửa câu trả lời của bạn ngay"
                                      >
                                        <Icon
                                          onClick={() =>
                                            this.handleClickEdit(
                                              element,
                                              !this.state[`question-number-${element}`]
                                                ? this.state.title.filter(e => {
                                                    return e.group_id === element;
                                                  })[0].question_id
                                                : this.state[`question-number-${element}`]
                                            )
                                          }
                                          style={{
                                            color: '#104da1',
                                            marginLeft: '10px',
                                            cursor: 'pointer',
                                          }}
                                          type="edit"
                                        />
                                      </Tooltip>
                                    </span>
                                  )}
                                </i>
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <div>
                  <div className={styles['form-edit-item']}>
                    <Skeleton rows={3} />
                  </div>
                  <div className={styles['form-edit-item']}>
                    <Skeleton rows={3} />
                  </div>
                  <div className={styles['form-edit-item']}>
                    <Skeleton rows={3} />
                  </div>
                  <div className={styles['form-edit-item']}>
                    <Skeleton rows={3} />
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
                <div>
                  <Skeleton rows={3} />
                </div>
                <div>
                  <Skeleton rows={3} />
                </div>
                <div>
                  <Skeleton rows={3} />
                </div>
                <div>
                  <Skeleton rows={3} />
                </div>
              </div>
            )}
          </div>
          {dataUser ? (
            <div>
              {this.state.question.length === 0 ? (
                ''
              ) : (
                <Table
                  style={{ marginTop: '30px' }}
                  columns={this.columns}
                  dataSource={dataTable}
                  bordered
                />
              )}
            </div>
          ) : (
            <div style={{ background: '#fff', borderRadius: '5px', marginTop: '20px' }}>
              <Skeleton rows={6} />
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default AdvancedProfile;
