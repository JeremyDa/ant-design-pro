import React, { PureComponent, Fragment } from 'react';
import { formatMessage, FormattedMessage } from 'umi/locale';
import { connect } from 'dva';
import url from '../../../services/url';
import moment from 'moment';
import {
  Tag,
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
  Avatar,
  Upload,
} from 'antd';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import styles from './TableList.less';
import user from '../../../../public/user.png';

const FormItem = Form.Item;
const { Step } = Steps;
const { TextArea } = Input;
const { Option } = Select;
const RadioGroup = Radio.Group;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

// const value = [0,1,2,3];
// let gradeName = '';
// value.forEach(element => {
//   gradeName += status[element]+',';
// });
// console.log(gradeName);

const CreateForm = Form.create()(props => {
  const {
    modalVisible,
    form,
    handleAdd,
    handleUpdate,
    handleModalVisible,
    record,
    addOrUpdate,
    // to update: value to text的数据源，这里是表名
    T_MERCHANT,
  } = props;

  // to update: 字段名，用于双向绑定数据
  const { fWid, fName, fMerchantid, fSex, fPhoteurl, fMem } = record;

  const getMDate = date => {
    if (date) return moment(date);
    else return moment();
  };

  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      if (addOrUpdate === 1) handleAdd(fieldsValue);
      if (addOrUpdate === 2) handleUpdate(fieldsValue, record);
    });
  };

  const handlePreview = file => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  };

  const handleAvatarChange = value => {
    console.log(value);
    form.setFieldsValue({
      fPhoteurl: value,
    });
  };

  let avatarUrl = 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png';

  //文件上传改变事件
  const handleChange = e => {
    const saveType = 'file';
    let fileList = e.fileList;
    let fileStatus = e.file.status;

    if (fileStatus === 'uploading') {
      //上传中
      console.log('uploading....');
    } else if (fileStatus === 'done') {
      //上传成功
      let response = e.file.response;
      if (!response) {
        message.error('抱歉，文件由于未知原因上传失败!');
        return;
      }
      let responseMeta = response.meta;
      if (saveType === 'file') {
        //上传到文档库
        //上传成功(success为true并且响应码为200)
        if (responseMeta && responseMeta.success && responseMeta.statusCode === 200) {
          fileList = fileList.map(file => {
            if (file.uid === e.file.uid) {
              // file.uuid = response.data.ssbh;
              file.uuid = response.data.bh;
            }
            return file;
          });

          this.getUploadedImage(fileList, 'file');
        } else {
          message.error('抱歉，文件由于未知原因上传失败!');
          //过滤上传失败的图片
          fileList = this.filterUploadFailFile(e.fileList, e.file);
        }
      } else if (saveType === 'redis') {
        //缓存Redis
        //缓存成功(响应码为200)
        if (response.code === 200) {
          fileList = fileList.map(file => {
            if (file.uid === e.file.uid) {
              file.uuid = response.data;
            }
            return file;
          });
          this.getUploadedImage(fileList, 'redis');
        } else {
          message.error('抱歉，文件由于未知原因上传失败!');
          //过滤上传失败的图片
          fileList = this.filterUploadFailFile(e.fileList, e.file);
        }
      } else if (saveType === 'base64') {
        //用于保存数据库
        this.getImageBase64(e.file.originFileObj, imageUrl => {
          // console.log(imageUrl);
          //上传成功
          if (response.code === 200) {
            fileList = fileList.map(file => {
              if (file.uid === e.file.uid) {
                file.uuid = imageUrl;
                file.base64Url = imageUrl;
              } else {
                file.base64Url = file.thumbUrl || file.url;
              }
              return file;
            });
            this.getUploadedImage(fileList, 'base64');
          } else {
            message.error('抱歉，文件由于未知原因上传失败!');
            //过滤上传失败的图片
            fileList = this.filterUploadFailFile(e.fileList, e.file);
          }
        });
      }
    } else if (fileStatus === 'error') {
      //上传出错
      message.error('抱歉，文件由于未知原因上传失败!');
      //过滤上传失败的图片
      fileList = this.filterUploadFailFile(e.fileList, e.file);
    }
    if (fileStatus) {
      // this.setState({
      //     uploadedImageList: fileList
      // });
    }

    console.log('%o', fileList);
  };

  // 头像组件 方便以后独立，增加裁剪之类的功能
  class AvatarView extends React.Component {
    state = {
      fileDownloadUri: '',
    };

    constructor(props) {
      super(props);

      console.log('%o', props);

      this.state = {
        fileDownloadUri: props.value,
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
        // <Fragment>
        <div className={styles.baseView}>
          {/* <div className={styles.right}> */}
          <div className={styles.avatar}>
            <img src={fileDownloadUri || user} alt="avatar" />
          </div>
          <Upload
            // fileList={[]}
            action={`${url}/uploadCasherImg`}
            onSuccess={this.onSuccess}
            showUploadList={false}
            //         onChange={handleChange}
            // {...this.uploaderProps}
            ref="inner"
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
        // </div>
        // </Fragment>
      );
    }
  }
  return (
    <Modal
      destroyOnClose
      title={(addOrUpdate === 1 && '新建') || (addOrUpdate === 2 && '更新')}
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      {/* // to update: form表单内容，修改字段名称 */}

      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="工号">
        {form.getFieldDecorator('fWid', {
          initialValue: fWid,
          rules: [{ required: true, message: 'Please input the title of collection!' }],
        })(<Input />)}
      </FormItem>

      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="所属商户">
        {form.getFieldDecorator('fMerchantid', {
          initialValue: fMerchantid,
          rules: [{ required: true, message: 'Please input the title of collection!' }],
        })(
          <Select placeholder="请选择" style={{ width: '100%' }}>
            {T_MERCHANT ? T_MERCHANT.tv.map(d => <Option value={d.value}>{d.text}</Option>) : ''}
          </Select>
        )}
      </FormItem>

      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="姓名">
        {form.getFieldDecorator('fName', {
          initialValue: fName,
          rules: [{ required: true, message: 'Please input the title of collection!' }],
        })(<Input />)}
      </FormItem>

      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="性别">
        {form.getFieldDecorator('fSex', {
          initialValue: fSex,
          rules: [{ required: true, message: 'Please input the title of collection!' }],
        })(
          <Select defaultValue="1" style={{ width: 200 }}>
            <Option value="1">男</Option>
            <Option value="0">女</Option>
          </Select>
        )}
      </FormItem>

      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="照片">
        {form.getFieldDecorator('fPhoteurl', {
          initialValue: fPhoteurl,
        })(<AvatarView avatar={{ fPhoteurl }} handleChange={handleAvatarChange} />)}
      </FormItem>

      {/* <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="保留">
                {form.getFieldDecorator('fMem', {
                    initialValue:fMem,
                    rules: [{ required: true, message: 'Please input the title of collection!' }],
                })(
                    <Input />
                )}
            </FormItem> */}
    </Modal>
  );
});

