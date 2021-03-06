import React from "react";

import HoA from "../../../../Images/MythicPlus/HallsOfAtonement/HallsOfAtonementAG.png";
import MoTS from "../../../../Images/MythicPlus/MistsOfTirnaScithe/MistsOfTirnaScitheAG.png";
import NW from "../../../../Images/MythicPlus/TheNecroticWake/TheNecroticWakeAG.png";
import PF from "../../../../Images/MythicPlus/Plaguefall/PlaguefallAG.png";
import SD from "../../../../Images/MythicPlus/SanguineDepths/SanguineDepthsAG.png";
import ToP from "../../../../Images/MythicPlus/TheaterOfPain/TheaterOfPainAG.png";
import SoA from "../../../../Images/MythicPlus/SpiresOfAscension/SpiresOfAscensionAG.png";
import DoS from "../../../../Images/MythicPlus/DeOtherSide/DeOtherSideAG.png";

export default function DungeonHeaderIcons(props, style) {
  let source = "";

  if (props === 12831 || props === 1185) {
    source = HoA;
  }
  if (props === 13334 || props === 1184) {
    source = MoTS;
  }
  if (props === 12916 || props === 1182) {
    source = NW;
  }
  if (props === 13228 || props === 1183) {
    source = PF;
  }
  if (props === 12842 || props === 1189) {
    source = SD;
  }
  if (props === 12841 || props === 1187) {
    source = ToP;
  }
  if (props === 12837 || props === 1186) {
    source = SoA;
  }
  if (props === 13309 || props === 1188) {
    source = DoS;
  }

  return <img style={{ ...style }} src={source} alt={props} />;
}
