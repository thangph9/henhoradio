/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable react/jsx-closing-bracket-location */
/* eslint-disable no-return-assign */
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
import { Skeleton, Icon, DatePicker, Select, Pagination, Row } from 'antd';
import { Redirect } from 'react-router-dom';
import ReactPlayer from 'react-player';
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
    arrFilter: ['', '', ''],
    number: 0,
    played: 0,
    loaded: 0,
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
    if (this.props.location.query.gender) {
      if (this.props.location.query.gender === 'ALL') {
        arrFilter[2] = '';
      } else arrFilter[2] = this.props.location.query.gender;
    }
    if (this.props.location.query.date)
      arrFilter[0] = this.props.location.query.date.replace(/\_/g, '/');
  }

  handleChangePagination(v1, v2) {
    const radio = this.props.location.query.radio;
    const date = this.props.location.query.date;
    const gender = this.props.location.query.gender;
    const sort = this.props.location.query.sort;
    if (date) {
      if (sort) {
        this.props.history.push({
          pathname: `/home/detail-list`,
          search: `?page=${v1}&radio=${radio}&gender=${gender}&sort=${sort}&date=${date}`,
        });
      } else {
        this.props.history.push({
          pathname: `/home/detail-list`,
          search: `?page=${v1}&radio=${radio}&gender=${gender}&date=${date}`,
        });
      }
    } else if (sort) {
      this.props.history.push({
        pathname: `/home/detail-list`,
        search: `?page=${v1}&radio=${radio}&gender=${gender}&sort=${sort}`,
      });
    } else {
      this.props.history.push({
        pathname: `/home/detail-list`,
        search: `?page=${v1}&radio=${radio}&gender=${gender}`,
      });
    }
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
                if (i === 1) {
                  return value.location === this.state.arrFilter[1];
                }
                return value.gender === this.state.arrFilter[2];
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
    const gender = this.props.location.query.gender;
    const sort = this.props.location.query.sort;
    if (value2 === '') {
      if (sort) {
        this.props.history.push({
          pathname: '/home/detail-list',
          search: `?page=1&radio=${radio}&gender=${gender}&sort=${sort}`,
        });
      } else {
        this.props.history.push({
          pathname: '/home/detail-list',
          search: `?page=1&radio=${radio}&gender=${gender}`,
        });
      }
    } else if (sort) {
      this.props.history.push({
        pathname: '/home/detail-list',
        search: `?page=1&radio=${radio}&gender=${gender}&sort=${sort}&date=${value2.replace(
          /\//g,
          '_'
        )}`,
      });
    } else {
      this.props.history.push({
        pathname: '/home/detail-list',
        search: `?page=1&radio=${radio}&gender=${gender}&date=${value2.replace(/\//g, '_')}`,
      });
    }
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
    const gender = this.props.location.query.gender;
    const date = this.props.location.query.date;
    const sort = this.props.location.query.sort;
    if (date) {
      if (sort) {
        this.props.history.push({
          pathname: '/home/detail-list',
          search: `?page=1&radio=${e}&gender=${gender}&sort=${sort}&date=${date}`,
        });
      } else {
        this.props.history.push({
          pathname: '/home/detail-list',
          search: `?page=1&radio=${e}&gender=${gender}&date=${date}`,
        });
      }
    } else if (sort) {
      this.props.history.push({
        pathname: '/home/detail-list',
        search: `?page=1&radio=${e}&gender=${gender}&sort=${sort}`,
      });
    } else {
      this.props.history.push({
        pathname: '/home/detail-list',
        search: `?page=1&radio=${e}&gender=${gender}`,
      });
    }
  }

  handleChangeGender(e) {
    const arrFilter = this.state.arrFilter;
    if (e === 'ALL') {
      arrFilter[2] = '';
    } else arrFilter[2] = e;
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
    const sort = this.props.location.query.sort;
    if (date) {
      if (sort) {
        this.props.history.push({
          pathname: '/home/detail-list',
          search: `?page=1&radio=${radio}&gender=${e}&sort=${sort}&date=${date}`,
        });
      } else {
        this.props.history.push({
          pathname: '/home/detail-list',
          search: `?page=1&radio=${radio}&gender=${e}&date=${date}`,
        });
      }
    } else if (sort) {
      this.props.history.push({
        pathname: '/home/detail-list',
        search: `?page=1&radio=${radio}&gender=${e}&sort=${sort}`,
      });
    } else {
      this.props.history.push({
        pathname: '/home/detail-list',
        search: `?page=1&radio=${radio}&gender=${e}`,
      });
    }
  }

  componentWillMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'menu/getmenu',
      payload: 'HomePage',
    });
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
            if (i === 1) {
              return value.location === nextState.arrFilter[1];
            }
            return value.gender === nextState.arrFilter[2];
          });
        }
        this.setState({
          dataFilter: dataArr,
        });
      }
    }
  }

  handleChangeSort(e) {
    const radio = this.props.location.query.radio;
    const date = this.props.location.query.date;
    const gender = this.props.location.query.gender;
    if (date) {
      if (e !== 'default') {
        this.props.history.push({
          pathname: '/home/detail-list',
          search: `?page=1&radio=${radio}&gender=${gender}&sort=${e}&date=${date}`,
        });
      } else {
        this.props.history.push({
          pathname: '/home/detail-list',
          search: `?page=1&radio=${radio}&gender=${gender}&date=${date}`,
        });
      }
    } else if (e !== 'default') {
      this.props.history.push({
        pathname: '/home/detail-list',
        search: `?page=1&radio=${radio}&gender=${gender}&sort=${e}`,
      });
    } else {
      this.props.history.push({
        pathname: '/home/detail-list',
        search: `?page=1&radio=${radio}&gender=${gender}`,
      });
    }
  }

  //---------------------------------

  playAudioReact(value) {
    const { globalPlaying } = this.state;
    if (!globalPlaying || globalPlaying === value) {
      this.setState(prevState => ({
        globalPlaying: value,
        [value]: !prevState[value],
      }));
    } else {
      this.setState(prevState => ({
        [globalPlaying]: false,
        [value]: !prevState[value],
        globalPlaying: value,
      }));
    }
  }

  onProgress(state, audio) {
    if (this.state[audio]) {
      this.setState(
        {
          [audio]: state.playedSeconds,
          [`loaded-${audio}`]: state.loadedSeconds,
        },
        () => {
          this[`input-played-${audio}`].value = this.state[audio];
        }
      );
    }
  }

  onSeekMouseDown(e, v) {}

  onSeekChange(e, v) {
    this.setState({ played: parseFloat(e.target.value) });
  }

  onSeekMouseUp(e, v) {
    if (e.target.value < this.state[`duration-${v}`]) {
      this[`player-${v}`].seekTo(e.target.value);
    }
  }

  onSeek(e) {
    // console.log('onSeek', e)
  }

  onDuration(duration, audio) {
    this.setState({
      [`duration-${audio}`]: duration,
    });
  }

  onEnded(audio) {
    this[`input-played-${audio}`].value = 0;
    this.setState({
      globalPlaying: undefined,
      [audio]: false,
    });
  }

  getTimeInAudio(value) {
    if (value >= 3600) {
      const h = value / 3600;
      const m = (value % 3600) / 60;
      const s = (value % 3600) % 60;
      return `${Math.trunc(h)}:${Math.trunc(m)}:${Math.trunc(s)}`;
    }
    const m = value / 60;
    const s = value % 60;
    return `${Math.trunc(m)}:${Math.trunc(s)}`;
  }

  render() {
    if (this.props.location.search === '') {
      this.setState({
        arrFilter: ['', '', ''],
      });
      return (
        <Redirect to={{ pathname: '/home/detail-list', search: '?page=1&radio=ALL&gender=ALL' }} />
      );
    }
    const { loadingPage, preLoad, detailList, dataFilter, globalPlaying, played } = this.state;
    const { page } = this.props.location.query;
    return (
      <div style={{ paddingTop: '32px', background: '#f3f5f9' }}>
        <div className={styles.container}>
          <div className={styles['filter-data']}>
            <div className={`${styles['filter-date']} ${styles['item-filter']}`}>
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
            <div className={`${styles['filter-radio']} ${styles['item-filter']}`}>
              <Select
                value={
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
            <div className={`${styles['filter-gender']} ${styles['item-filter']}`}>
              <Select
                value={
                  this.props.location.query.gender ? `${this.props.location.query.gender}` : 'ALL'
                }
                onChange={e => this.handleChangeGender(e)}
                placeholder="Lựa chọn"
              >
                <Option value="MALE">Nam</Option>
                <Option value="FEMALE">Nữ</Option>
                <Option value="ALL">Nam {'&'} Nữ</Option>
              </Select>
            </div>
            <div className={`${styles['filter-sort']} ${styles['item-filter']}`}>
              <Select
                value={this.props.location.query.sort && `${this.props.location.query.sort}`}
                onChange={e => this.handleChangeSort(e)}
                placeholder="Sắp xếp"
              >
                <Option value="default">Mặc định</Option>
                <Option value="newest">Mới nhất</Option>
                <Option value="special">Đặc biệt nhất</Option>
              </Select>
            </div>
          </div>
          <div className={styles.row}>
            {!loadingPage
              ? (dataFilter || detailList)
                  .filter((value, index) => index >= page * 20 - 20 && index < page * 20)
                  .sort((a, b) => {
                    if (this.props.location.query.sort === 'newest') {
                      return new Date(b.timeup) - new Date(a.timeup);
                    }
                    return null;
                  })
                  .map((v, i) => (
                    <div key={i} className={styles['cart-item']}>
                      <div className={styles['box-cart']}>
                        <div className={styles['member-information']}>
                          <div className={styles['list-menu']}>
                            <h4>Lên sóng:</h4>
                            <h4>{v.name}</h4>
                          </div>
                          <div className={styles['list-menu']}>
                            <h4>Giới tính:</h4>
                            <h4>{v.gender === 'MALE' ? 'Nam' : 'Nữ'}</h4>
                          </div>
                          <div className={styles['list-menu']}>
                            <h4>Hôn nhân:</h4>
                            <h4>{v.relationship}</h4>
                          </div>
                          <div className={styles['list-menu']}>
                            <h4>Đài phát:</h4>
                            <h4>{v.location === 'HN' ? 'Hà Nội' : 'Hồ Chí Minh'}</h4>
                          </div>
                          <div className={styles['list-menu']}>
                            <h4>Ngày lên sóng:</h4>
                            <h4>{moment(v.timeup).format('DD/MM/YYYY')}</h4>
                          </div>
                          <div className={styles['list-menu']}>
                            <h4>Thời lượng:</h4>
                            <h4>
                              {this.getTimeInAudio(
                                this[`input-played-${v.audio}`]
                                  ? this[`input-played-${v.audio}`].value
                                  : 0
                              )}
                              /
                              {this.state[`duration-${v.audio}`] ? (
                                <span>
                                  {this.getTimeInAudio(
                                    this.state[`duration-${v.audio}`]
                                      ? this.state[`duration-${v.audio}`]
                                      : 0
                                  )}
                                </span>
                              ) : (
                                '0:0'
                              )}
                            </h4>
                          </div>
                        </div>
                        <div className={styles.range}>
                          <div className={styles['range-item']}>
                            <input
                              className={styles['input-loaded']}
                              name={`name-${v.audio}`}
                              ref={input => (this[`input-played-loaded-${v.audio}`] = input)}
                              type="range"
                              defaultValue={0}
                              step="any"
                              style={{
                                width: `${
                                  this.state[`loaded-${v.audio}`]
                                    ? (this.state[`loaded-${v.audio}`] * 100) /
                                      this.state[`duration-${v.audio}`]
                                    : 0
                                }%`,
                              }}
                            />
                            <input
                              className={styles['input-played']}
                              ref={input => (this[`input-played-${v.audio}`] = input)}
                              type="range"
                              defaultValue={0}
                              min={0}
                              max={
                                this.state[`duration-${v.audio}`]
                                  ? this.state[`duration-${v.audio}`]
                                  : 0
                              }
                              step="any"
                              onMouseDown={e => this.onSeekMouseDown(e, `player-${v.audio}`)}
                              onPointerDown={e => this.onSeekMouseDown(e, `player-${v.audio}`)}
                              onPointerUp={e => this.onSeekMouseUp(e, v.audio)}
                              onChange={e => this.onSeekChange(e, `player-${v.audio}`)}
                              onMouseUp={e => this.onSeekMouseUp(e, v.audio)}
                            />
                            <div className={styles['title-cart']}>
                              <div className={styles['play-icon']}>
                                <Icon
                                  onClick={() => this.playAudioReact(v.audio)}
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
                          </div>
                        </div>
                        <ReactPlayer
                          playing={this.state[v.audio]}
                          ref={player => (this[`player-${v.audio}`] = player)}
                          width="0%"
                          height="0%"
                          loop={false}
                          onSeek={e => this.onSeek(e)}
                          url={`http://cdn.henhoradio.net/upload/audio/local/${v.audio}`}
                          onProgress={e => this.onProgress(e, v.audio)}
                          config={{
                            file: { forceAudio: true },
                          }}
                          onDuration={e => this.onDuration(e, v.audio)}
                          onEnded={() => this.onEnded(v.audio)}
                        />
                      </div>
                    </div>
                  ))
              : preLoad.map((v, i) => (
                  <div key={i} className={styles['cart-item']}>
                    <div className={styles['box-cart']}>
                      <div className={styles['member-information']}>
                        <li className={styles['li-skeleton']} />
                        <li className={styles['li-skeleton']} />
                        <li className={styles['li-skeleton']} />
                        <li className={styles['li-skeleton']} />
                        <li className={styles['li-skeleton']} />
                      </div>
                      <div
                        style={{ borderTop: '1px solid #95a5a6' }}
                        className={`${styles['title-cart']} home-page-preload`}
                      >
                        <Icon
                          style={{
                            cursor: 'pointer',
                            margin: '0 auto',
                            display: 'table',
                            fontSize: '20px',
                          }}
                          type="play-circle"
                        />
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
            pageSize={20}
            total={dataFilter ? dataFilter.length : detailList.length}
          />
        </div>
      </div>
    );
  }
}

export default ListRadio;
