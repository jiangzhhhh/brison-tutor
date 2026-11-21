// 由 tools/build-reading-quest-bank.cjs 根据题库归档生成。来源署名和许可见归档。
(function (root) {
  'use strict';
  const version = "1.0";
  const sources = {
    "winograd": {
      "name": "Winograd Schema Challenge",
      "url": "https://cs.nyu.edu/~davise/papers/WinogradSchemas/WS.html",
      "license": "CC BY 4.0"
    },
    "babi": {
      "name": "bAbI QA v1.2",
      "url": "https://huggingface.co/datasets/facebook/babi_qa/blob/main/README.md",
      "license": "CC BY 3.0"
    },
    "clutrr": {
      "name": "CLUTRR",
      "url": "https://github.com/facebookresearch/clutrr#license",
      "license": "CC BY-NC 4.0"
    }
  };
  const categories = [
    {
      "id": "pronouns",
      "name": "指代与常识"
    },
    {
      "id": "facts",
      "name": "追踪人物和物品"
    },
    {
      "id": "negation",
      "name": "读懂否定"
    },
    {
      "id": "time",
      "name": "时间顺序"
    },
    {
      "id": "conditions",
      "name": "按条件推断"
    },
    {
      "id": "position",
      "name": "判断位置"
    },
    {
      "id": "size",
      "name": "比较大小"
    },
    {
      "id": "relationships",
      "name": "家庭关系"
    }
  ];
  const groups = [
    { id: "wsc-01", source: "winograd", source_author: "Hector Levesque", category: "pronouns", variants: [
      {"id":"wsc-01-v1","chinese_text":"奖杯放不进棕色的手提箱，因为它太大了。","question":"“它太大了”里的“它”指什么？","choices":["奖杯","手提箱"],"answer":"奖杯","explanation":"放进去的是奖杯。奖杯太大，就装不进手提箱。"},
      {"id":"wsc-01-v2","chinese_text":"奖杯放不进棕色的手提箱，因为它太小了。","question":"“它太小了”里的“它”指什么？","choices":["奖杯","手提箱"],"answer":"手提箱","explanation":"手提箱太小，里面就没有足够的地方放奖杯。"},
      {"id":"wsc-01-v3","chinese_text":"拼图板放不进抽屉，因为它太宽了。","question":"什么太宽了？","choices":["拼图板","抽屉"],"answer":"拼图板","explanation":"要放进抽屉的是拼图板。拼图板太宽，就放不进去。"},
      {"id":"wsc-01-v4","chinese_text":"拼图板放不进抽屉，因为它太窄了。","question":"什么太窄了？","choices":["拼图板","抽屉"],"answer":"抽屉","explanation":"抽屉太窄，宽一些的拼图板就放不进去。"}
    ] },
    { id: "wsc-02", source: "winograd", source_author: "Hector Levesque", category: "pronouns", variants: [
      {"id":"wsc-02-v1","chinese_text":"小安遇到了难题。她特意向小宁道谢，因为她帮着把难题讲明白了。","question":"出手帮忙的是谁？","choices":["小安","小宁"],"answer":"小宁","explanation":"小安遇到难题。小宁帮了她，所以小安向小宁道谢。"},
      {"id":"wsc-02-v2","chinese_text":"小安特意向小宁道谢，因为她遇到难题时得到了帮助。","question":"得到帮助的是谁？","choices":["小安","小宁"],"answer":"小安","explanation":"得到帮助的人是小安，所以她向帮忙的小宁道谢。"},
      {"id":"wsc-02-v3","chinese_text":"下雨了，小乐向小晨道谢，因为他把自己的雨伞借给了小乐。","question":"把雨伞借出去的是谁？","choices":["小乐","小晨"],"answer":"小晨","explanation":"小晨把伞借给了小乐。小乐拿到伞，所以向小晨道谢。"},
      {"id":"wsc-02-v4","chinese_text":"小乐向小晨道谢，因为他雨天没带伞，这下有伞用了。","question":"原来没带伞的是谁？","choices":["小乐","小晨"],"answer":"小乐","explanation":"小乐向小晨道谢，是因为他自己原来没带伞，现在有伞用了。"}
    ] },
    { id: "wsc-03", source: "winograd", source_author: "Hector Levesque", category: "pronouns", variants: [
      {"id":"wsc-03-v1","chinese_text":"小宇想打电话给小冬，可他没能打通。","question":"谁想打电话却没能打通？","choices":["小宇","小冬"],"answer":"小宇","explanation":"小宇是打电话的人。没打通，就是小宇没能接通这通电话。"},
      {"id":"wsc-03-v2","chinese_text":"小宇打电话找小冬，可他没接电话。","question":"谁没接电话？","choices":["小宇","小冬"],"answer":"小冬","explanation":"小宇打电话找小冬，所以接电话的人应该是小冬。"},
      {"id":"wsc-03-v3","chinese_text":"奶奶想用手机给外婆打电话，可她按错了号码。","question":"谁按错了号码？","choices":["奶奶","外婆"],"answer":"奶奶","explanation":"奶奶在拨号码，拨错号码的是她。"},
      {"id":"wsc-03-v4","chinese_text":"奶奶用手机给外婆打视频电话，可她的手机响了好一会儿也没接起来。","question":"谁的手机响了却没接？","choices":["奶奶","外婆"],"answer":"外婆","explanation":"奶奶把电话打给外婆，响铃等待接听的是外婆的手机。"}
    ] },
    { id: "wsc-04", source: "winograd", source_author: "Hector Levesque", category: "pronouns", variants: [
      {"id":"wsc-04-v1","chinese_text":"小森问小林一个问题，但他不愿意回答。","question":"谁不愿意回答？","choices":["小森","小林"],"answer":"小林","explanation":"小森提出问题，要回答的人是小林。"},
      {"id":"wsc-04-v2","chinese_text":"小森问小林一个问题。小林没听清，可他不肯把同一个问题再问一遍。","question":"谁不愿再问一遍？","choices":["小森","小林"],"answer":"小森","explanation":"最先问问题的是小森，因此再问一遍的人也是小森。"},
      {"id":"wsc-04-v3","chinese_text":"小晴问小雨故事的结尾。她答不上来，只好翻到最后一页找答案。","question":"谁从最后一页找答案来回答问题？","choices":["小晴","小雨"],"answer":"小雨","explanation":"小晴在提问。小雨需要回答，所以她从书里找答案。"},
      {"id":"wsc-04-v4","chinese_text":"小晴问小雨故事的结尾。小雨反问她为什么想知道，弄得她反而要先回答问题。","question":"谁反而要先回答问题？","choices":["小晴","小雨"],"answer":"小晴","explanation":"小雨又问了小晴一个问题。这一次小晴成了要回答的人。"}
    ] },
    { id: "wsc-05", source: "winograd", source_author: "Hector Levesque", category: "pronouns", variants: [
      {"id":"wsc-05-v1","chinese_text":"小货车从校车后面开过来，很快超过了校车，因为它开得很慢。","question":"开得很慢的是哪辆车？","choices":["小货车","校车"],"answer":"校车","explanation":"小货车能从后面超过校车，是因为前面的校车开得慢。"},
      {"id":"wsc-05-v2","chinese_text":"小货车从校车后面开过来，很快超过了校车，因为它开得很快。","question":"开得很快的是哪辆车？","choices":["小货车","校车"],"answer":"小货车","explanation":"小货车从后面赶上并超过校车，开得快的是小货车。"},
      {"id":"wsc-05-v3","chinese_text":"蓝色玩具车从后面就要追上红色玩具车了。它忽然停下来，蓝色车一下子就超过了对方。","question":"忽然停下来的是哪辆车？","choices":["蓝色玩具车","红色玩具车"],"answer":"红色玩具车","explanation":"蓝色玩具车还在往前开，并超过了对方。停下来的是红色玩具车。"},
      {"id":"wsc-05-v4","chinese_text":"蓝色玩具车从后面就要追上红色玩具车了。它忽然停下来，红色车一下子就把对方甩远了。","question":"忽然停下来的是哪辆车？","choices":["蓝色玩具车","红色玩具车"],"answer":"蓝色玩具车","explanation":"红色玩具车还在往前开，把对方甩远了。停下来的是蓝色玩具车。"}
    ] },
    { id: "wsc-06", source: "winograd", source_author: "Hector Levesque", category: "pronouns", variants: [
      {"id":"wsc-06-v1","chinese_text":"小东站在小川后面看台上的节目。他太高了，把小东的视线挡住了。","question":"谁太高了？","choices":["小东","小川"],"answer":"小川","explanation":"小川站在小东前面。他个子高，挡住了后面的小东。"},
      {"id":"wsc-06-v2","chinese_text":"小东站在小川后面看台上的节目。他太矮了，怎么踮脚也看不到台上。","question":"谁太矮了？","choices":["小东","小川"],"answer":"小东","explanation":"小东站在后面看节目。他太矮，踮起脚也被前面的人挡住。"},
      {"id":"wsc-06-v3","chinese_text":"小羊站在小鹿后面找前方的铃铛。它一低头，小羊就看见了铃铛。","question":"谁低下了头？","choices":["小羊","小鹿"],"answer":"小鹿","explanation":"小鹿在前面，低下头以后不再挡着铃铛，后面的小羊就看见了。"},
      {"id":"wsc-06-v4","chinese_text":"小羊站在小鹿后面找前方的铃铛。它站上石头，这才从小鹿头顶看见铃铛。","question":"谁站上了石头？","choices":["小羊","小鹿"],"answer":"小羊","explanation":"小羊在后面找铃铛。它站得更高，就能从前面的小鹿头顶看过去。"}
    ] },
    { id: "wsc-07", source: "winograd", source_author: "Hector Levesque", category: "pronouns", variants: [
      {"id":"wsc-07-v1","chinese_text":"小云和小青跑起来差不多快。小云先跑到终点，因为她起步时抢在了前面。","question":"谁一开始就跑在前面？","choices":["小云","小青"],"answer":"小云","explanation":"两人跑得差不多快，所以起步就领先的小云先到终点。"},
      {"id":"wsc-07-v2","chinese_text":"小云和小青跑步。有一个人起步慢了一拍，之后两人跑得一样快。最后小云先到终点。","question":"谁起步时慢了一拍？","choices":["小云","小青"],"answer":"小青","explanation":"两人跑得差不多快。小青起步慢了一拍，所以小云先到终点。"},
      {"id":"wsc-07-v3","chinese_text":"黄队和绿队踢球。比分打平后，他们进了全场最后一球。比赛结束时，黄队赢了。","question":"哪队进了打破平局的一球？","choices":["黄队","绿队"],"answer":"黄队","explanation":"比分原来相同。后来黄队赢了，打破平局的进球属于黄队。"},
      {"id":"wsc-07-v4","chinese_text":"黄队和绿队踢球。比分打平时，他们漏守了一次，让对方进了最后一球，结果黄队赢了。","question":"哪队漏守了一次？","choices":["黄队","绿队"],"answer":"绿队","explanation":"比分原来相同。漏守的一方让对手进了球，所以绿队漏守，黄队赢了。"}
    ] },
    { id: "wsc-08", source: "winograd", source_author: "Hector Levesque", category: "pronouns", variants: [
      {"id":"wsc-08-v1","chinese_text":"圆滚滚的摆件从架子上滚了下去，因为它的板面一头高、一头低。","question":"什么的板面一头高、一头低？","choices":["摆件","架子"],"answer":"架子","explanation":"架子的板面不平，放在上面的圆摆件就会顺着斜面滚下去。"},
      {"id":"wsc-08-v2","chinese_text":"圆滚滚的摆件从架子上滚了下去，因为它没有用绳子绑牢。","question":"什么没有用绳子绑牢？","choices":["摆件","架子"],"answer":"摆件","explanation":"摆件没有绑住，就会在架子上滚动，可能掉下来。"},
      {"id":"wsc-08-v3","chinese_text":"乒乓球在托盘上一直往左滚，因为它左边低、右边高。","question":"什么左边低、右边高？","choices":["乒乓球","托盘"],"answer":"托盘","explanation":"托盘左边低，球就在盘面上顺着斜面向左滚。"},
      {"id":"wsc-08-v4","chinese_text":"乒乓球在托盘上到处滚，因为它圆溜溜的，一碰就动。","question":"什么圆溜溜的，一碰就动？","choices":["乒乓球","托盘"],"answer":"乒乓球","explanation":"圆溜溜的是球。乒乓球一碰就会在盘面上滚起来。"}
    ] },
    { id: "wsc-09", source: "winograd", source_author: "Hector Levesque", category: "pronouns", variants: [
      {"id":"wsc-09-v1","chinese_text":"小禾和小苗做了同一份练习。小禾答对的题多得多，因为她把这类题认真练过好几遍。","question":"谁认真练过这类题？","choices":["小禾","小苗"],"answer":"小禾","explanation":"小禾答对的题更多。反复练习帮助小禾熟悉了这类题。"},
      {"id":"wsc-09-v2","chinese_text":"小禾和小苗做了同一份练习。她们原来会做的题一样多。提前练过的那个人答对了更多题，最后小禾答对的题较少。","question":"谁认真练过这类题？","choices":["小禾","小苗"],"answer":"小苗","explanation":"小禾答对的题更少，也就是说小苗答对的更多。认真练习帮助了小苗。"},
      {"id":"wsc-09-v3","chinese_text":"宁宁和圆圆一起背古诗，宁宁先背会了，因为她每晚都读两遍。","question":"谁每晚都读两遍古诗？","choices":["宁宁","圆圆"],"answer":"宁宁","explanation":"每天读能帮助记住古诗。宁宁经常练习，所以先背会了。"},
      {"id":"wsc-09-v4","chinese_text":"宁宁和圆圆背同一首古诗。每天都读的人先背会了，另一个人一直没来得及练。宁宁先背会了。","question":"谁一直没来得及练习？","choices":["宁宁","圆圆"],"answer":"圆圆","explanation":"宁宁先背会了。圆圆没来得及练习，所以落在了后面。"}
    ] },
    { id: "wsc-10", source: "winograd", source_author: "Hector Levesque", category: "pronouns", variants: [
      {"id":"wsc-10-v1","chinese_text":"一袋土豆压在一袋面粉上。两袋都要取走，得先搬开它。","question":"要先搬开哪一袋？","choices":["土豆","面粉"],"answer":"土豆","explanation":"土豆在上面，先搬开土豆，下面的面粉才方便拿出来。"},
      {"id":"wsc-10-v2","chinese_text":"一袋土豆压着一袋面粉。先搬开上面的那袋，才能把它从下面拿出来。","question":"从下面拿出来的是哪一袋？","choices":["土豆","面粉"],"answer":"面粉","explanation":"土豆在上面，搬开它以后才能拿到下面的面粉。"},
      {"id":"wsc-10-v3","chinese_text":"橡皮压在卡片上。要把卡片平平整整地拿起来，先把它移到一边。","question":"先把什么移到一边？","choices":["橡皮","卡片"],"answer":"橡皮","explanation":"橡皮压住了卡片。先移开橡皮，卡片就能平整地拿起来。"},
      {"id":"wsc-10-v4","chinese_text":"卡片压在橡皮上。要拿到下面那块橡皮，先把它移到一边。","question":"先把什么移到一边？","choices":["橡皮","卡片"],"answer":"卡片","explanation":"卡片盖住了橡皮。先移开上面的卡片，才能拿到下面的橡皮。"}
    ] },
    { id: "wsc-11", source: "winograd", source_author: "Ernest Davis", category: "pronouns", variants: [
      {"id":"wsc-11-v1","chinese_text":"我把瓶子里的水往杯子里倒，直到它装满为止。","question":"哪个容器装满了？","choices":["瓶子","杯子"],"answer":"杯子","explanation":"水从瓶子流进杯子。杯子里的水越来越多，最后装满了。"},
      {"id":"wsc-11-v2","chinese_text":"我把瓶子里的水往杯子里倒，直到它空了为止。","question":"哪个容器空了？","choices":["瓶子","杯子"],"answer":"瓶子","explanation":"水从瓶子流进杯子。瓶子里的水越来越少，最后空了。"},
      {"id":"wsc-11-v3","chinese_text":"小果把袋子里的积木放进盒子，直到它再也塞不进一块积木。","question":"什么已经塞不进积木了？","choices":["袋子","盒子"],"answer":"盒子","explanation":"积木是从袋子拿出来，放进盒子的。最后放不下积木的是盒子。"},
      {"id":"wsc-11-v4","chinese_text":"小果把袋子里的积木放进盒子，直到她再也不能从它里面拿出积木。","question":"什么已经拿不出积木了？","choices":["袋子","盒子"],"answer":"袋子","explanation":"积木一块块从袋子里拿走。袋子空了，里面就没有积木可拿了。"}
    ] },
    { id: "wsc-12", source: "winograd", source_author: "Ernest Davis", category: "pronouns", variants: [
      {"id":"wsc-12-v1","chinese_text":"小明把自己的解题方法说给小亮听，可他怎么也听不懂。","question":"谁怎么也听不懂？","choices":["小明","小亮"],"answer":"小亮","explanation":"小明在讲自己的方法。小亮在听，听不懂的是小亮。"},
      {"id":"wsc-12-v2","chinese_text":"小明把自己的解题方法说给小亮听，可他怎么也讲不清第二步。","question":"谁怎么也讲不清第二步？","choices":["小明","小亮"],"answer":"小明","explanation":"小明负责讲解自己的方法，讲不清第二步的是小明。"},
      {"id":"wsc-12-v3","chinese_text":"小江教小山折纸飞机，可他学了两遍，还是不会折机头。","question":"谁还是不会折机头？","choices":["小江","小山"],"answer":"小山","explanation":"小江教，小山学。学了两遍还不会折机头的是小山。"},
      {"id":"wsc-12-v4","chinese_text":"小江教小山折纸飞机，可他刚示范折机头时就拿反了纸。","question":"谁把纸拿反了？","choices":["小江","小山"],"answer":"小江","explanation":"小江在教小山折纸飞机，拿着纸做示范的人是小江。"}
    ] },
    { id: "wsc-13", source: "winograd", source_author: "Ernest Davis", category: "pronouns", variants: [
      {"id":"wsc-13-v1","chinese_text":"墙上有一道缝。我把眼睛凑过去，透过它看见了后面的花园。","question":"我是透过什么看见花园的？","choices":["墙缝","墙"],"answer":"墙缝","explanation":"墙会挡住视线。墙上有一条缝，透过这条墙缝就能看见花园。"},
      {"id":"wsc-13-v2","chinese_text":"墙上有一道缝。我把耳朵贴在砖上，隔着它听到了后面花园里的鸟叫声。","question":"“隔着它”里的“它”指什么？","choices":["墙缝","墙"],"answer":"墙","explanation":"墙在我和花园之间。我隔着墙听见了花园里的鸟叫声。"},
      {"id":"wsc-13-v3","chinese_text":"院门开着一条窄缝。小猫从它那里钻进了院子。","question":"小猫从哪里钻进院子？","choices":["门缝","院门"],"answer":"门缝","explanation":"开着的门缝是个空当，小猫能从空当钻过去。"},
      {"id":"wsc-13-v4","chinese_text":"院门开着一条窄缝。小猫没有钻进去，反而把它顶开，才走进院子。","question":"小猫顶开了什么？","choices":["门缝","院门"],"answer":"院门","explanation":"顶开院门能让入口变宽，小猫就能走进院子。"}
    ] },
    { id: "wsc-14", source: "winograd", source_author: "Ernest Davis", category: "pronouns", variants: [
      {"id":"wsc-14-v1","chinese_text":"站里正在播一条通知，正好地铁进站，车轮声很响。我没听清它说了什么。","question":"什么的内容没听清？","choices":["通知","地铁"],"answer":"通知","explanation":"我本来要听的是通知的内容。地铁的声音太响，把通知声盖住了。"},
      {"id":"wsc-14-v2","chinese_text":"站里正在播一条通知，正好地铁进站，它响亮的车轮声盖住了广播。","question":"什么发出了盖住广播的声音？","choices":["通知","地铁"],"answer":"地铁","explanation":"车轮声是进站的地铁发出的，这个声音盖住了广播。"},
      {"id":"wsc-14-v3","chinese_text":"老师正读谜语，窗外的鸟忽然叽叽喳喳叫起来。我只听见它在叫，没听清谜面。","question":"我听见什么在叫？","choices":["鸟","谜语"],"answer":"鸟","explanation":"窗外传来的是鸟叫声。要听的谜语被鸟叫声盖住了。"},
      {"id":"wsc-14-v4","chinese_text":"老师正读谜语，窗外的鸟忽然叽叽喳喳叫起来。等窗外安静了，老师把它重新读了一遍。","question":"什么被重新读了一遍？","choices":["鸟","谜语"],"answer":"谜语","explanation":"老师本来就要读谜语。鸟声停了，老师把谜语重新读了一遍。"}
    ] },
    { id: "wsc-15", source: "winograd", source_author: "Ernest Davis", category: "pronouns", variants: [
      {"id":"wsc-15-v1","chinese_text":"露天音乐会开到一半，下起了雨，可它照常进行，一直到晚上十点。","question":"什么照常进行到晚上十点？","choices":["音乐会","雨"],"answer":"音乐会","explanation":"音乐会开始在先，中途遇到了下雨。照常进行的是台上的音乐会。"},
      {"id":"wsc-15-v2","chinese_text":"露天音乐会开到一半，下起了雨。音乐会散场后，它仍然没停。","question":"什么在散场后仍然没停？","choices":["音乐会","雨"],"answer":"雨","explanation":"音乐会散场，说明音乐会已经结束了。还没停的是雨。"},
      {"id":"wsc-15-v3","chinese_text":"班级接力赛跑到一半，操场上刮起了风。好在它没中断，大家顺利跑完了。","question":"什么没有因刮风中断？","choices":["接力赛","风"],"answer":"接力赛","explanation":"大家顺利跑完，说明接力赛虽然遇到大风，还是办完了。"},
      {"id":"wsc-15-v4","chinese_text":"班级接力赛跑到一半，操场上刮起了风。最后一棒到终点后，它还把跑道边的叶子吹得满地滚。","question":"什么还在吹动叶子？","choices":["接力赛","风"],"answer":"风","explanation":"最后一棒跑完，接力赛已经结束。还能吹动叶子的是风。"}
    ] },
    { id: "wsc-16", source: "winograd", source_author: "Ernest Davis", category: "pronouns", variants: [
      {"id":"wsc-16-v1","chinese_text":"小安问小美图书馆几点关门，因为她记不清时间了。","question":"谁记不清关门时间，才去问别人？","choices":["小安","小美"],"answer":"小安","explanation":"小安问别人关门时间，是因为自己记不清了。"},
      {"id":"wsc-16-v2","chinese_text":"小安问小美图书馆几点关门，可她也记不清，没能给小安一个准话。","question":"谁没能给出准确的关门时间？","choices":["小安","小美"],"answer":"小美","explanation":"小安向小美提问，需要给出时间的是小美。小美也记不清。"},
      {"id":"wsc-16-v3","chinese_text":"小林问小柏作业写在哪一页，因为他没来得及记下老师说的页码。","question":"谁没来得及记下页码，才开口询问？","choices":["小林","小柏"],"answer":"小林","explanation":"小林去问写在哪一页，是因为自己没有记下老师说的页码。"},
      {"id":"wsc-16-v4","chinese_text":"小林问小柏作业写在哪一页，可他没听清老师的话，也没能告诉小林。","question":"谁也没能告诉小林作业在哪一页？","choices":["小林","小柏"],"answer":"小柏","explanation":"小林向小柏问作业页码。小柏没听清老师说的话，所以也答不上来。"}
    ] },
    { id: "wsc-17", source: "winograd", source_author: "Ernest Davis", category: "pronouns", variants: [
      {"id":"wsc-17-v1","chinese_text":"我把水瓶从书包里拿了出来，这样它就轻一些了，背起来也省力。","question":"什么变轻了？","choices":["水瓶","书包"],"answer":"书包","explanation":"书包里少了一个水瓶，背着它就轻一些了。"},
      {"id":"wsc-17-v2","chinese_text":"我把水瓶从书包里拿了出来，这样口渴的时候，一伸手就能拿起它。","question":"口渴时能顺手拿起什么？","choices":["水瓶","书包"],"answer":"水瓶","explanation":"水瓶拿到书包外，喝水时就不用再翻书包。"},
      {"id":"wsc-17-v3","chinese_text":"我把厚厚的字典从抽屉里拿了出来，这样它就能顺利关上了。","question":"什么能顺利关上了？","choices":["字典","抽屉"],"answer":"抽屉","explanation":"厚字典取走以后，不会再卡住抽屉，抽屉就能推回去了。"},
      {"id":"wsc-17-v4","chinese_text":"我把厚厚的字典从抽屉里拿出来放在桌上了。查字时，一伸手就能翻开它。","question":"查字时一伸手就能翻开什么？","choices":["字典","抽屉"],"answer":"字典","explanation":"查字要翻的是字典。把字典拿出来放在桌上，翻起来就方便了。"}
    ] },
    { id: "wsc-18", source: "winograd", source_author: "Ernest Davis", category: "pronouns", variants: [
      {"id":"wsc-18-v1","chinese_text":"我想把花盆放到架子上，可我踮起脚也够不到架板。它太高了。","question":"什么太高，踮脚也够不着？","choices":["花盆","架子"],"answer":"架子","explanation":"要够到的是架板。架子太高，踮起脚也够不到放花盆的位置。"},
      {"id":"wsc-18-v2","chinese_text":"我够得着架板，可花盆一放上去，就顶住了上面那层架板。它太高了。","question":"什么太高，顶到了上面那层架板？","choices":["花盆","架子"],"answer":"花盆","explanation":"花盆太高，放在两层架板之间时，就会顶住上层架板。"},
      {"id":"wsc-18-v3","chinese_text":"我想把闹钟放在柜子顶上，可手举到最高也够不着柜顶。它太高了。","question":"什么太高，我够不着顶？","choices":["闹钟","柜子"],"answer":"柜子","explanation":"放闹钟的位置在柜子顶上。够不到柜顶，说明柜子太高。"},
      {"id":"wsc-18-v4","chinese_text":"我想把小闹钟放进柜子的一格里，可刚往里推了一点，上面的铃就卡住了。它太高了。","question":"什么太高，推进去时卡住了？","choices":["闹钟","柜子"],"answer":"闹钟","explanation":"上面的铃属于闹钟。这个闹钟太高，推进柜格时铃就卡住了。"}
    ] },
    { id: "wsc-19", source: "winograd", source_author: "Ernest Davis", category: "pronouns", variants: [
      {"id":"wsc-19-v1","chinese_text":"夏天的下午，小狗原先坐在草地中间，过了一会儿跑到树底下，因为那里更凉快。","question":"更凉快的“那里”是哪里？","choices":["草地中间","树底下"],"answer":"树底下","explanation":"小狗为了凉快，从草地中间换到了树底下。那里指它新去的地方。"},
      {"id":"wsc-19-v2","chinese_text":"夏天的下午，小狗原先坐在草地中间，过了一会儿跑到树底下，因为那里晒得它直吐舌头。","question":"晒得小狗直吐舌头的“那里”是哪里？","choices":["草地中间","树底下"],"answer":"草地中间","explanation":"小狗离开原先坐的地方去躲太阳。晒得它直吐舌头的是草地中间。"},
      {"id":"wsc-19-v3","chinese_text":"小鱼原先待在浅水边，太阳越晒越热，它游到了深水处，因为那里水更凉。","question":"水更凉的地方是哪里？","choices":["浅水边","深水处"],"answer":"深水处","explanation":"小鱼是往更凉的地方游的。它最后去了深水处。"},
      {"id":"wsc-19-v4","chinese_text":"小鱼原先待在浅水边，后来游到了深水处，因为那里的水快被太阳晒热了。","question":"快被太阳晒热的地方是哪里？","choices":["浅水边","深水处"],"answer":"浅水边","explanation":"小鱼为了躲开快被晒热的水，才从原先的浅水边游走。"}
    ] },
    { id: "wsc-20", source: "winograd", source_author: "Ernest Davis", category: "pronouns", variants: [
      {"id":"wsc-20-v1","chinese_text":"鱼把小虫一口吞了，觉得它味道不错。","question":"“它味道不错”指什么？","choices":["鱼","小虫"],"answer":"小虫","explanation":"鱼尝到的是被吃掉的小虫，觉得味道不错的是这只小虫。"},
      {"id":"wsc-20-v2","chinese_text":"鱼把小虫一口吞了，因为它饿坏了。","question":"饿坏的是谁？","choices":["鱼","小虫"],"answer":"鱼","explanation":"鱼饿了，才把小虫一口吃掉。饿坏的是吃东西的鱼。"},
      {"id":"wsc-20-v3","chinese_text":"小鸟找到一颗红果子，把它吃了下去。它甜甜的，还有一点儿酸。","question":"什么甜甜的，还有一点儿酸？","choices":["小鸟","红果子"],"answer":"红果子","explanation":"小鸟吃下的是红果子。甜和酸都是它尝到的果子味道。"},
      {"id":"wsc-20-v4","chinese_text":"小鸟找到一颗红果子，一口就吃了下去。它找了半天吃的，终于填了填肚子。","question":"谁找了半天吃的？","choices":["小鸟","红果子"],"answer":"小鸟","explanation":"小鸟找果子吃来填肚子。红果子是它找到的食物。"}
    ] },
    { id: "wsc-21", source: "winograd", source_author: "Ernest Davis", category: "pronouns", variants: [
      {"id":"wsc-21-v1","chinese_text":"小狗追着小猫跑，小猫一溜烟爬上了树。它在树下守着，等对方下来。","question":"谁在树下等？","choices":["小狗","小猫"],"answer":"小狗","explanation":"小猫已经爬上了树。在树下等它下来的是小狗。"},
      {"id":"wsc-21-v2","chinese_text":"小狗追着小猫跑，小猫一溜烟爬上了树。它躲在树梢，等对方走开。","question":"谁在树梢等？","choices":["小狗","小猫"],"answer":"小猫","explanation":"爬上树的是小猫。它躲在树梢，等地上的小狗走开。"},
      {"id":"wsc-21-v3","chinese_text":"小鸡跟着鸭妈妈走到池边，鸭妈妈先跳下了水。它浮在水面上，等对方赶上来。","question":"谁在水面上等？","choices":["鸭妈妈","小鸡"],"answer":"鸭妈妈","explanation":"鸭妈妈先下了水，因此等在水面上的是鸭妈妈。"},
      {"id":"wsc-21-v4","chinese_text":"小鸡跟着鸭妈妈走到池边，鸭妈妈先跳下了水。它站在岸上等，直到对方游回来。","question":"谁在岸上等？","choices":["鸭妈妈","小鸡"],"answer":"小鸡","explanation":"鸭妈妈已经下水。站在岸上等它回来的是小鸡。"}
    ] },
    { id: "wsc-22", source: "winograd", source_author: "Ernest Davis", category: "pronouns", variants: [
      {"id":"wsc-22-v1","chinese_text":"小山把椅子搬到钢琴前，可它坏了，小山只好站着弹琴。","question":"什么坏了？","choices":["椅子","钢琴"],"answer":"椅子","explanation":"小山还能弹琴，只是得站着弹。坏掉的是原本用来坐的椅子。"},
      {"id":"wsc-22-v2","chinese_text":"小山把椅子搬到钢琴前，可它坏了，小山只好坐在椅子上唱歌。","question":"什么坏了？","choices":["椅子","钢琴"],"answer":"钢琴","explanation":"椅子还能坐。小山改唱歌，是因为钢琴坏了，不能弹。"},
      {"id":"wsc-22-v3","chinese_text":"小满把画板放上画架。它的一条腿松了，小满只好把画板平放在桌上画。","question":"什么的一条腿松了？","choices":["画架","画板"],"answer":"画架","explanation":"画架的腿松了，撑不稳画板，所以小满改用桌子托住画板。"},
      {"id":"wsc-22-v4","chinese_text":"小满把画板放上画架。它从中间裂开了，小满只好从架上把它取下来，换一块新的。","question":"什么从中间裂开了？","choices":["画架","画板"],"answer":"画板","explanation":"架子上放的是画板。裂开的画板可以从架上取下来，换一块新的。"}
    ] },
    { id: "wsc-23", source: "winograd", source_author: "Ernest Davis", category: "pronouns", variants: [
      {"id":"wsc-23-v1","chinese_text":"小杰在海边堆了一座沙堡，在最高处插了一面玩具旗。海水冲过来，把它冲成了一摊沙。","question":"什么被冲成了一摊沙？","choices":["沙堡","玩具旗"],"answer":"沙堡","explanation":"沙堡是用沙子堆成的。被海水冲散，变成了一摊沙的是沙堡。"},
      {"id":"wsc-23-v2","chinese_text":"小杰在海边堆了一座沙堡，在最高处插了一面玩具旗。一阵风把它从堡顶吹到了地上。","question":"什么从堡顶被吹到了地上？","choices":["沙堡","玩具旗"],"answer":"玩具旗","explanation":"堡顶插着的是玩具旗。风把玩具旗从沙堡顶上吹掉了。"},
      {"id":"wsc-23-v3","chinese_text":"小芊在泥桥旁立了一块小木牌。一场大雨过后，它塌成了一堆泥，木牌还好好地立着。","question":"什么塌成了一堆泥？","choices":["泥桥","小木牌"],"answer":"泥桥","explanation":"泥桥是用泥做的，被雨淋坏后变成了一堆泥。木牌仍然立着。"},
      {"id":"wsc-23-v4","chinese_text":"小芊在泥桥旁立了一块小木牌。一场大雨过后，它倒了，写字的那一面沾满了泥。","question":"什么倒了，写字的那一面沾满了泥？","choices":["泥桥","小木牌"],"answer":"小木牌","explanation":"有字的一面是小木牌的一面。小木牌倒下后沾满了泥。"}
    ] },
    { id: "wsc-24", source: "winograd", source_author: "Ernest Davis", category: "pronouns", variants: [
      {"id":"wsc-24-v1","chinese_text":"小月敲小雨家的门，没人答应。邻居说：“她一早出门了，家里没人。”","question":"邻居说谁一早出门了？","choices":["小月","小雨"],"answer":"小雨","explanation":"邻居在解释这户人家为什么没人开门，说的是住在这里的小雨。"},
      {"id":"wsc-24-v2","chinese_text":"小月敲小雨家的门，没人答应。她还想给小雨看自己的画呢，只好失望地回家了。","question":"谁失望地回家了？","choices":["小月","小雨"],"answer":"小月","explanation":"小月是带画来敲门的人。等不到人开门，她只好带着画回家。"},
      {"id":"wsc-24-v3","chinese_text":"小东和小河约好在长椅边换书。小东到了，只看见管理员叔叔。叔叔说：“和你换书的人刚来过。他把书忘在家里，回去拿了。”","question":"谁回家拿书了？","choices":["小东","小河"],"answer":"小河","explanation":"小东已经到了长椅这里。叔叔解释的是小河去哪儿了：他回家拿书了。"},
      {"id":"wsc-24-v4","chinese_text":"小东带书来找小河换书，却没在约好的长椅见到小河。他抱着书坐下来，打算等对方来。","question":"谁抱着书坐在长椅上等？","choices":["小东","小河"],"answer":"小东","explanation":"小东到达长椅却没找到小河，正在长椅上等的人是小东。"}
    ] },
    { id: "wsc-25", source: "winograd", source_author: "Ernest Davis", category: "pronouns", variants: [
      {"id":"wsc-25-v1","chinese_text":"去湖边的小路被倒下的树挡住了。它不能通行了，我们得换条路。","question":"什么不能通行了？","choices":["小路","湖"],"answer":"小路","explanation":"倒下的树挡住的是小路。原来的小路不能走，就得换路。"},
      {"id":"wsc-25-v2","chinese_text":"去湖边的小路被倒下的树挡住了。我们找不到别的路去那里，只好回家。","question":"没能到达的“那里”是哪儿？","choices":["小路","湖边"],"answer":"湖边","explanation":"原本想去的地方是湖边。小路被堵，找不到别的路就到不了湖边。"},
      {"id":"wsc-25-v3","chinese_text":"去花圃的小桥正在修。它还没有修好，现在不能从上面走。","question":"什么还没有修好？","choices":["小桥","花圃"],"answer":"小桥","explanation":"正在修的是通往花圃的小桥。小桥还没修好，就不能从桥上走。"},
      {"id":"wsc-25-v4","chinese_text":"去花圃的小桥正在修，没有别的路。我们不能去那里看花了。","question":"不能去的“那里”是哪儿？","choices":["小桥","花圃"],"answer":"花圃","explanation":"花开在花圃。过不了桥，就到不了花圃看花。"}
    ] },
    { id: "wsc-26", source: "winograd", source_author: "Ernest Davis", category: "pronouns", variants: [
      {"id":"wsc-26-v1","chinese_text":"太阳被厚厚的云挡了一上午。野餐开始时，它终于又出来了，把草地照得亮亮的。","question":"什么出来后照亮了草地？","choices":["太阳","云"],"answer":"太阳","explanation":"太阳本来被云挡住。现在太阳露出来，阳光把草地照亮了。"},
      {"id":"wsc-26-v2","chinese_text":"太阳被厚厚的云挡了一上午。野餐开始时，它终于飘走了，太阳照亮了草地。","question":"什么飘走了？","choices":["太阳","云"],"answer":"云","explanation":"挡住太阳的是云。云飘走了，阳光才能照到草地上。"},
      {"id":"wsc-26-v3","chinese_text":"月亮被云挡住了。风吹了一阵，它才重新把银白的光洒在小路上。","question":"什么重新照亮了小路？","choices":["月亮","云"],"answer":"月亮","explanation":"银白的光来自月亮。风吹开云，月光才又照到小路上。"},
      {"id":"wsc-26-v4","chinese_text":"月亮被云挡住了。风一吹，它被吹散了，地上的月光也亮了起来。","question":"什么被风吹散了？","choices":["月亮","云"],"answer":"云","explanation":"被风吹散的是云。少了云的遮挡，地上的月光就更亮了。"}
    ] },
    { id: "wsc-27", source: "winograd", source_author: "Ernest Davis", category: "pronouns", variants: [
      {"id":"wsc-27-v1","chinese_text":"风沙吹来，小飞用双手捂住眼睛。风停了，他慢慢睁开了它们。","question":"小飞睁开了什么？","choices":["眼睛","双手"],"answer":"眼睛","explanation":"“睁开”说的是原本闭着的眼睛。双手是用来挡沙的。"},
      {"id":"wsc-27-v2","chinese_text":"风沙吹来，小飞用双手捂住眼睛。风停了，他把它们垂到了身体两边。","question":"小飞把什么垂到了身体两边？","choices":["眼睛","双手"],"answer":"双手","explanation":"小飞不用再挡风沙，就把捂在眼睛前的双手垂下来。"},
      {"id":"wsc-27-v3","chinese_text":"外面太吵，小虹用双手捂住耳朵。等安静下来，她把它们从耳边放下来，塞进衣兜。","question":"小虹把什么收进了衣兜？","choices":["双手","耳朵"],"answer":"双手","explanation":"小虹的双手一直捂着耳朵。拿开双手以后，她就能把手收进衣兜。"},
      {"id":"wsc-27-v4","chinese_text":"外面太吵，小虹用双手捂住耳朵。等安静下来，她松开手，发现它们还在嗡嗡响。","question":"什么还是嗡嗡响？","choices":["双手","耳朵"],"answer":"耳朵","explanation":"声音太响，耳朵可能还感觉有嗡嗡声。捂耳朵的双手已经松开。"}
    ] },
    { id: "wsc-28", source: "winograd", source_author: "Ernest Davis", category: "pronouns", variants: [
      {"id":"wsc-28-v1","chinese_text":"大家都喜欢燕麦饼干，只有几个人喜欢巧克力饼干。下次应该多做点，让想吃它们的人都能分到。","question":"下次应该多做哪种饼干？","choices":["燕麦饼干","巧克力饼干"],"answer":"燕麦饼干","explanation":"想吃燕麦饼干的人多。下次把燕麦饼干做多些，大家才更容易分到。"},
      {"id":"wsc-28-v2","chinese_text":"大家都喜欢燕麦饼干，只有几个人喜欢巧克力饼干。下次应该少做点，免得盘里又剩下它们。","question":"下次应该少做哪种饼干？","choices":["燕麦饼干","巧克力饼干"],"answer":"巧克力饼干","explanation":"喜欢巧克力饼干的人少，盘里容易剩下，所以可以少做一些。"},
      {"id":"wsc-28-v3","chinese_text":"书架上的童话书被借完了，谜语书还剩很多。还有孩子排队等着借刚借完的书。老师打算再添几本，让他们也能借到。","question":"老师打算再添哪种书？","choices":["童话书","谜语书"],"answer":"童话书","explanation":"童话书已经被借完了，还有孩子在等。再添童话书，等待的孩子也能借到。"},
      {"id":"wsc-28-v4","chinese_text":"书架上的童话书很快就被借完了，谜语书还有很多没被借走。老师打算先把它们收起几本，给其他书腾位置。","question":"老师要先收起哪种书？","choices":["童话书","谜语书"],"answer":"谜语书","explanation":"童话书全被借走了，书架上还有没借出的谜语书。收起几本谜语书，可以腾出位置。"}
    ] },
    { id: "wsc-29", source: "winograd", source_author: "David Bender", category: "pronouns", variants: [
      {"id":"wsc-29-v1","chinese_text":"小丹和小彬约好，谁先喊“我要前排”谁就坐前排。后来小丹坐在后排，小彬坐在前排。他先喊出了那句话。","question":"谁先喊了“我要前排”？","choices":["小丹","小彬"],"answer":"小彬","explanation":"规则是先喊的人坐前排。小彬坐到了前排，所以他先喊。"},
      {"id":"wsc-29-v2","chinese_text":"小丹和小彬约好，谁先喊“我要前排”谁就坐前排。后来小丹坐在后排，小彬坐在前排。他喊慢了一拍。","question":"谁喊慢了一拍？","choices":["小丹","小彬"],"answer":"小丹","explanation":"小彬坐前排，表示他先喊。没有抢到前排的小丹喊慢了一拍。"},
      {"id":"wsc-29-v3","chinese_text":"小彩和小晴都想选紫色彩纸。她们说好谁先举手谁先选。最后小彩拿到了那张紫色彩纸，因为她举手更快。","question":"谁先举手？","choices":["小晴","小彩"],"answer":"小彩","explanation":"先举手就能先选。两人都想要紫色，小彩选到了，说明她先举手。"},
      {"id":"wsc-29-v4","chinese_text":"小彩和小晴都想选紫色彩纸。她们说好谁先举手谁先选。最后小彩先选，拿到了紫色彩纸。另一个人举手慢了一拍。","question":"谁举手慢了一拍？","choices":["小晴","小彩"],"answer":"小晴","explanation":"小彩挑到了两人都想要的彩纸，说明小彩先举手。小晴举手慢了一拍。"}
    ] },
    { id: "wsc-30", source: "winograd", source_author: "David Bender", category: "pronouns", variants: [
      {"id":"wsc-30-v1","chinese_text":"小亮把游戏机交给小华，因为他那一轮刚玩完。","question":"谁刚玩完这一轮？","choices":["小亮","小华"],"answer":"小亮","explanation":"交出游戏机的是小亮。他玩完了这一轮，就把游戏机递给下一位。"},
      {"id":"wsc-30-v2","chinese_text":"小亮把游戏机交给小华，因为接下来轮到他玩了。","question":"接下来轮到谁玩？","choices":["小亮","小华"],"answer":"小华","explanation":"小亮把游戏机递给小华。接到游戏机的小华要开始下一轮。"},
      {"id":"wsc-30-v3","chinese_text":"小兰把棋盒推到小青面前，她刚把用过的棋子收回盒里。下一盘换个人摆棋。","question":"谁刚把用过的棋子收回盒里？","choices":["小兰","小青"],"answer":"小兰","explanation":"小兰收完自己刚用过的棋子，把棋盒推给接下来要摆棋的小青。"},
      {"id":"wsc-30-v4","chinese_text":"小兰把棋盒推到小青面前，说：“该你来摆棋了。”她要打开棋盒，摆好棋子，开始下一盘。","question":"谁要打开棋盒摆棋子？","choices":["小兰","小青"],"answer":"小青","explanation":"棋盒被推到了小青面前，接下来要用棋盒摆棋子的是小青。"}
    ] },
    { id: "babi-01", source: "babi", source_author: "Jason Weston、Antoine Bordes、Sumit Chopra、Alexander M. Rush、Bart van Merriënboer、Armand Joulin、Tomas Mikolov", category: "facts", variants: [
      {"id":"babi-01-v1","chinese_text":"小雨拿起牛奶。小明去了卧室，小兰回到厨房。小雨去了走廊。","question":"现在，牛奶在哪里？","choices":["厨房","走廊","卧室"],"answer":"走廊","explanation":"拿着牛奶的小雨去了走廊，牛奶也到了走廊。"},
      {"id":"babi-01-v2","chinese_text":"小雨在教室放下水杯，自己去了图书角。小明这时去了操场。","question":"现在，水杯在哪里？","choices":["教室","图书角","操场"],"answer":"教室","explanation":"小雨走的时候把水杯留在了教室，所以水杯还在教室。"},
      {"id":"babi-01-v3","chinese_text":"小雨在教室把水杯交给小明。小雨去了图书角，小明带着水杯去了操场。","question":"现在，水杯在哪里？","choices":["教室","图书角","操场"],"answer":"操场","explanation":"水杯已经交给小明。小明带着它去了操场。"},
      {"id":"babi-01-v4","chinese_text":"小雨把水杯留在教室，到操场等。小明拿起水杯去了图书角。","question":"现在，水杯在哪里？","choices":["操场","图书角","教室"],"answer":"图书角","explanation":"水杯先留在教室，后来被小明带到图书角。"}
    ] },
    { id: "babi-02", source: "babi", source_author: "Jason Weston、Antoine Bordes、Sumit Chopra、Alexander M. Rush、Bart van Merriënboer、Armand Joulin、Tomas Mikolov", category: "facts", variants: [
      {"id":"babi-02-v1","chinese_text":"小雨去了洗手间。小兰和小东先后到了花园。小东又去了办公室。小兰拿起牛奶，接着放下了。","question":"现在，牛奶在哪里？","choices":["花园","洗手间","办公室"],"answer":"花园","explanation":"小兰在花园放下牛奶，所以牛奶留在花园。"},
      {"id":"babi-02-v2","chinese_text":"小兰在美术教室放下画纸，自己去了走廊。小东这时去了办公室。","question":"现在，画纸在哪里？","choices":["走廊","办公室","美术教室"],"answer":"美术教室","explanation":"小兰走的时候把画纸留在了美术教室，所以画纸还在美术教室。"},
      {"id":"babi-02-v3","chinese_text":"小兰在美术教室把画纸交给小东。小兰去了走廊，小东带着画纸去了办公室。","question":"现在，画纸在哪里？","choices":["走廊","办公室","美术教室"],"answer":"办公室","explanation":"画纸已经交给小东。小东带着它去了办公室。"},
      {"id":"babi-02-v4","chinese_text":"小兰把画纸留在美术教室，到办公室等。小东拿起画纸去了走廊。","question":"现在，画纸在哪里？","choices":["走廊","美术教室","办公室"],"answer":"走廊","explanation":"画纸先留在美术教室，后来被小东带到走廊。"}
    ] },
    { id: "babi-03", source: "babi", source_author: "Jason Weston、Antoine Bordes、Sumit Chopra、Alexander M. Rush、Bart van Merriënboer、Armand Joulin、Tomas Mikolov", category: "facts", variants: [
      {"id":"babi-03-v1","chinese_text":"小雨拿起苹果，又放下。小东回到花园。小雨去了办公室。小明拿起足球。小雨回到厨房，小东拿起牛奶。小明最后去了卧室。","question":"现在，足球在哪里？","choices":["花园","卧室","厨房"],"answer":"卧室","explanation":"小明拿起足球后去了卧室，足球跟着他到了卧室。"},
      {"id":"babi-03-v2","chinese_text":"小明在器材室放下足球，自己去了操场。小雨这时去了教室。","question":"现在，足球在哪里？","choices":["器材室","操场","教室"],"answer":"器材室","explanation":"小明走的时候把足球留在了器材室，所以足球还在器材室。"},
      {"id":"babi-03-v3","chinese_text":"小明在器材室把足球交给小雨。小明去了操场，小雨带着足球去了教室。","question":"现在，足球在哪里？","choices":["器材室","操场","教室"],"answer":"教室","explanation":"足球已经交给小雨。小雨带着它去了教室。"},
      {"id":"babi-03-v4","chinese_text":"小明把足球留在器材室，到教室等。小雨拿起足球去了操场。","question":"现在，足球在哪里？","choices":["教室","操场","器材室"],"answer":"操场","explanation":"足球先留在器材室，后来被小雨带到操场。"}
    ] },
    { id: "babi-04", source: "babi", source_author: "Jason Weston、Antoine Bordes、Sumit Chopra、Alexander M. Rush、Bart van Merriënboer、Armand Joulin、Tomas Mikolov", category: "facts", variants: [
      {"id":"babi-04-v1","chinese_text":"小东去了花园。小兰回到卧室，小明也去了卧室。小兰拿起苹果。小东去了厨房。小兰放下苹果。","question":"现在，苹果在哪里？","choices":["卧室","花园","厨房"],"answer":"卧室","explanation":"小兰在卧室拿起又放下苹果，所以苹果还在卧室。"},
      {"id":"babi-04-v2","chinese_text":"小兰在书房放下苹果，自己去了客厅。小东这时去了卧室。","question":"现在，苹果在哪里？","choices":["客厅","卧室","书房"],"answer":"书房","explanation":"小兰走的时候把苹果留在了书房，所以苹果还在书房。"},
      {"id":"babi-04-v3","chinese_text":"小兰在书房把苹果交给小东。小兰去了客厅，小东带着苹果去了卧室。","question":"现在，苹果在哪里？","choices":["客厅","卧室","书房"],"answer":"卧室","explanation":"苹果已经交给小东。小东带着它去了卧室。"},
      {"id":"babi-04-v4","chinese_text":"小兰把苹果留在书房，到卧室等。小东拿起苹果去了客厅。","question":"现在，苹果在哪里？","choices":["客厅","书房","卧室"],"answer":"客厅","explanation":"苹果先留在书房，后来被小东带到客厅。"}
    ] },
    { id: "babi-05", source: "babi", source_author: "Jason Weston、Antoine Bordes、Sumit Chopra、Alexander M. Rush、Bart van Merriënboer、Armand Joulin、Tomas Mikolov", category: "facts", variants: [
      {"id":"babi-05-v1","chinese_text":"小东进了厨房。小明拿起足球，又把它放下。小雨去了走廊。小明又拿起牛奶，接着来到厨房。","question":"现在，牛奶在哪里？","choices":["走廊","卧室","厨房"],"answer":"厨房","explanation":"小明拿着牛奶来到厨房，牛奶跟着小明走。"},
      {"id":"babi-05-v2","chinese_text":"小明在厨房放下面包，自己去了餐厅。小兰这时去了客厅。","question":"现在，面包在哪里？","choices":["客厅","厨房","餐厅"],"answer":"厨房","explanation":"小明走的时候把面包留在了厨房，所以面包还在厨房。"},
      {"id":"babi-05-v3","chinese_text":"小明在厨房把面包交给小兰。小明去了餐厅，小兰带着面包去了客厅。","question":"现在，面包在哪里？","choices":["客厅","厨房","餐厅"],"answer":"客厅","explanation":"面包已经交给小兰。小兰带着它去了客厅。"},
      {"id":"babi-05-v4","chinese_text":"小明把面包留在厨房，到客厅等。小兰拿起面包去了餐厅。","question":"现在，面包在哪里？","choices":["厨房","客厅","餐厅"],"answer":"餐厅","explanation":"面包先留在厨房，后来被小兰带到餐厅。"}
    ] },
    { id: "babi-06", source: "babi", source_author: "Jason Weston、Antoine Bordes、Sumit Chopra、Alexander M. Rush、Bart van Merriënboer、Armand Joulin、Tomas Mikolov", category: "facts", variants: [
      {"id":"babi-06-v1","chinese_text":"小东拿起牛奶。小明去了花园。小东先到走廊，再到洗手间。","question":"现在，牛奶在哪里？","choices":["洗手间","花园","走廊"],"answer":"洗手间","explanation":"小东拿着牛奶先到走廊，最后到洗手间，所以牛奶也在洗手间。"},
      {"id":"babi-06-v2","chinese_text":"小东在卧室放下玩具车，自己去了阳台。小明这时去了客厅。","question":"现在，玩具车在哪里？","choices":["阳台","客厅","卧室"],"answer":"卧室","explanation":"小东走的时候把玩具车留在了卧室，所以玩具车还在卧室。"},
      {"id":"babi-06-v3","chinese_text":"小东在卧室把玩具车交给小明。小东去了阳台，小明带着玩具车去了客厅。","question":"现在，玩具车在哪里？","choices":["阳台","客厅","卧室"],"answer":"客厅","explanation":"玩具车已经交给小明。小明带着它去了客厅。"},
      {"id":"babi-06-v4","chinese_text":"小东把玩具车留在卧室，到客厅等。小明拿起玩具车去了阳台。","question":"现在，玩具车在哪里？","choices":["阳台","卧室","客厅"],"answer":"阳台","explanation":"玩具车先留在卧室，后来被小明带到阳台。"}
    ] },
    { id: "babi-07", source: "babi", source_author: "Jason Weston、Antoine Bordes、Sumit Chopra、Alexander M. Rush、Bart van Merriënboer、Armand Joulin、Tomas Mikolov", category: "facts", variants: [
      {"id":"babi-07-v1","chinese_text":"小雨拿起足球，又把球放下。她重新拿起球。小明去了厨房。小雨先去了办公室，再去了走廊。","question":"到走廊之前，足球最后在哪里？","choices":["厨房","走廊","办公室"],"answer":"办公室","explanation":"小雨带着足球先到办公室，之后才去走廊。"},
      {"id":"babi-07-v2","chinese_text":"小雨在美术教室拿起画夹，先到了楼梯口，再到了操场，最后带它到了图书室。","question":"到图书室之前，画夹最后在哪里？","choices":["楼梯口","操场","美术教室"],"answer":"操场","explanation":"画夹先到了楼梯口，又到了操场，然后才到图书室。"},
      {"id":"babi-07-v3","chinese_text":"小雨从美术教室带画夹到楼梯口，把它留在那里。小雨自己去了操场。后来小明从楼梯口取走画夹，带到图书室。","question":"到图书室之前，画夹最后在哪里？","choices":["楼梯口","美术教室","操场"],"answer":"楼梯口","explanation":"画夹一直留在楼梯口，直到小明把它从那里带走。"},
      {"id":"babi-07-v4","chinese_text":"小雨在操场拿到画夹，去美术教室交给小明。小明带着画夹去了图书室。后来小雨去了楼梯口。","question":"到图书室之前，画夹最后在哪里？","choices":["楼梯口","操场","美术教室"],"answer":"美术教室","explanation":"小明在美术教室接过画夹后直接去了图书室，所以前一站是美术教室。"}
    ] },
    { id: "babi-08", source: "babi", source_author: "Jason Weston、Antoine Bordes、Sumit Chopra、Alexander M. Rush、Bart van Merriënboer、Armand Joulin、Tomas Mikolov", category: "facts", variants: [
      {"id":"babi-08-v1","chinese_text":"小雨把牛奶放在办公室，又拿起来。她走到厨房，后来回到办公室，在那里放下牛奶。","question":"最后一次到办公室之前，牛奶在哪里？","choices":["花园","厨房","办公室"],"answer":"厨房","explanation":"小雨最后一次带牛奶进办公室之前，先带它去了厨房。"},
      {"id":"babi-08-v2","chinese_text":"小兰在厨房拿起饼干盒，先到了餐厅，再到了客厅，最后带它到了阳台。","question":"到阳台之前，饼干盒最后在哪里？","choices":["客厅","厨房","餐厅"],"answer":"客厅","explanation":"饼干盒先到了餐厅，又到了客厅，然后才到阳台。"},
      {"id":"babi-08-v3","chinese_text":"小兰从厨房带饼干盒到餐厅，把它留在那里。小兰自己去了客厅。后来小东从餐厅取走饼干盒，带到阳台。","question":"到阳台之前，饼干盒最后在哪里？","choices":["厨房","客厅","餐厅"],"answer":"餐厅","explanation":"饼干盒一直留在餐厅，直到小东把它从那里带走。"},
      {"id":"babi-08-v4","chinese_text":"小兰在客厅拿到饼干盒，去厨房交给小东。小东带着饼干盒去了阳台。后来小兰去了餐厅。","question":"到阳台之前，饼干盒最后在哪里？","choices":["客厅","厨房","餐厅"],"answer":"厨房","explanation":"小东在厨房接过饼干盒后直接去了阳台，所以前一站是厨房。"}
    ] },
    { id: "babi-09", source: "babi", source_author: "Jason Weston、Antoine Bordes、Sumit Chopra、Alexander M. Rush、Bart van Merriënboer、Armand Joulin、Tomas Mikolov", category: "facts", variants: [
      {"id":"babi-09-v1","chinese_text":"小雨去了花园。小东拿起足球，到了走廊。小明去了洗手间。接着，小东也去了洗手间。","question":"到洗手间之前，足球最后在哪里？","choices":["花园","洗手间","走廊"],"answer":"走廊","explanation":"小东带着足球先到走廊，再进洗手间。"},
      {"id":"babi-09-v2","chinese_text":"小东在教室拿起跳绳，先到了走廊，再到了器材室，最后带它到了操场。","question":"到操场之前，跳绳最后在哪里？","choices":["走廊","器材室","教室"],"answer":"器材室","explanation":"跳绳先到了走廊，又到了器材室，然后才到操场。"},
      {"id":"babi-09-v3","chinese_text":"小东从教室带跳绳到走廊，把它留在那里。小东自己去了器材室。后来小雨从走廊取走跳绳，带到操场。","question":"到操场之前，跳绳最后在哪里？","choices":["走廊","教室","器材室"],"answer":"走廊","explanation":"跳绳一直留在走廊，直到小雨把它从那里带走。"},
      {"id":"babi-09-v4","chinese_text":"小东在器材室拿到跳绳，去教室交给小雨。小雨带着跳绳去了操场。后来小东去了走廊。","question":"到操场之前，跳绳最后在哪里？","choices":["走廊","器材室","教室"],"answer":"教室","explanation":"小雨在教室接过跳绳后直接去了操场，所以前一站是教室。"}
    ] },
    { id: "babi-10", source: "babi", source_author: "Jason Weston、Antoine Bordes、Sumit Chopra、Alexander M. Rush、Bart van Merriënboer、Armand Joulin、Tomas Mikolov", category: "facts", variants: [
      {"id":"babi-10-v1","chinese_text":"小兰拿起苹果，先去了卧室，再回到花园。到了花园，她还拿起一个足球，后来把苹果放下。","question":"到花园之前，苹果最后在哪里？","choices":["厨房","卧室","花园"],"answer":"卧室","explanation":"小兰带着苹果从卧室回到了花园，后来才把苹果放下。"},
      {"id":"babi-10-v2","chinese_text":"小兰在树下拿起苹果，先到了长椅旁，再到了亭子里，最后带它到了大门口。","question":"到大门口之前，苹果最后在哪里？","choices":["亭子里","树下","长椅旁"],"answer":"亭子里","explanation":"苹果先到了长椅旁，又到了亭子里，然后才到大门口。"},
      {"id":"babi-10-v3","chinese_text":"小兰从树下带苹果到长椅旁，把它留在那里。小兰自己去了亭子里。后来小明从长椅旁取走苹果，带到大门口。","question":"到大门口之前，苹果最后在哪里？","choices":["树下","亭子里","长椅旁"],"answer":"长椅旁","explanation":"苹果一直留在长椅旁，直到小明把它从那里带走。"},
      {"id":"babi-10-v4","chinese_text":"小兰在亭子里拿到苹果，去树下交给小明。小明带着苹果去了大门口。后来小兰去了长椅旁。","question":"到大门口之前，苹果最后在哪里？","choices":["亭子里","树下","长椅旁"],"answer":"树下","explanation":"小明在树下接过苹果后直接去了大门口，所以前一站是树下。"}
    ] },
    { id: "babi-11", source: "babi", source_author: "Jason Weston、Antoine Bordes、Sumit Chopra、Alexander M. Rush、Bart van Merriënboer、Armand Joulin、Tomas Mikolov", category: "facts", variants: [
      {"id":"babi-11-v1","chinese_text":"小兰回了走廊。小雨拿起苹果。小东拿了牛奶，去了洗手间。小雨先到了走廊，再去了洗手间。","question":"到洗手间之前，苹果最后在哪里？","choices":["走廊","办公室","洗手间"],"answer":"走廊","explanation":"走廊是小雨带苹果进洗手间前经过的地方。"},
      {"id":"babi-11-v2","chinese_text":"小雨在阅览室拿起故事书，先到了教室，再到了走廊，最后带它到了办公室。","question":"到办公室之前，故事书最后在哪里？","choices":["阅览室","教室","走廊"],"answer":"走廊","explanation":"故事书先到了教室，又到了走廊，然后才到办公室。"},
      {"id":"babi-11-v3","chinese_text":"小雨从阅览室带故事书到教室，把它留在那里。小雨自己去了走廊。后来小东从教室取走故事书，带到办公室。","question":"到办公室之前，故事书最后在哪里？","choices":["走廊","教室","阅览室"],"answer":"教室","explanation":"故事书一直留在教室，直到小东把它从那里带走。"},
      {"id":"babi-11-v4","chinese_text":"小雨在走廊拿到故事书，去阅览室交给小东。小东带着故事书去了办公室。后来小雨去了教室。","question":"到办公室之前，故事书最后在哪里？","choices":["阅览室","教室","走廊"],"answer":"阅览室","explanation":"小东在阅览室接过故事书后直接去了办公室，所以前一站是阅览室。"}
    ] },
    { id: "babi-12", source: "babi", source_author: "Jason Weston、Antoine Bordes、Sumit Chopra、Alexander M. Rush、Bart van Merriënboer、Armand Joulin、Tomas Mikolov", category: "negation", variants: [
      {"id":"babi-12-v1","chinese_text":"小明在走廊。小兰先在厨房，后来进了卧室。小雨去过花园和洗手间。小兰已经离开卧室了。","question":"小兰现在在卧室吗？","choices":["在","不在"],"answer":"不在","explanation":"小兰去过卧室，可是短文最后说她已经离开了。"},
      {"id":"babi-12-v2","chinese_text":"小兰在教室。小雨不在教室，已经去了图书角。","question":"小兰现在在教室吗？","choices":["在","不在"],"answer":"在","explanation":"“不在教室”说的是小雨，小兰还在教室。"},
      {"id":"babi-12-v3","chinese_text":"小兰原先不在办公室，在教室等。现在小兰已经到了办公室。","question":"小兰现在在办公室吗？","choices":["不在","在"],"answer":"在","explanation":"“原先不在”说的是先前，现在小兰已经到了办公室。"},
      {"id":"babi-12-v4","chinese_text":"小兰今天只去了图书角和办公室，没有去教室。","question":"小兰今天没去的地方是哪里？","choices":["办公室","教室","图书角"],"answer":"教室","explanation":"题目问“没有去”的地方。文中说没有去教室。"}
    ] },
    { id: "babi-13", source: "babi", source_author: "Jason Weston、Antoine Bordes、Sumit Chopra、Alexander M. Rush、Bart van Merriënboer、Armand Joulin、Tomas Mikolov", category: "negation", variants: [
      {"id":"babi-13-v1","chinese_text":"小雨到了花园。小东已经离开厨房。小明离开了洗手间，现在在花园。小兰去了卧室。","question":"小明现在在花园吗？","choices":["在","不在"],"answer":"在","explanation":"小明离开了洗手间，短文说他现在在花园。"},
      {"id":"babi-13-v2","chinese_text":"小明没有去操场。现在小东在那里等。","question":"小明现在在操场吗？","choices":["在","不在"],"answer":"不在","explanation":"到了操场的是小东，小明没有去。"},
      {"id":"babi-13-v3","chinese_text":"小明起先在操场。现在小明已经离开操场，去了教室。","question":"小明现在在操场吗？","choices":["不在","在"],"answer":"不在","explanation":"小明原来在操场，现在已经去了教室。"},
      {"id":"babi-13-v4","chinese_text":"小明今天只去了操场和教室，没有去走廊。","question":"小明今天没去的地方是哪里？","choices":["走廊","操场","教室"],"answer":"走廊","explanation":"题目问“没有去”的地方。文中说没有去走廊。"}
    ] },
    { id: "babi-14", source: "babi", source_author: "Jason Weston、Antoine Bordes、Sumit Chopra、Alexander M. Rush、Bart van Merriënboer、Armand Joulin、Tomas Mikolov", category: "negation", variants: [
      {"id":"babi-14-v1","chinese_text":"小明不在洗手间。小兰不在卧室。","question":"小明现在在洗手间吗？","choices":["在","不在"],"answer":"不在","explanation":"第一句里的“不在”说明小明没有待在洗手间。"},
      {"id":"babi-14-v2","chinese_text":"小明在阳台。小兰不在阳台，已经去了厨房。","question":"小明现在在阳台吗？","choices":["在","不在"],"answer":"在","explanation":"“不在阳台”说的是小兰，小明还在阳台。"},
      {"id":"babi-14-v3","chinese_text":"小明原先不在客厅，在阳台等。现在小明已经到了客厅。","question":"小明现在在客厅吗？","choices":["不在","在"],"answer":"在","explanation":"“原先不在”说的是先前，现在小明已经到了客厅。"},
      {"id":"babi-14-v4","chinese_text":"小明今天只去了厨房和客厅，没有去阳台。","question":"小明今天没去的地方是哪里？","choices":["厨房","客厅","阳台"],"answer":"阳台","explanation":"题目问“没有去”的地方。文中说没有去阳台。"}
    ] },
    { id: "babi-15", source: "babi", source_author: "Jason Weston、Antoine Bordes、Sumit Chopra、Alexander M. Rush、Bart van Merriënboer、Armand Joulin、Tomas Mikolov", category: "negation", variants: [
      {"id":"babi-15-v1","chinese_text":"小明已经不在花园了。小东还在走廊。","question":"小明现在在花园吗？","choices":["在","不在"],"answer":"不在","explanation":"“已经不在”说的是小明现在的情况。"},
      {"id":"babi-15-v2","chinese_text":"小明在院子。小东不在院子，已经去了公园。","question":"小明现在在院子吗？","choices":["在","不在"],"answer":"在","explanation":"“不在院子”说的是小东，小明还在院子。"},
      {"id":"babi-15-v3","chinese_text":"小明原先不在屋里，在院子等。现在小明已经到了屋里。","question":"小明现在在屋里吗？","choices":["不在","在"],"answer":"在","explanation":"“原先不在”说的是先前，现在小明已经到了屋里。"},
      {"id":"babi-15-v4","chinese_text":"小明今天只去了公园和屋里，没有去院子。","question":"小明今天没去的地方是哪里？","choices":["院子","公园","屋里"],"answer":"院子","explanation":"题目问“没有去”的地方。文中说没有去院子。"}
    ] },
    { id: "babi-16", source: "babi", source_author: "Jason Weston、Antoine Bordes、Sumit Chopra、Alexander M. Rush、Bart van Merriënboer、Armand Joulin、Tomas Mikolov", category: "negation", variants: [
      {"id":"babi-16-v1","chinese_text":"小雨去了洗手间。小东去了走廊。","question":"小雨现在在洗手间吗？","choices":["在","不在"],"answer":"在","explanation":"短文说小雨去了洗手间，去走廊的是小东。"},
      {"id":"babi-16-v2","chinese_text":"小雨没有去阅览室。现在小东在那里等。","question":"小雨现在在阅览室吗？","choices":["在","不在"],"answer":"不在","explanation":"到了阅览室的是小东，小雨没有去。"},
      {"id":"babi-16-v3","chinese_text":"小雨起先在阅览室。现在小雨已经离开阅览室，去了美术教室。","question":"小雨现在在阅览室吗？","choices":["不在","在"],"answer":"不在","explanation":"小雨原来在阅览室，现在已经去了美术教室。"},
      {"id":"babi-16-v4","chinese_text":"小雨今天只去了阅览室和美术教室，没有去储物间。","question":"小雨今天没去的地方是哪里？","choices":["阅览室","美术教室","储物间"],"answer":"储物间","explanation":"题目问“没有去”的地方。文中说没有去储物间。"}
    ] },
    { id: "babi-17", source: "babi", source_author: "Jason Weston、Antoine Bordes、Sumit Chopra、Alexander M. Rush、Bart van Merriënboer、Armand Joulin、Tomas Mikolov", category: "negation", variants: [
      {"id":"babi-17-v1","chinese_text":"小兰在走廊。小明回到了厨房。","question":"小兰现在在走廊吗？","choices":["不在","在"],"answer":"在","explanation":"第一句直接交代了小兰在走廊。"},
      {"id":"babi-17-v2","chinese_text":"小兰没有去商店。现在小明在那里等。","question":"小兰现在在商店吗？","choices":["不在","在"],"answer":"不在","explanation":"到了商店的是小明，小兰没有去。"},
      {"id":"babi-17-v3","chinese_text":"小兰起先在商店。现在小兰已经离开商店，去了书店。","question":"小兰现在在商店吗？","choices":["在","不在"],"answer":"不在","explanation":"小兰原来在商店，现在已经去了书店。"},
      {"id":"babi-17-v4","chinese_text":"小兰今天只去了商店和书店，没有去车站。","question":"小兰今天没去的地方是哪里？","choices":["书店","车站","商店"],"answer":"车站","explanation":"题目问“没有去”的地方。文中说没有去车站。"}
    ] },
    { id: "babi-18", source: "babi", source_author: "Jason Weston、Antoine Bordes、Sumit Chopra、Alexander M. Rush、Bart van Merriënboer、Armand Joulin、Tomas Mikolov", category: "pronouns", variants: [
      {"id":"babi-18-v1","chinese_text":"小明去了走廊。接着，他去了花园。","question":"小明现在在哪里？","choices":["走廊","厨房","花园"],"answer":"花园","explanation":"第二句中的“他”指小明。小明后来去了花园。"},
      {"id":"babi-18-v2","chinese_text":"哥哥小明到了教室。妹妹小雨在图书角。她离开那里，去找哥哥。","question":"最后一句的“她”指谁？","choices":["小雨","小明"],"answer":"小雨","explanation":"“她”指妹妹小雨。离开图书角去找哥哥的是小雨。"},
      {"id":"babi-18-v3","chinese_text":"哥哥小明来到教室，接着他去了操场。妹妹小雨后来也来到教室，又去了图书角。","question":"小明现在在哪里？","choices":["操场","教室","图书角"],"answer":"操场","explanation":"第一句后半句的“他”指小明，他去了操场。到了图书角的是小雨。"},
      {"id":"babi-18-v4","chinese_text":"哥哥小明先在教室等。妹妹小雨原来在操场，后来她直接去了图书角。过了一会儿，哥哥也去图书角找妹妹。","question":"小雨到图书角之前在哪里？","choices":["教室","图书角","操场"],"answer":"操场","explanation":"“她”指妹妹小雨。小雨从操场直接去了图书角。"}
    ] },
    { id: "babi-19", source: "babi", source_author: "Jason Weston、Antoine Bordes、Sumit Chopra、Alexander M. Rush、Bart van Merriënboer、Armand Joulin、Tomas Mikolov", category: "pronouns", variants: [
      {"id":"babi-19-v1","chinese_text":"小东去了办公室。后来，他回到了厨房。","question":"小东现在在哪里？","choices":["走廊","厨房","办公室"],"answer":"厨房","explanation":"“他”指前一句的小东。小东后来回到了厨房。"},
      {"id":"babi-19-v2","chinese_text":"弟弟小东到了厨房。姐姐小兰在客厅。她离开那里，去找弟弟。","question":"最后一句的“她”指谁？","choices":["小东","小兰"],"answer":"小兰","explanation":"“她”指姐姐小兰。离开客厅去找弟弟的是小兰。"},
      {"id":"babi-19-v3","chinese_text":"弟弟小东来到厨房，接着他去了卧室。姐姐小兰后来也来到厨房，又去了客厅。","question":"小东现在在哪里？","choices":["厨房","客厅","卧室"],"answer":"卧室","explanation":"第一句后半句的“他”指小东，他去了卧室。到了客厅的是小兰。"},
      {"id":"babi-19-v4","chinese_text":"弟弟小东先在厨房等。姐姐小兰原来在卧室，后来她直接去了客厅。过了一会儿，弟弟也去客厅找姐姐。","question":"小兰到客厅之前在哪里？","choices":["客厅","卧室","厨房"],"answer":"卧室","explanation":"“她”指姐姐小兰。小兰从卧室直接去了客厅。"}
    ] },
    { id: "babi-20", source: "babi", source_author: "Jason Weston、Antoine Bordes、Sumit Chopra、Alexander M. Rush、Bart van Merriënboer、Armand Joulin、Tomas Mikolov", category: "pronouns", variants: [
      {"id":"babi-20-v1","chinese_text":"小兰先到走廊，再去厨房。小东到了办公室，又去了洗手间。小雨到了办公室，接着她去了卧室。","question":"小雨现在在哪里？","choices":["卧室","办公室","洗手间"],"answer":"卧室","explanation":"最后一句的“她”指小雨。小雨从办公室去了卧室。"},
      {"id":"babi-20-v2","chinese_text":"妹妹小雨到了美术教室。哥哥小东在楼梯口。他离开那里，去找妹妹。","question":"最后一句的“他”指谁？","choices":["小东","小雨"],"answer":"小东","explanation":"“他”指哥哥小东。离开楼梯口去找妹妹的是小东。"},
      {"id":"babi-20-v3","chinese_text":"妹妹小雨来到美术教室，接着她去了操场。哥哥小东后来也来到美术教室，又去了楼梯口。","question":"小雨现在在哪里？","choices":["楼梯口","操场","美术教室"],"answer":"操场","explanation":"第一句后半句的“她”指小雨，她去了操场。到了楼梯口的是小东。"},
      {"id":"babi-20-v4","chinese_text":"妹妹小雨先在美术教室等。哥哥小东原来在操场，后来他直接去了楼梯口。过了一会儿，妹妹也去楼梯口找哥哥。","question":"小东到楼梯口之前在哪里？","choices":["操场","美术教室","楼梯口"],"answer":"操场","explanation":"“他”指哥哥小东。小东从操场直接去了楼梯口。"}
    ] },
    { id: "babi-21", source: "babi", source_author: "Jason Weston、Antoine Bordes、Sumit Chopra、Alexander M. Rush、Bart van Merriënboer、Armand Joulin、Tomas Mikolov", category: "pronouns", variants: [
      {"id":"babi-21-v1","chinese_text":"小兰走到了花园。之后，她又走到了办公室。","question":"小兰现在在哪里？","choices":["走廊","办公室","花园"],"answer":"办公室","explanation":"“她”指小兰。小兰离开花园后去了办公室。"},
      {"id":"babi-21-v2","chinese_text":"姐姐小兰到了公园。弟弟小明在商店。他离开那里，去找姐姐。","question":"最后一句的“他”指谁？","choices":["小明","小兰"],"answer":"小明","explanation":"“他”指弟弟小明。离开商店去找姐姐的是小明。"},
      {"id":"babi-21-v3","chinese_text":"姐姐小兰来到公园，接着她去了车站。弟弟小明后来也来到公园，又去了商店。","question":"小兰现在在哪里？","choices":["公园","商店","车站"],"answer":"车站","explanation":"第一句后半句的“她”指小兰，她去了车站。到了商店的是小明。"},
      {"id":"babi-21-v4","chinese_text":"姐姐小兰先在公园等。弟弟小明原来在车站，后来他直接去了商店。过了一会儿，姐姐也去商店找弟弟。","question":"小明到商店之前在哪里？","choices":["商店","车站","公园"],"answer":"车站","explanation":"“他”指弟弟小明。小明从车站直接去了商店。"}
    ] },
    { id: "babi-22", source: "babi", source_author: "Jason Weston、Antoine Bordes、Sumit Chopra、Alexander M. Rush、Bart van Merriënboer、Armand Joulin、Tomas Mikolov", category: "pronouns", variants: [
      {"id":"babi-22-v1","chinese_text":"小东回到卧室。接着，他又去了走廊。","question":"小东现在在哪里？","choices":["走廊","卧室","客厅"],"answer":"走廊","explanation":"“他”指小东。小东最后到了走廊。"},
      {"id":"babi-22-v2","chinese_text":"哥哥小东到了院子。妹妹小雨在客厅。她离开那里，去找哥哥。","question":"最后一句的“她”指谁？","choices":["小东","小雨"],"answer":"小雨","explanation":"“她”指妹妹小雨。离开客厅去找哥哥的是小雨。"},
      {"id":"babi-22-v3","chinese_text":"哥哥小东来到院子，接着他去了阳台。妹妹小雨后来也来到院子，又去了客厅。","question":"小东现在在哪里？","choices":["客厅","阳台","院子"],"answer":"阳台","explanation":"第一句后半句的“他”指小东，他去了阳台。到了客厅的是小雨。"},
      {"id":"babi-22-v4","chinese_text":"哥哥小东先在院子等。妹妹小雨原来在阳台，后来她直接去了客厅。过了一会儿，哥哥也去客厅找妹妹。","question":"小雨到客厅之前在哪里？","choices":["阳台","院子","客厅"],"answer":"阳台","explanation":"“她”指妹妹小雨。小雨从阳台直接去了客厅。"}
    ] },
    { id: "babi-23", source: "babi", source_author: "Jason Weston、Antoine Bordes、Sumit Chopra、Alexander M. Rush、Bart van Merriënboer、Armand Joulin、Tomas Mikolov", category: "pronouns", variants: [
      {"id":"babi-23-v1","chinese_text":"小东来到了走廊。随后，他去了洗手间。","question":"小东现在在哪里？","choices":["走廊","办公室","洗手间"],"answer":"洗手间","explanation":"“他”指小东。小东后来从走廊去了洗手间。"},
      {"id":"babi-23-v2","chinese_text":"弟弟小东到了走廊。姐姐小兰在办公室。她离开那里，去找弟弟。","question":"最后一句的“她”指谁？","choices":["小兰","小东"],"answer":"小兰","explanation":"“她”指姐姐小兰。离开办公室去找弟弟的是小兰。"},
      {"id":"babi-23-v3","chinese_text":"弟弟小东来到走廊，接着他去了教室。姐姐小兰后来也来到走廊，又去了办公室。","question":"小东现在在哪里？","choices":["教室","走廊","办公室"],"answer":"教室","explanation":"第一句后半句的“他”指小东，他去了教室。到了办公室的是小兰。"},
      {"id":"babi-23-v4","chinese_text":"弟弟小东先在走廊等。姐姐小兰原来在教室，后来她直接去了办公室。过了一会儿，弟弟也去办公室找姐姐。","question":"小兰到办公室之前在哪里？","choices":["走廊","办公室","教室"],"answer":"教室","explanation":"“她”指姐姐小兰。小兰从教室直接去了办公室。"}
    ] },
    { id: "babi-24", source: "babi", source_author: "Jason Weston、Antoine Bordes、Sumit Chopra、Alexander M. Rush、Bart van Merriënboer、Armand Joulin、Tomas Mikolov", category: "pronouns", variants: [
      {"id":"babi-24-v1","chinese_text":"小明和小雨回到走廊。接着，他们去了洗手间。","question":"小明现在在哪里？","choices":["洗手间","走廊","教室"],"answer":"洗手间","explanation":"“他们”指小明和小雨。小明也去了洗手间。"},
      {"id":"babi-24-v2","chinese_text":"小明到了门口。小雨和小东走到教室，接着他们去了操场找跳绳。","question":"小明现在在哪里？","choices":["教室","操场","门口"],"answer":"门口","explanation":"“他们”指刚出现的小雨和小东，小明还在门口。"},
      {"id":"babi-24-v3","chinese_text":"小明和小雨先在门口。后来小明留在门口，小雨去了操场。小雨在那里遇到小东，两个人一起到教室找跳绳。","question":"小雨现在在哪里？","choices":["操场","教室","门口"],"answer":"教室","explanation":"“两个人”是小雨和小东，小雨后来和小东一起到了教室。"},
      {"id":"babi-24-v4","chinese_text":"小东独自留在教室。小明和小雨离开门口。他们走到操场找跳绳。","question":"最后一句说谁到了操场？","choices":["小明和小雨","小明和小东","小雨和小东"],"answer":"小明和小雨","explanation":"“他们”接着说的是一起离开门口的小明和小雨。"}
    ] },
    { id: "babi-25", source: "babi", source_author: "Jason Weston、Antoine Bordes、Sumit Chopra、Alexander M. Rush、Bart van Merriënboer、Armand Joulin、Tomas Mikolov", category: "pronouns", variants: [
      {"id":"babi-25-v1","chinese_text":"小东和小明回到厨房。然后，他们回到了走廊。","question":"小东现在在哪里？","choices":["厨房","卧室","走廊"],"answer":"走廊","explanation":"“他们”指小东和小明。小东也去了走廊。"},
      {"id":"babi-25-v2","chinese_text":"小东到了客厅。小明和小兰走到厨房，接着他们去了阳台拿水杯。","question":"小东现在在哪里？","choices":["阳台","客厅","厨房"],"answer":"客厅","explanation":"“他们”指刚出现的小明和小兰，小东还在客厅。"},
      {"id":"babi-25-v3","chinese_text":"小东和小明先在客厅。后来小东留在客厅，小明去了阳台。小明在那里遇到小兰，两个人一起到厨房拿水杯。","question":"小明现在在哪里？","choices":["厨房","客厅","阳台"],"answer":"厨房","explanation":"“两个人”是小明和小兰，小明后来和小兰一起到了厨房。"},
      {"id":"babi-25-v4","chinese_text":"小兰独自留在厨房。小东和小明离开客厅。他们走到阳台拿水杯。","question":"最后一句说谁到了阳台？","choices":["小东和小兰","小明和小兰","小东和小明"],"answer":"小东和小明","explanation":"“他们”接着说的是一起离开客厅的小东和小明。"}
    ] },
    { id: "babi-26", source: "babi", source_author: "Jason Weston、Antoine Bordes、Sumit Chopra、Alexander M. Rush、Bart van Merriënboer、Armand Joulin、Tomas Mikolov", category: "pronouns", variants: [
      {"id":"babi-26-v1","chinese_text":"小雨和小东来到了卧室。后来，他们去了厨房。","question":"小东现在在哪里？","choices":["阳台","厨房","卧室"],"answer":"厨房","explanation":"“他们”指小雨和小东。小东也去了厨房。"},
      {"id":"babi-26-v2","chinese_text":"小雨到了阅览室。小东和小明走到图书角，接着他们去了办公室还故事书。","question":"小雨现在在哪里？","choices":["阅览室","图书角","办公室"],"answer":"阅览室","explanation":"“他们”指刚出现的小东和小明，小雨还在阅览室。"},
      {"id":"babi-26-v3","chinese_text":"小雨和小东先在阅览室。后来小雨留在阅览室，小东去了办公室。小东在那里遇到小明，两个人一起到图书角还故事书。","question":"小东现在在哪里？","choices":["阅览室","办公室","图书角"],"answer":"图书角","explanation":"“两个人”是小东和小明，小东后来和小明一起到了图书角。"},
      {"id":"babi-26-v4","chinese_text":"小明独自留在图书角。小雨和小东离开阅览室。他们走到办公室还故事书。","question":"最后一句说谁到了办公室？","choices":["小东和小明","小雨和小东","小雨和小明"],"answer":"小雨和小东","explanation":"“他们”接着说的是一起离开阅览室的小雨和小东。"}
    ] },
    { id: "babi-27", source: "babi", source_author: "Jason Weston、Antoine Bordes、Sumit Chopra、Alexander M. Rush、Bart van Merriënboer、Armand Joulin、Tomas Mikolov", category: "pronouns", variants: [
      {"id":"babi-27-v1","chinese_text":"小雨和小兰来到了办公室。接着，她们去了花园。","question":"小兰现在在哪里？","choices":["办公室","走廊","花园"],"answer":"花园","explanation":"“她们”指小雨和小兰。小兰也去了花园。"},
      {"id":"babi-27-v2","chinese_text":"小雨到了亭子旁。小兰和小东走到长椅边，接着他们去了公园门口看地图。","question":"小雨现在在哪里？","choices":["公园门口","亭子旁","长椅边"],"answer":"亭子旁","explanation":"“他们”指刚出现的小兰和小东，小雨还在亭子旁。"},
      {"id":"babi-27-v3","chinese_text":"小雨和小兰先在亭子旁。后来小雨留在亭子旁，小兰去了公园门口。小兰在那里遇到小东，两个人一起到长椅边看地图。","question":"小兰现在在哪里？","choices":["长椅边","亭子旁","公园门口"],"answer":"长椅边","explanation":"“两个人”是小兰和小东，小兰后来和小东一起到了长椅边。"},
      {"id":"babi-27-v4","chinese_text":"小东独自留在长椅边。小雨和小兰离开亭子旁。她们走到公园门口看地图。","question":"最后一句说谁到了公园门口？","choices":["小雨和小东","小兰和小东","小雨和小兰"],"answer":"小雨和小兰","explanation":"“她们”接着说的是一起离开亭子旁的小雨和小兰。"}
    ] },
    { id: "babi-28", source: "babi", source_author: "Jason Weston、Antoine Bordes、Sumit Chopra、Alexander M. Rush、Bart van Merriënboer、Armand Joulin、Tomas Mikolov", category: "pronouns", variants: [
      {"id":"babi-28-v1","chinese_text":"小兰和小明回到了走廊。后来，他们去了办公室。","question":"小明现在在哪里？","choices":["教室","办公室","走廊"],"answer":"办公室","explanation":"“他们”指小兰和小明。小明也去了办公室。"},
      {"id":"babi-28-v2","chinese_text":"小兰到了美术教室。小明和小雨走到走廊，接着他们去了教室送画纸。","question":"小兰现在在哪里？","choices":["美术教室","走廊","教室"],"answer":"美术教室","explanation":"“他们”指刚出现的小明和小雨，小兰还在美术教室。"},
      {"id":"babi-28-v3","chinese_text":"小兰和小明先在美术教室。后来小兰留在美术教室，小明去了教室。小明在那里遇到小雨，两个人一起到走廊送画纸。","question":"小明现在在哪里？","choices":["美术教室","教室","走廊"],"answer":"走廊","explanation":"“两个人”是小明和小雨，小明后来和小雨一起到了走廊。"},
      {"id":"babi-28-v4","chinese_text":"小雨独自留在走廊。小兰和小明离开美术教室。他们走到教室送画纸。","question":"最后一句说谁到了教室？","choices":["小明和小雨","小兰和小明","小兰和小雨"],"answer":"小兰和小明","explanation":"“他们”接着说的是一起离开美术教室的小兰和小明。"}
    ] },
    { id: "babi-29", source: "babi", source_author: "Jason Weston、Antoine Bordes、Sumit Chopra、Alexander M. Rush、Bart van Merriënboer、Armand Joulin、Tomas Mikolov", category: "time", variants: [
      {"id":"babi-29-v1","chinese_text":"今天上午小雨去了厨房。今天下午她去了电影院。昨天小文在卧室，昨天小雨去了学校。","question":"小雨今天去电影院之前，最后去了哪里？","choices":["厨房","学校","卧室"],"answer":"厨房","explanation":"小雨昨天去了学校，今天先去了厨房，再去了电影院。"},
      {"id":"babi-29-v2","chinese_text":"今天下午，小雨到车站接奶奶。昨天，小雨到家拿书包。今天上午，小雨到书店买故事书。","question":"按照时间，小雨今天先去了哪里？","choices":["家","车站","书店"],"answer":"书店","explanation":"今天上午先到书店，下午才到车站。回了家是昨天的事。"},
      {"id":"babi-29-v3","chinese_text":"小雨今天上午在车站。中午回了家，下午又到了书店。","question":"从上午到下午，小雨中间去过哪里？","choices":["车站","家","书店"],"answer":"家","explanation":"小雨上午在车站，中午回了家，下午才到书店。"},
      {"id":"babi-29-v4","chinese_text":"小雨要先到书店买故事书，才到车站接奶奶。做完这两件事以后，小雨再到家拿书包。","question":"按这个计划，接奶奶之后还要做什么？","choices":["拿书包","买故事书","接奶奶"],"answer":"拿书包","explanation":"按计划，先买故事书，再接奶奶，最后拿书包。"}
    ] },
    { id: "babi-30", source: "babi", source_author: "Jason Weston、Antoine Bordes、Sumit Chopra、Alexander M. Rush、Bart van Merriënboer、Armand Joulin、Tomas Mikolov", category: "time", variants: [
      {"id":"babi-30-v1","chinese_text":"昨天小月回到学校，小乐去了电影院。今天上午小文回了学校。昨天小文去了卧室。","question":"小文今天回学校之前，最后去了哪里？","choices":["电影院","卧室","学校"],"answer":"卧室","explanation":"小文昨天去了卧室，今天上午才回到学校。"},
      {"id":"babi-30-v2","chinese_text":"今天下午，小文到操场跳绳。昨天，小文到教室交作业。今天上午，小文到图书角借书。","question":"按照时间，小文今天先去了哪里？","choices":["图书角","教室","操场"],"answer":"图书角","explanation":"今天上午先到图书角，下午才到操场。去了教室是昨天的事。"},
      {"id":"babi-30-v3","chinese_text":"小文今天上午在操场。中午去了教室，下午又到了图书角。","question":"从上午到下午，小文中间去过哪里？","choices":["图书角","操场","教室"],"answer":"教室","explanation":"小文上午在操场，中午去了教室，下午才到图书角。"},
      {"id":"babi-30-v4","chinese_text":"小文要先到图书角借书，才到操场跳绳。做完这两件事以后，小文再到教室交作业。","question":"按这个计划，跳绳之后还要做什么？","choices":["跳绳","交作业","借书"],"answer":"交作业","explanation":"按计划，先借书，再跳绳，最后交作业。"}
    ] },
    { id: "babi-31", source: "babi", source_author: "Jason Weston、Antoine Bordes、Sumit Chopra、Alexander M. Rush、Bart van Merriënboer、Armand Joulin、Tomas Mikolov", category: "time", variants: [
      {"id":"babi-31-v1","chinese_text":"小乐昨天去了厨房。今天上午他去过卧室。今天晚上他又到了卧室，而今天下午他去了电影院。","question":"小乐今天晚上回到卧室之前，最后去了哪里？","choices":["电影院","厨房","卧室"],"answer":"电影院","explanation":"按时间排列，小乐上午去过卧室，下午去了电影院，晚上才回卧室。"},
      {"id":"babi-31-v2","chinese_text":"今天下午，小乐到家整理书桌。昨天，小乐到菜店买青菜。今天上午，小乐到公园看金鱼。","question":"按照时间，小乐今天先去了哪里？","choices":["菜店","家","公园"],"answer":"公园","explanation":"今天上午先到公园，下午才到家。去了菜店是昨天的事。"},
      {"id":"babi-31-v3","chinese_text":"小乐今天上午在家。中午去了菜店，下午又到了公园。","question":"从上午到下午，小乐中间去过哪里？","choices":["家","菜店","公园"],"answer":"菜店","explanation":"小乐上午在家，中午去了菜店，下午才到公园。"},
      {"id":"babi-31-v4","chinese_text":"小乐要先到公园看金鱼，才到家整理书桌。做完这两件事以后，小乐再到菜店买青菜。","question":"按这个计划，整理书桌之后还要做什么？","choices":["买青菜","看金鱼","整理书桌"],"answer":"买青菜","explanation":"按计划，先看金鱼，再整理书桌，最后买青菜。"}
    ] },
    { id: "babi-32", source: "babi", source_author: "Jason Weston、Antoine Bordes、Sumit Chopra、Alexander M. Rush、Bart van Merriënboer、Armand Joulin、Tomas Mikolov", category: "time", variants: [
      {"id":"babi-32-v1","chinese_text":"小雨今天上午回到厨房。昨天她去了学校。","question":"小雨今天回到厨房之前，最后去了哪里？","choices":["厨房","电影院","学校"],"answer":"学校","explanation":"“昨天”比“今天上午”早。小雨先去了学校，再回到厨房。"},
      {"id":"babi-32-v2","chinese_text":"今天下午，小雨到书房整理画纸。昨天，小雨到画室拿彩笔。今天上午，小雨到花园画花。","question":"按照时间，小雨今天先去了哪里？","choices":["书房","花园","画室"],"answer":"花园","explanation":"今天上午先到花园，下午才到书房。去了画室是昨天的事。"},
      {"id":"babi-32-v3","chinese_text":"小雨今天上午在书房。中午去了画室，下午又到了花园。","question":"从上午到下午，小雨中间去过哪里？","choices":["画室","花园","书房"],"answer":"画室","explanation":"小雨上午在书房，中午去了画室，下午才到花园。"},
      {"id":"babi-32-v4","chinese_text":"小雨要先到花园画花，才到书房整理画纸。做完这两件事以后，小雨再到画室拿彩笔。","question":"按这个计划，整理画纸之后还要做什么？","choices":["画花","整理画纸","拿彩笔"],"answer":"拿彩笔","explanation":"按计划，先画花，再整理画纸，最后拿彩笔。"}
    ] },
    { id: "babi-33", source: "babi", source_author: "Jason Weston、Antoine Bordes、Sumit Chopra、Alexander M. Rush、Bart van Merriënboer、Armand Joulin、Tomas Mikolov", category: "time", variants: [
      {"id":"babi-33-v1","chinese_text":"昨天小文去了公园。今天下午他回到公园。今天上午小文去了学校。","question":"小文今天下午回到公园之前，最后去了哪里？","choices":["学校","公园","厨房"],"answer":"学校","explanation":"小文昨天去过公园，今天上午到了学校，下午才回到公园。"},
      {"id":"babi-33-v2","chinese_text":"今天下午，小文到家拆包裹。昨天，小文到超市买牛奶。今天上午，小文到快递点取包裹。","question":"按照时间，小文今天先去了哪里？","choices":["超市","家","快递点"],"answer":"快递点","explanation":"今天上午先到快递点，下午才到家。去了超市是昨天的事。"},
      {"id":"babi-33-v3","chinese_text":"小文今天上午在家。中午去了超市，下午又到了快递点。","question":"从上午到下午，小文中间去过哪里？","choices":["家","超市","快递点"],"answer":"超市","explanation":"小文上午在家，中午去了超市，下午才到快递点。"},
      {"id":"babi-33-v4","chinese_text":"小文要先到快递点取包裹，才到家拆包裹。做完这两件事以后，小文再到超市买牛奶。","question":"按这个计划，拆包裹之后还要做什么？","choices":["买牛奶","取包裹","拆包裹"],"answer":"买牛奶","explanation":"按计划，先取包裹，再拆包裹，最后买牛奶。"}
    ] },
    { id: "babi-34", source: "babi", source_author: "Jason Weston、Antoine Bordes、Sumit Chopra、Alexander M. Rush、Bart van Merriënboer、Armand Joulin、Tomas Mikolov", category: "time", variants: [
      {"id":"babi-34-v1","chinese_text":"昨天小雨去了卧室，小文去了办公室。今天上午小雨去了电影院。小乐昨天也去过电影院。","question":"小雨今天去电影院之前，最后去了哪里？","choices":["办公室","电影院","卧室"],"answer":"卧室","explanation":"昨天去卧室的是小雨，今天上午她才去了电影院。"},
      {"id":"babi-34-v2","chinese_text":"今天下午，小雨到球场踢球。昨天，小雨到教室放书包。今天上午，小雨到器材室借足球。","question":"按照时间，小雨今天先去了哪里？","choices":["球场","器材室","教室"],"answer":"器材室","explanation":"今天上午先到器材室，下午才到球场。去了教室是昨天的事。"},
      {"id":"babi-34-v3","chinese_text":"小雨今天上午在球场。中午去了教室，下午又到了器材室。","question":"从上午到下午，小雨中间去过哪里？","choices":["教室","器材室","球场"],"answer":"教室","explanation":"小雨上午在球场，中午去了教室，下午才到器材室。"},
      {"id":"babi-34-v4","chinese_text":"小雨要先到器材室借足球，才到球场踢球。做完这两件事以后，小雨再到教室放书包。","question":"按这个计划，踢球之后还要做什么？","choices":["借足球","踢球","放书包"],"answer":"放书包","explanation":"按计划，先借足球，再踢球，最后放书包。"}
    ] },
    { id: "babi-35", source: "babi", source_author: "Jason Weston、Antoine Bordes、Sumit Chopra、Alexander M. Rush、Bart van Merriënboer、Armand Joulin、Tomas Mikolov", category: "conditions", variants: [
      {"id":"babi-35-v1","chinese_text":"在这个故事里，狼都怕老鼠。羊都怕老鼠。小花是一只羊。老鼠都怕猫。猫都怕狼。小圆是一只老鼠。小白是一只猫。小灰是一只狼。","question":"小白怕什么？","choices":["老鼠","狼","羊"],"answer":"狼","explanation":"故事里猫都怕狼，小白是一只猫。"},
      {"id":"babi-35-v2","chinese_text":"故事里，小猫都怕鞭炮声，小兔都怕雷声。小白是一只小兔。","question":"小白怕什么声音？","choices":["雷声","鞭炮声","雨滴声"],"answer":"雷声","explanation":"小白是小兔，故事里小兔都怕雷声。"},
      {"id":"babi-35-v3","chinese_text":"小白在红队。红队的同学都是图书组的。图书组今天要整理图书角，蓝队今天要扫地。","question":"小白今天要做什么？","choices":["扫地","读课文","整理图书角"],"answer":"整理图书角","explanation":"小白在红队，也就属于图书组。图书组今天要整理图书角。"},
      {"id":"babi-35-v4","chinese_text":"参加做风车的同学领到贴有黄色标签的材料袋。所有贴有黄色标签的袋子里都有纸片，贴白色标签的袋子里有剪刀。小白参加了做风车。","question":"小白领到的袋子里有什么？","choices":["铅笔","纸片","剪刀"],"answer":"纸片","explanation":"小白参加做风车，所以拿到贴有黄色标签的袋子。这种袋子里有纸片。"}
    ] },
    { id: "babi-36", source: "babi", source_author: "Jason Weston、Antoine Bordes、Sumit Chopra、Alexander M. Rush、Bart van Merriënboer、Armand Joulin、Tomas Mikolov", category: "conditions", variants: [
      {"id":"babi-36-v1","chinese_text":"在这个故事里，猫都怕狼。老鼠都怕猫。羊都怕老鼠。小灰是一只猫。狼都怕羊。小圆是一只老鼠。小白是一只狼。小花是一只猫。","question":"小白怕什么？","choices":["老鼠","猫","羊"],"answer":"羊","explanation":"故事里狼都怕羊，小白是一只狼。"},
      {"id":"babi-36-v2","chinese_text":"故事里，小鸡都怕敲门声，小鸭都怕狗叫声。小白是一只小鸭。","question":"小白怕什么声音？","choices":["雨滴声","狗叫声","敲门声"],"answer":"狗叫声","explanation":"小白是小鸭，故事里小鸭都怕狗叫声。"},
      {"id":"babi-36-v3","chinese_text":"小白在蓝队。蓝队的同学都是值日组的。值日组今天要擦黑板，绿队今天要擦桌子。","question":"小白今天要做什么？","choices":["擦黑板","擦桌子","读课文"],"answer":"擦黑板","explanation":"小白在蓝队，也就属于值日组。值日组今天要擦黑板。"},
      {"id":"babi-36-v4","chinese_text":"参加植物观察的同学领到贴有蓝色标签的材料袋。所有贴有蓝色标签的袋子里都有记录本，贴白色标签的袋子里有彩笔。小白参加了植物观察。","question":"小白领到的袋子里有什么？","choices":["彩笔","铅笔","记录本"],"answer":"记录本","explanation":"小白参加植物观察，所以拿到贴有蓝色标签的袋子。这种袋子里有记录本。"}
    ] },
    { id: "babi-37", source: "babi", source_author: "Jason Weston、Antoine Bordes、Sumit Chopra、Alexander M. Rush、Bart van Merriënboer、Armand Joulin、Tomas Mikolov", category: "conditions", variants: [
      {"id":"babi-37-v1","chinese_text":"在这个故事里，猫都怕狼。小花是一只猫。小白是一只猫。老鼠都怕狼。狼都怕老鼠。羊都怕猫。小灰是一只老鼠。小圆是一只老鼠。","question":"小灰怕什么？","choices":["猫","狼","羊"],"answer":"狼","explanation":"故事里老鼠都怕狼，小灰是一只老鼠。"},
      {"id":"babi-37-v2","chinese_text":"故事里，小鸟都怕铃声，松鼠都怕鞭炮声。小灰是一只松鼠。","question":"小灰怕什么声音？","choices":["鞭炮声","铃声","雨滴声"],"answer":"鞭炮声","explanation":"小灰是松鼠，故事里松鼠都怕鞭炮声。"},
      {"id":"babi-37-v3","chinese_text":"小灰在绿队。绿队的同学都是环保组的。环保组今天要给花浇水，红队今天要捡纸片。","question":"小灰今天要做什么？","choices":["捡纸片","读课文","给花浇水"],"answer":"给花浇水","explanation":"小灰在绿队，也就属于环保组。环保组今天要给花浇水。"},
      {"id":"babi-37-v4","chinese_text":"参加做书签的同学领到贴有红色标签的材料袋。所有贴有红色标签的袋子里都有彩带，贴白色标签的袋子里有胶棒。小灰参加了做书签。","question":"小灰领到的袋子里有什么？","choices":["铅笔","彩带","胶棒"],"answer":"彩带","explanation":"小灰参加做书签，所以拿到贴有红色标签的袋子。这种袋子里有彩带。"}
    ] },
    { id: "babi-38", source: "babi", source_author: "Jason Weston、Antoine Bordes、Sumit Chopra、Alexander M. Rush、Bart van Merriënboer、Armand Joulin、Tomas Mikolov", category: "conditions", variants: [
      {"id":"babi-38-v1","chinese_text":"在这个故事里，老鼠都怕狼。狼都怕老鼠。猫都怕羊。小圆是一只猫。小白是一只猫。小花是一只老鼠。羊都怕狼。小灰是一只羊。","question":"小灰怕什么？","choices":["狼","老鼠","猫"],"answer":"狼","explanation":"故事里羊都怕狼，小灰是一只羊。"},
      {"id":"babi-38-v2","chinese_text":"故事里，小兔都怕鼓声，小鹿都怕喇叭声。小灰是一只小鹿。","question":"小灰怕什么声音？","choices":["鼓声","雨滴声","喇叭声"],"answer":"喇叭声","explanation":"小灰是小鹿，故事里小鹿都怕喇叭声。"},
      {"id":"babi-38-v3","chinese_text":"小灰在黄队。黄队的同学都是器材组的。器材组今天要收跳绳，绿队今天要发毽子。","question":"小灰今天要做什么？","choices":["读课文","收跳绳","发毽子"],"answer":"收跳绳","explanation":"小灰在黄队，也就属于器材组。器材组今天要收跳绳。"},
      {"id":"babi-38-v4","chinese_text":"参加搭房子的同学领到贴有绿色标签的材料袋。所有贴有绿色标签的袋子里都有积木，贴白色标签的袋子里有橡皮泥。小灰参加了搭房子。","question":"小灰领到的袋子里有什么？","choices":["积木","橡皮泥","铅笔"],"answer":"积木","explanation":"小灰参加搭房子，所以拿到贴有绿色标签的袋子。这种袋子里有积木。"}
    ] },
    { id: "babi-39", source: "babi", source_author: "Jason Weston、Antoine Bordes、Sumit Chopra、Alexander M. Rush、Bart van Merriënboer、Armand Joulin、Tomas Mikolov", category: "conditions", variants: [
      {"id":"babi-39-v1","chinese_text":"在这个故事里，羊都怕猫。小圆是一只羊。老鼠都怕羊。猫都怕羊。狼都怕老鼠。小白是一只羊。小灰是一只羊。小花是一只老鼠。","question":"小圆怕什么？","choices":["老鼠","猫","狼"],"answer":"猫","explanation":"故事里羊都怕猫，小圆是一只羊。"},
      {"id":"babi-39-v2","chinese_text":"故事里，小狗都怕雷声，小猫都怕吸尘器的声音。小圆是一只小猫。","question":"小圆怕什么声音？","choices":["吸尘器的声音","雷声","雨滴声"],"answer":"吸尘器的声音","explanation":"小圆是小猫，故事里小猫都怕吸尘器的声音。"},
      {"id":"babi-39-v3","chinese_text":"小圆在橙队。橙队的同学都是美术组的。美术组今天要发画纸，黄队今天要收彩笔。","question":"小圆今天要做什么？","choices":["收彩笔","读课文","发画纸"],"answer":"发画纸","explanation":"小圆在橙队，也就属于美术组。美术组今天要发画纸。"},
      {"id":"babi-39-v4","chinese_text":"参加做纸灯笼的同学领到贴有橙色标签的材料袋。所有贴有橙色标签的袋子里都有彩纸，贴白色标签的袋子里有毛线。小圆参加了做纸灯笼。","question":"小圆领到的袋子里有什么？","choices":["铅笔","彩纸","毛线"],"answer":"彩纸","explanation":"小圆参加做纸灯笼，所以拿到贴有橙色标签的袋子。这种袋子里有彩纸。"}
    ] },
    { id: "babi-40", source: "babi", source_author: "Jason Weston、Antoine Bordes、Sumit Chopra、Alexander M. Rush、Bart van Merriënboer、Armand Joulin、Tomas Mikolov", category: "conditions", variants: [
      {"id":"babi-40-v1","chinese_text":"在这个故事里，老鼠都怕猫。小圆是一只老鼠。猫都怕羊。狼都怕老鼠。小白是一只老鼠。羊都怕老鼠。小灰是一只狼。小花是一只老鼠。","question":"小白怕什么？","choices":["猫","狼","羊"],"answer":"猫","explanation":"故事里老鼠都怕猫，小白是一只老鼠。"},
      {"id":"babi-40-v2","chinese_text":"故事里，小鹿都怕锣声，小羊都怕火车声。小白是一只小羊。","question":"小白怕什么声音？","choices":["锣声","雨滴声","火车声"],"answer":"火车声","explanation":"小白是小羊，故事里小羊都怕火车声。"},
      {"id":"babi-40-v3","chinese_text":"小白在紫队。紫队的同学都是服务组的。服务组今天要摆椅子，橙队今天要擦窗台。","question":"小白今天要做什么？","choices":["读课文","摆椅子","擦窗台"],"answer":"摆椅子","explanation":"小白在紫队，也就属于服务组。服务组今天要摆椅子。"},
      {"id":"babi-40-v4","chinese_text":"参加观察昆虫的同学领到贴有紫色标签的材料袋。所有贴有紫色标签的袋子里都有放大镜，贴白色标签的袋子里有纸尺。小白参加了观察昆虫。","question":"小白领到的袋子里有什么？","choices":["放大镜","纸尺","铅笔"],"answer":"放大镜","explanation":"小白参加观察昆虫，所以拿到贴有紫色标签的袋子。这种袋子里有放大镜。"}
    ] },
    { id: "babi-41", source: "babi", source_author: "Jason Weston、Antoine Bordes、Sumit Chopra、Alexander M. Rush、Bart van Merriënboer、Armand Joulin、Tomas Mikolov", category: "position", variants: [
      {"id":"babi-41-v1","chinese_text":"粉色长方形在三角形左边。三角形在红色正方形左边。","question":"粉色长方形在红色正方形的右边吗？","choices":["是","不是"],"answer":"不是","explanation":"从左到右是粉色长方形、三角形、红色正方形。"},
      {"id":"babi-41-v2","chinese_text":"铅笔、橡皮、尺子摆成一排。尺子在橡皮的左边，铅笔在橡皮的右边。","question":"尺子在铅笔的左边吗？","choices":["是","不是"],"answer":"是","explanation":"从左到右依次是尺子、橡皮、铅笔。所以尺子在铅笔的左边。"},
      {"id":"babi-41-v3","chinese_text":"橡皮、卷笔刀、尺子、铅笔摆成一排。尺子在橡皮的右边，铅笔在卷笔刀的右边，橡皮在铅笔的右边。","question":"最左边的是哪一个？","choices":["卷笔刀","铅笔","尺子"],"answer":"卷笔刀","explanation":"从左到右依次是卷笔刀、铅笔、橡皮、尺子。"},
      {"id":"babi-41-v4","chinese_text":"橡皮、尺子、铅笔排成一排。铅笔在尺子的左边，又在橡皮的右边。","question":"夹在另外两个中间的是哪一个？","choices":["橡皮","尺子","铅笔"],"answer":"铅笔","explanation":"从左到右依次是橡皮、铅笔、尺子。"}
    ] },
    { id: "babi-42", source: "babi", source_author: "Jason Weston、Antoine Bordes、Sumit Chopra、Alexander M. Rush、Bart van Merriënboer、Armand Joulin、Tomas Mikolov", category: "position", variants: [
      {"id":"babi-42-v1","chinese_text":"三角形在蓝色正方形上面，又在红色正方形下面。","question":"蓝色正方形在红色正方形的下面吗？","choices":["不是","是"],"answer":"是","explanation":"从上到下是红色正方形、三角形、蓝色正方形。"},
      {"id":"babi-42-v2","chinese_text":"云朵贴纸、太阳贴纸、月亮贴纸摆成一列。月亮贴纸在太阳贴纸的上面，云朵贴纸在太阳贴纸的下面。","question":"月亮贴纸在云朵贴纸的下面吗？","choices":["不是","是"],"answer":"不是","explanation":"从上到下依次是月亮贴纸、太阳贴纸、云朵贴纸。所以月亮贴纸在云朵贴纸的上面。"},
      {"id":"babi-42-v3","chinese_text":"太阳贴纸、星星贴纸、月亮贴纸、云朵贴纸摆成一列。月亮贴纸在太阳贴纸的下面，云朵贴纸在星星贴纸的下面，太阳贴纸在云朵贴纸的下面。","question":"最上面的是哪一个？","choices":["月亮贴纸","星星贴纸","云朵贴纸"],"answer":"星星贴纸","explanation":"从上到下依次是星星贴纸、云朵贴纸、太阳贴纸、月亮贴纸。"},
      {"id":"babi-42-v4","chinese_text":"太阳贴纸、月亮贴纸、云朵贴纸排成一列。云朵贴纸在月亮贴纸的上面，又在太阳贴纸的下面。","question":"夹在另外两个中间的是哪一个？","choices":["云朵贴纸","太阳贴纸","月亮贴纸"],"answer":"云朵贴纸","explanation":"从上到下依次是太阳贴纸、云朵贴纸、月亮贴纸。"}
    ] },
    { id: "babi-43", source: "babi", source_author: "Jason Weston、Antoine Bordes、Sumit Chopra、Alexander M. Rush、Bart van Merriënboer、Armand Joulin、Tomas Mikolov", category: "position", variants: [
      {"id":"babi-43-v1","chinese_text":"蓝色正方形在黄色正方形下面。红球在蓝色正方形下面。","question":"黄色正方形在红球的下面吗？","choices":["不是","是"],"answer":"不是","explanation":"从上到下是黄色正方形、蓝色正方形、红球。"},
      {"id":"babi-43-v2","chinese_text":"雨鞋卡片、雨伞卡片、雨衣卡片摆成一列。雨衣卡片在雨伞卡片的上面，雨鞋卡片在雨伞卡片的下面。","question":"雨衣卡片在雨鞋卡片的上面吗？","choices":["不是","是"],"answer":"是","explanation":"从上到下依次是雨衣卡片、雨伞卡片、雨鞋卡片。所以雨衣卡片在雨鞋卡片的上面。"},
      {"id":"babi-43-v3","chinese_text":"雨伞卡片、帽子卡片、雨衣卡片、雨鞋卡片摆成一列。雨衣卡片在雨伞卡片的下面，雨鞋卡片在帽子卡片的下面，雨伞卡片在雨鞋卡片的下面。","question":"最上面的是哪一个？","choices":["帽子卡片","雨鞋卡片","雨衣卡片"],"answer":"帽子卡片","explanation":"从上到下依次是帽子卡片、雨鞋卡片、雨伞卡片、雨衣卡片。"},
      {"id":"babi-43-v4","chinese_text":"雨伞卡片、雨衣卡片、雨鞋卡片排成一列。雨鞋卡片在雨衣卡片的上面，又在雨伞卡片的下面。","question":"夹在另外两个中间的是哪一个？","choices":["雨伞卡片","雨衣卡片","雨鞋卡片"],"answer":"雨鞋卡片","explanation":"从上到下依次是雨伞卡片、雨鞋卡片、雨衣卡片。"}
    ] },
    { id: "babi-44", source: "babi", source_author: "Jason Weston、Antoine Bordes、Sumit Chopra、Alexander M. Rush、Bart van Merriënboer、Armand Joulin、Tomas Mikolov", category: "position", variants: [
      {"id":"babi-44-v1","chinese_text":"三角形在红球左边。粉色长方形在红球右边。","question":"三角形在粉色长方形的左边吗？","choices":["不是","是"],"answer":"是","explanation":"从左到右是三角形、红球、粉色长方形。"},
      {"id":"babi-44-v2","chinese_text":"小熊、玩具车、布娃娃摆成一排。布娃娃在玩具车的左边，小熊在玩具车的右边。","question":"布娃娃在小熊的右边吗？","choices":["不是","是"],"answer":"不是","explanation":"从左到右依次是布娃娃、玩具车、小熊。所以布娃娃在小熊的左边。"},
      {"id":"babi-44-v3","chinese_text":"玩具车、积木、布娃娃、小熊摆成一排。布娃娃在玩具车的右边，小熊在积木的右边，玩具车在小熊的右边。","question":"最左边的是哪一个？","choices":["小熊","布娃娃","积木"],"answer":"积木","explanation":"从左到右依次是积木、小熊、玩具车、布娃娃。"},
      {"id":"babi-44-v4","chinese_text":"玩具车、布娃娃、小熊排成一排。小熊在布娃娃的左边，又在玩具车的右边。","question":"夹在另外两个中间的是哪一个？","choices":["布娃娃","小熊","玩具车"],"answer":"小熊","explanation":"从左到右依次是玩具车、小熊、布娃娃。"}
    ] },
    { id: "babi-45", source: "babi", source_author: "Jason Weston、Antoine Bordes、Sumit Chopra、Alexander M. Rush、Bart van Merriënboer、Armand Joulin、Tomas Mikolov", category: "position", variants: [
      {"id":"babi-45-v1","chinese_text":"三角形在红色正方形上面。红色正方形在粉色长方形上面。","question":"三角形在粉色长方形的上面吗？","choices":["不是","是"],"answer":"是","explanation":"从上到下是三角形、红色正方形、粉色长方形。"},
      {"id":"babi-45-v2","chinese_text":"一号卡片、二号卡片、三号卡片摆成一列。三号卡片在二号卡片的上面，一号卡片在二号卡片的下面。","question":"三号卡片在一号卡片的下面吗？","choices":["不是","是"],"answer":"不是","explanation":"从上到下依次是三号卡片、二号卡片、一号卡片。所以三号卡片在一号卡片的上面。"},
      {"id":"babi-45-v3","chinese_text":"二号卡片、四号卡片、三号卡片、一号卡片摆成一列。三号卡片在二号卡片的下面，一号卡片在四号卡片的下面，二号卡片在一号卡片的下面。","question":"最上面的是哪一个？","choices":["四号卡片","一号卡片","三号卡片"],"answer":"四号卡片","explanation":"从上到下依次是四号卡片、一号卡片、二号卡片、三号卡片。"},
      {"id":"babi-45-v4","chinese_text":"二号卡片、三号卡片、一号卡片排成一列。一号卡片在三号卡片的上面，又在二号卡片的下面。","question":"夹在另外两个中间的是哪一个？","choices":["二号卡片","三号卡片","一号卡片"],"answer":"一号卡片","explanation":"从上到下依次是二号卡片、一号卡片、三号卡片。"}
    ] },
    { id: "babi-46", source: "babi", source_author: "Jason Weston、Antoine Bordes、Sumit Chopra、Alexander M. Rush、Bart van Merriënboer、Armand Joulin、Tomas Mikolov", category: "size", variants: [
      {"id":"babi-46-v1","chinese_text":"行李箱能放进纸箱里。一块巧克力能放进行李箱里。","question":"纸箱能放进这块巧克力里吗？","choices":["不能","能"],"answer":"不能","explanation":"巧克力能放进行李箱，行李箱又能放进纸箱，纸箱比巧克力大。"},
      {"id":"babi-46-v2","chinese_text":"行李箱比纸箱小。巧克力比行李箱小。","question":"纸箱比巧克力大吗？","choices":["不是","是"],"answer":"是","explanation":"按从小到大排，依次是巧克力、行李箱、纸箱。"},
      {"id":"babi-46-v3","chinese_text":"糖果已经放进糖盒。现在，把装着糖果的糖盒放进礼物箱。旁边还放着一个篮子。","question":"装着糖果的东西里，最外面一层是什么？","choices":["糖盒","篮子","礼物箱"],"answer":"礼物箱","explanation":"糖果在糖盒里，而整个糖盒又放进了礼物箱。"},
      {"id":"babi-46-v4","chinese_text":"绿盒子比红盒子大，但比黄盒子小。","question":"这三个里面，哪一个最小？","choices":["黄盒子","红盒子","绿盒子"],"answer":"红盒子","explanation":"从小到大依次是红盒子、绿盒子、黄盒子。所以最小的是红盒子。"}
    ] },
    { id: "babi-47", source: "babi", source_author: "Jason Weston、Antoine Bordes、Sumit Chopra、Alexander M. Rush、Bart van Merriënboer、Armand Joulin、Tomas Mikolov", category: "size", variants: [
      {"id":"babi-47-v1","chinese_text":"纸箱能放进木箱里。巧克力能放进纸箱里。","question":"木箱比巧克力大吗？","choices":["不是","是"],"answer":"是","explanation":"纸箱装得下巧克力，木箱又装得下纸箱，所以木箱比巧克力大。"},
      {"id":"babi-47-v2","chinese_text":"纸箱比木箱小。巧克力比纸箱小。","question":"巧克力比木箱大吗？","choices":["不是","是"],"answer":"不是","explanation":"按从小到大排，依次是巧克力、纸箱、木箱。"},
      {"id":"babi-47-v3","chinese_text":"纸船已经放进鞋盒。现在，把装着纸船的鞋盒放进收纳箱。旁边还放着一个篮子。","question":"装着纸船的东西里，最外面一层是什么？","choices":["篮子","收纳箱","鞋盒"],"answer":"收纳箱","explanation":"纸船在鞋盒里，而整个鞋盒又放进了收纳箱。"},
      {"id":"babi-47-v4","chinese_text":"方形饼干比圆形饼干大，但比星形饼干小。","question":"这三个里面，哪一个最大？","choices":["星形饼干","方形饼干","圆形饼干"],"answer":"星形饼干","explanation":"从小到大依次是圆形饼干、方形饼干、星形饼干。所以最大的是星形饼干。"}
    ] },
    { id: "babi-48", source: "babi", source_author: "Jason Weston、Antoine Bordes、Sumit Chopra、Alexander M. Rush、Bart van Merriënboer、Armand Joulin、Tomas Mikolov", category: "size", variants: [
      {"id":"babi-48-v1","chinese_text":"行李箱能放进收纳箱。收纳箱能放进木箱。","question":"木箱比行李箱大吗？","choices":["不是","是"],"answer":"是","explanation":"木箱比收纳箱大，收纳箱又比行李箱大。"},
      {"id":"babi-48-v2","chinese_text":"收纳箱比木箱小。行李箱比收纳箱小。","question":"行李箱比木箱大吗？","choices":["不是","是"],"answer":"不是","explanation":"按从小到大排，依次是行李箱、收纳箱、木箱。"},
      {"id":"babi-48-v3","chinese_text":"积木已经放进文具盒。现在，把装着积木的文具盒放进书包。旁边还放着一个篮子。","question":"装着积木的东西里，最外面一层是什么？","choices":["文具盒","篮子","书包"],"answer":"书包","explanation":"积木在文具盒里，而整个文具盒又放进了书包。"},
      {"id":"babi-48-v4","chinese_text":"蓝皮球比红皮球大，但比绿皮球小。","question":"这三个里面，哪一个最小？","choices":["绿皮球","红皮球","蓝皮球"],"answer":"红皮球","explanation":"从小到大依次是红皮球、蓝皮球、绿皮球。所以最小的是红皮球。"}
    ] },
    { id: "babi-49", source: "babi", source_author: "Jason Weston、Antoine Bordes、Sumit Chopra、Alexander M. Rush、Bart van Merriënboer、Armand Joulin、Tomas Mikolov", category: "size", variants: [
      {"id":"babi-49-v1","chinese_text":"木箱比纸箱大。纸箱比收纳盒大。","question":"收纳盒比木箱大吗？","choices":["不是","是"],"answer":"不是","explanation":"纸箱已经比收纳盒大，木箱还要比纸箱大。"},
      {"id":"babi-49-v2","chinese_text":"纸箱比木箱小。收纳盒比纸箱小。","question":"木箱比收纳盒大吗？","choices":["不是","是"],"answer":"是","explanation":"按从小到大排，依次是收纳盒、纸箱、木箱。"},
      {"id":"babi-49-v3","chinese_text":"相片已经放进信封。现在，把装着相片的信封放进文件袋。旁边还放着一个篮子。","question":"装着相片的东西里，最外面一层是什么？","choices":["篮子","文件袋","信封"],"answer":"文件袋","explanation":"相片在信封里，而整个信封又放进了文件袋。"},
      {"id":"babi-49-v4","chinese_text":"玩具船比积木车大，但比布娃娃小。","question":"这三个里面，哪一个最大？","choices":["布娃娃","玩具船","积木车"],"answer":"布娃娃","explanation":"从小到大依次是积木车、玩具船、布娃娃。所以最大的是布娃娃。"}
    ] },
    { id: "babi-50", source: "babi", source_author: "Jason Weston、Antoine Bordes、Sumit Chopra、Alexander M. Rush、Bart van Merriënboer、Armand Joulin、Tomas Mikolov", category: "size", variants: [
      {"id":"babi-50-v1","chinese_text":"巧克力盒能放进行李箱。木箱比行李箱大。","question":"木箱比巧克力盒大吗？","choices":["不是","是"],"answer":"是","explanation":"行李箱装得下巧克力盒，木箱又比行李箱大。"},
      {"id":"babi-50-v2","chinese_text":"行李箱比木箱小。巧克力盒比行李箱小。","question":"巧克力盒比木箱大吗？","choices":["不是","是"],"answer":"不是","explanation":"按从小到大排，依次是巧克力盒、行李箱、木箱。"},
      {"id":"babi-50-v3","chinese_text":"玻璃珠已经放进铁盒。现在，把装着玻璃珠的铁盒放进抽屉。旁边还放着一个篮子。","question":"装着玻璃珠的东西里，最外面一层是什么？","choices":["抽屉","铁盒","篮子"],"answer":"抽屉","explanation":"玻璃珠在铁盒里，而整个铁盒又放进了抽屉。"},
      {"id":"babi-50-v4","chinese_text":"圆盒比方盒大，但比长盒小。","question":"这三个里面，哪一个最小？","choices":["圆盒","长盒","方盒"],"answer":"方盒","explanation":"从小到大依次是方盒、圆盒、长盒。所以最小的是方盒。"}
    ] },
    { id: "clutrr-01", source: "clutrr", source_author: "Koustuv Sinha, Shagun Sodhani, Jin Dong, Joelle Pineau, William L. Hamilton", category: "relationships", variants: [
      {"id":"clutrr-01-v1","chinese_text":"小莉请妈妈阿欣给她读故事。过了一会儿，小莉又请男孩小明帮忙种花。小明和小莉有同一个妈妈。","question":"小明是阿欣的谁？","choices":["儿子","女儿","弟弟"],"answer":"儿子","explanation":"阿欣是小莉的妈妈。小明是男孩，和小莉有同一个妈妈，所以小明是阿欣的儿子。"},
      {"id":"clutrr-01-v2","chinese_text":"小浩和小静是亲兄妹。吃饭时，小静给妈妈方阿姨夹了一块豆腐。","question":"方阿姨是小浩的谁？","choices":["姐姐","外婆","妈妈"],"answer":"妈妈","explanation":"小静和小浩是亲兄妹。方阿姨是小静的妈妈，也是小浩的妈妈。"},
      {"id":"clutrr-01-v3","chinese_text":"林阿姨的女儿叫小竹。小竹在树下等她的哥哥小松。","question":"谁是林阿姨的儿子？","choices":["小竹","小松","林阿姨"],"answer":"小松","explanation":"先找到林阿姨的女儿小竹，再找到小竹的哥哥小松。"},
      {"id":"clutrr-01-v4","chinese_text":"王阿姨的女儿小乔借了一本画册。小乔的亲姐妹小叶借的是故事书，小冬借的是连环画。","question":"王阿姨的另一个女儿是谁？","choices":["小叶","小冬","小乔"],"answer":"小叶","explanation":"小叶和王阿姨的女儿小乔是亲姐妹。小冬借什么书和亲属关系无关。"}
    ] },
    { id: "clutrr-02", source: "clutrr", source_author: "Koustuv Sinha, Shagun Sodhani, Jin Dong, Joelle Pineau, William L. Hamilton", category: "relationships", variants: [
      {"id":"clutrr-02-v1","chinese_text":"阿宁喜欢给女儿小海剪头发。小海的亲姐妹小兰学过理发，还教她们怎么剪。","question":"小兰是阿宁的谁？","choices":["姐妹","女儿","外孙女"],"answer":"女儿","explanation":"阿宁是小海的妈妈。小兰和小海是亲姐妹，所以小兰也是阿宁的女儿。"},
      {"id":"clutrr-02-v2","chinese_text":"小荷是小莲的亲妹妹。小莲早上和妈妈李阿姨一起买了菜。","question":"李阿姨是小荷的谁？","choices":["妈妈","妹妹","奶奶"],"answer":"妈妈","explanation":"小荷和小莲是亲姐妹。李阿姨是小莲的妈妈，也是小荷的妈妈。"},
      {"id":"clutrr-02-v3","chinese_text":"小红的妹妹叫小蓝。小红是陈叔叔的大女儿，她戴着一顶绿帽子。","question":"谁是陈叔叔的小女儿？","choices":["小红","陈叔叔","小蓝"],"answer":"小蓝","explanation":"小红是陈叔叔的大女儿。小红的妹妹小蓝是他的小女儿。"},
      {"id":"clutrr-02-v4","chinese_text":"周阿姨在等女儿小月。小月的亲姐妹小云最先跑来。邻居小雨递过来一本书。","question":"除了小月，谁也是周阿姨的女儿？","choices":["小雨","小云","周阿姨"],"answer":"小云","explanation":"小云是小月的亲姐妹，也是周阿姨的女儿。小雨递书这件事和亲属关系无关。"}
    ] },
    { id: "clutrr-03", source: "clutrr", source_author: "Koustuv Sinha, Shagun Sodhani, Jin Dong, Joelle Pineau, William L. Hamilton", category: "relationships", variants: [
      {"id":"clutrr-03-v1","chinese_text":"阿达和阿宁是同一个妈妈的两个孩子，两人正在布置聚会的房间。阿宁的女儿小露对妈妈说：“聚会一定很好玩！”","question":"小露是阿达的谁？","choices":["侄女","女儿","外甥女"],"answer":"外甥女","explanation":"阿宁和阿达有同一个妈妈。阿宁是小露的妈妈，小露是阿达亲姐妹的女儿，所以是他的外甥女。"},
      {"id":"clutrr-03-v2","chinese_text":"小夏帮妈妈阿青挂彩带。阿青的亲哥哥阿林把盒彩笔送了过来。","question":"阿林是小夏的谁？","choices":["叔叔","舅舅","哥哥"],"answer":"舅舅","explanation":"阿青是小夏的妈妈。妈妈的哥哥是小夏的舅舅。"},
      {"id":"clutrr-03-v3","chinese_text":"大文给亲妹妹阿禾送来一篮苹果。阿禾的儿子小原挑了一个最大、最红的。","question":"小原是大文的谁？","choices":["外甥","儿子","侄子"],"answer":"外甥","explanation":"阿禾是大文的亲妹妹。妹妹的儿子是大文的外甥。"},
      {"id":"clutrr-03-v4","chinese_text":"小安和妈妈阿秀做贺卡。阿秀的哥哥叫大成，邻居大齐来借了一把剪刀。","question":"小安该把写着“送给舅舅”的贺卡送给谁？","choices":["大齐","阿秀","大成"],"answer":"大成","explanation":"阿秀是小安的妈妈。大成是阿秀的哥哥，所以大成是小安的舅舅。"}
    ] },
    { id: "clutrr-04", source: "clutrr", source_author: "Koustuv Sinha, Shagun Sodhani, Jin Dong, Joelle Pineau, William L. Hamilton", category: "relationships", variants: [
      {"id":"clutrr-04-v1","chinese_text":"阿莉和阿宁是姐妹，家中只有她们两个孩子。阿莉把儿子小东养大，这件事最让她自豪。","question":"小东是阿宁的谁？","choices":["外甥","儿子","侄子"],"answer":"外甥","explanation":"阿莉是阿宁的亲姐妹。阿莉的儿子是阿宁的外甥。"},
      {"id":"clutrr-04-v2","chinese_text":"小星在等妈妈阿芸。阿芸的妹妹阿洁从车站出来，手里拿着一张蓝色的票。","question":"阿洁是小星的谁？","choices":["姑姑","妈妈","小姨"],"answer":"小姨","explanation":"小星的妈妈是阿芸。妈妈的妹妹是小姨。"},
      {"id":"clutrr-04-v3","chinese_text":"阿燕的姐姐阿萍画了一只鸟，阿萍的女儿小梅给鸟涂上黄色。","question":"小梅是阿燕的谁？","choices":["侄女","外甥女","姐妹"],"answer":"外甥女","explanation":"阿萍是阿燕的姐姐。姐姐的女儿是阿燕的外甥女。"},
      {"id":"clutrr-04-v4","chinese_text":"阿美把蛋糕端上桌。阿美的儿子小树先切一块给阿美的姐姐阿真，又切一块给邻居阿秀。","question":"小树的姨妈是谁？","choices":["阿真","阿秀","阿美"],"answer":"阿真","explanation":"小树的妈妈是阿美。阿真是阿美的姐姐，也就是小树的姨妈。"}
    ] },
    { id: "clutrr-05", source: "clutrr", source_author: "Koustuv Sinha, Shagun Sodhani, Jin Dong, Joelle Pineau, William L. Hamilton", category: "relationships", variants: [
      {"id":"clutrr-05-v1","chinese_text":"小海和小兰是亲姐妹，她们在屋外玩。小海的妈妈阿宁在门口叫小海回屋。","question":"阿宁是小兰的谁？","choices":["外婆","妈妈","姐姐"],"answer":"妈妈","explanation":"小海和小兰是亲姐妹。阿宁是小海的妈妈，也是小兰的妈妈。"},
      {"id":"clutrr-05-v2","chinese_text":"宋叔叔叫儿子小川回家吃饭。小川的亲兄弟小江还在操场上。","question":"除了小川，谁也是宋叔叔的儿子？","choices":["小江","小川","宋叔叔"],"answer":"小江","explanation":"宋叔叔是小川的爸爸。小江是小川的亲兄弟，也是宋叔叔的儿子。"},
      {"id":"clutrr-05-v3","chinese_text":"小贝陪妈妈何阿姨去邮局。在邮局，小贝写道：“小米是我的亲妹妹。”","question":"小米应该叫何阿姨什么？","choices":["姐姐","老师","妈妈"],"answer":"妈妈","explanation":"写信的小贝和小米是亲姐妹。何阿姨是小贝的妈妈，也是小米的妈妈。"},
      {"id":"clutrr-05-v4","chinese_text":"小然和小乐是亲兄弟。小乐的爸爸余叔叔在门口等他们，邻居程叔叔提着菜经过。","question":"小然的爸爸是谁？","choices":["程叔叔","余叔叔","小乐"],"answer":"余叔叔","explanation":"余叔叔是小乐的爸爸。小然和小乐是亲兄弟，所以余叔叔也是小然的爸爸。"}
    ] },
    { id: "clutrr-06", source: "clutrr", source_author: "Koustuv Sinha, Shagun Sodhani, Jin Dong, Joelle Pineau, William L. Hamilton", category: "relationships", variants: [
      {"id":"clutrr-06-v1","chinese_text":"阿乔给儿子小杰买了冰激凌。小杰的亲兄弟小东正在帮他复习功课，准备考试。","question":"阿乔是小东的谁？","choices":["哥哥","爷爷","爸爸"],"answer":"爸爸","explanation":"阿乔是小杰的爸爸。小杰和小东是亲兄弟，所以阿乔也是小东的爸爸。"},
      {"id":"clutrr-06-v2","chinese_text":"小利和小平是亲兄弟。小平的爸爸何叔叔买了一袋面包。","question":"谁是何叔叔的另一个儿子？","choices":["何叔叔","小利","小平"],"answer":"小利","explanation":"何叔叔的儿子小平还有一个亲兄弟小利。"},
      {"id":"clutrr-06-v3","chinese_text":"小欣的妈妈方阿姨写了一张便条。小欣说：“小慧和我有同一个妈妈。我先去拿伞，再叫小慧过来。”","question":"方阿姨是小慧的谁？","choices":["妈妈","妹妹","老师"],"answer":"妈妈","explanation":"方阿姨是小欣的妈妈。小慧和小欣有同一个妈妈，所以方阿姨也是小慧的妈妈。"},
      {"id":"clutrr-06-v4","chinese_text":"小成和小满跟他们的爸爸去菜场。小满对陈叔叔说：“爸爸，我想买豆腐。”卖豆腐的是周叔叔。","question":"谁是小成的爸爸？","choices":["周叔叔","小成","陈叔叔"],"answer":"陈叔叔","explanation":"小成和小满跟着同一个爸爸去菜场。小满叫陈叔叔“爸爸”，所以陈叔叔也是小成的爸爸。"}
    ] },
    { id: "clutrr-07", source: "clutrr", source_author: "Koustuv Sinha, Shagun Sodhani, Jin Dong, Joelle Pineau, William L. Hamilton", category: "relationships", variants: [
      {"id":"clutrr-07-v1","chinese_text":"阿欣给自己的女儿阿宁带来了一个蛋糕。阿宁的女儿小兰很想吃这个蛋糕。","question":"阿欣是小兰的谁？","choices":["外婆","奶奶","妈妈"],"answer":"外婆","explanation":"阿宁是小兰的妈妈。阿欣是阿宁的妈妈，所以小兰叫阿欣外婆。"},
      {"id":"clutrr-07-v2","chinese_text":"小雪和爸爸大山一起折船。大山的妈妈阿芳给他们拿来了纸。","question":"阿芳是小雪的谁？","choices":["外婆","妈妈","奶奶"],"answer":"奶奶","explanation":"小雪的爸爸是大山。爸爸的妈妈是奶奶。"},
      {"id":"clutrr-07-v3","chinese_text":"马奶奶把围巾送给儿子小峰。小峰的女儿小花帮爸爸围好。","question":"小花是马奶奶的谁？","choices":["女儿","孙女","外孙女"],"answer":"孙女","explanation":"小峰是马奶奶的儿子。儿子的女儿是马奶奶的孙女。"},
      {"id":"clutrr-07-v4","chinese_text":"小桥拉着妈妈阿苹的手。阿苹的妈妈林奶奶坐在长椅旁。徐奶奶给小桥一颗糖。","question":"谁是小桥的外婆？","choices":["林奶奶","徐奶奶","阿苹"],"answer":"林奶奶","explanation":"阿苹是小桥的妈妈，林奶奶又是阿苹的妈妈。给糖的人是徐奶奶。"}
    ] },
    { id: "clutrr-08", source: "clutrr", source_author: "Koustuv Sinha, Shagun Sodhani, Jin Dong, Joelle Pineau, William L. Hamilton", category: "relationships", variants: [
      {"id":"clutrr-08-v1","chinese_text":"阿珍带爸爸阿康和女儿小贝一起去公园。","question":"阿康是小贝的谁？","choices":["爷爷","外公","爸爸"],"answer":"外公","explanation":"阿珍是小贝的妈妈。妈妈的爸爸是外公。"},
      {"id":"clutrr-08-v2","chinese_text":"钱爷爷的女儿阿杏在阳台给花浇水。阿杏的儿子小宇在屋里收拾书包。","question":"小宇是钱爷爷的谁？","choices":["外孙","孙子","儿子"],"answer":"外孙","explanation":"阿杏是钱爷爷的女儿。女儿的儿子是外孙。"},
      {"id":"clutrr-08-v3","chinese_text":"小水的爸爸大川在打电话：“爸，我带小水过桥来找你。”跟大川通话的人是张文。","question":"小水该怎么称呼张文？","choices":["外公","爸爸","爷爷"],"answer":"爷爷","explanation":"小水的爸爸大川叫张文“爸”。张文是小水爸爸的爸爸，所以小水叫他爷爷。"},
      {"id":"clutrr-08-v4","chinese_text":"李爷爷是阿桃的爸爸。赵爷爷带了望远镜，阿桃的女儿小芽在看天上的鸟。","question":"谁是小芽的外公？","choices":["赵爷爷","李爷爷","阿桃"],"answer":"李爷爷","explanation":"阿桃是小芽的妈妈。李爷爷是阿桃的爸爸，所以他是小芽的外公。"}
    ] },
    { id: "clutrr-09", source: "clutrr", source_author: "Koustuv Sinha, Shagun Sodhani, Jin Dong, Joelle Pineau, William L. Hamilton", category: "relationships", variants: [
      {"id":"clutrr-09-v1","chinese_text":"上周末，阿雅带亲妹妹阿宁去游乐园。小兰给妈妈阿宁打电话，说自己很快就回家。","question":"阿雅是小兰的谁？","choices":["姑姑","妈妈","姨妈"],"answer":"姨妈","explanation":"小兰的妈妈是阿宁。阿雅是阿宁的姐姐，所以是小兰的姨妈。"},
      {"id":"clutrr-09-v2","chinese_text":"小米的爸爸叫大川。大川的亲妹妹阿河在楼下等他。","question":"阿河是小米的谁？","choices":["小姨","姑姑","妹妹"],"answer":"姑姑","explanation":"小米的爸爸是大川。爸爸的妹妹是小米的姑姑。"},
      {"id":"clutrr-09-v3","chinese_text":"姐姐阿芳把书送给亲妹妹阿草，阿草的女儿小林帮妈妈把书摆好。","question":"小林是阿芳的谁？","choices":["外甥女","女儿","侄女"],"answer":"外甥女","explanation":"阿草是阿芳的妹妹。妹妹的女儿是阿芳的外甥女。"},
      {"id":"clutrr-09-v4","chinese_text":"阿月让儿子小泽带上水壶。阿月的妹妹阿星带了一盒饼干，邻居阿花带了几个橘子。","question":"谁是小泽的小姨？","choices":["阿花","阿月","阿星"],"answer":"阿星","explanation":"小泽的妈妈是阿月。阿星是妈妈的妹妹，所以是小泽的小姨。"}
    ] },
    { id: "clutrr-10", source: "clutrr", source_author: "Koustuv Sinha, Shagun Sodhani, Jin Dong, Joelle Pineau, William L. Hamilton", category: "relationships", variants: [
      {"id":"clutrr-10-v1","chinese_text":"阿莉和儿子小丁去买万圣节的糖果。阿康正给自己的女儿阿莉挑一条新裙子。","question":"小丁是阿康的谁？","choices":["外孙","孙子","儿子"],"answer":"外孙","explanation":"阿莉是阿康的女儿，女儿的儿子是他的外孙。"},
      {"id":"clutrr-10-v2","chinese_text":"黄爷爷叫女儿阿琳来吃面。阿琳的儿子小石先到桌边。","question":"黄爷爷是小石的谁？","choices":["爷爷","爸爸","外公"],"answer":"外公","explanation":"阿琳是小石的妈妈。妈妈的爸爸是小石的外公。"},
      {"id":"clutrr-10-v3","chinese_text":"王爷爷的儿子阿勇在打扫屋子。阿勇的女儿小琴提来一桶水。","question":"小琴是王爷爷的谁？","choices":["外孙女","孙女","女儿"],"answer":"孙女","explanation":"阿勇是王爷爷的儿子。儿子的女儿是孙女。"},
      {"id":"clutrr-10-v4","chinese_text":"赵奶奶在门边等女儿阿柳。阿柳带来自己的儿子小麦。邻居钱叔叔领着儿子小谷从门口走过。","question":"谁是赵奶奶的外孙？","choices":["小麦","小谷","钱叔叔"],"answer":"小麦","explanation":"阿柳是赵奶奶的女儿，阿柳的儿子小麦是赵奶奶的外孙。"}
    ] },
    { id: "clutrr-11", source: "clutrr", source_author: "Koustuv Sinha, Shagun Sodhani, Jin Dong, Joelle Pineau, William L. Hamilton", category: "relationships", variants: [
      {"id":"clutrr-11-v1","chinese_text":"阿莉过生日时，儿子小东给她送了花。男孩小杰也很爱自己的妈妈阿莉。","question":"小东和小杰是什么关系？","choices":["父子","亲兄弟","爷孙"],"answer":"亲兄弟","explanation":"小东是阿莉的儿子，小杰的妈妈也是阿莉。这两个男孩是亲兄弟。"},
      {"id":"clutrr-11-v2","chinese_text":"男孩小朗的妈妈秦阿姨买了两盒酸奶。比小朗小两岁的女孩小晴放下书包，跟秦阿姨说：“妈妈，我想喝原味的。”","question":"小朗和小晴是什么关系？","choices":["亲兄妹","父女","母女"],"answer":"亲兄妹","explanation":"秦阿姨是小朗的妈妈，小晴也叫秦阿姨妈妈。小朗是男孩，小晴是女孩，他们是一对亲兄妹。"},
      {"id":"clutrr-11-v3","chinese_text":"白叔叔把足球递给小石。小石说：“我和小木有同一个爸爸。他已经去球场等我们了。”在球场等他们的是小石的爸爸陆叔叔。","question":"谁是小木的爸爸？","choices":["小石","白叔叔","陆叔叔"],"answer":"陆叔叔","explanation":"小石说他和小木有同一个爸爸，所以陆叔叔也是小木的爸爸。"},
      {"id":"clutrr-11-v4","chinese_text":"小圆把一串彩灯拿给阿晴。阿晴的两个女儿小方和小角走过来，一人拿住一头。","question":"小方和小角是什么关系？","choices":["母女","亲姐妹","外婆和外孙女"],"answer":"亲姐妹","explanation":"小方和小角都是阿晴的女儿。她们是同一个妈妈的两个女儿，也就是亲姐妹。"}
    ] },
    { id: "clutrr-12", source: "clutrr", source_author: "Koustuv Sinha, Shagun Sodhani, Jin Dong, Joelle Pineau, William L. Hamilton", category: "relationships", variants: [
      {"id":"clutrr-12-v1","chinese_text":"阿莉向自己的兄弟小明借了一点钱。阿莉的儿子小丁周末见不到妈妈，很想她。","question":"小明是小丁的谁？","choices":["叔叔","哥哥","舅舅"],"answer":"舅舅","explanation":"阿莉是小丁的妈妈。妈妈的兄弟是小丁的舅舅。"},
      {"id":"clutrr-12-v2","chinese_text":"大平的妹妹阿静带着她的儿子小飞去地铁站。小飞提着一个绿袋子。","question":"小飞是大平的谁？","choices":["儿子","外甥","侄子"],"answer":"外甥","explanation":"阿静是大平的妹妹。妹妹的儿子是大平的外甥。"},
      {"id":"clutrr-12-v3","chinese_text":"小加的爸爸阿林喜欢下棋。阿林的弟弟大丰把棋盘放上桌。","question":"大丰是小加的谁？","choices":["叔叔","舅舅","爸爸"],"answer":"叔叔","explanation":"阿林是小加的爸爸。爸爸的弟弟是叔叔。"},
      {"id":"clutrr-12-v4","chinese_text":"小青的妈妈叫阿文。阿文的哥哥大江和邻居大海帮忙搬椅子。","question":"小青应该叫谁舅舅？","choices":["大海","阿文","大江"],"answer":"大江","explanation":"小青的妈妈是阿文。大江是阿文的哥哥，所以小青叫大江舅舅。"}
    ] },
    { id: "clutrr-13", source: "clutrr", source_author: "Koustuv Sinha, Shagun Sodhani, Jin Dong, Joelle Pineau, William L. Hamilton", category: "relationships", variants: [
      {"id":"clutrr-13-v1","chinese_text":"阿伟带女儿小海去吃冰激凌。他的另一个女儿小露还在学校，不能一起去。","question":"小海和小露是什么关系？","choices":["亲姐妹","母女","奶奶和孙女"],"answer":"亲姐妹","explanation":"她们的爸爸都是阿伟。两个女孩是亲姐妹。"},
      {"id":"clutrr-13-v2","chinese_text":"乔叔叔的儿子小勇正在喂鱼。他的另一个儿子小龙拿来了鱼食。","question":"小勇和小龙是什么关系？","choices":["父子","爷孙","亲兄弟"],"answer":"亲兄弟","explanation":"小勇是乔叔叔的儿子，小龙也是乔叔叔的儿子。他们是亲兄弟。"},
      {"id":"clutrr-13-v3","chinese_text":"李叔叔的大女儿叫小语，小女儿叫小画。小语把自己的书借给了小画。","question":"小画是小语的谁？","choices":["姐姐","妹妹","妈妈"],"answer":"妹妹","explanation":"两人都是李叔叔的女儿。小语是大女儿，小画是小女儿，所以小画是小语的妹妹。"},
      {"id":"clutrr-13-v4","chinese_text":"林叔叔的儿子小树要跟另一个儿子小禾下棋。邻居小马来帮他们摆棋子。","question":"下棋时，谁和小树是一对亲兄弟？","choices":["小禾","小马","林叔叔"],"answer":"小禾","explanation":"小树和小禾有同一个爸爸。小马是来帮忙的邻居。"}
    ] },
    { id: "clutrr-14", source: "clutrr", source_author: "Koustuv Sinha, Shagun Sodhani, Jin Dong, Joelle Pineau, William L. Hamilton", category: "relationships", variants: [
      {"id":"clutrr-14-v1","chinese_text":"阿欣借用了儿子阿伟的手机。阿伟的女儿小海看到后一点也不惊讶。","question":"小海是阿欣的谁？","choices":["女儿","孙女","外孙女"],"answer":"孙女","explanation":"阿伟是阿欣的儿子。儿子的女儿是阿欣的孙女。"},
      {"id":"clutrr-14-v2","chinese_text":"车站里，小夏等着爸爸阿力。阿力的妈妈何阿姨让小夏先坐一会儿。","question":"何阿姨是小夏的谁？","choices":["奶奶","妈妈","外婆"],"answer":"奶奶","explanation":"小夏的爸爸是阿力。爸爸的妈妈是小夏的奶奶。"},
      {"id":"clutrr-14-v3","chinese_text":"林奶奶把一篮梨交给女儿阿娟。阿娟的女儿小元挑了个小梨。","question":"小元是林奶奶的谁？","choices":["女儿","孙女","外孙女"],"answer":"外孙女","explanation":"阿娟是林奶奶的女儿。女儿的女儿是外孙女。"},
      {"id":"clutrr-14-v4","chinese_text":"小原的爸爸大文作了一幅画。大文的妈妈叶阿姨找来一根绳子，邻居孟阿姨找来一个夹子。","question":"小原的奶奶是谁？","choices":["孟阿姨","叶阿姨","大文"],"answer":"叶阿姨","explanation":"大文是小原的爸爸。叶阿姨是大文的妈妈，所以她是小原的奶奶。"}
    ] },
    { id: "clutrr-15", source: "clutrr", source_author: "Koustuv Sinha, Shagun Sodhani, Jin Dong, Joelle Pineau, William L. Hamilton", category: "relationships", variants: [
      {"id":"clutrr-15-v1","chinese_text":"阿达忙着和女儿小夏商量去露营的事。阿达的妈妈阿欣去参加感恩节的活动了。","question":"阿欣是小夏的谁？","choices":["外婆","妈妈","奶奶"],"answer":"奶奶","explanation":"阿达是小夏的爸爸。爸爸的妈妈是小夏的奶奶。"},
      {"id":"clutrr-15-v2","chinese_text":"小甜的妈妈阿桃戴好草帽。阿桃的妈妈方阿姨递给她一篮草莓。","question":"方阿姨是小甜的谁？","choices":["奶奶","外婆","妈妈"],"answer":"外婆","explanation":"小甜的妈妈是阿桃。妈妈的妈妈是小甜的外婆。"},
      {"id":"clutrr-15-v3","chinese_text":"田奶奶说：“阿昌是我的儿子。阿昌带着他女儿小贝去找松果了。”","question":"小贝是田奶奶的谁？","choices":["孙女","外孙女","女儿"],"answer":"孙女","explanation":"田奶奶说阿昌是她的儿子。儿子的女儿是她的孙女。"},
      {"id":"clutrr-15-v4","chinese_text":"小可说：“我的爸爸叫大同。”大同的妈妈胡阿姨在刷杯子，邻居沙阿姨在擦桌子。","question":"谁是小可的奶奶？","choices":["沙阿姨","大同","胡阿姨"],"answer":"胡阿姨","explanation":"大同是小可的爸爸。胡阿姨是大同的妈妈，所以她是小可的奶奶。"}
    ] },
    { id: "clutrr-16", source: "clutrr", source_author: "Koustuv Sinha, Shagun Sodhani, Jin Dong, Joelle Pineau, William L. Hamilton", category: "relationships", variants: [
      {"id":"clutrr-16-v1","chinese_text":"小海和小琳是亲姐妹，都想玩同一个布娃娃。小海的妈妈阿宁让她们轮流玩。","question":"阿宁是小琳的谁？","choices":["妈妈","姐姐","奶奶"],"answer":"妈妈","explanation":"小海和小琳是亲姐妹。阿宁是小海的妈妈，也是小琳的妈妈。"},
      {"id":"clutrr-16-v2","chinese_text":"蒋阿姨的儿子小光去拿毽子。小光的亲妹妹小霞在门口等。","question":"小霞是蒋阿姨的谁？","choices":["妹妹","外孙女","女儿"],"answer":"女儿","explanation":"小光是蒋阿姨的儿子。小霞是小光的亲妹妹，也是蒋阿姨的女儿。"},
      {"id":"clutrr-16-v3","chinese_text":"小眉和小云是亲姐妹。小云的爸爸周叔叔在修车。","question":"谁是小眉的爸爸？","choices":["小云","周叔叔","小眉"],"answer":"周叔叔","explanation":"小眉和小云是亲姐妹。周叔叔是小云的爸爸，也是小眉的爸爸。"},
      {"id":"clutrr-16-v4","chinese_text":"小鹿和小欢是亲姐妹。小欢的妈妈何阿姨拿来三颗棋子，邻居常阿姨摆好棋盘。","question":"谁是小鹿的妈妈？","choices":["何阿姨","常阿姨","小欢"],"answer":"何阿姨","explanation":"小鹿和小欢是亲姐妹，何阿姨是小欢的妈妈，也是小鹿的妈妈。"}
    ] },
    { id: "clutrr-17", source: "clutrr", source_author: "Koustuv Sinha, Shagun Sodhani, Jin Dong, Joelle Pineau, William L. Hamilton", category: "relationships", variants: [
      {"id":"clutrr-17-v1","chinese_text":"阿明带儿子小德去钓鱼。回去时，两人送了几条鱼给小梅。小德和小梅有同一个爸爸。","question":"阿明是小梅的谁？","choices":["爷爷","爸爸","弟弟"],"answer":"爸爸","explanation":"阿明是小德的爸爸。小梅和小德是同一个爸爸的两个孩子，阿明也是小梅的爸爸。"},
      {"id":"clutrr-17-v2","chinese_text":"小竹和小苗是亲姐妹。小苗帮爸爸陆叔叔找到了雨衣。","question":"陆叔叔是小竹的谁？","choices":["爸爸","叔叔","哥哥"],"answer":"爸爸","explanation":"小竹和小苗是亲姐妹。陆叔叔是小苗的爸爸，也是小竹的爸爸。"},
      {"id":"clutrr-17-v3","chinese_text":"邹叔叔教女儿小夏写字。小夏的亲哥哥小安正收起自己的练习本。","question":"小安是邹叔叔的谁？","choices":["哥哥","叔叔","儿子"],"answer":"儿子","explanation":"小夏是邹叔叔的女儿。小安是小夏的亲哥哥，也是邹叔叔的儿子。"},
      {"id":"clutrr-17-v4","chinese_text":"小羊帮妈妈王阿姨端碗。金阿姨给小羊扶门。小羊说：“小牛和我有同一个妈妈，他也想来帮忙。”","question":"谁是小牛的妈妈？","choices":["金阿姨","王阿姨","小羊"],"answer":"王阿姨","explanation":"小牛和小羊有同一个妈妈。王阿姨是小羊的妈妈，也是小牛的妈妈。"}
    ] },
    { id: "clutrr-18", source: "clutrr", source_author: "Koustuv Sinha, Shagun Sodhani, Jin Dong, Joelle Pineau, William L. Hamilton", category: "relationships", variants: [
      {"id":"clutrr-18-v1","chinese_text":"小珍毕业了，爸爸阿明看到后很自豪。阿明的爸爸阿康看见他这么高兴，也很开心。","question":"阿康是小珍的谁？","choices":["爸爸","外公","爷爷"],"answer":"爷爷","explanation":"阿明是小珍的爸爸。爸爸的爸爸是小珍的爷爷。"},
      {"id":"clutrr-18-v2","chinese_text":"阿桥陪妈妈阿苹去看花灯。阿苹的爸爸老许站在桥边等他们。","question":"老许是阿桥的谁？","choices":["爸爸","外公","爷爷"],"answer":"外公","explanation":"阿苹是阿桥的妈妈。妈妈的爸爸是阿桥的外公。"},
      {"id":"clutrr-18-v3","chinese_text":"钱爷爷给自己的儿子阿峰借了一顶帽子。阿峰的儿子小俊把帽子放进书包。","question":"小俊是钱爷爷的谁？","choices":["孙子","外孙","儿子"],"answer":"孙子","explanation":"阿峰是钱爷爷的儿子。儿子的儿子是他的孙子。"},
      {"id":"clutrr-18-v4","chinese_text":"小松的爸爸大石带了四个橘子。大石的爸爸老周带了一个保温杯，邻居老宋背着布袋。","question":"谁是小松的爷爷？","choices":["老宋","大石","老周"],"answer":"老周","explanation":"大石是小松的爸爸。老周是大石的爸爸，所以老周是小松的爷爷。"}
    ] },
    { id: "clutrr-19", source: "clutrr", source_author: "Koustuv Sinha, Shagun Sodhani, Jin Dong, Joelle Pineau, William L. Hamilton", category: "relationships", variants: [
      {"id":"clutrr-19-v1","chinese_text":"小德请家里的女孩小娜一起去看流星，他们有同一个妈妈。阿雅是小德的妈妈，她给了儿子毯子和点心。","question":"小娜是阿雅的谁？","choices":["女儿","亲姐妹","孙女"],"answer":"女儿","explanation":"阿雅是小德的妈妈，小德和小娜有同一个妈妈，所以小娜也是阿雅的女儿。"},
      {"id":"clutrr-19-v2","chinese_text":"小乔和小景是一对亲姐弟。小景帮妈妈刘阿姨把晾干的毛巾收起来。","question":"刘阿姨是小乔的谁？","choices":["姐姐","奶奶","妈妈"],"answer":"妈妈","explanation":"小乔和小景是亲姐弟。刘阿姨是小景的妈妈，也是小乔的妈妈。"},
      {"id":"clutrr-19-v3","chinese_text":"郭叔叔和儿子阿星在看窗外的月亮。阿星的亲妹妹小云把灯关了，屋里变暗了。","question":"在故事里，郭叔叔的女儿是谁？","choices":["阿星","小云","郭叔叔"],"answer":"小云","explanation":"阿星是郭叔叔的儿子。小云是阿星的亲妹妹，也是郭叔叔的女儿。"},
      {"id":"clutrr-19-v4","chinese_text":"陶阿姨的儿子小航说：“我拿手电筒，小舟来画月亮。她是我的妹妹，我们有同一个妈妈。”邻居小帆把门打开了。","question":"谁是陶阿姨的女儿？","choices":["小舟","小帆","小航"],"answer":"小舟","explanation":"陶阿姨是小航的妈妈。小舟是小航的妹妹，也是陶阿姨的女儿。"}
    ] },
    { id: "clutrr-20", source: "clutrr", source_author: "Koustuv Sinha, Shagun Sodhani, Jin Dong, Joelle Pineau, William L. Hamilton", category: "relationships", variants: [
      {"id":"clutrr-20-v1","chinese_text":"阿欣打电话告诉儿子阿明，镇上新开了一个游乐园。阿明打算带年幼的儿子小德去那里玩。","question":"小德是阿欣的谁？","choices":["外孙","孙子","儿子"],"answer":"孙子","explanation":"阿明是阿欣的儿子。儿子的儿子是阿欣的孙子。"},
      {"id":"clutrr-20-v2","chinese_text":"孟爷爷的女儿阿禾想去图书馆。阿禾的儿子小平还在门口绑鞋带。","question":"小平是孟爷爷的谁？","choices":["外孙","孙子","儿子"],"answer":"外孙","explanation":"阿禾是孟爷爷的女儿。女儿的儿子是他的外孙。"},
      {"id":"clutrr-20-v3","chinese_text":"阿山带儿子小杨坐地铁。阿山的妈妈陈阿姨已经在地铁站等他们。","question":"陈阿姨是小杨的谁？","choices":["妈妈","外婆","奶奶"],"answer":"奶奶","explanation":"阿山是小杨的爸爸。爸爸的妈妈是小杨的奶奶。"},
      {"id":"clutrr-20-v4","chinese_text":"许爷爷的儿子叫大明。大明的孩子小瑞是男孩，邻居小达也来玩了。","question":"谁是许爷爷的孙子？","choices":["小达","小瑞","大明"],"answer":"小瑞","explanation":"大明是许爷爷的儿子，小瑞是大明的儿子。儿子的儿子是孙子。"}
    ] }
  ];
  const bank = { version, sources, categories, groups };
  if (typeof module === 'object' && module.exports) module.exports = bank;
  else root.ReadingQuestBank = bank;
})(typeof window === 'object' ? window : globalThis);
