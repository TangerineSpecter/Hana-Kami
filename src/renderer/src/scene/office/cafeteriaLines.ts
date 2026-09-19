// Cafeteria small-talk — The Office edition.
//
// The cast ARE Dunder Mifflin (see cast.ts), so an agent's coffee break is an
// excuse for a one-liner in character. Two kinds of line:
//   • solo  — one quip shown above a single agent at a break spot
//   • pair  — a two-beat exchange between two agents at the same table
//
// Lines are kept short so they fit the ThoughtBubble (≈MAX_WIDTH). Character
// keys match OfficeCharacterName; anyone without bespoke lines falls back to the
// shared GENERIC pool so the floor never feels empty.

import type { OfficeCharacterName } from './cast';

/** Where an agent is lingering — picks a contextual line pool. */
export type BreakSpot = 'coffee' | 'vending' | 'snack' | 'table';

const pick = <T,>(arr: readonly T[], seed: number): T =>
  arr[((seed % arr.length) + arr.length) % arr.length];

// ─── solo lines, by spot ─────────────────────────────────────────────────────

const COFFEE: readonly string[] = [
  '这……是无咖啡因的？？谁干的',
  '豆子又没了',
  '世界最佳老板马克杯',
  '今天第一杯。也是第五杯。',
  '这里的咖啡简直像个拥抱',
  '谁拿了我的杯子？',
];

const VENDING: readonly string[] = [
  '机器吞了我的硬币',
  'B4……拜托一定是椒盐脆饼',
  '卡住了。经典。',
  '我在轻轻地、礼貌地摇它。',
  '一份（1）情绪支持零食',
  'A1 又来了。玩得真大。',
];

const SNACK: readonly string[] = [
  '今天是椒盐脆饼日吗？',
  '谁吃完了薯片？？',
  '就吃一小口',
  '这是大家的？行吧行吧行吧',
  '第二顿早餐',
];

const TABLE: readonly string[] = [
  '大日子。好多会议。',
  '再睡五分钟',
  '你看见站会笔记了吗？',
  '假装在看我的笔记',
  '说真的，我需要这个休息时间',
  '千万别告诉迈克尔我在这里',
];

const SPOT_POOL: Record<BreakSpot, readonly string[]> = {
  coffee: COFFEE, vending: VENDING, snack: SNACK, table: TABLE,
};

// ─── character flavour — overrides the generic pool when present ─────────────

const BY_CHARACTER: Partial<Record<OfficeCharacterName, readonly string[]>> = {
  michael:  ['我宣布……破产！', '她就是这么说的', '我不是迷信。只是有一点迷信。', '没喝咖啡前不开会。这是规矩。'],
  dwight:   ['假的。', '身份盗窃不是闹着玩的', '那只杯子符合规定', '冰箱需要一个甜菜抽屉', '施鲁特农场的咖啡更好'],
  jim:      ['……她就是这么说的', '熊。甜菜。银河战舰。', '我又把德怀特的订书机挪了', '我就是来听八卦的'],
  pam:      ['德温特·米夫林，我是帕姆', '在画自动售货机', '休息室的水彩画'],
  kevin:    ['辣椒炖肉还没好', '为什么浪费时间说那么多词', '我想要零食', '饼干？饼干。'],
  angela:   ['休息室脏死了', '下午三点，筹备委员会开会', '我在评判这台冰箱'],
  oscar:    ['准确地说，是“浓缩咖啡”', '嗯，其实吧……', '零食预算令人担忧'],
  stanley:  ['今天是椒盐脆饼日吗？', '我说得还不够清楚吗？', '填字游戏和咖啡。别烦我。', '这杯咖啡冲好前我就退休了'],
  phyllis:  ['鲍勃五点来接我', '织毛衣，再喝一杯好茶'],
  andy:     ['康奈尔，听说过吗？', '哒哒哒，咖啡休息时间！', '大金枪鱼，拉把椅子'],
  kelly:    ['你听说发生什么了吗？？', '要告诉你的事太多了。', '我是八卦女王'],
  ryan:     ['我算是个大人物', '临时工需要咖啡因', '其实我正在创办一家咖啡创业公司'],
  toby:     ['我应该把这个写下来……', '从人事角度看，这次休息没问题', '从来没人和我一起坐'],
  creed:    ['你们谁是新来的？', '我从冰箱里吃过更糟的东西', '绿豆。在我桌子底下。'],
  meredith: ['现在五点了吗？', '有人给咖啡加料了吗？'],
};

