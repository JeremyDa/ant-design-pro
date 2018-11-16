import React, { Component, Fragment } from 'react';
import { formatMessage, FormattedMessage } from 'umi/locale';
import { connect } from 'dva';
import { List,Form, Input, Tooltip, Icon, Cascader, Select, Row, Col, Checkbox, Button, AutoComplete,message } from 'antd';
import md5 from 'md5';
import WrappedModifyPassword from "../../Component/ModifyPassword";
// import { getTimeDistance } from '@/utils/utils';

const passwordStrength = {
  strong: (
    <font className="strong">
      <FormattedMessage id="app.settings.security.strong" defaultMessage="Strong" />
    </font>
  ),
  medium: (
    <font className="medium">
      <FormattedMessage id="app.settings.security.medium" defaultMessage="Medium" />
    </font>
  ),
  weak: (
    <font className="weak">
      <FormattedMessage id="app.settings.security.weak" defaultMessage="Weak" />
      Weak
    </font>
  ),
};

@connect(({ user }) => ({
  currentUser: user.currentUser,
}))
class SecurityView extends Component {

  state = {
    visible: false,
  }

  showConfig = (flag) => {
    this.setState({
      visible: !flag
    });
  }

  getData = () => [
    {
      title: formatMessage({ id: 'app.settings.security.password' }, {}),
      description: (
        <Fragment>
          {formatMessage({ id: 'app.settings.security.password-description' })}
          {passwordStrength.strong}
        </Fragment>
      ),
      actions: [
        <a onClick={() => this.showConfig(true)}>
          <FormattedMessage id="app.settings.security.modify" defaultMessage="Modify" />
        </a>,
      ],
    },
  ];

  
  submit = (values) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'table/fetch',
      payload: {
        tradeCode: 'login.user.modifyPassword',
        ...values,
        oldpassword: md5(values.oldpassword),
        password: md5(values.password),
      },
      callback: ()=>{
        // this.showConfig(false);
      },
      success: ()=>{
        message.success('密码修改成功');
        window.g_app._store.dispatch({
          type: 'login/logout',
        });
      },
    });
  }

  render() {
    const { visible } = this.state;
    
    return (
      <Fragment>
        {
          visible && 
          (<List
            itemLayout="horizontal"
            dataSource={this.getData()}
            renderItem={item => (
              <List.Item actions={item.actions}>
                <List.Item.Meta title={item.title} description={item.description} />
              </List.Item>
            )}
          />)
        }
        {
          !visible &&
          (
            <WrappedModifyPassword submit={this.submit} />
          )
        }
      </Fragment>
    );
  }
}

export default SecurityView;
