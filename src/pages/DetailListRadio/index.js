/* eslint-disable react/no-will-update-set-state */
/* eslint-disable no-continue */
/* eslint-disable react/sort-comp */
/* eslint-disable no-unused-vars */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-useless-escape */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable class-methods-use-this */
/* eslint-disable jsx-a11y/media-has-caption */
/* eslint-disable react/jsx-indent */
/* eslint-disable react/no-array-index-key */
/* eslint-disable no-plusplus */

import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Skeleton, Icon, DatePicker, Select, Pagination } from 'antd';
import moment from 'moment';
import styles from './index.less';

const dateFormat = 'DD/MM/YYYY';
const { Option } = Select;
@connect(({ authentication, members }) => ({
  authentication,
  members,
}))
class ListRadio extends PureComponent {
  state = {
    loadingPage: true,
    preLoad: [1, 2, 3, 4, 5, 6, 7, 8],
    detailList: [],
    arrFilter: ['', ''],
    number: 0,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'members/getmembers',
    });
    const arrFilter = this.state.arrFilter;
    if (this.props.location.query.radio) {
      if (this.props.location.query.radio === 'ALL') {
        arrFilter[1] = '';
      } else arrFilter[1] = this.props.location.query.radio;
    }
    if (this.props.location.query.date)
      arrFilter[0] = this.props.location.query.date.replace(/\_/g, '/');
    if (this.props.location.search === '')
      this.props.history.push({ pathname: 'detail-list', search: '?page=1&radio=ALL' });
  }

  handleChangePagination(v1, v2) {
    const radio = this.props.location.query.radio;
    const date = this.props.location.query.date;
    if (date) {
      this.props.history.push({
        pathname: `detail-list`,
        search: `?page=${v1}&radio=${radio}&date=${date}`,
      });
    } else
      this.props.history.push({ pathname: `detail-list`, search: `?page=${v1}&radio=${radio}` });
  }

  componentWillReceiveProps(nextProps) {
    const { members } = this.props;
    if (members.getmembers !== nextProps.members.getmembers) {
      this.setState(
        {
          detailList: nextProps.members.getmembers,
          loadingPage: false,
        },
        () => {
          if (this.state.arrFilter) {
            let dataArr = this.state.detailList;
            for (let i = 0; i < this.state.arrFilter.length; i++) {
              if (this.state.arrFilter[i] === '') continue;
              dataArr = dataArr.filter((value, index) => {
                if (i === 0) {
                  const timeCreate = new Date(value.timeup);
                  const stringTime = `${`${timeCreate.getDate()}`}/${`${timeCreate.getMonth() +
                    1}`}/${timeCreate.getFullYear()}`;
                  return stringTime === this.state.arrFilter[0];
                }
                return value.location === this.state.arrFilter[1];
              });
            }
            this.setState({
              dataFilter: dataArr,
            });
          }
        }
      );
    }
  }

  handleClickPlay(audio) {
    const audioElement = document.getElementById(audio);
    if (this.state[`${audio}`] && this.state.globalPlay === audio) {
      if (this.state[`${audio}`].paused) this.state[`${audio}`].play();
      else this.state[`${audio}`].pause();
      return;
    }
    if (this.state.globalPlay !== audio && this.state[`${this.state.globalPlay}`]) {
      this.state[`${this.state.globalPlay}`].pause();
    }
    this.setState(
      {
        [audio]: audioElement,
        globalPlay: audio,
      },
      () => {
        this.state[audio].play();
        const settime = setInterval(() => {
          if (this.state[audio].currentTime !== 0) {
            this.setState({
              [`current-time-${audio}`]: this.state[audio].currentTime,
            });
          }
          if (this.state[audio].ended) {
            this.setState(
              {
                [audio]: undefined,
                [`current-time-${audio}`]: undefined,
              },
              () => {
                clearInterval(settime);
              }
            );
          }
        }, 100);
      }
    );
  }

  handleClickSlidePlay(e, v, v2) {
    const slide = document.getElementById(`slide-${v}`);
    const offset = e.nativeEvent.offsetX;
    if (this.state[`${v}`]) {
      this.state[`${v}`].currentTime = (offset / slide.offsetWidth) * v2;
    }
  }

  onChangeDate(value1, value2) {
    const arrFilter = this.state.arrFilter;
    arrFilter[0] = value2;
    this.setState(
      {
        arrFilter: undefined,
      },
      () => {
        this.setState({
          arrFilter,
        });
      }
    );
    const radio = this.props.location.query.radio;
    if (value2 === '') {
      this.props.history.push({ pathname: 'detail-list', search: `?page=1&radio=${radio}` });
    } else
      this.props.history.push({
        pathname: 'detail-list',
        search: `?page=1&radio=${radio}&date=${value2.replace(/\//g, '_')}`,
      });
  }

  handleChangeRadio(e) {
    const arrFilter = this.state.arrFilter;
    if (e === 'ALL') {
      arrFilter[1] = '';
    } else arrFilter[1] = e;
    this.setState(
      {
        arrFilter: undefined,
      },
      () => {
        this.setState({
          arrFilter,
        });
      }
    );
    const radio = this.props.location.query.radio;
    const date = this.props.location.query.date;
    if (date) {
      this.props.history.push({
        pathname: 'detail-list',
        search: `?page=1&radio=${e}&date=${date}`,
      });
    } else this.props.history.push({ pathname: 'detail-list', search: `?page=1&radio=${e}` });
  }

  componentWillUpdate(nextProps, nextState) {
    if (this.state.arrFilter !== nextState.arrFilter) {
      if (nextState.arrFilter) {
        let dataArr = this.state.detailList;
        for (let i = 0; i < nextState.arrFilter.length; i++) {
          if (nextState.arrFilter[i] === '') continue;
          dataArr = dataArr.filter((value, index) => {
            if (i === 0) {
              const timeCreate = new Date(value.timeup);
              const stringTime = `${`${timeCreate.getDate()}`}/${`${timeCreate.getMonth() +
                1}`}/${timeCreate.getFullYear()}`;
              return stringTime === nextState.arrFilter[0];
            }
            return value.location === nextState.arrFilter[1];
          });
        }
        this.setState({
          dataFilter: dataArr,
        });
      }
    }
  }

  render() {
    const { loadingPage, preLoad, detailList, dataFilter } = this.state;
    const { page } = this.props.location.query;
    return (
      <div style={{ paddingTop: '32px', background: '#f3f5f9' }}>
        <div className={styles.container}>
          <div className={styles['filter-data']}>
            <div className={styles['filter-date']}>
              {this.props.location.query.date ? (
                <DatePicker
                  defaultValue={moment(
                    this.props.location.query.date.replace(/\_/g, '/'),
                    dateFormat
                  )}
                  format="D/M/YYYY"
                  onChange={(e, v) => this.onChangeDate(e, v)}
                  placeholder="Lựa chọn"
                />
              ) : (
                <DatePicker
                  format="D/M/YYYY"
                  onChange={(e, v) => this.onChangeDate(e, v)}
                  placeholder="Lựa chọn"
                />
              )}
            </div>
            <div className={styles['filter-radio']}>
              <Select
                defaultValue={
                  this.props.location.query.radio ? `${this.props.location.query.radio}` : 'ALL'
                }
                onChange={e => this.handleChangeRadio(e)}
                placeholder="Lựa chọn"
              >
                <Option value="HN">Hà Nội</Option>
                <Option value="HCM">Hồ Chí Minh</Option>
                <Option value="ALL">Cả hai đài</Option>
              </Select>
            </div>
          </div>
          <div className={styles.row}>
            {!loadingPage
              ? (dataFilter || detailList)
                  .filter((value, index) => index >= page * 4 - 4 && index < page * 4)
                  .map((v, i) => (
                    <div key={i} className={styles['cart-item']}>
                      <div className={styles['box-cart']}>
                        <div className={styles['member-information']}>
                          <li>
                            <h4>Lên sóng:</h4>
                            <h4>{v.name}</h4>
                          </li>
                          <li>
                            <h4>Giới tính:</h4>
                            <h4>{v.gender === 'MALE' ? 'Nam' : 'Nữ'}</h4>
                          </li>
                          <li>
                            <h4>MC:</h4>
                            <h4>Như Ngọc</h4>
                          </li>
                          <li>
                            <h4>Đài phát:</h4>
                            <h4>{v.location === 'HN' ? 'Hà Nội' : 'Hồ Chí Minh'}</h4>
                          </li>
                          <li>
                            <h4>Thời gian:</h4>
                            <h4>{moment(v.timeup).format('DD/MM/YYYY')}</h4>
                          </li>
                        </div>
                        <div
                          id={`slide-${v.audio}`}
                          onClick={e => this.handleClickSlidePlay(e, v.audio, v.duration)}
                          className={styles['slide-play']}
                        >
                          <div
                            style={
                              this.state[`current-time-${v.audio}`]
                                ? {
                                    width: `${(this.state[`current-time-${v.audio}`] * 100) /
                                      v.duration}%`,
                                  }
                                : { width: '0%' }
                            }
                            className={styles.played}
                          >
                            <div className={styles.dots} />
                          </div>
                        </div>
                        <div className={styles['title-cart']}>
                          <div className={styles['play-icon']}>
                            <Icon
                              onClick={() => this.handleClickPlay(v.audio)}
                              type={
                                !this.state[`${v.audio}`]
                                  ? 'play-circle'
                                  : this.state[`${v.audio}`].paused
                                  ? 'play-circle'
                                  : 'pause-circle'
                              }
                            />
                          </div>
                        </div>
                        <audio
                          controls
                          type="audio/mpeg"
                          style={{ display: 'none' }}
                          id={v.audio}
                          src={v.audio}
                        />
                      </div>
                    </div>
                  ))
              : preLoad.map((v, i) => (
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
                ))}
          </div>
          <Pagination
            style={{ padding: '5px', float: 'right', marginTop: '30px' }}
            onChange={(v1, v2) => this.handleChangePagination(v1, v2)}
            current={Number(this.props.location.query.page)}
            hideOnSinglePage
            pageSize={4}
            total={dataFilter ? dataFilter.length : detailList.length}
          />
        </div>
      </div>
    );
  }
}

export default ListRadio;
