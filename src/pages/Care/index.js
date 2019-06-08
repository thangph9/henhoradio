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
import { Drawer, Button, Radio, Icon, Pagination, Popconfirm } from 'antd';
import PageLoading from '@/components/PageLoading';
import Footer from '@/layouts/Footer';
import moment from 'moment';
import styles from './index.less';

const RadioGroup = Radio.Group;
@connect(({ authentication }) => ({
  getusercare: authentication.getusercare,
}))
class Care extends PureComponent {
  state = {
    dataUserCare: [],
    activeSort: false,
    visible: false,
    loadingPage: true,
  };

  componentWillReceiveProps(nextProps) {
    if (this.props.getusercare !== nextProps.getusercare) {
      this.setState({
        dataUserCare: nextProps.getusercare,
        loadingPage: false,
      });
    }
  }

  componentDidMount() {
    // eslint-disable-next-line react/destructuring-assignment
    this.props.dispatch({
      type: 'authentication/getusercare',
    });
  }

  handleClickChangeCare(value) {
    this.props.dispatch({
      type: 'authentication/changecare',
      payload: {
        userid: value.user_id.replace(/-/g, ''),
        care: false,
        type: value.type,
        user_id: value.user_id,
      },
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

  callback(key) {
    console.log(key);
  }

  onChangeRadioAge(e) {
    const sort = this.props.location.query.sortby;
    const type = this.props.location.query.type;
    this.props.history.push({
      pathname: '/home/care',
      search: `?page=1&type=${type}&age=${e.target.value}&sortby=${sort}`,
    });
  }

  onChangeSort(e) {
    const age = this.props.location.query.age;
    const type = this.props.location.query.type;
    this.props.history.push({
      pathname: '/home/care',
      search: `?page=1&type=${type}&age=${age}&sortby=${e.target.value}`,
    });
  }

  onChangeType(e) {
    const age = this.props.location.query.age;
    const sort = this.props.location.query.sortby;
    this.props.history.push({
      pathname: '/home/care',
      search: `?page=1&type=${e.target.value}&age=${age}&sortby=${sort}`,
    });
  }

  handleChangePagination(v1) {
    window.scrollTo(0, 0);
    const age = this.props.location.query.age;
    const type = this.props.location.query.type;
    const sort = this.props.location.query.sortby;
    this.props.history.push({
      pathname: `/home/care`,
      search: `?page=${v1}&type=${type}&age=${age}&sortby=${sort}`,
    });
  }

  rediercPage(value) {
    if (value.type === 'user') {
      this.props.history.push({
        pathname: `/home/other-profile`,
        search: `?id=${value.user_id.replace(/-/g, '')}`,
      });
    } else {
      this.props.history.push({
        pathname: `/home/detail-list`,
        search: `?page=1&radio=${value.location}&gender=${value.gender}&date=${moment(
          value.timeup
        ).format('D_M_YYYY')}`,
      });
    }
  }

  render() {
    const { dataUserCare } = this.state;
    if (
      !this.props.location.query.page ||
      !this.props.location.query.type ||
      !this.props.location.query.age ||
      !this.props.location.query.sortby
    ) {
      return <Redirect to="/home/care?page=1&type=all&age=all&sortby=newest_care" />;
    }
    const { page } = this.props.location.query;
    return (
      <div className={styles['who-care-page']}>
        <div className={styles.container}>
          <div className={styles['user-care-item']}>
            <div className={styles['title-care']}>
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
                          Tuổi giảm dần (tài khoản)
                        </Radio>
                        <Radio
                          style={{ display: 'block', marginBottom: '10px', marginLeft: '15px' }}
                          value="ascage"
                        >
                          Tuổi tăng dần (tài khoản)
                        </Radio>
                        <Radio
                          style={{ display: 'block', marginBottom: '10px', marginLeft: '15px' }}
                          value="newest_up"
                        >
                          Lên sóng mới nhất (thính giả)
                        </Radio>
                        <Radio
                          style={{ display: 'block', marginBottom: '10px', marginLeft: '15px' }}
                          value="oldest_up"
                        >
                          Lên sóng cũ nhất (thính giả)
                        </Radio>
                        <Radio
                          style={{ display: 'block', marginBottom: '10px', marginLeft: '15px' }}
                          value="oldest_care"
                        >
                          Ngày quan tâm cũ nhất (tất cả)
                        </Radio>
                        <Radio
                          style={{ display: 'block', marginBottom: '10px', marginLeft: '15px' }}
                          value="newest_care"
                        >
                          Ngày quan tâm mới nhất (tất cả)
                        </Radio>
                      </RadioGroup>
                    </div>
                    <div style={{ marginTop: '20px' }}>
                      <h3 style={{ color: 'gray' }}>Nhóm</h3>
                      <hr style={{ marginBottom: '15px' }} />
                      <RadioGroup
                        onChange={e => this.onChangeType(e)}
                        value={this.props.location.query.type}
                      >
                        <Radio
                          style={{ display: 'block', marginBottom: '10px', marginLeft: '15px' }}
                          value="user"
                        >
                          Tài khoản
                        </Radio>
                        <Radio
                          style={{ display: 'block', marginBottom: '10px', marginLeft: '15px' }}
                          value="member"
                        >
                          Thính giả
                        </Radio>
                        <Radio
                          style={{ display: 'block', marginBottom: '10px', marginLeft: '15px' }}
                          value="all"
                        >
                          Tất cả
                        </Radio>
                      </RadioGroup>
                    </div>
                    <div style={{ marginTop: '20px' }}>
                      <h3 style={{ color: 'gray' }}>Độ tuổi (tài khoản)</h3>
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
            {dataUserCare
              .filter((v, i, self) => {
                if (this.props.location.query.type === 'user') return v.type === 'user';
                if (this.props.location.query.type === 'member') return v.type === 'member';
                return self;
              })
              .filter((v, i, self) => {
                if (this.props.location.query.age === '18_24') return v.age >= 18 && v.age <= 24;
                if (this.props.location.query.age === '25_35') return v.age >= 25 && v.age <= 35;
                if (this.props.location.query.age === 'all') return self;
                return v.age > 35;
              })
              .filter((v, i, self) => {
                if (this.props.location.query.sortby === 'descage') return v.age;
                if (this.props.location.query.sortby === 'ascage') return v.age;
                if (this.props.location.query.sortby === 'newest_up') return v.timeup;
                if (this.props.location.query.sortby === 'oldest_up') return v.timeup;
                return self;
              })
              .sort((a, b) => {
                if (this.props.location.query.sortby === 'descage') return b.age - a.age;
                if (this.props.location.query.sortby === 'ascage') return a.age - b.age;
                if (this.props.location.query.sortby === 'newest_up')
                  return new Date(b.timeup) - new Date(a.timeup);
                if (this.props.location.query.sortby === 'oldest_up')
                  return new Date(a.timeup) - new Date(b.timeup);
                if (this.props.location.query.sortby === 'oldest_care')
                  return new Date(a.created) - new Date(b.created);
                return new Date(b.created) - new Date(a.created);
              })
              .filter((value, index) => index >= page * 5 - 5 && index < page * 5)
              .map((v, i) => (
                <div key={i} className={`${styles['item-user']} ${styles['pr-rs']}`}>
                  <div>
                    <div className={styles['content-info']}>
                      <h3 onClick={() => this.rediercPage(v)}>{v.name}</h3>
                      <div onClick={() => this.rediercPage(v)} className={styles['avatar-user']}>
                        <div style={this.background(v.avatar, v.gender)} />
                      </div>
                      <div onClick={() => this.rediercPage(v)} className={styles['detail-info']}>
                        <p>Năm sinh: {v.age}</p>
                        <p>Địa chỉ: {v.address}</p>
                        <p>Giới tính: {v.gender === 'male' ? 'Nam' : 'Nữ'}</p>
                        {v.type === 'member' && <p>Mã số KB: {v.gcode}</p>}
                      </div>
                      <Popconfirm
                        placement="topLeft"
                        title="Bạn muốn bỏ quan tâm?"
                        onConfirm={() => this.handleClickChangeCare(v)}
                        okText="Có"
                        cancelText="Không"
                      >
                        <div className={styles['remover-care']}>
                          {' '}
                          <Icon type="close-circle" /> Bỏ quan tâm
                        </div>
                      </Popconfirm>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
        <Pagination
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
          total={this.state.dataUserCare.length}
        />
        <div>
          <div
            style={this.state.loadingPage ? { marginTop: '1000px' } : {}}
            className={styles.footer}
          >
            <Footer />
          </div>
        </div>
      </div>
    );
  }
}

export default Care;
