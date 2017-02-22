type RECEIVE_DATA_TABLES = 'RECEIVE_DATA_TABLES';

type SET_SECTION = 'SET_SECTION';
type SET_TAB = 'SET_TAB';

type REQUEST_LOGIN = 'REQUEST_LOGIN';
type RECEIVE_LOGIN = 'RECEIVE_LOGIN';
type REQUEST_LOGOUT = 'REQUEST_LOGOUT';
type RECEIVE_LOGOUT = 'RECEIVE_LOGOUT';
type REQUEST_REGISTRATION = 'REQUEST_REGISTRATION';
type RECEIVE_REGISTRATION = 'RECEIVE_REGISTRATION';
type REQUEST_NEW_USERNAME = 'REQUEST_NEW_USERNAME';
type RECEIVE_NEW_USERNAME = 'RECEIVE_NEW_USERNAME';
type REQUEST_USER_DELETION = 'REQUEST_USER_DELETION';
type RECEIVE_USER_DELETION = 'RECEIVE_USER_DELETION';
type REQUEST_PASSWORD_RESET = 'REQUEST_PASSWORD_RESET';
type RECEIVE_PASSWORD_RESET = 'RECEIVE_PASSWORD_RESET';
type REQUEST_USERNAME = 'REQUEST_USERNAME';
type RECEIVE_USERNAME = 'RECEIVE_USERNAME';
type REQUEST_ACCOUNT_ACTIVATION_EMAIL = 'REQUEST_ACCOUNT_ACTIVATION_EMAIL';
type RECEIVE_ACCOUNT_ACTIVATION_EMAIL = 'RECEIVE_ACCOUNT_ACTIVATION_EMAIL';
type REQUEST_NEW_DISPLAY_NAME = 'REQUEST_NEW_DISPLAY_NAME';
type RECEIVE_NEW_DISPLAY_NAME = 'RECEIVE_NEW_DISPLAY_NAME';
type REQUEST_NEW_PASSWORD = 'REQUEST_NEW_PASSWORD';
type RECEIVE_NEW_PASSWORD = 'RECEIVE_NEW_PASSWORD';
type REQUEST_HERO_SAVE = 'REQUEST_HERO_SAVE';
type RECEIVE_HERO_SAVE = 'RECEIVE_HERO_SAVE';
type REQUEST_FAILED = 'REQUEST_FAILED';

type SET_HEROLIST_VISIBILITY_FILTER = 'SET_HEROLIST_VISIBILITY_FILTER';
type SET_HEROLIST_SORT_ORDER = 'SET_HEROLIST_SORT_ORDER';
type REQUEST_HEROLIST = 'REQUEST_HEROLIST';
type RECEIVE_HEROLIST = 'RECEIVE_HEROLIST';
type CREATE_HERO = 'CREATE_HERO';

type REQUEST_HERO_DATA = 'REQUEST_HERO_DATA';
type RECEIVE_HERO_DATA = 'RECEIVE_HERO_DATA';
type REQUEST_HERO_AVATAR = 'REQUEST_HERO_AVATAR';
type RECEIVE_HERO_AVATAR = 'RECEIVE_HERO_AVATAR';
type SET_HERO_AVATAR = 'SET_HERO_AVATAR';

type SELECT_RACE = 'SELECT_RACE';
type SET_RACES_SORT_ORDER = 'SET_RACES_SORT_ORDER';
type SWITCH_RACE_VALUE_VISIBILITY = 'SWITCH_RACE_VALUE_VISIBILITY';

type SELECT_CULTURE = 'SELECT_CULTURE';
type SET_CULTURES_SORT_ORDER = 'SET_CULTURES_SORT_ORDER';
type SET_CULTURES_VISIBILITY_FILTER = 'SET_CULTURES_VISIBILITY_FILTER';
type SWITCH_CULTURE_VALUE_VISIBILITY = 'SWITCH_CULTURE_VALUE_VISIBILITY';

type SELECT_PROFESSION = 'SELECT_PROFESSION';
type SET_PROFESSIONS_SORT_ORDER = 'SET_PROFESSIONS_SORT_ORDER';
type SET_PROFESSIONS_VISIBILITY_FILTER = 'SET_PROFESSIONS_VISIBILITY_FILTER';
type ASSIGN_RCP_OPTIONS = 'ASSIGN_RCP_OPTIONS';
type SELECT_PROFESSION_VARIANT = 'SELECT_PROFESSION_VARIANT';

