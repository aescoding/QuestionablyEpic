const IDLIGHTOFDAWN = 225311;
const IDHOLYLIGHT = 82326;
const IDHOLYSHOCK = 25914;
const IDSHOCKBARRIER = 337824;
const IDWORDOFGLORY = 85673;

export const getPaladinConduit = (conduitID, player, contentType, conduitLevel) => {
  let bonus_stats = {};
  let expectedOverhealing = 0;

  // === Potency Conduits ===
  // Enkindled Spirits
  if (conduitID === 339570) {
    let trait_bonus = 0.27 + conduitLevel * 0.03;
    let one_lod = player.getSingleCast(IDLIGHTOFDAWN, contentType);

    bonus_stats.HPS = (trait_bonus * one_lod * 3) / 180;
  }
  // Focused Light
  else if (conduitID === 339984) {
    // TODO: Wings crit uptime should be factored in here, reducing the power of the legendary slightly.
    let trait_bonus = 0.04 + conduitLevel * 0.01;
    let holyShockBaseCrit = player.getStatPerc("Crit") + 0.3;
    let holyShockIncrease = (holyShockBaseCrit + trait_bonus) / holyShockBaseCrit - 1;
    //console.log("HSI: " + holyShockIncrease);

    bonus_stats.HPS = holyShockIncrease * (player.getSpellHPS(IDHOLYSHOCK, contentType) + player.getSpellHPS(IDSHOCKBARRIER, contentType));
  }
  // Resplendent Light
  else if (conduitID === 339712) {
    let trait_bonus = 0.036 + conduitLevel * 0.004;
    let targets = 4.8;
    let holyLightHPS = player.getSpellHPS(IDHOLYLIGHT, contentType);
    expectedOverhealing = 0.3;

    bonus_stats.HPS = trait_bonus * targets * holyLightHPS * (1 - expectedOverhealing);
  }
  // Untempered Dedication
  else if (conduitID === 339987) {
  }
  // Ringing Clarity (Kyrian)
  else if (conduitID === 340218) {
    let trait_bonus = 0.36 + conduitLevel * 0.04;
    let oneHolyShock = player.getSingleCast(IDHOLYSHOCK, contentType);
    expectedOverhealing = 0.63;

    bonus_stats.HPS = (trait_bonus * oneHolyShock * 3 * (1 - expectedOverhealing)) / 60;
  }
  // Hallowed Discernment (Venthyr)
  else if (conduitID === 340212) {
    // You can expect little to no overhealing on this since it specifically targets the lowest health ally during a period where you've popped a large cooldown.
    let trait_bonus = 0.36 + conduitLevel * 0.04;
    let ashen_tick_sp = 0.42;
    let ashen_ticks = 15 * player.getStatPerc("Haste");

    bonus_stats.HPS = (trait_bonus * ashen_tick_sp * ashen_ticks * player.getStatMultiplier("NOHASTE")) / 240;
  }
  // Righteous Might (Necrolord)
  else if (conduitID === 340192) {
    let trait_bonus = 0.18 + conduitLevel * 0.02;
    let hammer_raw_dam = 1.36;
    let expected_overhealing = 0.4;

    bonus_stats.HPS = (trait_bonus * hammer_raw_dam * (1 - expected_overhealing) * player.getStatMultiplier("NOHASTE")) / 30;
  }
  // The Long Summer (Night Fae)
  else if (conduitID === 340185) {
  }

  // === Endurance Conduits ===
  // Divine Call
  else if (conduitID === 338741) {
  }
  // Golden Path
  else if (conduitID === 339114) {
    let trait_bonus = 1.8 + conduitLevel * 0.2;
    let consecration_CPM = 3;
    expectedOverhealing = 0.65;

    bonus_stats.HPS = (trait_bonus * consecration_CPM * 0.05 * 12 * (1 - expectedOverhealing) * player.getStatMultiplier("NOHASTE")) / 60;
  }
  // Shielding Words
  else if (conduitID === 338787) {
    let trait_bonus = 0.135 + conduitLevel * 0.015;
    expectedOverhealing = 0.04;

    bonus_stats.HPS = trait_bonus * (1 - expectedOverhealing) * player.getSpellHPS(IDWORDOFGLORY, contentType);
  }

  return bonus_stats;
};
