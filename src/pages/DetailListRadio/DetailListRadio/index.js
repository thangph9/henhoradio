import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { DatePicker, Select, Pagination, Row, Col } from 'antd';

import { Redirect } from 'react-router-dom';
import moment from 'moment';
// import HHRFooter from '@/layouts/HHRFooter';
import CardItem from './CardItem';
import PageLoading from '@/components/PageLoading';
import DataNotFound from './DataNotFound';
import HeaderTip from './HeaderTipContent';
import styles from './index.less';

const dateFormat = 'DD/MM/YYYY';
const { Option } = Select;

function locationGenerate(query, v1) {
  const { date, gender, sort, radio } = query;
  let path = {};
  if (date) {
    if (sort) {
      path = {
        pathname: `/home/detail-list`,
        search: `?page=${v1}&radio=${radio}&gender=${gender}&sort=${sort}&date=${date}`,
      };
    } else {
      path = {
        pathname: `/home/detail-list`,
        search: `?page=${v1}&radio=${radio}&gender=${gender}&date=${date}`,
      };
    }
  } else if (sort) {
    path = {
      pathname: `/home/detail-list`,
      search: `?page=${v1}&radio=${radio}&gender=${gender}&sort=${sort}`,
    };
  } else {
    path = {
      pathname: `/home/detail-list`,
      search: `?page=${v1}&radio=${radio}&gender=${gender}`,
    };
  }
  return path;
}
function QueryStringToJSON(location) {
  const pairs = location.search.slice(1).split('&');

  const result = {};
  pairs.forEach(e => {
    const pair = e.split('=');
    result[pair[0]] = decodeURIComponent(pair[1] || '');
  });

  return JSON.parse(JSON.stringify(result));
}

@connect(({ authentication, members, list }) => ({
  authentication,
  members,
  list,
}))
class ListRadio extends PureComponent {
  state = {
    loadingPage: true,
    loading: true,
    care: {},
    data: {
      list: [],
      pagination: {},
    },
  };

  componentDidMount() {
    const { dispatch, location } = this.props;
    this.setState({
      loading: true,
    });
    dispatch({
      type: 'list/fetchPublicDataAPI',
      payload: QueryStringToJSON(location),
    });
    /*
    dispatch({
      type: 'authentication/getusercare',
    });
    */
  }

  componentWillReceiveProps(nextProps) {
    const {
      list: { data },
      authentication: { changeCare },
    } = this.props;
    const { list, authentication } = nextProps;
    if (data !== list.data) {
      this.setState({
        data: list.data,
        loadingPage: false,
      });
      setTimeout(() => {
        this.setState({
          loading: false,
        });
      }, 150);
    }
    if (authentication.changeCare !== changeCare) {
      data.list.forEach(e => {
        if (e.membersid === authentication.changeCare.membersid) {
          e.isCare = authentication.changeCare.care;
        }
      });
      this.setState({
        data,
        care: authentication.changeCare,
      });
    }
    //  console.log(authentication.changeCare);
  }

