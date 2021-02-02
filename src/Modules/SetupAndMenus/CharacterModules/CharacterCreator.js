import React from "react";
//prettier-ignore
import { Avatar, Button, Card, CardActionArea, CardContent, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, Typography, MenuItem, TextField, Select, Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useTranslation } from "react-i18next";
import classIcons from "../../CooldownPlanner/Functions/IconFunctions/ClassIcons";
import raceIcons from "../../CooldownPlanner/Functions/IconFunctions/RaceIcons";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { classRaceList } from "../../CooldownPlanner/Data/Data";
import { serverDB } from "../../../Databases/ServerDB";
import AddNewCharDialog from "./AddNewCharDialog";

const addBtn = require("../../../Images/AddBtn.jpg").default;

const useStyles = makeStyles((theme) => ({
  formControl: {
    whiteSpace: "nowrap",
    width: "100%",
    minWidth: 150,
  },
  formRegion: {
    whiteSpace: "nowrap",
    width: "100%",
    marginRight: 1,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  textInput: {
    width: "100%",
  },
  root: {
    display: "inline-flex",
    // maxWidth: "260px",
    width: "100%",
    maxHeight: "80px",
    borderColor: "#e0e0e0",
    padding: "0px",
    marginRight: "0px",
  },
  details: {
    display: "flex",
    flexDirection: "column",
  },
  content: {
    flex: "1 0 auto",
    padding: "5px",
  },
  large: {
    width: "80px",
    height: "80px",
  },
}));

export default function AddNewChar(props) {
  const { t } = useTranslation();
  const classes = useStyles();

  return (
    <Grid item xs={12} sm={6} md={6} lg={4} xl={4}>
      <CardActionArea onClick={props.handleClickOpen}>
        <Card className={classes.root} variant="outlined" raised={true}>
          <Avatar variant="square" alt="" className={classes.large} src={addBtn} />
          <div className={classes.details}>
            <CardContent className={classes.content}>
              <Typography variant="h6" component="h4">
                {t("CharacterCreator.AddChar")}
              </Typography>
            </CardContent>
          </div>
        </Card>
      </CardActionArea>

      <AddNewCharDialog
        open={props.open}
        close={props.handleClose}
        setOpen={props.setOpen}
        allChars={props.allChars}
        charUpdate={props.charUpdate}
        charAddedSnack={props.charAddedSnack}
      />
    </Grid>
  );
}
