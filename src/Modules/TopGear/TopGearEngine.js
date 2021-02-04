import ItemSet from "./ItemSet";
import TopGearResult from "./TopGearResult";
import Item from "../Player/Item";
import React, { useState, useEffect } from "react";
import { STATPERONEPERCENT, BASESTAT, STATDIMINISHINGRETURNS } from "../Engine/STAT";
import { convertPPMToUptime } from "../Engine/EffectFormulas/EffectUtilities";
// Most of our sets will fall into a bucket where totalling the individual stats is enough to tell us they aren't viable. By slicing these out in a preliminary phase,
// we can run our full algorithm on far fewer items. The net benefit to the player is being able to include more items, with a quicker return.
// This does run into some problems when it comes to set bonuses and could be re-evaluated at the time. The likely strat is to auto-include anything with a bonus, or to run
// our set bonus algorithm before we sort and slice. There are no current set bonuses that are relevant to raid / dungeon so left as a thought experiment for now.
const softSlice = 1000; // TODO. Adjust to 1000 for prod. Being tested at lower values.
const DR_CONST = 0.00098569230769231;

// block for `time` ms, then return the number of loops we could run in that time:
export function expensive(time) {
  let start = Date.now(),
    count = 0;
  while (Date.now() - start < time) count++;
  return count;
}

export function runTopGear(itemList, wepCombos, player, contentType, baseHPS, currentLanguage) {
  //console.log("WEP COMBOS: " + JSON.stringify(wepCombos));
  //console.log("CL::::" + currentLanguage);
  var t0 = performance.now();
  // console.log("Running Top Gear");
  let count = 0;

  let itemSets = createSets(itemList, wepCombos);
  itemSets.sort((a, b) => (a.sumSoftScore < b.sumSoftScore ? 1 : -1));
  count = itemSets.length;

  //console.log("Count: " + count);
  // TEST LOOP ONLY FOR CONSOLE PRINTS.
  /*
    for (var i = 0; i < itemSets.length; i++) {
        
        //console.log("ID: " + itemSets[i].id + ". Soft: " + itemSets[i].sumSoftScore + ". Hard: " + itemSets[i].hardScore);
        //itemSets[i].printSet();
        console.log(itemSets[i]);
        console.log("====================");
   
    }
    */

  for (var i = 0; i < itemSets.length; i++) {
    itemSets[i] = evalSet(itemSets[i], player, contentType, baseHPS);
  }
  itemSets = pruneItems(itemSets);

  itemSets.sort((a, b) => (a.hardScore < b.hardScore ? 1 : -1));

  // ----

  var t1 = performance.now();
  // console.log("Call to doSomething took " + (t1 - t0) + " milliseconds with count ")

  // Build Differentials
  let differentials = [];
  let primeSet = itemSets[0];
  for (var i = 1; i < Math.min(5, itemSets.length); i++) {
    differentials.push(buildDifferential(itemSets[i], primeSet));
  }

  //itemSets[0].printSet()

  if (itemSets.length === 0) {
    let result = new TopGearResult([], []);
    result.itemsCompared = count;
    return result;
  } else {
    let result = new TopGearResult(itemSets[0], differentials);
    result.itemsCompared = count;
    return result;
  }
}

