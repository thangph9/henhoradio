/* eslint-disable no-useless-escape */
/* eslint-disable use-isnan */
/* eslint-disable no-continue */
/* eslint-disable no-loop-func */
/* eslint-disable no-unneeded-ternary */
/* eslint-disable no-return-assign */
/* eslint-disable prefer-destructuring */
/* eslint-disable arrow-body-style */
/* eslint-disable prefer-template */
/* eslint-disable jsx-a11y/mouse-events-have-key-events */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-unused-vars */
/* eslint-disable react/no-did-update-set-state */
/* eslint-disable react/no-will-update-set-state */
/* eslint-disable no-param-reassign */
/* eslint-disable no-self-compare */
/* eslint-disable no-plusplus */
/* eslint-disable prefer-const */
/* eslint-disable react/sort-comp */
/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/no-unused-state */
/* eslint-disable jsx-a11y/media-has-caption */
/* eslint-disable class-methods-use-this */
import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'dva';
import moment from 'moment';
import {
  Row,
  Col,
  Form,
  DatePicker,
  Card,
  Select,
  Icon,
  Avatar,
  List,
  Tooltip,
  Dropdown,
  Menu,
  Input,
  Skeleton,
} from 'antd';

import styles from './index.less';

const { Option } = Select;
const FormItem = Form.Item;
const dateFormat = 'DD/MM/YYYY';
const preload = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }];
@connect(({ list, loading }) => ({
  list,
  loading: loading.models.list,
  loadingPage: loading.effects['list/tracklist'],
}))
@Form.create()
class FilterCardList extends PureComponent {
  state = {
    globalPlay: undefined,
    audio: undefined,
    idNow: '',
    loaded: false,
    dataList: [],
    arrFilter: ['', ''],
    number: 0,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'list/tracklist',
    });
    let arrFilter = this.state.arrFilter;
    if (this.props.location.query.radio) {
      if (this.props.location.query.radio === 'ALL') {
        arrFilter[1] = '';
      } else arrFilter[1] = this.props.location.query.radio;
    }
    if (this.props.location.query.date)
      arrFilter[0] = this.props.location.query.date.replace(/\_/g, '/');
    if (this.props.location.search === '')
      this.props.history.push({ pathname: 'search-list', search: '?page=1&radio=ALL' });
  }

  componentWillUnmount() {}

  handleClickSlideBarAudio(e, v, v2, v3) {
    const tua = document.getElementById(v);
    const audio = document.getElementById(v2);
    const offset = e.nativeEvent.offsetX;
    if (this.state[`audio-${v2}`] && this.state.globalPlay === v2) {
      this.state[`audio-${v2}`].currentTime = (offset / tua.offsetWidth) * v3;
    }
  }

  handleMouseUp(e, v, v2) {
    const tua = document.getElementById(v);
    if (this.state[`audio-${v2}`]) {
      this.setState({
        width: undefined,
      });
      this.state[`audio-${v2}`].play();
    }
  }

  handleMouseMove(e, v, v2, v3) {
    if (this.state[`audio-${v2}`] && this.state.width) {
      const tua = document.getElementById(v);
      const audio = document.getElementById(v2);
      const offset = e.nativeEvent.offsetX;
      this.setState({
        [`timming-${v2}`]: (offset / tua.offsetWidth) * v3,
      });
    }
  }

  handleMouseDown(e, v, v2) {
    const offset = e.nativeEvent.offsetX;
    if (this.state[`audio-${v2}`]) {
      this.setState({
        width: offset,
      });
      this.state[`audio-${v2}`].pause();
    }
  }

  handleChangePagination(v1, v2) {
    let radio = this.props.location.query.radio;
    let date = this.props.location.query.date;
    if (date) {
      this.props.history.push({
        pathname: `search-list`,
        search: `?page=${v1}&radio=${radio}&date=${date}`,
      });
    } else
      this.props.history.push({ pathname: `search-list`, search: `?page=${v1}&radio=${radio}` });
  }

  handleClickAudio(value, v2) {
    const audio = this.state[`audio-${value}`]
      ? this.state[`audio-${value}`]
      : document.getElementById(value);
    if (this.state.globalPlay === value) {
      if (this.state[`audio-${value}`].paused) this.state[`audio-${value}`].play();
      else this.state[`audio-${value}`].pause();
      return;
    }
    if (this.state.globalPlay !== value && this.state[`audio-${this.state.globalPlay}`]) {
      this.state[`audio-${this.state.globalPlay}`].pause();
      this.setState({
        globalPlay: value,
      });
    }
    audio.play();
    this.setState(
      {
        [`audio-${value}`]: audio,
        [`dot-${value}`]: true,
        [`playing-${value}`]: value,
        globalPlay: value,
      },
      () => {
        const settime = setInterval(() => {
          if (!this.state.width) {
            if (audio.currentTime !== 0) {
              this.setState({
                [`timming-${value}`]: audio.currentTime,
              });
            }
          }
          if (audio.ended) {
            this.setState(
              {
                audio: undefined,
                [`dot-${value}`]: undefined,
                globalPlay: undefined,
                [`timming-${value}`]: undefined,
                [`playing-${value}`]: undefined,
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

  componentWillReceiveProps(nextProps) {
    if (this.props.list.tracklist !== nextProps.list.tracklist) {
      if (nextProps.list.tracklist.status === 'ok') {
        this.setState(
          {
            loaded: true,
            dataList: nextProps.list.tracklist.data,
            dataDuration: nextProps.list.tracklist.duration,
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
  }

  onChangeDate(value1, value2) {
    let arrFilter = this.state.arrFilter;
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
    let radio = this.props.location.query.radio;
    if (value2 === '') {
      this.props.history.push({ pathname: 'search-list', search: `?page=1&radio=${radio}` });
    } else
      this.props.history.push({
        pathname: 'search-list',
        search: `?page=1&radio=${radio}&date=${value2.replace(/\//g, '_')}`,
      });
  }

  handleChangeRadio(e) {
    let arrFilter = this.state.arrFilter;
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
    let radio = this.props.location.query.radio;
    let date = this.props.location.query.date;
    if (date) {
      this.props.history.push({
        pathname: 'search-list',
        search: `?page=1&radio=${e}&date=${date}`,
      });
    } else this.props.history.push({ pathname: 'search-list', search: `?page=1&radio=${e}` });
  }

  getTimeInAudio(value) {
    if (value >= 3600) {
      const h = value / 3600;
      const m = (value % 3600) / 60;
      const s = (value % 3600) % 60;
      return `${Math.trunc(h)}:${Math.trunc(m)}:${s}`;
    }
    const m = value / 60;
    const s = value % 60;
    return `${Math.trunc(m)}:${s}`;
  }

  render() {
    const {
      list: { list },
      loading,
      form,
    } = this.props;
    const { getFieldDecorator } = form;
    const { dataFilter, dataList, dataDuration } = this.state;
    const CardInfo = ({ activeUser, newUser }) => (
      <div className={styles.cardInfo}>
        <div>
          <p>活跃用户</p>
          <p>{activeUser}</p>
        </div>
        <div>
          <p>新增用户</p>
          <p>{newUser}</p>
        </div>
      </div>
    );
    const formItemLayout = {
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    const itemMenu = (
      <Menu>
        <Menu.Item>
          <a target="_blank" rel="noopener noreferrer" href="https://www.alipay.com/">
            1st menu item
          </a>
        </Menu.Item>
        <Menu.Item>
          <a target="_blank" rel="noopener noreferrer" href="https://www.taobao.com/">
            2nd menu item
          </a>
        </Menu.Item>
        <Menu.Item>
          <a target="_blank" rel="noopener noreferrer" href="https://www.tmall.com/">
            3d menu item
          </a>
        </Menu.Item>
      </Menu>
    );
    let paginationProps = {
      pageSize: 4,
      hideOnSinglePage: true,
      total: dataFilter ? dataFilter.length : dataList.length,
      current: Number(this.props.location.query.page),
      onChange: (v1, v2) => this.handleChangePagination(v1, v2),
    };
    const timeCreate = new Date(new Date().getTime());
    const stringTime = `${`${timeCreate.getDate()}`}/${`${timeCreate.getMonth() +
      1}`}/${timeCreate.getFullYear()}`;
    return (
      <div style={{ marginTop: '20px' }} className={`${styles.filterCardList} ${styles.container}`}>
        <div className={styles.search} style={{ textAlign: 'center' }}>
          <Input.Search
            placeholder="Tìm kiếm người bạn"
            enterButton="Tìm"
            size="large"
            onSearch={this.handleFormSubmit}
          />
        </div>
        <Card bordered={false}>
          <Form layout="inline" className="form-search-list">
            <Row>
              <Col lg={12} md={12} sm={12} xs={12}>
                <FormItem style={{ display: 'block' }} label="Theo ngày">
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
                </FormItem>
              </Col>
              <Col lg={12} md={12} sm={12} xs={12}>
                <FormItem style={{ display: 'block' }} label="Theo nhà đài">
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
                </FormItem>
              </Col>
            </Row>
          </Form>
        </Card>
        {!this.props.loadingPage ? (
          <List
            rowKey="id"
            style={{ marginTop: 24 }}
            grid={{ gutter: 24, xl: 4, lg: 3, md: 3, sm: 2, xs: 1 }}
            dataSource={dataFilter ? dataFilter : dataList}
            pagination={paginationProps}
            renderItem={item => (
              <List.Item key={item.id}>
                <Link
                  to={`detail-list?page=1&radio=${item.local}&date=${moment(item.date)
                    .format('D/M/YYYY')
                    .replace(/\//g, '_')}`}
                >
                  <Card
                    onMouseMove={e =>
                      this.handleMouseMove(
                        e,
                        `tua-${item.audio}`,
                        item.audio,
                        Math.trunc(dataDuration[`${item.audio}`])
                      )
                    }
                    className={styles.abc}
                    hoverable
                    bodyStyle={{ paddingBottom: 30 }}
                    actions={[
                      <Tooltip title="下载">
                        <Icon type="download" />
                      </Tooltip>,
                      <Tooltip
                        // onClick={() => this.handleClickAudio(`${item.audio}`,dataDuration[`${item.audio}`])}
                        onClick={() =>
                          this.handleClickAudio(
                            item.audio,
                            Math.trunc(dataDuration[`${item.audio}`])
                          )
                        }
                        title={
                          !this.state[`audio-${item.audio}`]
                            ? 'Play'
                            : this.state[`audio-${item.audio}`].paused
                            ? 'Play'
                            : 'Pause'
                        }
                      >
                        <Icon
                          type={
                            !this.state[`audio-${item.audio}`]
                              ? 'play-circle'
                              : this.state[`audio-${item.audio}`].paused
                              ? 'play-circle'
                              : 'pause-circle'
                          }
                        />
                      </Tooltip>,
                      <Tooltip title="分享">
                        <Icon type="share-alt" />
                      </Tooltip>,
                      <Dropdown overlay={itemMenu}>
                        <Icon type="ellipsis" />
                      </Dropdown>,
                    ]}
                  >
                    <Card.Meta
                      avatar={<Avatar size="small" src={item.avatar} />}
                      title={item.title}
                    />
                    <div className={styles.cardItemContent}>
                      <div style={{ paddingBottom: '10px' }}>
                        <p>MC: {item.mc}</p>
                        <span style={{ display: 'block' }}>
                          Đài phát: {item.local === 'HN' ? 'Hà Nội' : 'Hồ Chí Minh'}
                        </span>
                        <span>Ngày phát: {moment(item.date).format('DD/MM/YYYY')}</span>
                      </div>
                      <div id={`time-${item.audio}`} className={styles['time-audio']}>
                        <div className={styles['time-in-audio']}>
                          {this.state[`timming-${item.audio}`]
                            ? this.getTimeInAudio(Math.trunc(this.state[`timming-${item.audio}`]))
                            : `0:0`}
                        </div>
                        <div className={styles['time-in-audio']}>
                          {this.getTimeInAudio(Math.trunc(dataDuration[`${item.audio}`]))}
                        </div>
                      </div>
                      {this.state[`dot-${item.audio}`] && (
                        <div
                          className={styles['dot-tua']}
                          style={{
                            marginLeft: `${(this.state[`timming-${item.audio}`] * 100) /
                              Math.trunc(dataDuration[`${item.audio}`]) -
                              2}%`,
                          }}
                        />
                      )}
                      <div
                        id={`tua-${item.audio}`}
                        className={styles['border-tua']}
                        onClick={e =>
                          this.handleClickSlideBarAudio(
                            e,
                            `tua-${item.audio}`,
                            item.audio,
                            Math.trunc(dataDuration[`${item.audio}`])
                          )
                        }
                        onMouseUp={e => this.handleMouseUp(e, `tua-${item.audio}`, item.audio)}
                        onMouseDown={e => this.handleMouseDown(e, `tua-${item.audio}`, item.audio)}
                      />
                      <audio
                        controls
                        type="audio/mpeg"
                        style={{ display: 'none' }}
                        id={item.audio}
                        src={`http://35.192.153.201:8080/upload/audio/local/${item.audio}`}
                      />
                      <div
                        style={
                          this.state[`playing-${item.audio}`] === `${item.audio}`
                            ? {
                                width: `${(this.state[`timming-${item.audio}`] * 100) /
                                  Math.trunc(dataDuration[`${item.audio}`])}%`,
                              }
                            : {}
                        }
                        className={styles['border-audio']}
                      />
                    </div>
                  </Card>
                </Link>
              </List.Item>
            )}
          />
        ) : (
          <div className={styles.container}>
            <div className={styles.row}>
              <div className={styles['card-loading']}>
                <div className={styles['card-border']}>
                  <Skeleton paragraph={{ rows: 4 }} />
                </div>
              </div>
              <div className={styles['card-loading']}>
                <div className={styles['card-border']}>
                  <Skeleton paragraph={{ rows: 4 }} />
                </div>
              </div>
              <div className={styles['card-loading']}>
                <div className={styles['card-border']}>
                  <Skeleton paragraph={{ rows: 4 }} />
                </div>
              </div>
              <div className={styles['card-loading']}>
                <div className={styles['card-border']}>
                  <Skeleton paragraph={{ rows: 4 }} />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default FilterCardList;
