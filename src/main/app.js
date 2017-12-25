/**
 * Created by hyj on 2016/9/28.
 */

import React,  {
    Component,
    PropTypes
    }from "react";
import ReactDOM from "react-dom";
import classNames from 'classnames';
import Foot from "../foot/foot"
import Head from "../head/head"
import Activateview from "../container/activateview/activateview"
import Uploadview from "../container/Uploadview/Uploadview"
import Stationview from "../container/stationview/stationview"
import './App.css';

import fetch from 'isomorphic-fetch';
require('es6-promise').polyfill();


var winWidth;
var winHeight;
var Longitude = null;
var Latitude = null;
var basic_address = getRelativeURL()+"/";
var request_head= basic_address+"request.php";
class App extends Component{
    constructor(props) {
        super(props);
        this.state = {
            width: 1280, //
            height: 800,
            headfootheight: 50,
            headfootminheight: 50,
            canvasheight: 700,
            userid: "user",
            username:"Activate",
            hculist: []
        };
    }
    initializeSize(width,height){
        let winlength= (width>height)?width:height;
        let headfootheight = (parseInt(winlength/10)>this.state.headfootminheight)?parseInt(winlength/10):this.state.headfootminheight;
        let canvasheight = height - 2*headfootheight;
        console.log("headfootheight:"+headfootheight+"canvasheight:"+canvasheight);
        this.setState({width:width,height:height,headfootheight:headfootheight,canvasheight:canvasheight});
        this.refs.head.update_size(headfootheight);
        this.refs.foot.update_size(headfootheight);
        this.refs.Activateview.update_size(width,canvasheight);
        //this.refs.Uploadview.update_size(width,canvasheight);
        //this.refs.Stationview.update_size(width,canvasheight);
    }
    initializehead(id){
        this.refs.head.update_username(id);
    }
    initializefoot(callback){
        this.refs.foot.update_callback(callback);
    }
    initializestation(projlist,statlist,callback){
        this.refs.Stationview.update_freestationlist(statlist);
        this.refs.Stationview.update_projlist(projlist);
        this.refs.Stationview.updatecallback(callback);
    }
    updateactivestatus(status){
        this.refs.Activateview.update_status(status);
    }
    updateactivecode(code){
        this.refs.Activateview.update_code(code);
    }
    updateactivenotes(notes){
        this.refs.Activateview.update_notes(notes);
    }
    updateactivebuttonenable(buttonenable){
        this.refs.Activateview.update_buttonenable(buttonenable);
    }
    updateactivefetch(activefetch){
        this.refs.Activateview.update_activefetch(activefetch);
    }
    showactiveview(){
        this.refs.Activateview.show();
    }
    buttonlock(input){
        this.refs.foot.disable(input);
    }
    render() {
        return(
        <div>
            <div>
                <Head ref="head"/>
            </div>
            <div>
                <Activateview ref="Activateview"/>
            </div>
            <div>
                <Foot ref="foot"/>
            </div>
        </div>
        );
    }


}




get_size();
var project_list = [];
var free_station =[];

//fetchFreeStation();

var wechat_id = getWechatScope();
var session_id =  getSessionScope();
var user_id="";
var react_element = <App/>;
var app_handle = ReactDOM.render(react_element,document.getElementById('app'));
var cycle_number = 0;
var basic_address = getRelativeURL()+"/";

app_handle.initializeSize(winWidth,winHeight);
app_handle.initializehead(wechat_id);
fetchuserinfo();
app_handle.updateactivebuttonenable(false);
app_handle.showactiveview();


function get_size(){
    if (window.innerWidth)
        winWidth = window.innerWidth;
    else if ((document.body) && (document.body.clientWidth))
        winWidth = document.body.clientWidth;
    if (window.innerHeight)
        winHeight = window.innerHeight;
    else if ((document.body) && (document.body.clientHeight))
        winHeight = document.body.clientHeight;
    if (document.documentElement && document.documentElement.clientHeight && document.documentElement.clientWidth)
    {
        winHeight = document.documentElement.clientHeight;
        winWidth = document.documentElement.clientWidth;
    }
    console.log("winWidth = "+winWidth);
    console.log("winHeight= "+winHeight);
}

