import Amplify from "aws-amplify";
//@ts-ignore
import { withAuthenticator } from "aws-amplify-react";
import React, { Component } from "react";

import StockTable from "./StockTable";

require("dotenv").config();

class App extends Component {
    render() {
        return <StockTable />;
    }
}

export default withAuthenticator(App, false);
