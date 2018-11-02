// import { Bar } from 'ant-design-pro/lib/Charts';
import { Bar, Pie, yuan } from '@/components/Charts';
import { connect } from 'dva';
import { Chart, Tooltip, Axis, Line, Point } from 'viser-react';
import React, { PureComponent } from 'react';
import { Card, Row, Col } from 'antd';
import Center from '@/pages/Account/Center/Center';

const sourdata = [
  { year: '1991', value: 3 },
  { year: '1992', value: 4 },
  { year: '1993', value: 3.5 },
  { year: '1994', value: 5 },
  { year: '1995', value: 4.9 },
  { year: '1996', value: 6 },
  { year: '1997', value: 7 },
  { year: '1998', value: 9 },
  { year: '1999', value: 13 },
];

const scale = [
  {
    dataKey: 'y',
    min: 0,
  },
  {
    dataKey: 'x',
    min: 0,
    max: 1,
  },
];

@connect(({ table, chart, loading }) => ({
  table,
  chart,
  loading: loading.models.table,
}))

// @Form.create()
export default class TableList extends PureComponent {
  state = {
    tradeSpace: 'tantv',
    source: [],
  };

  componentDidMount() {
    const { dispatch } = this.props;
    const { tradeSpace } = this.state;
    dispatch({
      type: 'table/fetch',
      payload: {
        tradeCode: 'selectAntV',
      },
    });
  }

  render() {
    const {
      table: { data },
      table,
      loading,
    } = this.props;

    console.log('++++++++', table);

    for (var i = 0; i < 3; i++) {
      if (table[i] == null) {
        table[i] = [];
      }
    }

    return (
      <div>
        <Card>
          <Row gutter={8}>
            <Col span={12}>
              <Bar height={350} title="销售额趋势" data={table[2]} style={{ float: 'left' }} />
            </Col>
            <Col span={12} sm={12}>
              <Pie
                tooltip={false}
                animate={false}
                inner={0.55}
                margin={[0, 0, 0, 0]}
                height={320}
                hasLegend
                title="销售额"
                subTitle="销售额"
                padding={10}
                total={() => (
                  <span
                    dangerouslySetInnerHTML={{
                      __html: yuan(table[1].reduce((pre, now) => now.y + pre, 0)),
                    }}
                  />
                )}
                data={table[1]}
                valueFormat={val => <span dangerouslySetInnerHTML={{ __html: yuan(val) }} />}
              />
            </Col>
          </Row>
        </Card>
        <Card>
          <Row>
            <Col span={24}>
              <span>月收入额</span>
              <Chart forceFit height={280} data={table[0]} scale={scale}>
                <Tooltip />
                <Axis />
                <Line position="x*y" />
                <Point position="x*y" shape="circle" />
              </Chart>
            </Col>
          </Row>
        </Card>
      </div>
    );
  }
}
