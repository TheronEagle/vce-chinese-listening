import { Exercise, ListeningScript } from '../types';

/**
 * New exercise batch: monologues + dialogues with varied question types
 * (inference, perspective, supporting_details, sequence, complex_4mark+)
 * covering currently-underrepresented topics.
 *
 * Topic coverage in this batch:
 *  - ex-019 (school — school camp monologue, student speaker)
 *  - ex-020 (exchange — Australia experience, monologue/reflection)
 *  - ex-021 (study habits — dialogue between classmates)
 *  - ex-022 (careers — monologue by a careers counsellor)
 *  - ex-023 (culture — festival announcement, monologue)
 *
 * These exercise objects are exported as `NEW_EXERCISES` so the audio
 * generator can find them in src/data/. They will be merged into
 * SAMPLE_EXERCISES via the standard sample-exercises.ts file.
 */

const ex019: Exercise = {
  id: 'ex-019',
  createdAt: '2026-09-05',
  script: {
    id: 'script-019',
    title: '学校露营 School Camp Announcement',
    topic: 'school',
    difficulty: 'intermediate',
    dialogue: [
      { speaker: 'narrator', speakerName: '校长', chinese: '同学们，下个月学校要举办一次露营活动，请大家仔细听我说。', pinyin: 'Tóngxuémen, xià gè yuè xuéxiào yào jǔbàn yícì lùyíng huódòng, qǐng dàjiā zǐxì tīng wǒ shuō.', english: 'Students, next month the school is organising a camping trip. Please listen carefully.' },
      { speaker: 'narrator', speakerName: '校长', chinese: '露营的时间是十月十五号到十七号，一共三天两晚。地点是城外的青山农场。', pinyin: 'Lùyíng de shíjiān shì shí yuè shíwǔ hào dào shíqī hào, yígòng sān tiān liǎng wǎn. Dìdiǎn shì chéng wài de Qīngshān Nóngchǎng.', english: 'The camping dates are October 15 to 17 — three days and two nights. The venue is Qingshan Farm outside the city.' },
      { speaker: 'narrator', speakerName: '校长', chinese: '参加的同学请准备好帐篷、睡袋、手电筒，还有换洗的衣服。', pinyin: 'Cānjiā de tóngxué qǐng zhǔnbèi hǎo zhàngpéng, shuìdài, shǒudiàntǒng, hái yǒu huànxǐ de yīfu.', english: 'Students attending should bring a tent, sleeping bag, flashlight, and a change of clothes.' },
      { speaker: 'narrator', speakerName: '校长', chinese: '我们会有户外活动，包括徒步、钓鱼和团队游戏。请穿运动鞋，不要穿凉鞋。', pinyin: 'Wǒmen huì yǒu hùwài huódòng, bāokuò túbù, diàoyú hé tuánduì yóuxì. Qǐng chuān yùndòng xié, bú yào chuān liángxié.', english: 'We will have outdoor activities including hiking, fishing and team games. Please wear sports shoes, not sandals.' },
      { speaker: 'narrator', speakerName: '校长', chinese: '如果有同学对某些食物过敏，比如海鲜或者花生，请提前告诉班主任。', pinyin: 'Rúguǒ yǒu tóngxué duì mǒuxiē shíwù guòmǐn, bǐrú hǎixiāng huòzhě huāshēng, qǐng tíqián gàosu bānzhǔrèn.', english: 'If any students have food allergies, such as seafood or peanuts, please tell the class teacher in advance.' },
      { speaker: 'narrator', speakerName: '校长', chinese: '最晚下周三之前，请大家交回报名表和健康情况表。报名费是两百块。', pinyin: 'Zuì wǎn xià zhōusān zhīqián, qǐng dàjiā jiāo huí bàomíng biǎo hé jiànkāng qíngkuàng biǎo. Bàomíng fèi shì liǎng bǎi kuài.', english: 'Please return the registration form and health form by next Wednesday at the latest. The registration fee is 200 yuan.' },
      { speaker: 'narrator', speakerName: '校长', chinese: '如果天气不好，活动会改到月底。我们会在群里通知大家。请大家做好准备，度过一个有意义的露营。', pinyin: 'Rúguǒ tiānqì bù hǎo, huódòng huì gǎi dào yuèdǐ. Wǒmen huì zài qún lǐ tōngzhī dàjiā. Qǐng dàjiā zuò hǎo zhǔnbèi, dùguò yīgè yǒu yìyì de lùyíng.', english: 'If the weather is bad, the trip will be moved to the end of the month. We will notify everyone in the group chat. Please prepare well and have a meaningful camp.' },
    ],
    vocabulary: [
      { chinese: '露营', pinyin: 'lùyíng', english: 'camping', partOfSpeech: 'noun' },
      { chinese: '帐篷', pinyin: 'zhàngpéng', english: 'tent', partOfSpeech: 'noun' },
      { chinese: '睡袋', pinyin: 'shuìdài', english: 'sleeping bag', partOfSpeech: 'noun' },
      { chinese: '手电筒', pinyin: 'shǒudiàntǒng', english: 'flashlight', partOfSpeech: 'noun' },
      { chinese: '徒步', pinyin: 'túbù', english: 'hiking', partOfSpeech: 'verb' },
      { chinese: '过敏', pinyin: 'guòmǐn', english: 'allergy', partOfSpeech: 'noun' },
      { chinese: '报名表', pinyin: 'bàomíng biǎo', english: 'registration form', partOfSpeech: 'noun' },
      { chinese: '班主任', pinyin: 'bānzhǔrèn', english: 'class teacher', partOfSpeech: 'noun' },
    ],
    fullEnglish: 'Principal: Students, next month the school is organising a camping trip. Please listen carefully.\nPrincipal: The camping dates are October 15 to 17 — three days and two nights. The venue is Qingshan Farm outside the city.\nPrincipal: Students attending should bring a tent, sleeping bag, flashlight, and a change of clothes.\nPrincipal: We will have outdoor activities including hiking, fishing and team games. Please wear sports shoes, not sandals.\nPrincipal: If any students have food allergies, such as seafood or peanuts, please tell the class teacher in advance.\nPrincipal: Please return the registration form and health form by next Wednesday at the latest. The registration fee is 200 yuan.\nPrincipal: If the weather is bad, the trip will be moved to the end of the month. We will notify everyone in the group chat. Please prepare well and have a meaningful camp.',
  },
  questions: [
    {
      id: 'q-019-mc', type: 'multiple_choice', chineseQuestion: '露营在什么地方举办？', englishInstruction: 'Where is the camp held?',
      marks: 1, options: ['城市公园', '城外农场', '海边', '学校操场'],
      correctOptionIndex: 1, modelAnswer: '城外农场',
      sourceReference: '地点是城外的青山农场',
    },
    {
      id: 'q-019-seq', type: 'specific_information', chineseQuestion: '露营总共几天几晚？', englishInstruction: 'How many days and nights is the camp?',
      marks: 2, markingPoints: [
        { id: 'mp-191-1', keyIdea: 'three days', englishMeaning: 'Three days total', chineseKeywords: ['三天'], marks: 1 },
        { id: 'mp-191-2', keyIdea: 'two nights', englishMeaning: 'Two nights', chineseKeywords: ['两晚'], marks: 1 },
      ],
      modelAnswer: '一共三天两晚。',
      sourceReference: '一共三天两晚',
    },
    {
      id: 'q-019-detail', type: 'supporting_details', chineseQuestion: '参加的同学需要自己准备哪些东西？请列出三项。', englishInstruction: 'List three things students must bring themselves.',
      marks: 3, markingPoints: [
        { id: 'mp-192-1', keyIdea: 'tent', englishMeaning: 'Tent', chineseKeywords: ['帐篷'], marks: 1 },
        { id: 'mp-192-2', keyIdea: 'sleeping bag', englishMeaning: 'Sleeping bag', chineseKeywords: ['睡袋'], marks: 1 },
        { id: 'mp-192-3', keyIdea: 'flashlight OR clothes', englishMeaning: 'Flashlight or change of clothes', chineseKeywords: ['手电筒', '衣服'], marks: 1 },
      ],
      modelAnswer: '帐篷、睡袋、手电筒和换洗的衣服。（任选三项）',
      sourceReference: '请准备好帐篷、睡袋、手电筒，还有换洗的衣服',
    },
    {
      id: 'q-019-infer', type: 'perspective', chineseQuestion: '从这段话可以推断，校长对学生参加露营的态度是怎样的？', englishInstruction: 'What can be inferred about the principal\'s attitude toward student participation?',
      marks: 3, markingPoints: [
        { id: 'mp-193-1', keyIdea: 'strongly encouraging', englishMeaning: 'Strongly encourages students to attend', chineseKeywords: ['希望', '鼓励'], marks: 1 },
        { id: 'mp-193-2', keyIdea: 'careful planning', englishMeaning: 'Careful planning and preparation expected', chineseKeywords: ['仔细', '准备好'], marks: 1 },
        { id: 'mp-193-3', keyIdea: 'meaningful experience', englishMeaning: 'Wants it to be a meaningful learning experience', chineseKeywords: ['有意义的'], marks: 1 },
      ],
      modelAnswer: '校长非常希望同学们参加，认为这是一次有意义的活动，所以反复强调要做好充分准备。',
      sourceReference: '度过一个有意义的露营；仔细听；做好准备',
    },
    {
      id: 'q-019-cond', type: 'cause_effect', chineseQuestion: '在什么情况下露营会改时间？', englishInstruction: 'Under what circumstances will the camp be rescheduled?',
      marks: 2, markingPoints: [
        { id: 'mp-194-1', keyIdea: 'bad weather', englishMeaning: 'If the weather is bad', chineseKeywords: ['天气不好'], marks: 2 },
      ],
      modelAnswer: '如果天气不好，活动会改到月底。',
      sourceReference: '如果天气不好，活动会改到月底',
    },
    {
      id: 'q-019-detail2', type: 'specific_information', chineseQuestion: '报名费和最晚交表时间分别是多少？', englishInstruction: 'What is the registration fee and the latest date to submit forms?',
      marks: 2, markingPoints: [
        { id: 'mp-195-1', keyIdea: '200 yuan fee', englishMeaning: 'Registration fee is 200 yuan', chineseKeywords: ['两百块', '200'], marks: 1 },
        { id: 'mp-195-2', keyIdea: 'next Wednesday deadline', englishMeaning: 'Forms due by next Wednesday', chineseKeywords: ['下周三'], marks: 1 },
      ],
      modelAnswer: '报名费两百块，最晚下周三交交报名表和健康情况表。',
      sourceReference: '最晚下周三之前，请大家交回报名表；报名费是两百块',
    },
    {
      id: 'q-019-why', type: 'why_reason', chineseQuestion: '校长为什么要提醒同学不要穿凉鞋？', englishInstruction: 'Why does the principal remind students not to wear sandals?',
      marks: 2, markingPoints: [
        { id: 'mp-196-1', keyIdea: 'outdoor activities need protection', englishMeaning: 'Outdoor activities like hiking need protective footwear', chineseKeywords: ['户外活动', '徒步'], marks: 1 },
        { id: 'mp-196-2', keyIdea: 'safety', englishMeaning: 'Safety reason — sandals can cause injury on uneven ground', chineseKeywords: ['安全'], marks: 1 },
      ],
      modelAnswer: '因为露营有徒步等户外活动，穿凉鞋不安全，应该穿运动鞋保护脚。',
      sourceReference: '户外活动，包括徒步、钓鱼和团队游戏；请穿运动鞋',
    },
  ],
};

