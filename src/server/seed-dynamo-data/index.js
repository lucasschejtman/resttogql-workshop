const AWS = require("aws-sdk");
const ddb = new AWS.DynamoDB.DocumentClient();

const tableName = process.env.DDB_TABLE_NAME || "resttogql-company-table";
const COMPANIES = [
    {
        company_id: 0,
        company_name: "Xplor",
        company_description:
            "Ut nulla officia nulla ullamco aliqua excepteur laborum qui id officia. Ea quis irure duis pariatur. Dolore consequat excepteur cupidatat aliquip irure laboris ad. Magna aliqua pariatur ullamco consequat pariatur officia consectetur eu. Incididunt occaecat incididunt laboris et. Nostrud culpa occaecat eiusmod labore laboris id Lorem officia laboris consequat. Voluptate sit eu in culpa proident veniam proident.",
        stock_name: "XPLO",
        stock_value: 139.72,
        delta: 0
    },
    {
        company_id: 1,
        company_name: "Jimbies",
        company_description:
            "Mollit magna sunt sunt deserunt minim sint nulla ullamco. Laborum fugiat cillum nostrud ut labore dolor eiusmod nostrud aliquip non proident ullamco. Consectetur ut in tempor reprehenderit laboris reprehenderit minim cillum. Non exercitation quis elit nisi labore do veniam dolore consequat eiusmod id pariatur irure nisi. Laborum veniam nisi amet amet id et cillum ad minim pariatur eu sit ullamco incididunt.",
        stock_name: "JIMB",
        stock_value: 275.82,
        delta: 0
    },
    {
        company_id: 2,
        company_name: "Pharmacon",
        company_description:
            "Culpa exercitation nostrud officia labore. In veniam ut velit laborum occaecat anim dolor dolor ullamco. Adipisicing exercitation aliquip duis pariatur Lorem enim irure eu nostrud magna magna. Ut cupidatat nostrud qui esse sint. Qui quis velit officia quis in officia occaecat culpa elit irure magna amet occaecat. Non cupidatat aliquip consequat ex elit nostrud non exercitation incididunt magna labore Lorem.",
        stock_name: "PHAR",
        stock_value: 365.77,
        delta: 0
    },
    {
        company_id: 3,
        company_name: "Accel",
        company_description:
            "Veniam esse do esse cillum exercitation laboris est nostrud. Mollit ea laboris eiusmod in. Commodo dolore id dolor non commodo. Culpa esse ut ex occaecat consectetur enim fugiat veniam nisi excepteur. Ut consectetur dolore excepteur cupidatat sit sunt ipsum deserunt. Est voluptate cillum deserunt incididunt duis in nisi fugiat incididunt.",
        stock_name: "ACCE",
        stock_value: 121.81,
        delta: 0
    },
    {
        company_id: 4,
        company_name: "Digifad",
        company_description:
            "Anim dolore ex ex culpa tempor commodo excepteur ullamco in labore nostrud voluptate anim. Fugiat ipsum ullamco ad anim elit amet exercitation Lorem elit ex reprehenderit culpa. Ad aliqua nostrud consequat ex do cillum excepteur commodo.",
        stock_name: "DIGI",
        stock_value: 163.5,
        delta: 0
    },
    {
        company_id: 5,
        company_name: "Makingway",
        company_description:
            "Tempor non fugiat mollit nulla sunt commodo sunt proident labore nostrud laboris velit. Cupidatat voluptate minim consectetur veniam incididunt nostrud dolore incididunt duis dolore cupidatat nostrud. Commodo sunt ex commodo culpa sit eu amet.",
        stock_name: "MAKI",
        stock_value: 314.81,
        delta: 0
    },
    {
        company_id: 6,
        company_name: "Irack",
        company_description:
            "Consequat culpa labore commodo ipsum. In id id cillum in non ex in amet qui est officia nostrud. Pariatur ea elit nisi ea dolore est ut sunt do qui ex officia id. Occaecat minim dolore cillum esse incididunt magna nostrud.",
        stock_name: "IRAC",
        stock_value: 197.41,
        delta: 0
    },
    {
        company_id: 7,
        company_name: "Affluex",
        company_description:
            "Tempor laborum nostrud esse ea officia qui Lorem cillum do et consectetur. Commodo nostrud officia dolore deserunt aliquip. Reprehenderit non adipisicing adipisicing velit do mollit pariatur cupidatat. Minim amet ad deserunt duis do cupidatat commodo incididunt enim nostrud deserunt aliquip. Tempor qui exercitation cillum dolor exercitation anim. Officia irure amet est in exercitation. Irure anim eiusmod sunt eu ullamco ut amet in eu dolor laboris esse non aliquip.",
        stock_name: "AFFL",
        stock_value: 186.09,
        delta: 0
    },
    {
        company_id: 8,
        company_name: "Coash",
        company_description:
            "Nostrud amet nostrud anim duis eu reprehenderit aliqua reprehenderit fugiat enim cillum occaecat. Esse nulla minim laboris consequat consectetur consectetur qui id amet. Velit esse sint fugiat sit deserunt duis ea minim. Occaecat exercitation labore voluptate excepteur incididunt qui eu laboris incididunt amet. Ullamco nisi ullamco enim deserunt elit exercitation.",
        stock_name: "COAS",
        stock_value: 113.65,
        delta: 0
    },
    {
        company_id: 9,
        company_name: "Kengen",
        company_description:
            "Commodo qui amet voluptate eiusmod elit dolore. Excepteur pariatur aliquip tempor ea. Eu cupidatat esse veniam dolor. Id quis reprehenderit fugiat amet. Duis sint cupidatat ex elit laborum proident sit dolor enim. Proident ad id dolor nulla minim ullamco cillum enim laborum do ullamco consectetur dolor. Fugiat voluptate enim ipsum dolore magna excepteur reprehenderit.",
        stock_name: "KENG",
        stock_value: 278.32,
        delta: 0
    }
];

const dataToItem = items => items.map(item => ({ PutRequest: { Item: item } }));

exports.handler = async _ => {
    try {
        const items = dataToItem(COMPANIES);
        const params = {
            RequestItems: {
                [tableName]: items
            }
        };
        await ddb.batchWrite(params).promise();
        return "Seed operation succeded";
    } catch (err) {
        console.log(err);
        return "Seed operation failed";
    }
};