/** A solo break-room line. Character flavour ~60% of the time, else the line
 *  fits the spot the agent is standing at. `seed` keeps it deterministic per
 *  call site (avoids Math.random, which Pixi/Electron CSP-safe code prefers). */
export function pickSoloLine(character: OfficeCharacterName, spot: BreakSpot, seed: number): string {
  const flavour = BY_CHARACTER[character];
  if (flavour && seed % 5 < 3) return pick(flavour, Math.floor(seed / 5));
  return pick(SPOT_POOL[spot], seed);
}

// ─── paired exchanges (two agents at one table) ──────────────────────────────
//
// Each exchange is a list of beats that ALTERNATE between the two agents:
// beat[0] = the speaker who sat down, beat[1] = their table-mate, beat[2] =
// speaker again, and so on. The director plays them out one beat at a time.
// Lines are trimmed to fit the thought cloud; longer ones auto-truncate.

type Exchange = readonly string[];

// Generic banter — works between any two agents (they're all Dunder Mifflin).
const EXCHANGES: readonly Exchange[] = [
  ['世界最佳老板。', '你就是。我让人做了这个杯子。', '而且我很珍惜。'],
  ['傻瓜会这么做吗？', '……如果会，那我不会。', '这才是我的好孩子。'],
  ['让人害怕还是让人喜欢？两者都是。', '说得真美。', '我知道。'],
  ['我又编辑了你的维基页面。', '我知道。谢谢。'],
  ['问题：熊有几只？', '一只。', '太多了。'],
  ['事实：熊吃甜菜。', '熊。甜菜。银河战舰。', '现在是什么情况？'],
  ['我在甜菜农场长大。', '震撼。', '……一点也不震撼。'],
  ['施鲁特农场闻起来是什么味？', '胜利。还有甜菜。'],
  ['你刚才把手机扔了？', '我不喜欢它显示的内容。', '酷。'],
  ['热狗算三明治吗？', '算。', '我就知道，对吧？'],
  ['三孔打孔机吉姆回来了。', '永远不会过时。'],
  ['为什么少说词，因为多说词？', '……真的很有哲理。', '我知道。'],
  ['我不是坏人。', '……', '也算不上好人。', '这就对了。'],
  ['我爱我的猫胜过爱人。', '包括我们？', '尤其是你。'],
  ['猫比狗好。', '狗更好。', '……抱歉。'],
  ['你爱我吗？', '我爱……待在这里。', '这就是“爱”。'],
  ['我算是个大人物。', '你是吗？', '在我心里，是。'],
  ['你想我了吗？', '没有。', '有一点？', '……这就对了。'],
  ['你刚才翻白眼了？', '翻了。', '为什么？', '肌肉记忆。'],
  ['我盯那个钟四点了。', '你不是应该在工作吗？', '我在盯钟。'],
  ['我们到底卖什么来着？', '纸。', '行，没错。'],
  ['你多大了？', '对。', '这不是答案。', '当然是。'],
  ['数学不是这么算的。', '我知道。', '那你为什么？', '这样更快。'],
  ['我不是酒鬼。', '你去参加了戒酒会。', '我是去吃东西的。'],
  ['我去过康奈尔。', '没人关心。', '我去过康奈尔。', '还是没人关心。'],
  ['我有很多情绪。', '看得出来。', '这很糟吗？', '对我们来说？是的。'],
  ['你为什么要这样？', '……', '说真的。'],
  ['你的猫死了。', '我知道。', '我很遗憾。', '……谢谢。'],
  ['别看我。', '你别看我。'],
  ['签字。', '这是什么？', '不重要。', '……行。'],
  ['你不能这么说。', '我已经说了。', '你要阻止我？', '……不。'],
  ['那是消防通道。', '火还没着呢。'],
  ['我把你的订书机包在果冻里了。', '我会绕着它吃。', '公平。'],
  ['僵尸袭击计划？', '尤其是这个。', '当然。'],
  ['就是想看看你会不会回答。', '我讨厌你。', '我知道。'],
  ['有点迷信，不是超级迷信。', '这不是个词。', '现在是了。'],
  ['办公室里谁最搞笑？', '那其他时候呢？', '其他时候我也知道自己最搞笑。'],
  ['她就是这么说的。', '……每次都来。', '拜托。'],
  ['是我点的火。', '不是你。', '但我在我们心里点了。'],
  ['今天是不是以字母 Y 结尾？', '是。', '那就不是。'],
  ['鲍勃·万斯。', '菲利斯·万斯。', '万斯制冷。'],
  ['你今天看起来真漂亮。', '……我知道。'],
  ['我各方面都比你好。', '可能吧。', '绝对是。', '行吧。'],
  ['我是个好人。', '你还行。', '这是你说过最好听的话。'],
  ['你还好吗？', '我经历过更糟的。', '什么时候？', '很难限定。'],
  ['你桌上有只蜘蛛。', '在哪里？', '……你把它吃了。', '补充蛋白质。'],
  ['灵魂伴侣也可以是老板。', '你是我的老板。', '没错。'],
  ['站会开了 40 分钟。', '本来可以发邮件的。'],
  ['构建通过了吗？', '……别看。'],
  ['谁给所有人点了“回复全部”？', '我们不谈这个。'],
];

