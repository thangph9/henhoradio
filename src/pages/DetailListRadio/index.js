import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { DatePicker, Select, Pagination } from 'antd';
import PageLoading from '@/components/PageLoading';
import { Redirect } from 'react-router-dom';
import moment from 'moment';
import HHRFooter from '@/layouts/HHRFooter';
import CardItem from './CardItem';
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

@connect(({ authentication, members, list }) => ({
  authentication,
  members,
  list,
}))
class ListRadio extends PureComponent {
  state = {
    loadingPage: true,
    loading: true,
    data: [],
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'list/fetchPublicDataAPI',
    });
    dispatch({
      type: 'authentication/getusercare',
    });
  }

  componentWillReceiveProps(nextProps) {
    const {
      list: { data },
    } = this.props;
    const { list } = nextProps;
    if (data !== list.data) {
      this.setState({
        data: list.data,
        loadingPage: false,
      });
    }
    this.setState({
      loading: true,
    });
    setTimeout(() => {
      this.setState({
        loading: false,
      });
    }, 150);
  }

  onChangeDate(value1, value2) {
    const {
      location: { query },
      history,
    } = this.props;
    const { radio, sort, gender } = query;
    let path = {};
    if (value2 === '') {
      if (sort) {
        path = {
          pathname: '/home/detail-list',
          search: `?page=1&radio=${radio}&gender=${gender}&sort=${sort}`,
        };
      } else {
        path = {
          pathname: '/home/detail-list',
          search: `?page=1&radio=${radio}&gender=${gender}`,
        };
      }
    } else if (sort) {
      path = {
        pathname: '/home/detail-list',
        search: `?page=1&radio=${radio}&gender=${gender}&sort=${sort}&date=${value2.replace(
          /\//g,
          '_'
        )}`,
      };
    } else {
      path = {
        pathname: '/home/detail-list',
        search: `?page=1&radio=${radio}&gender=${gender}&date=${value2.replace(/\//g, '_')}`,
      };
    }
    history.push(path);
  }

  //---------------------------------

  handleChangeCare = (value, careItem) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'authentication/changecare',
      payload: {
        userid: value.membersid.replace(/-/g, ''),
        care: !careItem,
        type: 'member',
        address: value.address,
        location: value.location,
        created: value.created,
        timeup: value.timeup,
        name: value.name,
        gender: value.gender,
        user_id: value.membersid,
      },
    });
  };

  handleChangeGender(e) {
    const {
      location: { query },
      history,
    } = this.props;
    query.gender = e;
    history.push(locationGenerate(query, 1));
  }

  handleChangeSort(e) {
    const {
      location: { query },
      history,
    } = this.props;
    const { page } = query;
    query.sort = e;
    history.push(locationGenerate(query, page));
  }

  handleChangeRadio(e) {
    const {
      location: { query },
      history,
    } = this.props;
    const { page } = query;
    query.radio = e;
    history.push(locationGenerate(query, page));
  }

  handleChangePagination(v1, v2) {
    window.scrollTo(0, 0);
    const {
      location: { query },
      history,
    } = this.props;

    history.push(locationGenerate(query, v1));
    console.log(v2);
  }

  render() {
    const {
      location: { search, query },
      authentication: { getusercare },
    } = this.props;
    if (search === '') {
      return (
        <Redirect to={{ pathname: '/home/detail-list', search: '?page=1&radio=ALL&gender=ALL' }} />
      );
    }
    const { loadingPage, data, loading } = this.state;
    const { radio, gender, sort, page, date } = query;

    let listMember = data.filter(e => {
      if (radio === 'ALL') return e;
      if (radio === 'VALID') return e.id !== undefined;
      return e.location === radio;
    });
    listMember = listMember.filter(e => {
      if (gender === 'ALL') return e;
      return e.gender.toUpperCase() === gender.toUpperCase();
    });
    const defaultSort = listMember;
    if (sort === 'newest') {
      listMember.sort((e, f) => {
        console.log(e.created, f.created);
        return 1;
      });
    }
    if (sort === 'special') {
      console.log(sort);
    }
    if (sort === 'default') {
      listMember = defaultSort;
    }

    const actions = {
      handleChangeCare: this.handleChangeCare,
    };
    // console.log(page, getusercare);

    if (!loadingPage) {
      return (
        <div className={styles['detail-list-page']} style={{ background: '#f3f5f9' }}>
          <div className={styles.container}>
            <div className={styles['filter-data']}>
              <div className={`${styles['filter-date']} ${styles['item-filter']}`}>
                {date ? (
                  <DatePicker
                    defaultValue={moment(date.replace(/_/g, '/'), dateFormat)}
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
              <div className={`${styles['filter-sort']} ${styles['item-filter']}`}>
                <Select
                  value={sort && `${sort}`}
                  onChange={e => this.handleChangeSort(e)}
                  placeholder="Sắp xếp"
                >
                  <Option value="default">Mặc định</Option>
                  <Option value="newest">Mới nhất</Option>
                  <Option value="special">Đặc biệt nhất</Option>
                </Select>
              </div>
            </div>
            {loading && <PageLoading />}
            <div className={styles.row}>
              {listMember.length > 0 &&
                !loading &&
                listMember.map(v => {
                  let find = [];
                  let logs = false;
                  if (getusercare) {
                    find = getusercare.filter(k => k.user_id === v.membersid);
                    logs = find && find.length > 0;
                  }
                  return <CardItem key={v.membersid} item={v} isCare={logs} {...actions} />;
                })}
            </div>
            {page > 1 && (
              <Pagination
                style={{
                  padding: '5px',
                  display: 'table',
                  margin: '0 auto',
                  marginTop: '30px',
                  marginBottom: '20px',
                }}
                onChange={(v1, v2) => this.handleChangePagination(v1, v2)}
                defaultCurrent={Number(page)}
                pageSize={20}
                total={data.length}
              />
            )}
          </div>
        </div>
      );
    }
    return (
      <div>
        <PageLoading />
        <div style={{ marginTop: '1000px' }} className={styles.footer}>
          <HHRFooter />
        </div>
      </div>
    );
  }
}

export default ListRadio;
