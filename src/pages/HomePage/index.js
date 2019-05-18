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

import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Link, Redirect } from 'react-router-dom';
import { Skeleton, Pagination, Icon, Drawer, Button, Radio } from 'antd';
import LazyImage from './LazyImage';
import PageLoading from '@/components/PageLoading';
import styles from './index.less';

const RadioGroup = Radio.Group;
@connect(({ list, user, authentication, myprops }) => ({
  list,
  user,
  authentication,
  myprops,
}))
class NewFeed extends PureComponent {
  state = {
    allUser: [],
    loadingPage: true,
    preLoad: [1, 2, 3, 4, 5, 6, 7, 8],
    cdn: '',
    filterGender: false,
    filterAge: false,
    visible: false,
    leftTab: 0,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'authentication/getallusers',
    });
    if (
      !this.props.location.query.page ||
      !this.props.location.query.gender ||
      !this.props.location.query.age
    ) {
      this.setState({
        ageValue: '18_24',
        genderValue: 'all',
      });
      this.props.history.push({
        pathname: `/home/newfeed`,
        search: `?page=1&gender=all&age=18_24`,
      });
    } else {
      const gender = this.props.location.query.gender;
      const age = this.props.location.query.age;
      this.setState({
        ageValue: age,
        genderValue: gender,
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    const { authentication } = this.props;
    if (authentication.getallusers !== nextProps.authentication.getallusers) {
      this.setState({
        allUser: nextProps.authentication.getallusers,
        loadingPage: false,
      });
    }
  }

  handleChangePagination(v1) {
    const age = this.props.location.query.age;
    const gender = this.props.location.query.gender;
    this.props.history.push({
      pathname: `/home/newfeed`,
      search: `?page=${v1}&gender=${gender}&age=${age}`,
    });
  }

  handleChangeGender(e) {
    const age = this.props.location.query.age;
    this.props.history.push({
      pathname: '/home/newfeed',
      search: `?page=1&gender=${e}&age=${age}`,
    });
  }

  handleChangeAge(e) {
    const gender = this.props.location.query.gender;
    this.props.history.push({
      pathname: '/home/newfeed',
      search: `?page=1&gender=${gender}&age=${e}`,
    });
  }

  ToggleGender() {
    this.setState({
      filterAge: false,
      filterGender: !this.state.filterGender,
    });
  }

  ToggleAge() {
    this.setState({
      filterGender: false,
      filterAge: !this.state.filterAge,
    });
  }

  handeClickSubGender(e) {
    // const age = this.props.location.query.age;
    this.setState({
      genderValue: e,
    });
    /*
      this.props.history.push({
      pathname: '/home/newfeed',
      search: `?page=1&gender=${e}&age=${age}`,
    });
    */
  }

  getValueGender(value) {
    if (value === 'male') return 'Nam';
    if (value === 'female') return 'Nữ';
    return 'Nam và Nữ';
  }

  getValueAge(value) {
    if (value === '18_24') return 'Từ 18-24 tuổi';
    if (value === '25_35') return 'Từ 25-35 tuổi';
    return 'Ngoài 35 tuổi';
  }

  handeClickSubAge(e) {
    this.setState({
      ageValue: e,
    });
    /*
      const gender = this.props.location.query.gender;
      this.props.history.push({
        pathname: '/home/newfeed',
        search: `?page=1&gender=${gender}&age=${e}`,
      });
    */
  }

  handleClickSearch() {
    const gender = this.state.genderValue;
    const age = this.state.ageValue;
    this.props.history.push({
      pathname: '/home/newfeed',
      search: `?page=1&gender=${gender}&age=${age}`,
    });
    /*
    if (gender !== this.props.location.query.gender || age !== this.props.location.query.age) {
      this.setState(
        {
          loadingPage: !this.state.loadingPage,
        },
        () => {
          this.setState({
            loadingPage: !this.state.loadingPage,
          });
        }
      );
    }
    */
  }

  getDataFilter(data) {
    const arr = data.filter(value => {
      if (this.props.location.query.gender === 'all') {
        if (this.props.location.query.age === '18_24') return value.age >= 18 && value.age <= 24;
        if (this.props.location.query.age === '25_35') return value.age >= 25 && value.age <= 35;
        return value.age >= 36;
      }
      if (this.props.location.query.age === '18_24')
        return (
          value.age >= 18 && value.age <= 24 && value.gender === this.props.location.query.gender
        );
      if (this.props.location.query.age === '25_35')
        return (
          value.age >= 25 && value.age <= 35 && value.gender === this.props.location.query.gender
        );
      return value.age >= 36 && value.gender === this.props.location.query.gender;
    });
    return arr;
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

  handleClickTab(value) {
    this.setState({
      leftTab: value,
    });
  }

  onChangeRadioGender(e) {
    const age = this.props.location.query.age;
    this.setState(
      {
        loadingPage: !this.state.loadingPage,
      },
      () => {
        this.setState({
          loadingPage: !this.state.loadingPage,
        });
      }
    );
    this.props.history.push({
      pathname: '/home/newfeed',
      search: `?page=1&gender=${e.target.value}&age=${age}`,
    });
  }

  onChangeRadioAge(e) {
    const gender = this.props.location.query.gender;
    this.setState(
      {
        loadingPage: !this.state.loadingPage,
      },
      () => {
        this.setState({
          loadingPage: !this.state.loadingPage,
        });
      }
    );
    this.props.history.push({
      pathname: '/home/newfeed',
      search: `?page=1&gender=${gender}&age=${e.target.value}`,
    });
  }

  render() {
    const { allUser, loadingPage, preLoad, filterAge, filterGender } = this.state;
    const {
      location: {
        query: { page },
      },
    } = this.props;
    if (
      !this.props.location.query.page ||
      !this.props.location.query.gender ||
      !this.props.location.query.age
    ) {
      return <Redirect to="/home/newfeed?page=1&gender=all&age=18_24" />;
    }
    return (
      <div className={styles['home-newfeed']}>
        <div style={{ background: '#fff' }}>
          <div className={styles['list-menu']}>
            <div className={styles['tab-list']}>
              <ul className={styles['tab-ul']}>
                <li
                  onClick={() => this.handleClickTab(0)}
                  className={
                    this.state.leftTab === 0
                      ? `${styles['tab-li']} ${styles['active-tab']}`
                      : styles['tab-li']
                  }
                >
                  Menu tab 1
                  <span style={{ left: `${this.state.leftTab * 100}%` }} />
                </li>
                <li
                  onClick={() => this.handleClickTab(1)}
                  className={
                    this.state.leftTab === 1
                      ? `${styles['tab-li']} ${styles['active-tab']}`
                      : styles['tab-li']
                  }
                >
                  Menu tab 2
                </li>
                <li
                  onClick={() => this.handleClickTab(2)}
                  className={
                    this.state.leftTab === 2
                      ? `${styles['tab-li']} ${styles['active-tab']}`
                      : styles['tab-li']
                  }
                >
                  Menu tab 3
                </li>
              </ul>
            </div>
            <div className={styles['filter-button']}>
              <div className={styles['desktop-icon']}>
                <Button
                  style={{
                    position: 'absolute',
                    bottom: '15px',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                  type="primary"
                  icon="filter"
                  onClick={this.showDrawer}
                >
                  Lọc dữ liệu
                </Button>
              </div>
              <div className={styles['moblie-icon']}>
                <Icon
                  style={{
                    position: 'absolute',
                    bottom: '15px',
                    display: 'flex',
                    alignItems: 'center',
                    fontSize: '25px',
                  }}
                  type="filter"
                  onClick={this.showDrawer}
                />
              </div>
              <Drawer
                title="Lựa chọn"
                placement="right"
                closable={false}
                onClose={this.onClose}
                visible={this.state.visible}
              >
                <div style={{ padding: '20px' }}>
                  <div>
                    <h3 style={{ color: 'gray' }}>Giới tính</h3>
                    <hr />
                    <RadioGroup
                      onChange={e => this.onChangeRadioGender(e)}
                      value={this.props.location.query.gender}
                    >
                      <Radio
                        style={{ display: 'block', marginBottom: '10px', marginLeft: '15px' }}
                        value="male"
                      >
                        Nam
                      </Radio>
                      <Radio
                        style={{ display: 'block', marginBottom: '10px', marginLeft: '15px' }}
                        value="female"
                      >
                        Nữ
                      </Radio>
                      <Radio
                        style={{ display: 'block', marginBottom: '10px', marginLeft: '15px' }}
                        value="all"
                      >
                        Cả nam và nữ
                      </Radio>
                    </RadioGroup>
                  </div>
                  <div style={{ marginTop: '20px' }}>
                    <h3 style={{ color: 'gray' }}>Độ tuổi</h3>
                    <hr />
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
                    </RadioGroup>
                  </div>
                </div>
                <button
                  onClick={() => this.handleFinishButton()}
                  className={styles['button-finish']}
                >
                  Hoàn tất
                </button>
              </Drawer>
            </div>
          </div>
        </div>
        {this.state.leftTab === 0 && (
          <div className={styles.container}>
            {/*
           <div style={{ padding: '5px', marginBottom: '20px' }}>
            <div className={styles['filter-search']}>
            <div className={styles['search-box']}>
              <Icon type="search" />
              <input
                type="text"
                placeholder="Tìm kiếm (không bắt buộc)..."
                className={styles['input-search']}
              />
            </div>
            <div onClick={() => this.ToggleGender()} className={styles['filter-gender1']}>
              <div style={{ fontSize: '15px', color: '#2d3436', paddingRight: '5px' }}>
                &#9792;
              </div>
              <div style={{ color: '#34495e' }}>
                {this.getValueGender(this.state.genderValue)}
              </div>
              <div
                className={
                  filterGender
                    ? `${styles['sub-gender']} ${styles['active-filter']}`
                    : styles['sub-gender']
                }
              >
                <div
                  className={styles['li-gender']}
                  onClick={() => this.handeClickSubGender('male')}
                >
                  Nam
                </div>
                <div
                  className={styles['li-gender']}
                  onClick={() => this.handeClickSubGender('female')}
                >
                  Nữ
                </div>
                <div
                  className={styles['li-gender']}
                  onClick={() => this.handeClickSubGender('all')}
                >
                  Nam và Nữ
                </div>
              </div>
              <Icon type="caret-down" style={{ paddingLeft: '10px' }} theme="filled" />
            </div>
            <div onClick={() => this.ToggleAge()} className={styles['filter-age1']}>
              <Icon style={{ paddingRight: '10px' }} type="user" />
              <div style={{ color: '#34495e' }}>{this.getValueAge(this.state.ageValue)}</div>
              <div
                className={
                  filterAge
                    ? `${styles['sub-age']} ${styles['active-filter']}`
                    : styles['sub-age']
                }
              >
                <div className={styles['li-age']} onClick={() => this.handeClickSubAge('18_24')}>
                  Từ 18-24 tuổi
                </div>
                <div className={styles['li-age']} onClick={() => this.handeClickSubAge('25_35')}>
                  Từ 25-35 tuổi
                </div>
                <div className={styles['li-age']} onClick={() => this.handeClickSubAge('36')}>
                  Ngoài 35 tuổi
                </div>
              </div>
              <Icon type="caret-down" style={{ paddingLeft: '10px' }} theme="filled" />
            </div>
            <div className={styles['filter-button']}>
              <button
                onClick={() => this.handleClickSearch()}
                className={styles['btn-search']}
                type="button"
              >
                Tìm kiếm
              </button>
            </div>
          </div>
           </div>
          */}

            {/*
          <div className={styles.filter}>
          <div className={styles['filter-gender']}>
          <Select style={{width:'150px'}} defaultValue={this.props.location.query.gender ? `${this.props.location.query.gender}` : 'all'} onChange={(e)=>this.handleChangeGender(e)}>
            <Option value="male">Nam</Option>
            <Option value="female">Nữ</Option>
            <Option value="all">
              Cả Nam {'&'} Nữ
            </Option>

          </Select>
          </div>
          <div className={styles['filter-age']}>
            <Select style={{width:'150px'}} defaultValue={this.props.location.query.age ? `${this.props.location.query.age}` : '18_24'} onChange={(e)=>this.handleChangeAge(e)}>
              <Option value='18_24'>Từ 18 - 24 tuổi</Option>
              <Option value='25_35'>Từ 25 - 35 tuổi</Option>
              <Option value='36'>
                Ngoài 35 tuổi
              </Option>

            </Select>
          </div>
        </div>
        */}
            <div className={styles.row}>
              {!loadingPage ? (
                this.getDataFilter(allUser)
                  .filter((value, index) => index >= page * 20 - 20 && index < page * 20)
                  .map((v, i) => (
                    <Link
                      to={`/home/other-profile?id=${v.user_id.replace(/-/g, '')}`}
                      key={i}
                      className={styles['cart-item']}
                    >
                      <div className={styles['box-cart']}>
                        <LazyImage gender={v.gender} number={i % 20} avatar={v.avatar} />
                        <div className={styles['title-cart']}>
                          <span className={styles.detail}>{v.fullname}</span>
                          <span className={styles.detail}>,</span>
                          <span className={styles.detail}>{v.age}</span>
                          <span className={styles.detail}>{v.address}</span>
                        </div>
                      </div>
                    </Link>
                  ))
              ) : (
                <div style={{ width: '100%' }}>
                  <PageLoading />
                </div>
              )
              /*

                preLoad.map((v, i) => (
                <div key={i} className={styles['cart-item']}>
                  <div className={styles['box-cart']}>
                    <div style={{ overflow: 'hidden' }}>
                      <div
                        className={styles['background-avatar']}
                        style={{ background: '#fff' }}
                      />
                    </div>
                    <div className={`${styles['title-cart']} home-page-preload`}>
                      <Skeleton title={false} paragraph={{ rows: 2 }} active />
                    </div>
                  </div>
                </div>
              ))
            */
              }
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
              pageSize={20}
              total={this.getDataFilter(allUser).length}
            />
          </div>
        )}
        {this.state.leftTab === 1 && (
          <div className={styles.container}>
            <span>Day la menu 2</span>
          </div>
        )}
        {this.state.leftTab === 2 && (
          <div className={styles.container}>
            <span>Day la menu 3</span>
          </div>
        )}
      </div>
    );
  }
}

export default NewFeed;
