import React from "react";
//prettier-ignore
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, MenuItem, TextField, Select, Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useTranslation } from "react-i18next";
import classIcons from "../../CooldownPlanner/Functions/IconFunctions/ClassIcons";
import raceIcons from "../../CooldownPlanner/Functions/IconFunctions/RaceIcons";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { classRaceList } from "../../CooldownPlanner/Data/Data";
import { serverDB } from "../../../Databases/ServerDB";
import ls from "local-storage";

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

export default function AddNewCharDialog(props) {
  const { t } = useTranslation();
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [healClass, setHealClass] = React.useState("");
  const [charName, setCharName] = React.useState("");
  const [regions, setRegions] = React.useState("");
  const [selectedRace, setSelectedRace] = React.useState("");
  const [server, setServer] = React.useState("");
  const region = ["CN", "US", "TW", "EU"];

  const handleAdd = (name, spec, allChars, updateChar, region, realm, race) => {
    props.setOpen(false);
    allChars.addChar(name, spec, region, realm, race);
    updateChar(allChars);
    props.charAddedSnack();
    setSelectedRace("");
    setHealClass("");
    setServer("");
    // setRegions(null);
    setCharName("");
    console.log("test")
    ls.set("welcomeMessage", true)
  };
  const handleChangeSpec = (event) => {
    setHealClass(event.target.value);
  };
  const handleChangeRace = (event) => {
    setSelectedRace(event.target.value);
  };
  const handleChangeName = (event) => {
    setCharName(event.target.value);
  };
  const handleChangeRegion = (event) => {
    setRegions(event.target.value);
  };
  const handleChangeServer = (serverName) => {
    setServer(serverName);
  };

  return (
    <Dialog fullWidth={true} maxWidth="xs" open={props.open} onClose={props.close} aria-labelledby="char-dialog-title">
      <DialogTitle id="char-dialog-title">{t("CharacterCreator.AddChar")}</DialogTitle>
      <DialogContent>
        <Grid container spacing={1} direction="column">
          <Grid item xs={12}>
            <TextField className={classes.textInput} id="char-name" label={t("CharacterCreator.CharName")} onChange={handleChangeName} variant="outlined" size="small" />
          </Grid>
          <Grid container spacing={1} item>
            <Grid item xs={4}>
              <FormControl className={classes.formRegion} variant="outlined" size="small" disabled={charName === "" ? true : false} label={t("Region")}>
                <InputLabel id="NewClassSelector">{t("Region")}</InputLabel>
                <Select label={t("Region")} value={regions} onChange={handleChangeRegion}>
                  {Object.values(region).map((key, i) => (
                    <MenuItem key={i} value={key}>
                      {key}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={8}>
              <Autocomplete
                size="small"
                disabled={regions === "" ? true : false}
                id="server-select"
                options={serverDB[regions] || []}
                getOptionLabel={(option) => option}
                style={{ width: "100%" }}
                onChange={(e, newValue) => {
                  handleChangeServer(newValue);
                }}
                renderInput={(params) => <TextField {...params} label="Server Name" variant="outlined" />}
              />
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <FormControl className={classes.formControl} variant="outlined" size="small" disabled={regions === "" ? true : false} label={t("Select Class")}>
              <InputLabel id="NewClassSelector">{t("Select Class")}</InputLabel>
              <Select label={t("Select Class")} value={healClass} onChange={handleChangeSpec}>
                {Object.getOwnPropertyNames(classRaceList).map((key, i) => (
                  <MenuItem key={i} value={key}>
                    {classIcons(key, 20)}
                    {t("Classes." + key)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl disabled={healClass === "" ? true : false} className={classes.formControl} variant="outlined" size="small" label={t("Select Race")}>
              <InputLabel id="NewRaceSelector">{t("Select Race")}</InputLabel>
              <Select label={t("Select Race")} value={selectedRace} onChange={handleChangeRace}>
                {healClass === ""
                  ? ""
                  : classRaceList[healClass.toString()].races.map((key, i) => (
                      <MenuItem key={i} value={key}>
                        <div style={{ display: "inline-flex" }}>
                          {raceIcons(key)}
                          {t(key)}
                        </div>
                      </MenuItem>
                    ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.handleClose} color="primary">
          {t("Cancel")}
        </Button>
        <Button
          onClick={() => handleAdd(charName, healClass, props.allChars, props.charUpdate, regions, server, selectedRace)}
          color="primary"
          disabled={selectedRace === "" ? true : false}
        >
          {t("Add")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
