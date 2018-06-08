/*global define
*/
define(function(require){
    "use strict";
    var _ = require("lodash"),
        C = require("C"),
        CommonUtils = require("engine/utils/common"),
        Manager = require("./proto"),
        GeneralDialog = require("dialog/general"),
        FightDialog = require("dialog/fight"),
        UserDialog = require("dialog/user"),
        MobGroupDialog = require("dialog/mob_group"),
        ConfirmDialog = require("dialog/confirm"),
        WndDialog = require("dialog/dl_wnd"),
        Reflux = require("reflux"),
        GlobalActions = require("engine/actions"),
        Mixin = require("stores/mixin/user"),
        React = require("react"),
        RDOM = require("reactDom"),
        places = [],
        counter = 0,

    /**
     * Класс окна
     *  opts
     *  - autoRender - Boolean. defaults true. Отображать ли окно сразу
     *  - title - String. заголовок окна
     *  - classList - Array. массив классов окна
     *  - listeners - Object.
     *      destroy
     *      render
     *      activate
     */
    Wnd = function(opts){
        _.extend(this,opts);

        var i = 0;

        while(places[i]) i++;

        this.place = i;
        this.id = counter++;
        places[i] = this;

        if(this.autoRender){
            this.render();
        }
    },

    WindowManager = function() {
        var me = this;

        Manager.apply(this,arguments);
        me.type = 'window';

        document.body.addEventListener('click',function(e){
            var is_dialog_parent = C.findParentById(e.target,'wrap-dialog'),
                is_item_dialog_parent = C.findParentById(e.target,'wrap-item-dialog');

            if(!is_dialog_parent && !is_item_dialog_parent){
                RDOM.unmountComponentAtNode(document.getElementById('wrap-dialog'));
            }

            if(!is_item_dialog_parent){
                RDOM.unmountComponentAtNode(document.getElementById('wrap-item-dialog'));
            }
        });

        Reflux.ListenerMethods.listenTo(GlobalActions.showAlert,function(){
            me.showAlert.apply(me,arguments);
        });

        Reflux.ListenerMethods.listenTo(GlobalActions.showConfirm,function(){
            me.showConfirm.apply(me,arguments);
        });

        Reflux.ListenerMethods.listenTo(GlobalActions.removeConfirm,function(){
            var container = document.getElementById('wrap-confirm');

            container.style.display = 'none';

            RDOM.unmountComponentAtNode(container);
        });
    };

    Wnd.prototype = {
        autoRender: true,
        classList:[],
        listeners:{},
        getStyles:function(){
            var styles = {};

            styles.left = ((window.innerWidth/2-444 < 0) ? 0 : window.innerWidth/2-444+this.place*25) + 'px';
			styles.top = ((window.innerHeight/2-244 < 39) ? 39 : window.innerHeight/2-244+this.place*25) + 'px';

            return styles;
        },
        getContainer:function(){
            var container = document.getElementById('wnd-container-'+this.id);

            if(container) return container;

            container = document.createElement('div');
            container.id = 'wnd-container-'+this.id;
            document.getElementById('wrap-wnds').appendChild(container);

            return container;
        },
        render:function(){
            var me = this,
                el = RDOM.render(React.createElement('div',{
                    className: ['wnd'].concat(me.classList).join(' '),
                    style: me.getStyles()
                },
                React.createElement('div', {className: 'wnd-title'}, me.title),
                React.createElement('div', {className:'close-btn',onClick:me.destroy.bind(me)},C.template('&#10006;')),
                me.innerHtml
            ),me.getContainer());

            me.el = RDOM.findDOMNode(el);
            me.el.onclick = me.activate.bind(me);

            C.getManager('lock').lock();

            if(me.listeners.render)
                me.listeners.render();
        },
        activate:function(){
            var me = this;

            if(!me.el || me.el.style.zIndex == 31) return;

            var wnds = document.getElementsByClassName('wnd'),
                i = wnds.length;

            while(i--){
                wnds[i].style.zIndex = '';
            }

            me.el.style.zIndex = 31;

            if(me.listeners.activate)
                me.listeners.activate();
        },
        destroy:function(){
            this.destroyed = true;

            var container = this.getContainer();

            this.el.onclick = null;
            delete this.el;

            places[this.place] = undefined;

            RDOM.unmountComponentAtNode(container);
            container.remove();

            C.getManager('lock').unlock();

            if(this.listeners.destroy)
                this.listeners.destroy();
        }
    };

    WindowManager.prototype = _.extend(Object.create(Manager.prototype),{
        constructor:WindowManager,
        createWnd:function(opts){
            return new Wnd(opts);
        },
        closeAllWindows:function(){
            var i = places.length;

            while(i--){
                if(places[i]){
                    places[i].destroy();
                }
            }

            places = [];

            C.closeTooltips();
            this.destroyDlWnd();

            RDOM.unmountComponentAtNode(document.getElementById('wrap-dialog'));
            RDOM.unmountComponentAtNode(document.getElementById('wrap-item-dialog'));
        },
        hasWindowsOpen:function(){
            return document.getElementById('wrap-wnds').childNodes.length;
        },
        //dialog
        createDialog:function(data,element){
            var type = data.dialog.type,
                methodName = CommonUtils.makeMethod('_create',type)+'Dialog';

            if(this[methodName])
                return this[methodName](data,element);
        },
        _createGeneralDialog:function(data,element){
            var props = element.props.store ? element.props.store.attributes : element.props;

            return RDOM.render(
                React.createElement(GeneralDialog,{
                    data:{
                        title:data.dialog.params.title,
                        description:data.dialog.params.descr,
                        buttons:this._prepareDialogButtons(data,props.id,props.object_id)
                    },
                    element:element
                }),
                document.getElementById('wrap-dialog')
            );
        },
        _createFightDialog:function(data,element){
             return RDOM.render(
                React.createElement(FightDialog,{
                    data:{
                        title:data.dialog.params.title,
                        description:data.dialog.params.descr,
                        teams:data.dialog.teams,
                        intervene:data.dialog.intervene,
                        max_teams:data.dialog.max_teams
                    },
                    element:element
                }),
                document.getElementById('wrap-dialog')
            );
        },
        _createUserDialog:function(data,element){
            var store = Reflux.createStore({
            	    mixins:[Mixin]
            	}),
            	marker_store = element.props.store;

            store.set(data.user);

            return RDOM.render(
                React.createElement(UserDialog,{
                    user:store,
                    buttons:this._prepareDialogButtons(data,marker_store.get('id'),marker_store.get('object_id')),
                    element:element
                }),
                document.getElementById('wrap-dialog')
            );
        },
        _createMobGroupDialog:function(data,element){
            var self = this,
                store = element.props.store;

            C.loadProto('ability',data.dialog.params.abilities).then(function(){
                RDOM.render(
                    React.createElement(MobGroupDialog,_.extend({
                        buttons:self._prepareDialogButtons(data,store.get('id'),store.get('object_id')),
                        element:element
                    },data.dialog.params)),
                    document.getElementById('wrap-dialog')
                );
            });
        },
        _prepareDialogButtons:function(data,marker_id,object_id){
            return _.map(data.api,function(api){
                return {
                    text:api.title,
                    confirm:api.confirm,
                    key:api.name,
                    type:'dl',
                    attrs:{
                        id:api.name + '_apibtn'
                    },
                    handler:function(){
                        C.api((api.api || 'map')+':'+api.name,{
                            marker_id:marker_id,
                            object_id:object_id
                        }).then(function(data){
                            RDOM.unmountComponentAtNode(document.getElementById('wrap-dialog'));
                            RDOM.unmountComponentAtNode(document.getElementById('wrap-item-dialog'));
                        });
                    }
                };
            });
        },
        /***Alert ***/
        message_queue:[],
        messages_in_progress:false,
        /**
         * messages - Array
         */
        showAlert:function(messages){
            this.message_queue.push.apply(this.message_queue,messages);

            this._startAlert();
        },
        _startAlert:function(){
            if(this.messages_in_progress) return;

            this.messages_in_progress = true;

            this._showAlert(this.message_queue.shift());
        },
        _showAlert:function(message){
            if(!message) return;

            var me = this,
                to_top = 170,
                delay = 700,
                fade_time = 1500,
                i = Math.ceil(fade_time/40),
                px_per_i = to_top/i,
                opacity_per_i = 1/i,
                el = document.createElement('div');

            el.className = 'alert';
            el.style.opacity = 1;
            el.style.marginTop = 0;
            el.style.position = 'absolute';
            el.style.left = 0;
            el.style.right = 0;
            el.style.textAlign = 'center';
            el.id = Math.random();

            // inner.className = 'alert-inner';
            // inner.innerHTML = message;
            // el.appendChild(inner);

            RDOM.render(React.createElement('div',{className:'alert-inner'},C.template(message)),el);

            document.getElementById('wrap-alert').appendChild(el);

            setTimeout(function(){
                var message = me.message_queue.shift();

                if(!me.message_queue.length){
                    me.messages_in_progress = false;
                }

                var interval = setInterval(function(){
                    i--;

                    if(i){
                        el.style.marginTop = (parseInt(el.style.marginTop,10) - px_per_i) + 'px';
                        el.style.opacity = Math.max(0,Number(el.style.opacity) - opacity_per_i);
                    }else{
                        clearInterval(interval);
                        el.remove();
                    }
                },40);

                setTimeout(function(){
                    me._showAlert(message);
                },200);
            },delay);
        },
        /*** Confirmation ***/
        showConfirm:function(data){
            var container = document.getElementById('wrap-confirm');

            container.style.display = 'block';

            return RDOM.render(React.createElement(ConfirmDialog,data),container);
        },
        createWndDialog:function(data){
            var container = document.getElementById('wrap-wnd-dialog');

            container.style.display = 'block';

            return RDOM.render(React.createElement(WndDialog,data),container);
        },
        destroyDlWnd:function(){
            var container = document.getElementById('wrap-wnd-dialog');

            container.style.display = 'none';

            RDOM.unmountComponentAtNode(container);
        }
    });

    return WindowManager;
});