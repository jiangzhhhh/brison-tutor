(() => {
  'use strict';

  const names = { '、': '顿号', '，': '逗号', '。': '句号', '？': '问号', '！': '感叹号', '：': '冒号', '“': '左引号', '”': '右引号' };
  const endings = '。？！';
  const basic = '，。？！';
  const dialogue = '，。？！：“”';
  const enumeration = '、，。？！';
  const categories = [
    { id: 'statement', title: '平静陈述' },
    { id: 'question', title: '提问' },
    { id: 'exclamation', title: '感叹或提醒' },
    { id: 'pause', title: '句中停顿' },
    { id: 'sentences', title: '连续句子' },
    { id: 'dialogue', title: '人物对话' },
    { id: 'enumeration', title: '并列词语的顿号', weight: 2 }
  ];
  const rows = [
    ['q16a', 'insert', '小雨用平静的语气，把比赛名单上的消息告诉小乐。', '你也参加接力赛', '你也参加接力赛。', endings, '小雨平静地告诉小乐一件事，句末用句号。', 'statement'],
    ['q01', 'boxes', '用平静的语气告诉同桌自己的座位。', '我的座位在窗边□', '我的座位在窗边。', endings, '在告诉别人座位在哪里。', 'statement'],
    ['q05', 'boxes', '用平静的语气告诉爸爸今天做了什么。', '今天我们读了一个故事□', '今天我们读了一个故事。', endings, '平静地说完今天做的一件事。', 'statement'],
    ['q18', 'boxes', '班长用平静的语气介绍借阅规则。', '图书可以借一个星期□', '图书可以借一个星期。', endings, '平静地说明借阅时间，说完用句号。', 'statement'],
    ['q19', 'insert', '小南用平常的语气介绍自己种的植物。', '我种的是一株向日葵', '我种的是一株向日葵。', endings, '这句话在介绍种的是什么，句末用句号。', 'statement'],
    ['q20', 'boxes', '姐姐在日记里简单记下一件做完的事。', '我已经给小鱼喂过食了□', '我已经给小鱼喂过食了。', endings, '这里的“了”说明已经做完这件事，句末用句号。', 'statement'],
    ['q21', 'insert', '小天用平常的语气回答奶奶，告诉她姐姐在做什么。', '姐姐正在房间里画画', '姐姐正在房间里画画。', endings, '平静地回答别人，完整说完一件事，句末用句号。', 'statement'],
    ['q22', 'insert', '老师用平常的语气说明书包放在哪儿。', '书包放在椅子下面', '书包放在椅子下面。', endings, '这是在平静地说明书包的位置，句末用句号。', 'statement'],
    ['q23', 'insert', '小麦在观察本上记下豆苗长大的情况。', '豆苗长出了两片新叶', '豆苗长出了两片新叶。', endings, '这句话记下观察到的变化，句末用句号。', 'statement'],

    ['q16b', 'insert', '小雨没看到比赛名单，想问小乐一件事。', '你也参加接力赛', '你也参加接力赛？', endings, '小雨在向小乐求证，句末用问号。', 'question'],
    ['q02', 'boxes', '请同学帮忙找东西。', '你看见我的橡皮了吗□', '你看见我的橡皮了吗？', endings, '想知道对方看见了没有。', 'question'],
    ['q04', 'boxes', '询问活动时间。', '运动会几点开始□', '运动会几点开始？', endings, '想知道开始的时间。即使句末没有“吗”，这句话也在提问。', 'question'],
    ['q24', 'boxes', '小花想知道同桌喜欢坐在哪一排。', '你想坐前排还是后排□', '你想坐前排还是后排？', endings, '这是让对方从前排和后排里选一个，问号放在整句话的末尾。', 'question'],
    ['q25', 'boxes', '小松想借用同学的尺子，先问对方同不同意。', '我可以借一下你的尺子吗□', '我可以借一下你的尺子吗？', endings, '这句话在征求同意，句末用问号。', 'question'],
    ['q26', 'insert', '小雪不知道是谁关了灯，轻声问了问同学。', '谁把教室的灯关了', '谁把教室的灯关了？', endings, '“谁”表示在问关灯的人，整句话用问号结束。', 'question'],
    ['q27', 'insert', '哥哥想问弟弟到家的时间。', '你什么时候到家', '你什么时候到家？', endings, '“什么时候”在问时间，句末用问号。', 'question'],
    ['q28', 'insert', '小云拿起一个杯子，想问杯子的主人是谁。', '这个杯子是谁的', '这个杯子是谁的？', endings, '说话的人想知道杯子属于谁，句末用问号。', 'question'],
    ['q29', 'insert', '两条小路都能走，小雨问朋友走哪一条。', '我们从哪条小路过去', '我们从哪条小路过去？', endings, '“哪条”在问要走哪一条路，句末用问号。', 'question'],

    ['q03', 'boxes', '看到彩虹，忍不住赞叹。', '这道彩虹真美呀□', '这道彩虹真美呀！', endings, '说话的人看到彩虹，发出赞叹。', 'exclamation'],
    ['q06', 'boxes', '急着提醒同学。', '小心，脚下有水□', '小心，脚下有水！', endings, '很着急地提醒同学留意脚下。', 'exclamation'],
    ['q30', 'boxes', '弟弟看到风筝飞上了高空，激动地叫起来。', '哇，这只风筝飞得真高□', '哇，这只风筝飞得真高！', endings, '“哇”和“真高”读出了惊喜，句末用感叹号。', 'exclamation'],
    ['q31', 'boxes', '看到朋友快走到红灯前，小川急忙大喊。', '请停下，前面是红灯□', '请停下，前面是红灯！', endings, '这句话在紧急提醒朋友停下，用感叹号表现着急。', 'exclamation'],
    ['q32', 'insert', '等了好几天，小禾看到新芽，高兴得喊起来。', '我们的种子终于发芽啦', '我们的种子终于发芽啦！', endings, '“终于”和“啦”表达了等到发芽的喜悦，句末用感叹号。', 'exclamation'],
    ['q33', 'insert', '生日会上，大家一起热情地喊出祝福。', '祝你生日快乐', '祝你生日快乐！', endings, '大家大声送出祝福，句末用感叹号。', 'exclamation'],
    ['q34', 'insert', '小青看见小狗用鼻子顶开了门，惊讶地叫起来。', '它居然会自己开门', '它居然会自己开门！', endings, '“居然”表示这件事出乎意料，感叹号写出了惊讶的语气。', 'exclamation'],
    ['q35', 'insert', '雨点已经打进屋里，妈妈急着大声提醒。', '快把窗户关上', '快把窗户关上！', endings, '“快”表现了催促的语气，用感叹号写出情况紧急。', 'exclamation'],
    ['q36', 'insert', '接力比赛快结束了，同学们大声给跑最后一棒的小河加油。', '向终点冲呀', '向终点冲呀！', endings, '这是大声加油，语气强，句末用感叹号。', 'exclamation'],

    ['q10', 'insert', '用一句话说明原因。先说原因，停一下，再说结果。', '因为天黑了我们就回家了', '因为天黑了，我们就回家了。', basic, '先说原因，再接着说结果，两部分用逗号连接。', 'pause'],
    ['q07', 'boxes', '先说时间，停一下，再接着说做什么。', '放学以后□我和姐姐一起回家□', '放学以后，我和姐姐一起回家。', basic, '先说时间，稍作停顿，再说做什么。', 'pause'],
    ['q08', 'boxes', '用一句话平静地说出两件同时做的事。', '弟弟一边拍手□一边唱歌□', '弟弟一边拍手，一边唱歌。', basic, '两个“一边”连起来说同一时刻的两个动作，中间用逗号。', 'pause'],
    ['q37', 'boxes', '小雨先叫奶奶，稍停一下，再平静地告诉她围巾在哪儿。', '奶奶□您的围巾落在椅子上□', '奶奶，您的围巾落在椅子上。', basic, '叫过“奶奶”后停一下，用逗号。整句话说完用句号。', 'pause'],
    ['q38', 'boxes', '用一句话平静地说出小禾做的两个动作，在两个动作之间停一下。', '小禾捡起落叶□放进篮子里□', '小禾捡起落叶，放进篮子里。', basic, '捡起和放进是先后两个动作，用逗号隔开，整句话用句号收尾。', 'pause'],
    ['q39', 'insert', '用一句话平静地说两人在做什么，说完哥哥在做的事后停一下。', '哥哥在厨房洗菜姐姐在桌边摆碗', '哥哥在厨房洗菜，姐姐在桌边摆碗。', basic, '哥哥和姐姐各做一件事。两件事在一句话里用逗号隔开。', 'pause'],
    ['q40', 'insert', '用一句话平静地说一个打算，说完要满足的条件后停一下。', '如果下午不下雨我们就去操场', '如果下午不下雨，我们就去操场。', basic, '先说要满足的条件“下午不下雨”，再说打算，停顿处用逗号。', 'pause'],
    ['q41', 'insert', '用一句话记下小鸟先后做的事，说完第一个动作后停一下。', '小鸟飞上枝头轻轻唱了起来', '小鸟飞上枝头，轻轻唱了起来。', basic, '小鸟先飞上枝头，再轻轻唱歌。两个动作之间停一下，用逗号。', 'pause'],
    ['q42', 'insert', '用一句话平静地说完，先说花的变化，停一下，再说蜜蜂的情况。', '院子里的花开了可是蜜蜂还没来', '院子里的花开了，可是蜜蜂还没来。', basic, '说完“花开了”稍停一下，“可是”接着说蜜蜂还没来，停顿处用逗号。', 'pause'],

    ['q09', 'insert', '先用平静的语气告诉对方一件事，再单独问一个问题。', '雨停了我们可以出去踢球吗', '雨停了。我们可以出去踢球吗？', basic, '第一句报告雨停了，第二句单独发问。', 'sentences'],
    ['q11', 'insert', '先平静地说看到的东西，再单独说一句赞叹的话。', '窗外开了几朵花这些花开得真漂亮啊', '窗外开了几朵花。这些花开得真漂亮啊！', basic, '第一句平静地说看到的东西，第二句表达赞叹。', 'sentences'],
    ['q43', 'boxes', '用两句话平静地说两件事。', '门口的灯亮了□爷爷回家了□', '门口的灯亮了。爷爷回家了。', basic, '两件事各用一句话说完，每句末尾都用句号。', 'sentences'],
    ['q44', 'boxes', '先问伞是谁的，再另用一句话平静地说在哪儿捡到。', '这把伞是谁的□我在教室门口捡到了它□', '这把伞是谁的？我在教室门口捡到了它。', basic, '第一句问伞的主人，用问号。第二句报告捡伞地点，用句号。', 'sentences'],
    ['q45', 'boxes', '先高兴地喊出找到钥匙的消息，再用另一句话平静地说钥匙在哪儿。', '我找到钥匙啦□它原来在书包里□', '我找到钥匙啦！它原来在书包里。', basic, '第一句用感叹号表现找到钥匙的兴奋。第二句用句号说明钥匙的位置。', 'sentences'],
    ['q46', 'boxes', '把两个问题分开问，每个问题用一句话。', '你要去图书馆吗□什么时候出发□', '你要去图书馆吗？什么时候出发？', basic, '第一句问去不去，第二句问时间。两个问题各用一个问号。', 'sentences'],
    ['q47', 'insert', '用两句话说完。先赞叹雪厚，再问同伴有没有带手套。', '这里的雪真厚啊你带手套了吗', '这里的雪真厚啊！你带手套了吗？', basic, '“真厚啊”是赞叹，用感叹号收尾。第二句在提问，用问号。', 'sentences'],
    ['q48', 'insert', '用三句话说完。先平静地说看见小鱼，再赞叹它游得快，最后问同伴看见没有。', '我看见小鱼了它游得真快呀你也看见了吗', '我看见小鱼了。它游得真快呀！你也看见了吗？', basic, '平静地说看见什么，用句号。赞叹用感叹号，询问同伴用问号。', 'sentences'],
    ['q49', 'insert', '用两句话平静地记下看到的情景。先记看到什么，再记它去了哪儿。', '操场上有一只小猫它躲到树后面去了', '操场上有一只小猫。它躲到树后面去了。', basic, '第一句说看到小猫，第二句说小猫去了哪儿，两句各用一个句号。', 'sentences'],

    ['q12', 'insert', '妈妈问。', '妈妈问你的水壶带了吗', '妈妈问：“你的水壶带了吗？”', dialogue, '冒号接在“妈妈问”后，问号放在右引号里面。', 'dialogue'],
    ['q13', 'insert', '小安平静地回答。', '小安说我的水壶在书包里', '小安说：“我的水壶在书包里。”', dialogue, '引号圈住小安说的完整一句话，句号放在右引号里面。', 'dialogue'],
    ['q14', 'insert', '小安高兴地喊。', '小安高兴地喊我们赢啦', '小安高兴地喊：“我们赢啦！”', dialogue, '感叹号表示小安喊得很兴奋，放在右引号里面。', 'dialogue'],
    ['q17', 'insert', '给下面的小短文加四处标点。先用一句话介绍时间和活动，再写小文的问话。', '星期六早上小文和爸爸一起去公园小文问：“爸爸我们能去看小鸭吗”', '星期六早上，小文和爸爸一起去公园。小文问：“爸爸，我们能去看小鸭吗？”', basic, '逗号把时间和活动隔开，句号结束第一句。小文先叫“爸爸”，停一下再问，所以“爸爸”后用逗号，问号写在右引号里面。', 'dialogue'],
    ['q50', 'boxes', '丁丁平静地告诉同学自己整理好了书。接着写他做了什么。', '丁丁说□□我把书放回书架了□□说完，他坐回座位。', '丁丁说：“我把书放回书架了。”说完，他坐回座位。', dialogue, '“丁丁说”后用冒号。引号包住丁丁的话，句号放在右引号里。“说完”是接下来发生的事，在引号外。', 'dialogue'],
    ['q51', 'boxes', '小荷问大家谁想和她一起浇花。', '小荷问□□谁愿意跟我一起浇花□□', '小荷问：“谁愿意跟我一起浇花？”', dialogue, '冒号后写小荷说的话，用引号括起来。问号放在右引号里面。', 'dialogue'],
    ['q52', 'boxes', '看到选手快跑到终点，大家激动地喊。', '大家朝终点大喊□□快跑呀□□', '大家朝终点大喊：“快跑呀！”', dialogue, '“大喊”后用冒号和左引号。喊话用感叹号收尾，右引号接在后面。', 'dialogue'],
    ['q53', 'boxes', '两位同学分别平静地告诉老师自己带了什么水果。', '圆圆说□□我带了苹果□□小叶说□□我带了梨□□', '圆圆说：“我带了苹果。”小叶说：“我带了梨。”', dialogue, '两个人各说一句。每个“说”后用冒号，各自的话都用一对引号包起来。', 'dialogue'],
    ['q54', 'insert', '先写小麦问的话，句尾再交代是谁问的。', '你到过天文馆吗小麦问', '“你到过天文馆吗？”小麦问。', dialogue, '先用引号包住问题，问号在右引号里。最后的“小麦问”交代说话人，用句号结束。', 'dialogue'],

    ['q55', 'boxes', '小雨在清单上用一句话记下要带的三样文具。', '我要带铅笔□橡皮□尺子□', '我要带铅笔、橡皮、尺子。', enumeration, '铅笔、橡皮、尺子是并列的三样文具，它们之间用顿号。', 'enumeration'],
    ['q56', 'boxes', '用一句话平静地列出小安做好的三件纸手工。', '小安做了纸船□纸鹤□纸灯笼□', '小安做了纸船、纸鹤、纸灯笼。', enumeration, '纸船、纸鹤、纸灯笼是三件并列的纸手工，用顿号隔开。', 'enumeration'],
    ['q57', 'boxes', '先说时间，停一下，再用同一句话平静地列出看到的三种鸟。', '清早□树上停着麻雀□白鸽□喜鹊□', '清早，树上停着麻雀、白鸽、喜鹊。', enumeration, '“清早”后用逗号停顿，三种鸟的名称之间用顿号。', 'enumeration'],
    ['q58', 'boxes', '用一句话平静地说两个人各做了什么。说完小雨做的事，停一下。', '小雨把彩纸□剪刀□胶棒放在桌上□弟弟把纸盒放在地上□', '小雨把彩纸、剪刀、胶棒放在桌上，弟弟把纸盒放在地上。', enumeration, '三样物品之间用顿号。说完小雨做的事，用逗号接着说弟弟做的事。', 'enumeration'],
    ['q59', 'boxes', '老师用一句话问同学想选哪一种颜色。', '你选红色□黄色还是蓝色□', '你选红色、黄色还是蓝色？', enumeration, '“红色”和“黄色”之间用顿号。“还是”连起最后一个选项，整句问完用问号。', 'enumeration'],
    ['q60', 'boxes', '老师平静地说了一个集合条件。说完条件，停一下，再说去哪儿。', '如果你带了跳绳□毽子或沙包□就到操场集合□', '如果你带了跳绳、毽子或沙包，就到操场集合。', enumeration, '“跳绳”和“毽子”之间用顿号，“或”连起最后一样器材。说完条件，用逗号。', 'enumeration'],
    ['q61', 'insert', '小米用一句话平静地列出便当盒里的三样食物。', '便当盒里有饭团鸡蛋小番茄', '便当盒里有饭团、鸡蛋、小番茄。', enumeration, '饭团、鸡蛋、小番茄是并列的三样食物，它们之间用顿号。', 'enumeration'],
    ['q62', 'insert', '用一句话平静地介绍这辆车的路线。报完经过的三个站，停一下，再说终点。', '这辆车经过公园站学校站医院站终点在火车站', '这辆车经过公园站、学校站、医院站，终点在火车站。', enumeration, '经过的三个站名之间用顿号。报完经过的站名，用逗号接着说终点。', 'enumeration'],
    ['q63', 'insert', '小山用一句话平静地写下自己读了哪三种书。写完时间，停一下。', '午饭后我读了故事书科普书和漫画书', '午饭后，我读了故事书、科普书和漫画书。', enumeration, '“午饭后”之后的停顿用逗号。“故事书”和“科普书”之间用顿号，“和”连起最后一项。', 'enumeration'],
    ['q64', 'insert', '用一句话平静地说姐姐和哥哥各做了什么。说完姐姐做的事，停一下。', '姐姐洗好了草莓葡萄樱桃哥哥拿来了盘子', '姐姐洗好了草莓、葡萄、樱桃，哥哥拿来了盘子。', enumeration, '草莓、葡萄、樱桃都是姐姐洗好的水果，它们之间用顿号。两个人做的事用逗号隔开。', 'enumeration'],
    ['q65', 'insert', '看见三种菜都发芽了，小豆兴奋地喊了一句话。', '白菜萝卜菠菜都发芽啦', '白菜、萝卜、菠菜都发芽啦！', enumeration, '三种菜的名称之间用顿号。小豆喊得兴奋，句末用感叹号。', 'enumeration'],
    ['q66', 'insert', '平静地说两句话。先说大家收好了哪三样东西，再说大家去了哪儿。', '大家收好了画笔颜料画纸我们一起去洗手', '大家收好了画笔、颜料、画纸。我们一起去洗手。', enumeration, '画笔、颜料、画纸是并列的三样物品，它们之间用顿号。两句话分别用句号收尾。', 'enumeration']
  ];

  const questions = rows.map(([id, mode, hint, text, answer, palette, reason, category]) => ({
    id, mode, hint, text, answer, palette, reason, category,
    parts: mode === 'boxes' ? text.split('□') : Array.from(text)
  }));
  const byId = new Map(questions.map(question => [question.id, question]));

  function blank(question) {
    const size = question.mode === 'boxes' ? question.parts.length - 1 : question.parts.length + 1;
    return Array(size).fill('');
  }

  function sentence(question, marks) {
    if (question.mode === 'boxes') {
      return question.parts.map((part, index) => part + (index < marks.length ? marks[index] || '□' : '')).join('');
    }
    return marks.map((mark, index) => mark + (question.parts[index] ?? '')).join('');
  }

  // 每项对应完成句子的一个字符边界，同一处可以依次插入冒号、引号等标点。
  function boundaries(marks) {
    return marks.flatMap((mark, index) => Array.from({ length: mark.length + 1 }, (_, offset) => ({ index, offset })));
  }

  function place(question, marks, target, mark) {
    if (!target || mark.length !== 1 || !question.palette.includes(mark)) return null;
    const { index, offset } = target;
    if (!Number.isInteger(index) || !Object.hasOwn(marks, index)) return null;
    const draft = marks.slice();
    if (question.mode === 'boxes') draft[index] = mark;
    else {
      const existing = marks[index];
      if (!Number.isInteger(offset) || offset < 0 || offset > existing.length || existing.length >= 4) return null;
      draft[index] = existing.slice(0, offset) + mark + existing.slice(offset);
    }
    return draft;
  }

  function remove(question, marks, { index, offset }) {
    const draft = marks.slice();
    const existing = marks[index];
    draft[index] = question.mode === 'boxes' ? '' : existing.slice(0, offset) + existing.slice(offset + 1);
    return draft;
  }

  function complete(question, marks) {
    return question.mode === 'boxes' ? marks.every(Boolean) : marks.some(Boolean);
  }

  function correct(question, marks) {
    return sentence(question, marks) === question.answer;
  }

  function answerMarks(question) {
    let offset = 0;
    if (question.mode === 'boxes') {
      return question.parts.slice(0, -1).map(part => {
        offset += part.length;
        return question.answer[offset++];
      });
    }
    const answer = Array.from(question.answer);
    return blank(question).map((_, index) => {
      const start = offset;
      const next = question.parts[index];
      while (offset < answer.length && answer[offset] !== next) offset++;
      return answer.slice(start, offset++).join('');
    });
  }

  function changedMarks(actual, expected) {
    let start = 0;
    let actualEnd = actual.length;
    let expectedEnd = expected.length;
    while (start < actualEnd && start < expectedEnd && actual[start] === expected[start]) start++;
    while (actualEnd > start && expectedEnd > start && actual[actualEnd - 1] === expected[expectedEnd - 1]) {
      actualEnd--;
      expectedEnd--;
    }
    return [actual.slice(0, start), actual.slice(start, actualEnd), expected.slice(start, expectedEnd), actual.slice(actualEnd)];
  }

  function validMarks(question, marks) {
    const limit = question.mode === 'boxes' ? 1 : 4;
    return Array.isArray(marks) && marks.length === blank(question).length && marks.every(mark =>
      typeof mark === 'string' && mark.length <= limit && Array.from(mark).every(char => question.palette.includes(char))
    );
  }

  function validProgress(data) {
    if (!byId.has(data?.currentQuestionId) || !data.records || typeof data.records !== 'object' || Array.isArray(data.records)) return false;
    return Object.entries(data.records).every(([id, record]) => {
      const question = byId.get(id);
      if (!question || !record || typeof record !== 'object') return false;
      const { draft, first, latest } = record;
      if (draft !== null && !validMarks(question, draft)) return false;
      if (first === null && latest === null) return draft !== null;
      return [first, latest].every(result => validMarks(question, result) && complete(question, result));
    });
  }

  window.Punctuation = { names, categories, questions, blank, sentence, boundaries, place, remove, complete, correct, answerMarks, changedMarks, validMarks, validProgress };
})();
