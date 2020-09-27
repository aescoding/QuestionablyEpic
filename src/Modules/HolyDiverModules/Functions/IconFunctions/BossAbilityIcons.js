import React from "react";
import { bossAbilities } from "../../Data/Data";

export default function bossAbilityIcons(props) {
  let alt = "";
  let iconName = bossAbilities
    .filter((obj) => {
      return obj.guid === props;
    })
    .map((obj) => obj.icon);
  console.log(iconName);

  alt = bossAbilities
    .filter((obj) => {
      return obj.guid === props;
    })
    .map((obj) => obj.ability)
    .toString();

  return (
    <img
      style={{
        height: 20,
        width: 20,
        padding: "0px 5px 0px 5px",
        verticalAlign: "middle",
        borderRadius: "4px",
      }}
      src={iconName}
      alt={alt}
    />
  );
}