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
import { Table, Icon, Input, Button, Skeleton, Radio, Checkbox, message } from 'antd';
import styles from './index.less';

const { TextArea } = Input;
const RadioGroup = Radio.Group;
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
      submitEnable: true,
      'item-editing': undefined,
      groupQuestion: [],
      listQuestion: undefined,
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
            question: nextProps.authentication.getuser.question,
            title: nextProps.authentication.getuser.title,
            group: nextProps.authentication.getuser.group,
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
        message.success('Thay đổi dữ liệu thành công');
        this.props.dispatch({
          type: 'authentication/getuser',
        });
      }
    }
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

  handleCancer() {
    this.setState({
      'item-editing': undefined,
      editing: false,
      questionEditing: undefined,
      submitEnable: true,
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
        <div className={styles.container}>
          {this.state.editing && <div className={styles['editing']} />}
          {dataUser ? (
            <div className={styles['profile-user']}>
              <div className={styles['detail-profile']}>
                <div className={styles['profile-user-left']}>
                  <div className={styles['profile-item']}>Tên tài khoản:{dataUser.phone}</div>
                  <div className={styles['profile-item']}>Tên đầy đủ: {dataUser.fullname}</div>
                  <div className={styles['profile-item']}>
                    Giới tính :{dataUser.gender === 'male' ? 'Nam' : 'Nữ'}
                  </div>
                </div>
                <div className={styles['profile-user-right']}>
                  <div className={styles['profile-item']}>
                    Ngày sinh: {`${dataUser.dob_day}/${dataUser.dob_month}/${dataUser.dob_year}`}
                  </div>
                  <div className={styles['profile-item']}>
                    Ngày tham gia: {moment(dataUser.createat).format('DD/MM/YYYY')}
                  </div>
                  <div className={styles['profile-item']}>Địa chỉ: {dataUser.address}</div>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ paddingTop: '40px' }}>
              <div style={{ background: '#fff', padding: '15px', borderRadius: '5px' }}>
                <Skeleton rows={3} />
              </div>
            </div>
          )}
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
                                <TextArea
                                  onChange={e => this.handleChangeTexeAria(e)}
                                  style={{ fontSize: '18px', color: 'black', fontWeight: 600 }}
                                  rows={8}
                                  defaultValue={
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
                                  }
                                />
                              )}
                              {this.state.type === '2' && (
                                <div className={`${styles['radio-group']} radio-form`}>
                                  <RadioGroup
                                    onChange={e => this.handleChangeRadioEditing(e)}
                                    defaultValue={this.getAnswerQuestion(
                                      !this.state[`question-number-${element}`]
                                        ? this.state.title.filter(e => {
                                            return e.group_id === element;
                                          })[0].question_id
                                        : this.state[`question-number-${element}`]
                                    )}
                                  >
                                    {this.state.questionEditing.answer.map((v, i) => {
                                      return (
                                        <div key={i} className={styles['radio-question']}>
                                          <Radio
                                            style={{
                                              color: '#fff',
                                              fontSize: '18px',
                                              display: 'flex',
                                              alignItems: 'center',
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
                                  <Checkbox.Group
                                    onChange={e => this.handleChangeCheckEditing(e)}
                                    defaultValue={this.getAnswerQuestion(
                                      !this.state[`question-number-${element}`]
                                        ? this.state.title.filter(e => {
                                            return e.group_id === element;
                                          })[0].question_id
                                        : this.state[`question-number-${element}`]
                                    ).split(',')}
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
                                            }}
                                            value={v}
                                          >
                                            {v}
                                          </Checkbox>
                                        </div>
                                      );
                                    })}
                                  </Checkbox.Group>
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
                                {this.state.title.filter(e => {
                                  return e.group_id === element;
                                }).length > 0 &&
                                  this.getAnswerQuestion(
                                    !this.state[`question-number-${element}`]
                                      ? this.state.title.filter(e => {
                                          return e.group_id === element;
                                        })[0].question_id
                                      : this.state[`question-number-${element}`]
                                  )}
                              </span>
                              <Icon style={{ fontSize: '20px', color: '#0500BE' }} type="edit" />
                              <span
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
                                className={styles['edit-button']}
                              >
                                Edit
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
                    <div className={styles['right-title']}>Straight, Man,Single</div>
                    <div className={styles['right-content']}>
                      <span className={styles['item-span']}>Add</span>
                      <span className={styles['item-span']}>,</span>
                      <span className={styles['item-span']}>Relation type</span>
                      <span className={styles['item-span']}>,</span>
                      <span className={styles['item-span']}>Height</span>
                      <span className={styles['item-span']}>,</span>
                      <span className={styles['item-span']}>
                        Body type{' '}
                        <Icon style={{ color: '#0500BE', marginLeft: '5px' }} type="edit" />
                      </span>
                    </div>
                  </div>
                </div>
                <div className={styles['right-item']}>
                  <div className={styles['left-icon']}>
                    <Icon style={{ fontSize: '25px', cursor: 'pointer' }} type="profile" />
                  </div>
                  <div className={styles['right-body']}>
                    <div className={styles['right-title']}>Straight, Man,Single</div>
                    <div className={styles['right-content']}>
                      <span className={styles['item-span']}>Add</span>
                      <span className={styles['item-span']}>,</span>
                      <span className={styles['item-span']}>Relation type</span>
                      <span className={styles['item-span']}>,</span>
                      <span className={styles['item-span']}>Height</span>
                      <span className={styles['item-span']}>,</span>
                      <span className={styles['item-span']}>
                        Body type{' '}
                        <Icon style={{ color: '#0500BE', marginLeft: '5px' }} type="edit" />
                      </span>
                    </div>
                  </div>
                </div>
                <div className={styles['right-item']}>
                  <div className={styles['left-icon']}>
                    <Icon style={{ fontSize: '25px', cursor: 'pointer' }} type="profile" />
                  </div>
                  <div className={styles['right-body']}>
                    <div className={styles['right-title']}>Straight, Man,Single</div>
                    <div className={styles['right-content']}>
                      <span className={styles['item-span']}>Add</span>
                      <span className={styles['item-span']}>,</span>
                      <span className={styles['item-span']}>Relation type</span>
                      <span className={styles['item-span']}>,</span>
                      <span className={styles['item-span']}>Height</span>
                      <span className={styles['item-span']}>,</span>
                      <span className={styles['item-span']}>
                        Body type{' '}
                        <Icon style={{ color: '#0500BE', marginLeft: '5px' }} type="edit" />
                      </span>
                    </div>
                  </div>
                </div>
                <div className={styles['right-item']}>
                  <div className={styles['left-icon']}>
                    <Icon style={{ fontSize: '25px', cursor: 'pointer' }} type="profile" />
                  </div>
                  <div className={styles['right-body']}>
                    <div className={styles['right-title']}>Straight, Man,Single</div>
                    <div className={styles['right-content']}>
                      <span className={styles['item-span']}>Add</span>
                      <span className={styles['item-span']}>,</span>
                      <span className={styles['item-span']}>Relation type</span>
                      <span className={styles['item-span']}>,</span>
                      <span className={styles['item-span']}>Height</span>
                      <span className={styles['item-span']}>,</span>
                      <span className={styles['item-span']}>
                        Body type{' '}
                        <Icon style={{ color: '#0500BE', marginLeft: '5px' }} type="edit" />
                      </span>
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
