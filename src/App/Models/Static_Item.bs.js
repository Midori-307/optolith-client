// Generated by BUCKLESCRIPT, PLEASE EDIT WITH CARE
'use strict';

var Block = require("bs-platform/lib/js/block.js");
var Curry = require("bs-platform/lib/js/curry.js");
var Json_decode = require("@glennsl/bs-json/src/Json_decode.bs.js");
var Int$OptolithClient = require("../../Data/Int.bs.js");
var Maybe$OptolithClient = require("../../Data/Maybe.bs.js");
var IntMap$OptolithClient = require("../../Data/IntMap.bs.js");
var Yaml_Zip$OptolithClient = require("../Utilities/Yaml_Zip.bs.js");
var JsonStrict$OptolithClient = require("../Utilities/JsonStrict.bs.js");
var GenericHelpers$OptolithClient = require("../Utilities/GenericHelpers.bs.js");
var Static_Erratum$OptolithClient = require("./Static_Erratum.bs.js");
var Static_SourceRef$OptolithClient = require("./Static_SourceRef.bs.js");

function info(json) {
  return {
          note: JsonStrict$OptolithClient.optionalField("note", Json_decode.string, json),
          rules: JsonStrict$OptolithClient.optionalField("rules", Json_decode.string, json),
          advantage: JsonStrict$OptolithClient.optionalField("advantage", Json_decode.string, json),
          disadvantage: JsonStrict$OptolithClient.optionalField("disadvantage", Json_decode.string, json),
          src: Json_decode.field("src", Static_SourceRef$OptolithClient.Decode.list, json),
          errata: Json_decode.field("errata", Static_Erratum$OptolithClient.Decode.list, json)
        };
}

function tL10n(json) {
  var partial_arg_000 = function (json) {
    return /* :: */[
            info(json),
            /* [] */0
          ];
  };
  var partial_arg_001 = /* :: */[
    (function (json) {
        return Json_decode.list(info, json);
      }),
    /* [] */0
  ];
  var partial_arg = /* :: */[
    partial_arg_000,
    partial_arg_001
  ];
  return {
          id: Json_decode.field("id", Json_decode.$$int, json),
          name: Json_decode.field("name", Json_decode.string, json),
          info: Json_decode.field("versions", (function (param) {
                  return Json_decode.oneOf(partial_arg, param);
                }), json)
        };
}

function mundaneItem(json) {
  return {
          structurePoints: JsonStrict$OptolithClient.optionalField("structurePoints", GenericHelpers$OptolithClient.Decode.oneOrMany(Json_decode.$$int), json)
        };
}

function newAttribute(json) {
  return {
          attribute: Json_decode.field("attribute", Json_decode.$$int, json),
          threshold: Json_decode.field("threshold", Json_decode.$$int, json)
        };
}

function agilityStrength(json) {
  var x = Json_decode.pair(Json_decode.$$int, Json_decode.$$int, json);
  return {
          agility: x[0],
          strength: x[1]
        };
}

function partial_arg_000(json) {
  return /* DefaultAttribute */Block.__(0, [Json_decode.$$int(json)]);
}

var partial_arg_001 = /* :: */[
  (function (json) {
      return /* DifferentAttribute */Block.__(1, [newAttribute(json)]);
    }),
  /* :: */[
    (function (json) {
        return /* AgilityStrength */Block.__(2, [agilityStrength(json)]);
      }),
    /* [] */0
  ]
];

var partial_arg = /* :: */[
  partial_arg_000,
  partial_arg_001
];

function primaryAttributeDamageThreshold(param) {
  return Json_decode.oneOf(partial_arg, param);
}

function meleeWeapon(json) {
  return {
          combatTechnique: Json_decode.field("combatTechnique", Json_decode.$$int, json),
          damage: {
            amount: Json_decode.field("damageDiceNumber", Json_decode.$$int, json),
            sides: Json_decode.field("damageDiceSides", Json_decode.$$int, json),
            flat: JsonStrict$OptolithClient.optionalField("damageFlat", Json_decode.$$int, json)
          },
          primaryAttributeDamageThreshold: JsonStrict$OptolithClient.optionalField("damageThreshold", primaryAttributeDamageThreshold, json),
          at: JsonStrict$OptolithClient.optionalField("at", Json_decode.$$int, json),
          pa: JsonStrict$OptolithClient.optionalField("pa", Json_decode.$$int, json),
          reach: JsonStrict$OptolithClient.optionalField("reach", Json_decode.$$int, json),
          length: JsonStrict$OptolithClient.optionalField("length", Json_decode.$$int, json),
          structurePoints: JsonStrict$OptolithClient.optionalField("structurePoints", Json_decode.$$int, json),
          isParryingWeapon: Json_decode.field("isParryingWeapon", Json_decode.bool, json),
          isTwoHandedWeapon: Json_decode.field("isTwoHandedWeapon", Json_decode.bool, json),
          isImprovisedWeapon: Json_decode.field("isImprovisedWeapon", Json_decode.bool, json)
        };
}

