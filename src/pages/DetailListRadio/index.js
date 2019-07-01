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

@connect(({ authentication, members }) => ({
  authentication,
  members,
  getusercare: authentication.getusercare,
}))
class ListRadio extends PureComponent {
  state = {
    loadingPage: true,
    detailList: [],
    arrFilter: ['', '', ''],
    dataUserCare: [],
  };

  componentWillMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'menu/getmenu',
      payload: 'HomePage',
    });
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'members/getmembers',
    });
    dispatch({
      type: 'authentication/getusercare',
    });
    const { arrFilter } = this.state;
    const {
      location: { query },
    } = this.props;
    const { radio, gender, date } = query;
    if (radio) {
      if (radio === 'ALL') {
        arrFilter[1] = '';
      } else arrFilter[1] = radio;
    }
    if (gender) {
      if (gender === 'ALL') {
        arrFilter[2] = '';
      } else arrFilter[2] = gender;
    }
    if (date) arrFilter[0] = date.replace(/_/g, '/');
  }

  componentWillReceiveProps(nextProps) {
    const {
      getusercare,
      members: { getmembers },
    } = this.props;
    const { members } = nextProps;
    const { arrFilter, detailList } = this.state;
    if (getmembers !== members.getmembers) {
      this.setState(
        {
          detailList: members.getmembers,
          loadingPage: false,
        },
        () => {
          if (arrFilter) {
            let dataArr = detailList;
            arrFilter.forEach((e, i) => {
              dataArr = dataArr.filter(value => {
                if (i === 0) {
                  const timeCreate = new Date(value.timeup);
                  const stringTime = `${`${timeCreate.getDate()}`}/${`${timeCreate.getMonth() +
                    1}`}/${timeCreate.getFullYear()}`;
                  return stringTime === arrFilter[0];
                }
                if (i === 1) {
                  return value.location === arrFilter[1];
                }
                return value.gender === arrFilter[2];
              });
            });
            this.setState({
              dataFilter: dataArr,
            });
          }
        }
      );
    }
    if (getusercare !== nextProps.getusercare) {
      this.setState({
        dataUserCare: nextProps.getusercare,
      });
    }
  }

  /*
   componentWillUpdate(nextProps, nextState) {
    
    const { arrFilter, detailList } = this.state;
       
    if (arrFilter !== nextState.arrFilter) {
      if (nextState.arrFilter) {
        let dataArr = detailList;
        nextState.arrFilter.forEach((e,i)=>{
              dataArr = dataArr.filter((value) => {
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
        })
        this.setState({
          dataFilter: dataArr,
        });
      }
    } 
  }
*/

  onChangeDate(value1, value2) {
    const { arrFilter } = this.state;
    const {
      location: { query },
      history,
    } = this.props;
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

  handleChangePagination(v1, v2) {
    console.log(v2);
    window.scrollTo(0, 0);
    const {
      location: { query },
      history,
    } = this.props;
    history.push(locationGenerate(query, v1));
  }

  handleChangeRadio(e) {
    const { arrFilter } = this.state;
    const {
      location: { query },
      history,
    } = this.props;
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
    const { gender, date, sort } = query;
    let path = {};
    if (date) {
      if (sort) {
        path = {
          pathname: '/home/detail-list',
          search: `?page=1&radio=${e}&gender=${gender}&sort=${sort}&date=${date}`,
        };
      } else {
        path = {
          pathname: '/home/detail-list',
          search: `?page=1&radio=${e}&gender=${gender}&date=${date}`,
        };
      }
    } else if (sort) {
      path = {
        pathname: '/home/detail-list',
        search: `?page=1&radio=${e}&gender=${gender}&sort=${sort}`,
      };
    } else {
      path = {
        pathname: '/home/detail-list',
        search: `?page=1&radio=${e}&gender=${gender}`,
      };
    }
    history.push(path);
  }

  handleChangeGender(e) {
    const { arrFilter } = this.state;
    const {
      location: { query },
      history,
    } = this.props;
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
    history.push(locationGenerate(query, 1));
  }

  handleChangeSort(e) {
    const {
      location: { query },
      history,
    } = this.props;
    const { radio, date, gender } = query;
    let path = {};
    if (date) {
      if (e !== 'default') {
        path = {
          pathname: '/home/detail-list',
          search: `?page=1&radio=${radio}&gender=${gender}&sort=${e}&date=${date}`,
        };
      } else {
        path = {
          pathname: '/home/detail-list',
          search: `?page=1&radio=${radio}&gender=${gender}&date=${date}`,
        };
      }
    } else if (e !== 'default') {
      path = {
        pathname: '/home/detail-list',
        search: `?page=1&radio=${radio}&gender=${gender}&sort=${e}`,
      };
    } else {
      path = {
        pathname: '/home/detail-list',
        search: `?page=1&radio=${radio}&gender=${gender}`,
      };
    }
    history.push(path);
  }

  render() {
    const {
      location: { search },
    } = this.props;
    if (search === '') {
      this.setState({
        arrFilter: ['', '', ''],
      });
      return (
        <Redirect to={{ pathname: '/home/detail-list', search: '?page=1&radio=ALL&gender=ALL' }} />
      );
    }
    const { loadingPage, detailList, dataFilter, dataUserCare } = this.state;
    const {
      location: { query },
    } = this.props;
    const { radio, gender, sort, page, date } = query;
    const listMember = (dataFilter || detailList)
      .filter((value, index) => index >= page * 20 - 20 && index < page * 20)
      .sort((a, b) => {
        if (sort === 'newest') {
          return new Date(b.timeup) - new Date(a.timeup);
        }
        return [];
      });
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
                  <Option value="ALL">Cả hai đài</Option>
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
            <div className={styles.row}>
              {listMember.length > 0 &&
                listMember.map(v => (
                  <CardItem key={v.membersid} item={v} dataUserCare={dataUserCare} />
                ))}
            </div>
            <Pagination
              style={{
                padding: '5px',
                display: 'table',
                margin: '0 auto',
                marginTop: '30px',
                marginBottom: '20px',
              }}
              onChange={(v1, v2) => this.handleChangePagination(v1, v2)}
              current={Number(page)}
              pageSize={20}
              total={dataFilter ? dataFilter.length : detailList.length}
            />
          </div>
          <div className={styles.footer}>
            <HHRFooter />
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