const payStatus = { '0': '女', '1': '男' };

/* eslint react/no-multi-comp:0 */
@connect(({ table, loading }) => ({
  table,
  loading: loading.models.table,
}))
@Form.create()
export default class TableList extends PureComponent {
  getColumns = table => {
    // to update: 列名
    const { T_PAY_TYPE, T_THIRD, T_ORDER_TYPE, T_MERCHANT, T_CHANEL_TYPE } = table;
    return [
      {
        title: '工号',
        dataIndex: 'fWid',
        key: 'fWid',
      },
      {
        title: '所属商户',
        dataIndex: 'fMerchantid',
        key: 'fMerchantid',
        render(val) {
          return <span>{T_MERCHANT ? T_MERCHANT.kv[val] : ''}</span>;
        },
      },
      {
        title: '姓名',
        dataIndex: 'fName',
        key: 'fName',
      },
      {
        title: '性别',
        key: 'fSex',
        dataIndex: 'fSex',
        render(val) {
          return <Tag>{payStatus[val]}</Tag>;
        },

        // todo
      },
      {
        title: '照片',
        key: 'fPhoteurl',
        dataIndex: 'fPhoteurl',
        render(val) {
          return <Avatar src={val} />;
        },
      },
      // {
      //     title: '保留',
      //     key: 'fMem',
      //     dataIndex: 'fMem',

      // },
      {
        title: '操作',
        render: (text, record) => (
          <Fragment>
            <a onClick={() => this.handleModalUpdate(true, record)}>更新</a>

            <Divider type="vertical" />

            <Popconfirm title="确认删除吗?" onConfirm={this.handleDelete.bind(null, record)}>
              <a href="">删除</a>
            </Popconfirm>
          </Fragment>
        ),
      },
    ];
  };