function rangedWeapon(json) {
  return {
          combatTechnique: Json_decode.field("combatTechnique", Json_decode.$$int, json),
          damage: Maybe$OptolithClient.Monad.liftM2((function (amount, sides) {
                  return {
                          amount: amount,
                          sides: sides,
                          flat: JsonStrict$OptolithClient.optionalField("damageFlat", Json_decode.$$int, json)
                        };
                }), JsonStrict$OptolithClient.optionalField("damageDiceNumber", Json_decode.$$int, json), JsonStrict$OptolithClient.optionalField("damageDiceSides", Json_decode.$$int, json)),
          length: JsonStrict$OptolithClient.optionalField("length", Json_decode.$$int, json),
          range: /* tuple */[
            Json_decode.field("closeRange", Json_decode.$$int, json),
            Json_decode.field("mediumRange", Json_decode.$$int, json),
            Json_decode.field("farRange", Json_decode.$$int, json)
          ],
          reloadTime: Json_decode.field("reloadTime", GenericHelpers$OptolithClient.Decode.oneOrMany(Json_decode.$$int), json),
          ammunition: JsonStrict$OptolithClient.optionalField("ammunition", Json_decode.$$int, json),
          isImprovisedWeapon: Json_decode.field("isImprovisedWeapon", Json_decode.bool, json)
        };
}

function combinedWeapon(json) {
  return /* tuple */[
          Json_decode.field("melee", meleeWeapon, json),
          Json_decode.field("ranged", rangedWeapon, json)
        ];
}

function armor(json) {
  return {
          protection: Json_decode.field("protection", Json_decode.$$int, json),
          encumbrance: Json_decode.field("encumbrance", Json_decode.$$int, json),
          hasAdditionalPenalties: Json_decode.field("hasAdditionalPenalties", Json_decode.bool, json),
          armorType: Json_decode.field("armorType", Json_decode.$$int, json)
        };
}

function partial_arg_000$1(json) {
  return /* MundaneItem */Block.__(0, [mundaneItem(json)]);
}

var partial_arg_001$1 = /* :: */[
  (function (json) {
      return /* MeleeWeapon */Block.__(1, [meleeWeapon(json)]);
    }),
  /* :: */[
    (function (json) {
        return /* RangedWeapon */Block.__(2, [rangedWeapon(json)]);
      }),
    /* :: */[
      (function (json) {
          var param = combinedWeapon(json);
          return /* CombinedWeapon */Block.__(3, [
                    param[0],
                    param[1]
                  ]);
        }),
      /* :: */[
        (function (json) {
            return /* Armor */Block.__(4, [armor(json)]);
          }),
        /* [] */0
      ]
    ]
  ]
];

var partial_arg$1 = /* :: */[
  partial_arg_000$1,
  partial_arg_001$1
];

function special(param) {
  return Json_decode.oneOf(partial_arg$1, param);
}

function tUniv(json) {
  return {
          id: Json_decode.field("id", Json_decode.$$int, json),
          price: JsonStrict$OptolithClient.optionalField("price", Json_decode.$$int, json),
          weight: JsonStrict$OptolithClient.optionalField("weight", Json_decode.$$int, json),
          special: JsonStrict$OptolithClient.optionalField("special", (function (param) {
                  return Json_decode.oneOf(/* [] */0, param);
                }), json),
          gr: Json_decode.field("gr", Json_decode.$$int, json)
        };
}

function t(univ, l10n) {
  return /* tuple */[
          univ.id,
          {
            id: univ.id,
            name: l10n.name,
            price: univ.price,
            weight: univ.weight,
            special: univ.special,
            info: l10n.info,
            gr: univ.gr
          }
        ];
}

function all(yamlData) {
  return Curry._1(IntMap$OptolithClient.fromList, Yaml_Zip$OptolithClient.zipBy(Int$OptolithClient.show, t, (function (x) {
                    return x.id;
                  }), (function (x) {
                    return x.id;
                  }), Json_decode.list(tUniv, yamlData.equipmentUniv), Json_decode.list(tL10n, yamlData.equipmentL10n)));
}

var Decode = {
  info: info,
  tL10n: tL10n,
  mundaneItem: mundaneItem,
  newAttribute: newAttribute,
  agilityStrength: agilityStrength,
  primaryAttributeDamageThreshold: primaryAttributeDamageThreshold,
  meleeWeapon: meleeWeapon,
  rangedWeapon: rangedWeapon,
  combinedWeapon: combinedWeapon,
  armor: armor,
  special: special,
  tUniv: tUniv,
  t: t,
  all: all
};

exports.Decode = Decode;
/* IntMap-OptolithClient Not a pure module */
