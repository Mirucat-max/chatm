const kb = require('./keyboard-buttons')
module.exports={
    home:[
        [kb.home.tasks, kb.home.quests],
        [kb.home.me, kb.home.news]
    ],
    help:[
        [kb.help.call, kb.help.write],
        [kb.back.backward]
    ],
    cancel:[
        [kb.cancel.cancel]
    ],
    start:[
        [kb.home.quests]
    ],
    back:[
        [kb.back.backward]
    ],
    news:[
        [kb.back.backward,kb.more.more]
    ],
    catalog:[
        [kb.categories.bots],
        [kb.back.backward]
    ],
    bots: [
        [kb.products.shop],
        [kb.back.backward]
    ],
    tasks: [
        [kb.tasks.simpleTasks, kb.tasks.dailyTasks],
        [kb.tasks.habits, kb.tasks.tasksInQueue],
        [kb.tasks.create],
        [kb.cancel.cancel]
    ],
    menu: [
        [kb.tasks.create],
        [kb.tasks.array]
    ],
    createTasks:[
        [kb.tasks.simpleTasks, kb.tasks.dailyTasks],
        [kb.tasks.habits, kb.tasks.tasksInQueue],
        [kb.cancel.cancel]
    ],
    yesno:[
        [kb.answer.yes, kb.answer.no]
    ]

}