  onChangeDate(value1, value2) {
    const {
      dispatch,
      location: { query },
      history,
    } = this.props;
    query.date = value2.replace(/\//g, '_');
    this.setState({
      loading: true,
    });
    dispatch({
      type: 'list/fetchPublicDataAPI',
      payload: query,
    });
    history.push(locationGenerate(query, 1));
  }

  //---------------------------------

  handleChangeCare = (value, careItem) => {
    const { dispatch } = this.props;
    // console.log(value);
    dispatch({
      type: 'authentication/changecare',
      payload: {
        membersid: value.membersid,
        care: !careItem,
        type: value.id ? 'user' : 'member',
      },
    });
  };

  handleChangeSort = e => {
    const {
      dispatch,
      location: { query },
      history,
    } = this.props;
    query.sort = e;
    this.setState({
      loading: true,
    });
    dispatch({
      type: 'list/fetchPublicDataAPI',
      payload: query,
    });
    history.push(locationGenerate(query, 1));
  };

  handleChangeGender(e) {
    const {
      dispatch,
      location: { query },
      history,
    } = this.props;
    query.gender = e;
    this.setState({
      loading: true,
    });
    dispatch({
      type: 'list/fetchPublicDataAPI',
      payload: query,
    });
    history.push(locationGenerate(query, 1));
  }

  handleChangeRadio(e) {
    const {
      dispatch,
      location: { query },
      history,
    } = this.props;
    query.radio = e;
    this.setState({
      loading: true,
    });
    dispatch({
      type: 'list/fetchPublicDataAPI',
      payload: query,
    });
    history.push(locationGenerate(query, 1));
  }

  handleChangePagination(v1, v2) {
    window.scrollTo(0, 0);
    const {
      dispatch,
      location: { query },
      history,
    } = this.props;
    query.page = v1;
    this.setState({
      loading: true,
    });
    dispatch({
      type: 'list/fetchPublicDataAPI',
      payload: query,
    });
    history.push(locationGenerate(query, v1));
    console.log(v2);
  }

  render() {
    const {
      location: { search, query },
    } = this.props;
    if (search === '') {
      return (
        <Redirect to={{ pathname: '/home/detail-list', search: '?page=1&radio=ALL&gender=ALL' }} />
      );
    }
    const { loadingPage, data, loading, care } = this.state;
    const { radio, gender, sort, date } = query;
    const actions = {
      handleChangeCare: this.handleChangeCare,
    };
    // console.log(page, getusercare);
    const listMember = data.list;
    const { pagination } = data;
    if (!loadingPage) {
      return (
        <div className={styles['detail-list-page']} style={{ background: '#f3f5f9' }}>
          <div className={styles.container}>
            <div className={styles['filter-data']}>
              <div className={`${styles['filter-date']} ${styles['item-filter']}`}>
                {date ? (
                  <DatePicker
                    defaultValue={moment(date.replace(/_/g, '/'), dateFormat)}
                    format="DD/MM/YYYY"
                    onChange={(e, v) => this.onChangeDate(e, v)}
                    placeholder="Lựa chọn"
                  />
                ) : (
                  <DatePicker
                    format="DD/MM/YYYY"
                    onChange={(e, v) => this.onChangeDate(e, v)}
                    placeholder="Lựa chọn"
                  />
                )}
              </div>
              <div className={`${styles['filter-radio']} ${styles['item-filter']}`}>
                <Select
                  value={radio ? `${radio}` : 'ALL'}
                  onChange={e => this.handleChangeRadio(e)}
                  placeholder="Lựa chọn"
                >
                  <Option value="HN">Hà Nội</Option>
                  <Option value="HCM">Hồ Chí Minh</Option>
                  <Option value="VALID">Chưa lên sóng</Option>
                  <Option value="ALL">Tất cả</Option>
                </Select>
              </div>
              <div className={`${styles['filter-gender']} ${styles['item-filter']}`}>
                <Select
                  value={gender ? `${gender}` : 'ALL'}
                  onChange={e => this.handleChangeGender(e)}
                  placeholder="Lựa chọn"
                >
                  <Option value="MALE">Nam</Option>
                  <Option value="FEMALE">Nữ</Option>
                  <Option value="ALL">Nam {'&'} Nữ</Option>
                </Select>
              </div>
            </div>

            <div>
              {listMember.length > 0 && !loading && (
                <Row>
                  <Col md={12}>
                    <HeaderTip data={pagination} />
                  </Col>
                  <Col md={12} className={styles.screenDetection}>
                    <div className={styles.rightSide}>
                      <span>Sắp xếp</span>
                      <span style={{ display: 'block', width: '0.8em' }}> </span>
                      <Select
                        size="small"
                        value={sort ? `${sort}` : 'default'}
                        onChange={e => this.handleChangeSort(e)}
                        style={{ marginBottom: '0.5rem' }}
                      >
                        <Option value="default">Mặc định</Option>
                        <Option value="newest">Mới nhất</Option>
                      </Select>
                    </div>
                  </Col>
                </Row>
              )}
            </div>

            {loading && <PageLoading />}
            <div className={styles.row}>
              {listMember.length > 0 &&
                !loading &&
                listMember.map(v => (
                  <CardItem key={v.membersid} item={v} {...actions} care={care} />
                ))}
              {listMember.length === 0 && !loading && <DataNotFound />}
            </div>
            {listMember.length > 0 && !loading && (
              <Pagination
                style={{
                  padding: '5px',
                  display: 'table',
                  margin: '0 auto',
                  marginTop: '30px',
                  marginBottom: '20px',
                }}
                onChange={(v1, v2) => this.handleChangePagination(v1, v2)}
                defaultCurrent={pagination.current ? pagination.current : 1}
                pageSize={pagination.page ? pagination.page : 20}
                total={pagination.total ? pagination.total : 20}
              />
            )}
          </div>
        </div>
      );
    }
    return (
      <div>
        <PageLoading />
      </div>
    );
  }
}

export default ListRadio;
