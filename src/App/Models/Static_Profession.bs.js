// Generated by BUCKLESCRIPT, PLEASE EDIT WITH CARE
'use strict';

var Block = require("bs-platform/lib/js/block.js");
var Curry = require("bs-platform/lib/js/curry.js");
var Caml_obj = require("bs-platform/lib/js/caml_obj.js");
var Json_decode = require("@glennsl/bs-json/src/Json_decode.bs.js");
var Ids$OptolithClient = require("../Constants/Ids.bs.js");
var Int$OptolithClient = require("../../Data/Int.bs.js");
var ListH$OptolithClient = require("../../Data/ListH.bs.js");
var Maybe$OptolithClient = require("../../Data/Maybe.bs.js");
var IntMap$OptolithClient = require("../../Data/IntMap.bs.js");
var Yaml_Zip$OptolithClient = require("../Utilities/Yaml_Zip.bs.js");
var JsonStrict$OptolithClient = require("../Utilities/JsonStrict.bs.js");
var Static_Erratum$OptolithClient = require("./Static_Erratum.bs.js");
var Static_SourceRef$OptolithClient = require("./Static_SourceRef.bs.js");
var Static_Prerequisites$OptolithClient = require("./Static_Prerequisites.bs.js");

function nameBySex(json) {
  return {
          m: Json_decode.field("m", Json_decode.string, json),
          f: Json_decode.field("f", Json_decode.string, json)
        };
}

function partial_arg_000(json) {
  return /* BySex */Block.__(1, [nameBySex(json)]);
}

var partial_arg_001 = /* :: */[
  (function (json) {
      return /* Const */Block.__(0, [Json_decode.string(json)]);
    }),
  /* [] */0
];

var partial_arg = /* :: */[
  partial_arg_000,
  partial_arg_001
];

function name(param) {
  return Json_decode.oneOf(partial_arg, param);
}

function variantL10n(json) {
  return {
          id: Json_decode.field("id", Json_decode.$$int, json),
          name: Json_decode.field("name", name, json),
          activatablePrerequisites: JsonStrict$OptolithClient.optionalField("activatablePrerequisites", (function (param) {
                  return Json_decode.list(Static_Prerequisites$OptolithClient.Decode.activatable, param);
                }), json),
          precedingText: JsonStrict$OptolithClient.optionalField("precedingText", Json_decode.string, json),
          fullText: JsonStrict$OptolithClient.optionalField("fullText", Json_decode.string, json),
          concludingText: JsonStrict$OptolithClient.optionalField("concludingText", Json_decode.string, json),
          errata: Json_decode.field("errata", Static_Erratum$OptolithClient.Decode.list, json)
        };
}

function variantOverride(decoder, json) {
  return Json_decode.oneOf(/* :: */[
              (function (json) {
                  JsonStrict$OptolithClient.$$const(false, json);
                  return /* Remove */0;
                }),
              /* :: */[
                (function (json) {
                    return /* Override */[Curry._1(decoder, json)];
                  }),
                /* [] */0
              ]
            ], json);
}

var skillSpecializationOption = Static_Prerequisites$OptolithClient.Decode.oneOrManyInt;

function variantSkillSpecializationOption(param) {
  return variantOverride(skillSpecializationOption, param);
}

function variantLanguageAndScriptOption(param) {
  return variantOverride(Json_decode.$$int, param);
}

function combatTechniqueSecondOption(json) {
  return {
          amount: Json_decode.field("amount", Json_decode.$$int, json),
          value: Json_decode.field("value", Json_decode.$$int, json)
        };
}

function combatTechniqueOption(json) {
  return {
          amount: Json_decode.field("amount", Json_decode.$$int, json),
          value: Json_decode.field("value", Json_decode.$$int, json),
          second: JsonStrict$OptolithClient.optionalField("second", combatTechniqueSecondOption, json),
          sid: Json_decode.field("sid", (function (param) {
                  return Json_decode.list(Json_decode.$$int, param);
                }), json)
        };
}

function variantCombatTechniqueOption(param) {
  return variantOverride(combatTechniqueOption, param);
}

function cantripOption(json) {
  return {
          amount: Json_decode.field("amount", Json_decode.$$int, json),
          sid: Json_decode.field("sid", (function (param) {
                  return Json_decode.list(Json_decode.$$int, param);
                }), json)
        };
}

function terrainKnowledgeOption(param) {
  return Json_decode.list(Json_decode.$$int, param);
}

function skillOption(json) {
  return {
          gr: JsonStrict$OptolithClient.optionalField("gr", Json_decode.$$int, json),
          value: Json_decode.field("value", Json_decode.$$int, json)
        };
}

