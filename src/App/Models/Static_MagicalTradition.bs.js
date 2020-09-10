// Generated by BUCKLESCRIPT, PLEASE EDIT WITH CARE
'use strict';

var Curry = require("bs-platform/lib/js/curry.js");
var Json_decode = require("@glennsl/bs-json/src/Json_decode.bs.js");
var Int$OptolithClient = require("../../Data/Int.bs.js");
var IntMap$OptolithClient = require("../../Data/IntMap.bs.js");
var Yaml_Zip$OptolithClient = require("../Utilities/Yaml_Zip.bs.js");
var JsonStrict$OptolithClient = require("../Utilities/JsonStrict.bs.js");

function tL10n(json) {
  return {
          id: Json_decode.field("id", Json_decode.$$int, json),
          name: Json_decode.field("name", Json_decode.string, json)
        };
}

function tUniv(json) {
  return {
          id: Json_decode.field("id", Json_decode.$$int, json),
          numId: JsonStrict$OptolithClient.optionalField("numId", Json_decode.$$int, json),
          primary: JsonStrict$OptolithClient.optionalField("primary", Json_decode.$$int, json),
          aeMod: JsonStrict$OptolithClient.optionalField("aeMod", Json_decode.$$float, json),
          canLearnCantrips: Json_decode.field("canLearnCantrips", Json_decode.bool, json),
          canLearnSpells: Json_decode.field("canLearnSpells", Json_decode.bool, json),
          canLearnRituals: Json_decode.field("canLearnRituals", Json_decode.bool, json),
          allowMultipleTraditions: Json_decode.field("allowMultipleTraditions", Json_decode.bool, json),
          isDisAdvAPMaxHalved: Json_decode.field("isDisAdvAPMaxHalved", Json_decode.bool, json),
          areDisAdvRequiredApplyToMagActionsOrApps: Json_decode.field("areDisAdvRequiredApplyToMagActionsOrApps", Json_decode.bool, json)
        };
}

function t(univ, l10n) {
  return /* tuple */[
          univ.id,
          {
            id: univ.id,
            numId: univ.numId,
            name: l10n.name,
            primary: univ.primary,
            aeMod: univ.aeMod,
            canLearnCantrips: univ.canLearnCantrips,
            canLearnSpells: univ.canLearnSpells,
            canLearnRituals: univ.canLearnRituals,
            allowMultipleTraditions: univ.allowMultipleTraditions,
            isDisAdvAPMaxHalved: univ.isDisAdvAPMaxHalved,
            areDisAdvRequiredApplyToMagActionsOrApps: univ.areDisAdvRequiredApplyToMagActionsOrApps
          }
        ];
}

function all(yamlData) {
  return Curry._1(IntMap$OptolithClient.fromList, Yaml_Zip$OptolithClient.zipBy(Int$OptolithClient.show, t, (function (x) {
                    return x.id;
                  }), (function (x) {
                    return x.id;
                  }), Json_decode.list(tUniv, yamlData.magicalTraditionsUniv), Json_decode.list(tL10n, yamlData.magicalTraditionsL10n)));
}

var Decode = {
  tL10n: tL10n,
  tUniv: tUniv,
  t: t,
  all: all
};

exports.Decode = Decode;
/* IntMap-OptolithClient Not a pure module */