function createSets(itemList, rawWepCombos) {
  const wepCombos = deepCopyFunction(rawWepCombos);
  let setCount = 0;
  let itemSets = [];
  let slotLengths = {
    Head: 0,
    Neck: 0,
    Shoulder: 0,
    Back: 0,
    Chest: 0,
    Wrist: 0,
    Hands: 0,
    Waist: 0,
    Legs: 0,
    Feet: 0,
    Finger: 0,
    Trinket: 0,
    Weapon: 0,
  };

  let splitItems = {
    Head: [],
    Neck: [],
    Shoulder: [],
    Back: [],
    Chest: [],
    Wrist: [],
    Hands: [],
    Waist: [],
    Legs: [],
    Feet: [],
    Finger: [],
    Trinket: [],
    WeaponSet: [],
  };

  for (var i = 0; i < itemList.length; i++) {
    let slot = itemList[i].slot;
    if (slot in slotLengths) {
      slotLengths[slot] += 1;
      splitItems[slot].push(itemList[i]);
    }
  }
  slotLengths.Weapon = Object.keys(wepCombos).length;

  //console.log(JSON.stringify(slotLengths));
  // console.log(splitItems.Finger);

  for (var head = 0; head < slotLengths.Head; head++) {
    let softScore = { head: splitItems.Head[head].softScore };
    for (var shoulder = 0; shoulder < slotLengths.Shoulder; shoulder++) {
      softScore.shoulder = splitItems.Shoulder[shoulder].softScore;

      for (var neck = 0; neck < slotLengths.Neck; neck++) {
        softScore.neck = splitItems.Neck[neck].softScore;

        for (var back = 0; back < slotLengths.Back; back++) {
          softScore.back = splitItems.Back[back].softScore;

          for (var chest = 0; chest < slotLengths.Chest; chest++) {
            softScore.chest = splitItems.Chest[chest].softScore;

            for (var wrist = 0; wrist < slotLengths.Wrist; wrist++) {
              softScore.wrist = splitItems.Wrist[wrist].softScore;

              for (var hands = 0; hands < slotLengths.Hands; hands++) {
                softScore.hands = splitItems.Hands[hands].softScore;

                for (var waist = 0; waist < slotLengths.Waist; waist++) {
                  softScore.waist = splitItems.Waist[waist].softScore;

                  for (var legs = 0; legs < slotLengths.Legs; legs++) {
                    softScore.legs = splitItems.Legs[legs].softScore;

                    for (var feet = 0; feet < slotLengths.Feet; feet++) {
                      softScore.feet = splitItems.Feet[feet].softScore;

                      for (var weapon = 0; weapon < slotLengths.Weapon; weapon++) {
                        //softScore.weapon = splitItems.Feet[feet].softScore; //
                        softScore.weapon = wepCombos[weapon].softScore;
                        wepCombos[weapon].slot = "CombinedWeapon";

                        for (var finger = 0; finger < slotLengths.Finger - 1; finger++) {
                          softScore.finger = splitItems.Finger[finger].softScore;

                          for (var finger2 = 1; finger2 < slotLengths.Finger; finger2++) {
                            softScore.finger2 = splitItems.Finger[finger2].softScore;

                            if (splitItems.Finger[finger].id !== splitItems.Finger[finger2].id) {
                              for (var trinket = 0; trinket < slotLengths.Trinket - 1; trinket++) {
                                softScore.trinket = splitItems.Trinket[trinket].softScore;

                                for (var trinket2 = 1; trinket2 < slotLengths.Trinket; trinket2++) {
                                  softScore.trinket2 = splitItems.Trinket[trinket2].softScore;

                                  if (splitItems.Trinket[trinket].id !== splitItems.Trinket[trinket2].id) {
                                    let includedItems = [
                                      splitItems.Head[head],
                                      splitItems.Neck[neck],
                                      splitItems.Shoulder[shoulder],
                                      splitItems.Back[back],
                                      splitItems.Chest[chest],
                                      splitItems.Wrist[wrist],
                                      splitItems.Hands[hands],
                                      splitItems.Waist[waist],
                                      splitItems.Legs[legs],
                                      splitItems.Feet[feet],
                                      splitItems.Finger[finger],
                                      splitItems.Finger[finger2],
                                      splitItems.Trinket[trinket],
                                      splitItems.Trinket[trinket2],
                                      wepCombos[weapon],
                                    ];
                                    let sumSoft = sumScore(softScore);
                                    itemSets.push(new ItemSet(setCount, includedItems, sumSoft));
                                    setCount++;
                                  }
                                }
                              }
                            }
                          }

                          //console.log("Incl Items: " + JSON.stringify(includedItems) + " " + finger + " " + feet + " " + legs + " " + waist + " " + hands);
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  // console.log("Created " + itemSets.length + " item sets.");
  return itemSets;
}

function buildDifferential(itemSet, primeSet) {
  let primeList = primeSet.itemList;
  let diffList = itemSet.itemList;
  let differentials = {
    items: [],
    scoreDifference: (Math.round(primeSet.hardScore - itemSet.hardScore) / primeSet.hardScore) * 100,
  };
  //console.log("Prime List: " + JSON.stringify(primeSet));
  //console.log("Diff List: " + JSON.stringify(diffList))

  for (var x = 0; x < primeList.length; x++) {
    if (primeList[x].uniqueHash !== diffList[x].uniqueHash) {
      //console.log("Something happeneing here: " + x);
      differentials.items.push(diffList[x]);
    }
  }
  //console.log(JSON.stringify(differentials));
  return differentials;
}

function pruneItems(itemSets) {
  let temp = itemSets.filter(function (set) {
    return set.verifySet();
  });

  return temp.slice(0, softSlice);
}

function sumScore(obj) {
  var sum = 0;
  for (var el in obj) {
    if (obj.hasOwnProperty(el)) {
      sum += parseFloat(obj[el]);
    }
  }
  return sum;
}

// A true evaluation function on a set.
function evalSet(itemSet, player, contentType, baseHPS) {
  // Get Base Stats
  let builtSet = itemSet.compileStats();
  let setStats = builtSet.setStats;
  let hardScore = 0;

  let enchants = {};

  let bonus_stats = {
    intellect: 0,
    haste: 0,
    crit: 0,
    versatility: 0,
    mastery: STATPERONEPERCENT.MASTERYA[player.spec] * BASESTAT.MASTERY[player.spec] * 100,
    leech: 0,
    hps: 0,
    dps: 0,
  };

  let adjusted_weights = {
    intellect: 1,
    haste: player.statWeights[contentType]["haste"],
    crit: player.statWeights[contentType]["crit"],
    mastery: player.statWeights[contentType]["mastery"],
    versatility: player.statWeights[contentType]["versatility"],
    leech: player.statWeights[contentType]["leech"],
  };
  //console.log("Weights Before: " + JSON.stringify(adjusted_weights));


  // TODO: Leech, which has a DR larger than secondary stats.
  //console.log("Weights After: " + JSON.stringify(adjusted_weights));

  // Apply consumables if ticked.

  // Apply Enchants & Gems

  // Rings - Best secondary.
  // We use the players highest stat weight here. Using the adjusted weight could be more accurate, but the difference is likely to be the smallest fraction of a
  // single percentage. The stress this could cause a player is likely not worth the optimization.
  let highestWeight = getHighestWeight(player, contentType);
  bonus_stats[highestWeight] += 32; // 16 x 2.
  enchants["Finger"] = "+16 " + highestWeight;

  // Bracers
  bonus_stats.intellect += 15;
  enchants["Wrist"] = "+15 int";

  // Chest
  // TODO: Add the mana enchant. In practice they are very similar.
  bonus_stats.intellect += 30;
  enchants["Chest"] = "+30 stats";

  // Cape
  bonus_stats.leech += 30;
  enchants["Back"] = "+30 leech";

  // Weapon - Celestial Guidance
  // Eternal Grace is so poor right now that I don't even think it deserves inclusion.
  let expected_uptime = convertPPMToUptime(3, 10);
  bonus_stats.intellect = (setStats.intellect + bonus_stats.intellect) * 0.05 * expected_uptime;
  enchants["CombinedWeapon"] = "Celestial Guidance";

  // 5% int boost for wearing the same items.
  // The system doesn't actually allow you to add items of different armor types so this is always on.
  bonus_stats.intellect += (builtSet.setStats.intellect + bonus_stats.intellect) * 0.05; //TODO: Renable.

  // Sockets
  bonus_stats[highestWeight] += 16 * builtSet.setSockets;
  enchants["Gems"] = highestWeight;
  //console.log("Sockets added : " + 16 * builtSet.setSockets + " to " + highestWeight);

  //applyDiminishingReturns(setStats);
  adjusted_weights.haste = (adjusted_weights.haste + adjusted_weights.haste * (1 - (DR_CONST * setStats.haste) / STATPERONEPERCENT.HASTE)) / 2;
  adjusted_weights.crit = (adjusted_weights.crit + adjusted_weights.crit * (1 - (DR_CONST * setStats.crit) / STATPERONEPERCENT.CRIT)) / 2;
  adjusted_weights.versatility = (adjusted_weights.versatility + adjusted_weights.versatility * (1 - (DR_CONST * setStats.versatility) / STATPERONEPERCENT.VERSATILITY)) / 2;
  adjusted_weights.mastery = (adjusted_weights.mastery + adjusted_weights.mastery * (1 - (DR_CONST * setStats.mastery) / STATPERONEPERCENT.MASTERYA[player.spec])) / 2;
  
  // Calculate a hard score using the rebalanced stat weights.
  for (var stat in setStats) {
    if (stat === "hps") {
      /*score +=
            (item.stats.bonus_stats.hps / player.getHPS(contentType)) *
            player.activeStats.intellect; */
      hardScore += (setStats[stat] / baseHPS) * player.activeStats.intellect;
    } else if (stat === "dps") {
      continue;
    } else {
      setStats[stat] += stat in bonus_stats ? bonus_stats[stat] : 0;
      hardScore += setStats[stat] * adjusted_weights[stat];
      //console.log("Adding" + stat + " to set: " + (stat in bonus_stats ? bonus_stats[stat] : 0))
      //console.log(setStats[stat] + " stat: " + stat + " adds " + setStats[stat] * adjusted_weights[stat] + " to score.");
    }
  }

  //console.log("Soft Score: " + builtSet.sumSoftScore + ". Hard Score: " + hardScore);
  //console.log("Enchants: " + JSON.stringify(enchants));
  builtSet.hardScore = Math.round(1000 * hardScore) / 1000;
  builtSet.setStats = setStats;
  builtSet.enchantBreakdown = enchants;
  return builtSet; // Temp
}

//
function getHighestWeight(player, contentType) {
  let max = "";
  let maxValue = 0;
  let weights = player.statWeights[contentType];

  for (var stat in weights) {
    if (weights[stat] > maxValue && ["crit", "haste", "mastery", "versatility"].includes(stat)) {
      max = stat;
      maxValue = weights[stat];
    }
  }

  return max;
}

export function applyDiminishingReturns(stats) {
  console.log("Stats Pre-DR" + JSON.stringify(stats));
  
  for (const [key, value] of Object.entries(stats)) {

    const DRBreakpoints = STATDIMINISHINGRETURNS[key.toUpperCase()];

    const baseStat = stats[key];
    for (var j = 0; j < DRBreakpoints.length; j++) {
      stats[key] -= Math.max((baseStat - DRBreakpoints[j]) * 0.1, 0);
    }

    //console.log(JSON.stringify(DRBreakpoints));
    
  }
    
    //console.log("Stat: " + stats[i])

  /*

  */
  console.log("Stats Post-DR" + JSON.stringify(stats))
  //console.log("Stats Post-DR", + JSON.stringify(stats))

  return stats;

}

/*
function applySingleDiminishingReturn(statValue, statCap1, statCap2) {
  
  let reduction = ((statValue - statCap1) * 0.1) + ((statValue - statCap2) * 0.1);


} */

const deepCopyFunction = (inObject) => {
  let outObject, value, key;

  if (typeof inObject !== "object" || inObject === null) {
    return inObject; // Return the value if inObject is not an object
  }

  // Create an array or object to hold the values
  outObject = Array.isArray(inObject) ? [] : {};

  for (key in inObject) {
    value = inObject[key];

    // Recursively (deep) copy for nested objects, including arrays
    outObject[key] = deepCopyFunction(value);
  }

  return outObject;
};
