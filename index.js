////////////////////////////////////////LIBS\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

const { Telegraf, Markup, Scenes, session } = require('telegraf');
const settings = require('./settings.js')
const SceneGenerator = require('./scenes.js')
const KEYBOARD = require("./keyboard")
let prods = require("./products.json")
const fs = require("fs")
const message = require("./texts.js");
const { isUndefined } = require('util');
////////////////////////////////////////SETTINGS\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
const simpleGit = require('simple-git');
simpleGit().clean(simpleGit.CleanOptions.FORCE);



const scenes = new SceneGenerator()
const createScene = scenes.GenCreateScene()
const nameScene = scenes.GenNameScene()
let stage = new Scenes.Stage([createScene, nameScene])

let base = {}
fs.readdir("./base/", async (err, files) => {
     for (let key in files) {
          let name = files[key].split(".json").join(""); name.split(",").join("")
          base[name] = await require(`./base/${files[key]}`)
     }
})
const bot = new Telegraf(settings.token)
bot.use(session())
bot.use(stage.middleware())
function buttonMenu(bmenu, response = true) {
     let a = []
     for (let key in bmenu) {
          let b = []
          for (let key1 in bmenu[key]) {
               b.push(Markup.button.callback(bmenu[key][key1][0], bmenu[key][key1][1]),)
          }
          a.push(b)
     }
     if(response === true)return Markup.inlineKeyboard(a)
     return a
     
}

function buyMenu(prod) {
     let a = []
     a.push([Markup.button.callback(
          `Купить - ${prods[prod].price - (prods[prod].price / 100 * prods[prod].sale)
          }руб`, `buy${prod}`)]
     )
     a.push([Markup.button.callback(KEYBOARD.back[0][0], KEYBOARD.back[0][1])])

     return Markup.inlineKeyboard([
          [Markup.button.callback(
               `Купить - ${prods[prod].price - (prods[prod].price / 100 * prods[prod].sale)
               }руб`, `buy${prod}`)]
          [Markup.button.callback(KEYBOARD.back[0][0], KEYBOARD.back[0][1])]
     ])
}
function getRandomStr(len) {
     chrs = 'qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM1234567890йцукенгшщзхъфывапролджэячсмитьбюЙЦУКЕНГШЩЗХЪФЫФВАПРОЛДЖЭЯЧСМИТЬБЮ!?-_=+';
     var str = '';
     for (var i = 0; i < len; i++) {
          var pos = Math.floor(Math.random() * chrs.length);
          str += chrs.substring(pos, pos + 1);
     }
     return str;
}

//
setInterval(() => {
     for (let key in base) {
          fs.writeFileSync(`./base/${key}.json`, JSON.stringify(base[key], null, "\r"))
     }
     console.log("base rewrited<_")
}, 60000)

////////////////////////////////////////BOT ON\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
bot.on("message",(context, next)=>{
     if(base.rparray.includes(context.message.text)){
          if(isUndefined(context.message.reply_to_message) || context.message.reply_to_message.from.id === context.from.id){
               return context.replyWithHTML(`${base.rp[context.message.text].emo} | <a href="tg://user?id=${context.from.id}"><b>${context.from.first_name}</b></a> ${base.rp[context.message.text].text} <a href="tg://user?id=${context.from.id}"><b>Сам себя</b></a>`)
          }
          return context.replyWithHTML(`${base.rp[context.message.text].emo} | <a href="tg://user?id=${context.from.id}"><b>${context.from.first_name}</b></a> ${base.rp[context.message.text].text} <a href="tg://user?id=${context.message.reply_to_message.from.id}"><b>${context.message.reply_to_message.from.first_name}</b></a>`)
          }
     next()
})
bot.command("menu", (context) =>{
     if(context.getChatMembersCount() !== 1) return context.reply("Команда не работает в бебебесбабаба")
     context.reply("Хixixixixixixixixxixi", buttonMenu(KEYBOARD.menu))
})
bot.action("create",async (context)=>{
     await context.answerCbQuery()
     context.editMessageText("Напиши сообщение, на которое будет вызываться рп-команда:")
     await context.scene.enter("create")
     fs.readdir("./base/", async (err, files) => {
          for (let key in files) {
               let name = files[key].split(".json").join(""); name.split(",").join("")
               base[name] = await require(`./base/${files[key]}`)
          }
     })

})
bot.action("array", (context)=>{
     context.answerCbQuery()
     let a = ``
     for(let key in base.rparray){
          a += `${key + 1}. ${base.rparray[key]}\n`
     }
     context.reply(a)
})
////////////////////////////////////////START\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

/*bot.on("message", (context, next) => {
     if (base[context.message.from.id]) context.deleteMessage(context.message.id)

})*/

bot.launch();

// Enable graceful stop
process.once('SIGINT', () => {
     bot.stop('SIGINT');
})
process.once('SIGTERM', () => {
     bot.stop('SIGTERM')
})
console.log("Started<_")