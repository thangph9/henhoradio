import React, { PureComponent } from 'react';
import moment from 'moment';
import { Icon, Popconfirm, Modal } from 'antd';

import ReactPlayer from 'react-player';
import styles from './index.less';

class CardItem extends PureComponent {
  state = {
    visiableInfo: false,
    playing: false,
  };

  handleChange = (value, careItem) => {
    // console.log(value)
    const { handleChangeCare } = this.props;
    handleChangeCare(value, careItem);
  };

  handleVisibleModal = () => {
    const { visiableInfo } = this.state;
    this.setState({
      visiableInfo: !visiableInfo,
    });
  };

  render() {
    const { item, isCare } = this.props;
    const v = item;
    const { visiableInfo, playing } = this.state;
    // const loadedPersent = loaded ? (loaded * 100) / duration : 0;

    // console.log("Is Care ",isCare);
    let caredStyle = styles['mc-btn-action'];
    let caredConfirm = <Icon type="bars" />;
    if (isCare) {
      caredStyle = `${styles['mc-btn-action']} ${styles.cared}`;
      caredConfirm = (
        <Popconfirm
          placement="topLeft"
          title="Bạn muốn bỏ quan tâm?"
          onConfirm={() => this.handleChange(v, true)}
          okText="Có"
          cancelText="Không"
        >
          <Icon type="star" theme="filled" />
        </Popconfirm>
      );
    } else {
      caredConfirm = localStorage.token ? (
        <Icon onClick={() => this.handleChange(v, false)} type="star" theme="filled" />
      ) : (
        <Icon type="bars" />
      );
    }

    const sex = {
      MALE: 'Nam',
      FEMALE: 'Nữ',
    };
    const relationship = {
      SINGLE: 'Độc thân',
    };
    const locationList = {
      HN: 'Hà nội',
      HCM: 'tp.HCM',
    };

    return (
      <div className={styles['cart-item']}>
        <article
          className={`${styles['material-card']} ${styles['mc-active']}`}
          onClick={() => this.handleVisibleModal()}
        >
          <h2>
            <span className={styles['span-title']}>{v.name}</span>
            <strong>
              <Icon style={{ paddingRight: '5px' }} type="clock-circle" theme="filled" />
              {moment(v.timeup).format('DD/MM/YYYY')}
            </strong>
          </h2>
          <div className={styles['mc-content']}>
            <div className={styles['img-container']} />

            <div className={styles['mc-description']}>
              <Modal title={v.name} visible={visiableInfo} footer={null}>
                <p>
                  Để kết bạn với <span className={styles.bold}>{v.name}</span> vui lòng soạn tin
                  theo cú pháp: <span className={styles.bold}>HHR</span>
                  <span className={styles.bold}>{v.gcode} </span>
                  Gửi <span className={styles.bold}>8779</span>.
                </p>
              </Modal>
              <div>
                <Icon style={{ paddingRight: '8px' }} type="home" />
                <span className={styles['span-discription']}>
                  Đài phát: {locationList[v.location]}
                </span>
              </div>
              <div>
                <Icon style={{ paddingRight: '8px' }} type="user" />
                <span className={styles['span-discription']}>Giới tính: {sex[v.gender]}</span>
              </div>
              <div>
                <Icon style={{ paddingRight: '8px' }} type="global" />
                <span className={styles['span-discription']}>Địa chỉ: {v.address}</span>
              </div>
              <div>
                <Icon style={{ paddingRight: '8px' }} type="smile" />
                <span className={styles['span-discription']}>
                  TT hôn nhân: {relationship[v.relationship]}
                </span>
              </div>
              <div>
                <Icon style={{ paddingRight: '8px' }} type="smile" />
                <span className={styles['span-discription']}>Mã số kết bạn: {v.gcode}</span>
              </div>
            </div>
          </div>
          <a className={caredStyle}>{caredConfirm}</a>
          <div className={styles['mc-footer']}>
            <div className={styles.range}>
              <div className={styles['range-item']} />
              <Icon type="backward" theme="filled" />
              <Icon theme="filled" />
              <Icon type="forward" theme="filled" />
            </div>
            <ReactPlayer
              playing={playing}
              width="0%"
              height="0%"
              url={`http://cdn.henhoradio.net/audio/track/${v.audio}`}
            />
          </div>
        </article>
      </div>
    );
  }
}
export default CardItem;
