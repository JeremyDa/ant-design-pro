import React from 'react';
import { FormattedMessage } from 'umi/locale';
import { Button, Upload } from 'antd';
import url from '../../../../services/url';

import user from '../../../../../public/user.png';
import styles from './index.less';

// 头像组件 方便以后独立，增加裁剪之类的功能
class AvatarView extends React.Component {
  state = {
    fileDownloadUri: '',
  };

  constructor(props) {
    super(props);
    console.log('%o', props);

    this.state = {
      fileDownloadUri: props.avatar,
    };
  }

  onSuccess = file => {
    this.setState({
      fileDownloadUri: file.fileDownloadUri,
    });
    this.props.handleChange(file.fileDownloadUri);
  };

  render() {
    const { fileDownloadUri } = this.state;
    return (
      <div className={styles.baseView}>
        <div className={styles.avatar}>
          <img src={fileDownloadUri || user} alt="avatar" />
        </div>
        <Upload
          action={`${url}/uploadCasherImg`}
          onSuccess={this.onSuccess}
          showUploadList={false}
          fileDownloadUri={fileDownloadUri}
        >
          <div className={styles.button_view}>
            <Button icon="upload" style={{ textAlign: 'center' }}>
              <FormattedMessage
                id="app.settings.basic.change-avatar"
                defaultMessage="Change avatar"
              />
            </Button>
          </div>
        </Upload>
      </div>
    );
  }
}
export default AvatarView;
