import React, { Component } from "react";
import { RouteComponentProps } from "react-router-dom";
import createStyles from "@material-ui/core/styles/createStyles";
import withStyles, { WithStyles } from "@material-ui/core/styles/withStyles";
import Grid from "@material-ui/core/Grid";
import { API, graphqlOperation, Auth } from "aws-amplify";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Label } from "recharts";

import * as queries from "./graphql/queries.js";
import * as mutations from "./graphql/mutations.js";

// STEP 0 - BEGIN
// Include the AppSync subscriptions
import * as subscriptions from "./graphql/subscriptions.js";
// STEP 0 - END

import MediaCard from "./MediaCard";
import StockActions from "./StockActions";

const styles = (theme: any) =>
    createStyles({
        root: {
            flexGrow: 1
        },
        paper: {
            padding: theme.spacing.unit * 2,
            textAlign: "center",
            color: theme.palette.text.secondary
        }
    });

type stockResponse = {
    stock_value: string;
};

interface State {
    stockData: Array<{ date: string; price: number | null }>;
    interval: number;
    id: number;
    authParams: { headers: { Authorization: string }; response: boolean };
    company: {
        stock_value: number;
        company_name: string;
        company_description: string;
    };
    simulate: boolean;
    simulation: number;

    // STEP 1 - BEGIN
    // Add a new state property
    stockSubscription: {};
    // STEP 1 - END
}

interface StyleProps extends WithStyles<typeof styles> {}
interface RouterProps extends RouteComponentProps<{}> {}
type Props = StyleProps &
    RouterProps & {
        selectedCompany: number;
        authSettings: { headers: { Authorization: string }; response: boolean };
    };

class StockDetail extends Component<Props, State> {
    state = {
        stockData: [{ date: "Today", price: null }],
        interval: 0,
        id: 0,
        authParams: { headers: { Authorization: "" }, response: false },
        company: { stock_value: 0, company_name: "", company_description: "" },
        simulate: false,
        simulation: 0,

        // STEP 2 - BEGIN
        // Implement the new state property
        stockSubscription: {
            unsubscribe: () => {}
        }
        // STEP 2 - END
    };

    constructor(props: Props) {
        super(props);

        // @ts-ignore
        this.state.id = props.match.params.id;

        this.onAction = this.onAction.bind(this);
        this.renderChart = this.renderChart.bind(this);
        this.retrieveHistogram = this.retrieveHistogram.bind(this);
        this.onSimulate = this.onSimulate.bind(this);

        // STEP 2 - BEGIN
        // Bind the function that will receive the subscription updates
        this.onStock = this.onStock.bind(this);
        // STEP 2 - END

        // STEP 3 - BEGIN
        // Initiate the AppSync subscription
        this.state.stockSubscription = API.graphql(graphqlOperation(subscriptions.SubscribeToStock))
            //@ts-ignore
            .subscribe({
                next: this.onStock
            });
        // STEP 3 - END
    }

    // STEP 4 - BEGIN
    // Implement the function that will receive the subscription updates
    async onStock({ value }: any) {
        console.log("On Stock change: ", value.data);
        const newComp = {
            ...this.state.company,
            stock_value: value.data.onStockChange.stock_value
        };
        this.setState({
            company: newComp
        });
        await this.retrieveHistogram();
    }
    // STEP 4 - END

    async componentDidMount() {
        //@ts-ignore
        const { data } = await API.graphql(
            graphqlOperation(queries.GetCompany, { id: this.state.id })
        );
        this.setState({ company: data.getCompany });
    }

    async retrieveHistogram() {
        //@ts-ignore
        const { data } = await API.graphql(
            graphqlOperation(queries.GetHistogram, {
                company_id: this.state.id,
                limit: 10
            })
        );

        const stockData = data.stockHistogram.map((r: stockResponse) => ({
            date: "Today",
            price: Number(r.stock_value)
        }));
        this.setState({ stockData });
    }

    componentWillUnmount() {
        // STEP 5 - BEGIN
        // Clean up the subscription connection when the component is no longer needed
        this.state.stockSubscription.unsubscribe();
        // STEP 5 - END
    }

    async onAction() {
        //@ts-ignore
        await API.graphql(
            graphqlOperation(mutations.UpdateCompanyStock, {
                company_id: this.state.id
            })
        );
    }

    async onSimulate() {
        this.setState({ simulate: !this.state.simulate });
        if (this.state.simulate) return window.clearInterval(this.state.simulation);

        this.setState({ simulation: window.setInterval(this.onAction, 5000) });
    }

    renderChart() {
        return (
            <div>
                <LineChart
                    width={600}
                    height={250}
                    data={this.state.stockData}
                    margin={{ top: 5, right: 5, bottom: 5, left: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis domain={["auto", "auto"]}>
                        <Label
                            angle={90}
                            value="Stock Price"
                            position="insideLeft"
                            style={{ textAnchor: "middle" }}
                        />
                    </YAxis>
                    <Tooltip
                        wrapperStyle={{
                            borderColor: "white",
                            boxShadow: "2px 2px 3px 0px rgb(204,204,204)"
                        }}
                        labelStyle={{ fontWeight: "bold", color: "#666666" }}
                    />
                    <Line dataKey="price" stroke="#ff7300" dot={false} />
                </LineChart>
            </div>
        );
    }

    render() {
        const { classes } = this.props;

        return (
            <div className={classes.root}>
                <Grid container spacing={24}>
                    <Grid item xs={6}>
                        <MediaCard
                            media={this.renderChart()}
                            value={this.state.company.stock_value}
                            onAutoRefresh={() => {}}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <StockActions
                            company_name={this.state.company.company_name}
                            company_description={this.state.company.company_description}
                            simulate={this.state.simulate}
                            onAction={this.onAction}
                            onSimulate={this.onSimulate}
                        />
                    </Grid>
                </Grid>
            </div>
        );
    }
}

export default withStyles(styles)(StockDetail);
