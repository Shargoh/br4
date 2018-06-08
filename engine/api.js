define(function(require){
    'use strict';
    var _ = require("lodash"),
        io = require("io"),
        GlobalActions = require("./actions"),
        DateUtil = require("./utils/date"),
        C = require("C"),
        Factory = require("engine/factory"),
        
    API = function(){
        var api = this;
        // this.socket = io.connect(location.hostname);
        this.socket = io(location.hostname,{ transports: ['websocket'] });
        //socket events
        this.socket.on('push',function(data){
            api.parseData(data);
        });
        
        this.connected = false;
        
        //последний запрос, который пытались спросить во время дисконнекта
        var waiting_request = null;
        
        this.socket.on('disconnect',function() {
            console.log('disconnect');
            api.connected = false;
            api.disconnectTimeout = setTimeout(function() {
                location.href = location.origin;
            },30000);
        });
        
        this.socket.on('server_listening',function() {
            console.log('server_listening');
            api.connected = true;
            if(waiting_request){
                waiting_request.fn();
                waiting_request = null;
            }
            if(api.disconnectTimeout) clearTimeout(api.disconnectTimeout);
        });
        
        this.socket.on('battle',function(data) {
            GlobalActions.event('battle',data);
        });
        
        this.socket.on('worldTick',function(data) {
            GlobalActions.event('world_tick',data);
        });
        
        return function(cmd,data) {
            return this.promise(function(resolve,reject){
                var time = Date.now(),
                    request = {
                        api: cmd.split(':')[0],
                        cmd: cmd.split(':')[1],
                        data: data
                    },
                    marker_id = (data) ? data.marker_id : undefined,
                    fn = function(){
                        C.getManager('lock').addLoader(2000);
                        
                        api.socket.emit('api', request, function(data){
                            if(!C.getManager('lock').prevent_api_unlock){
                                C.getManager('lock').removeLoader();
                            }
                            
                            if(!data) return reject();
                            
                            if(data && marker_id && data.data){
                                data.data.marker_id = marker_id;
                            }
                            
                            data = api.parseData(data,Date.now() - time);
                            
                            if(!data.err)
                                resolve(data);
                            else
                                reject();
                        });
                    };
                    
                console.log('запрос к api "' + request.api + '" на выполнение команды "' + request.cmd + '"', data);
                
                if(api.connected){
                    fn();
                }else{
                    if(waiting_request){
                        waiting_request.reject();
                    }
                    
                    waiting_request = {
                        reject:reject,
                        fn:fn
                    };
                }
            });
        };
    };

    API.prototype = {
        parseData:function(data,time){
            console.log(time || 'push',data,data.user);

            //синхронизирую время
            DateUtil.setServerTimeDif(data.now);
            delete data.now;
    
            if(data.href) return window.location.href = data.href;
            
            if(data.user){
                GlobalActions.setUser(data.user);
                delete data.user;
            }
            
            if(data.err){
                GlobalActions.showAlert(data.err);
                delete data.err;
                data.success = 0;
            }else data.success = 1;
            
            if(data.msg){
                GlobalActions.showAlert(data.msg);
                delete data.msg;
            }
            
            if(data.direction){
                GlobalActions.showModule('Direction',data.direction);
                delete data.direction;
            }
            
            if(data.npc){
                GlobalActions.showModule('Npc',data.npc);
                delete data.npc;
            }
            
            if(data.update_location){
                GlobalActions.event('update_location',data.update_location);
                delete data.update_location;
            }
            
            if(data.chat){
                GlobalActions.addChatMessage(data.chat);
                delete data.chat;
            }
            
            if(data.reward){
                GlobalActions.showReward(data.reward);
                delete data.reward;
            }
            
            if(data.move_map){
                GlobalActions.moveMap(data.move_map);
                delete data.move_map;
            }
            
            if(data.close_windows){
                GlobalActions.closeWindows();
                delete data.close_windows;
            }
            
            if(data.instance_aims){
                GlobalActions.setInstanceAims(data.instance_aims);
                delete data.instance_aims;
            }
            
            if(data.confirmation){
                if(data.confirmation.data && data.confirmation.data.user){
                    data.confirmation.data.user = Factory.print('user',data.confirmation.data.user);
                }
                
                if(data.confirmation.data && data.confirmation.data.timestamp){
                    data.confirmation.data.timestamp = Factory.print('timer',{
                        time:data.confirmation.data.timestamp,
                        className:'inline-block',
                        options:{
                            need_normalize:true
                        }
                    });
                }

                GlobalActions.showConfirm(data.confirmation);
                delete data.confirmation;
            }else if(data.confirmation == false){
                GlobalActions.removeConfirm();
                delete data.confirmation;
            }
            
            if(data.battles){
                GlobalActions.updateBattles(data.battles);
                delete data.battles;
            }
            
            if(data.module){
                GlobalActions.showModule(data.module,data.data);
                delete data.module;
                delete data.data;
            }
            
            return data;
        }
    };
    
    return  API;
});
