/**
 * Created by hyj on 2016/12/22.
 */

/**
 * Created by hyj on 2016/9/29.
 */
import React, {
    Component,
    PropTypes
} from 'react';

import classNames from 'classnames';
import '../../../resource/css/font-awesome.min.css';
import './stationview.css';



export default class stationview extends Component {
    constructor(props) {
        super(props);
        this.state={
            height:700,
            width:600,
            projlist:[],
            freestationlist:[],
            key:"lockunit",
            hide:"block",
            projoption:[],
            statoption:[],
            selected:{
                'StatCode':'--',
                'StatName':'--',
                'ProjCode':'--',
                'ChargeMan':'--',
                'Telephone':'--',
                'Longitude':'--',
                'Latitude':'--',
                'Department':'--',
                'Address':'--',
                'Country':'--',
                'Street':'--',
                'Square':'--',
                'ProStartTime':'--',
                'Stage':'--'
            },
            finialselectedcode:"--",
            clickcallback:null
        }
    }
    getSelectedStat(){
        return this.state.finialselectedcode;
    }
    updatecallback(callback){
        this.setState({clickcallback:callback});
    }
    update_size(width,height){
        this.setState({height:height,width:width});

    }
    find_projname(projcode){
        if(this.state.projlist === null || this.state.projlist === undefined ){
            return "--";
        }else{
            for(let i=0;i< this.state.projlist.length;i++){
               if(this.state.projlist[i].id == projcode) {
                   return this.state.projlist[i].name
               }
            }
        }
        return "--";
    }
    update_projlist(projlist){
        this.setState({projlist:projlist},this.updateprop);
        //this.updateprop();
    }
    update_freestationlist(freestationlist){
        this.setState({freestationlist:freestationlist});
        //this.updateprop();
    }
    updateprop(){
        let outputlist = [];
        //console.log(this.state.projlist);
        for(let i=0;i<this.state.projlist.length;i++){
            for(let j=0;j<this.state.freestationlist.length;j++){
                if(this.state.projlist[i].id == this.state.freestationlist[j].ProjCode){
                    outputlist.push(<option value={this.state.projlist[i].id} key = {"proj"+this.state.projlist[i].id}>{this.state.projlist[i].name}</option>);
                    break;
                }
            }
        }
        this.setState({projoption:outputlist},this.handleChangeproj);
    }
    hide(){
        this.setState({hide:"none"});
    }
    show(){
        this.setState({hide:"block"});
    }
    handleChangeproj(){
        let projchoiced = $("#ProjChoice").val();
        console.log("projchoiced:"+projchoiced);
        let outputlist = [];
        console.log(this);
        for(let i=0;i<this.state.freestationlist.length;i++){
            if(projchoiced == this.state.freestationlist[i].ProjCode){
                outputlist.push(<option value={this.state.freestationlist[i].StatCode} key = {"stat"+this.state.freestationlist[i].StatCode}>{this.state.freestationlist[i].StatName}</option>);
            }
        }
        console.log("statoption:"+outputlist);
        this.setState({statoption:outputlist},this.handleChangestat);
    }
    handleChangestat(){
        let statchoiced = $("#StatChoice").val();
        for(let i=0;i<this.state.freestationlist.length;i++){
            if(statchoiced == this.state.freestationlist[i].StatCode){
                this.setState({selected:this.state.freestationlist[i]});
                break;
            }
        }
    }
    handleClick(){
        this.setState({finialselectedcode:this.state.selected.StatCode});
        this.state.clickcallback();
        //TODO: changeview
    }
    render() {
        return (
            <div style={{position:"relative",background:"#ffffff",height:this.state.height,maxHeight:this.state.height,width:'100%',display:this.state.hide,overflow:'scroll',overflowX:'hidden'}}>
                <div className="col-xs-12 col-md-12 col-sm-12 col-lg-12" >
                    <div className="count" style={{fontSize:20,marginTop:15,verticalAlign:'bottom',width:"90%"}} >
                        <div className="input-group">
                            <span className="input-group-addon"  style={{minWidth: "100px",fontSize:"12px"}}>{"项目:"}</span>
                            <select className="form-control"  placeholder="CONFIG Value" aria-describedby="basic-addon1" id="ProjChoice"
                                    onChange={this.handleChangeproj.bind(this)}
                                    >{this.state.projoption}</select>
                        </div>
                    </div>
                    <div className="count" style={{fontSize:20,marginTop:15,verticalAlign:'bottom',width:"90%"}} >
                        <div className="input-group">
                            <span className="input-group-addon"  style={{minWidth: "100px",fontSize:"12px"}}>{"站点:"}</span>
                            <select className="form-control" placeholder="CONFIG Value" aria-describedby="basic-addon1" id="StatChoice"
                                    onChange={this.handleChangestat.bind(this)}
                                    >{this.state.statoption}</select>
                        </div>
                    </div>

                </div>

                <div className="col-xs-12 col-md-12 col-sm-12 col-lg-12" >

                    <div className="animated flipInY" style={{paddingTop:15}}>
                        <div className="tile-stats">
                            <h3 style={{fontSize:16,paddingTop:10,marginRight:"5px",color:"#3498db",width:"100%",fontWeight:"bold"}} className="pull-left">{this.state.selected.StatCode}</h3>
                            <div className="count" style={{fontSize:32,color:this.state.color,textAlign:"center",width:"100%",marginLeft:"0px"}}>{this.state.selected.StatName}</div>
                            <p style={{fontSize:16,paddingTop:0,paddingLeft:10,fontWeight:"bold",color:"#333",marginLeft:"15px",marginTop:"-5px",width:"100%"}} className="pull-right">{"项目："+this.find_projname(this.state.selected.ProjCode)}</p>
                            <p style={{fontSize:16,paddingTop:0,paddingLeft:10,fontWeight:"bold",color:"#333",marginLeft:"15px",marginTop:"-5px",width:"100%"}} className="pull-right">{"单位："+this.state.selected.Department}</p>
                            <p style={{fontSize:16,paddingTop:0,paddingLeft:10,fontWeight:"bold",color:"#333",marginLeft:"15px",marginTop:"-5px",width:"100%"}} className="pull-right">{"地址："+this.state.selected.Address}</p>
                            <p style={{fontSize:16,paddingTop:0,paddingLeft:10,fontWeight:"bold",color:"#333",marginLeft:"15px",marginTop:"-5px",width:"100%"}} className="pull-right">{"区县："+this.state.selected.Country}</p>
                            <p style={{fontSize:16,paddingTop:0,paddingLeft:10,fontWeight:"bold",color:"#333",marginLeft:"15px",marginTop:"-5px",width:"100%"}} className="pull-right">{"街镇："+this.state.selected.Street}</p>
                        </div>
                    </div>
                </div>
                <div className="col-xs-12 col-md-12 col-sm-12 col-lg-12" >
                    <button type="button" data-loading-text="确定" className="btn btn-primary" autoComplete="off" style={{width:"100%"}} onClick={this.handleClick.bind(this)}>
                        确定
                    </button>
                </div>
            </div>
        );
    }
}