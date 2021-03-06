import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import "../SetupAndMenus/QEMainMenu.css";
import LegendaryObject from "./LegendaryObject";
import "./Legendaries.css";
import { useTranslation } from "react-i18next";
import { getEffectValue } from "../Engine/EffectFormulas/EffectEngine";
import ReactGA from "react-ga";
import { Grid, Typography } from "@material-ui/core";
// This is all shitty boilerplate code that'll be replaced. Do not copy.

const useStyles = makeStyles((theme) => ({
  header: {
    [theme.breakpoints.down("sm")]: {
      margin: "auto",
      width: "70%",
      justifyContent: "space-between",
      display: "block",
      marginTop: "120px",
    },
    [theme.breakpoints.down("md")]: {
      margin: "auto",
      width: "70%",
      justifyContent: "space-between",
      display: "block",
      marginTop: "120px",
    },
    [theme.breakpoints.down("lg")]: {
      margin: "auto",
      width: "70%",
      justifyContent: "space-between",
      display: "block",
      marginTop: "120px",
    },
    [theme.breakpoints.up("xl")]: {
      margin: "auto",
      width: "70%",
      justifyContent: "space-between",
      display: "block",
    },
  },
}));

const convertToHPS = (bonus_stats, player, contentType) => {
  // Multiply the item's stats by our stat weights.
  let score = 0;

  for (var stat in bonus_stats) {
    let statSum = bonus_stats[stat];
    score += statSum * player.getStatWeight(contentType, stat);
    score = (score / player.activeStats.intellect) * player.getHPS(contentType);
  }

  // Add any bonus HPS
  if ("hps" in bonus_stats) {
    //console.log("Adding bonus_stats to score");
    score += bonus_stats.hps;
  }

  return score;
};

const createLegendary = (legendaryName, container, spec, player, contentType) => {
  let lego = new Legendary(legendaryName);
  lego.bonus_stats = getEffectValue(
    { name: lego.name, type: "spec legendary" },
    player,
    contentType
  );
  lego.effectiveHPS = convertToHPS(lego.bonus_stats, player, contentType);

  container.push(lego);
};