function variantUniv(json) {
  return {
          id: Json_decode.field("id", Json_decode.$$int, json),
          cost: Json_decode.field("cost", Json_decode.$$int, json),
          sexDependency: JsonStrict$OptolithClient.optionalField("sexDependency", Static_Prerequisites$OptolithClient.Decode.sex, json),
          raceDependency: JsonStrict$OptolithClient.optionalField("raceDependency", Static_Prerequisites$OptolithClient.Decode.race, json),
          cultureDependency: JsonStrict$OptolithClient.optionalField("cultureDependency", Static_Prerequisites$OptolithClient.Decode.culture, json),
          activatablePrerequisites: JsonStrict$OptolithClient.optionalField("activatablePrerequisites", (function (param) {
                  return Json_decode.list(Static_Prerequisites$OptolithClient.Decode.activatable, param);
                }), json),
          increasablePrerequisites: JsonStrict$OptolithClient.optionalField("increasablePrerequisites", (function (param) {
                  return Json_decode.list(Static_Prerequisites$OptolithClient.Decode.increasable, param);
                }), json),
          skillSpecializationSelectOptions: JsonStrict$OptolithClient.optionalField("skillSpecializationSelectOptions", variantSkillSpecializationOption, json),
          languageScriptSelectOptions: JsonStrict$OptolithClient.optionalField("languageScriptSelectOptions", variantLanguageAndScriptOption, json),
          combatTechniqueSelectOptions: JsonStrict$OptolithClient.optionalField("combatTechniqueSelectOptions", variantCombatTechniqueOption, json),
          cantripSelectOptions: JsonStrict$OptolithClient.optionalField("cantripSelectOptions", cantripOption, json),
          curseSelectOptions: JsonStrict$OptolithClient.optionalField("curseSelectOptions", Json_decode.$$int, json),
          terrainKnowledgeSelectOptions: JsonStrict$OptolithClient.optionalField("terrainKnowledgeSelectOptions", terrainKnowledgeOption, json),
          skillSelectOptions: JsonStrict$OptolithClient.optionalField("skillSelectOptions", skillOption, json),
          specialAbilities: JsonStrict$OptolithClient.optionalField("specialAbilities", (function (param) {
                  return Json_decode.list(Static_Prerequisites$OptolithClient.Decode.activatable, param);
                }), json),
          combatTechniques: JsonStrict$OptolithClient.optionalField("combatTechniques", (function (param) {
                  return Json_decode.list((function (json) {
                                return /* tuple */[
                                        Json_decode.field("id", Json_decode.$$int, json),
                                        Json_decode.field("value", Json_decode.$$int, json)
                                      ];
                              }), param);
                }), json),
          skills: JsonStrict$OptolithClient.optionalField("skills", (function (param) {
                  return Json_decode.list((function (json) {
                                return /* tuple */[
                                        Json_decode.field("id", Json_decode.$$int, json),
                                        Json_decode.field("value", Json_decode.$$int, json)
                                      ];
                              }), param);
                }), json),
          spells: JsonStrict$OptolithClient.optionalField("spells", (function (param) {
                  return Json_decode.list((function (json) {
                                return /* tuple */[
                                        Json_decode.field("id", Json_decode.$$int, json),
                                        Json_decode.field("value", Static_Prerequisites$OptolithClient.Decode.oneOrManyInt, json)
                                      ];
                              }), param);
                }), json),
          liturgicalChants: JsonStrict$OptolithClient.optionalField("liturgicalChants", (function (param) {
                  return Json_decode.list((function (json) {
                                return /* tuple */[
                                        Json_decode.field("id", Json_decode.$$int, json),
                                        Json_decode.field("value", Static_Prerequisites$OptolithClient.Decode.oneOrManyInt, json)
                                      ];
                              }), param);
                }), json),
          blessings: JsonStrict$OptolithClient.optionalField("blessings", (function (param) {
                  return Json_decode.list(Json_decode.$$int, param);
                }), json)
        };
}

