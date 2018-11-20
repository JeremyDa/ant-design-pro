import React from 'react';
import { Form, Input,Modal,Alert, } from 'antd';

const FormItem = Form.Item;
const { TextArea } = Input;

class ReasonModal extends React.Component {

  render() {

    const { handleReturn, handleCancel, returnVisible, form } = this.props;
    const { getFieldDecorator } = form;

    return (
      <div>
        <Modal
          title="退款原因"
          visible={returnVisible}
          onOk={handleReturn}
          onCancel={handleCancel}
          destroyOnClose='true'
        >
          <FormItem>
            {getFieldDecorator('refundReason', {
              rules: [{ required: true, message: '请输入退款原因' }],
            })(
              <div>
                <Alert
                  message="将统一使用下方填写的退款原因"
                  type="warning"
                  banner
                  style={{ marginBottom: 10 }}
                  closeText="Close"
                />
                <TextArea rows={4} placeholder="请输入退款原因" />
              </div>
            )}
          </FormItem>
        </Modal>
      </div>
    );
  }
};

const WrappedReasonModal = Form.create()(ReasonModal);
export default WrappedReasonModal;
