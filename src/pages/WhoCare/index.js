/* eslint-disable react/react-in-jsx-scope */

import { PureComponent } from 'react';
import { connect } from 'dva';
import Link from 'umi/link';
import styles from './index.less';

@connect(({ list }) => ({
  list,
}))
class WhoCare extends PureComponent {
  render() {
    return (
      <div className={styles['who-care-page']}>
        <div className={styles.container}>
          <div className={styles['user-care-item']}>
            <div className={styles['title-care']}>
              <div className={styles.title} />
              <div className={styles.title}>Tên người dùng</div>
              <div className={styles.title}>Thời gian quan tâm</div>
              <div className={styles.title}>Trang cá nhân</div>
              <div className={styles.title}>Chỉnh sửa</div>
            </div>
            <div className={styles['content-info-item']}>
              <div className={styles.avatar}>
                <div
                  className={styles['avatar-user']}
                  style={{
                    backgroundImage:
                      'url(http://cdn.henhoradio.net/images/ft/0bfed19c-071d-4a16-90d5-037fd22ed912)',
                  }}
                />
              </div>
              <div className={styles['info-user']}>
                <div className={styles['more-info']}>Nguyễn Hữu Trí</div>
                <div className={styles['more-info']}>
                  <span className={styles['name-of-user']}>Hà Nội</span>
                  <span className={styles['age-of-user']}>21 tuổi</span>
                </div>
              </div>
              <div className={styles['info-user']}>
                <div className={styles['more-info']}>30/05/2019</div>
              </div>
              <div className={styles['info-user']}>
                <div className={styles['more-info']}>
                  <Link to="/home/other-profile?id=3233537c131040a597e2f2a7ab83de51">
                    Nguyễn Hữu Trí
                  </Link>
                </div>
              </div>
              <div className={styles['info-user']}>
                <div className={styles['more-info']}>
                  <span className={styles['delete-care']}>Bỏ quan tâm</span>
                </div>
              </div>
            </div>
            <div className={styles['content-info-item']}>
              <div className={styles.avatar}>
                <div
                  className={styles['avatar-user']}
                  style={{
                    backgroundImage:
                      'url(http://cdn.henhoradio.net/images/ft/0bfed19c-071d-4a16-90d5-037fd22ed912)',
                  }}
                />
              </div>
              <div className={styles['info-user']}>
                <div className={styles['more-info']}>Nguyễn Hữu Trí</div>
                <div className={styles['more-info']}>
                  <span className={styles['name-of-user']}>Hà Nội</span>
                  <span className={styles['age-of-user']}>21 tuổi</span>
                </div>
              </div>
              <div className={styles['info-user']}>
                <div className={styles['more-info']}>30/05/2019</div>
              </div>
              <div className={styles['info-user']}>
                <div className={styles['more-info']}>
                  <Link to="/home/other-profile?id=3233537c131040a597e2f2a7ab83de51">
                    Nguyễn Hữu Trí
                  </Link>
                </div>
              </div>
              <div className={styles['info-user']}>
                <div className={styles['more-info']}>
                  <span className={styles['delete-care']}>Bỏ quan tâm</span>
                </div>
              </div>
            </div>
            <div className={styles['content-info-item']}>
              <div className={styles.avatar}>
                <div
                  className={styles['avatar-user']}
                  style={{
                    backgroundImage:
                      'url(http://cdn.henhoradio.net/images/ft/0bfed19c-071d-4a16-90d5-037fd22ed912)',
                  }}
                />
              </div>
              <div className={styles['info-user']}>
                <div className={styles['more-info']}>Nguyễn Hữu Trí</div>
                <div className={styles['more-info']}>
                  <span className={styles['name-of-user']}>Hà Nội</span>
                  <span className={styles['age-of-user']}>21 tuổi</span>
                </div>
              </div>
              <div className={styles['info-user']}>
                <div className={styles['more-info']}>30/05/2019</div>
              </div>
              <div className={styles['info-user']}>
                <div className={styles['more-info']}>
                  <Link to="/home/other-profile?id=3233537c131040a597e2f2a7ab83de51">
                    Nguyễn Hữu Trí
                  </Link>
                </div>
              </div>
              <div className={styles['info-user']}>
                <div className={styles['more-info']}>
                  <span className={styles['delete-care']}>Bỏ quan tâm</span>
                </div>
              </div>
            </div>
            <div className={styles['content-info-item']}>
              <div className={styles.avatar}>
                <div
                  className={styles['avatar-user']}
                  style={{
                    backgroundImage:
                      'url(http://cdn.henhoradio.net/images/ft/0bfed19c-071d-4a16-90d5-037fd22ed912)',
                  }}
                />
              </div>
              <div className={styles['info-user']}>
                <div className={styles['more-info']}>Nguyễn Hữu Trí</div>
                <div className={styles['more-info']}>
                  <span className={styles['name-of-user']}>Hà Nội</span>
                  <span className={styles['age-of-user']}>21 tuổi</span>
                </div>
              </div>
              <div className={styles['info-user']}>
                <div className={styles['more-info']}>30/05/2019</div>
              </div>
              <div className={styles['info-user']}>
                <div className={styles['more-info']}>
                  <Link to="/home/other-profile?id=3233537c131040a597e2f2a7ab83de51">
                    Nguyễn Hữu Trí
                  </Link>
                </div>
              </div>
              <div className={styles['info-user']}>
                <div className={styles['more-info']}>
                  <span className={styles['delete-care']}>Bỏ quan tâm</span>
                </div>
              </div>
            </div>
            <div className={styles['content-info-item']}>
              <div className={styles.avatar}>
                <div
                  className={styles['avatar-user']}
                  style={{
                    backgroundImage:
                      'url(http://cdn.henhoradio.net/images/ft/0bfed19c-071d-4a16-90d5-037fd22ed912)',
                  }}
                />
              </div>
              <div className={styles['info-user']}>
                <div className={styles['more-info']}>Nguyễn Hữu Trí</div>
                <div className={styles['more-info']}>
                  <span className={styles['name-of-user']}>Hà Nội</span>
                  <span className={styles['age-of-user']}>21 tuổi</span>
                </div>
              </div>
              <div className={styles['info-user']}>
                <div className={styles['more-info']}>30/05/2019</div>
              </div>
              <div className={styles['info-user']}>
                <div className={styles['more-info']}>
                  <Link to="/home/other-profile?id=3233537c131040a597e2f2a7ab83de51">
                    Nguyễn Hữu Trí
                  </Link>
                </div>
              </div>
              <div className={styles['info-user']}>
                <div className={styles['more-info']}>
                  <span className={styles['delete-care']}>Bỏ quan tâm</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default WhoCare;
