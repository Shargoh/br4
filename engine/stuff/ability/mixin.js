define(function(require){
    'use strict';
    var C = require("C"),
        React = require("react"),
        RDOM = require("reactDom"),
        CommonUtils = require("engine/utils/common"),
        DateUtils = require("engine/utils/date"),
        Factory = require("engine/factory");
    
    return {
        /**
         * для баффа - количество ходов
         * параметр step показывает когда был последний юз
         * для инстанта - количество ходов до спада кулдауна
         */
        getStepsDecorator:function(type){
            var steps,
                battle = C.getStore('fightStore'),
                item_params = this.props.config.item_params;
         
            if(
                !battle || 
                !item_params || 
                !item_params.steps || 
                (item_params.add_step === undefined && 
                item_params.step === undefined)
            ) return;

            //add_step - для баффа, step - для инстанта
            steps = item_params.steps + (item_params.add_step || item_params.step) - battle.get('round');

            if(steps > 0 && steps < 100){
                return React.createElement('div',{
                    className:'d-stuff-decorator-steps-'+type+'-'+item_params.type,
                    key:item_params.stack + 'steps' + item_params.id + Math.random().toString()
                },steps + ' ' + CommonUtils.plural(steps,['ход','хода','ходов']));
            }
        },
        /**
         * уровень способности. Если 0 - не показываем
         */
        getLevelDecorator:function(type){
            var item = this.props.item,
                level = item.level || 0;

            if(!level) return;

            return React.createElement('div',{
                className:'d-stuff-decorator-level-'+type,
                key:'level' + item.id + Math.random().toString()
            },CommonUtils.romanize(level));
        },
        /**
         * Дефолтный декоратор
         * количество зарядов (юзов для инстанта, возможностей снять заряд перед снятием баффа - для баффов)
         */
        getChargesDecorator:function(type){
            var item_params = this.props.config.item_params;
                
            if(item_params && item_params.charges > 1){
                return React.createElement('div',{
                    className:'d-stuff-decorator-charges-'+type,
                    key:item_params.charges + 'charges' + item_params.id + Math.random().toString()
                },item_params.charges);
            }
        },
        /**
         * Дефолтный декоратор
         * таймер баффа вне боя
         */
        getTimerDecorator:function(type){
            var item_params = this.props.config.item_params,
                timestamp;
            
            if(!item_params || !item_params.timer || !item_params.add_time) return;
            
            if(typeof item_params.timer == 'string'){
                timestamp = DateUtils.getDate(item_params.timer);
            }else{
                timestamp = item_params.add_time + item_params.timer*1000;
            }
            
            if(timestamp < Date.now()) return;
            
            return React.createElement('div',{
                className:'d-stuff-decorator-timer-'+type,
                key:item_params.add_time + item_params.id + Math.random().toString()
            },Factory.print('timer',{
                time:timestamp,
                options:{
                    need_normalize:true
                }
            }));
        },
        /**
         * Дефолтный декоратор
         * кулдаун инстана вне боя - по времени
         */
        getCooldownDecorator:function(type){
            var item_params = this.props.config.item_params,
                timestamp;
                
            if(!item_params || !item_params.cooldown || !item_params.cd_time) return;
            
            timestamp = item_params.cd_time + item_params.cooldown*1000;
            
            if(timestamp < Date.now()) return;
            
            return React.createElement('div',{
                className:'d-stuff-decorator-cooldown-'+type,
                key:item_params.add_time + item_params.id + Math.random().toString()
            },Factory.print('timer',{
                time:timestamp,
                options:{
                    need_normalize:true
                }
            }));
        },
        /**
         * Дефолтный декоратор
         * количество стаков баффа
         */
        getStackDecorator:function(type){
            var item_params = this.props.config.item_params;
            
            if(item_params && item_params.stack > 1){
                return React.createElement('div',{
                    className:'d-stuff-decorator-stack-'+type,
                    key:item_params.stack + 'stack' + item_params.id + Math.random().toString()
                },item_params.stack);
            }
        },
        getCostDecorator:function(type){
            var item_params = this.props.config.item_params,
                cost,
                elements = [],
                i;
            
            if(!item_params) return;
            
            cost = item_params.cost;
            
            if(cost && cost.length){
                i = cost.length;
                
                while(i--){
                    elements.push(C.getManager('stuff').print(cost[i]));
                }
                
                return elements;
            }
        }
    };
});
