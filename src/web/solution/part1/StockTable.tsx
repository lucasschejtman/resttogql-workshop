import React, { Component } from "react";
import createStyles from "@material-ui/core/styles/createStyles";
import withStyles, { WithStyles } from "@material-ui/core/styles/withStyles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";

// STEP 0 - BEGIN
// Include the `graphqlOperation` method
import Amplify, { API, Auth, graphqlOperation } from "aws-amplify";
// STEP 0 - END

import { Link } from "react-router-dom";
import StockDetail from "./StockDetail";

// STEP 1 - BEGIN
// Include the AppSync queries
import * as queries from "./graphql/queries.js";
// STEP 1 - END

const API_NAME = "companies";

Amplify.configure({
    Auth: {
        region: process.env.REACT_APP_DEFAULT_REGION,
        userPoolId: process.env.REACT_APP_COGNITO_POOL_ID,
        userPoolWebClientId: process.env.REACT_APP_COGNITO_POOL_CLIENT_ID
    },
    API: {
        endpoints: [
            {
                name: API_NAME,
                endpoint: process.env.REACT_APP_API_ENDPOINT,
                region: process.env.REACT_APP_DEFAULT_REGION
            }
        ],

        // STEP 2 - BEGIN
        // Update the Amplify configuration
        graphql_headers: async () => ({
            Authorization: (await Auth.currentSession()).getIdToken().getJwtToken()
        }),
        aws_appsync_region: process.env.REACT_APP_DEFAULT_REGION,
        aws_appsync_authenticationType: "AMAZON_COGNITO_USER_POOLS",
        aws_appsync_graphqlEndpoint: process.env.REACT_APP_APPSYNC_ENDPOINT
        // STEP 2 - END
    }
});

const styles = (theme: any) =>
    createStyles({
        root: {
            width: "100%",
            marginTop: theme.spacing.unit * 3,
            overflowX: "auto",
            fontSize: "1.5em"
        },
        table: {
            minWidth: 700
        }
    });

type Row = {
    original: {
        company_id: number;
    };
};

type Company = {
    company_id: number;
    company_name: string;
    stock_name: string;
    stock_value: number;
};

interface Props extends WithStyles<typeof styles> {}

interface State {
    itemData: Array<Object>;
    authParams: { headers: { Authorization: string }; response: boolean };
}

class StockTable extends Component<Props, State> {
    columns = [];

    state = {
        itemData: [],
        authParams: { headers: { Authorization: "" }, response: false }
    };

    constructor(props: Props) {
        super(props);

        this.buyStock = this.buyStock.bind(this);
        this.renderStockDetail = this.renderStockDetail.bind(this);
    }

    async componentDidMount() {
        const session = await Auth.currentSession();
        this.setState({
            authParams: {
                headers: { Authorization: session.getIdToken().getJwtToken() },
                response: true
            }
        });

        // STEP 3 - BEGIN
        // Add in call to AppSync GraphQL Endpoint
        const apiData = await API.graphql(graphqlOperation(queries.ListCompanies));
        // STEP 3 - END

        //@ts-ignore
        this.setState({ itemData: apiData.data.listCompanies });
    }

    async buyStock(id: string) {
        const { data } = await API.put(API_NAME, `/company/${id}/stock`, this.state.authParams);
        console.log(data);
    }

    renderStockDetail(row: Row) {
        return (
            <div style={{ padding: "20px" }}>
                // @ts-ignore
                <StockDetail
                    authSettings={this.state.authParams}
                    selectedCompany={row.original["company_id"]}
                />
            </div>
        );
    }

    renderTable(classes: Record<"root" | "table", string>, rows: Array<Company>) {
        return (
            <Paper className={classes.root}>
                <Table className={classes.table}>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Symbol</TableCell>
                            <TableCell>Value</TableCell>
                            <TableCell />
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map(row => {
                            return (
                                <TableRow key={row.company_id}>
                                    <TableCell component="th" scope="row">
                                        {row.company_id}
                                    </TableCell>
                                    <TableCell>{row.company_name}</TableCell>
                                    <TableCell>{row.stock_name}</TableCell>
                                    <TableCell>{row.stock_value}</TableCell>
                                    <TableCell>
                                        <Link to={`/stock/${row.company_id}`}>
                                            <Button variant="contained" color="primary">
                                                Details
                                            </Button>
                                        </Link>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </Paper>
        );
    }

    render() {
        return <div>{this.renderTable(this.props.classes, this.state.itemData)}</div>;
    }
}

export default withStyles(styles)(StockTable);
