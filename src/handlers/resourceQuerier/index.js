"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const handler = (event, context, callback) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
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
    const client = new pg_1.Client({
        host: signerOptions.hostname,
        port: 5432,
        user: signerOptions.username,
        database: process.env.DATABASE,
        password: process.env.PASSWORD,
    });
    client.connect((err) => {
        if (err) {
            console.error('error connecting to RDS', err.stack);
        }
        else {
            console.info('client has connected to RDS');
        }
    });
    const name = (_a = event.queryStringParameters) === null || _a === void 0 ? void 0 : _a.name;
    const result = yield client.query('SELECT * FROM landlords WHERE name LIKE UPPER(`%${name}%`);');
    console.info(result);
    client.end(() => {
        console.info('the connection has been closed');
    });
});
exports.handler = handler;
