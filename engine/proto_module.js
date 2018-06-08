"use strict";
import Reflux from 'reflux';
import CommonUtils from './utils/common.js';
import GlobalActions, { ChatConnectionActions } from './actions.js';

export default class Module{
    constructor(){
        var me = this;
        Reflux.ListenerMethods.listenTo(GlobalActions.showModule,function(){
            me.onShowModule.apply(me,arguments);
        });
        Reflux.ListenerMethods.listenTo(GlobalActions.init,function(){
            me.onInit.apply(me,arguments);
        });
        Reflux.ListenerMethods.listenTo(GlobalActions.event,function(){
            me.onEvent.apply(me,arguments);
        });
        Reflux.ListenerMethods.listenTo(ChatConnectionActions.messageCommand,function(){
            me.onCommand.apply(me,arguments);
        });
        Reflux.ListenerMethods.listenTo(GlobalActions.userChanged,function(){
            me.onUserChanged.apply(me,arguments);
        });
    }
    listenTo(action,method_name){
        var me = this;

        if(!me[method_name]) return;

        Reflux.ListenerMethods.listenTo(action,function(){
            me[method_name].apply(me,arguments);
        });
    }
    init(){
        GlobalActions.log('module '+this.name+' init');
    }
    onShowModule(name,data){
        if(this.name == name){
            this.show(data);
        }
    }
    onInit(){}
    onEvent(evtName,view,data){
        var methodName = CommonUtils.makeMethod('on',evtName);
        if(this[methodName] && typeof this[methodName] == 'function'){
            this[methodName](view,data);
        }
    }
    onCommand(evtName,data){
        var methodName = CommonUtils.makeMethod('command',evtName);

        if(this[methodName] && typeof this[methodName] == 'function'){
            this[methodName](data);
        }
    }
    show(data){
        GlobalActions.log('showing module '+this.name);
    }
    onUserChanged(store){}
};