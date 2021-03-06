import React from "react";
import { getSoulbindFormula } from "../../Engine/EffectFormulas/Generic/GenericSoulbindFormulas";
import { Menu, MenuItem, Paper } from "@material-ui/core";
import { getConduitName, filterConduits, getCovenant } from "../CovenantUtilities";
import { useTranslation } from "react-i18next";

const columnPos = [200, 290, 380];
const rowPos = [
  [20, 100, 180, 260, 340, 445, 500, 580],
  [5, 85, 165, 245, 355, 435, 515, 595],
  [20, 100, 180, 260, 340, 445, 500, 580],
];

const menuStyle = {
  style: { marginTop: 5 },
  MenuListProps: {
    style: { paddingTop: 0, paddingBottom: 0 },
  },
  PaperProps: {
    style: {
      border: "1px solid rgba(255, 255, 255, 0.23)",
    },
  },
  anchorOrigin: {
    vertical: "bottom",
    horizontal: "left",
  },
  transformOrigin: {
    vertical: "top",
    horizontal: "left",
  },
  getContentAnchorEl: null,
};

const itemQuality = (quality) => {
  switch (quality) {
    case "Legendary":
      return "#ff8000";
      break;
    case "Epic":
      return "#a335ee";
      break;
    case "Uncommon":
      return "#328CE3";
      break;
    case "Common":
      return "#1eff00";
      break;
    default:
      return "#fff";
  }
};

// Creates a text based string from a given array of bonus_stats.
function getBenefitString(bonus_stats) {
  let benefitString = "";
  Object.entries(bonus_stats).forEach(([key, value]) => {
    if (value !== 0 && typeof value === "number" && value !== undefined && !isNaN(value)) {
      benefitString += key + ": " + Math.round(value);
    }
  });
  return benefitString;
}

function getLocalizedName(trait, type, lang) {
  if (type.includes("Conduit") && trait.slotted_id > 0) {
    return getConduitName(trait.slotted_id, lang);
  } else {
    return trait.names[lang]; // Replace with a database lookup based on language.
  }
}

function getRowPos(column, row) {
  return rowPos[column][row];
}

export default function SoulbindNode(props) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language;

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);

    if (type === "Soulbind" || trait.slotted_id > 0) {
      props.activateSoulbind(trait.id);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const setConduit = (slottedID) => {
    setAnchorEl(null);
    props.setConduitInSlot(trait.id, slottedID);
  };

  const trait = props.soulbindTrait;
  const type = "type" in trait ? trait.type : "Soulbind"; // Soulbind, Potency Conduit, Endurance Conduit, Finesse Conduit
  const name = getLocalizedName(trait, type, currentLanguage);
  const icon = process.env.PUBLIC_URL + "/Images/Icons/" + trait.icon;
  const containerIcon = "/Images/Interface/soulbindcontainer" + (type.includes("Conduit") ? "hex" : "circle") + (trait.active ? "active" : "") + ".png";

  const conduitTag = type.includes("Potency")
    ? "/Images/Interface/PotencyConduitImg.png"
    : type.includes("Endurance Conduit")
    ? "/Images/Interface/EnduranceConduitImg.png"
    : type.includes("Finesse Conduit")
    ? "/Images/Interface/FinesseConduitImg.png"
    : "";

  const covenantName = getCovenant(trait.soulbind);

  let stat_bonus = trait.bonus_stats;
  let position = {
    row: trait.position[0],
    column: trait.position[1],
  };

  const conduitCollection = type === "Potency Conduit" ? filterConduits(props.potencyConduits, covenantName) : type === "Endurance Conduit" ? props.enduranceConduits : [];

  const benefitString = getBenefitString(stat_bonus);

  const conduitToolTipPEF = (type) => {
    if (type.includes("Potency")) {
      return '<div class="no-wrap">' + t("Soulbinds.PotencyConduit") + "</div>";
    } else if (type.includes("Endurance")) {
      return '<div class="no-wrap">' + t("Soulbinds.EnduranceConduit") + "</div>";
    } else if (type.includes("Finesse")) {
      return '<div class="no-wrap">' + t("Soulbinds.FinesseConduit") + "</div>";
    }
    return "";
  };

  const conduitToolTipSpellID = (type) => {
    if (type.includes("Potency") || type.includes("Endurance") || type.includes("Finesse")) {
      return "";
    }
    return "spell=" + trait.id + "&domain=" + currentLanguage;
  };

  // The CSS here is a bit of a nightmare. TODO.
  return (
    <div
      id={9}
      style={{
        backgroundColor: "forestgreen",
        width: "100%",
        borderRadius: "50%",
      }}
    >
      <a data-simple-tooltip={conduitToolTipPEF(type)} data-wowhead={conduitToolTipSpellID(type)}>
        <img
          onClick={handleClick}
          width={48}
          height={48}
          src={process.env.PUBLIC_URL + containerIcon}
          style={{
            position: "absolute",
            zIndex: 2,
            left: columnPos[position.column],
            top: getRowPos(position.column, position.row),
          }}
          alt=""
        />
        {conduitTag !== "" ? (
          <img
            width={18}
            height={18}
            src={process.env.PUBLIC_URL + conduitTag}
            style={{
              position: "absolute",
              zIndex: 3,
              left: columnPos[position.column] + 15,
              top: getRowPos(position.column, position.row) + 30,
            }}
            alt=""
          />
        ) : (
          ""
        )}

        <img
          width={38}
          height={38}
          src={icon}
          style={{
            position: "absolute",
            objectFit: "contain",
            borderRadius: "100%",
            zIndex: 1,
            left: columnPos[position.column] + 5,
            top: getRowPos(position.column, position.row) + 5,
          }}
          alt=""
        />
      </a>
      <Paper
        style={{
          fontSize: 10,
          zIndex: 40,
          width: 96,
          color: "Goldenrod",
          textAlign: "center",
          position: "absolute",
          left: columnPos[position.column] - 26,
          top: getRowPos(position.column, position.row) + 46,
          backgroundColor: "rgb(25 28 35 / 65%)",
        }}
      >
        <div>
          <div>{name}</div>
          <div>{benefitString}</div>
        </div>
      </Paper>
      {type.includes("Conduit") ? (
        <Menu
          MenuListProps={{
            style: { paddingTop: 0, paddingBottom: 0 },
          }}
          PaperProps={{
            style: {
              border: "1px solid rgba(255, 255, 255, 0.23)",
            },
          }}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
          style={menuStyle}
          anchorEl={anchorEl}
          keepMounted
          getContentAnchorEl={null}
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          {trait.slotted_id > 0 ? (
            <MenuItem key={-1} dense={true} style={{ padding: "5px 10px" }} onClick={() => setConduit(-1)}>
              {t("Remove")}
            </MenuItem>
          ) : (
            ""
          )}
          {conduitCollection.map((conduit, i) => (
            <MenuItem key={i} style={{ padding: "5px 10px" }} dense={true} onClick={() => setConduit(conduit.id)}>
              <img
                alt=""
                width={24}
                height={24}
                src={conduit.icon}
                style={{
                  borderRadius: 3,
                  borderWidth: "1px",
                  borderStyle: "solid",
                  borderColor: itemQuality("Uncommon"),
                  padding: 0,
                  marginRight: 5,
                }}
              />
              {conduit.name}
            </MenuItem>
          ))}
        </Menu>
      ) : (
        ""
      )}
    </div>
  );
}