type SET_HERO_NAME = 'SET_HERO_NAME';
type SET_FAMILY = 'SET_FAMILY';
type SET_PLACEOFBIRTH = 'SET_PLACEOFBIRTH';
type SET_DATEOFBIRTH = 'SET_DATEOFBIRTH';
type SET_AGE = 'SET_AGE';
type SET_HAIRCOLOR = 'SET_HAIRCOLOR';
type SET_EYECOLOR = 'SET_EYECOLOR';
type SET_SIZE = 'SET_SIZE';
type SET_WEIGHT = 'SET_WEIGHT';
type SET_TITLE = 'SET_TITLE';
type SET_SOCIALSTATUS = 'SET_SOCIALSTATUS';
type SET_CHARACTERISTICS = 'SET_CHARACTERISTICS';
type SET_OTHERINFO = 'SET_OTHERINFO';
type ADD_ADVENTURE_POINTS = 'ADD_ADVENTURE_POINTS';
type END_HERO_CREATION = 'END_HERO_CREATION';

type ADD_ATTRIBUTE_POINT = 'ADD_ATTRIBUTE_POINT';
type REMOVE_ATTRIBUTE_POINT = 'REMOVE_ATTRIBUTE_POINT';
type ADD_LIFE_POINT = 'ADD_LIFE_POINT';
type ADD_ARCANE_ENERGY_POINT = 'ADD_ARCANE_ENERGY_POINT';
type ADD_KARMA_POINT = 'ADD_KARMA_POINT';
type REDEEM_AE_POINT = 'REDEEM_AE_POINT';
type REMOVE_REDEEMED_AE_POINT = 'REMOVE_REDEEMED_AE_POINT';
type REMOVE_PERMANENT_AE_POINTS = 'REMOVE_PERMANENT_AE_POINTS';
type REDEEM_KP_POINT = 'REDEEM_KP_POINT';
type REMOVE_REDEEMED_KP_POINT = 'REMOVE_REDEEMED_KP_POINT';
type REMOVE_PERMANENT_KP_POINTS = 'REMOVE_PERMANENT_KP_POINTS';

type ACTIVATE_DISADV = 'ACTIVATE_DISADV';
type DEACTIVATE_DISADV = 'DEACTIVATE_DISADV';
type SET_DISADV_TIER = 'SET_DISADV_TIER';
type SWITCH_DISADV_RATING_VISIBILITY = 'SWITCH_DISADV_RATING_VISIBILITY';

type ADD_TALENT_POINT = 'ADD_TALENT_POINT';
type REMOVE_TALENT_POINT = 'REMOVE_TALENT_POINT';
type SET_TALENTS_SORT_ORDER = 'SET_TALENTS_SORT_ORDER';
type SWITCH_TALENT_RATING_VISIBILITY = 'SWITCH_TALENT_RATING_VISIBILITY';

type ADD_COMBATTECHNIQUE_POINT = 'ADD_COMBATTECHNIQUE_POINT';
type REMOVE_COMBATTECHNIQUE_POINT = 'REMOVE_COMBATTECHNIQUE_POINT';
type SET_COMBATTECHNIQUES_SORT_ORDER = 'SET_COMBATTECHNIQUES_SORT_ORDER';

type ACTIVATE_SPELL = 'ACTIVATE_SPELL';
type DEACTIVATE_SPELL = 'DEACTIVATE_SPELL';
type ADD_SPELL_POINT = 'ADD_SPELL_POINT';
type REMOVE_SPELL_POINT = 'REMOVE_SPELL_POINT';
type SET_SPELLS_SORT_ORDER = 'SET_SPELLS_SORT_ORDER';

type ACTIVATE_LITURGY = 'ACTIVATE_LITURGY';
type DEACTIVATE_LITURGY = 'DEACTIVATE_LITURGY';
type ADD_LITURGY_POINT = 'ADD_LITURGY_POINT';
type REMOVE_LITURGY_POINT = 'REMOVE_LITURGY_POINT';
type SET_LITURGIES_SORT_ORDER = 'SET_LITURGIES_SORT_ORDER';

type ACTIVATE_SPECIALABILITY = 'ACTIVATE_SPECIALABILITY';
type DEACTIVATE_SPECIALABILITY = 'DEACTIVATE_SPECIALABILITY';
type SET_SPECIALABILITY_TIER = 'SET_SPECIALABILITY_TIER';
type SET_SPECIALABILITIES_SORT_ORDER = 'SET_SPECIALABILITIES_SORT_ORDER';

type ADD_ITEM = 'ADD_ITEM';
type REMOVE_ITEM = 'REMOVE_ITEM';
type SET_ITEM = 'SET_ITEM';
type SET_ITEMS_SORT_ORDER = 'SET_ITEMS_SORT_ORDER';
type SET_DUCATES = 'SET_DUCATES';
type SET_SILVERTHALERS = 'SET_SILVERTHALERS';
type SET_HELLERS = 'SET_HELLERS';
type SET_KREUTZERS = 'SET_KREUTZERS';
