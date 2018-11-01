import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Button, Icon, List, Rate, Pagination } from 'antd';

import Ellipsis from '@/components/Ellipsis';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import styles from './CardList.less';

@connect(({ list, loading }) => ({
  list,
  loading: loading.models.list,
}))
class CardList extends PureComponent {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'list/fetch',
      payload: {
        count: 8,
      },
    });
  }

  render() {
    const {
      list: { list },
      loading,
    } = this.props;

    const content = (
      <div className={styles.pageHeaderContent}>
        <p>
          段落示意：蚂蚁金服务设计平台 ant.design，用最小的工作量，无缝接入蚂蚁金服生态，
          提供跨越设计与开发的体验解决方案。
        </p>
        <div className={styles.contentLink}>
          <a>
            <img alt="" src="https://gw.alipayobjects.com/zos/rmsportal/MjEImQtenlyueSmVEfUD.svg" />{' '}
            快速开始
          </a>
          <a>
            <img alt="" src="https://gw.alipayobjects.com/zos/rmsportal/NbuDUAuBlIApFuDvWiND.svg" />{' '}
            产品简介
          </a>
          <a>
            <img alt="" src="https://gw.alipayobjects.com/zos/rmsportal/ohOEPSYdDTNnyMbGuyLb.svg" />{' '}
            产品文档
          </a>
        </div>
      </div>
    );

    const extraContent = (
      <div className={styles.extraImg}>
        <img
          alt="这是一个标题"
          src="https://gw.alipayobjects.com/zos/rmsportal/RzwpdLnhmvDJToTdfDPe.png"
        />
      </div>
    );

    console.log('%o', list);

    let data = [
      {
        id: 'fake-list-0',
        owner: '付小小',
        title: '玉伯',
        avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
        cover: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
        description: '所属商户：国光',
      },
      {
        id: 'fake-list-1',
        owner: '曲丽丽',
        title: '他山',
        avatar: 'http://img.72qq.com/file/201603/29/21da82a916.jpg',
        cover: 'http://img.72qq.com/file/201603/29/21da82a916.jpg',
        description: '所属商户：国光',
      },
      {
        id: 'fake-list-2',
        owner: '林东东',
        title: '偏右',
        avatar: 'http://img.72qq.com/file/201603/29/b6f6928b15.jpg',
        cover: 'http://img.72qq.com/file/201603/29/b6f6928b15.jpg',
        description: '所属商户：国光',
      },
      {
        id: 'fake-list-3',
        owner: '周星星',
        title: '周星星',
        avatar: 'https://gw.alipayobjects.com/zos/rmsportal/sfjbOqnsXXJgNCjCzDBL.png',
        cover: 'https://gw.alipayobjects.com/zos/rmsportal/gLaIAoVWTtLbBWZNYEMg.png',
        description: '所属商户：国光',
      },
      {
        id: 'fake-list-4',
        owner: '吴加好',
        title: 'Bootstrap',
        avatar: 'https://gw.alipayobjects.com/zos/rmsportal/siCrBXXhmvTQGWPNLBow.png',
        cover: 'https://gw.alipayobjects.com/zos/rmsportal/gLaIAoVWTtLbBWZNYEMg.png',
        description: '所属商户：国光',
      },
      {
        id: 'fake-list-5',
        owner: '朱偏右',
        title: 'React',
        avatar: 'https://gw.alipayobjects.com/zos/rmsportal/kZzEzemZyKLKFsojXItE.png',
        cover: 'https://gw.alipayobjects.com/zos/rmsportal/iXjVmWVHbCJAyqvDxdtx.png',
        description: '所属商户：国光',
      },
      {
        id: 'fake-list-6',
        owner: '鱼酱',
        title: 'Vue',
        avatar: 'https://gw.alipayobjects.com/zos/rmsportal/ComBAopevLwENQdKWiIn.png',
        cover: 'https://gw.alipayobjects.com/zos/rmsportal/iZBVOIhGJiAnhplqjvZW.png',
        description: '所属商户：国光',
      },
      {
        id: 'fake-list-7',
        owner: '乐哥',
        title: 'Webpack',
        avatar: 'https://gw.alipayobjects.com/zos/rmsportal/nxkuOJlFJuAUhzlMTCEe.png',
        cover: 'https://gw.alipayobjects.com/zos/rmsportal/uMfMFlvUuceEyPpotzlq.png',
        description: '所属商户：国光',
      },
    ];

    function onShowSizeChange(current, pageSize) {
      console.log(current, pageSize);
    }

    function onChange(pageNumber) {
      console.log('Page: ', pageNumber);
    }

    return (
      <PageHeaderWrapper title="卡片列表" content={content} extraContent={extraContent}>
        <div className={styles.cardList}>
          <List
            rowKey="id"
            loading={loading}
            grid={{ gutter: 24, lg: 3, md: 2, sm: 1, xs: 1 }}
            dataSource={['', ...data]}
            renderItem={item =>
              item ? (
                <List.Item key={item.id}>
                  <Card hoverable className={styles.card}>
                    <Card.Meta
                      avatar={<img alt="" className={styles.cardAvatar} src={item.avatar} />}
                      title={<a>{item.title}</a>}
                      description={
                        <Ellipsis className={styles.item} lines={3}>
                          {item.description}
                        </Ellipsis>
                      }
                    />
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;工号：1223
                    <br />
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <Rate allowHalf defaultValue={2.5} />
                  </Card>
                </List.Item>
              ) : (
                <div>&nbsp;</div>
              )
            }
          />
          <div style={{ paddingBottom: '30px' }}>
            <Pagination
              className={styles.container}
              showSizeChanger
              onShowSizeChange={onShowSizeChange}
              defaultCurrent={3}
              total={500}
              onChange={onChange}
            />
          </div>
        </div>
      </PageHeaderWrapper>
    );
  }
}

export default CardList;
