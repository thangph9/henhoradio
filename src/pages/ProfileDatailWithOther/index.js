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
        {dataUser ? (
          <div className={styles['avatar-user']}>
            <div className={styles['container-avatar']}>
              <img
                className={styles['img-avatar']}
                alt="img"
                src="https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png"
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
              <img
                className={styles['img-avatar']}
                alt="img"
                src="http://www.mmlonline.org/img/user.png"
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
                      {
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
                                Trả lời:{' '}
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
                            </div>
                          )}
                        </div>
                      }
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
                        <i className={styles['thong-tin-ngoai-hinh']}>177cm</i>
                      </div>
                      <div className={styles['box-ngoai-hinh']}>
                        <span className={styles['item-span']}>Cân nặng:</span>
                        <i className={styles['thong-tin-ngoai-hinh']}>70kg</i>
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
                        <span className={styles['item-span']}>Đang làm việc tại: </span>
                        <i className={styles['thong-tin-ngoai-hinh']}>Công ty THHH 1 thành viên</i>
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
                        <span className={styles['item-span']}>Từng học tại</span>
                        <i className={styles['thong-tin-ngoai-hinh']}>Đại học công nghiệp Hà Nội</i>
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