function variant(univ, l10n) {
  return /* tuple */[
          univ.id,
          {
            id: univ.id,
            name: l10n.name,
            cost: univ.cost,
            prerequisites: {
              sex: univ.sexDependency,
              race: univ.raceDependency,
              culture: univ.cultureDependency,
              activatable: Maybe$OptolithClient.fromMaybe(/* [] */0, univ.activatablePrerequisites),
              increasable: Maybe$OptolithClient.fromMaybe(/* [] */0, univ.increasablePrerequisites)
            },
            options: {
              skillSpecialization: univ.skillSpecializationSelectOptions,
              languageScript: univ.languageScriptSelectOptions,
              combatTechnique: univ.combatTechniqueSelectOptions,
              cantrip: univ.cantripSelectOptions,
              curse: univ.curseSelectOptions,
              terrainKnowledge: univ.terrainKnowledgeSelectOptions,
              skill: univ.skillSelectOptions,
              guildMageUnfamiliarSpell: Maybe$OptolithClient.maybe(false, (function (param) {
                      return ListH$OptolithClient.Foldable.any((function (x) {
                                    if (Caml_obj.caml_equal(x.id, /* `SpecialAbility */[
                                            -789492591,
                                            Ids$OptolithClient.SpecialAbilityId.traditionGuildMages
                                          ])) {
                                      return x.active;
                                    } else {
                                      return false;
                                    }
                                  }), param);
                    }), univ.activatablePrerequisites)
            },
            specialAbilities: Maybe$OptolithClient.fromMaybe(/* [] */0, univ.specialAbilities),
            combatTechniques: Maybe$OptolithClient.maybe(IntMap$OptolithClient.empty, IntMap$OptolithClient.fromList, univ.combatTechniques),
            skills: Maybe$OptolithClient.maybe(IntMap$OptolithClient.empty, IntMap$OptolithClient.fromList, univ.skills),
            spells: Maybe$OptolithClient.maybe(IntMap$OptolithClient.empty, IntMap$OptolithClient.fromList, univ.spells),
            liturgicalChants: Maybe$OptolithClient.maybe(IntMap$OptolithClient.empty, IntMap$OptolithClient.fromList, univ.liturgicalChants),
            blessings: Maybe$OptolithClient.fromMaybe(/* [] */0, univ.blessings),
            precedingText: l10n.precedingText,
            fullText: l10n.fullText,
            concludingText: l10n.concludingText,
            errata: l10n.errata
          }
        ];
}

function tL10n(json) {
  return {
          id: Json_decode.field("id", Json_decode.$$int, json),
          name: Json_decode.field("name", name, json),
          subname: JsonStrict$OptolithClient.optionalField("subname", name, json),
          activatablePrerequisites: JsonStrict$OptolithClient.optionalField("activatablePrerequisites", (function (param) {
                  return Json_decode.list(Static_Prerequisites$OptolithClient.Decode.activatable, param);
                }), json),
          prerequisitesStart: JsonStrict$OptolithClient.optionalField("prerequisitesStart", Json_decode.string, json),
          suggestedAdvantages: JsonStrict$OptolithClient.optionalField("suggestedAdvantages", Json_decode.string, json),
          suggestedDisadvantages: JsonStrict$OptolithClient.optionalField("suggestedDisadvantages", Json_decode.string, json),
          unsuitableAdvantages: JsonStrict$OptolithClient.optionalField("unsuitableAdvantages", Json_decode.string, json),
          unsuitableDisadvantages: JsonStrict$OptolithClient.optionalField("unsuitableDisadvantages", Json_decode.string, json),
          variants: JsonStrict$OptolithClient.optionalField("variants", (function (param) {
                  return Json_decode.list(variantL10n, param);
                }), json),
          src: Json_decode.field("src", Static_SourceRef$OptolithClient.Decode.list, json),
          errata: Json_decode.field("errata", Static_Erratum$OptolithClient.Decode.list, json)
        };
}