  state = {
    modalVisible: false,
    updateModalVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
    addOrUpdate: 1,
    stepFormValues: {},

    // to update: tradeCode更新
    tradeSpace: 'tcasher',
  };

  componentDidMount() {
    const { dispatch } = this.props;
    const { tradeSpace } = this.state;

    dispatch({
      type: 'table/fetchKV',
      payload: {
        tradeCode: 'selectKeyValue',
        key: 'F_MERCHANTID',
        value: 'F_NAME',
        table: 'T_MERCHANT',
      },
    });

    dispatch({
      type: 'table/fetch',
      payload: {
        tradeCode: tradeSpace + '.selectByPrimaryKey',
      },
    });
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues, tradeSpace } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'table/fetch',
      payload: {
        ...params,
        tradeCode: tradeSpace + '.selectByPrimaryKey',
      },
    });
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    const { tradeSpace } = this.state;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'table/fetch',
      payload: {
        tradeCode: tradeSpace + '.selectByPrimaryKey',
      },
    });
  };

  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  };

  handleMenuClick = e => {
    const { dispatch } = this.props;
    const { selectedRows, tradeSpace } = this.state;

    if (!selectedRows) return;
    switch (e.key) {
      case 'remove':
        dispatch({
          type: 'table/remove',
          payload: {
            fTypeList: selectedRows.map(row => row.fType).join(','),
            tradeCode: tradeSpace + '.deleteByPrimaryKey',
          },
          callback: () => {
            this.setState({
              selectedRows: [],
            });
          },
        });
        break;
      default:
        break;
    }
  };

  handleDeleteBatch = () => {
    const { dispatch } = this.props;
    const { selectedRows, tradeSpace } = this.state;

    if (!selectedRows) return;
    dispatch({
      type: 'table/remove',
      payload: {
        fErrnoList: selectedRows.map(row => row.fErrno).join(','),
        tradeCode: tradeSpace + '.deleteByPrimaryKey',
      },
      callback: () => {
        this.setState({
          selectedRows: [],
        });
      },
    });
  };

  handleDelete = record => {
    const { dispatch } = this.props;
    const { tradeSpace } = this.state;

    if (!record) return;
    dispatch({
      type: 'table/remove',
      payload: {
        // to update: set primarykey
        fWid: record.fWid,
        fMerchantid: record.fMerchantid,
        tradeCode: tradeSpace + '.deleteByPrimaryKey',
      },
    });
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleSearch = e => {
    e.preventDefault();

    const { dispatch, form } = this.props;
    const { tradeSpace } = this.state;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
        // f_DATE: (fieldsValue.f_DATE && fieldsValue.f_DATE.format('YYYYMMDD')) || null,
        // date_start: (fieldsValue.date_start && fieldsValue.date_start.format('YYYYMMDD')) || null,
        // date_end: (fieldsValue.date_end && fieldsValue.date_end.format('YYYYMMDD')) || null,
      };

      this.setState({
        formValues: values,
      });

      dispatch({
        type: 'table/fetch',
        payload: {
          ...values,
          tradeCode: tradeSpace + '.selectByPrimaryKey',
        },
      });
    });
  };

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
      addOrUpdate: 1,
    });
  };

  handleModalUpdate = (flag, tableRow) => {
    this.setState({
      modalVisible: !!flag,
      tableRow: tableRow,
      addOrUpdate: 2,
    });
  };

  handleUpdate = (fields, record) => {
    const { dispatch } = this.props;
    const { tradeSpace } = this.state;
    console.log('handleUpdate:%o,%o', fields, record);
    dispatch({
      type: 'table/update',
      payload: {
        ...record,
        ...fields,
        // f_DATE: fields.f_DATE.format('YYYYMMDD'),
        tradeCode: tradeSpace + '.updateByPrimaryKeySelective',
      },
    });

    this.setState({
      modalVisible: false,
    });
  };

  handleUpdateModalVisible = (flag, record) => {
    this.setState({
      updateModalVisible: !!flag,
      stepFormValues: record || {},
    });
  };

  handleAdd = fields => {
    const { dispatch } = this.props;
    const { tradeSpace } = this.state;
    dispatch({
      type: 'table/add',
      payload: {
        ...fields,
        // f_DATE: fields.f_DATE.format('YYYYMMDD'),
        tradeCode: tradeSpace + '.insertSelective',
      },
    });

    this.handleModalVisible();
  };

  // handleUpdate = fields => {
  //   const { dispatch } = this.props;
  //   dispatch({
  //     type: 'table/update',
  //     payload: {
  //       name: fields.name,
  //       desc: fields.desc,
  //       key: fields.key,
  //       tradeCode: 'tordertype.updateByPrimaryKeySelective',
  //     },
  //   });

  //   message.success('配置成功');
  //   this.handleUpdateModalVisible();
  // };

  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          {/* // to update: 更新查询form */}
          <Col md={8} sm={24}>
            <FormItem label="类型代码">
              {getFieldDecorator('fType')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="类型名称">
              {getFieldDecorator('fName')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
              <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                展开 <Icon type="down" />
              </a>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  renderAdvancedForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;

    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="类型代码">
              {getFieldDecorator('fType')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="类型名称">
              {getFieldDecorator('fName')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="默认终端号">
              {getFieldDecorator('fTerm')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
        </Row>

        <div style={{ overflow: 'hidden' }}>
          <span style={{ float: 'right', marginBottom: 24 }}>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
              重置
            </Button>
            <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
              收起 <Icon type="up" />
            </a>
          </span>
        </div>
      </Form>
    );
  }

  renderForm() {
    const { expandForm } = this.state;
    return expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  }

  render() {
    const {
      table: { data },
      table,
      loading,
    } = this.props;

    const {
      selectedRows,
      modalVisible,
      addOrUpdate,
      updateModalVisible,
      stepFormValues,
      tableRow,
    } = this.state;
    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="remove">删除</Menu.Item>

        {/* <Menu.Item key="approval">批量审批</Menu.Item> */}
      </Menu>
    );

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleUpdate: this.handleUpdate,
      handleModalVisible: this.handleModalVisible,
      handleModalUpdate: this.handleModalUpdate,
    };
    const updateMethods = {
      handleUpdateModalVisible: this.handleUpdateModalVisible,
      handleUpdate: this.handleUpdate,
    };
    return (
      <PageHeaderWrapper title="查询表格">
        <Card bordered={false}>
          <div className={styles.tableList}>
            {/* {<div className={styles.tableListForm}>{this.renderForm()}</div>} */}
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                新建
              </Button>
              {/* {selectedRows.length === 1 && (
                <span>
                  <Button icon="edit" onClick={() => this.handleModalUpdate(true, selectedRows[0])}>
                    更新
                  </Button>
                </span>
              )} */}
              {/* {selectedRows.length > 0 && (
                <span>
                  <Popconfirm title="确认删除吗?" onConfirm={this.handleDeleteBatch}>
                    <Button>删除</Button>
                  </Popconfirm>
                  <Button>批量操作</Button>
                  <Dropdown overlay={menu}>
                    <Button>
                      更多操作 <Icon type="down" />
                    </Button>
                  </Dropdown>
                </span>
              )} */}
            </div>
            <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              columns={this.getColumns(table)}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
        <CreateForm
          // to update: 中文翻译
          T_MERCHANT={table.T_MERCHANT}
          addOrUpdate={addOrUpdate}
          // record={(addOrUpdate === 2 && selectedRows[0]) || {}}
          record={(addOrUpdate === 2 && tableRow) || {}}
          {...parentMethods}
          modalVisible={modalVisible}
        />
        {stepFormValues && Object.keys(stepFormValues).length ? (
          <UpdateForm
            {...updateMethods}
            updateModalVisible={updateModalVisible}
            values={stepFormValues}
          />
        ) : null}
      </PageHeaderWrapper>
    );
  }
}