const fillLegendaries = (container, spec, player, contentType) => {
  //container = [];

  // These are used in the legendary snapshot module.

  let choices = {
    "Restoration Druid": [
      "Vision of Unending Growth",
      "Verdant Infusion",
      "The Dark Titans Lesson",
      "Lycaras Fleeting Glimpse",
      "Circle of Life and Death",
      "Oath of the Elder Druid",
      "Memory of the Mother Tree",
    ],
    "Holy Paladin": [
      //"Vanguards Momentum",
      "The Magistrates Judgment",
      "Inflorescence of the Sunwell",
      "Maraads Dying Breath",
      "Shadowbreaker, Dawn of the Sun",
      "Shock Barrier",
      "The Mad Paragon",
      "Relentless Inquisitor",
    ],
    "Restoration Shaman": [
      "Earthen Harmony",
      "Jonat's Natural Focus",
      "Primal Tide Core",
      "Spiritwalker's Tidal Totem",
      "Ancestral Reminder",
      //"Chains of Devastation",
      "Deeply Rooted Elements",
    ],
    "Discipline Priest": [
      "Clarity of Mind",
      "Crystalline Reflection",
      "Kiss of Death",
      "The Penitent One",
      "Cauterizing Shadows",
      "Measured Contemplation",
      "Twins of the Sun Priestess",
      //"Vault of Heavens",
    ],
    "Holy Priest": [
      "Divine Image",
      "Flash Concentration",
      "Harmonious Apparatus",
      "X'anshi, Return of Archbishop Benedictus",
      "Cauterizing Shadows",
      "Measured Contemplation",
      "Twins of the Sun Priestess",
      //"Vault of Heavens",
    ],
    "Mistweaver Monk": [
      //"Escape from Reality",
      "Invoker's Delight",
      //"Roll Out",
      //"Fatal Touch",
      "Ancient Teachings of the Monastery",
      "Yu'lon's Whisper",
      "Clouded Focus",
      "Tear of Morning",
      // "Vitality Sacrifice",
      // "Sephuz's Proclamation",
      "Echo of Eonar",
    ],
    /*
  "Mistweaver Monk": [
    "Ancient Teachings of the Monastery",
    "Clouded Focus",
    "Tear of Morning",
    "Yu'lon's Whisper",
    "Invoker's Delight",
  ], */
  };

  /*
 let choices = {
  "Restoration Druid": [
    338832, // Vision of Unending Growth
    338829, // Verdant Infusion
    338831, // "The Dark Titans Lesson",
    340059, // "Lycaras Fleeting Glimpse",
    338657, // "Circle of Life and Death",
    338608, // "Oath of the Elder Druid",
    339064, // "Memory of the Mother Tree",
  ],
  "Holy Paladin": [
    337746, // "Of Dusk and Dawn",
    337638, // "Vanguards Momentum",
    337681, // "The Magistrates Judgment",
    337777, // "Inflorescence of the Sunwell",
    234848, // "Maraads Dying Breath",
    337812, // "Shadowbreaker, Dawn of the Sun",
    337825, // "Shock Barrier",
    337297, // Relentless Inquisitor,
  ],
  "Restoration Shaman": [
    "Earthen Harmony",
    "Jonat's Natural Focus",
    "Primal Tide Core",
    "Spirit Walker's Tidal Totem",
    "Ancestral Reminder",
    "Chains of Devastation",
    "Deeply Rooted Elements",
  ],
  "Discipline Priest": [
    "Clarity of Mind",
    "Crystalline Reflection",
    "Kiss of Death",
    "The Penitent One",
    "Cauterizing Shadows",
    "Measured Contemplation",
    "Twins of the Sun Priestess",
    "Vault of Heavens",
  ],
  "Mistweaver Monk": [
    "Ancient Teachings of the Monastery",
    "Clouded Focus",
    "Tear of Morning",
    "Yu'lon's Whisper",
    "Invoker's Delight",
  ],
  "Holy Priest": ["HolyPriestLegendary1",
    "Divine Image",
    "Flash Concentration",
    "Harmonious Apparatus",
    "X'anshi, Return of Archbishop Benedictus",
    "Cauterizing Shadows",
    "Measured Contemplation",
    "Twins of the Sun Priestess",
    "Vault of Heavens",
  ],
  };

  */

  // Create legendaries for the given spec.
  choices[spec].map((itemName, index) =>
    createLegendary(itemName, container, spec, player, contentType)
  );
};

const sortLegendaries = (container) => {
  // Current default sorting is by HPS but we could get creative here in future.
  container.sort((a, b) => (a.effectiveHPS < b.effectiveHPS ? 1 : -1));
};

class Legendary {
  constructor(name) {
    this.id = 0;
    this.name = name;
    this.description = "Legendary Description";
    this.image = 0;
    this.bonus_stats = {};
    this.effectiveHPS = 0;
    //this.expectedHps = 0;
    //this.expectedDps = 0;
    //this.singleTargetHPS = 0;
  }
}

export default function LegendaryCompare(props) {
  useEffect(() => {
    ReactGA.pageview(window.location.pathname + window.location.search);
  }, []);
  const { t, i18n } = useTranslation();

  let legendaryList = [];

  fillLegendaries(legendaryList, props.player.spec, props.player, props.contentType);
  sortLegendaries(legendaryList);
  const classes = useStyles();

  return (
    <div
      className={classes.header}

    >
      <Grid item container spacing={1} direction="row">
        <Grid item xs={12}>
          <Typography
            color="primary"
            variant="h4"
            align="center"
            style={{ paddingBottom: 16 }}
          >
            {t("LegendaryCompare.Title")}
          </Typography>
        </Grid>
        <Grid item container spacing={1} direction="row">
          {legendaryList.map((item, index) => (
            <LegendaryObject
              key={index}
              item={item}
              player={props.player}
              contentType={props.contentType}
            />
          ))}
        </Grid>
      </Grid>
    </div>
  );
}
