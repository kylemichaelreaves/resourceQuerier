import { Context, APIGatewayProxyCallback, APIGatewayEvent, APIGatewayProxyResult } from 'aws-lambda';
import { Client, QueryResult } from 'pg';

exports.handler = async (
    event: APIGatewayEvent,
    context: Context,
    callback: APIGatewayProxyCallback,
): Promise<QueryResult> => {
    console.info('ENVIRONMENT VARIABLES\n' + JSON.stringify(process.env, null, 2));
    console.info('EVENT\n' + JSON.stringify(event, null, 2));
    console.info('CONTEXT\n' + JSON.stringify(context, null, 2));

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

    const client = new Client({
        host: signerOptions.hostname,
        port: 5432,
        user: signerOptions.username,
        database: process.env.DATABASE,
        password: process.env.PASSWORD,
    });

    client.connect((err: Error) => {
        if (err) {
            console.error('error connecting to RDS', err.stack);
        } else {
            console.info('client has connected to RDS');
        }
    });

    const name = event.queryStringParameters?.name;
    console.info('name: ' + name);

    const result = await client.query('SELECT * FROM landlords WHERE name LIKE UPPER(`%${name}%`);');

    console.info(result);

    return result;

    client?.end(() => {
        console.info('the connection has been closed');
    });
};
