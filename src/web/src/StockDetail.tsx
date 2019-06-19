import React, { Component } from 'react';
import { RouteComponentProps } from "react-router-dom";
import createStyles from '@material-ui/core/styles/createStyles';
import withStyles, { WithStyles } from '@material-ui/core/styles/withStyles';
import Grid from '@material-ui/core/Grid';
import { API, Auth } from 'aws-amplify';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Label } from 'recharts';

import MediaCard from './MediaCard';
import StockActions from './StockActions';

const styles = (theme: any) => createStyles({
    root: {
        flexGrow: 1
    },
    paper: {
        padding: theme.spacing.unit * 2,
        textAlign: 'center',
        color: theme.palette.text.secondary
    }
});

type stockResponse = {
    _source: {
        stockValue: string
    }
};

interface State {
    stockData: Array<{ date: string, price: number | null}>,
    interval: number,
    id: number,
    authParams: { headers: { Authorization: string }, response: boolean },
    company: {
        stock_value: number,
        company_name: string,
        company_description: string
    },
    simulate: boolean,
    simulation: number
}

interface StyleProps extends WithStyles<typeof styles> {}
interface RouterProps extends RouteComponentProps<{}> {}
type Props = StyleProps & RouterProps & {
    selectedCompany: number,
    authSettings: { headers: { Authorization: string }, response: boolean }
};

class StockDetail extends Component<Props, State> {
    state = {
        stockData: [{ date: 'Today', price: null }],
        interval: 0,
        id: 0,
        authParams: { headers: { Authorization: "" }, response: false },
        company: { stock_value: 0, company_name: "", company_description: ""},
        simulate: false,
        simulation: 0
    }

    constructor(props: Props) {
        super(props);

        // @ts-ignore
        this.state.id = props.match.params.id

        this.onAction = this.onAction.bind(this);
        this.renderChart = this.renderChart.bind(this);
        this.retrieveStock = this.retrieveStock.bind(this);
        this.startAutoRefresh = this.startAutoRefresh.bind(this);
        this.onSimulate = this.onSimulate.bind(this);
        this.stopAutoRefresh = this.stopAutoRefresh.bind(this);
        this.onAutoRefresh = this.onAutoRefresh.bind(this);
    }

    async retrieveStock() {
        const res = await API.get('companies', `/company/${this.state.id}/stock`, this.state.authParams);
        const stockData = res.data.map((r: stockResponse) => ({ data: 'Today', price: Number(r._source.stockValue) }));
        this.setState({ stockData });
    }

    async componentDidMount() {
        const session = await Auth.currentSession();
        this.setState({
            authParams: {
                headers: { "Authorization": session.getIdToken().getJwtToken() },
                response: true
            }
        });
        this.retrieveStock();
        const { data } = await API.get('companies', `/company/${this.state.id}`, this.state.authParams);
        this.setState({ company: data.Item });
    }

    componentWillUnmount() {
        this.stopAutoRefresh();
    }

    onAutoRefresh(autorefresh: boolean) {
        if(autorefresh)
            return this.startAutoRefresh();
        this.stopAutoRefresh();
    }

    startAutoRefresh() {
        this.setState({
            interval: window.setInterval(this.retrieveStock, 3000)
        });
    }

    stopAutoRefresh() {
        if(this.state.interval === 0) return;
        window.clearInterval(this.state.interval);
    }

    async onAction() {
        const { data } = await API.put('companies', `/company/${this.state.id}/stock`, this.state.authParams);
        const newComp = { ...this.state.company, stock_value: data.Attributes.stock_value };
        this.setState({
            company: newComp
        });
    }

    async onSimulate() {
        this.setState({ simulate: !this.state.simulate });
        if(this.state.simulate) 
            return window.clearInterval(this.state.simulation);

        this.setState({ simulation: window.setInterval(this.onAction, 5000) });
    }

    renderChart() {
        return(
            <div>
                <LineChart width={600} height={250} data={this.state.stockData} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis domain={['auto', 'auto']}>
                        <Label angle={90} value="Stock Price" position="insideLeft" style={{textAnchor: "middle" }} />
                    </YAxis>
                    <Tooltip 
                        wrapperStyle={{
                            borderColor: "white",
                            boxShadow: "2px 2px 3px 0px rgb(204,204,204)"
                        }}
                        labelStyle={{ fontWeight: "bold", color: "#666666" }} />
                    <Line dataKey="price" stroke="#ff7300" dot={false} />
                </LineChart>
            </div>
        )
    }

    render() {
        const { classes } = this.props;

        return(
            <div className={classes.root}>
                <Grid container spacing={24}>
                    <Grid item xs={6}>
                        <MediaCard
                            media={this.renderChart()}
                            value={this.state.company.stock_value}
                            onAutoRefresh={this.onAutoRefresh}>
                        </MediaCard>
                    </Grid>
                    <Grid item xs={6}>
                        <StockActions
                            company_name={this.state.company.company_name}
                            company_description={this.state.company.company_description}
                            simulate={this.state.simulate}
                            onAction={this.onAction}
                            onSimulate={this.onSimulate}>
                        </StockActions>
                    </Grid>
                </Grid>
            </div>
        )
    }
}

export default withStyles(styles)(StockDetail);