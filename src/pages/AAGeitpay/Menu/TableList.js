import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
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
  Table,
} from 'antd';
import StandardTable from '../../../components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import styles from './TableList.less';

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
    // T_INDUSTRY,
  } = props;

  // to update: 字段名，用于双向绑定数据
  const { id, name, path, icon, component, redirect, namezh } = record;

  const getMDate = date => {
    if (date) return moment(date);
    else return moment();
  };

  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      if (addOrUpdate === 1) handleAdd(fieldsValue, record);
      if (addOrUpdate === 2) handleUpdate(fieldsValue, record);
    });
  };
  return (
    <Modal
      destroyOnClose
      title={(addOrUpdate === 1 && '新建') || (addOrUpdate === 2 && '更新')}
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      {/* // to update: form表单内容，修改字段名称 */}
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="菜单">
        {form.getFieldDecorator('name', {
          initialValue: name,

        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="路径">
        {form.getFieldDecorator('path', {
          initialValue: path,

        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="图标">
        {form.getFieldDecorator('icon', {
          initialValue: icon,

        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="组件">
        {form.getFieldDecorator('component', {
          initialValue: component,

        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="重定向">
        {form.getFieldDecorator('redirect', {
          initialValue: redirect,

        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="中文名称">
        {form.getFieldDecorator('namezh', {
          initialValue: namezh,

        })(<Input placeholder="请输入" />)}
      </FormItem>
    </Modal>
  );
});

/* eslint react/no-multi-comp:0 */
@connect(({ table, loading }) => ({
  table,
  loading: loading.models.table,
}))
@Form.create()
export default class TableList extends PureComponent {
  getColumns = table => {
    // to update: 列名
    return [
      {
        title: '菜单',
        dataIndex: 'name',
      },
      {
        title: '路径',
        dataIndex: 'path',
      },
      {
        title: '图标',
        dataIndex: 'icon',
      },
      {
        title: '组件',
        dataIndex: 'component',
      },
      {
        title: '重定向',
        dataIndex: 'redirect',
      },
      // {
      //   title: '添加子菜单',
      //   // render: (text, record) => (
      //   //   <Fragment>
      //   //     <a onClick={() => this.handleModalUpdate(true, record)}>添加子菜单</a>
      //   //   </Fragment>
      //   // ),
      // },
      {
        title: '操作',
        render: (text, record) => (
          <Fragment>
            <a onClick={() => this.handleModalUpdate(true, record)}>添加子菜单</a>
            <Divider type="vertical" />
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
    tradeSpace: 'tmenu',
  };

  componentDidMount() {
    const { dispatch } = this.props;
    const { tradeSpace } = this.state;

    dispatch({
      type: 'table/fetch',
      payload: {
        tradeCode: tradeSpace + '.selectTree',
        type: 'menu',
        closePagination: true,
        childName: 'children',
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

        // to update:tradeCode更新
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
        // to update:tradeCode更新
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
            // to update:tradeCode更新
            fErrnoList: selectedRows.map(row => row.fErrno).join(','),
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
        // to update:tradeCode更新
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
        id: record.id,
        tradeCode: tradeSpace + '.deleteByPrimaryKey',
        returnSelect: 'null'
      },
      callback: () => {
        this.setState({
          selectedRows: [],
        });
        dispatch({
          type: 'table/fetch',
          payload: {
            tradeCode: tradeSpace + '.selectTree',
            type: 'menu',
            closePagination: true,
            childName: 'children',
          },
        });
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

          // to update:tradeCode更新
          tradeCode: tradeSpace + '.selectByPrimaryKey',
        },
      });
    });
  };

  handleModalVisible = (flag, tableRow) => {
    console.log("Add:", tableRow);
    this.setState({
      modalVisible: !!flag,
      tableRow: tableRow,
      addOrUpdate: 1,
    });
  };

  handleModalUpdate = (flag, tableRow) => {
    console.log("Update:", tableRow);
    this.setState({
      modalVisible: !!flag,
      tableRow: tableRow,
      addOrUpdate: 2,
    });
  };



  handleUpdate = (fields, record) => {
    const { dispatch } = this.props;
    const { tradeSpace } = this.state;
    console.log("++++:", record);
    dispatch({
      type: 'table/update',
      payload: {
        ...record,
        ...fields,
        // f_DATE: fields.f_DATE.format('YYYYMMDD'),
        // to update:tradeCode更新
        tradeCode: tradeSpace + '.updateByPrimaryKeySelective',
        returnSelect: 'null'
      },
      callback: () => {
        dispatch({
          type: 'table/fetch',
          payload: {
            tradeCode: tradeSpace + '.selectTree',
            type: 'menu',
            closePagination: true,
            childName: 'children',
          },
        });
      }
    });

    this.setState({
      modalVisible: false,
    });
  };

  handleAdd = (fields, record) => {
    const { dispatch } = this.props;
    const { tradeSpace } = this.state;
    console.log("++++:::", record);
    dispatch({
      type: 'table/add',
      payload: {
        parentid: record.id,
        ...fields,
        // f_DATE: fields.f_DATE.format('YYYYMMDD'),
        // to update:tradeCode更新
        tradeCode: tradeSpace + '.insertSelective',
        returnSelect: 'null'
      },
      callback: () => {
        dispatch({
          type: 'table/fetch',
          payload: {
            tradeCode: tradeSpace + '.selectTree',
            type: 'menu',
            closePagination: true,
            childName: 'children',
          },
        });
      }
    });

    this.handleModalVisible();
  };

  handleUpdateModalVisible = (flag, record) => {
    this.setState({
      updateModalVisible: !!flag,
      stepFormValues: record || {},
    });
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
            <FormItem label="错误码">
              {getFieldDecorator('fErrno')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="错误描述">
              {getFieldDecorator('fErrmsg')(<Input placeholder="请输入" />)}
            </FormItem>
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
            <FormItem label="字符串">
              {getFieldDecorator('f_CHAR')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="下拉框">
              {getFieldDecorator('f_SELECT')(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="0">关闭</Option>
                  <Option value="1">运行中</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="数字">
              {getFieldDecorator('f_NUMBER')(<InputNumber style={{ width: '100%' }} />)}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="日期">
              {getFieldDecorator('f_DATE')(
                <DatePicker style={{ width: '100%' }} placeholder="请输入日期" />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="日期">
              {getFieldDecorator('date_start')(
                <DatePicker style={{ width: '100%' }} placeholder="请输入开始日期" />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="日期">
              {getFieldDecorator('date_end')(
                <DatePicker style={{ width: '100%' }} placeholder="请输入结束日期" />
              )}
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
      // table,
      loading,
    } = this.props;

    const { modalVisible, addOrUpdate, updateModalVisible, stepFormValues, tableRow } = this.state;

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

    const columns = [
      {
        title: '菜单',
        dataIndex: 'namezh',
      },
      {
        title: '路径',
        dataIndex: 'path',
      },
      {
        title: '图标',
        dataIndex: 'icon',
      },
      {
        title: '组件',
        dataIndex: 'component',
      },
      {
        title: '重定向',
        dataIndex: 'redirect',
      },

      {
        title: '操作',
        render: (text, record) => (
          <Fragment>
            <a onClick={() => this.handleModalVisible(true, record)}>添加子菜单</a>
            <Divider type="vertical" />
            <a onClick={() => this.handleModalUpdate(true, record)}>更新</a>

            <Divider type="vertical" />

            <Popconfirm title="确认删除吗?" onConfirm={this.handleDelete.bind(null, record)}>
              <a href="">删除</a>
            </Popconfirm>
          </Fragment>
        ),
      },
    ];

    console.log('data:%o', data);

    // const data = {
    //   list : [
    //     // app
    //     {
    //       nameZH: '首页',
    //       path: '/',
    //       component: './layouts/LoadingPage',
    //       children: [
    //         // dashboard
    //         { nameZH:'dashboard',path: '/', redirect: '/dashboard/analysis' },
    //         {
    //           nameZH: '账务管理',
    //           path: '/trans',
    //           name: 'trans',
    //           icon: '',
    //           children: [
    //             {
    //               nameZH: '交易明细',
    //               path: '/trans/order-pay',
    //               name: 'order-pay',
    //               component: './AAGeitpay/OrderPay/TableList',
    //             },
    //             {
    //               nameZH: '退款',
    //               path: '/trans/return',
    //               name: 'return',
    //               component: './AAGeitpay/Return/TableList',
    //             },
    //             {
    //               nameZH: '对账',
    //               path: '/trans/check',
    //               name: 'check',
    //               component: './AAGeitpay/Check/TableList',
    //             },
    //           ],
    //         },
    //         {
    //           nameZH: '数据管理',
    //           path: '/basic',
    //           name: 'basic',
    //           icon: '',
    //           children: [
    //             {
    //               nameZH: '订单类型',
    //               path: '/basic/order-type',
    //               name: 'order-type',
    //               component: './AAGeitpay/OrderType/TableList',
    //             },
    //             {
    //               nameZH: '渠道类型',
    //               path: '/basic/channel-type',
    //               name: 'channel-type',
    //               component: './AAGeitpay/ChannelType/TableList',
    //             },
    //             {
    //               nameZH: '第三方',
    //               path: '/basic/third',
    //               name: 'third',
    //               component: './AAGeitpay/Third/TableList',
    //             },
    //             {
    //               nameZH: '支付类型',
    //               path: '/basic/pay-type',
    //               name: 'pay-type',
    //               component: './AAGeitpay/PayType/TableList',
    //             },
    //             {
    //               nameZH: '第三方响应码',
    //               path: '/basic/third-return',
    //               name: 'third-return',
    //               component: './AAGeitpay/ThirdReturn/TableList',
    //             },
    //             {
    //               nameZH: '第三方交易状态',
    //               path: '/basic/third-state',
    //               name: 'third-state',
    //               component: './AAGeitpay/ThirdState/TableList',
    //             },
    //             {
    //               nameZH: '交易类型',
    //               path: '/basic/trans-type',
    //               name: 'trans-type',
    //               component: './AAGeitpay/TransType/TableList',
    //             },
    //             {
    //               nameZH: '错误代码',
    //               path: '/basic/error-code',
    //               name: 'error-code',
    //               component: './AAGeitpay/ErrorCode/TableList',
    //             },
    //             {
    //               nameZH: '商户管理',
    //               path: '/basic/merchant',
    //               name: 'merchant',
    //               component: './AAGeitpay/Merchant/TableList',
    //             },
    //             {
    //               nameZH: '商户账户',
    //               path: '/basic/merchant-acc',
    //               name: 'merchant-acc',
    //               component: './AAGeitpay/MerchantAcc/TableList',
    //             },
    //           ],
    //         },
    //         {
    //           path: '/test',
    //           name: 'test',
    //           icon: '',
    //           children: [
    //             { path: '/test/table-list', name: 'table-list', component: './AATable/TableList' },
    //           ],
    //         },
    //       ],
    //     },
    //   ],
    // };

    // const data = [
    //   {
    //     key: 1,
    //     name: 'John Brown sr.',
    //     age: 60,
    //     address: 'New York No. 1 Lake Park',
    //     children: [
    //       {
    //         key: 11,
    //         name: 'John Brown',
    //         age: 42,
    //         address: 'New York No. 2 Lake Park',
    //       },
    //       {
    //         key: 12,
    //         name: 'John Brown jr.',
    //         age: 30,
    //         address: 'New York No. 3 Lake Park',
    //         children: [
    //           {
    //             key: 121,
    //             name: 'Jimmy Brown',
    //             age: 16,
    //             address: 'New York No. 3 Lake Park',
    //           },
    //         ],
    //       },
    //       {
    //         key: 13,
    //         name: 'Jim Green sr.',
    //         age: 72,
    //         address: 'London No. 1 Lake Park',
    //         children: [
    //           {
    //             key: 131,
    //             name: 'Jim Green',
    //             age: 42,
    //             address: 'London No. 2 Lake Park',
    //             children: [
    //               {
    //                 key: 1311,
    //                 name: 'Jim Green jr.',
    //                 age: 25,
    //                 address: 'London No. 3 Lake Park',
    //               },
    //               {
    //                 key: 1312,
    //                 name: 'Jimmy Green sr.',
    //                 age: 18,
    //                 address: 'London No. 4 Lake Park',
    //               },
    //             ],
    //           },
    //         ],
    //       },
    //     ],
    //   },
    //   {
    //     key: 2,
    //     name: 'Joe Black',
    //     age: 32,
    //     address: 'Sidney No. 1 Lake Park',
    //   },
    // ];

    // rowSelection objects indicates the need for row selection
    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
      },
      onSelect: (record, selected, selectedRows) => {
        console.log(record, selected, selectedRows);
      },
      onSelectAll: (selected, selectedRows, changeRows) => {
        console.log(selected, selectedRows, changeRows);
      },
    };

    return (
      <PageHeaderWrapper title="查询表格">
        <Card bordered={false}>
          <div className={styles.tableList}>
            {/* <div className={styles.tableListForm}>{this.renderForm()}</div> */}
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
            {/* <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              columns={this.getColumns(table)}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            /> */}
            <Table
              columns={columns}
              rowSelection={rowSelection}
              dataSource={data.list}
              size="small"
            />
          </div>
        </Card>
        <CreateForm
          // to update: 中文翻译
          // T_INDUSTRY={table.T_INDUSTRY}

          addOrUpdate={addOrUpdate}
          // record={(addOrUpdate === 2 && selectedRows[0]) || {}}
          record={(tableRow) || {}}
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
