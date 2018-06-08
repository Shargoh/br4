/*global define
*/
define(function(require){
    "use strict";
    var _ = require("lodash"),
        C = require("C"),
        Manager = require("./proto"),
        Reflux = require("reflux"),
        GlobalActions = require("engine/actions"),

    StuffManager = function() {
        var me = this;

        Manager.apply(me,arguments);
        me.type = 'stuff';

        me.types = {};
		me.objects = [];

		//хеш абилок для подгрузки с сервера. Потом также будет для предметов
		me.abilities = {};

		// регистрирую классы базовых типов имущества
		me.register({'item':require("engine/stuff/item/stuff")});
		me.register({'ability':require("engine/stuff/ability/stuff")});
		me.register({'bonus':require("engine/stuff/bonus/stuff")});
		me.register({'other':require("engine/stuff/bonus/stuff")});
		me.register({'timed':require("engine/stuff/bonus/stuff")});
		me.register({'resources':require("engine/stuff/currency/stuff")});
		me.register({'ship':require("engine/stuff/ship/stuff")});

		Reflux.ListenerMethods.listenTo(GlobalActions.showReward,function(){
            me.onShowReward.apply(me,arguments);
        });
    };

    StuffManager.prototype = _.extend(Object.create(Manager.prototype),{
        constructor : StuffManager,
        register:function (config) {
            for(var name in config){
                this.types[name] = config[name];
            }
        },
        image:function(config){
            if(!Array.isArray(config)) config = [config];
            var i = config.length,
                els = [],
                el;

            while(i--){
                el = new this.types[config[i].type](config[i]);
                els.push(el.image(config[i]));
            }

            return els;
        },
        print:function(config){
            if(!Array.isArray(config)) config = [config];
            var i = config.length,
                els = [],
                el;

            while(i--){
                el = new this.types[config[i].type](config[i]);
                els.push(el.print(config[i]));
            }

            return els;
        },
        printLarge:function(config){
            if(!Array.isArray(config)) config = [config];
            var i = config.length,
                els = [],
                el;

            while(i--){
                el = new this.types[config[i].type](config[i]);
                els.push(el.printLarge(config[i]));
            }

            return els;
        },
        onShowReward:function(stuff){
            C.getManager('window').showAlert(['Получено #stuff|'+JSON.stringify(stuff)+'#']);
        }
    });

    return StuffManager;
});