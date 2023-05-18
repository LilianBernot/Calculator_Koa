import koa from "koa";
import koaLogger from "koa-logger";
import {koaBody} from "koa-body";
import koaRouter from "koa-router";
import json from "koa-json";
import render from "koa-ejs";
import bodyparser from "koa-body-parser";
import {evaluateExpression} from "./calcul.js"

import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = new koa();
app.use(koaLogger());

import serve from 'koa-static';
app.use(serve(path.join(__dirname, '../front/styles')))

app.use(json()); // to display beautiful json

app.use(bodyparser());

const router = new koaRouter();

render(app, {
    root: path.join(__dirname, '../front'),
    layout: '../front/index',
    viewExt: 'html',
    cache: false, 
    debug: false
})

// setting the router middleware
app.use(router.routes()).use(router.allowedMethods());
router.get("/test", async (ctx) => {
    ctx.body = {'msg': "This is coming from a test endpoint"}
});

// displaying the first page

let values = "";
let dict = {
    "operand_1":null,
    "operator":null,
    "operand_2":null,
    "status":null,
    "resultado":null,
    "error_message":null
}
let to_empty = false;

router.get('/', async (ctx) => {
    await ctx.render('add', {
        'output' : values,
    });
})

// add value
router.post('/add_number', add_value);
async function add_value(ctx){
    if (to_empty){
        values = "";
        dict = {
            "operand_1":null,
            "operator":null,
            "operand_2":null,
            "status":null,
            "resultado":null,
            "error_message":null
        }
        to_empty = false;
    }
    const body = ctx.request.body;
    const value = body.value;
    values += value;
    ctx.redirect('/');
}

// calculate the operation
// router.post('/calculate', calculate);
// async function calculate(ctx){
//     values = values + " = " + evaluateExpression(values);
//     to_empty = true;
//     ctx.redirect('/');
// }

let url = "/test_calcul"

router.get('/calculate', calculate);
async function calculate(ctx){
    dict = evaluateExpression(values);
    to_empty = true;

    if(dict.status){
        values = values + " = " + dict.resultado;
    } else {
        values = dict.error_message;
    }

    console.log(dict);

    if(dict.operator === "+"){
        url = "/suma/" + dict.operand_1 + "/" + dict.operand_2;
    } else if (dict.operator === "*"){
        url = "/multi/" + dict.operand_1 + "/" + dict.operand_2;
    } else {
        url = "/";
    }
    
    ctx.redirect(url);
}

router.get("/:dynamic/:dynamic_2/:dynamic_3", async (ctx) => {
    // const dynamic = ctx.params.dynamic;
    await ctx.render('add', {
        'output' : values,
    });
});

// deleting one digit
router.post('/delete_one_digit', delete_one_digit);
async function delete_one_digit(ctx){
    values = values.slice(0, -1);
    ctx.redirect('/');
}

// deleting all digits
router.post('/delete_all_digits', delete_all_digits);
async function delete_all_digits(ctx){
    values = "";
    ctx.redirect('/');
}

// initial

app.use(async (ctx) => {
    ctx.body = "Esta ruta no existe";
});

// const port = 5000;
var port = process.env.PORT || '5000';
app.listen(port, () => {
    console.log("App has started on port " + String(port));
});