/**
 * Общие полезности для преобразования элементов
 *  - capitalize
 *  - camelize
 *  - makeMethod
 *  - printNumber
 *  - plural
 *  - escapeHtml
 *  - prepareHtml
 */
const CommonUtils = {
    /**
     * Текст с большой буквы
     */
    capitalize : function(str) {
        return str.charAt(0).toUpperCase() + str.substring(1);
    },
    /**
     * преобразут some_action в someAction
     */
    camelize:function(str) {
        return str?str.replace(/[-_\s]+(.)?/g, function(match, c) {
            return c ? c.toUpperCase() : '';
        }):'';
    },
    romanize:function(num) {
        if (!+num)
            return false;
        var digits = String(+num).split(""),
            key = ["","C","CC","CCC","CD","D","DC","DCC","DCCC","CM",
                    "","X","XX","XXX","XL","L","LX","LXX","LXXX","XC",
                    "","I","II","III","IV","V","VI","VII","VIII","IX"],
            roman = "",
            i = 3;
        while (i--)
            roman = (key[+digits.pop() + (i * 10)] || "") + roman;
        return Array(+digits.join("") + 1).join("M") + roman;
    },
    /**
     * преобразут some_action в prefix+SomeAction
     */
    makeMethod:function(prefix,str){
        return prefix+this.capitalize(this.camelize(str));
    },
    /**
     * Преобразует число в вид типа 4.9К
     */
    printNumber:function(num){
        if(num >= 1000000){
            num = Math.floor(window.parseInt(num)/1000000)+'М';
        }else{
            if(num >= 10000){
                num = Math.floor(window.parseInt(num)/1000)+'К';
            }/*else{
                if(num >= 1000){
                    num = Math.floor(window.parseInt(num)/100)/10+'К';
                }
            }*/
        }
        return num;
    },
    /**
     * Возвращает единицу измерения с правильным окончанием
     * 
     * @param {Number} num Число
     * @param {String[]} cases Варианты слова, например ['час', 'часа', 'часов']
     * @return {String}
     */
    plural: function(num, cases) {
        num = Math.abs(num);

        var word = '';

        if (num || num == 0) {
            if (num.toString().indexOf('.') > -1) {
                word = cases[1];
            } else { 
                word = (
                    num % 10 == 1 && num % 100 != 11 
                        ? cases[0]
                        : num % 10 >= 2 && num % 10 <= 4 && (num % 100 < 10 || num % 100 >= 20) 
                            ? cases[1]
                            : cases[2]
                );
            }
        }

        return word;
    },
    escapeHtml:function(text){
        return text
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    },
    prepareHtml:function(text){
        return text
            .replace(/&amp;/g, "&")
            .replace(/&lt;/g, "<")
            .replace(/&gt;/g, ">")
            .replace(/&quot;/g, '"')
            .replace(/&#039;/g, "'");
    },
    compact: function(arr){
        var i = arr.length;
        
        while(i--){
            if(!arr[i] && arr[i] !== 0) arr.splice(i,1);
        }
        
        return arr;
    }
};

export default CommonUtils;