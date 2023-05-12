const { Scenes, Markup, Telegraf } = require('telegraf')
const fs = require('fs')
const ba = require("./base/rparray.json")
const b = require("./base/rp.json")
function buttonMenu(bmenu, response = true) {
    let a = []
    for (let key in bmenu) {
        let b = []
        for (let key1 in bmenu[key]) {
            b.push(Markup.button.callback(bmenu[key][key1][0], bmenu[key][key1][1]),)
        }
        a.push(b)
    }
    if (response === true) return Markup.inlineKeyboard(a)
    return a

}
const KEYBOARD = require("./keyboard")

class SceneGenerator {
    GenCreateScene() {
        const firstNameStep =
            Telegraf.on('text', (context) => {
                context.wizard.state.firstName = context.message.text;
                context.reply('Теперь напиши рп команду: в первой строке эмодзи, во второй - текст:');
                if (b[context.wizard.state.firstName]) return context.reply("Команда уже занята, выбери другую")
                return context.wizard.next();
            });

        // Создаем второй шаг сцены
        const lastNameStep =
            Telegraf.on('text', (context) => {
                let a = context.message.text.split("\n")
                if (a.length != 2) {
                    return context.reply("Вы должны сделать две строки: в первой эмодзи, во второй - текст")
                }
                context.wizard.state.lastName = context.message.text;
                context.reply(`Вот, что получилось:
${a[0]}| {Вызывающий команду} ${a[1]} {Юзер из ответа}`, Markup.keyboard([
                    ["✔", "❌"]
                ]).oneTime().resize());
                return context.wizard.next();
            });
        const end =
            Telegraf.hears(/^[✔|❌]+$/, async (context) => {
                console.log("dfgdfgdfg")
                let a = context.wizard.state.lastName.split("\n")
                if (context.message.text === "❌") {
                    console.log("dfgdfgdfg")
                    context.reply("Вы успешно отменили создание рп команды",{
                        reply_markup: {
                            remove_keyboard: true
                        }
                    })
                    return context.scene.leave()
                }
                console.log("dfgdfgdfgC")
                ba.push(context.wizard.state.firstName)
                await fs.writeFileSync(`./base/rparray.json`, JSON.stringify(ba, null, "\r"))
                console.log(a)
                b[context.wizard.state.firstName] = {
                    "emo": a[0],
                    "text": a[1]
                }
                await fs.writeFileSync(`./base/rp.json`, JSON.stringify(b, null, "\r"))
                await console.log("dfgdfgdfgA")
                await context.reply("Вы успешно создали команду!",{
                    reply_markup: {
                        remove_keyboard: true
                    }
                })
                return context.scene.leave();
            });
        const create = new Scenes.WizardScene('create', firstNameStep, lastNameStep, end);

        return create

    }


    GenNameScene() {
        const name = new Scenes.BaseScene('name')
        name.enter((context) => context.reply('Напиши команду, при которой будет вызываться рп:'))
        name.on('text', async (context) => {
            ba.push(context.text)
            fs.writeFileSync(`./base/rparray.json`, JSON.stringify(ba, null, "\r"))
            await context.scene.leave()
        })
        return name
    }
}

module.exports = SceneGenerator