const ex020: Exercise = {
  id: 'ex-020',
  createdAt: '2026-09-05',
  script: {
    id: 'script-020',
    title: '澳大利亚留学一年 Reflection',
    topic: 'study_abroad',
    difficulty: 'advanced',
    dialogue: [
      { speaker: 'narrator', speakerName: '学生演讲', chinese: '大家好，我叫李明，去年在澳大利亚墨尔本大学做了一年的交换生。今天我想跟大家分享一下我的经历。', pinyin: 'Dàjiā hǎo, wǒ jiào Lǐ Míng, qùnián zài àodàlìyà mòěrběn dàxué zuòle yì nián de jiāohuànshēng. Jīntiān wǒ xiǎng gēn dàjiā fēnxiǎng yīxià wǒ de jīnglì.', english: 'Hello everyone, my name is Li Ming. Last year I was an exchange student at the University of Melbourne in Australia for a year. Today I want to share my experience with you.' },
      { speaker: 'narrator', speakerName: '学生演讲', chinese: '刚开始的时候，我觉得很不习惯。澳大利亚的英语口音跟教科书上很不一样，所以我上课经常听不懂。', pinyin: 'Gāng kāishǐ de shíhòu, wǒ juédé hěn bù xíguàn. Àodàlìyà de yīngyǔ kǒuyīn gēn jiàokēshū shàng hěn bù yíyàng, suǒyǐ wǒ shàngkè jīngcháng tīng bù dǒng.', english: 'At first I found it hard to adjust. Australian English accents are very different from what we hear in textbooks, so I often couldn\'t understand in class.' },
      { speaker: 'narrator', speakerName: '学生演讲', chinese: '但是澳洲的老师和同学都非常友好，他们很耐心地帮我适应。', pinyin: 'Dànshì àozhōu de lǎoshī hé tóngxué dōu fēicháng yǒuhǎo, tāmen hěn nàixīn de bāng wǒ shìyìng.', english: 'But Australian teachers and classmates were very friendly — they patiently helped me adjust.' },
      { speaker: 'narrator', speakerName: '学生演讲', chinese: '最让我难忘的是当地的自然环境。我去了大堡礁潜水，看到了美丽的珊瑚和热带鱼。也去了原始森林，看到了袋鼠和考拉。', pinyin: 'Zuì ràng wǒ nánwàng de shì dāngdì de zìrán huánjìng. Wǒ qùle Dàbǎojiāo qiánshuǐ, kàndàole měilì de shānhú hé rèdài yú. Yě qùle yuánshǐ sēnlín, kàndàole dàishǔ hé kǎolā.', english: 'What I remember most is the natural environment. I went scuba diving at the Great Barrier Reef and saw beautiful coral and tropical fish. I also went to the rainforest and saw kangaroos and koalas.' },
      { speaker: 'narrator', speakerName: '学生演讲', chinese: '在学习上，我觉得最大的收获是学会了独立思考和自主学习。澳洲的大学非常重视学生的独立研究能力。', pinyin: 'Zài xuéxí shàng, wǒ juédé zuìdà de shōuhuò shì xuéhuìle dúlì sīkǎo hé zìzhǔ xuéxí. Àozhōu de dàxué fēicháng zhòngshì xuéshēng de dúlì yánjiū nénglì.', english: 'Academically, the biggest gain was learning to think independently and study autonomously. Australian universities really value independent research skills.' },
      { speaker: 'narrator', speakerName: '学生演讲', chinese: '我也学会了跟不同文化背景的人合作，这对我以后的职业生涯非常重要。', pinyin: 'Wǒ yě xuéhuìle gēn bùtóng wénhuà bèijǐng de rén hézuò, zhè duì wǒ yǐhòu de zhíyè shēngyá fēicháng zhòngyào.', english: 'I also learned to collaborate with people from different cultural backgrounds, which is very important for my future career.' },
      { speaker: 'narrator', speakerName: '学生演讲', chinese: '如果你也有机会去交换学习，我建议你大胆一点，多尝试，多跟当地人交流。这会是你人生中最难忘的经历之一。谢谢大家。', pinyin: 'Rúguǒ nǐ yě yǒu jīhuì qù jiāohuàn xuéxí, wǒ jiànyì nǐ dàdǎn yìdiǎn, duō chángshì, duō gēn dāngdìrén jiāoliú. Zhè huì shì nǐ rénshēng zhōng zuì nánwàng de jīnglì zhī yī. Xièxie dàjiā.', english: 'If you also have the chance to go on exchange, I recommend being brave, trying new things, and talking with locals. It will be one of the most unforgettable experiences of your life. Thank you.' },
    ],
    vocabulary: [
      { chinese: '交换生', pinyin: 'jiāohuànshēng', english: 'exchange student', partOfSpeech: 'noun' },
      { chinese: '口音', pinyin: 'kǒuyīn', english: 'accent', partOfSpeech: 'noun' },
      { chinese: '大堡礁', pinyin: 'Dàbǎojiāo', english: 'Great Barrier Reef', partOfSpeech: 'noun' },
      { chinese: '珊瑚', pinyin: 'shānhú', english: 'coral', partOfSpeech: 'noun' },
      { chinese: '袋鼠', pinyin: 'dàishǔ', english: 'kangaroo', partOfSpeech: 'noun' },
      { chinese: '独立思考', pinyin: 'dúlì sīkǎo', english: 'independent thinking', partOfSpeech: 'noun' },
      { chinese: '自主学习', pinyin: 'zìzhǔ xuéxí', english: 'autonomous learning', partOfSpeech: 'noun' },
      { chinese: '文化背景', pinyin: 'wénhuà bèijǐng', english: 'cultural background', partOfSpeech: 'noun' },
    ],
    fullEnglish: 'Student speech: Hello everyone, my name is Li Ming. Last year I was an exchange student at the University of Melbourne in Australia for a year. Today I want to share my experience with you.\nStudent speech: At first I found it hard to adjust. Australian English accents are very different from what we hear in textbooks, so I often couldn\'t understand in class.\nStudent speech: But Australian teachers and classmates were very friendly — they patiently helped me adjust.\nStudent speech: What I remember most is the natural environment. I went scuba diving at the Great Barrier Reef and saw beautiful coral and tropical fish. I also went to the rainforest and saw kangaroos and koalas.\nStudent speech: Academically, the biggest gain was learning to think independently and study autonomously. Australian universities really value independent research skills.\nStudent speech: I also learned to collaborate with people from different cultural backgrounds, which is very important for my future career.\nStudent speech: If you also have the chance to go on exchange, I recommend being brave, trying new things, and talking with locals. It will be one of the most unforgettable experiences of your life. Thank you.',
  },
  questions: [
    {
      id: 'q-020-mc', type: 'multiple_choice', chineseQuestion: '演讲者在哪个国家做了交换生？', englishInstruction: 'In which country did the speaker do their exchange?',
      marks: 1, options: ['英国', '美国', '澳大利亚', '加拿大'],
      correctOptionIndex: 2, modelAnswer: '澳大利亚',
      sourceReference: '去年在澳大利亚墨尔本大学做了一年的交换生',
    },
    {
      id: 'q-020-detail', type: 'supporting_details', chineseQuestion: '演讲者在澳大利亚去了哪些地方？请列出两个地方。', englishInstruction: 'List two places the speaker visited in Australia.',
      marks: 2, markingPoints: [
        { id: 'mp-201-1', keyIdea: 'Great Barrier Reef', englishMeaning: 'Great Barrier Reef', chineseKeywords: ['大堡礁'], marks: 1 },
        { id: 'mp-201-2', keyIdea: 'rainforest OR wildlife', englishMeaning: 'Rainforest or wildlife like kangaroos/koalas', chineseKeywords: ['原始森林', '袋鼠', '考拉'], marks: 1 },
      ],
      modelAnswer: '大堡礁和原始森林。',
      sourceReference: '去了大堡礁潜水...去了原始森林，看到了袋鼠和考拉',
    },
    {
      id: 'q-020-opinion', type: 'opinion_attitude', chineseQuestion: '演讲者对澳大利亚老师同学的态度是什么？', englishInstruction: 'What is the speaker\'s attitude toward Australian teachers and classmates?',
      marks: 2, markingPoints: [
        { id: 'mp-202-1', keyIdea: 'positive / grateful', englishMeaning: 'Positive, grateful for their help', chineseKeywords: ['友好', '感谢'], marks: 1 },
        { id: 'mp-202-2', keyIdea: 'patient help', englishMeaning: 'They patiently helped the speaker adjust', chineseKeywords: ['耐心'], marks: 1 },
      ],
      modelAnswer: '非常感谢，他们很耐心、很友好地帮助他适应。',
      sourceReference: '澳洲的老师和同学都非常友好，他们很耐心地帮我适应',
    },
    {
      id: 'q-020-main', type: 'main_idea', chineseQuestion: '这段演讲的主题是什么？', englishInstruction: 'What is the main topic of this speech?',
      marks: 1, options: ['澳洲的教育制度', '在澳大利亚做交换生的经历', '澳洲的自然环境', '留学的费用问题'],
      correctOptionIndex: 1, modelAnswer: '在澳大利亚做交换生的经历',
      sourceReference: '今天我想跟大家分享一下我的经历',
    },
    {
      id: 'q-020-infer', type: 'perspective', chineseQuestion: '从演讲内容可以推断，演讲者对这次交换经历的整体感受是？', englishInstruction: 'What can be inferred about the speaker\'s overall feeling about the exchange?',
      marks: 3, markingPoints: [
        { id: 'mp-203-1', keyIdea: 'positive / worthwhile', englishMeaning: 'Overall positive — considers it worthwhile', chineseKeywords: ['难忘', '收获'], marks: 1 },
        { id: 'mp-203-2', keyIdea: 'personal growth', englishMeaning: 'Personal growth — independence, cross-cultural skills', chineseKeywords: ['独立', '成长'], marks: 1 },
        { id: 'mp-203-3', keyIdea: 'recommends it', englishMeaning: 'Recommends it to others', chineseKeywords: ['建议', '尝试'], marks: 1 },
      ],
      modelAnswer: '整体非常正面，认为收获很大——独立思考、自主学习、跨文化合作能力——并强烈推荐给其他人。',
      sourceReference: '最让我难忘的...度过了最难忘的经历；我建议你大胆一点',
    },
    {
      id: 'q-020-cond', type: 'cause_effect', chineseQuestion: '演讲者一开始上课听不懂的原因是什么？', englishInstruction: 'Why did the speaker initially have trouble understanding in class?',
      marks: 2, markingPoints: [
        { id: 'mp-204-1', keyIdea: 'different accent', englishMeaning: 'Australian English accent is very different', chineseKeywords: ['口音', '不一样'], marks: 1 },
        { id: 'mp-204-2', keyIdea: 'different from textbook', englishMeaning: 'Different from textbook pronunciation', chineseKeywords: ['教科书'], marks: 1 },
      ],
      modelAnswer: '因为澳大利亚英语口音跟教科书上的很不一样。',
      sourceReference: '澳大利亚的英语口音跟教科书上很不一样',
    },
    {
      id: 'q-020-complex', type: 'complex_4mark', chineseQuestion: '演讲者认为这次交换经历对他最重要的三个收获是什么？', englishInstruction: 'What three benefits did the speaker consider most important from the exchange?',
      marks: 4, markingPoints: [
        { id: 'mp-205-1', keyIdea: 'independent thinking', englishMeaning: 'Independent thinking skills', chineseKeywords: ['独立思考'], marks: 1 },
        { id: 'mp-205-2', keyIdea: 'autonomous learning', englishMeaning: 'Autonomous learning ability', chineseKeywords: ['自主学习'], marks: 1 },
        { id: 'mp-205-3', keyIdea: 'cross-cultural collaboration', englishMeaning: 'Cross-cultural collaboration', chineseKeywords: ['文化背景', '合作'], marks: 1 },
        { id: 'mp-205-4', keyIdea: 'wider life experience', englishMeaning: 'Broader life experience', chineseKeywords: ['经历', '难忘'], marks: 1 },
      ],
      modelAnswer: '一是学会独立思考，二是学会自主学习，三是学会跟不同文化背景的人合作，加上更丰富的人生经历。',
      sourceReference: '学会了独立思考和自主学习；跟不同文化背景的人合作',
    },
  ],
};

