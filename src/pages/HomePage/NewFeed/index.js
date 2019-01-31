/* eslint-disable no-plusplus */
/* eslint-disable jsx-a11y/heading-has-content */
/* eslint-disable vars-on-top */
/* eslint-disable react/jsx-first-prop-new-line */
/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable no-unused-expressions */
/* eslint-disable react/sort-comp */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/no-unused-state */
/* eslint-disable no-undef */
/* eslint-disable react/prefer-stateless-function */
/* eslint-disable react/button-has-type */
/* eslint-disable eqeqeq */
/* eslint-disable no-redeclare */
/* eslint-disable react/jsx-props-no-multi-spaces */
/* eslint-disable camelcase */
/* eslint-disable no-var */
/* eslint-disable no-useless-escape */
/* eslint-disable one-var */
/* eslint-disable prefer-template */
/* eslint-disable react/no-array-index-key */
/* eslint-disable arrow-body-style */
/* eslint-disable no-unneeded-ternary */
/* eslint-disable no-else-return */
/* eslint-disable prefer-const */
/* eslint-disable lines-between-class-members */
/* eslint-disable react/no-multi-comp */
/* eslint-disable react/jsx-max-props-per-line */
/* eslint-disable react/jsx-indent-props */
/* eslint-disable react/jsx-closing-bracket-location */
/* eslint-disable react/self-closing-comp */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/label-has-for */
/* eslint-disable react/jsx-curly-brace-presence */
/* eslint-disable react/jsx-no-undef */
/* eslint-disable react/jsx-closing-tag-location */
/* eslint-disable react/jsx-indent */
/* eslint-disable dot-notation */
/* eslint-disable no-unused-vars */
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Link, Redirect } from 'react-router-dom';
import moment from 'moment';
import { formatMessage, FormattedMessage } from 'umi/locale';
import { Skeleton, Switch, List, Avatar, Icon, Card } from 'antd';
import styles from '../index.less';

const listData = [];
for (let i = 0; i < 3; i++) {
  listData.push({
    href: 'http://ant.design',
    title: `ant design part ${i}`,
    avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
    description:
      'Ant Design, a design language for background applications, is refined by Ant UED Team.',
    content:
      'We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product prototypes beautifully and efficiently.',
  });
}
const { Meta } = Card;
const IconText = ({ type, text }) => (
  <span>
    <Icon type={type} style={{ marginRight: 8 }} />
    {text}
  </span>
);
@connect(({ list, user }) => ({
  list,
  user,
}))
class NewFeed extends PureComponent {
  render() {
    return (
      <div className={styles['jsx-157584619'] + ' ' + styles['content']}>
        <div className={styles['jsx-3523037850'] + ' ' + styles['container']}>
          <div className={styles['jsx-3523037850'] + ' ' + styles['row']}>
            <div className={styles['col-3']}>
              <Card
                hoverable
                style={{ width: '100%', borderRadius: '5px' }}
                cover={
                  <img
                    alt="example"
                    src="https://twoo03-a.akamaihd.net/c/c1584f35e457ddcee431e92ff87bba05_1_5_0_612_612_215_215_0006475337.jpg"
                  />
                }
              >
                <Meta title="Trân 26 tuổi" description="Phan Rang, Bát Tràng" />
              </Card>
            </div>
            <div className={styles['col-3']}>
              <Card
                hoverable
                style={{ width: '100%', borderRadius: '5px' }}
                cover={
                  <img
                    alt="example"
                    src="https://twoo03-a.akamaihd.net/c/c1584f35e457ddcee431e92ff87bba05_1_5_0_612_612_215_215_0006475337.jpg"
                  />
                }
              >
                <Meta title="Trân 26 tuổi" description="Phan Rang, Bát Tràng" />
              </Card>
            </div>
            <div className={styles['col-3']}>
              <Card
                hoverable
                style={{ width: '100%', borderRadius: '5px' }}
                cover={
                  <img
                    alt="example"
                    src="https://twoo03-a.akamaihd.net/c/c1584f35e457ddcee431e92ff87bba05_1_5_0_612_612_215_215_0006475337.jpg"
                  />
                }
              >
                <Meta title="Trân 26 tuổi" description="Phan Rang, Bát Tràng" />
              </Card>
            </div>
            <div className={styles['col-3']}>
              <Card
                hoverable
                style={{ width: '100%', borderRadius: '5px' }}
                cover={
                  <img
                    alt="example"
                    src="https://twoo03-a.akamaihd.net/c/c1584f35e457ddcee431e92ff87bba05_1_5_0_612_612_215_215_0006475337.jpg"
                  />
                }
              >
                <Meta title="Trân 26 tuổi" description="Phan Rang, Bát Tràng" />
              </Card>
            </div>
            <div className={styles['col-3']}>
              <Card
                hoverable
                style={{ width: '100%', borderRadius: '5px' }}
                cover={
                  <img
                    alt="example"
                    src="https://twoo03-a.akamaihd.net/c/c1584f35e457ddcee431e92ff87bba05_1_5_0_612_612_215_215_0006475337.jpg"
                  />
                }
              >
                <Meta title="Trân 26 tuổi" description="Phan Rang, Bát Tràng" />
              </Card>
            </div>
            <div className={styles['col-3']}>
              <Card
                hoverable
                style={{ width: '100%', borderRadius: '5px' }}
                cover={
                  <img
                    alt="example"
                    src="https://twoo03-a.akamaihd.net/c/c1584f35e457ddcee431e92ff87bba05_1_5_0_612_612_215_215_0006475337.jpg"
                  />
                }
              >
                <Meta title="Trân 26 tuổi" description="Phan Rang, Bát Tràng" />
              </Card>
            </div>
            <div className={styles['col-3']}>
              <Card
                hoverable
                style={{ width: '100%', borderRadius: '5px' }}
                cover={
                  <img
                    alt="example"
                    src="https://twoo03-a.akamaihd.net/c/c1584f35e457ddcee431e92ff87bba05_1_5_0_612_612_215_215_0006475337.jpg"
                  />
                }
              >
                <Meta title="Trân 26 tuổi" description="Phan Rang, Bát Tràng" />
              </Card>
            </div>
            <div className={styles['col-3']}>
              <Card
                hoverable
                style={{ width: '100%', borderRadius: '5px' }}
                cover={
                  <img
                    alt="example"
                    src="https://twoo03-a.akamaihd.net/c/c1584f35e457ddcee431e92ff87bba05_1_5_0_612_612_215_215_0006475337.jpg"
                  />
                }
              >
                <Meta title="Trân 26 tuổi" description="Phan Rang, Bát Tràng" />
              </Card>
            </div>
            <div className={styles['col-3']}>
              <Card
                hoverable
                style={{ width: '100%', borderRadius: '5px' }}
                cover={
                  <img
                    alt="example"
                    src="https://twoo03-a.akamaihd.net/c/c1584f35e457ddcee431e92ff87bba05_1_5_0_612_612_215_215_0006475337.jpg"
                  />
                }
              >
                <Meta title="Trân 26 tuổi" description="Phan Rang, Bát Tràng" />
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default NewFeed;
