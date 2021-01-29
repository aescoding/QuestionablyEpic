import React, { forwardRef } from "react";
import MaterialTable, { MTableToolbar } from "material-table";
import ArrowDownward from "@material-ui/icons/ArrowDownward";
import { ThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import abilityIcons from "../../Functions/IconFunctions/AbilityIcons.js";
import { localizationFR } from "../../../../locale/fr/TableLocale";
import { localizationEN } from "../../../../locale/en/TableLocale";
import { localizationRU } from "../../../../locale/ru/TableLocale";
import { localizationCH } from "../../../../locale/ch/TableLocale";
import moment from "moment";
import externalsDB from "../../../../Databases/ExternalsDB";
import { Divider, Paper } from "@material-ui/core";
import { useTranslation } from "react-i18next";
import { classColoursJS } from "../../Functions/ClassColourFunctions";
import classIcons from "../../Functions/IconFunctions/ClassIcons";

const theme = createMuiTheme({
  overrides: {
    MuiToolbar: {
      regular: {
        minHeight: 0,
        "@media (min-width: 600px)": {
          minHeight: "0px",
        },
      },
      root: {
        padding: "4px 4px 4px 4px",
        color: "#c8b054",
      },
    },
  },
  palette: {
    type: "dark",
    primary: { main: "#d3bc47" },
    secondary: { main: "#e0e0e0" },
  },
});
const tableIcons = {
  SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} style={{ color: "#ffee77" }} ref={ref} />),
};

export default function ExternalTimeline(props) {
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language;

  let curLang = () => {
    if (currentLanguage === "en") {
      return localizationEN;
    } else if (currentLanguage === "ru") {
      return localizationRU;
    } else if (currentLanguage === "ch") {
      return localizationCH;
    } else if (currentLanguage === "fr") {
      return localizationFR;
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <MaterialTable
        icons={tableIcons}
        columns={[
          {
            title: t("Caster"),
            field: "caster",
            cellStyle: {
              whiteSpace: "nowrap",
              // borderRight: "1px solid rgb(81 81 81)",
              padding: "2px 0px",
              fontSize: 14,
            },
            headerStyle: {
              fontSize: 14,
            },
            render: (rowData) => (
              <div style={{ color: classColoursJS(rowData.casterClass) }}>
                {classIcons(rowData.casterClass, 20)}
                {rowData.caster}
              </div>
            ),
          },
          {
            field: "casterClass",
            hidden: true,
          },
          {
            field: "targetClass",
            hidden: true,
          },
          {
            title: t("Target"),
            field: "target",
            cellStyle: {
              whiteSpace: "nowrap",
              // borderRight: "1px solid rgb(81 81 81)",
              padding: "2px 0px",
              fontSize: 14,
            },
            headerStyle: {
              fontSize: 14,
            },
            render: (rowData) => (
              <div style={{ color: classColoursJS(rowData.targetClass) }}>
                {classIcons(rowData.targetClass, 20)}
                {rowData.target}
              </div>
            ),
          },
          {
            title: t("External"),
            field: "ability",
            cellStyle: {
              whiteSpace: "nowrap",
              // borderRight: "1px solid rgb(81 81 81)",
              padding: "2px 8px",
              fontSize: 14,
            },
            headerStyle: {
              fontSize: 14,
            },
            render: (rowData) => (
              <div>
                {abilityIcons(rowData.guid)}
                {rowData.ability}
              </div>
            ),
          },
          {
            title: t("CooldownPlanner.TableLabels.CastTimeLabel"),
            field: "timestamp",
            width: "2%",
            cellStyle: {
              whiteSpace: "nowrap",
              // borderRight: "1px solid rgb(81 81 81)",
              padding: "2px 8px",
              fontSize: 14,
            },
            headerStyle: {
              fontSize: 14,
            },
          },
          {
            title: t("CooldownPlanner.TableLabels.OffCooldownLabel"),
            width: "2%",
            cellStyle: {
              whiteSpace: "nowrap",
              padding: "2px 8px",
              fontSize: 14,
            },
            headerStyle: {
              fontSize: 14,
            },
            render: (rowData) => (
              <div>
                {moment(rowData.timestamp, "mm:ss")
                  .add(
                    externalsDetailed
                      .filter((obj) => {
                        return obj.guid === rowData.guid;
                      })
                      .map((obj) => obj.cooldown)
                      .toString(),
                    "s",
                  )
                  .format("mm:ss")}
              </div>
            ),
          },
        ]}
        title={t("CooldownPlanner.Headers.ExternalTimeline")}
        header={true}
        data={props.data}
        style={{
          // marginTop: "8px",
          color: "#ffffff",
          fontSize: "0.8 rem",
          whiteSpace: "nowrap",
          padding: 8,
        }}
        localization={curLang()}
        components={{
          Container: (props) => <Paper {...props} elevation={0} />,
          Toolbar: (props) => (
            <div style={{ marginBottom: 8 }}>
              <MTableToolbar {...props} />
              <Divider />
            </div>
          ),
        }}
        options={{
          showTitle: true,
          toolbar: true,
          header: true,
          search: false,
          headerStyle: {
            border: "1px solid #c8b054",
            padding: "0px 8px 0px 8px",
            backgroundColor: "#c8b054",
            color: "#000",
            // fontSize: "0.8 rem",
          },
          rowStyle: (rowData, index) => {
            if (index % 2) {
              return {
                backgroundColor: "#535353",
                borderBottom: "1px solid #515151",
                borderLeft: "1px solid #515151",
                borderRight: "1px solid #515151",
              };
            }
            return {
              borderBottom: "1px solid #515151",
              borderLeft: "1px solid #515151",
              borderRight: "1px solid #515151",
            };
          },
          searchFieldStyle: {
            borderBottom: "1px solid #6d6d6d",
            color: "#ffffff",
          },
          actionsCellStyle: {
            borderBottom: "1px solid #6d6d6d",
            padding: 0,
          },
          actionsColumnIndex: 6,
          paging: false,
          // tableLayout: "fixed",
        }}
      />
    </ThemeProvider>
  );
}
