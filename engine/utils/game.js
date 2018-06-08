define(function(require){
    'use strict';
    var _ = require("lodash"),
    
    /**
     * Методы, используемые в игровых элементах
     *  - getQualityColor
     *  - getTeamColor
     *  - getCriticalColor
     * Properties
     *  - colors
     */
    GameUtils =  {
        /**
         * Вернет цвет предмета по крутости
         */
        getQualityColor:function(quality){
            //return GAME.config.descriptions.quality[quality].image.color;
    
            // switch(quality){
            //     case 'poor':
            //         return '#52555a';
            //     case 'good':
            //         return '#009300';
            //     case 'perfect':
            //         return '#385f5c';
            //     case 'excellent':
            //         return '#9920ff';
            //     case 'legendary':
            //         return '#a14806';
            // }  
    	},
    	/**
    	 * Вернет цвет команты в зависимости от ее номера
    	 */
    	getTeamColor:function(team){
            var teamColors = {
                0:'yellow',
                1:'orange',
                2:'lime',
                3:'white',
            }; 
            
            return teamColors[team];
    	},
    	/**
    	 * Вернет цвет от красного до зеленого в зависимости от повреждений
    	 */
    	getCriticalColor:function(cur,max){
            cur = parseFloat(cur);
            max = parseFloat(max);
            if(cur/max > 0.66){
                return 'lime';
            }else if(cur/max < 0.33){
                return 'red';
            }else{
                return 'yellow';
            }
    	},
        /**
         * Некоторые цвета, которые динамически используются во многих местах
         */
    	colors:{
            negative:'red',
            disabled:'#999',
            positive:'lime'
    	},
    };

    return  GameUtils;
});
