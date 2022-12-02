import { Context, APIGatewayProxyCallback, APIGatewayEvent } from 'aws-lambda';
import { Client } from 'pg';

const signerOptions = {
    credentials: {
        acessKeyId: process.env.ACCESS_KEY,
        secretAccessKey: process.env.SECRET_ACCESS_KEY,
    },
    region: 'us-east-1',
    hostname: process.env.HOST,
    port: process.env.PORT,
    username: process.env.USER,
};

exports.handler = async (
    event: APIGatewayEvent,
    context: Context,
    callback: APIGatewayProxyCallback,
): Promise<unknown[]> => {
    const client = new Client({
        host: signerOptions.hostname,
        port: 5432,
        user: signerOptions.username,
        database: process.env.DATABASE,
        password: process.env.PASSWORD,
    });

    console.info('ENVIRONMENT VARIABLES\n' + JSON.stringify(process.env, null, 2));
    console.info('EVENT\n' + JSON.stringify(event, null, 2));
    console.info('CONTEXT\n' + JSON.stringify(context, null, 2));

    client.connect((err: Error) => {
        if (err) {
            console.error('error connecting to RDS', err.stack);
        } else {
            console.info('client has connected to RDS');
        }
    });

    const name = event.queryStringParameters?.name;
    const search = event.queryStringParameters?.search;
    const path = event.path;

    const queryParam = name ? name : search;

    console.info('name: ' + name);
    console.info('search: ' + search);
    console.info('path: ' + path);

    // get the resource being querier from the event path

    const result = await client.query('SELECT * FROM landlords WHERE name LIKE $1', [`%${queryParam?.toUpperCase()}%`]);

    console.info(result);

    return result.rows;

    client?.end(() => {
        console.info('the connection has been closed');
    });
};
