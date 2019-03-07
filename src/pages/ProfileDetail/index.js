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
import { Table, Icon, Input, Button, Skeleton } from 'antd';
import styles from './index.less';

const { TextArea } = Input;
@connect(({ profile, loading, authentication }) => ({
  profile,
  loading: loading.effects['profile/fetchAdvanced'],
  authentication,
}))
class AdvancedProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      operationkey: 'tab1',
      editing: false,
      list: [],
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

  componentWillUnmount() {}

  onOperationTabChange = key => {
    this.setState({ operationkey: key });
  };

  componentWillReceiveProps(nextProps) {
    if (this.props.authentication.getuser !== nextProps.authentication.getuser) {
      if (nextProps.authentication.getuser.status === 'ok') {
        this.setState(
          {
            dataUser: nextProps.authentication.getuser.data,
            question: nextProps.authentication.getuser.question,
            title: nextProps.authentication.getuser.title,
          },
          () => {
            const { title, question } = this.state;
            const arrGroup = [];
            question.forEach(element => {
              arrGroup.push(element.groupid);
            });
            this.setState({
              groupQuestion: Array.from(new Set(arrGroup)).sort(),
            });
            const arr = [];
            for (let i = 0; i < title.length; i++) {
              for (let j = 0; j < question.length; j++) {
                if (question[j].question_id === title[i].question_id) {
                  const obj = {};
                  obj.question_id = question[j].question_id;
                  obj.title = title[i].title;
                  obj.answer = question[j].answer;
                  obj.groupid = question[j].groupid;
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
  }

  handleClickEdit(v) {
    this.setState({
      editing: true,
      'item-editing': v,
    });
  }

  handleTestButton() {
    this.setState({
      'item-editing': undefined,
      editing: false,
    });
  }

  handleClickListQuestion(v) {
    if (this.state.listQuestion === v) {
      this.setState({
        listQuestion: undefined,
      });
    } else {
      this.setState({
        listQuestion: v,
      });
    }
  }

  handleClickQuestionItem(element, value) {
    console.log(element, value);
    this.setState({
      [`question-number-${element}`]: value,
      listQuestion: undefined,
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
                      {this.state['item-editing'] && this.state['item-editing'] === element + 1 ? (
                        <div>
                          <div className={`${styles['form-edit-item']} ${styles['essay-editing']}`}>
                            <div className={styles['question-item']}>
                              <div className={styles['theme-question']}>
                                <span>Nhóm câu hỏi số {element}</span>
                              </div>
                              <span className={styles['question-title']}>
                                {list.filter(e => {
                                  return e.groupid === element;
                                }).length > 0 &&
                                  list.filter(e => {
                                    return e.groupid === element;
                                  })[
                                    this.state[`question-number-${element}`] !== undefined
                                      ? this.state[`question-number-${element}`]
                                      : 0
                                  ].title}
                              </span>
                            </div>
                            <div
                              className={`${styles['answer-item']} answer-item ${
                                styles['active-editing']
                              }`}
                            >
                              <TextArea
                                style={{ fontSize: '18px', color: 'black', fontWeight: 600 }}
                                rows={8}
                                defaultValue={
                                  list.filter(e => {
                                    return e.groupid === element;
                                  }).length > 0 &&
                                  list
                                    .filter(e => {
                                      return e.groupid === element;
                                    })
                                    [
                                      this.state[`question-number-${element}`] !== undefined
                                        ? this.state[`question-number-${element}`]
                                        : 0
                                    ].answer.toString()
                                }
                              />
                            </div>
                          </div>
                          <div className={styles['button-editing']}>
                            <Button
                              onClick={() => this.handleTestButton()}
                              style={{ marginRight: '5px' }}
                              shape="round"
                              size="large"
                            >
                              CANCER
                            </Button>
                            <Button
                              onClick={() => this.handleTestButton()}
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
                        <div className={styles['form-edit-item']}>
                          <div
                            onClick={() => this.handleClickListQuestion(element + 1)}
                            className={styles['question-item']}
                          >
                            <div className={styles['theme-question']}>
                              <span>Nhóm câu hỏi số {element}</span>
                              {listQuestion && listQuestion === element + 1 ? (
                                <Icon type="caret-up" />
                              ) : (
                                <Icon type="caret-down" />
                              )}
                            </div>
                            <span className={styles['question-title']}>
                              {list.filter(e => {
                                return e.groupid === element;
                              }).length > 0 &&
                                list.filter(e => {
                                  return e.groupid === element;
                                })[
                                  this.state[`question-number-${element}`] !== undefined
                                    ? this.state[`question-number-${element}`]
                                    : 0
                                ].title}
                            </span>
                          </div>
                          {listQuestion && listQuestion === element + 1 && (
                            <div className={styles['list-question-hidden']}>
                              {list
                                .filter(e => {
                                  return e.groupid === element;
                                })
                                .map((v, i) => {
                                  return (
                                    <div
                                      onClick={() => this.handleClickQuestionItem(element, i)}
                                      key={i}
                                      className={styles['item-question']}
                                    >
                                      {v.title}
                                    </div>
                                  );
                                })}
                            </div>
                          )}
                          <div className={`${styles['answer-item']} answer-item`}>
                            <span className={styles['answer-title']}>
                              {list.filter(e => {
                                return e.groupid === element;
                              }).length > 0 &&
                                list
                                  .filter(e => {
                                    return e.groupid === element;
                                  })
                                  [
                                    this.state[`question-number-${element}`] !== undefined
                                      ? this.state[`question-number-${element}`]
                                      : 0
                                  ].answer.toString()}
                            </span>
                            <Icon style={{ fontSize: '20px', color: '#0500BE' }} type="edit" />
                            <span
                              onClick={() => this.handleClickEdit(element + 1)}
                              className={styles['edit-button']}
                            >
                              Edit
                            </span>
                          </div>
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
          <Table
            style={{ marginTop: '30px' }}
            columns={this.columns}
            dataSource={dataTable}
            bordered
          />
        </div>
      </div>
    );
  }
}

export default AdvancedProfile;
