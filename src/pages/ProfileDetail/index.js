/* eslint-disable dot-notation */
/* eslint-disable no-undef */
/* eslint-disable no-plusplus */
/* eslint-disable react/no-unused-state */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/sort-comp */
import React, { Component } from 'react';
import Debounce from 'lodash-decorators/debounce';
import Bind from 'lodash-decorators/bind';
import moment from 'moment';
import { connect } from 'dva';
import { Table, Icon, Input, Button } from 'antd';
import styles from './index.less';

const { TextArea } = Input;
const getWindowWidth = () => window.innerWidth || document.documentElement.clientWidth;
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
      stepDirection: 'horizontal',
      dataUser: {},
      editing: false,
      list: [],
      'item-editing': 0,
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
    this.setStepDirection();
    window.addEventListener('resize', this.setStepDirection, { passive: true });
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.setStepDirection);
    this.setStepDirection.cancel();
  }

  onOperationTabChange = key => {
    this.setState({ operationkey: key });
  };

  @Bind()
  @Debounce(200)
  setStepDirection() {
    const { stepDirection } = this.state;
    const w = getWindowWidth();
    if (stepDirection !== 'vertical' && w <= 576) {
      this.setState({
        stepDirection: 'vertical',
      });
    } else if (stepDirection !== 'horizontal' && w > 576) {
      this.setState({
        stepDirection: 'horizontal',
      });
    }
  }

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
            const arr = [];
            for (let i = 0; i < title.length; i++) {
              for (let j = 0; j < question.length; j++) {
                if (question[j].question_id === title[i].question_id) {
                  const obj = {};
                  obj.question_id = question[j].question_id;
                  obj.title = title[i].title;
                  obj.answer = question[j].answer;

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
      'item-editing': 0,
      editing: false,
    });
  }

  render() {
    const { dataUser, list } = this.state;
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
          <div className={styles['edit-form']}>
            <div className={`${styles['edit-form-left']} text-form`}>
              {this.state['item-editing'] === 1 ? (
                <div>
                  <div className={`${styles['form-edit-item']} ${styles['essay-editing']}`}>
                    <div className={styles['question-item']}>
                      <div className={styles['theme-question']}>About me</div>
                      <span className={styles['question-title']}>
                        Favorite thing about the place I live
                      </span>
                    </div>
                    <div
                      className={`${styles['answer-item']} answer-item ${styles['active-editing']}`}
                    >
                      <TextArea
                        style={{ fontSize: '18px', color: 'black', fontWeight: 600 }}
                        rows={8}
                        value="Beautiful"
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
                  <div className={styles['question-item']}>
                    <div className={styles['theme-question']}>About me</div>
                    <span className={styles['question-title']}>
                      Favorite thing about the place I live
                    </span>
                  </div>
                  <div className={`${styles['answer-item']} answer-item`}>
                    <span className={styles['answer-title']}>Beautiful</span>
                    <Icon style={{ fontSize: '20px', color: '#0500BE' }} type="edit" />
                    <span onClick={() => this.handleClickEdit(1)} className={styles['edit-button']}>
                      Edit
                    </span>
                  </div>
                </div>
              )}
              {this.state['item-editing'] === 2 ? (
                <div>
                  <div className={`${styles['form-edit-item']} ${styles['essay-editing']}`}>
                    <div className={styles['question-item']}>
                      <div className={styles['theme-question']}>About me</div>
                      <span className={styles['question-title']}>
                        Favorite thing about the place I live
                      </span>
                    </div>
                    <div
                      className={`${styles['answer-item']} answer-item ${styles['active-editing']}`}
                    >
                      <TextArea
                        style={{ fontSize: '18px', color: 'black', fontWeight: 600 }}
                        rows={8}
                        value="Beautiful"
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
                  <div className={styles['question-item']}>
                    <div className={styles['theme-question']}>About me</div>
                    <span className={styles['question-title']}>
                      Favorite thing about the place I live
                    </span>
                  </div>
                  <div className={`${styles['answer-item']} answer-item`}>
                    <span className={styles['answer-title']}>Beautiful</span>
                    <Icon style={{ fontSize: '20px', color: '#0500BE' }} type="edit" />
                    <span onClick={() => this.handleClickEdit(2)} className={styles['edit-button']}>
                      Edit
                    </span>
                  </div>
                </div>
              )}
              {this.state['item-editing'] === 3 ? (
                <div>
                  <div className={`${styles['form-edit-item']} ${styles['essay-editing']}`}>
                    <div className={styles['question-item']}>
                      <div className={styles['theme-question']}>About me</div>
                      <span className={styles['question-title']}>
                        Favorite thing about the place I live
                      </span>
                    </div>
                    <div
                      className={`${styles['answer-item']} answer-item ${styles['active-editing']}`}
                    >
                      <TextArea
                        style={{ fontSize: '18px', color: 'black', fontWeight: 600 }}
                        rows={8}
                        value="Beautiful"
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
                  <div className={styles['question-item']}>
                    <div className={styles['theme-question']}>About me</div>
                    <span className={styles['question-title']}>
                      Favorite thing about the place I live
                    </span>
                  </div>
                  <div className={`${styles['answer-item']} answer-item`}>
                    <span className={styles['answer-title']}>Beautiful</span>
                    <Icon style={{ fontSize: '20px', color: '#0500BE' }} type="edit" />
                    <span onClick={() => this.handleClickEdit(3)} className={styles['edit-button']}>
                      Edit
                    </span>
                  </div>
                </div>
              )}
              {this.state['item-editing'] === 4 ? (
                <div>
                  <div className={`${styles['form-edit-item']} ${styles['essay-editing']}`}>
                    <div className={styles['question-item']}>
                      <div className={styles['theme-question']}>About me</div>
                      <span className={styles['question-title']}>
                        Favorite thing about the place I live
                      </span>
                    </div>
                    <div
                      className={`${styles['answer-item']} answer-item ${styles['active-editing']}`}
                    >
                      <TextArea
                        style={{ fontSize: '18px', color: 'black', fontWeight: 600 }}
                        rows={8}
                        value="Beautiful"
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
                  <div className={styles['question-item']}>
                    <div className={styles['theme-question']}>About me</div>
                    <span className={styles['question-title']}>
                      Favorite thing about the place I live
                    </span>
                  </div>
                  <div className={`${styles['answer-item']} answer-item`}>
                    <span className={styles['answer-title']}>Beautiful</span>
                    <Icon style={{ fontSize: '20px', color: '#0500BE' }} type="edit" />
                    <span onClick={() => this.handleClickEdit(4)} className={styles['edit-button']}>
                      Edit
                    </span>
                  </div>
                </div>
              )}
              {this.state['item-editing'] === 5 ? (
                <div>
                  <div className={`${styles['form-edit-item']} ${styles['essay-editing']}`}>
                    <div className={styles['question-item']}>
                      <div className={styles['theme-question']}>About me</div>
                      <span className={styles['question-title']}>
                        Favorite thing about the place I live
                      </span>
                    </div>
                    <div
                      className={`${styles['answer-item']} answer-item ${styles['active-editing']}`}
                    >
                      <TextArea
                        style={{ fontSize: '18px', color: 'black', fontWeight: 600 }}
                        rows={8}
                        value="Beautiful"
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
                  <div className={styles['question-item']}>
                    <div className={styles['theme-question']}>About me</div>
                    <span className={styles['question-title']}>
                      Favorite thing about the place I live
                    </span>
                  </div>
                  <div className={`${styles['answer-item']} answer-item`}>
                    <span className={styles['answer-title']}>Beautiful</span>
                    <Icon style={{ fontSize: '20px', color: '#0500BE' }} type="edit" />
                    <span onClick={() => this.handleClickEdit(5)} className={styles['edit-button']}>
                      Edit
                    </span>
                  </div>
                </div>
              )}
            </div>
            <div style={{ flexBasis: '5%' }} />
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
                      Body type <Icon style={{ color: '#0500BE', marginLeft: '5px' }} type="edit" />
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
                      Body type <Icon style={{ color: '#0500BE', marginLeft: '5px' }} type="edit" />
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
                      Body type <Icon style={{ color: '#0500BE', marginLeft: '5px' }} type="edit" />
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
                      Body type <Icon style={{ color: '#0500BE', marginLeft: '5px' }} type="edit" />
                    </span>
                  </div>
                </div>
              </div>
            </div>
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
