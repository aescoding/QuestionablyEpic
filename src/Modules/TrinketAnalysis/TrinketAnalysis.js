import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useTranslation } from "react-i18next";
import {itemDB} from "../Player/ItemDB";
import Item from "../Player/Item";
import {getItemAllocations, calcStatsAtLevel, getItemEffect, scoreItem, getTranslatedItemName} from "../Engine/ItemUtilities";


// [{TrinketID: 90321, i173: 92, i187: 94, i200: 99, i213: 104, i226: 116}]

const getTrinketAtItemLevel = (id, itemLevel, player, contentType) => {


    let item = new Item(
        id,
        "",
        "Trinket",
        false,
        "",
        0,
        itemLevel
    );
    let itemAllocations = getItemAllocations(id);
    item.stats = calcStatsAtLevel(
        itemLevel,
        "Trinket",
        itemAllocations,
        ""
    );
    item.effect = getItemEffect(id);
    item.softScore = scoreItem(item, player, contentType);

    return item.softScore;

}

export default function TrinketAnalysis(props) {
    /*useEffect(() => {
      ReactGA.pageview(window.location.pathname + window.location.search);
    }, []); */

    const itemLevel = 213;
    const itemLevels = [161, 174, 187, 200, 213, 226];
    const trinketDB = itemDB.filter(
      (key) =>
        (key.slot === "Trinket"));

    let activeTrinkets = [];

    
    for (var i = 0; i < trinketDB.length; i++) {
        const trinket = trinketDB[i];
        let trinketAtLevels = {id: trinket.id, name: getTranslatedItemName(trinket.id, "en")};
        
        for (var x = 0; x < itemLevels.length; x++) {
            trinketAtLevels["i" + itemLevels[x]] = getTrinketAtItemLevel(trinket.id, itemLevels[x], props.player, props.contentType);

        }
        activeTrinkets.push(trinketAtLevels);
    }

    activeTrinkets.sort((a, b) => (a.i200 < b.i200 ? 1 : -1));
    console.log(activeTrinkets);

    return (

        <div
        // style={{ backgroundColor: "#313131" }}
        >
            Trinket Analysis Page
        </div>
    )

}