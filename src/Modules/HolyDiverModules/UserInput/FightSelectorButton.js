import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import LogImport from "../LogImport/LogImport";
import { ThemeProvider, createMuiTheme } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
    marginLeft: "16px",
  },
}));

export default function FightSelectorButton(props) {
  const classes = useStyles();
  const [age, setAge] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [boss, setBoss] = React.useState("");

  const handleChange = (event) => {
    setAge(event.target.value);
  };

  const handleClose = (event) => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  return (
    <FormControl
      variant="outlined"
      className={classes.formControl}
      size="small"
    >
      <InputLabel id="demo-controlled-open-select-label" label="Outlined">
        Fight
      </InputLabel>
      <Select
        labelId="demo-controlled-open-select-label"
        id="demo-controlled-open-select"
        open={open}
        label={boss}
        onClose={handleClose}
        onOpen={handleOpen}
        value={age}
        onChange={handleChange}
        onClick={handleClose}
      >
        {
          <LogImport
            reportid={props.reportid}
            clicker={props.clicky}
            update={props.update}
          />
        }
        }
      </Select>
    </FormControl>
  );
}