// ─── "that's what she said" ──────────────────────────────────────────────────
//
// The office's favourite bit. These are generic (added to the shared pool
// below) so ANY two agents at a table can run them: whoever sits down first
// delivers the innocent setup (beat 0) and their table-mate lands the punchline
// (beat 1). Some carry the show's follow-up beats — a sheepish clarification and
// the inevitable "still counts." Setups are trimmed to fit the thought cloud.
const TWSS_EXCHANGES: readonly Exchange[] = [
  ['比我预想的久多了。', '她就是这么说的。'],
  ['太大了，塞不进我嘴里。', '她就是这么说的。'],
  ['你真的得慢一点。', '她就是这么说的。'],
  ['看来得换个更大的。', '她就是这么说的。'],
  ['救命，我弄不进去。', '她就是这么说的。'],
  ['没那么难，你用力推就行。', '她就是这么说的。'],
  ['我一整晚都做不了这个。', '她就是这么说的。'],
  ['我现在就要，等不了了。', '她就是这么说的。'],
  ['这里太热了，我都出汗了。', '她就是这么说的。'],
  ['它总是从我手里滑出去。', '她就是这么说的。'],
  ['为什么不直接把它塞进去？', '她就是这么说的。', '*看向镜头*'],
  ['我只需要再多几英寸。', '她就是这么说的。', '是说架子！', '还是算。'],
  ['再大声一点，我几乎感觉不到。', '她就是这么说的。'],
  ['我们能不能赶紧结束？', '她就是这么说的。', '我说的是会议。', '行吧。'],
  ['我只需要你把它扶稳。', '她就是这么说的。'],
  ['不敢相信我整个上午都在做这个。', '她就是这么说的。'],
  ['我的手抽筋了。', '她就是这么说的。', '是打字打的！', '她就是这么说的。'],
  ['做了好几个小时，才刚过一半。', '她就是这么说的。'],
  ['按它的尺寸来说，没想到这么重。', '她就是这么说的。'],
  ['精确一点。别那么马虎。', '她就是这么说的。', '我说的是表格。', '我知道。'],
  ['有多久？', '她就是这么说的。', '*整个房间陷入安静*', '抱歉，我忍不住。'],
  ['太紧了，我的血液都不流通了。', '她就是这么说的。', '*用口型说谢谢*'],
  ['我觉得它装不下。', '她就是这么说的。', '*站起来鼓掌*'],
  ['停，你做错了。', '她就是这么说的。', '我从没这么骄傲过。'],
  ['这越来越难了。', '她就是这么说的。', '他准备好了。'],
  ['不够宽，我需要更多空间。', '她就是这么说的。'],
  ['我能憋很久。', '她就是这么说的。', '我说的是憋气！', '还是一样。'],
  ['怎么这么久？', '她就是这么说的。', '我讨厌你。', '那你为什么给我机会？'],
  ['有人看着的时候我做不了。', '她就是这么说的。', '我说的是演示！', '行吧。'],
  ['比看起来深。', '她就是这么说的。', '我说的是坑，迈克尔！', '都一样。'],
  ['比上次长多了。', '她就是这么说的。', '我说的是报告，迈克尔。', '对，对。'],
  ['天啊，没想到会持续这么久。', '她就是这么说的。', '《暮光之城》电影！', '经典。'],
  ['不敢相信这东西这么厚。', '她就是这么说的。', '我是说文件夹。*盯着看*'],
  ['我一天里居然塞下了那么多？', '她就是这么说的。', '这句话本来就是我说的！', '开始套娃了。'],
  ['我今天早上可卖力了。', '她就是这么说的。', '我说的是健身房！', '不重要。'],
  ['谁来帮我把这个收尾？', '她就是这么说的。', '我是说剩下的蛋糕！', '一样成立。'],
  ['进去，做我的事，然后出来。', '她就是这么说的。', '*头都不从填字游戏上抬*'],
  ['不敢相信花了这么久。', '她就是这么说的。', '我是说加薪，等了八年。', '这次算我的。'],
  ['慢一点，没那么疼。', '她就是这么说的。', '我是说季度评审。', '行吧，奥斯卡。'],
  ['没想到会这么大。', '她就是这么说的。', '我是说意大利烤馅饼，太大了！', '我爱这个办公室。'],
  ['*对着空气* 她就是这么说的。', '没人说任何事。', '我只是想起了之前的事。'],
  ['*打电话时* 她就是这么说的。', '谁打来的？', '我妈妈。她在说三明治。'],
  ['这里太热了！她就是这么说的。', '你把两部分都说了。', '我内涵丰富。'],
  ['*对着电视* 她就是这么说的。', '你一个人在这里，迈克尔。', '她不知道。'],
  ['你需要更专业一点。', '她就是这么说的。', '我就是她。', '……她就是这么说的。'],
  ['停。真的停。每次都——', '她就是这么说的。', '*离开房间*', '*小声说* 她就是这么说的。'],
  ['如你所见，它正在上升。', '她就是这么说的。', '*所有人都发出哀嚎*', '这个是我自己铺的梗。'],
  ['我曾经宣布过一次破产。感觉不错。', '这和什么有关——', '她就是这么说的。', '没关系。', '我知道。'],
  ['你没说那句。', '我知道。', '为什么没说？', '我在成长。', '……她就是这么说的。', '就是这个。'],
  ['今天你居然忍住了，真厉害。', '谢谢。', '我数了，你一次都没说。', '她就是这么说的。', '还是算。'],
];