function tUniv(json) {
  return {
          id: Json_decode.field("id", Json_decode.$$int, json),
          cost: Json_decode.field("cost", Json_decode.$$int, json),
          sexDependency: JsonStrict$OptolithClient.optionalField("sexDependency", Static_Prerequisites$OptolithClient.Decode.sex, json),
          raceDependency: JsonStrict$OptolithClient.optionalField("raceDependency", Static_Prerequisites$OptolithClient.Decode.race, json),
          cultureDependency: JsonStrict$OptolithClient.optionalField("cultureDependency", Static_Prerequisites$OptolithClient.Decode.culture, json),
          activatablePrerequisites: JsonStrict$OptolithClient.optionalField("activatablePrerequisites", (function (param) {
                  return Json_decode.list(Static_Prerequisites$OptolithClient.Decode.activatable, param);
                }), json),
          increasablePrerequisites: JsonStrict$OptolithClient.optionalField("increasablePrerequisites", (function (param) {
                  return Json_decode.list(Static_Prerequisites$OptolithClient.Decode.increasable, param);
                }), json),
          skillSpecializationSelectOptions: JsonStrict$OptolithClient.optionalField("skillSpecializationSelectOptions", skillSpecializationOption, json),
          languageScriptSelectOptions: JsonStrict$OptolithClient.optionalField("languageScriptSelectOptions", Json_decode.$$int, json),
          combatTechniqueSelectOptions: JsonStrict$OptolithClient.optionalField("combatTechniqueSelectOptions", combatTechniqueOption, json),
          cantripSelectOptions: JsonStrict$OptolithClient.optionalField("cantripSelectOptions", cantripOption, json),
          curseSelectOptions: JsonStrict$OptolithClient.optionalField("curseSelectOptions", Json_decode.$$int, json),
          terrainKnowledgeSelectOptions: JsonStrict$OptolithClient.optionalField("terrainKnowledgeSelectOptions", terrainKnowledgeOption, json),
          skillSelectOptions: JsonStrict$OptolithClient.optionalField("skillSelectOptions", skillOption, json),
          specialAbilities: JsonStrict$OptolithClient.optionalField("specialAbilities", (function (param) {
                  return Json_decode.list(Static_Prerequisites$OptolithClient.Decode.activatable, param);
                }), json),
          combatTechniques: JsonStrict$OptolithClient.optionalField("combatTechniques", (function (param) {
                  return Json_decode.list((function (json) {
                                return /* tuple */[
                                        Json_decode.field("id", Json_decode.$$int, json),
                                        Json_decode.field("value", Json_decode.$$int, json)
                                      ];
                              }), param);
                }), json),
          skills: JsonStrict$OptolithClient.optionalField("skills", (function (param) {
                  return Json_decode.list((function (json) {
                                return /* tuple */[
                                        Json_decode.field("id", Json_decode.$$int, json),
                                        Json_decode.field("value", Json_decode.$$int, json)
                                      ];
                              }), param);
                }), json),
          spells: JsonStrict$OptolithClient.optionalField("spells", (function (param) {
                  return Json_decode.list((function (json) {
                                return /* tuple */[
                                        Json_decode.field("id", Json_decode.$$int, json),
                                        Json_decode.field("value", Static_Prerequisites$OptolithClient.Decode.oneOrManyInt, json)
                                      ];
                              }), param);
                }), json),
          liturgicalChants: JsonStrict$OptolithClient.optionalField("liturgicalChants", (function (param) {
                  return Json_decode.list((function (json) {
                                return /* tuple */[
                                        Json_decode.field("id", Json_decode.$$int, json),
                                        Json_decode.field("value", Static_Prerequisites$OptolithClient.Decode.oneOrManyInt, json)
                                      ];
                              }), param);
                }), json),
          blessings: JsonStrict$OptolithClient.optionalField("blessings", (function (param) {
                  return Json_decode.list(Json_decode.$$int, param);
                }), json),
          suggestedAdvantages: JsonStrict$OptolithClient.optionalField("suggestedAdvantages", (function (param) {
                  return Json_decode.list(Json_decode.$$int, param);
                }), json),
          suggestedDisadvantages: JsonStrict$OptolithClient.optionalField("suggestedDisadvantages", (function (param) {
                  return Json_decode.list(Json_decode.$$int, param);
                }), json),
          unsuitableAdvantages: JsonStrict$OptolithClient.optionalField("unsuitableAdvantages", (function (param) {
                  return Json_decode.list(Json_decode.$$int, param);
                }), json),
          unsuitableDisadvantages: JsonStrict$OptolithClient.optionalField("unsuitableDisadvantages", (function (param) {
                  return Json_decode.list(Json_decode.$$int, param);
                }), json),
          variants: JsonStrict$OptolithClient.optionalField("variants", (function (param) {
                  return Json_decode.list(variantUniv, param);
                }), json),
          isVariantRequired: Json_decode.field("isVariantRequired", Json_decode.bool, json),
          gr: Json_decode.field("gr", Json_decode.$$int, json),
          sgr: Json_decode.field("sgr", Json_decode.$$int, json)
        };
}

