import React, { PureComponent } from 'react';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Select,
  Icon,
  Button,
  Dropdown,
  Menu,
  InputNumber,
  DatePicker,
  Modal,
  message,
  Badge,
  Divider,
  Steps,
  Radio,
  Popconfirm,
  Checkbox,
  Switch,
  Slider,
  Rate,
  Upload,
  Timeline,
  notification,
  Progress,
} from 'antd';
import { connect } from 'dva';
import styles from './style.less';

const FormItem = Form.Item;
const Option = Select.Option;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

class NormalLoginForm extends React.Component {
  state = {
    size: 'large',
  };

  handleSizeChange = e => {
    this.setState({ size: e.target.value });
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  };

  normFile = e => {
    console.log('Upload event:', e);
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  render() {
    const { getFieldDecorator } = this.props.form;

    const size = this.state.size;

    const IconFont = Icon.createFromIconfontCN({
      scriptUrl: '//at.alicdn.com/t/font_8d5l8fzk5b87iudi.js',
    });

    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };

    const success = () => {
      message.success('This is a message of success');
    };

    const error = () => {
      message.error('This is a message of error');
    };

    const warning = () => {
      message.warning('This is message of warning');
    };

    const options = ['topLeft', 'topRight', 'bottomLeft', 'bottomRight'];
    const openNotification = () => {
      notification.open({
        message: 'Notification Title',
        description:
          'This is the content of the notification. This is the content of the notification. This is the content of the notification.',
      });
    };

    const text = 'Are you sure to delete this task?';

    function confirm() {
      message.info('Clicked on Yes.');
    }

    return (
      <div>
        <Card>
          <div className="demo">
            <div style={{ marginLeft: 70, whiteSpace: 'nowrap' }}>
              <Popconfirm
                placement="topLeft"
                title={text}
                onConfirm={confirm}
                okText="Yes"
                cancelText="No"
              >
                <Button>TL</Button>
              </Popconfirm>
              <Popconfirm
                placement="top"
                title={text}
                onConfirm={confirm}
                okText="Yes"
                cancelText="No"
              >
                <Button>Top</Button>
              </Popconfirm>
              <Popconfirm
                placement="topRight"
                title={text}
                onConfirm={confirm}
                okText="Yes"
                cancelText="No"
              >
                <Button>TR</Button>
              </Popconfirm>
            </div>
            <div style={{ width: 70, float: 'left' }}>
              <Popconfirm
                placement="leftTop"
                title={text}
                onConfirm={confirm}
                okText="Yes"
                cancelText="No"
              >
                <Button>LT</Button>
              </Popconfirm>
              <Popconfirm
                placement="left"
                title={text}
                onConfirm={confirm}
                okText="Yes"
                cancelText="No"
              >
                <Button>Left</Button>
              </Popconfirm>
              <Popconfirm
                placement="leftBottom"
                title={text}
                onConfirm={confirm}
                okText="Yes"
                cancelText="No"
              >
                <Button>LB</Button>
              </Popconfirm>
            </div>
            <div style={{ width: 70, marginLeft: 304 }}>
              <Popconfirm
                placement="rightTop"
                title={text}
                onConfirm={confirm}
                okText="Yes"
                cancelText="No"
              >
                <Button>RT</Button>
              </Popconfirm>
              <Popconfirm
                placement="right"
                title={text}
                onConfirm={confirm}
                okText="Yes"
                cancelText="No"
              >
                <Button>Right</Button>
              </Popconfirm>
              <Popconfirm
                placement="rightBottom"
                title={text}
                onConfirm={confirm}
                okText="Yes"
                cancelText="No"
              >
                <Button>RB</Button>
              </Popconfirm>
            </div>
            <div style={{ marginLeft: 70, clear: 'both', whiteSpace: 'nowrap' }}>
              <Popconfirm
                placement="bottomLeft"
                title={text}
                onConfirm={confirm}
                okText="Yes"
                cancelText="No"
              >
                <Button>BL</Button>
              </Popconfirm>
              <Popconfirm
                placement="bottom"
                title={text}
                onConfirm={confirm}
                okText="Yes"
                cancelText="No"
              >
                <Button>Bottom</Button>
              </Popconfirm>
              <Popconfirm
                placement="bottomRight"
                title={text}
                onConfirm={confirm}
                okText="Yes"
                cancelText="No"
              >
                <Button>BR</Button>
              </Popconfirm>
            </div>
          </div>
        </Card>
        <Card>
          <Progress percent={30} />
          <Progress percent={50} status="active" />
          <Progress percent={70} status="exception" />
          <Progress percent={100} />
          <Progress percent={50} showInfo={false} />
        </Card>
        <Card>
          <Select
            defaultValue="topRight"
            style={{ width: 120, marginRight: 10 }}
            onChange={val => {
              notification.config({
                placement: val,
              });
            }}
          >
            {options.map(val => (
              <Option key={val} value={val}>
                {val}
              </Option>
            ))}
          </Select>
          <Button type="primary" onClick={openNotification}>
            Open the notification box
          </Button>
        </Card>
        <Card>
          <Button onClick={success}>Success</Button>
          <Button onClick={error}>Error</Button>
          <Button onClick={warning}>Warning</Button>
        </Card>
        <Card>
          <Timeline mode="alternate">
            <Timeline.Item>Create a services site 2015-09-01</Timeline.Item>
            <Timeline.Item color="green">Solve initial network problems 2015-09-01</Timeline.Item>
            <Timeline.Item dot={<Icon type="clock-circle-o" style={{ fontSize: '16px' }} />}>
              Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque
              laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi
              architecto beatae vitae dicta sunt explicabo.
            </Timeline.Item>
            <Timeline.Item color="red">Network problems being solved 2015-09-01</Timeline.Item>
            <Timeline.Item>Create a services site 2015-09-01</Timeline.Item>
            <Timeline.Item dot={<Icon type="clock-circle-o" style={{ fontSize: '16px' }} />}>
              Technical testing 2015-09-01
            </Timeline.Item>
          </Timeline>
        </Card>
        <Card>
          <Button type="primary">Primary</Button>
          <Button>Default</Button>
          <Button type="dashed">Dashed</Button>
          <Button type="danger">Danger</Button>

          <br />

          <Button type="primary" shape="circle" icon="search" />
          <Button type="primary" icon="search">
            Search
          </Button>
          <Button shape="circle" icon="search" />
          <Button icon="search">Search</Button>
          <br />
          <Button shape="circle" icon="search" />
          <Button icon="search">Search</Button>
          <Button type="dashed" shape="circle" icon="search" />
          <Button type="dashed" icon="search">
            Search
          </Button>

          <br />
          <br />

          <Radio.Group value={size} onChange={this.handleSizeChange}>
            <Radio.Button value="large">Large</Radio.Button>
            <Radio.Button value="default">Default</Radio.Button>
            <Radio.Button value="small">Small</Radio.Button>
          </Radio.Group>
          <br />
          <br />
          <Button type="primary" size={size}>
            Primary
          </Button>
          <Button size={size}>Normal</Button>
          <Button type="dashed" size={size}>
            Dashed
          </Button>
          <Button type="danger" size={size}>
            Danger
          </Button>
          <br />
          <Button type="primary" shape="circle" icon="download" size={size} />
          <Button type="primary" icon="download" size={size}>
            Download
          </Button>
          <br />
          <Button.Group size={size}>
            <Button type="primary">
              <Icon type="left" />
              Backward
            </Button>
            <Button type="primary">
              Forward
              <Icon type="right" />
            </Button>
          </Button.Group>
        </Card>
        <Card>
          <div className="icons-list">
            <Icon type="home" />
            <Icon type="setting" theme="filled" />
            <Icon type="smile" theme="outlined" />
            <Icon type="sync" spin />
            <Icon type="loading" />

            <IconFont type="icon-tuichu" />
            <IconFont type="icon-facebook" />
            <IconFont type="icon-twitter" />
          </div>
        </Card>
        <Card>
          <Form onSubmit={this.handleSubmit}>
            <FormItem {...formItemLayout} label="Plain Text">
              <span className="ant-form-text">China</span>
            </FormItem>
            <FormItem {...formItemLayout} label="Select" hasFeedback>
              {getFieldDecorator('select', {
                rules: [{ required: true, message: 'Please select your country!' }],
              })(
                <Select placeholder="Please select a country">
                  <Option value="china">China</Option>
                  <Option value="use">U.S.A</Option>
                </Select>
              )}
            </FormItem>

            <FormItem {...formItemLayout} label="Select[multiple]">
              {getFieldDecorator('select-multiple', {
                rules: [
                  {
                    required: true,
                    message: 'Please select your favourite colors!',
                    type: 'array',
                  },
                ],
              })(
                <Select mode="multiple" placeholder="Please select favourite colors">
                  <Option value="red">Red</Option>
                  <Option value="green">Green</Option>
                  <Option value="blue">Blue</Option>
                </Select>
              )}
            </FormItem>

            <FormItem {...formItemLayout} label="InputNumber">
              {getFieldDecorator('input-number', { initialValue: 3 })(
                <InputNumber min={1} max={10} />
              )}
              <span className="ant-form-text"> machines</span>
            </FormItem>

            <FormItem {...formItemLayout} label="Switch">
              {getFieldDecorator('switch', { valuePropName: 'checked' })(<Switch />)}
            </FormItem>

            <FormItem {...formItemLayout} label="Slider">
              {getFieldDecorator('slider')(
                <Slider marks={{ 0: 'A', 20: 'B', 40: 'C', 60: 'D', 80: 'E', 100: 'F' }} />
              )}
            </FormItem>

            <FormItem {...formItemLayout} label="Radio.Group">
              {getFieldDecorator('radio-group')(
                <RadioGroup>
                  <Radio value="a">item 1</Radio>
                  <Radio value="b">item 2</Radio>
                  <Radio value="c">item 3</Radio>
                </RadioGroup>
              )}
            </FormItem>

            <FormItem {...formItemLayout} label="Radio.Button">
              {getFieldDecorator('radio-button')(
                <RadioGroup>
                  <RadioButton value="a">item 1</RadioButton>
                  <RadioButton value="b">item 2</RadioButton>
                  <RadioButton value="c">item 3</RadioButton>
                </RadioGroup>
              )}
            </FormItem>

            <FormItem {...formItemLayout} label="Rate">
              {getFieldDecorator('rate', {
                initialValue: 3.5,
              })(<Rate />)}
            </FormItem>

            <FormItem
              {...formItemLayout}
              label="Upload"
              extra="longgggggggggggggggggggggggggggggggggg"
            >
              {getFieldDecorator('upload', {
                valuePropName: 'fileList',
                getValueFromEvent: this.normFile,
              })(
                <Upload name="logo" action="/upload.do" listType="picture">
                  <Button>
                    <Icon type="upload" /> Click to upload
                  </Button>
                </Upload>
              )}
            </FormItem>

            <FormItem {...formItemLayout} label="Dragger">
              <div className="dropbox">
                {getFieldDecorator('dragger', {
                  valuePropName: 'fileList',
                  getValueFromEvent: this.normFile,
                })(
                  <Upload.Dragger name="files" action="/upload.do">
                    <p className="ant-upload-drag-icon">
                      <Icon type="inbox" />
                    </p>
                    <p className="ant-upload-text">Click or drag file to this area to upload</p>
                    <p className="ant-upload-hint">Support for a single or bulk upload.</p>
                  </Upload.Dragger>
                )}
              </div>
            </FormItem>

            <FormItem wrapperCol={{ span: 12, offset: 6 }}>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </FormItem>
          </Form>
        </Card>
        {/* <Card>
          <Form onSubmit={this.handleSubmit} className={styles.loginForm}>
            <FormItem>
              {getFieldDecorator('userName', {
                rules: [{ required: true, message: 'Please input your username!' }],
              })(
                <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Username" />
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator('password', {
                rules: [{ required: true, message: 'Please input your Password!' }],
              })(
                <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="Password" />
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator('remember', {
                valuePropName: 'checked',
                initialValue: true,
              })(
                <Checkbox>Remember me</Checkbox>
              )}
              <a className={styles.loginFormForgot} href="">Forgot password</a>
              <Button type="primary" htmlType="submit" className={styles.loginFormButton}>
                Log in
              </Button>
              Or <a href="">register now!</a>
            </FormItem>
          </Form>
        </Card> */}
      </div>
    );
  }
}

// const WrappedNormalLoginForm = Form.create()(NormalLoginForm);

// ReactDOM.render(<WrappedNormalLoginForm />, mountNode);

export default connect(({ global, loading }) => ({
  collapsed: global.collapsed,
  submitting: loading.effects['form/submitAdvancedForm'],
}))(Form.create()(NormalLoginForm));
