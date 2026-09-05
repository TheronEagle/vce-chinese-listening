import type { Exercise } from '../types';

export const EXERCISES_BATCH4: Exercise[] = [
  // EXERCISE 11: School
  {
    id: 'ex-011',
    createdAt: '2026-09-04',
    script: {
      id: 'script-011',
      title: '中国的学校生活',
      topic: 'school',
      difficulty: 'beginner',
      dialogue: [
        { speaker: 'A', speakerName: '小明', chinese: '安娜，你在哪个学校上学？', pinyin: 'Ānnà, nǐ zài nǎ gè xuéxiào shàng xué?', english: 'Anna, which school do you go to?' },
        { speaker: 'B', speakerName: '安娜', chinese: '我在墨尔本中文学校学中文。每个星期六去上课。', pinyin: 'Wǒ zài Mò\'ěrběn zhōngwén xuéxiào xué zhōngwén. Měi gè xīngqīliù qù shàng kè.', english: 'I go to Melbourne Chinese School to learn Chinese. I have classes every Saturday.' },
        { speaker: 'A', speakerName: '小明', chinese: '你们中文课学什么？', pinyin: 'Nǐmen zhōngwén kè xué shénme?', english: 'What do you learn in Chinese class?' },
        { speaker: 'B', speakerName: '安娜', chinese: '我们学汉字、拼音、语法，还有听力和口语。老师还教我们唱中文歌。', pinyin: 'Wǒmen xué hànzì, pīnyīn, yǔfǎ, hái yǒu tīnglì hé kǒuyǔ. Lǎoshī hái jiào wǒmen chàng zhōngwén gē.', english: 'We learn characters, pinyin, grammar, listening, and speaking. The teacher also teaches us Chinese songs.' },
        { speaker: 'A', speakerName: '小明', chinese: '你觉得学中文难吗？', pinyin: 'Nǐ juédé xué zhōngwén nán ma?', english: 'Do you find learning Chinese difficult?' },
        { speaker: 'B', speakerName: '安娜', chinese: '写汉字比较难，因为笔画很多。但是拼音不难。听中文歌对学中文很有帮助。', pinyin: 'Xiě hànzì bǐjiào nán, yīnwèi bǐhuà hěn duō. Dànshì pīnyīn bù nán. Tīng zhōngwén gē duì xué zhōngwén hěn yǒu bāngzhù.', english: 'Writing characters is harder because there are many strokes. But pinyin isn\'t hard. Listening to Chinese songs is very helpful for learning Chinese.' },
        { speaker: 'A', speakerName: '小明', chinese: '你的中文说得很好！', pinyin: 'Nǐ de zhōngwén shuō de hěn hǎo!', english: 'Your Chinese is very good!' },
        { speaker: 'B', speakerName: '安娜', chinese: '谢谢！我每天在家练习说中文。我妈妈是中国人，她教我说话。', pinyin: 'Xièxie! Wǒ měitiān zài jiā liànxí shuō zhōngwén. Wǒ māma shì Zhōngguórén, tā jiào wǒ shuōhuà.', english: 'Thanks! I practise speaking Chinese at home every day. My mum is Chinese, and she teaches me to speak.' },
      ],
      vocabulary: [
        { chinese: '汉字', pinyin: 'hànzì', english: 'Chinese characters', partOfSpeech: 'noun' },
        { chinese: '拼音', pinyin: 'pīnyīn', english: 'Pinyin (romanization)', partOfSpeech: 'noun' },
        { chinese: '语法', pinyin: 'yǔfǎ', english: 'grammar', partOfSpeech: 'noun' },
        { chinese: '笔画', pinyin: 'bǐhuà', english: 'strokes (of characters)', partOfSpeech: 'noun' },
        { chinese: '帮助', pinyin: 'bāngzhù', english: 'help', partOfSpeech: 'verb/noun' },
      ],
      fullEnglish: 'Xiao Ming: Anna, which school do you go to?\nAnna: I go to Melbourne Chinese School to learn Chinese. I have classes every Saturday.\nXiao Ming: What do you learn in Chinese class?\nAnna: We learn characters, pinyin, grammar, listening, and speaking. The teacher also teaches us Chinese songs.\nXiao Ming: Do you find learning Chinese difficult?\nAnna: Writing characters is harder because there are many strokes. But pinyin isn\'t hard. Listening to Chinese songs is very helpful for learning Chinese.\nXiao Ming: Your Chinese is very good!\nAnna: Thanks! I practise speaking Chinese at home every day. My mum is Chinese, and she teaches me to speak.',
    },
    questions: [
      { id: 'q-011-mc', type: 'multiple_choice', chineseQuestion: '安娜什么时候去上中文课？', englishInstruction: 'When does Anna go to Chinese class?', marks: 1, options: ['每天', '每星期六', '每星期日', '放假的时候'], correctOptionIndex: 1, modelAnswer: '每星期六', sourceReference: '每个星期六去上课' },
      { id: 'q-011-three', type: 'which_three', chineseQuestion: '安娜在中文课上学什么？请说出三项。', englishInstruction: 'What three things does Anna learn in Chinese class?', marks: 3, markingPoints: [
        { id: 'mp-82', keyIdea: 'Characters and pinyin', englishMeaning: 'Learn characters and pinyin', chineseKeywords: ['汉字', '拼音'], marks: 1 },
        { id: 'mp-83', keyIdea: 'Grammar', englishMeaning: 'Learn grammar', chineseKeywords: ['语法'], marks: 1 },
        { id: 'mp-84', keyIdea: 'Listening, speaking, Chinese songs', englishMeaning: 'Learn listening, speaking, and Chinese songs', chineseKeywords: ['听力', '口语', '歌'], marks: 1 },
      ], modelAnswer: '学汉字、拼音、语法，还有听力和口语，还学唱中文歌。', sourceReference: '我们学汉字、拼音、语法，还有听力和口语。老师还教我们唱中文歌。' },
      { id: 'q-011-why', type: 'why_reason', chineseQuestion: '安娜觉得写汉字为什么比较难？', englishInstruction: 'Why does Anna find writing characters difficult?', marks: 1, markingPoints: [
        { id: 'mp-85', keyIdea: 'Many strokes', englishMeaning: 'Characters have many strokes', chineseKeywords: ['笔画', '多'], marks: 1 },
      ], modelAnswer: '因为笔画很多。', sourceReference: '写汉字比较难，因为笔画很多' },
    ],
  },

  // EXERCISE 12: Myths & Legends
  {
    id: 'ex-012',
    createdAt: '2026-09-04',
    script: {
      id: 'script-012',
      title: '嫦娥奔月的故事',
      topic: 'myths_legends',
      difficulty: 'intermediate',
      dialogue: [
        { speaker: 'A', speakerName: '李老师', chinese: '同学们，中秋节快到了。谁知道中秋节和什么传说有关？', pinyin: 'Tóngxuémen, Zhōngqiū jié kuài dào le. Shéi zhīdào Zhōngqiū jié hé shénme chuánshuō yǒu guān?', english: 'Students, Mid-Autumn Festival is coming soon. Who knows what legend is related to Mid-Autumn Festival?' },
        { speaker: 'B', speakerName: '小华', chinese: '老师，是嫦娥奔月的故事！', pinyin: 'Lǎoshī, shì Cháng\'é bēn yuè de gùshì!', english: 'Teacher, it\'s the story of Chang\'e Flying to the Moon!' },
        { speaker: 'A', speakerName: '李老师', chinese: '对！请你给大家讲讲这个故事。', pinyin: 'Duì! Qǐng nǐ gěi dàjiā jiǎngjiang zhège gùshì.', english: 'Correct! Please tell everyone this story.' },
        { speaker: 'B', speakerName: '小华', chinese: '很久很久以前，天上出现了十个太阳。一个叫后羿的英雄用弓箭射下了九个太阳，只留了一个。', pinyin: 'Hěn jiǔ hěn jiǔ yǐqián, tiānshàng chūxiàn le shí gè tàiyáng. Yí gè jiào Hòuyì de yīngxióng yòng gōngjiàn shè xià le jiǔ gè tàiyáng, zhǐ liú le yí gè.', english: 'A long, long time ago, ten suns appeared in the sky. A hero named Hou Yi used his bow and arrow to shoot down nine suns, leaving only one.' },
        { speaker: 'A', speakerName: '李老师', chinese: '后来呢？', pinyin: 'Hòulái ne?', english: 'What happened next?' },
        { speaker: 'B', speakerName: '小华', chinese: '后来，王母娘娘给了后羿一颗仙丹。吃了仙丹可以长生不老。但是后羿不想离开他的妻子嫦娥，就把仙丹交给嫦娥保管。', pinyin: 'Hòulái, Wángmǔ niángniáng gěi le Hòuyì yì kē xiāndān. Chī le xiāndān kěyǐ chángshēng bù lǎo. Dànshì Hòuyì bù xiǎng líkāi tā de qīzi Cháng\'é, jiù bǎ xiāndān jiāo gěi Cháng\'é bǎoguǎn.', english: 'Later, the Queen Mother of the West gave Hou Yi a pill of immortality. But Hou Yi didn\'t want to leave his wife Chang\'e, so he gave the pill to her to keep.' },
        { speaker: 'B', speakerName: '小华', chinese: '有一天，一个坏人想偷仙丹。嫦娥为了不让坏人得逞，自己吞下了仙丹。结果她飞到了月亮上，永远回不来了。', pinyin: 'Yǒu yì tiān, yí gè huàirén xiǎng tōu xiāndān. Cháng\'é wèi le bú ràng huàirén déchěng, zìjǐ tūn xià le xiāndān. Jiéguǒ tā fēi dào le yuèliàng shàng, yǒngyuǎn huí bu lái le.', english: 'One day, a bad person tried to steal the pill. To prevent the thief from succeeding, Chang\'e swallowed the pill herself. She flew to the moon and could never come back.' },
        { speaker: 'A', speakerName: '李老师', chinese: '讲得很好！所以中秋节的时候，人们赏月、吃月饼，就是为了纪念嫦娥。月饼象征着团圆。', pinyin: 'Jiǎng de hěn hǎo! Suǒyǐ Zhōngqiū jié de shíhòu, rénmen shǎng yuè, chī yuèbǐng, jiù shì wèile jìniàn Cháng\'é. Yuèbǐng xiàngzhēng zhe tuányuán.', english: 'Very well told! So during Mid-Autumn Festival, people admire the moon and eat mooncakes to commemorate Chang\'e. Mooncakes symbolise reunion.' },
      ],
      vocabulary: [
        { chinese: '传说', pinyin: 'chuánshuō', english: 'legend / folklore', partOfSpeech: 'noun' },
        { chinese: '嫦娥', pinyin: 'Cháng\'é', english: 'Chang\'e (moon goddess)', partOfSpeech: 'noun' },
        { chinese: '后羿', pinyin: 'Hòuyì', english: 'Hou Yi (hero)', partOfSpeech: 'noun' },
        { chinese: '太阳', pinyin: 'tàiyáng', english: 'sun', partOfSpeech: 'noun' },
        { chinese: '弓箭', pinyin: 'gōngjiàn', english: 'bow and arrow', partOfSpeech: 'noun' },
        { chinese: '仙丹', pinyin: 'xiāndān', english: 'pill of immortality', partOfSpeech: 'noun' },
        { chinese: '长生不老', pinyin: 'chángshēng bù lǎo', english: 'live forever', partOfSpeech: 'phrase' },
        { chinese: '月饼', pinyin: 'yuèbǐng', english: 'mooncake', partOfSpeech: 'noun' },
        { chinese: '团圆', pinyin: 'tuányuán', english: 'reunion', partOfSpeech: 'noun' },
      ],
      fullEnglish: 'Teacher: Students, Mid-Autumn Festival is coming soon. Who knows what legend is related to Mid-Autumn Festival?\nXiao Hua: Teacher, it\'s the story of Chang\'e Flying to the Moon!\nTeacher: Correct! Please tell everyone this story.\nXiao Hua: A long, long time ago, ten suns appeared in the sky. A hero named Hou Yi used his bow and arrow to shoot down nine suns, leaving only one.\nTeacher: What happened next?\nXiao Hua: Later, the Queen Mother gave Hou Yi a pill of immortality. But Hou Yi didn\'t want to leave his wife Chang\'e, so he gave the pill to her to keep.\nXiao Hua: One day, a bad person tried to steal the pill. To prevent the thief from succeeding, Chang\'e swallowed the pill herself. She flew to the moon and could never come back.\nTeacher: Very well told! So during Mid-Autumn Festival, people admire the moon and eat mooncakes to commemorate Chang\'e. Mooncakes symbolise reunion.',
    },
    questions: [
      { id: 'q-012-mc', type: 'multiple_choice', chineseQuestion: '后羿用什么射下了九个太阳？', englishInstruction: 'What did Hou Yi use to shoot down nine suns?', marks: 1, options: ['剑', '弓箭', '石头', '火'], correctOptionIndex: 1, modelAnswer: '弓箭', sourceReference: '一个叫后羿的英雄用弓箭射下了九个太阳' },
      { id: 'q-012-why', type: 'why_reason', chineseQuestion: '嫦娥为什么要吞下仙丹？', englishInstruction: 'Why did Chang\'e swallow the pill?', marks: 2, markingPoints: [
        { id: 'mp-86', keyIdea: 'A bad person tried to steal it', englishMeaning: 'A bad person was trying to steal the pill', chineseKeywords: ['坏人', '偷'], marks: 1 },
        { id: 'mp-87', keyIdea: 'To prevent the thief from succeeding', englishMeaning: 'She swallowed it to prevent the thief from getting it', chineseKeywords: ['不让', '得逞'], marks: 1 },
      ], modelAnswer: '因为一个坏人想偷仙丹，嫦娥为了不让坏人得逞，自己吞下了仙丹。', sourceReference: '一个坏人想偷仙丹。嫦娥为了不让坏人得逞，自己吞下了仙丹' },
      { id: 'q-012-si', type: 'specific_information', chineseQuestion: '月饼象征着什么？', englishInstruction: 'What do mooncakes symbolise?', marks: 1, markingPoints: [
        { id: 'mp-88', keyIdea: 'Reunion', englishMeaning: 'Mooncakes symbolise reunion', chineseKeywords: ['团圆'], marks: 1 },
      ], modelAnswer: '月饼象征着团圆。', sourceReference: '月饼象征着团圆' },
      { id: 'q-012-main', type: 'main_idea', chineseQuestion: '这段对话的主题是什么？', englishInstruction: 'What is the main topic?', marks: 1, options: ['中秋节的食物', '嫦娥奔月的传说和中秋节的意义', '后羿的英雄故事', '中国的节日'], correctOptionIndex: 1, modelAnswer: '嫦娥奔月的传说和中秋节的意义' },
    ],
  },

  // EXERCISE 13: Leisure
  {
    id: 'ex-013',
    createdAt: '2026-09-04',
    script: {
      id: 'script-013',
      title: '周末做什么',
      topic: 'leisure',
      difficulty: 'beginner',
      dialogue: [
        { speaker: 'A', speakerName: '小美', chinese: '小强，你周末一般做什么？', pinyin: 'Xiǎo Qiáng, nǐ zhōumò yìbān zuò shénme?', english: 'Xiao Qiang, what do you usually do on weekends?' },
        { speaker: 'B', speakerName: '小强', chinese: '我喜欢打游戏和看电影。你呢？', pinyin: 'Wǒ xǐhuān dǎ yóuxì hé kàn diànyǐng. Nǐ ne?', english: 'I like playing video games and watching movies. How about you?' },
        { speaker: 'A', speakerName: '小美', chinese: '我喜欢看书和画画。最近我在看一本关于中国历史的书，很有意思。', pinyin: 'Wǒ xǐhuān kàn shū hé huà huà. Zuìjìn wǒ zài kàn yì běn guānyú Zhōngguó lìshǐ de shū, hěn yǒu yìsi.', english: 'I like reading and drawing. Recently I\'m reading a book about Chinese history — it\'s very interesting.' },
        { speaker: 'B', speakerName: '小强', chinese: '听起来不错。我有时候也跟朋友一起去打篮球或者踢足球。', pinyin: 'Tīng qǐlái búcuò. Wǒ yǒu shíhòu yě gēn péngyou yìqǐ qù dǎ lánqiú huòzhě tī zúqiú.', english: 'That sounds good. Sometimes I also play basketball or football with friends.' },
        { speaker: 'A', speakerName: '小美', chinese: '运动很好！你觉得打游戏和运动哪个更好？', pinyin: 'Yùndòng hěn hǎo! Nǐ juédé dǎ yóuxì hé yùndòng nǎ gè gèng hǎo?', english: 'Exercise is good! Which do you think is better, video games or exercise?' },
        { speaker: 'B', speakerName: '小强', chinese: '嗯……两个都好，但是要平衡。打游戏可以放松，运动对身体好。我应该多运动一点。', pinyin: 'Ńg……liǎng gè dōu hǎo, dànshì yào pínghéng. Dǎ yóuxì kěyǐ fàngsōng, yùndòng duì shēntǐ hǎo. Wǒ yīnggāi duō yùndòng yìdiǎn.', english: 'Hmm... both are good, but you need balance. Video games help you relax, exercise is good for your health. I should exercise more.' },
      ],
      vocabulary: [
        { chinese: '打游戏', pinyin: 'dǎ yóuxì', english: 'play video games', partOfSpeech: 'verb' },
        { chinese: '画画', pinyin: 'huà huà', english: 'draw / paint', partOfSpeech: 'verb' },
        { chinese: '踢足球', pinyin: 'tī zúqiú', english: 'play football/soccer', partOfSpeech: 'verb' },
        { chinese: '放松', pinyin: 'fàngsōng', english: 'relax', partOfSpeech: 'verb' },
      ],
      fullEnglish: 'Xiao Mei: Xiao Qiang, what do you usually do on weekends?\nXiao Qiang: I like playing video games and watching movies. How about you?\nXiao Mei: I like reading and drawing. Recently I\'m reading a book about Chinese history — it\'s very interesting.\nXiao Qiang: That sounds good. Sometimes I also play basketball or football with friends.\nXiao Mei: Exercise is good! Which do you think is better, video games or exercise?\nXiao Qiang: Hmm... both are good, but you need balance. Video games help you relax, exercise is good for your health. I should exercise more.',
    },
    questions: [
      { id: 'q-013-mc', type: 'multiple_choice', chineseQuestion: '小美最近在看什么书？', englishInstruction: 'What book is Xiao Mei reading?', marks: 1, options: ['小说', '关于中国历史的书', '中文课本', '漫画'], correctOptionIndex: 1, modelAnswer: '关于中国历史的书', sourceReference: '最近我在看一本关于中国历史的书' },
      { id: 'q-013-si', type: 'specific_information', chineseQuestion: '小强周末喜欢做什么？', englishInstruction: 'What does Xiao Qiang like doing on weekends?', marks: 2, markingPoints: [
        { id: 'mp-89', keyIdea: 'Play video games and watch movies', englishMeaning: 'Likes playing video games and watching movies', chineseKeywords: ['打游戏', '电影'], marks: 1 },
        { id: 'mp-90', keyIdea: 'Play basketball or football with friends', englishMeaning: 'Sometimes plays basketball or football with friends', chineseKeywords: ['篮球', '足球'], marks: 1 },
      ], modelAnswer: '他喜欢打游戏和看电影，有时候跟朋友打篮球或踢足球。', sourceReference: '我喜欢打游戏和看电影...跟朋友一起去打篮球或者踢足球' },
      { id: 'q-013-opinion', type: 'opinion_attitude', chineseQuestion: '小强对打游戏和运动有什么看法？', englishInstruction: 'What is Xiao Qiang\'s view on video games vs exercise?', marks: 2, markingPoints: [
        { id: 'mp-91', keyIdea: 'Both are good, need balance', englishMeaning: 'Both are good but need to be balanced', chineseKeywords: ['平衡'], marks: 1 },
        { id: 'mp-92', keyIdea: 'Games for relaxation, exercise for health', englishMeaning: 'Games help relax, exercise is good for health; should exercise more', chineseKeywords: ['放松', '身体', '多运动'], marks: 1 },
      ], modelAnswer: '他觉得两个都好，但要平衡。打游戏可以放松，运动对身体好。他应该多运动一点。', sourceReference: '两个都好，但是要平衡。打游戏可以放松，运动对身体好' },
    ],
  },
];
