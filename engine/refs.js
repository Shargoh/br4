/**
 * Список возможных состояний приложения:
 * - main_page
 * - mod_group
 * - market
 * - images
 * - constants_list
 * - user_hint
 * - user_stat
 * - user_modif
 * - user_hoard
 * - user_summary
 * - user_money
 * - user_level
 * - user_trophy
 * - user_shape
 * - user_stuff
 * - user_timed
 * - item_type
 * - slot_type
 * - prototypes_rooms
 * - referer_action
 * - battle_strike
 * - battle_ability_school
 * - battle_log
 * - battle_types
 * - battle_bids_types
 * - constants
 * - components - компоненты
 * - components_objects - компоненты-объекты
 * - components_instances - компоненты реализация
 * - client_actions - клиентские действия
 * - service_protos - прототипы сервисов
 * - message_client - клиентские сообщения
 * - user_directions - справочник указаний
 * - user_settings - настройки пользователя
 * - battle_animations - анимации
 * - battle_turn - базовые действия в бою
 * - battle_prep - предварительные действия в бою
 * - battle_aura - aura в бою
 * - battle_continuing - длящиеся
 * - sounds - звуки
 * - direct_actions
 */
import * as types from '../constants/actions.js';
import * as constants from '../constants/common.js';
import GlobalActions from './actions.js';

const BLANK_IMAGE_URL = constants.BLANK_IMAGE_URL;

var references;

/**
 * 
 * @param {String} ref_name - название справочника для refs
 * @param {String} key - ключ для объекта
 * @param {Function} compile - метод, если нужно как-то особенно сохранить данные
 * @param {String} config_ref_name - название в конфиге, если отличается от названия для справочника
 */
function prepareRef(refs,ref_name,key,compile,config_ref_name){
  var obj = {};

  config_ref_name = config_ref_name || ref_name;

  if(!references[config_ref_name]){
    GlobalActions.log('Отстутствуют данные справочника',config_ref_name);
    return;
  }

  if (references[config_ref_name].length) {
    for (let i = 0; i < references[config_ref_name].length; i++) {
      let item = references[config_ref_name][i];

      obj[item[key]] = compile ? compile(item) : item;
    }
  }

  refs[ref_name] = obj;
}