function t(univ, l10n) {
  return /* tuple */[
          univ.id,
          {
            id: univ.id,
            name: l10n.name,
            subname: l10n.subname,
            cost: univ.cost,
            prerequisites: {
              sex: univ.sexDependency,
              race: univ.raceDependency,
              culture: univ.cultureDependency,
              activatable: Maybe$OptolithClient.fromMaybe(/* [] */0, univ.activatablePrerequisites),
              increasable: Maybe$OptolithClient.fromMaybe(/* [] */0, univ.increasablePrerequisites)
            },
            prerequisitesStart: l10n.prerequisitesStart,
            options: {
              skillSpecialization: univ.skillSpecializationSelectOptions,
              languageScript: univ.languageScriptSelectOptions,
              combatTechnique: univ.combatTechniqueSelectOptions,
              cantrip: univ.cantripSelectOptions,
              curse: univ.curseSelectOptions,
              terrainKnowledge: univ.terrainKnowledgeSelectOptions,
              skill: univ.skillSelectOptions,
              guildMageUnfamiliarSpell: Maybe$OptolithClient.maybe(false, (function (param) {
                      return ListH$OptolithClient.Foldable.any((function (x) {
                                    if (Caml_obj.caml_equal(x.id, /* `SpecialAbility */[
                                            -789492591,
                                            Ids$OptolithClient.SpecialAbilityId.traditionGuildMages
                                          ])) {
                                      return x.active;
                                    } else {
                                      return false;
                                    }
                                  }), param);
                    }), univ.activatablePrerequisites)
            },
            specialAbilities: Maybe$OptolithClient.fromMaybe(/* [] */0, univ.specialAbilities),
            combatTechniques: Maybe$OptolithClient.maybe(IntMap$OptolithClient.empty, IntMap$OptolithClient.fromList, univ.combatTechniques),
            skills: Maybe$OptolithClient.maybe(IntMap$OptolithClient.empty, IntMap$OptolithClient.fromList, univ.skills),
            spells: Maybe$OptolithClient.maybe(IntMap$OptolithClient.empty, IntMap$OptolithClient.fromList, univ.spells),
            liturgicalChants: Maybe$OptolithClient.maybe(IntMap$OptolithClient.empty, IntMap$OptolithClient.fromList, univ.liturgicalChants),
            blessings: Maybe$OptolithClient.fromMaybe(/* [] */0, univ.blessings),
            suggestedAdvantages: Maybe$OptolithClient.fromMaybe(/* [] */0, univ.suggestedAdvantages),
            suggestedAdvantagesText: l10n.suggestedAdvantages,
            suggestedDisadvantages: Maybe$OptolithClient.fromMaybe(/* [] */0, univ.suggestedDisadvantages),
            suggestedDisadvantagesText: l10n.suggestedDisadvantages,
            unsuitableAdvantages: Maybe$OptolithClient.fromMaybe(/* [] */0, univ.unsuitableAdvantages),
            unsuitableAdvantagesText: l10n.unsuitableAdvantages,
            unsuitableDisadvantages: Maybe$OptolithClient.fromMaybe(/* [] */0, univ.unsuitableDisadvantages),
            unsuitableDisadvantagesText: l10n.unsuitableDisadvantages,
            variants: Curry._1(IntMap$OptolithClient.fromList, Yaml_Zip$OptolithClient.zipBy(Int$OptolithClient.show, variant, (function (x) {
                        return x.id;
                      }), (function (x) {
                        return x.id;
                      }), Maybe$OptolithClient.fromMaybe(/* [] */0, univ.variants), Maybe$OptolithClient.fromMaybe(/* [] */0, l10n.variants))),
            isVariantRequired: univ.isVariantRequired,
            gr: univ.gr,
            sgr: univ.sgr,
            src: l10n.src,
            errata: l10n.errata
          }
        ];
}

function all(yamlData) {
  return Curry._1(IntMap$OptolithClient.fromList, Yaml_Zip$OptolithClient.zipBy(Int$OptolithClient.show, t, (function (x) {
                    return x.id;
                  }), (function (x) {
                    return x.id;
                  }), Json_decode.list(tUniv, yamlData.professionsUniv), Json_decode.list(tL10n, yamlData.professionsL10n)));
}

var Decode = {
  nameBySex: nameBySex,
  name: name,
  variantL10n: variantL10n,
  variantOverride: variantOverride,
  skillSpecializationOption: skillSpecializationOption,
  variantSkillSpecializationOption: variantSkillSpecializationOption,
  languageAndScriptOption: Json_decode.$$int,
  variantLanguageAndScriptOption: variantLanguageAndScriptOption,
  combatTechniqueSecondOption: combatTechniqueSecondOption,
  combatTechniqueOption: combatTechniqueOption,
  variantCombatTechniqueOption: variantCombatTechniqueOption,
  cantripOption: cantripOption,
  curseOption: Json_decode.$$int,
  terrainKnowledgeOption: terrainKnowledgeOption,
  skillOption: skillOption,
  variantUniv: variantUniv,
  variant: variant,
  tL10n: tL10n,
  tUniv: tUniv,
  t: t,
  all: all
};

exports.Decode = Decode;
/* IntMap-OptolithClient Not a pure module */
