/**
 * Методы работы со временем
 *  - printTime
 *  - getDate
 *  - setServerTimeDif
 *  - normalizeDate
 */
var DateUtils =  {
    /**
     * Преобразовывает время из числа в вид чч:мм:сс
     */
    printTime:function(time,options){
        if(!options) options = {};
        time = this.getDate(time);

        if(options.need_normalize){
            time = Math.max(0,this.normalizeDate(time));
        }

        var y,mo,d,h,m,s,tmo,td,th,tm,ts,arr = [];
        
        if(options.dateOnly && Date.now() > time) time += Date.now();
        else if(options.until && Date.now() < time) time -= Date.now();

        if(time < Date.now()/2){//значит надо отобразить сколько осталось
            s = Math.ceil(time/1000)%60;
            m = Math.floor((time + 100)/(1000*60))%60;
            h = Math.floor((time + 100)/(1000*60*60))%24;
            d = Math.floor((time + 100)/(1000*60*60*24));
        }else{
            time = new Date(time);

            s = time.getSeconds();
            m = time.getMinutes();
            h = time.getHours();
            d = new Date().getDate() != time.getDate() ? time.getDate() : 0;
            mo = new Date().getMonth() != time.getMonth() ? time.getMonth() + 1 : 0;
            y = new Date().getYear() != time.getYear() ? time.getYear() : 0;
            
            td = time.getDate();
            td = (td < 10) ? '0'+ td : td;
            
            tmo = time.getMonth() + 1;
            tmo = (tmo < 10) ? '0'+ tmo : tmo;
        }
        
        th = (h < 10) ? '0'+ h : h;
        tm = (m < 10) ? '0'+ m : m;
        ts = (s < 10) ? '0'+ s : s;
        
        switch (options.type) {
            case 'h:m':
                return th +':'+ tm;
            case 'd.mo':
                return td +'.'+ tmo;
            case 'twonums':
                if(d){
                    return d +':'+ th;
                }else if(h){
                    return th +':'+ tm;
                }else{
                    return tm +':'+ ts;
                }
            case 'long':
                if(d) arr.push(d +'д');
                if(d || h) arr.push(h +'ч');
                if(d || m) arr.push(m +'м');
                if(s) arr.push(s +'с');
                
                return arr.slice(0,3).join(' ');
            case 'short':
                if(d) arr.push(d +'д');
                if(d || h) arr.push(h +'ч');
                if(d || m) arr.push(m +'м');
                if(s) arr.push(s +'с');
                
                return arr.slice(0,2).join(' ');
            case 'short_eng':
                if(d) arr.push(d +'d');
                if(d || h) arr.push(h +'h');
                if(d || m) arr.push(m +'m');
                if(s) arr.push(s +'s');
                
                return arr.slice(0,2).join(' ');
            default:
                h += d*24;
                if(h) arr.push(d ? h : th);
                arr.push(tm);
                arr.push(ts);
                
                return arr.join(':');
        }
    },
    jsCoreDateCreator:(dateString) => { 
        // dateString *HAS* to be in this format "YYYY-MM-DD HH:MM:SS"  
        let dateParam = dateString.split(/[\s-:]/)  
        dateParam[1] = (parseInt(dateParam[1], 10) - 1).toString()  
        return new Date(...dateParam)  
    },
    /**
     * Вернет дату в виде таймстампа
     */
    getDate:function(date){
        if(date === undefined || date === null) return Date.now();
        if(typeof date == 'string'){
            switch (date.length){
                case 10: return parseInt(date,10)*1000;
                case 13: return parseInt(date,10);
                default: return Date.parse(date);
            }
        }
        if(isNaN(date)) return Date.now();
        if(typeof date == 'number') return date;
    },
    /**
     * Сет разницы во времени между локальным и серверным
     */
    setServerTimeDif:function(now){
        this.serverTimeDif = Date.now() - now;
    },
    /**
     * Преобразует серверное время в локальное
     */
    normalizeDate:function(date){
        return date && this.serverTimeDif ? date + this.serverTimeDif : date;
    },
};

export default DateUtils;
