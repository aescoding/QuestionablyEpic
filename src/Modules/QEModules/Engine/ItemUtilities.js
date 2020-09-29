import { itemDB } from '../Player/ItemDB'
import {randPropPoints} from './RandPropPointsBylevel'
import {combat_ratings_mult_by_ilvl} from './CombatMultByLevel'

/*

This file contains utility functions that center around the player or players items. 


*/


// This is a pretty straightfoward function right now but could be altered in future to allow Paladins to wear all armor types, to allow druids to wear cloth and so on.
// We'll try and leave them out when we can since it keeps the dropdown boxes much much cleaner and the 5% int bonus is only worth giving up on ultra rare occasions. 
export function getValidArmorTypes(spec) {
    switch(spec) {
        case "Restoration Druid":
        case "Mistweaver Monk":
            return [0, 2];  // Misc + Leather
        case "Holy Paladin":
            return [0, 4, 6]; // Misc + Plate + Shields
        case "Restoration Shaman":
            return [0, 3, 6]; // Misc + Mail + Shields
        case "Holy Priest":
        case "Discipline Priest":
            return [0, 1]; // Misc + Cloth
        default:
            return [-1];            
    }
}

// Returns an array of valid weapon types.
// TODO
export function getValidWeaponTypes(spec) {
    return [0];

}

// Returns a translated item name based on an ID.
export function getTranslatedItemName(id, lang) {
    let temp = itemDB.filter(function(item) {
        return item.id === id;
    })

    if (temp.length > 0) return temp[0].names[lang];
    else return "Unknown Item";
}

// Returns a translated item name based on an ID.
// Add some support for missing icons.
export function getItemIcon(id) {
    let temp = itemDB.filter(function(item) {
        return item.id === id;
    })

    //console.log(JSON.stringify(temp) + temp.length)
    //console.log(temp[0].icon)
    if (temp.length > 0) return (window.location.origin + "/Images/Icons/" + temp[0].icon + '.jpg')
    else return (window.location.origin + "/Images/Items/missing.jpg")

}

// Returns item stat allocations. MUST be converted to stats before it's used in any scoring capacity. 
export function getItemAllocations(id) {
    let temp = itemDB.filter(function(item) {
        return item.id === id;
    })

    //console.log(JSON.stringify(temp) + temp.length)
    //console.log(temp[0].icon)
    if (temp.length > 0) return (temp[0].stats)
    else return 0

}

// Returns which secondary item category a given slot falls in. 
function getItemCat(slot) {
    switch(slot)
    {
        case("Head"):
        case("Chest"):
        case("Legs"):
        case("Robe"):
            return 0;
        
        case("Shoulder"):
        case("Waist"):
        case("Feet"):
        case("Hands"):
        case("Trinket"):
            return 1;

        case("Neck"):
        case("Finger"):
        case("Back"):
        case("Wrists"):
            return 2;
        
        case("Offhand"):
        case("Shield"):
            return 3;
        default:
            return 3;
            // Raise error.
    }
}

// Calculates the intellect and secondary stats an item should have at a given item level.
// This uses the RandPropPointsByLevel and CombatMultByLevel tables and returns a dictionary object of stats. 
// Stat allocations are passed to the function from our Item Database. 
export function calcStatsAtLevel(itemLevel, slot, statAllocations) {
    let stats = {
        intellect: 0,
        stamina: 0,
        haste: 0,
        mastery: 0,
        vers: 0,
        crit: 0,
        leech: 0,
    }

    let rand_prop = randPropPoints[itemLevel]['slotValues'][getItemCat(slot)];   
    let combat_mult = combat_ratings_mult_by_ilvl[itemLevel];

    
    for (var key in statAllocations) {
        
        let allocation = statAllocations[key]

        if (["haste", "crit", "mastery", "vers"].includes(key)) {        
            stats[key] = (Math.floor(Math.floor(rand_prop * allocation * 0.0001 + 0.5) * combat_mult))
        }
        else if (key === "intellect") {
            stats[key] = (Math.floor(Math.floor(rand_prop * allocation * 0.0001 + 0.5) * 1))
        }
        else if (key === "stamina") {
            // todo
        }
    }

    console.log(stats);

    return stats;

}


// Builds a stat string out of an items given stats and effect. 
// Stats should be listed in order of quantity. 
export function buildStatString(stats, effect) {
    let statString = "";
    let statsList = [
        {key: 'haste', val: stats['haste']},
        {key: 'crit', val: stats['crit']},
        {key: 'mastery', val: stats['mastery']},
        {key: 'vers', val: stats['vers']}
    ];

    statsList = statsList.sort(function (a, b) {
        return b.val - a.val;
    });
    
    for (var ind in statsList) {
        statString += (statsList[ind]['val'] > 0 ? correctCasing(statsList[ind]['key']) + " / " : "");            
    }

    if (effect !== "") statString += "Effect / ";

    return statString.slice(0, -3); // We slice here to remove excess slashes and white space from the end. 
}

function correctCasing(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  // Return an item score.
  // Score is calculated by multiplying out an items stats against the players stat weights.
  // Special effects, sockets and leech are then added afterwards. 
  export function scoreItem(item, player) {
      
      return 0;
  }