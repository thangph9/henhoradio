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

@connect(({ list, loading }) => ({
  list,
  loading: loading.models.list,
}))
@Form.create({
  onValuesChange({ dispatch }, changedValues, allValues) {
    // 表单项变化时请求数据
    // eslint-disable-next-line
    console.log(changedValues, allValues);
    // 模拟查询表单生效
    dispatch({
      type: 'list/fetch',
      payload: {
        count: 8,
        widthResult: 0,
      },
    });
  },
})
class FilterCardList extends PureComponent {
  state = {
    globalPlay: undefined,
    audio: undefined,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'list/fetch',
      payload: {
        count: 12,
      },
    });
  }

  onChange(value) {
    console.log(value);
  }

  handleClickSlideBarAudio(e, v) {
    const tua = document.getElementById(v);
    if (this.state.audio) {
      this.state.audio.currentTime =
        (e.nativeEvent.offsetX / tua.offsetWidth) * this.state.audio.duration;
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
        [`duration-${value}`]: audio.duration,
        [`playing-${value}`]: value,
        globalPlay: value,
      },
      () => {
        const settime = setInterval(() => {
          this.setState({
            [`timming-${value}`]: audio.currentTime,
          });
          if (audio.currentTime === audio.duration) {
            this.setState({
              audio: undefined,
              [`duration-${value}`]: undefined,
              [`playing-${value}`]: undefined,
              [`timming-${value}`]: undefined,
              globalPlay: undefined,
            });
            clearInterval(settime);
          }
        }, 100);
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
      total: list.length,
    };
    const timeCreate = new Date(new Date().getTime());
    const stringTime = `${`0${timeCreate.getDate()}`.slice(-2)}-${`0${timeCreate.getMonth() +
      1}`.slice(-2)}-${timeCreate.getFullYear()}`;
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
          <Form layout="inline">
            <StandardFormRow title="Lựa chọn" block style={{ paddingBottom: 11 }}>
              <FormItem>
                {getFieldDecorator('category')(
                  <TagSelect expandable>
                    <TagSelect.Option value="cat1">Tag 1</TagSelect.Option>
                    <TagSelect.Option value="cat2">Tag 2</TagSelect.Option>
                    <TagSelect.Option value="cat3">Tag 3</TagSelect.Option>
                    <TagSelect.Option value="cat4">Tag 4</TagSelect.Option>
                    <TagSelect.Option value="cat5">Tag 5</TagSelect.Option>
                    <TagSelect.Option value="cat6">Tag 6</TagSelect.Option>
                    <TagSelect.Option value="cat7">Tag 7</TagSelect.Option>
                    <TagSelect.Option value="cat8">Tag 8</TagSelect.Option>
                    <TagSelect.Option value="cat9">Tag 9</TagSelect.Option>
                    <TagSelect.Option value="cat10">Tag 10</TagSelect.Option>
                    <TagSelect.Option value="cat11">Tag 11</TagSelect.Option>
                    <TagSelect.Option value="cat12">Tag 12</TagSelect.Option>
                  </TagSelect>
                )}
              </FormItem>
            </StandardFormRow>
            <StandardFormRow title="Phân loại" grid last>
              <Row gutter={16}>
                <Col lg={8} md={10} sm={10} xs={24}>
                  <FormItem {...formItemLayout} label="Theo ngày">
                    {getFieldDecorator('date', {})(
                      <DatePicker
                        format="DD-MM-YYYY"
                        onChange={e => this.onChange(e)}
                        placeholder={stringTime}
                      />
                    )}
                  </FormItem>
                </Col>
                <Col lg={8} md={10} sm={10} xs={24}>
                  <FormItem {...formItemLayout} label="Theo nhà đài ">
                    {getFieldDecorator('rate', {})(
                      <Select placeholder="Lựa chọn" style={{ maxWidth: 200, width: '100%' }}>
                        <Option value="hn">Hà Nội</Option>
                        <Option value="hcm">Hồ Chí Minh</Option>
                      </Select>
                    )}
                  </FormItem>
                </Col>
              </Row>
            </StandardFormRow>
          </Form>
        </Card>
        <List
          rowKey="id"
          style={{ marginTop: 24 }}
          grid={{ gutter: 24, xl: 4, lg: 3, md: 3, sm: 2, xs: 1 }}
          loading={loading}
          dataSource={list}
          pagination={paginationProps}
          renderItem={item => (
            <List.Item key={item.id}>
              <Card
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
                  <audio
                    style={{ display: 'none' }}
                    id={`audio-${item.audio}`}
                    controls
                    src={item.audio}
                  />
                  <CardInfo
                    activeUser={formatWan(item.activeUser)}
                    newUser={numeral(item.newUser).format('0,0')}
                  />
                  <div
                    id={`tua-${item.audio}`}
                    className={styles['border-tua']}
                    onClick={e => this.handleClickSlideBarAudio(e, `tua-${item.audio}`)}
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
