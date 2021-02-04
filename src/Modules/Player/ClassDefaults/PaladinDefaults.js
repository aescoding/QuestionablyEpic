export const paladinDefaultSpellData = (contentType) => {
  let spellList = {};
  if (contentType === "Raid") {
    spellList = {
      225311: { casts: 20, healing: 238400, hps: 1316, overhealing: 0.2 }, // LoD
      85673: { casts: 4, healing: 40800, hps: 225, overhealing: 0.2 }, // WoG
      25914: { casts: 27, healing: 221400, hps: 1222, overhealing: 0.2 }, // Holy Shock
      82326: { casts: 7, healing: 70302, hps: 210, overhealing: 0.2 }, // Holy Light
      337824: { casts: 0, healing: 98300, hps: 542, overhealing: 0.2 }, // Shock Barrier
    };
  } else if (contentType === "Dungeon") {
    spellList = {
      225311: { casts: 19, healing: 178400, hps: 120, overhealing: 0 },
      85673: { casts: 4, healing: 40800, hps: 900, overhealing: 0 },
      25914: { casts: 27, healing: 221400, hps: 1280, overhealing: 0 },
      82326: { casts: 29, healing: 311600, hps: 10, overhealing: 0 },
      337824: { casts: 0, healing: 98300, hps: 542, overhealing: 0 },
    };
  } else {
    console.error("Unknown Content Type");
  }

  return spellList;
};

export const paladinDefaultSpecialQueries = (contentType) => {
  let specialQueries = {};
  if (contentType === "Raid") {
    specialQueries = {
      OneManaHealing: 0.4,
      CastsPerMinute: 27,
      cooldownMult: {
        oneMinute: 1.35,
        twoMinutes: 1.12,
        threeMinutes: 1,
      }
    };
  } else if (contentType === "Dungeon") {
    specialQueries = {
      OneManaHealing: 0.2,
      CastsPerMinute: 30,
      cooldownMult: {
        oneMinute: 1.65,
        twoMinutes: 1.15,
        threeMinutes: 1,
      }
    };
  } else {
    console.error("Unknown Content Type");
  }

  return specialQueries;
};

export const paladinDefaultStatWeights = (contentType) => {
  let statWeights = {};

  statWeights.Raid = {
    intellect: 1,
    haste: 0.39,
    crit: 0.26,
    mastery: 0.33,
    versatility: 0.32,
    leech: 0.5,
    defaults: true,
  };
  statWeights.Dungeon = {
    intellect: 1,
    haste: 0.4,
    crit: 0.36,
    mastery: 0.2,
    versatility: 0.33,
    leech: 0.18,
    defaults: true,
  };

  return statWeights[contentType];
};