function prepareReferences(config_references) {
  var refs = {};

  references = config_references;

  // справочник некоторых констант
  prepareRef(refs,'main_page','name',(item) => {
    return {
      data: item.data,
      value: item.value
    };
  });

  // справочник прототипов комнат "prototypes_rooms" (не приходит справочник)
  // prepareRef(refs,'prototypes_rooms','entry');

  // справочник групп модерирования
  var mod_group = {
    0:{
      images:{
        main:constants.BLANK_IMAGE_URL
      },
      label:'Без группы',
      order:Infinity
    }
  };

  for (i = 0; i < references.mod_group.length; i++) {
    let item = references.mod_group[i];

    item.entry = Number(item.entry);
    item.order = item.order ? Number(item.order) : 0;
    item.images.main = item.images.main ? item.images.main : constants.BLANK_IMAGE_URL;

    mod_group[item.entry] = item;
  }

  refs.mod_group = mod_group;

  // справочник звуков
  prepareRef(refs,'sounds','name',(item) => {
    return {
      file: item.params.file,
      label: item.label,
      description: item.description,
      pause: item.params.pause,
      fading: item.params.fading
    };
  });

  // справочник картинок
  prepareRef(refs,'images','name',(item) => {
    let data = {};

    for(let j = 0; j < item.data.length; j++){
      let image = item.data[j];

      data[image.name] = image.value;
    }

    return {
      label: item.label,
      description: item.description,
      image: data
    };
  });

  // справочник констант
  prepareRef(refs,'constants_list','name',(item) => {
    let data = {};

    data.label = item.label;
    data.value = [];

    for (let j = 0; j < item.value.length; j++) {
      data.value.push(item.value[j].v);
    }

    return data;
  });

  // справочник подсказок
  var hints = {};

  for (let i = 0; i < references.user_hint.length; i++) {
    let item = references.user_hint[i];

    if(!hints[item.label]){
      hints[item.label] = [];
    }

    hints[item.label].push(item);
  }

  for(let key in hints){
    hints[key].sort(function(a,b){
      return a.l_order > b.l_order;
    });
  }

  refs.user_hint = hints;

  // справочник статов
  prepareRef(refs,'user_stat','name',(item) => {
    return {
      label: item.label,
      visible: Number(item.visible),
      param: item.param
    };
  });

  // справочник модификаторов
  prepareRef(refs,'user_modif','name',(item) => {
    return {
      label: item.label,
      visible: Number(item.visible)
    };
  });

  // справочник накопительных характеристик
  prepareRef(refs,'user_hoard','name',(item) => {
    return {
      label: item.label,
      icon: item.params.icon,
      image_big: item.params.image,
      image_disabled: item.params.image_disabled,
      visible: Number(item.visible)
    };
  });

  // справочник суммируемых характеристик
  prepareRef(refs,'user_summary','name',(item) => {
    return {
      label: item.label,
      icon: item.params.icon,
      visible: Number(item.visible)
    };
  });

  // справочник валют
  prepareRef(refs,'user_money','name',(item) => {
    item.image = item.param.image
    item.image_big = item.param.image_big
    item.image_disabled = item.param.image_disabled
    item.visible = Number(item.visible);

    return item;
  });

  // справочник уровней
  var levels = {};

  if (references.levels.levels.length) {
    for (let i = 0; i < references.levels.levels.length; i++) {
      let item = references.levels.levels[i];

      for(let j = 0; j < references.user_level.length; j++){
        let ulvl = references.user_level[j];

        if(item.level == ulvl.level){
          for(let key in ulvl){
            if(!item[key]){
              item[key] = ulvl[key];
            }
          }
        }
      }

      item.level = Number(item.level);
      item.expa = Number(item.expa);
      item.base = item.data.expa_base;

      levels[item.level] = item;
    }
  }

  levels.next_sublevel = references.levels.next_sublevel;
  refs.user_level = levels;

  // справочник доблести
  if (references.user_valour.length) {
    references.user_valour.sort(function(a,b){
      return a.level - b.level;
    });

    prepareRef(refs,'user_valour','level',(item) => {
      item.level = Number(item.level);
      item.valour = Number(item.valour);
      item.data.img = item.data.img ? item.data.img : '';

      return item;
    });
  }

  // справочник образов
  prepareRef(refs,'user_shape','name',(item) => {
    item.thumb = item.small ? item.small : BLANK_IMAGE_URL;
    item.avatar = item.medium ? item.medium : BLANK_IMAGE_URL;
    item.full = item.large ? item.large : BLANK_IMAGE_URL;
    item.battle = item.battle ? item.battle : BLANK_IMAGE_URL;

    delete item.large;
    delete item.medium;
    delete item.small;

    if(item.modif && item.modif.length){
      for(let j = 0; j < item.modif.length; j++){
        let el = item.modif[j];

        el.thumb = el.small ? el.small : BLANK_IMAGE_URL;
        el.avatar = el.medium ? el.medium : BLANK_IMAGE_URL;
        el.full = el.large ? el.large : BLANK_IMAGE_URL;
        el.battle = el.battle ? el.battle : BLANK_IMAGE_URL;

        delete el.large;
        delete el.medium;
        delete el.small;
      }
    }

    return item;
  });

  // справочник имущества
  prepareRef(refs,'user_stuff','name');

  // справочник восстанавливаемых характеристик
  prepareRef(refs,'user_timed','stat',(item) => {
    item.visible = Number(item.visible);

    return item;
  });

  // справочник типов предметов
  prepareRef(refs,'item_type','name',(item) => {
    return {
      title: item.title,
      slot_on: Number(item.slot_on),
      slot_off: Number(item.slot_off),
      param: item.param
    }
  });

  // справочник типов слотов
  prepareRef(refs,'slot_type','entry',(item) => {
    if(typeof item.images == 'object'){
      for(let key in item.images){
        item.images[key] = item.images[key];
      }
    }

    return {
      title: item.title,
      stack: Number(item.stack),
      active: Number(item.active),
      images: item.images
    }
  });

  // справочник боевых логов
  var battle_logs = {};

  if (references.battle_log.length) {
    for (let i = 0; i < references.battle_log.length; i++) {
      let item = references.battle_log[i];

      battle_logs[item.type + '_' + (item.result || '')] = {
        pattern : item.pattern,
        data: item.data
      };
    }
  }

  refs.battle_log = battle_logs;

  // справочник типов поединков
  prepareRef(refs,'battle_types','entry',(item) => {
    item.params.img = item.params.img ? item.params.img : BLANK_IMAGE_URL;
    item.params.img_list = item.params.img_list ? item.params.img_list : BLANK_IMAGE_URL;
    item.params.img_stat = item.params.img_stat ? item.params.img_stat : BLANK_IMAGE_URL;

    return {
      label: item.label,
      params: item.params
    }
  });

  // константы
  prepareRef(refs,'constants','name',(item) => {
    return {
      label: item.label,
      value: item.value
    }
  });

  // клиентские компоненты
  prepareRef(refs,'components','id',null,'client_components');

  //сервисы
  var service_protos = {},
    services = {},
    client_actions = {};

  if (references.service_protos.length) {
    for (let i = 0; i < references.service_protos.length; i++) {
      let item = references.service_protos[i];

      service_protos[item.id] = item;
    }
  }

  if (references.client_actions.length) {
    for (let i = 0; i < references.client_actions.length; i++) {
      let item = references.client_actions[i];

      item.proto = service_protos[item.type];

      services[item.id] = item;
      client_actions[item.id] = {
        id: item.id,
        serviceId: item.id,
        componentId: item.params.component_id,
        componentObjectName: item.params.object_name
      }
    }
  }

  refs.services = services;
  refs.client_actions = client_actions;

  // клиентские объекты
  prepareRef(refs,'client_objects','id');

  // ежедневная награда
  var login_days_bonus = [];

  for (let day_num in references.login_days_bonus) {
    let stuff = references.login_days_bonus[day_num];

    stuff[0].login_day_index = day_num;

    login_days_bonus.push(stuff[0]);
  }

  // прототипы наборов предметов
  prepareRef(refs,'kit_proto','entry');

  // справочник покупок (данные справочника отсутствуют)
  // prepareRef(refs,'payment_preset','entry',(item) => {
  //   return {
  //     entry: item.entry,
  //     price: item.price,
  //     count: item.count,
  //     bonus: item.bonus_ext
  //   };
  // });

  // справочник клиентских сообщений
  prepareRef(refs,'message_client','name',(item) => {
    return item.label;
  })

  // справочник настроек пользователя
  prepareRef(refs,'user_settings','name');
  // справочник указаний
  prepareRef(refs,'user_directions','name');

  // справочник анимаций
  var animations = {};

  if (references.battle_animations.length) {
    for (let i = 0; i < references.battle_animations.length; i++) {
      let item = references.battle_animations[i];

      for (let key in item) {
        if(Object.prototype.hasOwnProperty.call(item,key)) {
          animations[key] = item[key];
        }
      }
    }
  }

  refs.battle_animations = animations;

  // справочник базовых боевых действий
  prepareRef(refs,'battle_turn','name');
  // справочник предварительных боевых действий
  prepareRef(refs,'battle_prep','name');
  // справочник боевых аур
  prepareRef(refs,'battle_aura','id');
  // справочник длящихся
  prepareRef(refs,'battle_continuing','id');
  // справочник боевых аур
  prepareRef(refs,'battle_actions','id');
  // справочник трофеев
  prepareRef(refs,'user_trophy','entry');
  // справочник elo
  prepareRef(refs,'user_elo','name');
  // справочник ингредиентов 
  prepareRef(refs,'ingredients','name');
  // справочник прямых действий 
  prepareRef(refs,'direct_actions','entry');
  // справочник запросов гильдии
  prepareRef(refs,'guild_request_types','entry');
  // справочник рейдов гильдии
  prepareRef(refs,'guild_raids','entry');
  // справочник рангов гильдии
  prepareRef(refs,'guild_rank_info','value');
  // справочник рынка
  prepareRef(refs,'market','entry');
  // справочник питомцев
  prepareRef(refs,'pets','entry');
  //линейки заданий
  prepareRef(refs,'quest_lines','item');
  
  return refs;
}

class Refs{
  constructor(references){
    this.refs = prepareReferences(references);
  }
  /**
	 * Быстрый доступ к справочнику
	 * @param {String} key Ключ вида "ref_name|ref_item_key", ref_name - название справочника; ref_item_key - идентификатор элемента справочника (не обязателен)
	 * @return {Mixin} Данные справочника или undefined в случае, если не найден справочник или элемент
	 */
	ref(key){
		var parts = key.split('|'),
			ref = this.refs[parts[0]];

		if (ref) {
			if (parts.length > 1) {
				return ref[parts[1]];
			} else {
				return ref;
			}
		}
	}
}

export default Refs;