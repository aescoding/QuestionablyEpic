import {convertPPMToUptime} from '../EffectUtilities'

/* 
== Generic Effects ==
Generic effects (labelled "special" on the items themselves are effects attached to non-trinket items that don't fall into any other category)
Examples include the legendary cloak, Azshara's Staff, most Crucible of Storms items and so forth. 
Shadowlands is light on them so far but we can expect to see more as the expansion progresses. 

*/
export function getGenericEffect(effectName, player, contentType) {
    let bonus_stats = {}

    if (effectName === "Ashjrakamas") {
        bonus_stats.intellect = Math.round(359 * convertPPMToUptime(1.25, 15));
        
    }
    else if (effectName === "Effect2") {

    }

    return bonus_stats;
}