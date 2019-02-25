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
import numeral from 'numeral';
import { connect } from 'dva';
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
} from 'antd';
import TagSelect from '@/components/TagSelect';
import StandardFormRow from '@/components/StandardFormRow';

import { formatWan } from '@/utils/utils';

import styles from './index.less';

const { Option } = Select;
const FormItem = Form.Item;
const dateFormat = 'DD/MM/YYYY';
@connect(({ list, loading }) => ({
  list,
  loading: loading.models.list,
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
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'list/tracklist',
      payload: {
        count: 8,
      },
    });
  }

  handleClickSlideBarAudio(e, v, v2) {
    const tua = document.getElementById(v);
    const audio = document.getElementById(v2);
    const offset = e.nativeEvent.offsetX;

    if (this.state.audio && this.state.globalPlay !== v2) {
      this.state.audio.pause();
    }
    if (audio.ended) {
      this.setState(
        {
          [`dot-${v2}`]: true,
          audio,
          globalPlay: v2,
        },
        () => {
          this.state.audio.play();
          this.state.audio.currentTime = (offset / tua.offsetWidth) * this.state.audio.duration;
          const settime = setInterval(() => {
            if (!this.state.width) {
              this.setState({
                [`timming-${v2}`]: audio.currentTime,
              });
            }
            if (audio.ended) {
              this.setState(
                {
                  audio: undefined,
                  [`dot-${v2}`]: undefined,
                  globalPlay: undefined,
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
    if (this.state.globalPlay && this.state.globalPlay === v2) {
      if (this.state.audio) {
        this.state.audio.currentTime = (offset / tua.offsetWidth) * this.state.audio.duration;
      }
    }
  }

  handleMouseUp(e, v, v2) {
    const tua = document.getElementById(v);

    if (this.state.audio) {
      this.setState({
        width: undefined,
      });
      this.state.audio.play();
    }
  }

  handleMouseMove(e, v, v2) {
    if (this.state.audio && this.state.width) {
      const tua = document.getElementById(v);
      const audio = document.getElementById(v2);
      const offset = e.nativeEvent.offsetX;
      this.setState({
        [`timming-${v2}`]: (offset / tua.offsetWidth) * audio.duration,
      });
    }
  }

  handleMouseDown(e, v, v2) {
    const offset = e.nativeEvent.offsetX;
    if (this.state.audio) {
      this.setState({
        width: offset,
      });
      this.state.audio.pause();
    }
  }

  handleClickAudio(value) {
    const audio = document.getElementById(value);

    if (this.state.audio && this.state.globalPlay !== value) {
      this.state.audio.pause();
    } else if (this.state.globalPlay) {
      this.setState(
        {
          globalPlay: undefined,
        },
        () => {
          audio.pause();
        }
      );
      return;
    }
    audio.play();
    this.setState(
      {
        audio,
        [`dot-${value}`]: true,
        [`duration-${value}`]: audio.duration,
        [`playing-${value}`]: value,
        globalPlay: value,
      },
      () => {
        const settime = setInterval(() => {
          if (!this.state.width) {
            this.setState({
              [`timming-${value}`]: audio.currentTime,
            });
          }
          if (audio.ended) {
            this.setState(
              {
                audio: undefined,
                [`dot-${value}`]: undefined,
                globalPlay: undefined,
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
      console.log(nextState.arrFilter);
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
        this.setState({
          loaded: true,
          dataList: nextProps.list.tracklist.data,
        });
      }
    }
  }

  loadMetaData(e) {}

  onChange(value1, value2) {
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
  }

  handleChangeRadio(e) {
    let arrFilter = this.state.arrFilter;
    console.log(e);
    if (e === 'ALL') {
      console.log('vao day');
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
  }

  render() {
    const {
      list: { list },
      loading,
      form,
    } = this.props;

    const { getFieldDecorator } = form;
    const { dataFilter, dataFilterDay, dataFilterRadio, dataList } = this.state;
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
    const paginationProps = {
      pageSize: 4,
      hideOnSinglePage: true,
      total: this.state.dataList.length,
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
                  {getFieldDecorator('date', {})(
                    <DatePicker
                      format="D/M/YYYY"
                      onChange={(e, v) => this.onChange(e, v)}
                      placeholder="Lựa chọn"
                    />
                  )}
                </FormItem>
              </Col>
              <Col lg={12} md={12} sm={12} xs={12}>
                <FormItem style={{ display: 'block' }} label="Theo nhà đài">
                  <Select
                    defaultValue="ALL"
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
        <List
          rowKey="id"
          style={{ marginTop: 24 }}
          grid={{ gutter: 24, xl: 4, lg: 3, md: 3, sm: 2, xs: 1 }}
          loading={loading}
          dataSource={dataFilter ? dataFilter : dataList}
          pagination={paginationProps}
          renderItem={item => (
            <List.Item key={item.id}>
              <Card
                onMouseMove={e =>
                  this.handleMouseMove(e, `tua-${item.audio}`, `audio-${item.audio}`)
                }
                className={styles.abc}
                hoverable
                bodyStyle={{ paddingBottom: 20 }}
                actions={[
                  <Tooltip title="下载">
                    <Icon type="download" />
                  </Tooltip>,
                  <Tooltip
                    onClick={() => this.handleClickAudio(`audio-${item.audio}`)}
                    title={this.state.globalPlay === `audio-${item.audio}` ? 'Pause' : 'Play'}
                  >
                    <Icon
                      type={
                        this.state.globalPlay === `audio-${item.audio}`
                          ? 'pause-circle'
                          : 'play-circle'
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
                <Card.Meta avatar={<Avatar size="small" src={item.avatar} />} title={item.title} />
                <div className={styles.cardItemContent}>
                  <div>
                    <div>
                      <p>MC: {item.mc}</p>
                    </div>
                    <div>
                      <p>Nội dung chính: {item.description}</p>
                    </div>
                  </div>

                  <div id={`time-${item.audio}`} className={styles['time-audio']}>
                    <div className={styles['time-in-audio']}>
                      {this.state[`timming-audio-${item.audio}`]
                        ? Math.trunc(this.state[`timming-audio-${item.audio}`])
                        : 0}
                    </div>
                    <div className={styles['time-in-audio']}>
                      {this.state[`audio-${item.audio}`] ? (
                        Math.trunc(this.state[`audio-${item.audio}`])
                      ) : (
                        <Icon style={{ color: '#38E4FF' }} type="loading" />
                      )}
                    </div>
                  </div>
                  {this.state[`dot-audio-${item.audio}`] && (
                    <div
                      className={styles['dot-tua']}
                      style={{
                        marginLeft: `${(this.state[`timming-audio-${item.audio}`] * 100) /
                          this.state[`duration-audio-${item.audio}`] -
                          2}%`,
                      }}
                    />
                  )}

                  <div
                    id={`tua-${item.audio}`}
                    className={styles['border-tua']}
                    onClick={e =>
                      this.handleClickSlideBarAudio(e, `tua-${item.audio}`, `audio-${item.audio}`)
                    }
                    onMouseUp={e =>
                      this.handleMouseUp(e, `tua-${item.audio}`, `audio-${item.audio}`)
                    }
                    onMouseDown={e =>
                      this.handleMouseDown(e, `tua-${item.audio}`, `audio-${item.audio}`)
                    }
                  />

                  <audio
                    preload="auto"
                    type="audio/mpeg"
                    style={{ display: 'none' }}
                    id={`audio-${item.audio}`}
                    onLoadedMetadata={e => this.loadMetaData(e)}
                    src={`/upload/audio/${item.audio}`}
                  />
                  <div
                    style={
                      this.state[`playing-audio-${item.audio}`] === `audio-${item.audio}`
                        ? {
                            width: `${(this.state[`timming-audio-${item.audio}`] * 100) /
                              this.state[`duration-audio-${item.audio}`]}%`,
                          }
                        : {}
                    }
                    className={styles['border-audio']}
                  />
                </div>
              </Card>
            </List.Item>
          )}
        />
      </div>
    );
  }
}

export default FilterCardList;