function GetRandomNum(Min,Max)
{
    var Range = Max - Min;
    var Rand = Math.random();
    return(Min + Math.round(Rand * Range));
}

function getRelativeURL(){
    var url = document.location.toString();
    var arrUrl= url.split("//");
    var start = arrUrl[1].indexOf("/");
    var reUrl=arrUrl[1].substring(start);
    if(reUrl.indexOf("?")!=-1) {
        reUrl = reUrl.split("?")[0];
    }
    var end = reUrl.lastIndexOf("/");
    reUrl=reUrl.substring(0,end);
    return reUrl;
}



function query_callback(res){
    if(res.jsonResult.status == "false"){
        app_handle.updateactivestatus(false);
        app_handle.updateactivenotes("登陆失败:"+res.jsonResult.msg);

        app_handle.updateactivebuttonenable(false);
        return;
    }
    if(res.jsonResult.auth == "false"){
        app_handle.updateactivestatus(false);
        app_handle.updateactivenotes("登陆失败:"+res.jsonResult.msg);
        app_handle.updateactivebuttonenable(false);

        return;
    }
    app_handle.updateactivestatus(true);
    app_handle.updateactivebuttonenable(false);

    app_handle.updateactivenotes("登陆成功！");
    setTimeout(function(){
        this.window.opener = null;
        window.close();
    },2000);
    return;

}
function jsonParse(res) {
    return res.json().then(jsonResult => ({ res, jsonResult }));
}
function fetchactivate(){
    //console.log(app_handle.getSelectedStat());
    //if(app_handle.getSelectedStat() == "--") return;
    let body={
        session:session_id
    };
    let listreq = {
        action:"XH_QRcode_Session_enable",
        body:body,
        type:"mod",
        user:user_id
    };
    fetch(request_head,
        {
            method:'POST',
            headers:{
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body:JSON.stringify(listreq)
        }).then(jsonParse)
        .then(query_callback)
        .catch( (error) => {
            console.log('request error', error);
            return { error };
        });
}
function fetchuserinfocallback(res){
    if(res.jsonResult.status == "false"){
        app_handle.updateactivestatus(false);
        app_handle.updateactivenotes("登陆失败:"+res.jsonResult.msg);
        return;
    }
    if(res.jsonResult.auth == "false"){
        app_handle.updateactivestatus(false);
        app_handle.updateactivenotes("登陆失败:"+res.jsonResult.msg);
        return;
    }
    let username = res.jsonResult.ret.username;
    user_id = res.jsonResult.ret.userid;
    app_handle.initializehead(username);
    app_handle.updateactivecode("您好："+username);
    app_handle.updateactivenotes("点击中部图标登录");
    app_handle.updateactivefetch(fetchactivate);
    app_handle.updateactivebuttonenable(true);
    return;
}
function fetchuserinfo(){
    //console.log(app_handle.getSelectedStat());
    //if(app_handle.getSelectedStat() == "--") return;
    let body={
        code:wechat_id
    };
    let listreq = {
        action:"XH_QRcode_Get_User_info",
        body:body,
        type:"query",
        user:"activeuser"
    };
    fetch(request_head,
        {
            method:'POST',
            headers:{
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body:JSON.stringify(listreq)
        }).then(jsonParse)
        .then(fetchuserinfocallback)
        .catch( (error) => {
            console.log('request error', error);
            return { error };
        });
}

function getWechatScope(){
    var url = document.location.toString();
    if(url.indexOf("code=")!=-1){
        var arrUrl= url.split("code=");
        var scope_value = arrUrl[1].split("&")[0];
        //log("code="+scope_value);
        if(scope_value.length>0 ){
            return scope_value;
        }
    }
    return "test";
}
function getSessionScope(){
    var url = document.location.toString();
    if(url.indexOf("xhsession=")!=-1){
        var arrUrl= url.split("xhsession=");
        var scope_value = arrUrl[1].split("#")[0];
        //log("code="+scope_value);
        if(scope_value.length>0 ){
            return scope_value;
        }
    }
    return "1234567890";
}