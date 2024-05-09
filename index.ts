import { Telegraf } from "telegraf";
import { message } from "telegraf/filters";

import { bold } from "telegraf/format";
import { TG_TOKEN } from "./resources/constants";
import { check_generation, generate, getModel } from "./resources/api";

import fs from "fs";

const bot = new Telegraf(TG_TOKEN);

//Старт бота
bot.start(async (ctx) => {
  ctx.reply(
    bold(
      "Привет, этот бот умеет генерить картинки на нейросети Kandinsky 3.0, чтобы начать просто введи свой запрос"
    )
  );
});

// Команда /help
bot.help((ctx) => ctx.reply("Send me a sticker"));

bot.on(message("sticker"), (ctx) => ctx.reply("👍"));

bot.on(message("text"), async (ctx) => {
  if (ctx.text === "test") {
    const res = await getModel();

    ctx.sendPhoto({
      source: "./assets/test.jpg",
    });

    ctx.reply(JSON.stringify(res.data));
    return;
  }

  const generateResp = await generate({ prompt: ctx.text });

  ctx.reply("Генерируем, обычно это занимает 1-3 минуты");
  // ctx.reply(JSON.stringify(ctx.text));

  const image = await check_generation(generateResp as string);

  if ("error" in image) {
    ctx.reply("Произолшла ошибка, идите нахуй");
  }
  const base64codeString: string = image.images[0];
  const base64code = base64codeString.replace(/^data:image\/\w+;base64,/, "");

  const buffer = Buffer.from(base64code, "base64");

  fs.writeFile(`./assets/${image.uuid}.jpg`, buffer, "base64", (err) => {
    if (err) ctx.reply("Произолшла ошибка, идите нахуй");
  });

  ctx
    .sendPhoto({
      source: `./assets/${image.uuid}.jpg`,
    })
    .then(() => {
      ctx.reply(ctx.text);
      fs.unlink(`./assets/${image.uuid}.jpg`, (err) => {
        if (err) console.log("Не удален");
      });
    });
});

bot.hears("hi", (ctx) => ctx.reply("Hey there"));
bot.launch();
