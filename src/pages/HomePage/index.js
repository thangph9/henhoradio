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

import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Link, Redirect } from 'react-router-dom';
import { Skeleton, Pagination, Icon, Drawer, Button, Radio, Select, Tag } from 'antd';
import LazyImage from './LazyImage';
import PageLoading from '@/components/PageLoading';
import styles from './index.less';

const RadioGroup = Radio.Group;
const Option = Select.Option;
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
    tag_item: [],
    activeSort: false,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'authentication/getallusers',
    });
    const gender = this.props.location.query.gender;
    const age = this.props.location.query.age;
    const sort = this.props.location.query.sortby;
    let objGender = {};
    let objSort = {};
    let objAge = {};
    if (gender && age && sort) {
      if (gender === 'male') objGender = { type: 'gender', value: '#nam' };
      if (gender === 'female') objGender = { type: 'gender', value: '#nu' };
      if (gender === 'all') objGender = { type: 'gender', value: '#namvanu' };
      if (age === '18_24') objAge = { type: 'age', value: '#tu18den24tuoi' };
      if (age === '25_35') objAge = { type: 'age', value: '#tu25den35tuoi' };
      if (age === '36') objAge = { type: 'age', value: '#tren35tuoi' };
      if (sort === 'age_descending') objSort = { type: 'sort', value: '#tuoigiamdan' };
      if (sort === 'age_ascending') objSort = { type: 'sort', value: '#tuoitangdan' };
      if (sort === 'newest_member') objSort = { type: 'sort', value: '#thanhvienmoinhat' };
      this.setState({
        tag_item: [objGender, objAge, objSort],
      });
    } else {
      this.setState({
        tag_item: [
          { type: 'gender', value: '#namvanu' },
          { type: 'age', value: '#tu18den24tuoi' },
          { type: 'sort', value: '#thanhvienmoinhat' },
        ],
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
    const sort = this.props.location.query.sortby;
    this.props.history.push({
      pathname: `/home/newfeed`,
      search: `?page=${v1}&gender=${gender}&age=${age}&sortby=${sort}`,
    });
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
    if (this.props.location.query.sortby === 'age_ascending') {
      return arr.sort((a, b) => a.age - b.age);
    }
    if (this.props.location.query.sortby === 'age_descending') {
      return arr.sort((a, b) => b.age - a.age);
    }
    return arr.sort((a, b) => new Date(b.createat) - new Date(a.createat));
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
    const sort = this.props.location.query.sortby;
    const tag = this.state.tag_item;
    let tag_value = {};
    if (e.target.value === 'male') tag_value = { type: 'gender', value: '#nam' };
    if (e.target.value === 'female') tag_value = { type: 'gender', value: '#nu' };
    if (e.target.value === 'all') tag_value = { type: 'gender', value: '#namvanu' };
    const index = tag.findIndex(ele => ele.type === 'gender');
    if (index !== -1) {
      tag[index] = tag_value;
    } else tag.push(tag_value);
    this.setState(
      {
        loadingPage: !this.state.loadingPage,
        tag_item: tag,
      },
      () => {
        this.setState({
          loadingPage: !this.state.loadingPage,
        });
      }
    );
    this.props.history.push({
      pathname: '/home/newfeed',
      search: `?page=1&gender=${e.target.value}&age=${age}&sortby=${sort}`,
    });
  }

  onChangeRadioAge(e) {
    const gender = this.props.location.query.gender;
    const sort = this.props.location.query.sortby;
    const tag = this.state.tag_item;
    let tag_value = {};
    if (e.target.value === '18_24') tag_value = { type: 'age', value: '#tu18den24tuoi' };
    if (e.target.value === '25_35') tag_value = { type: 'age', value: '#tu25den35tuoi' };
    if (e.target.value === '36') tag_value = { type: 'age', value: '#tren35tuoi' };
    const index = tag.findIndex(ele => ele.type === 'age');
    if (index !== -1) {
      tag[index] = tag_value;
    } else tag.push(tag_value);
    this.setState(
      {
        loadingPage: !this.state.loadingPage,
        tag_item: tag,
      },
      () => {
        this.setState({
          loadingPage: !this.state.loadingPage,
        });
      }
    );
    this.props.history.push({
      pathname: '/home/newfeed',
      search: `?page=1&gender=${gender}&age=${e.target.value}&sortby=${sort}`,
    });
  }

  handleChangeSort(e) {
    const gender = this.props.location.query.gender;
    const age = this.props.location.query.age;
    const tag = this.state.tag_item;
    let tag_value = {};
    if (e === 'age_descending') tag_value = { type: 'sort', value: '#tuoigiamdan' };
    if (e === 'age_ascending') tag_value = { type: 'sort', value: '#tuoitangdan' };
    if (e === 'newest_member') tag_value = { type: 'sort', value: '#thanhvienmoinhat' };
    const index = tag.findIndex(ele => ele.type === 'sort');
    if (index !== -1) {
      tag[index] = tag_value;
    } else tag.push(tag_value);
    this.setState(
      {
        loadingPage: !this.state.loadingPage,
        activeSort: !this.state.activeSort,
      },
      () => {
        this.setState({
          loadingPage: !this.state.loadingPage,
        });
      }
    );
    this.props.history.push({
      pathname: '/home/newfeed',
      search: `?page=1&gender=${gender}&age=${age}&sortby=${e}`,
    });
  }

  handleClickButtonSort() {
    this.setState({
      activeSort: !this.state.activeSort,
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
      !this.props.location.query.age ||
      !this.props.location.query.sortby
    ) {
      return <Redirect to="/home/newfeed?page=1&gender=all&age=18_24&sortby=newest_member" />;
    }
    return (
      <div className={styles['home-newfeed']}>
        <div style={{ background: '#fff' }}>
          <div className={styles['list-menu']}>
            <div className={styles['tab-list']}>
              <ul className={styles['tab-ul']}>
                <li
                  onClick={() => this.handleClickTab(0)}
                  className={this.state.leftTab === 0 ? `${styles['active-tab']}` : ''}
                >
                  Tất cả
                  <span style={{ left: `${this.state.leftTab * 100}%` }} />
                </li>
              </ul>
            </div>
            <div className={styles['filter-button']}>
              <Button
                id={styles['button-filter']}
                type="primary"
                icon="control"
                onClick={this.showDrawer}
              >
                Lọc dữ liệu
              </Button>

              <Icon id={styles['icon-filter']} type="control" onClick={this.showDrawer} />
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
                    <hr style={{ marginBottom: '15px' }} />
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
            <div className={styles['mobile-filter']}>
              {this.state.tag_item.length > 0 && (
                <div className={styles['tag-item']}>
                  {this.state.tag_item.map((v, i) => (
                    <Tag style={{ marginBottom: '5px' }} key={i}>
                      {v.value}
                    </Tag>
                  ))}
                </div>
              )}
              <div className={styles['mobile-sort']}>
                <div
                  onClick={() => this.handleClickButtonSort()}
                  data-v-03b85949={this.state.activeSort}
                  className={styles['copy-bar']}
                >
                  <span data-v-03b85949>Sắp xếp </span>
                  <Icon type="caret-down" />
                </div>
                {this.state.activeSort && (
                  <ul data-v-03b85949 className={styles['format-dd']}>
                    <li
                      onClick={() => this.handleChangeSort('age_descending')}
                      data-v-03b85949
                      className={styles['format-option']}
                    >
                      Tuổi giảm dần
                    </li>
                    <li
                      onClick={() => this.handleChangeSort('age_ascending')}
                      data-v-03b85949
                      className={styles['format-option']}
                    >
                      Tuổi tăng dần
                    </li>
                    <li
                      onClick={() => this.handleChangeSort('newest_member')}
                      data-v-03b85949
                      className={styles['format-option']}
                    >
                      Thành viên mới
                    </li>
                  </ul>
                )}
              </div>
            </div>
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
              )}
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
        {/*
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
        */}
      </div>
    );
  }
}

export default NewFeed;
