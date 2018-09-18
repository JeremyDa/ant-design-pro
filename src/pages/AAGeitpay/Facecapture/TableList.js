import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
// import tracking from 'tracking';
import analyseVideo from './analyseVideo'
import gum from './gum'
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
    Upload,
    Tag,
    Avatar,
} from 'antd';
import StandardTable from '@/components/StandardTable';
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

const userStatus = { '01': '无效', '00': '正常' };
const userStatusColor = {'01':'orange', '00':'green'};

/* eslint react/no-multi-comp:0 */
@connect(({ table, loading }) => ({
    table,
    loading: loading.models.table,
}))
export default class TableList extends PureComponent {
    constructor(props){
        super(props)
        this.state={
            
        }
    
        // this.drawHand = this.drawHand.bind(this);
    }
    
    drawHand(){
      var handCanvas = this.refs.handCanvas
      var handCanvasContext = handCanvas.getContext('2d');
      var hand = new Image()
      hand.src= 'hand.png'
      hand.onload = function(){
      handCanvasContext.drawImage(hand, 0, 0)}
    }

    componentDidMount() {

        gum(analyseVideo, this.refs.video, this.refs.inputCanvas, this.refs.outputCanvas);

        let video = this.refs.video;
        let canvas = this.refs.canvas;
        let context = canvas.getContext('2d');
        const tracking = window.tracking;

        var tracker = new tracking.ColorTracker(['magenta', 'cyan', 'yellow']);
        tracker.setInitialScale(4);
        tracker.setStepSize(2);
        tracker.setEdgesDensity(0.1);

        tracking.track(video, tracker, { camera: true });

        tracking.track(video, tracker, { camera: true });
        tracker.on('track', function(event) {
            context.clearRect(0, 0, canvas.width, canvas.height);
            event.data.forEach(function(rect) {
                context.strokeStyle = '#a64ceb';
                context.strokeRect(rect.x, rect.y, rect.width, rect.height);
                context.font = '11px Helvetica';
                context.fillStyle = "#fff";
                context.fillText('x: ' + rect.x + 'px', rect.x + rect.width + 5, rect.y + 11);
                context.fillText('y: ' + rect.y + 'px', rect.x + rect.width + 5, rect.y + 22);
                isDetectFace = true; // 检测到人脸
                context2.drawImage(video, rect.x, rect.y, 210, 210, 0, 0, 140, 140); 
                srcNormal = can.toDataURL("image/png");
            });
        });

        let gui = new dat.GUI();
        gui.add(tracker, 'edgesDensity', 0.1, 0.5).step(0.01);
        gui.add(tracker, 'initialScale', 1.0, 10.0).step(0.1);
        gui.add(tracker, 'stepSize', 1, 5).step(0.1);

        can = document.getElementById('shortCut');
        let context2 = can.getContext('2d');

    }

    componentWillUnmount() {
        // const { dispatch } = this.props;
        // dispatch({
        //     type: 'table/clean', 
        // });
    }

    render() {

        return (
            <div>
                {/* <div>
                    <video id="video" preload="true" autoPlay loop muted></video>
                    <canvas id="canvas" width="600" height="436"></canvas>
                    <canvas id="shortCut" width="140" height="140"></canvas>
                </div> */}


                <div className="demo-container">
                    <video ref="video" width="640" height="480" preload autoPlay loop muted></video>
                    <canvas ref="canvas" width="600" height="436"></canvas>
                    <canvas ref="shortCut" width="140" height="140"></canvas>
                    {/* <canvas ref="inputCanvas" width="640" height="480" hidden></canvas> */}
                    {/* <canvas ref="outputCanvas" id="videoLayer" width="640" height="480"></canvas> */}
                    {/* <canvas ref="handCanvas" id="handLayer" width="640" height="480"></canvas> */}
                </div>
                
            </div>
        );
    }
}
