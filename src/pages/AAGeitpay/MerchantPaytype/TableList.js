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
  Switch,
  Table,
} from 'antd';
import StandardTable from '../../../components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';


import styles from './TableList.less';

const FormItem = Form.Item;
const { Option } = Select;

const EditableContext = React.createContext();

const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);

class EditableCell extends React.Component {
  state = {
    editing: false,
  }

  componentDidMount() {
    if (this.props.editable) {
      document.addEventListener('click', this.handleClickOutside, true);
    }
  }

  componentWillUnmount() {
    if (this.props.editable) {
      document.removeEventListener('click', this.handleClickOutside, true);
    }
  }

  toggleEdit = () => {
    const editing = !this.state.editing;
    this.setState({ editing }, () => {
      if (editing) {
        this.input.focus();
      }
    });
  }

  handleClickOutside = (e) => {
    const { editing } = this.state;
    if (editing && this.cell !== e.target && !this.cell.contains(e.target)) {
      this.save();
    }
  }

  save = () => {
    const { record, handleSave } = this.props;
    this.form.validateFields((error, values) => {
      if (error) {
        return;
      }
      this.toggleEdit();
      handleSave({ ...record, ...values });
    });
  }

  render() {
    const { editing } = this.state;
    const {
      editable,
      dataIndex,
      title,
      record,
      index,
      handleSave,
      ...restProps
    } = this.props;
    return (
      <td ref={node => (this.cell = node)} {...restProps}>
        {editable ? (
          <EditableContext.Consumer>
            {(form) => {
              this.form = form;
              return (
                editing ? (
                  <FormItem style={{ margin: 0 }}>
                    {form.getFieldDecorator(dataIndex, {
                      rules: [{
                        required: true,
                        message: `${title} is required.`,
                      }],
                      initialValue: record[dataIndex],
                    })(
                      <Input
                        ref={node => (this.input = node)}
                        onPressEnter={this.save}
                      />
                    )}
                  </FormItem>
                ) : (
                  <div
                    className="editable-cell-value-wrap"
                    style={{ paddingRight: 24 }}
                    onClick={this.toggleEdit}
                  >
                    {restProps.children}
                  </div>
                )
              );
            }}
          </EditableContext.Consumer>
        ) : restProps.children}
      </td>
    );
  }
}

class EditableTable extends React.Component {
  constructor(props) {
    super(props);
    this.columns = [{
      title: 'name',
      dataIndex: 'name',
      width: '30%',
      editable: true,
    }, {
      title: 'age',
      dataIndex: 'age',
    }, {
      title: 'address',
      dataIndex: 'address',
    }, {
      title: 'operation',
      dataIndex: 'operation',
      render: (text, record) => {
        return (
          this.state.dataSource.length >= 1
            ? (
              <Popconfirm title="Sure to delete?" onConfirm={() => this.handleDelete(record.key)}>
                <a href="javascript:;">Delete</a>
              </Popconfirm>
            ) : null
        );
      },
    }];

    this.state = {
      dataSource: [{
        key: '0',
        name: 'Edward King 0',
        age: '32',
        address: 'London, Park Lane no. 0',
      }, {
        key: '1',
        name: 'Edward King 1',
        age: '32',
        address: 'London, Park Lane no. 1',
      }],
      count: 2,
    };
  }

  handleDelete = (key) => {
    const dataSource = [...this.state.dataSource];
    this.setState({ dataSource: dataSource.filter(item => item.key !== key) });
  }

  handleAdd = () => {
    const { count, dataSource } = this.state;
    const newData = {
      key: count,
      name: `Edward King ${count}`,
      age: 32,
      address: `London, Park Lane no. ${count}`,
    };
    this.setState({
      dataSource: [...dataSource, newData],
      count: count + 1,
    });
  }

  handleSave = (row) => {
    const newData = [...this.state.dataSource];
    const index = newData.findIndex(item => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    this.setState({ dataSource: newData });
  }

  render() {
    const { dataSource } = this.state;
    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell,
      },
    };
    const columns = this.columns.map((col) => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          editable: col.editable,
          dataIndex: col.dataIndex,
          title: col.title,
          handleSave: this.handleSave,
        }),
      };
    });
    return (
      <div>
        <Button onClick={this.handleAdd} type="primary" style={{ marginBottom: 16 }}>
          Add a row
        </Button>
        <Table
          components={components}
          rowClassName={() => 'editable-row'}
          bordered
          dataSource={dataSource}
          columns={columns}
        />
      </div>
    );
  }
}

/* eslint react/no-multi-comp:0 */
@connect(({ table, loading }) => ({
  table,
  loading: loading.models.table,
}))

export default class TableList extends PureComponent {
  getColumns = (table,checkUse) => {
    // to update: 列名
    const {T_INDUSTRY, T_CITY,T_PAY_TYPE,T_MERCHANT}  = table;

    return [
      {
        title: '商户',
        dataIndex: 'fMerchantid',
        render(val) {
          return <span>{T_MERCHANT ? T_MERCHANT.kv[val] : ''}</span>;
        },
      },
      {
        title: '支付类型',
        dataIndex: 'fPaytype',
        render(val) {
          return <span>{T_PAY_TYPE ? T_PAY_TYPE.kv[val] : ''}</span>;
        },
      },
      {
        title: '退款期限',
        dataIndex: 'fRefundDays',
      },
      {
        title: '状态',
        dataIndex: 'fUse',
        render(val,record) {
          const ischeck = (val==='1'?true:false);
          return <Switch checked={ischeck} onChange={(checked) => checkUse(checked,record)} />;
        },
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
    tradeSpace: 'tmerchantpaymodel',
  };

  componentDidMount() {
    const { dispatch } = this.props;
    const { tradeSpace } = this.state;

    dispatch({
      type:'table/fetchKV',
      payload: {
        tradeCode: 'selectKeyValue',
        key: 'F_TYPE',
        value: 'F_NAME',
        table: 'T_PAY_TYPE',
      },
    });

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
        closePagination: true,
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
        fMerchantid: record.fMerchantid,
        tradeCode: tradeSpace + '.deleteByPrimaryKey',
      },
      callback: () => {
        this.setState({
          selectedRows: [],
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
    dispatch({
      type: 'table/update',
      payload: {
        ...record,
        ...fields,
        // f_DATE: fields.f_DATE.format('YYYYMMDD'),
        tradeCode: tradeSpace + '.updateByPrimaryKeySelective',
      },
    });

    message.success('更新成功');
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
        // toList: 'fChanneltype,fPaytype',
        returnSelect: tradeSpace+'.selectByPrimaryKey',
      },
    });

    message.success('添加成功');
    this.handleModalVisible();
  };

  checkUse = (checked,record) => {
    const { dispatch } = this.props;
    const { tradeSpace } = this.state;
    dispatch({
      type: 'table/update',
      payload: {
        ...record,
        fUse: checked?1:0,
        // f_DATE: fields.f_DATE.format('YYYYMMDD'),
        tradeCode: tradeSpace + '.updateByPrimaryKeySelective',
      },
    });

    message.success('更新成功');
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
            <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              columns={this.getColumns(table,this.checkUse)}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
              paginationBool={false}
            />
            {/* <EditableTable/> */}
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}