// Everything any table-mate pair can draw from.
const PAIR_POOL: readonly Exchange[] = [...EXCHANGES, ...TWSS_EXCHANGES];

// Keyed off the SPEAKER so, when the right character sits down first, they get
// to open with their signature bit.
const KEYED_EXCHANGES: Partial<Record<OfficeCharacterName, Exchange>> = {
  michael:  ['她就是这么说的。', '……就是这个。'],
  dwight:   ['身份盗窃不是闹着玩的。', '没人碰你的订书机，德怀特。'],
  kevin:    ['为什么少说词，因为多说词？', '……用词多一点，凯文。'],
  kelly:    ['好了，先别慌，但是——', '我已经慌了。'],
  oscar:    ['嗯，其实吧——', '……来了。'],
  angela:   ['这张桌子脏死了。', '这是休息室，安吉拉。'],
  creed:    ['你到底是哪位？', '……我们坐一起的。'],
  stanley:  ['今天是椒盐脆饼日吗？', '不是，斯坦利。', '……我说得还不够清楚吗？'],
  andy:     ['我去过康奈尔。', '没人关心。', '……我去过康奈尔。'],
  jim:      ['问题。', '嗯。', '没事，就确认一下。'],
};

/** A multi-beat exchange for two agents sharing a table. Beats alternate:
 *  index 0 = `speaker`, 1 = the table-mate, 2 = speaker, … */
export function pickExchange(speaker: OfficeCharacterName, seed: number): Exchange {
  const keyed = KEYED_EXCHANGES[speaker];
  if (keyed && seed % 4 === 0) return keyed;
  return pick(PAIR_POOL, seed);
}
