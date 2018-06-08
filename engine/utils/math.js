define(function(require){
    'use strict';
    var _ = require("lodash"),
    
    /**
     * Математические методы
     *  - setAngleToRightRange
     *  - calcDistanceBetweenTwoPoints
     */
    MathUtils = {
        /**
         * Приводит угол к диапазону от -180 до 180
         */
        setAngleToRightRange:function(angle){
    	    while (angle <= -180){
                angle += 360;
            }
            
            while (angle > 180){
                angle -= 360;
            }
            
            return angle;
    	},
    	/**
    	 * Считает целочисленное расстояние между точками
    	 */
    	calcDistanceBetweenTwoPoints:function(a,b){
    	    return Math.floor(Math.sqrt(Math.pow(a.x - b.x,2) + Math.pow(a.y - b.y,2)));
    	},
    	angle: function(p1,p2,deg){
            // if (p3){
            //     return Math.abs(this.angle(p1, p3) - this.angle(p2, p3));
            // }
            
            var angle = Math.atan2(p2.y - p1.y, p2.x - p1.x);
            
            if(deg){
                return this.trimAngle(Math.round(angle*180/Math.PI));
            }else{
                while (angle < 0){
                    angle += 2 * Math.PI;
                }
                
                return angle;
            }
        },
        trimAngle:function(angle){
            while (angle <= -180){
                angle += 360;
            }
            
            while (angle > 180){
                angle -= 360;
            }
            
            return angle;
        }
    };

    return  MathUtils;
});