const ex021: Exercise = {
  id: 'ex-021',
  createdAt: '2026-09-05',
  script: {
    id: 'script-021',
    title: '学习方法讨论 Study Habits',
    topic: 'study',
    difficulty: 'intermediate',
    dialogue: [
      { speaker: 'A', speakerName: '小红', chinese: '小军，你最近学习怎么样？我看你每天都学习到很晚。', pinyin: 'Xiǎo Jūn, nǐ zuìjìn xuéxí zěnmeyàng? Wǒ kàn nǐ měitiān dōu xuéxí dào hěn wǎn.', english: 'Xiao Jun, how has your studying been recently? I see you study late every day.' },
      { speaker: 'B', speakerName: '小军', chinese: '唉，最近数学特别难，我得多花时间练习，不然考试成绩会不好。', pinyin: 'Āi, zuìjìn shùxué tèbié nán, wǒ děi duō huā shíjiān liànxí, bùrán kǎoshì chéngjì huì bù hǎo.', english: 'Sigh, math is really hard recently. I have to spend more time practicing, otherwise my exam results will be bad.' },
      { speaker: 'A', speakerName: '小红', chinese: '但是你这样熬夜对身体不好。我建议你试试番茄工作法——学习25分钟，休息5分钟。', pinyin: 'Dànshì nǐ zhèyàng áoyè duì shēntǐ bù hǎo. Wǒ jiànyì nǐ shìshi fānqié gōngzuò fǎ — xuéxí èrshíwǔ fēnzhōng, xiūxi wǔ fēnzhōng.', english: 'But staying up late like this is bad for your health. I suggest trying the Pomodoro technique — study for 25 minutes, rest for 5.' },
      { speaker: 'B', speakerName: '小军', chinese: '番茄工作法？听起来有点意思。但是如果我休息五分钟，思路会断，再开始就更难了。', pinyin: 'Fānqié gōngzuò fǎ? Tīng qǐlái yǒudiǎn yìsi. Dànshì rúguǒ wǒ xiūxi wǔ fēnzhōng, sīlù huì duàn, zài kāishǐ jiù gèng nán le.', english: 'Pomodoro? Sounds interesting. But if I rest for five minutes, I lose my train of thought, and it\'s harder to start again.' },
      { speaker: 'A', speakerName: '小红', chinese: '其实不会。研究表明，短暂的休息能帮助大脑整理信息，记忆效果会更好。', pinyin: 'Qíshí bú huì. Yánjiū biǎomíng, duǎnzàn de xiūxi néng bāngzhù dànǎo zhěnglǐ xìnxī, jìyì xiàoguǒ huì gèng hǎo.', english: 'Actually it doesn\'t. Research shows that short breaks help the brain organise information and improve memory.' },
      { speaker: 'B', speakerName: '小军', chinese: '真的吗？那好吧，我今天晚上试试。你一般怎么安排学习时间？', pinyin: 'Zhēn de ma? Nà hǎo ba, wǒ jīntiān wǎnshàng shìshi. Nǐ yìbān zěnme ānpái xuéxí shíjiān?', english: 'Really? OK, I\'ll try it tonight. How do you usually schedule your study time?' },
      { speaker: 'A', speakerName: '小红', chinese: '我一般先做最难的科目，然后做容易的。每学完一个番茄钟就休息一下，喝点水，活动活动。', pinyin: 'Wǒ yìbān xiān zuò zuì nán de kēmù, ránhòu zuò róngyì de. Měi xuéwán yīgè fānqié zhōng jiù xiūxi yīxià, hē diǎn shuǐ, huódòng huódòng.', english: 'I usually do the hardest subject first, then the easier ones. After each Pomodoro I take a break, drink some water, and move around.' },
      { speaker: 'B', speakerName: '小军', chinese: '听起来很科学。我还有一个问题，你怎么记住那么多单词的？', pinyin: 'Tīng qǐlái hěn kēxué. Wǒ hái yǒu yīgè wèntí, nǐ zěnme jìzhù nàme duō dāncí de?', english: 'Sounds very scientific. I have another question — how do you remember so many vocabulary words?' },
      { speaker: 'A', speakerName: '小红', chinese: '我用一个间隔重复的APP，每天复习学过的单词。还有，我尝试在日常生活中用中文说，比如跟朋友聊天。', pinyin: 'Wǒ yòng yīgè jiàngé chóngfù de APP, měitiān fùxí xuéguò de dāncí. Hái yǒu, wǒ chángshì zài rìcháng shēnghuó zhōng yòng zhōngwén shuō, bǐrú gēn péngyou liáotiān.', english: 'I use a spaced-repetition app and review old vocabulary daily. Also, I try to use Chinese in daily life — like chatting with friends.' },
      { speaker: 'B', speakerName: '小军', chinese: '我明白了。看来学习不只是用功，还要讲科学。我今天就开始用番茄工作法。', pinyin: 'Wǒ míngbái le. Kànlái xuéxí bù zhǐshì yònggōng, hái yào jiǎng kēxué. Wǒ jīntiān jiù kāishǐ yòng fānqié gōngzuò fǎ.', english: 'I see. Looks like studying isn\'t just about working hard — it has to be scientific too. I\'ll start using the Pomodoro technique today.' },
    ],
    vocabulary: [
      { chinese: '熬夜', pinyin: 'áoyè', english: 'stay up late', partOfSpeech: 'verb' },
      { chinese: '番茄工作法', pinyin: 'fānqié gōngzuò fǎ', english: 'Pomodoro technique', partOfSpeech: 'noun' },
      { chinese: '思路', pinyin: 'sīlù', english: 'train of thought', partOfSpeech: 'noun' },
      { chinese: '研究表明', pinyin: 'yánjiū biǎomíng', english: 'research shows', partOfSpeech: 'phrase' },
      { chinese: '整理', pinyin: 'zhěnglǐ', english: 'organise', partOfSpeech: 'verb' },
      { chinese: '间隔重复', pinyin: 'jiàngé chóngfù', english: 'spaced repetition', partOfSpeech: 'noun' },
      { chinese: '科学', pinyin: 'kēxué', english: 'scientific', partOfSpeech: 'adjective' },
    ],
    fullEnglish: 'Xiaohong: Xiao Jun, how has your studying been recently? I see you study late every day.\nXiao Jun: Sigh, math is really hard recently. I have to spend more time practicing, otherwise my exam results will be bad.\nXiaohong: But staying up late like this is bad for your health. I suggest trying the Pomodoro technique — study for 25 minutes, rest for 5.\nXiao Jun: Pomodoro? Sounds interesting. But if I rest for five minutes, I lose my train of thought, and it\'s harder to start again.\nXiaohong: Actually it doesn\'t. Research shows that short breaks help the brain organise information and improve memory.\nXiao Jun: Really? OK, I\'ll try it tonight. How do you usually schedule your study time?\nXiaohong: I usually do the hardest subject first, then the easier ones. After each Pomodoro I take a break, drink some water, and move around.\nXiao Jun: Sounds very scientific. I have another question — how do you remember so many vocabulary words?\nXiaohong: I use a spaced-repetition app and review old vocabulary daily. Also, I try to use Chinese in daily life — like chatting with friends.\nXiao Jun: I see. Looks like studying isn\'t just about working hard — it has to be scientific too. I\'ll start using the Pomodoro technique today.',
  },
  questions: [
    {
      id: 'q-021-mc', type: 'multiple_choice', chineseQuestion: '小红建议小军用什么学习方法？', englishInstruction: 'What study method does Xiaohong suggest?',
      marks: 1, options: ['番茄工作法', '完全休息一天', '做更多的题', '请家教'],
      correctOptionIndex: 0, modelAnswer: '番茄工作法',
      sourceReference: '我建议你试试番茄工作法',
    },
    {
      id: 'q-021-why', type: 'why_reason', chineseQuestion: '小红为什么建议小军不要熬夜？请用两点理由回答。', englishInstruction: 'Why does Xiaohong advise Xiao Jun not to stay up late? Give two reasons.',
      marks: 2, markingPoints: [
        { id: 'mp-211-1', keyIdea: 'bad for health', englishMeaning: 'It is bad for your health', chineseKeywords: ['身体不好'], marks: 1 },
        { id: 'mp-211-2', keyIdea: 'breaks are more effective', englishMeaning: 'Short breaks improve memory and retention', chineseKeywords: ['记忆效果'], marks: 1 },
      ],
      modelAnswer: '熬夜对身体不好，而且研究表明短暂休息反而能改善记忆效果。',
      sourceReference: '这样熬夜对身体不好；短暂的休息能帮助大脑整理信息，记忆效果会更好',
    },
    {
      id: 'q-021-order', type: 'specific_information', chineseQuestion: '小红复习单词的两个方法是什么？', englishInstruction: 'What two methods does Xiaohong use to memorise vocabulary?',
      marks: 2, markingPoints: [
        { id: 'mp-212-1', keyIdea: 'spaced-repetition app', englishMeaning: 'Spaced-repetition app to review daily', chineseKeywords: ['间隔重复', 'APP'], marks: 1 },
        { id: 'mp-212-2', keyIdea: 'use in daily life', englishMeaning: 'Use Chinese in daily life — e.g. chatting with friends', chineseKeywords: ['日常生活', '聊天'], marks: 1 },
      ],
      modelAnswer: '用间隔重复APP每天复习；在日常生活中用中文跟朋友聊天。',
      sourceReference: '用间隔重复APP...在日常生活中用中文说，比如跟朋友聊天',
    },
    {
      id: 'q-021-comp', type: 'comparison', chineseQuestion: '小红和小军对"短暂休息会打断思路"这件事的态度有什么不同？', englishInstruction: 'How do Xiaohong and Xiao Jun differ in their views on whether short breaks break the flow?',
      marks: 4, markingPoints: [
        { id: 'mp-213-1', keyIdea: 'Xiao Jun concern', englishMeaning: 'Xiao Jun worries short breaks will break his train of thought', chineseKeywords: ['小军', '思路会断'], marks: 1 },
        { id: 'mp-213-2', keyIdea: 'Xiao Hong evidence', englishMeaning: 'Xiaohong counters with research: breaks help brain organise info', chineseKeywords: ['小红', '研究表明'], marks: 1 },
        { id: 'mp-213-3', keyIdea: 'Xiao Hong outcome', englishMeaning: 'Xiaohong believes breaks improve memory', chineseKeywords: ['记忆', '更好'], marks: 1 },
        { id: 'mp-213-4', keyIdea: 'resolution', englishMeaning: 'Xiao Jun is persuaded to try it', chineseKeywords: ['试试'], marks: 1 },
      ],
      modelAnswer: '小军担心打断思路；小红用研究证据说明短休息反而帮助记忆，并说服小军尝试。',
      sourceReference: '思路会断；研究表明...记忆效果会更好；我今天晚上试试',
    },
    {
      id: 'q-021-infer', type: 'perspective', chineseQuestion: '从小军最后的反应可以推断，他对小红的方法持什么态度？', englishInstruction: 'What can be inferred from Xiao Jun\'s final response about his attitude toward Xiaohong\'s methods?',
      marks: 2, markingPoints: [
        { id: 'mp-214-1', keyIdea: 'open to trying', englishMeaning: 'Willing to try / open-minded', chineseKeywords: ['试试', '开始用'], marks: 1 },
        { id: 'mp-214-2', keyIdea: 'values scientific approach', englishMeaning: 'Appreciates the scientific, methodical approach', chineseKeywords: ['讲科学'], marks: 1 },
      ],
      modelAnswer: '他接受并愿意尝试，认为学习要讲究科学方法。',
      sourceReference: '我今天就开始用番茄工作法；学习不只是用功，还要讲科学',
    },
    {
      id: 'q-021-detail', type: 'supporting_details', chineseQuestion: '小红学习时一般按照什么顺序安排科目？', englishInstruction: 'What order does Xiaohong use for her subjects when studying?',
      marks: 2, markingPoints: [
        { id: 'mp-215-1', keyIdea: 'hardest first', englishMeaning: 'Hardest subject first', chineseKeywords: ['最难的'], marks: 1 },
        { id: 'mp-215-2', keyIdea: 'easier after', englishMeaning: 'Easier subjects afterwards', chineseKeywords: ['容易的'], marks: 1 },
      ],
      modelAnswer: '先做最难的，然后做容易的。',
      sourceReference: '我一般先做最难的科目，然后做容易的',
    },
    {
      id: 'q-021-complex', type: 'complex_4mark', chineseQuestion: '这段对话中，小军改变了哪些看法？请详细说明。', englishInstruction: 'Which of Xiao Jun\'s opinions changed during the conversation? Explain in detail.',
      marks: 4, markingPoints: [
        { id: 'mp-216-1', keyIdea: 'initial belief — hard work alone', englishMeaning: 'Initially believed working hard (long hours) is sufficient', chineseKeywords: ['熬夜', '用功'], marks: 1 },
        { id: 'mp-216-2', keyIdea: 'break concern', englishMeaning: 'Initially worried short breaks would interrupt thoughts', chineseKeywords: ['思路会断'], marks: 1 },
        { id: 'mp-216-3', keyIdea: 'convinced by evidence', englishMeaning: 'Convinced by research that breaks help memory', chineseKeywords: ['研究表明'], marks: 1 },
        { id: 'mp-216-4', keyIdea: 'new mindset — scientific studying', englishMeaning: 'New view: study needs to be scientific, not just effortful', chineseKeywords: ['讲科学'], marks: 1 },
      ],
      modelAnswer: '小军原本认为只要用功熬夜就行、短休息会打断思路，听了小红的解释后，理解了科学方法的价值，决定从今天开始用番茄工作法。',
      sourceReference: '一开始...天天学习到很晚；学习不只是用功，还要讲科学',
    },
  ],
};

export const NEW_EXERCISES: Exercise[] = [ex019, ex020, ex021];