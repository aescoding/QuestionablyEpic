import React from "react";
import HolyPaladinIcon from "../../../../Images/Classes/Paladin/Specialisation/Holy/Icons/HolyPaladin.jpg";
import DiscPriestIcon from "../../../../Images/Classes/Priest/Specialisation/Discipline/Icons/DisciplinePriest.jpg";
import ShadowPriestIcon from "../../../../Images/Classes/Priest/Specialisation/Shadow/ShadowPriest.jpg";
import HolyPriestIcon from "../../../../Images/Classes/Priest/Specialisation/Holy/Icons/HolyPriest.jpg";
import MistweaverIcon from "../../../../Images/Classes/Monk/Specialisation/Mistweaver/Icons/MistWeaverMonk.jpg";
import RestorationDruidIcon from "../../../../Images/Classes/Druid/Specialisation/Restoration/Icons/RestorationDruid.jpg";
import RestorationShamanIcon from "../../../../Images/Classes/Shaman/Specialisation/Restoration/Icons/RestorationShaman.jpg";
import WarriorIcon from "../../../../Images/Classes/Warrior/WarriorIcon.jpg";
import DemonHunterIcon from "../../../../Images/Classes/DemonHunter/DemonHunterIcon.jpg";
import DeathKnightIcon from "../../../../Images/Classes/DeathKnight/DeathKnightIcon.jpg";

export default function classIcons(props, iconSize) {
  let src = "";
  let alt = "";

  // Paladin Cooldowns
  if (
    props === "HolyPaladin" ||
    props === "Holy Paladin" ||
    props === "Paladin-Holy" ||
    props === "Paladin"
  ) {
    src = HolyPaladinIcon;
    alt = "Holy Paladin";
  }

  // Restoration Druid
  if (
    props === "RestorationDruid" ||
    props === "Restoration Druid" ||
    props === "Druid-Restoration" ||
    props === "Druid"
  ) {
    src = RestorationDruidIcon;
    alt = "Restoration Druid";
  }

  // Holy Priest
  if (
    props === "HolyPriest" ||
    props === "Holy Priest" ||
    props === "Priest-Holy" ||
    props === "Priest" ||
    props === "ShadowPriest" ||
    props === "Shadow Priest" ||
    props === "Priest-Shadow"
  ) {
    src = HolyPriestIcon;
    alt = "Holy Priest";
  }

  // ShadowPriest
  if (
    props === "ShadowPriest" ||
    props === "Shadow Priest" ||
    props === "Priest-Shadow"
  ) {
    src = ShadowPriestIcon;
    alt = "Shadow Priest";
  }

  // Discipline Priest
  if (
    props === "DisciplinePriest" ||
    props === "Discipline Priest" ||
    props === "Priest-Discipline"
  ) {
    src = DiscPriestIcon;
    alt = "Discipline Priest";
  }

  // Restoration Shaman
  if (
    props === "RestorationShaman" ||
    props === "Restoration Shaman" ||
    props === "Shaman-Restoration" ||
    props === "Shaman"
  ) {
    src = RestorationShamanIcon;
    alt = "Restoration Shaman";
  }

  // Mistweaver Monk
  if (
    props === "MistweaverMonk" ||
    props === "Mistweaver Monk" ||
    props === "Monk-Mistweaver" ||
    props === "Monk"
  ) {
    src = MistweaverIcon;
    alt = "Mistweaver Monk";
  }

  // Warrior
  if (props === "Warrior") {
    src = WarriorIcon;
    alt = "Warrior";
  }

  // Demon Hunter
  if (
    props === "HavocDemonHunter" ||
    props === "Havoc Demon Hunter" ||
    props === "DemonHunter-Havoc" ||
    props === "Demon Hunter" ||
    props === "DemonHunter"
  ) {
    src = DemonHunterIcon;
    alt = "Havoc Demon Hunter";
  }

  // Death KNight
  if (
    props === "Death Knight" ||
    props === "DeathKnight" ||
    props === "DeathKnight-Frost" ||
    props === "DeathKnight-Unholy" ||
    props === "DeathKnight-Blood"
  ) {
    src = DeathKnightIcon;
    alt = "Death Knight";
  }

  return (
    <img
      style={{
        height: iconSize,
        width: iconSize,
        padding: "0px 5px 0px 5px",
        verticalAlign: "middle",
      }}
      src={src}
      alt={alt}
    />
  );
}
