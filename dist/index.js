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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const telegraf_1 = require("telegraf");
const filters_1 = require("telegraf/filters");
const format_1 = require("telegraf/format");
const constants_1 = require("./resources/constants");
const api_1 = require("./resources/api");
const fs_1 = __importDefault(require("fs"));
const bot = new telegraf_1.Telegraf(constants_1.TG_TOKEN);
//Старт бота
bot.start((ctx) => __awaiter(void 0, void 0, void 0, function* () {
    ctx.reply((0, format_1.bold)("Привет, этот бот умеет генерить картинки на нейросети Kandinsky 3.0, чтобы начать просто введи свой запрос"));
}));
// Команда /help
bot.help((ctx) => ctx.reply("Send me a sticker"));
bot.on((0, filters_1.message)("sticker"), (ctx) => ctx.reply("👍"));
bot.on((0, filters_1.message)("text"), (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    if (ctx.text === "test") {
        const res = yield (0, api_1.getModel)();
        ctx.sendPhoto({
            source: "./assets/test.jpg",
        });
        ctx.reply(JSON.stringify(res.data));
        return;
    }
    const generateResp = yield (0, api_1.generate)({ prompt: ctx.text });
    ctx.reply("Генерируем, обычно это занимает 1-3 минуты");
    // ctx.reply(JSON.stringify(ctx.text));
    const image = yield (0, api_1.check_generation)(generateResp);
    if ("error" in image) {
        ctx.reply("Произолшла ошибка, идите нахуй");
    }
    const base64codeString = image.images[0];
    const base64code = base64codeString.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64code, "base64");
    fs_1.default.writeFile(`./assets/${image.uuid}.jpg`, buffer, "base64", (err) => {
        if (err)
            ctx.reply("Произолшла ошибка, идите нахуй");
    });
    ctx
        .sendPhoto({
        source: `./assets/${image.uuid}.jpg`,
    })
        .then(() => {
        ctx.reply(ctx.text);
        fs_1.default.unlink(`./assets/${image.uuid}.jpg`, (err) => {
            console.log("Не удален");
        });
    });
}));
bot.hears("hi", (ctx) => ctx.reply("Hey there"));
bot.launch();
