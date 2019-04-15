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
import { Skeleton, Icon, DatePicker, Select, Pagination } from 'antd';
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
    if (date) {
      this.props.history.push({
        pathname: `detail-list`,
        search: `?page=${v1}&radio=${radio}&gender=${gender}&date=${date}`,
      });
    } else
      this.props.history.push({
        pathname: `detail-list`,
        search: `?page=${v1}&radio=${radio}&gender=${gender}`,
      });
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
    const gender = this.props.location.query.gender;
    if (value2 === '') {
      this.props.history.push({
        pathname: 'detail-list',
        search: `?page=1&radio=${radio}&gender=${gender}`,
      });
    } else
      this.props.history.push({
        pathname: 'detail-list',
        search: `?page=1&radio=${radio}&gender=${gender}&date=${value2.replace(/\//g, '_')}`,
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
    const gender = this.props.location.query.gender;
    const date = this.props.location.query.date;
    if (date) {
      this.props.history.push({
        pathname: 'detail-list',
        search: `?page=1&radio=${e}&gender=${gender}&date=${date}`,
      });
    } else
      this.props.history.push({
        pathname: 'detail-list',
        search: `?page=1&radio=${e}&gender=${gender}`,
      });
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
    if (date) {
      this.props.history.push({
        pathname: 'detail-list',
        search: `?page=1&radio=${radio}&gender=${e}&date=${date}`,
      });
    } else
      this.props.history.push({
        pathname: 'detail-list',
        search: `?page=1&radio=${radio}&gender=${e}`,
      });
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
    this.setState(
      {
        globalPlaying: undefined,
        [audio]: false,
      },
      () => {
        this[`input-played-${audio}`].value = 0;
      }
    );
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
      return <Redirect to="detail-list?page=1&radio=ALL&gender=ALL" />;
    }
    const { loadingPage, preLoad, detailList, dataFilter, globalPlaying, played } = this.state;
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
            <div className={styles['filter-gender']}>
              <Select
                defaultValue={
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
          </div>
          <div className={styles.row}>
            {!loadingPage
              ? (dataFilter || detailList)
                  .filter((value, index) => index >= page * 20 - 20 && index < page * 20)
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
                            <h4>Hôn nhân:</h4>
                            <h4>{v.relationship}</h4>
                          </li>
                          <li>
                            <h4>Đài phát:</h4>
                            <h4>{v.location === 'HN' ? 'Hà Nội' : 'Hồ Chí Minh'}</h4>
                          </li>
                          <li>
                            <h4>Ngày lên sóng:</h4>
                            <h4>{moment(v.timeup).format('DD/MM/YYYY')}</h4>
                          </li>
                          <li>
                            <h4>Thời lượng:</h4>
                            {this.state[`duration-${v.audio}`] && (
                              <h4>
                                {this.getTimeInAudio(
                                  this[`input-played-${v.audio}`]
                                    ? this[`input-played-${v.audio}`].value
                                    : 0
                                )}
                                /
                                {this.getTimeInAudio(
                                  this.state[`duration-${v.audio}`]
                                    ? this.state[`duration-${v.audio}`]
                                    : 0
                                )}
                              </h4>
                            )}
                          </li>
                        </div>
                        <div className={styles.range}>
                          <input
                            className={styles['input-played']}
                            name={`name-${v.audio}`}
                            ref={input => (this[`input-played-${v.audio}`] = input)}
                            type="range"
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
                        </div>
                        <div className={styles['title-cart']}>
                          <div className={styles['play-icon']}>
                            {this.state[`duration-${v.audio}`] ? (
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
                            ) : (
                              <Icon type="loading" />
                            )}
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
                      <div className={styles.range}>
                        <input
                          className={styles['input-played']}
                          type="range"
                          min={0}
                          max={100}
                          step="any"
                          value={0}
                        />
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
