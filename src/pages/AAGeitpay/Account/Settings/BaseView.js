import React, { Component, Fragment } from 'react';
import { formatMessage, FormattedMessage } from 'umi/locale';
import { Form, Input, Upload, Select, Button } from 'antd';
import { connect } from 'dva';
import AvatarView from '../../Component/Avatar';

import styles from './BaseView.less';
import GeographicView from './GeographicView';
import PhoneView from './PhoneView';
import user from '../../../../../public/user.png';
// import { getTimeDistance } from '@/utils/utils';

const FormItem = Form.Item;
const { Option } = Select;

const validatorGeographic = (rule, value, callback) => {
  const { province, city } = value;
  if (!province.key) {
    callback('Please input your province!');
  }
  if (!city.key) {
    callback('Please input your city!');
  }
  callback();
};

const validatorPhone = (rule, value, callback) => {
  const values = value.split('-');
  // if (!values[0]) {
  //   callback('Please input your area code!');
  // }
  // if (!values[1]) {
  //   callback('Please input your phone number!');
  // }
  callback();
};

@connect(({ user }) => ({
  currentUser: user.currentUser,
}))
@Form.create()
class BaseView extends Component {
  state = {
    fPhotourl: '',
  };

  componentDidMount() {
    // this.setBaseInfo();
  }

  setBaseInfo = () => {
    const { currentUser, form } = this.props;
    Object.keys(form.getFieldsValue()).forEach(key => {
      const obj = {};
      obj[key] = currentUser[key] || null;
      form.setFieldsValue(obj);
    });
  };

  getAvatarURL() {
    const { currentUser } = this.props;
    if (currentUser.avatar && currentUser.avatar !== 'null') {
      return currentUser.avatar;
    }
    return null;
  }

  handleSubmit = () => {
    const {
      dispatch,
      form,
      currentUser: { userid },
    } = this.props;
    const { fPhotourl } = this.state;
    dispatch({
      type: 'table/update',
      payload: {
        tradeCode: 'tuser.updateByPrimaryKeySelective',
        fPhotourl,
        fId: userid,
        fName: form.getFieldValue('name'),
        fTel: form.getFieldValue('phone'),
      },
      callback: () => {
        this.currentUser();
      },
    });
  };

  currentUser = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'user/fetchCurrent',
    });
  };

  handleAvatarChange = value => {
    this.setState({
      fPhotourl: value,
    });
  };

  getViewDom = ref => {
    this.view = ref;
  };

  render() {
    const {
      form: { getFieldDecorator },
      currentUser,
    } = this.props;

    const prefixSelector = getFieldDecorator('prefix', {
      initialValue: '86',
    })(
      <Select style={{ width: 70 }}>
        <Option value="86" selected>
          +86
        </Option>
      </Select>
    );

    return (
      <div className={styles.baseView} ref={this.getViewDom}>
        <div className={styles.left}>
          <Form layout="vertical" onSubmit={this.handleSubmit} hideRequiredMark>
            {/* <FormItem label={formatMessage({ id: 'app.settings.basic.email' })}>
              {getFieldDecorator('email', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'app.settings.basic.email-message' }, {}),
                  },
                ],
              })(<Input />)}
            </FormItem> */}
            <FormItem label={formatMessage({ id: 'app.settings.basic.nickname' })}>
              {getFieldDecorator('name', {
                initialValue: currentUser.name,
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'app.settings.basic.nickname-message' }, {}),
                  },
                ],
              })(<Input />)}
            </FormItem>
            {/* <FormItem label={formatMessage({ id: 'app.settings.basic.profile' })}>
              {getFieldDecorator('profile', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'app.settings.basic.profile-message' }, {}),
                  },
                ],
              })(
                <Input.TextArea
                  placeholder={formatMessage({ id: 'app.settings.basic.profile-placeholder' })}
                  rows={4}
                />
              )}
            </FormItem> */}
            {/* <FormItem label={formatMessage({ id: 'app.settings.basic.country' })}>
              {getFieldDecorator('country', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'app.settings.basic.country-message' }, {}),
                  },
                ],
              })(
                <Select style={{ maxWidth: 220 }}>
                  <Option value="China">中国</Option>
                </Select>
              )}
            </FormItem>
            <FormItem label={formatMessage({ id: 'app.settings.basic.geographic' })}>
              {getFieldDecorator('geographic', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'app.settings.basic.geographic-message' }, {}),
                  },
                  {
                    validator: validatorGeographic,
                  },
                ],
              })(<GeographicView />)}
            </FormItem>
            <FormItem label={formatMessage({ id: 'app.settings.basic.address' })}>
              {getFieldDecorator('address', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'app.settings.basic.address-message' }, {}),
                  },
                ],
              })(<Input />)}
            </FormItem> */}
            {/* <FormItem label={formatMessage({ id: 'app.settings.basic.phone' })}>
              {getFieldDecorator('phone', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'app.settings.basic.phone-message' }, {}),
                  },
                  { validator: validatorPhone },
                ],
              })(<PhoneView />)}
            </FormItem> */}
            <FormItem label={formatMessage({ id: 'app.settings.basic.phone' })}>
              {getFieldDecorator('phone', {
                initialValue: currentUser.phone,
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'app.settings.basic.phone-message' }, {}),
                  },
                  { validator: validatorPhone },
                ],
              })(<Input type="number" style={{ width: '100%' }} />)}
            </FormItem>
            <Button type="primary" onClick={this.handleSubmit}>
              <FormattedMessage
                id="app.settings.basic.update"
                defaultMessage="Update Information"
              />
            </Button>
          </Form>
        </div>
        <div className={styles.right}>
          <AvatarView avatar={this.getAvatarURL()||user} handleChange={this.handleAvatarChange} />
        </div>
      </div>
    );
  }
}

export default BaseView;
