import React from 'react';
import { AuthContext } from "./context/AuthContext";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Console from "./screens/Console";
import NotFound from "./screens/NotFound";
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#3c8bdc'
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <AuthContext>
        <Router>
          <Switch>
            <Route exact path="/">
              <Console />
            </Route>
            <Route path="*">
              <NotFound />
            </Route>
          </Switch>
        </Router>
      </AuthContext>
    </ThemeProvider>
  );
}

export default App;
