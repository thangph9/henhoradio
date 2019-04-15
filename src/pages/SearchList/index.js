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
import { Redirect, Link } from 'react-router-dom';
import ReactPlayer from 'react-player';
import moment from 'moment';
import styles from './index.less';

const dateFormat = 'DD/MM/YYYY';
const { Option } = Select;
@connect(({ list }) => ({
  list,
}))
class ListRadio extends PureComponent {
  state = {
    loadingPage: true,
    preLoad: [1, 2, 3, 4, 5, 6, 7, 8],
    detailList: [],
    arrFilter: ['', ''],
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'list/tracklist',
    });
    const arrFilter = this.state.arrFilter;
    if (this.props.location.query.radio) {
      if (this.props.location.query.radio === 'ALL') {
        arrFilter[1] = '';
      } else arrFilter[1] = this.props.location.query.radio;
    }
    if (this.props.location.query.date)
      arrFilter[0] = this.props.location.query.date.replace(/\_/g, '/');
  }

  handleChangePagination(v1, v2) {
    const radio = this.props.location.query.radio;
    const date = this.props.location.query.date;
    if (date) {
      this.props.history.push({
        pathname: `search-list`,
        search: `?page=${v1}&radio=${radio}&date=${date}`,
      });
    } else
      this.props.history.push({ pathname: `search-list`, search: `?page=${v1}&radio=${radio}` });
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.list.tracklist !== nextProps.list.tracklist) {
      this.setState(
        {
          loaded: true,
          dataList: nextProps.list.tracklist,
          loadingPage: false,
        },
        () => {
          if (this.state.arrFilter) {
            let dataArr = this.state.dataList;
            for (let i = 0; i < this.state.arrFilter.length; i++) {
              if (this.state.arrFilter[i] === '') continue;
              dataArr = dataArr.filter((value, index) => {
                if (i === 0) {
                  const timeCreate = new Date(value.date);
                  const stringTime = `${`${timeCreate.getDate()}`}/${`${timeCreate.getMonth() +
                    1}`}/${timeCreate.getFullYear()}`;
                  return stringTime === this.state.arrFilter[0];
                }
                return value.local === this.state.arrFilter[1];
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
    if (value2 === '') {
      this.props.history.push({ pathname: 'search-list', search: `?page=1&radio=${radio}` });
    } else
      this.props.history.push({
        pathname: 'search-list',
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
        pathname: 'search-list',
        search: `?page=1&radio=${e}&date=${date}`,
      });
    } else this.props.history.push({ pathname: 'search-list', search: `?page=1&radio=${e}` });
  }

  componentWillUpdate(nextProps, nextState) {
    if (this.state.arrFilter !== nextState.arrFilter) {
      if (nextState.arrFilter) {
        let dataArr = this.state.dataList;
        for (let i = 0; i < nextState.arrFilter.length; i++) {
          if (nextState.arrFilter[i] === '') continue;
          dataArr = dataArr.filter((value, index) => {
            if (i === 0) {
              const timeCreate = new Date(value.date);
              const stringTime = `${`${timeCreate.getDate()}`}/${`${timeCreate.getMonth() +
                1}`}/${timeCreate.getFullYear()}`;
              return stringTime === nextState.arrFilter[0];
            }
            return value.local === nextState.arrFilter[1];
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

  render() {
    if (this.props.location.search === '') {
      return <Redirect to="search-list?page=1&radio=ALL" />;
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
                            <h4>{v.title}</h4>
                          </li>
                          <li>
                            <h4>MC:</h4>
                            <h4>{v.mc}</h4>
                          </li>
                          <li>
                            <h4>Đài phát:</h4>
                            <h4>{v.local === 'HN' ? 'Hà Nội' : 'Hồ Chí Minh'}</h4>
                          </li>
                          <li>
                            <h4>Thời gian:</h4>
                            <h4>{moment(v.date).format('DD/MM/YYYY')}</h4>
                          </li>
                          <li>
                            <h4>Chi tiết:</h4>
                            <h4>
                              <Link
                                style={{ color: '#e74c3c', textDecoration: 'underline' }}
                                to={`detail-list?page=1&radio=${v.local}&gender=ALL&date=${moment(
                                  v.date
                                )
                                  .format('D/M/YYYY')
                                  .replace(/\//g, '_')}`}
                              >
                                TV lên sóng...
                              </Link>
                            </h4>
                          </li>
                        </div>
                        <div className={styles.range}>
                          <input
                            className={styles['input-played']}
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
                            <Icon
                              // onClick={() => this.handleClickPlay(v.audio)}
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
