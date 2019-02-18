import React, { Component, Fragment } from 'react';
import Debounce from 'lodash-decorators/debounce';
import Bind from 'lodash-decorators/bind';
import { connect } from 'dva';
import {
  Button,
  Menu,
  Dropdown,
  Icon,
  Row,
  Col,
  Progress,
  Card,
  Badge,
  Table,
  Tooltip,
  Divider,
} from 'antd';
import DescriptionList from '@/components/DescriptionList';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './index.less';

const { Description } = DescriptionList;
const ButtonGroup = Button.Group;

const getWindowWidth = () => window.innerWidth || document.documentElement.clientWidth;

const menu = (
  <Menu>
    <Menu.Item key="1">选项一</Menu.Item>
    <Menu.Item key="2">选项二</Menu.Item>
    <Menu.Item key="3">选项三</Menu.Item>
  </Menu>
);

const action = (
  <Fragment>
    <ButtonGroup>
      <Button>操作</Button>
      <Button>操作</Button>
      <Dropdown overlay={menu} placement="bottomRight">
        <Button>
          <Icon type="ellipsis" />
        </Button>
      </Dropdown>
    </ButtonGroup>
    <Button type="primary">主操作</Button>
  </Fragment>
);

const extra = (
  <Row>
    <Col xs={24} sm={12}>
      <div className={styles.textSecondary}>状态</div>
      <div className={styles.heading}>待审批</div>
    </Col>
    <Col xs={24} sm={12}>
      <div className={styles.textSecondary}>订单金额</div>
      <div className={styles.heading}>¥ 568.08</div>
    </Col>
  </Row>
);

const description = (
  <DescriptionList className={styles.headerList} size="small" col="2">
    <Description term="Tên đăng nhập">0123456789</Description>
    <Description term="Giới tính">Nam</Description>
    <Description term="Ngày sinh">1997-07-07</Description>
    <Description term="Ngày đăng ký">2017-07-07</Description>
    <Description term="Địa chỉ">Hà Nội</Description>
  </DescriptionList>
);

const operationTabList = [
  {
    key: 'tab1',
    tab: '操作日志一',
  },
  {
    key: 'tab2',
    tab: '操作日志二',
  },
  {
    key: 'tab3',
    tab: '操作日志三',
  },
];

const columns = [
  {
    title: '操作类型',
    dataIndex: 'type',
    key: 'type',
  },
  {
    title: '操作人',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '执行结果',
    dataIndex: 'status',
    key: 'status',
    render: text =>
      text === 'agree' ? (
        <Badge status="success" text="成功" />
      ) : (
        <Badge status="error" text="驳回" />
      ),
  },
  {
    title: '操作时间',
    dataIndex: 'updatedAt',
    key: 'updatedAt',
  },
  {
    title: '备注',
    dataIndex: 'memo',
    key: 'memo',
  },
];

