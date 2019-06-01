/* eslint-disable react/button-has-type */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/no-array-index-key */
/* eslint-disable react/no-unused-state */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/sort-comp */
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable camelcase */
/* eslint-disable react/button-has-type */
/* eslint-disable no-unused-vars */
/* eslint-disable react/sort-comp */
/* eslint-disable class-methods-use-this */
/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable prefer-destructuring */
/* eslint-disable react/no-unused-state */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/jsx-indent */
/* eslint-disable react/no-array-index-key */
/* eslint-disable no-plusplus */

import { PureComponent } from 'react';
import { connect } from 'dva';
import { Link, Redirect } from 'react-router-dom';
import { Drawer, Button, Radio, Icon, Pagination } from 'antd';
import moment from 'moment';
import styles from './index.less';

const RadioGroup = Radio.Group;
@connect(({ authentication }) => ({
  getuserwhocare: authentication.getuserwhocare,
  getusercare: authentication.getusercare,
}))
class WhoCare extends PureComponent {
  state = {
    dataUserWhoCare: [],
    dataUserCare: [],
    activeSort: false,
    visible: false,
  };

  componentWillReceiveProps(nextProps) {
    if (this.props.getuserwhocare !== nextProps.getuserwhocare) {
      this.setState({
        dataUserWhoCare: nextProps.getuserwhocare,
      });
    }
    if (this.props.getusercare !== nextProps.getusercare) {
      this.setState({
        dataUserCare: nextProps.getusercare,
      });
    }
  }

  componentDidMount() {
    // eslint-disable-next-line react/destructuring-assignment
    this.props.dispatch({
      type: 'authentication/getuserwhocare',
    });
    this.props.dispatch({
      type: 'authentication/getusercare',
    });
  }

  checkCare(value) {
    const check = this.state.dataUserCare.find(v => v.user_id === value);
    if (check) return true;
    return false;
  }

  handleClickChangeCare(value, click, careItem) {
    this.props.dispatch({
      type: 'authentication/changecare',
      payload: {
        userid: value.user_id.replace(/-/g, ''),
        care: !careItem,
        type: 'user',
        address: value.address,
        age: value.age,
        created: value.created,
        name: value.name,
        gender: value.gender,
        user_id: value.user_id,
      },
    });
    this.setState({
      [click]: true,
    });
  }

  background(avatar, gender) {
    if (avatar) {
      return {
        backgroundImage: `url(http://cdn.henhoradio.net/images/ft/${avatar})`,
      };
    }
    if (gender === 'male')
      return {
        backgroundImage:
          'url(http://cdn.henhoradio.net/images/ft/0bfed19c-071d-4a16-90d5-037fd22ed912)',
      };
    return {
      backgroundImage:
        'url(http://cdn.henhoradio.net/images/ft/73cb3725-aa00-4f91-b6eb-8bff157fd714)',
    };
  }

  showDrawer = () => {
    this.setState({
      visible: true,
    });
  };

  onClose = () => {
    this.setState({
      visible: false,
    });
  };

  handleFinishButton() {
    this.setState({
      visible: false,
    });
  }

  callback(key) {
    console.log(key);
  }

  handleChangePagination(v1) {
    const age = this.props.location.query.age;
    const sort = this.props.location.query.sortby;
    this.props.history.push({
      pathname: `/home/whocare`,
      search: `?page=${v1}&age=${age}&sortby=${sort}`,
    });
  }

  onChangeRadioAge(e) {
    const sort = this.props.location.query.sortby;
    this.props.history.push({
      pathname: '/home/whocare',
      search: `?page=1&age=${e.target.value}&sortby=${sort}`,
    });
  }

  onChangeSort(e) {
    const age = this.props.location.query.age;
    this.props.history.push({
      pathname: '/home/whocare',
      search: `?page=1&age=${age}&sortby=${e.target.value}`,
    });
  }

