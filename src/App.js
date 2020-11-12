import React, { Component } from "react";
import "./App.css";
import HolyDiver from "./Modules/CooldownPlanner/CooldownPlannerModule";
import QEMainMenu from "./Modules/SetupAndMenus/QEMainMenu";
import TrinketCompare from "./Modules/TrinketCompare";
import LegendaryCompare from "./Modules/Legendaries/LegendaryCompare";
import QuickCompare from "./Modules/QuickCompare/QuickCompare";
import QEHeader from "./Modules/SetupAndMenus/QEHeader";
import PlayerChars from "./Modules/Player/PlayerChars";
import SimpleTabs from "./Modules/Covenant Test/CovenantExploration";
import { ConfirmLogin, QELogin } from "./Modules/SetupAndMenus/QELogin";
import { withTranslation } from "react-i18next";
import i18n from "./i18n";

import { ThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import ls from "local-storage";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";

const theme = createMuiTheme({
  palette: {
    type: "dark",
    primary: { main: "#c8b054" },
    secondary: { main: "#e0e0e0" },
  },

  // just messing around with themes here. Yellow colour is different in the below.

  // palette: {
  //   common: { black: "#000", white: "#fff" },
  //   background: { paper: "#424242", default: "#333" },
  //   primary: {
  //     light: "#6d6d6d",
  //     main: "#424242",
  //     dark: "#1b1b1b",
  //     contrastText: "#fff",
  //   },
  //   secondary: {
  //     light: "#ffee77",
  //     main: "#d3bc47",
  //     dark: "rgba(198, 167, 0, 1)",
  //     contrastText: "rgba(0, 0, 0, 1)",
  //   },
  //   error: {
  //     light: "#e57373",
  //     main: "#f44336",
  //     dark: "#d32f2f",
  //     contrastText: "#fff",
  //   },
  //   text: {
  //     primary: "rgba(0, 0, 0, 0.87)",
  //     secondary: "rgba(0, 0, 0, 0.54)",
  //     disabled: "rgba(0, 0, 0, 0.38)",
  //     hint: "rgba(0, 0, 0, 0.38)",
  //   },
  // },
});

class App extends Component {
  constructor() {
    super();

    // binds the snack open handlers to this component so we can send it down to where we can trigger them in the relevant component
    this.handleCharSnackOpen = this.handleCharSnackOpen.bind(this);
    this.handleLoginSnackOpen = this.handleLoginSnackOpen.bind(this);
    this.handleSimCSnackOpen = this.handleSimCSnackOpen.bind(this);

    this.langSet = this.langSet.bind(this);
    this.userLogout = this.userLogout.bind(this);
    this.state = {
      characters: new PlayerChars(),
      playerRegion: "us",
      client_id: "1be64387daf6494da2de568527ad82cc",
      lang: "en",
      playerLoginID: "",
      playerBattleTag: "",
      accessToken: "",
      contentType: "Raid",
      charSnackState: false,
      loginSnackState: false,
      simcSnackState: false,
    };
  }

  // --Snack Bar Handlers--
  // Character Added
  handleCharSnackOpen = () => {
    this.setState({ charSnackState: true });
  };
  handleCharSnackClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    this.setState({ charSnackState: false });
  };

  // Login
  handleLoginSnackOpen = () => {
    this.setState({ loginSnackState: true });
  };
  handleLoginClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    this.setState({ loginSnackState: false });
  };

  // SimC Added
  handleSimCSnackOpen = () => {
    this.setState({ simcSnackState: true });
  };
  handleSimCSnackClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    this.setState({ simcSnackState: false });
  };

  // ////////////////////////////////////////

  langSet = (props) => {
    this.setState({ lang: props });
    ls.set("lang", props);
  };

  updatePlayerChars = (allChars) => {
    this.setState({ characters: allChars });
  };

  setRegion = (props) => {
    this.setState({ playerRegion: props });
  };

  toggleContentType = () => {
    let newType = this.state.contentType === "Raid" ? "Dungeon" : "Raid";
    this.setState({ contentType: newType });
    ls.set("contentType", newType);
  };

  updatePlayerID = (id, battletag) => {
    this.setState({ playerLoginID: id });
    this.setState({ playerBattleTag: battletag });

    ls.set("id", id);
    ls.set("btag", battletag);
  };

  userLogout() {
    // Do other stuff later.
    this.setState({ playerLoginID: 0 });
    this.setState({ playerBattleTag: "" });

    ls.remove("id");
    ls.remove("btag");
  }

  buildLoginURL = () => {
    // China is a little different from the other regions and uses its own URL.
    if (this.state.playerRegion === "cn") {
      return (
        "https://www.battlenet.com.cn/oauth/authorize?client_id=" +
        this.state.client_id +
        "&redirect_uri=http://localhost:3000/confirmlogin/&response_type=code&scope=openid"
      );
    }
    return (
      "https://" +
      this.state.playerRegion +
      ".battle.net/oauth/authorize?client_id=" +
      this.state.client_id +
      "&redirect_uri=http://localhost:3000/confirmlogin/&response_type=code&scope=openid"
    );
  };

  // When component mounts, check local storage for battle tag or ID.
  componentDidMount() {
    this.setState({
      playerLoginID: ls.get("id") || "",
      playerBattleTag: ls.get("btag") || "",
      lang: ls.get("lang") || "en",
      contentType: ls.get("contentType") || "Raid",
    });

    i18n.changeLanguage(ls.get("lang") || "en");
  }

  render() {
    let activePlayer = this.state.characters.getActiveChar();
    let allChars = this.state.characters;

    function Alert(props) {
      return <MuiAlert elevation={6} variant="filled" {...props} />;
    }
    //alert(JSON.stringify(allChars[0]));

    return (
      <Router basename={"/qesl/"}>
        <ThemeProvider theme={theme}>
          <div className="App">
            <QEHeader
              logFunc={this.userLogout}
              playerTag={this.state.playerBattleTag}
              setRegion={this.setRegion}
              toggleContentType={this.toggleContentType}
              contentType={this.state.contentType}
              pl={activePlayer}
              simcSnack={this.handleSimCSnackOpen}
            />

            {/* // Char Added Snackbar */}
            <Snackbar
              open={this.state.charSnackState}
              autoHideDuration={3000}
              onClose={this.handleCharSnackClose}
            >
              <Alert onClose={this.handleCharSnackClose} severity="success">
                Character Added!
              </Alert>
            </Snackbar>

            {/* // Login Success Snackbar */}
            <Snackbar
              open={this.state.loginSnackState}
              autoHideDuration={3000}
              onClose={this.handleLoginClose}
            >
              <Alert onClose={this.handleLoginClose} severity="success">
                Logged in Successfully!
              </Alert>
            </Snackbar>

            {/* // SimC Success Snackbar */}
            <Snackbar
              open={this.state.simcSnackState}
              autoHideDuration={3000}
              onClose={this.handleSimCSnackClose}
            >
              <Alert onClose={this.handleSimCSnackClose} severity="success">
                SimC String Imported Successfully!
              </Alert>
            </Snackbar>

            <Switch>
              <Route
                exact
                path="/"
                render={() => (
                  <QEMainMenu
                    allChars={allChars}
                    charUpdate={this.updatePlayerChars}
                    pl={this.state.player}
                    charAddedSnack={this.handleCharSnackOpen}
                  />
                )}
              />
              <Route path="/holydiver" render={() => <HolyDiver />} />
              <Route
                path="/trinkets"
                render={() => <TrinketCompare pl={this.state.player} />}
              />
              <Route
                path="/quickcompare"
                render={() => (
                  <QuickCompare
                    pl={activePlayer}
                    contentType={this.state.contentType}
                  />
                )}
              />
              <Route
                path="/legendaries"
                render={() => (
                  <LegendaryCompare
                    pl={activePlayer}
                    langSet={this.langSet}
                    curLang={this.state.lang}
                    contentType={this.state.contentType}
                  />
                )}
              />

              <Route path="/soulbinds" render={() => <SimpleTabs />} />
              <Route
                path="/login"
                render={() => (
                  <QELogin
                    langSet={this.langSet}
                    curLang={this.state.lang}
                    setRegion={this.setRegion}
                  />
                )}
              />
              <Route
                path="/attemptlogin"
                component={() => (window.location = this.buildLoginURL())}
              />
              <Route
                path="/confirmlogin/"
                render={() => (
                  <ConfirmLogin
                    loginSnackOpen={this.handleLoginSnackOpen}
                    updatePlayerID={this.updatePlayerID}
                  />
                )}
              />
            </Switch>
          </div>
        </ThemeProvider>
      </Router>
    );
  }
}

export default withTranslation()(App);