@connect(({ profile, loading }) => ({
  profile,
  loading: loading.effects['profile/fetchAdvanced'],
}))
class AdvancedProfile extends Component {
  state = {
    operationkey: 'tab1',
    stepDirection: 'horizontal',
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'profile/fetchAdvanced',
    });

    this.setStepDirection();
    window.addEventListener('resize', this.setStepDirection, { passive: true });
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.setStepDirection);
    this.setStepDirection.cancel();
  }

  onOperationTabChange = key => {
    this.setState({ operationkey: key });
  };

  @Bind()
  @Debounce(200)
  setStepDirection() {
    const { stepDirection } = this.state;
    const w = getWindowWidth();
    if (stepDirection !== 'vertical' && w <= 576) {
      this.setState({
        stepDirection: 'vertical',
      });
    } else if (stepDirection !== 'horizontal' && w > 576) {
      this.setState({
        stepDirection: 'horizontal',
      });
    }
  }

  render() {
    const { operationkey } = this.state;
    const { profile, loading } = this.props;
    const { advancedOperation1, advancedOperation2, advancedOperation3 } = profile;
    const contentList = {
      tab1: (
        <Table
          pagination={false}
          loading={loading}
          dataSource={advancedOperation1}
          columns={columns}
        />
      ),
      tab2: (
        <Table
          pagination={false}
          loading={loading}
          dataSource={advancedOperation2}
          columns={columns}
        />
      ),
      tab3: (
        <Table
          pagination={false}
          loading={loading}
          dataSource={advancedOperation3}
          columns={columns}
        />
      ),
    };

    return (
      <div className={styles.container}>
        <PageHeaderWrapper
          title="ID: 123456789"
          logo={
            <img alt="" src="https://gw.alipayobjects.com/zos/rmsportal/nxkuOJlFJuAUhzlMTCEe.png" />
          }
          action={action}
          content={description}
          extraContent={extra}
        >
          <Card title="Mức độ hoàn thiện thông tin" style={{ marginBottom: 24 }} bordered={false}>
            <Progress
              style={{ width: '50%', margin: '0 auto', display: 'table' }}
              percent={50}
              status="active"
            />
          </Card>
          <Card title="用户信息" style={{ marginBottom: 24 }} bordered={false}>
            <DescriptionList style={{ xmarginBottom: 24 }}>
              <Description term="用户姓名">付小小</Description>
              <Description term="会员卡号">32943898021309809423</Description>
              <Description term="身份证">3321944288191034921</Description>
              <Description term="联系方式">18112345678</Description>
              <Description term="联系地址">
                曲丽丽 18100000000 浙江省杭州市西湖区黄姑山路工专路交叉路口
              </Description>
            </DescriptionList>
            <DescriptionList style={{ marginBottom: 24 }} title="信息组">
              <Description term="某某数据">725</Description>
              <Description term="该数据更新时间">2017-08-08</Description>
              <Description>&nbsp;</Description>
              <Description
                term={
                  <span>
                    某某数据
                    <Tooltip title="数据说明">
                      <Icon
                        style={{ color: 'rgba(0, 0, 0, 0.43)', marginLeft: 4 }}
                        type="info-circle-o"
                      />
                    </Tooltip>
                  </span>
                }
              >
                725
              </Description>
              <Description term="该数据更新时间">2017-08-08</Description>
            </DescriptionList>
            <h4 style={{ marginBottom: 16 }}>信息组</h4>
            <Card type="inner" title="多层级信息组">
              <DescriptionList size="small" style={{ marginBottom: 16 }} title="组名称">
                <Description term="负责人">林东东</Description>
                <Description term="角色码">1234567</Description>
                <Description term="所属部门">XX公司 - YY部</Description>
                <Description term="过期时间">2017-08-08</Description>
                <Description term="描述">
                  这段描述很长很长很长很长很长很长很长很长很长很长很长很长很长很长...
                </Description>
              </DescriptionList>
              <Divider style={{ margin: '16px 0' }} />
              <DescriptionList size="small" style={{ marginBottom: 16 }} title="组名称" col="1">
                <Description term="学名">
                  Citrullus lanatus (Thunb.) Matsum. et
                  Nakai一年生蔓生藤本；茎、枝粗壮，具明显的棱。卷须较粗..
                </Description>
              </DescriptionList>
              <Divider style={{ margin: '16px 0' }} />
              <DescriptionList size="small" title="组名称">
                <Description term="负责人">付小小</Description>
                <Description term="角色码">1234568</Description>
              </DescriptionList>
            </Card>
          </Card>
          <Card title="用户近半年来电记录" style={{ marginBottom: 24 }} bordered={false}>
            <div className={styles.noData}>
              <Icon type="frown-o" />
              暂无数据
            </div>
          </Card>
          <Card
            className={styles.tabsCard}
            bordered={false}
            tabList={operationTabList}
            onTabChange={this.onOperationTabChange}
          >
            {contentList[operationkey]}
          </Card>
        </PageHeaderWrapper>
      </div>
    );
  }
}

export default AdvancedProfile;