  render() {
    const { page } = this.props.location.query;
    if (
      !this.props.location.query.page ||
      !this.props.location.query.age ||
      !this.props.location.query.sortby
    ) {
      return <Redirect to="/home/whocare?page=1&age=all&sortby=newest_care" />;
    }
    return (
      <div className={styles['who-care-page']}>
        <div className={styles.container}>
          <div className={styles['user-care-item']}>
            <div className={styles['title-care']}>
              <div className={styles.title}>
                <div className={styles['button-filter']}>
                  <Button
                    id={styles['button-filter']}
                    type="primary"
                    icon="control"
                    onClick={this.showDrawer}
                  >
                    Lọc dữ liệu
                  </Button>
                  <Drawer
                    title="Lựa chọn"
                    placement="right"
                    onClose={this.onClose}
                    visible={this.state.visible}
                  >
                    <div style={{ padding: '20px' }}>
                      <div>
                        <h3 style={{ color: 'gray' }}>Sắp xếp</h3>
                        <hr style={{ marginBottom: '15px' }} />
                        <RadioGroup
                          onChange={e => this.onChangeSort(e)}
                          value={this.props.location.query.sortby}
                        >
                          <Radio
                            style={{ display: 'block', marginBottom: '10px', marginLeft: '15px' }}
                            value="descage"
                          >
                            Tuổi giảm dần
                          </Radio>
                          <Radio
                            style={{ display: 'block', marginBottom: '10px', marginLeft: '15px' }}
                            value="ascage"
                          >
                            Tuổi tăng dần
                          </Radio>
                          <Radio
                            style={{ display: 'block', marginBottom: '10px', marginLeft: '15px' }}
                            value="oldest_care"
                          >
                            Ngày quan tâm bạn cũ nhất
                          </Radio>
                          <Radio
                            style={{ display: 'block', marginBottom: '10px', marginLeft: '15px' }}
                            value="newest_care"
                          >
                            Ngày quan tâm bạn mới nhất
                          </Radio>
                        </RadioGroup>
                      </div>
                      <div style={{ marginTop: '20px' }}>
                        <h3 style={{ color: 'gray' }}>Độ tuổi</h3>
                        <hr style={{ marginBottom: '15px' }} />
                        <RadioGroup
                          onChange={e => this.onChangeRadioAge(e)}
                          value={this.props.location.query.age}
                        >
                          <Radio
                            style={{ display: 'block', marginBottom: '10px', marginLeft: '15px' }}
                            value="18_24"
                          >
                            Từ 18 - 24 tuổi
                          </Radio>
                          <Radio
                            style={{ display: 'block', marginBottom: '10px', marginLeft: '15px' }}
                            value="25_35"
                          >
                            Từ 25 - 35 tuổi
                          </Radio>
                          <Radio
                            style={{ display: 'block', marginBottom: '10px', marginLeft: '15px' }}
                            value="36"
                          >
                            Ngoài 35 tuổi
                          </Radio>
                          <Radio
                            style={{ display: 'block', marginBottom: '10px', marginLeft: '15px' }}
                            value="all"
                          >
                            Tất cả
                          </Radio>
                        </RadioGroup>
                      </div>
                    </div>
                  </Drawer>
                </div>
              </div>
              <div className={styles.title}>Tên người dùng</div>
              <div className={styles.title}>Thời gian quan tâm</div>
              <div className={styles.title}>Trang cá nhân</div>
              <div className={styles.title}>Chỉnh sửa</div>
            </div>
            {this.state.dataUserWhoCare
              .filter((v, i, self) => {
                if (this.props.location.query.age === '18_24') return v.age >= 18 && v.age <= 24;
                if (this.props.location.query.age === '25_35') return v.age >= 25 && v.age <= 35;
                if (this.props.location.query.age === 'all') return self;
                return v.age > 35;
              })
              .sort((a, b) => {
                if (this.props.location.query.sortby === 'descage') return b.age - a.age;
                if (this.props.location.query.sortby === 'ascage') return a.age - b.age;
                if (this.props.location.query.sortby === 'oldest_care')
                  return new Date(a.created) - new Date(b.created);
                return new Date(b.created) - new Date(a.created);
              })
              .filter((value, index) => index >= page * 5 - 5 && index < page * 5)
              .map((v, i) => (
                <div key={i} className={styles['content-info-item']}>
                  <div className={styles.avatar}>
                    <div
                      className={styles['avatar-user']}
                      style={this.background(v.avatar, v.gender)}
                    />
                  </div>
                  <div className={styles['info-user']}>
                    <div className={styles['more-info']}>{v.name}</div>
                    <div className={styles['more-info']}>
                      <span className={styles['name-of-user']}>{v.address}</span>
                      <span className={styles['age-of-user']}>{v.age} tuổi</span>
                    </div>
                  </div>
                  <div className={styles['info-user']}>
                    <div className={styles['more-info']}>
                      {moment(v.created).format('HH:mm MM/DD/YYYY')}
                    </div>
                  </div>
                  <div className={styles['info-user']}>
                    <div className={styles['more-info']}>
                      <Link to={`/home/other-profile?id=${v.user_id.replace(/-/g, '')}`}>
                        {v.name}
                      </Link>
                    </div>
                  </div>
                  <div className={styles['info-user']}>
                    <div className={styles['more-info']}>
                      <span
                        className={this.checkCare(v.user_id) ? styles.cared : styles['not-care']}
                        onClick={() =>
                          this.handleClickChangeCare(v, `click-${i}`, this.checkCare(v.user_id))
                        }
                      >
                        <Icon
                          style={!this.state[`click-${i}`] ? { animation: 'none' } : {}}
                          type="star"
                          theme="filled"
                        />
                        {this.checkCare(v.user_id) ? (
                          <span>Đã quan tâm</span>
                        ) : (
                          <span>Quan tâm lại</span>
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
        <Pagination
          hideOnSinglePage
          style={{
            padding: '5px',
            display: 'table',
            margin: '0 auto',
            marginTop: '30px',
            marginBottom: '20px',
          }}
          onChange={(v1, v2) => this.handleChangePagination(v1, v2)}
          current={Number(page)}
          pageSize={5}
          total={this.state.dataUserWhoCare.length}
        />
      </div>
    );
  }
}

export default WhoCare;
