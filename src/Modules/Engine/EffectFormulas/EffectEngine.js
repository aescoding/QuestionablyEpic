import {getGenericEffect} from './Generic/GenericEffectFormulas'
import {getDruidLegendary} from './Druid/DruidLegendaryFormulas'
import {getDiscPriestLegendary} from './Priest/DiscPriestLegendaryFormulas'
import {getHolyPriestLegendary} from './Priest/HolyPriestLegendaryFormulas'
import {getMonkLegendary} from './Monk/MonkLegendaryFormulas'
import {getShamanLegendary} from './Shaman/ShamanLegendaryFormulas'
import {getPaladinLegendary} from './Paladin/PaladinLegendaryFormulas'
import {getGenericLegendary} from './Generic/GenericLegendaryFormulas'
import {getTrinketEffect} from './Generic/TrinketEffectFormulas'

import {getPriestConduit} from './Priest/PriestConduitFormulas'
import {getPaladinConduit} from './Paladin/PaladinConduitFormulas'
import {getShamanConduit} from './Shaman/ShamanConduitFormulas'
import {getMonkConduit} from './Monk/MonkConduitFormulas'
import {getDruidConduit} from './Druid/DruidConduitFormulas'


import SPEC from '../SPECS'


// Effect is a small "dictionary" with two key : value pairs. 
// The EffectEngine is basically a routing device. It will take your effect and effect type and grab the right formula from the right place.
// This allows each spec to work on spec-specific calculations without a need to interact with the other specs. 
export function getEffectValue(effect, player, contentType, itemLevel = 0) {
    let bonus_stats = {};
    const effectName = effect.name;
    const effectType = effect.type;

    console.log("ITEM EFFECT" + effectName + effectType + "pl spec" + player.spec);

    if (effect.type === 'special') {
        bonus_stats = getGenericEffect(effectName, player, contentType);

    }
    else if (effectType === 'spec legendary') {
        switch(player.spec) {
            case('Discipline Priest'):
                bonus_stats = getDiscPriestLegendary(effectName, player, contentType);
                break;
            case('Restoration Druid'):
                bonus_stats = getDruidLegendary(effectName, player, contentType);
                break;
            case('Holy Priest'):
                bonus_stats = getHolyPriestLegendary(effectName, player, contentType);
                break;
            case('Holy Paladin'):
                bonus_stats = getPaladinLegendary(effectName, player, contentType);
                break;
            case('Mistweaver Monk'):
                bonus_stats = getMonkLegendary(effectName, player, contentType);
                break;
            case('Restoration Shaman'):
                bonus_stats = getShamanLegendary(effectName, player, contentType);
                break;
            default:
                break;
                // Call error
        }
    }
    else if (effectType === 'generic legendary') {
        bonus_stats = getGenericLegendary(effectName, player, contentType);
    }
    else if (effectType === 'trinket') {
        bonus_stats = getTrinketEffect(effectName, player, contentType, itemLevel);
    }

    return bonus_stats;
}

export function getConduitFormula(effectID, player, contentType, itemLevel = 156) {
    let bonus_stats = {};

    switch(player.spec) {
        case(SPEC.DISCPRIEST):
        case(SPEC.HOLYPRIEST):
            bonus_stats = getPriestConduit(effectID, player, contentType, itemLevel);
            break;
        case(SPEC.RESTODRUID):
            bonus_stats = getDruidConduit(effectID, player, contentType, itemLevel);
            break;
        case(SPEC.RESTOSHAMAN):
            bonus_stats = getShamanConduit(effectID, player, contentType, itemLevel);
            break;
        case(SPEC.HOLYPALADIN):
            bonus_stats = getPaladinConduit(effectID, player, contentType, itemLevel);
            break;
        case(SPEC.MISTWEAVERMONK):
            bonus_stats = getMonkConduit(effectID, player, contentType, itemLevel);
            break;

    }

    return bonus_stats;

}