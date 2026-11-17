/* ============================================================
   lexikon.js — 世界语词素表
   数据依据：Fundamento de Esperanto 附录官方词缀表
             （10 个官方前缀 + 31 个官方后缀 + 6 个分词后缀）
   cls 词根语义类别：
     ag   动作（可加 -i/-as/-is/-os）
     obj  具体事物
     prop 性质状态
     liv  有生命
     num  数词
     rel  指示关系
   ============================================================ */
const LEXIKON = {

  /* ---------- 官方前缀 10 个 ---------- */
  pre: {
    "bo":  { zh: "姻亲关系",  gl: "-in-law", ex: ["bopatro", "岳父"] },
    "dis": { zh: "分散、四散", gl: "分开",     ex: ["disdoni", "分发"] },
    "ek":  { zh: "开始、瞬间", gl: "起动",     ex: ["ekdormi", "入睡"] },
    "eks": { zh: "前任",      gl: "前",       ex: ["eksedzo", "前夫"] },
    "fi":  { zh: "贬义、卑劣", gl: "贬",       ex: ["fivorto", "脏话"] },
    "ge":  { zh: "两性合称",   gl: "双",       ex: ["gepatroj", "父母"] },
    "mal": { zh: "反义",      gl: "反",       ex: ["malgranda", "小的"] },
    "mis": { zh: "错误地",     gl: "误",       ex: ["miskompreni", "误解"] },
    "pra": { zh: "远古、隔代", gl: "曾／原",    ex: ["praavo", "曾祖父"] },
    "re":  { zh: "再次、回来", gl: "再",       ex: ["reskribi", "重写"] }
  },

  /* ---------- 官方后缀 31 个 + 6 个分词后缀 ---------- */
  suf: {
    "aĉ":  { zh: "劣质、贬义",       from: ["ag","obj","prop","liv"], to: "same", ex: ["domaĉo", "破屋"] },
    "ad":  { zh: "持续动作；动作本身", from: ["ag"], to: "ag", ex: ["kurado", "持续奔跑"] },
    "aĵ":  { zh: "具体物、产物",     from: ["ag","obj","prop"], to: "obj", ex: ["manĝaĵo", "食物"] },
    "an":  { zh: "成员、居民",       from: ["obj","prop","liv"], to: "liv", ex: ["vilaĝano", "村民"] },
    "ar":  { zh: "集合体",          from: ["obj","liv"], to: "obj", ex: ["arbaro", "森林"] },
    "ĉj":  { zh: "男性昵称（截断词根）", from: ["liv"], to: "liv", nick: true, ex: ["paĉjo", "爸爸"] },
    "ebl": { zh: "可能、可…的",      from: ["ag"], to: "prop", ex: ["videbla", "可见的"] },
    "ec":  { zh: "抽象性质",         from: ["ag","obj","prop","liv"], to: "prop", ex: ["amikeco", "友谊"] },
    "eg":  { zh: "增大、加强",       from: ["ag","obj","prop","liv"], to: "same", ex: ["domego", "大宅"] },
    "ej":  { zh: "场所",            from: ["ag","obj","liv"], to: "obj", ex: ["lernejo", "学校"] },
    "em":  { zh: "倾向、爱…",        from: ["ag"], to: "prop", ex: ["ludema", "爱玩的"] },
    "end": { zh: "必须被…",         from: ["ag"], to: "prop", ex: ["pagenda", "应付的"] },
    "er":  { zh: "最小单位",         from: ["obj"], to: "obj", ex: ["ĉenero", "链环"] },
    "estr":{ zh: "首领、长",         from: ["obj","liv","ag"], to: "liv", ex: ["lernejestro", "校长"] },
    "et":  { zh: "缩小",            from: ["ag","obj","prop","liv"], to: "same", ex: ["dometo", "小屋"] },
    "id":  { zh: "后代、幼体",       from: ["liv"], to: "liv", ex: ["katido", "小猫"] },
    "ig":  { zh: "使…（及物化）",     from: ["ag","obj","prop"], to: "ag", ex: ["mortigi", "杀死"] },
    "iĝ":  { zh: "变得（不及物）",    from: ["ag","obj","prop"], to: "ag", ex: ["ruĝiĝi", "脸红"] },
    "il":  { zh: "工具、器械",       from: ["ag"], to: "obj", ex: ["komputilo", "计算机"] },
    "in":  { zh: "雌性、女性",       from: ["liv"], to: "liv", ex: ["patrino", "母亲"] },
    "ind": { zh: "值得被…",         from: ["ag"], to: "prop", ex: ["memorinda", "值得纪念的"] },
    "ing": { zh: "套、插座",         from: ["obj"], to: "obj", ex: ["glavingo", "剑鞘"] },
    "ism": { zh: "主义、学说",       from: ["obj","prop","liv"], to: "obj", ex: ["socialismo", "社会主义"] },
    "ist": { zh: "职业者、追随者",    from: ["ag","obj","liv"], to: "liv", ex: ["instruisto", "教师"] },
    "nj":  { zh: "女性昵称（截断词根）", from: ["liv"], to: "liv", nick: true, ex: ["panjo", "妈妈"] },
    "obl": { zh: "倍数",            from: ["num"], to: "prop", ex: ["duobla", "双倍的"] },
    "on":  { zh: "分数",            from: ["num"], to: "obj", ex: ["duono", "一半"] },
    "op":  { zh: "成组地",           from: ["num"], to: "prop", ex: ["duope", "两人一组"] },
    "uj":  { zh: "容器；产…之地",     from: ["obj","liv"], to: "obj", ex: ["monujo", "钱包"] },
    "ul":  { zh: "有某特征的人",      from: ["prop","obj","ag"], to: "liv", ex: ["riĉulo", "富人"] },
    "um":  { zh: "语义不定（需查词典）", from: ["ag","obj","prop","liv"], to: "obj", vague: true, ex: ["krucumo", "十字架"] },

    /* 分词后缀：接在动作词根后，再挂 -o/-a/-e */
    "ant": { zh: "现在主动分词", from: ["ag"], to: "prop", part: true, ex: ["laboranto", "正在工作的人"] },
    "int": { zh: "过去主动分词", from: ["ag"], to: "prop", part: true, ex: ["laborinto", "工作过的人"] },
    "ont": { zh: "将来主动分词", from: ["ag"], to: "prop", part: true, ex: ["laboronto", "将要工作的人"] },
    "at":  { zh: "现在被动分词", from: ["ag"], to: "prop", part: true, ex: ["amata", "被爱着的"] },
    "it":  { zh: "过去被动分词", from: ["ag"], to: "prop", part: true, ex: ["konstruita", "被建成的"] },
    "ot":  { zh: "将来被动分词", from: ["ag"], to: "prop", part: true, ex: ["legota", "将被读的"] }
  },

  /* ---------- 词尾 ---------- */
  fin: {
    "o":   { zh: "名词",         pos: "n",   num: "sg", cas: "nom" },
    "oj":  { zh: "名词复数",      pos: "n",   num: "pl", cas: "nom" },
    "on":  { zh: "名词宾格",      pos: "n",   num: "sg", cas: "acc" },
    "ojn": { zh: "名词复数宾格",   pos: "n",   num: "pl", cas: "acc" },
    "a":   { zh: "形容词",        pos: "adj", num: "sg", cas: "nom" },
    "aj":  { zh: "形容词复数",     pos: "adj", num: "pl", cas: "nom" },
    "an":  { zh: "形容词宾格",     pos: "adj", num: "sg", cas: "acc" },
    "ajn": { zh: "形容词复数宾格",  pos: "adj", num: "pl", cas: "acc" },
    "e":   { zh: "副词",         pos: "adv", num: "sg", cas: "nom" },
    "i":   { zh: "动词不定式",     pos: "inf" },
    "as":  { zh: "动词现在时",     pos: "v" },
    "is":  { zh: "动词过去时",     pos: "v" },
    "os":  { zh: "动词将来时",     pos: "v" },
    "us":  { zh: "动词虚拟式",     pos: "v" },
    "u":   { zh: "动词命令式",     pos: "v" }
  },

  /* ---------- 词根 314 个 ---------- */
  roots: {
    /* 动作 ag —— 117 */
    "komput": ["计算","ag"], "far": ["做","ag"], "dir": ["说","ag"],
    "parol": ["讲话","ag"], "demand": ["问","ag"], "respond": ["回答","ag"],
    "vid": ["看见","ag"], "aŭd": ["听见","ag"], "rigard": ["注视","ag"],
    "aŭskult": ["倾听","ag"], "skrib": ["写","ag"], "leg": ["读","ag"],
    "lern": ["学习","ag"], "instru": ["教","ag"], "stud": ["钻研","ag"],
    "labor": ["劳动","ag"], "lud": ["玩","ag"], "kant": ["唱","ag"],
    "danc": ["跳舞","ag"], "manĝ": ["吃","ag"], "trink": ["喝","ag"],
    "kuir": ["烹饪","ag"], "dorm": ["睡","ag"], "ir": ["走","ag"],
    "ven": ["来","ag"], "kur": ["跑","ag"], "naĝ": ["游泳","ag"],
    "flug": ["飞","ag"], "salt": ["跳","ag"], "star": ["站","ag"],
    "sid": ["坐","ag"], "kuŝ": ["躺","ag"], "port": ["携带","ag"],
    "ten": ["握住","ag"], "don": ["给","ag"], "pren": ["拿","ag"],
    "met": ["放置","ag"], "trov": ["找到","ag"], "perd": ["失去","ag"],
    "serĉ": ["寻找","ag"], "aĉet": ["买","ag"], "vend": ["卖","ag"],
    "pag": ["付钱","ag"], "konstru": ["建造","ag"], "ripar": ["修理","ag"],
    "help": ["帮助","ag"], "pet": ["请求","ag"], "dank": ["感谢","ag"],
    "salut": ["问候","ag"], "atent": ["注意","ag"], "pens": ["思考","ag"],
    "kred": ["相信","ag"], "esper": ["希望","ag"], "am": ["爱","ag"],
    "tim": ["害怕","ag"], "ĝoj": ["高兴","ag"], "plor": ["哭","ag"],
    "rid": ["笑","ag"], "mort": ["死","ag"], "viv": ["活","ag"],
    "nask": ["生育","ag"], "kresk": ["生长","ag"], "fal": ["落下","ag"],
    "tuŝ": ["触摸","ag"], "flar": ["闻","ag"], "gustum": ["品尝","ag"],
    "lav": ["洗","ag"], "ŝtop": ["塞住","ag"], "ferm": ["关闭","ag"],
    "aper": ["出现","ag"], "fin": ["结束","ag"], "komenc": ["开始","ag"],
    "daŭr": ["持续","ag"], "ŝanĝ": ["改变","ag"], "mov": ["移动","ag"],
    "turn": ["转动","ag"], "ĵet": ["投掷","ag"], "kapt": ["抓住","ag"],
    "bat": ["打","ag"], "tranĉ": ["切","ag"], "kudr": ["缝","ag"],
    "ŝraŭb": ["旋螺丝","ag"], "mezur": ["测量","ag"], "kalkul": ["运算","ag"],
    "prunt": ["借","ag"], "ŝpar": ["节省","ag"], "gajn": ["赢得","ag"],
    "venk": ["战胜","ag"], "atak": ["攻击","ag"], "defend": ["防守","ag"],
    "gvid": ["引导","ag"], "sekv": ["跟随","ag"], "halt": ["停下","ag"],
    "ĝen": ["打扰","ag"], "konsent": ["同意","ag"], "rifuz": ["拒绝","ag"],
    "hav": ["有","ag"], "dev": ["应该","ag"], "pov": ["能够","ag"],
    "vol": ["想要","ag"], "bezon": ["需要","ag"], "sci": ["知道","ag"],
    "kon": ["认识","ag"], "kompren": ["理解","ag"], "memor": ["记住","ag"],
    "forges": ["忘记","ag"], "decid": ["决定","ag"], "propon": ["提议","ag"],
    "invit": ["邀请","ag"], "akcept": ["接受","ag"], "send": ["发送","ag"],
    "ricev": ["收到","ag"], "brul": ["燃烧","ag"], "bol": ["煮沸","ag"],
    "romp": ["打破","ag"], "ŝtel": ["偷","ag"], "kurac": ["治疗","ag"],

    /* 事物 obj —— 96 */
    "dom": ["房子","obj"], "libr": ["书","obj"], "tabl": ["桌子","obj"],
    "seĝ": ["椅子","obj"], "fenestr": ["窗","obj"], "pord": ["门","obj"],
    "mur": ["墙","obj"], "ĉambr": ["房间","obj"], "urb": ["城市","obj"],
    "vilaĝ": ["村庄","obj"], "land": ["国家","obj"], "akv": ["水","obj"],
    "ter": ["土地","obj"], "aer": ["空气","obj"], "fajr": ["火","obj"],
    "sun": ["太阳","obj"], "lun": ["月亮","obj"], "stel": ["星星","obj"],
    "ĉiel": ["天空","obj"], "mar": ["海","obj"], "river": ["河","obj"],
    "mont": ["山","obj"], "arb": ["树","obj"], "flor": ["花","obj"],
    "frukt": ["水果","obj"], "pan": ["面包","obj"], "viand": ["肉","obj"],
    "kaf": ["咖啡","obj"], "te": ["茶","obj"], "suker": ["糖","obj"],
    "sal": ["盐","obj"], "kuler": ["勺子","obj"], "fork": ["叉子","obj"],
    "tel": ["盘子","obj"], "vest": ["衣服","obj"], "ŝu": ["鞋","obj"],
    "ĉapel": ["帽子","obj"], "mon": ["钱","obj"], "paper": ["纸","obj"],
    "plum": ["羽毛笔","obj"], "ŝton": ["石头","obj"], "lign": ["木头","obj"],
    "metal": ["金属","obj"], "or": ["金","obj"], "arĝent": ["银","obj"],
    "fer": ["铁","obj"], "vitr": ["玻璃","obj"], "ŝnur": ["绳子","obj"],
    "nadl": ["针","obj"], "martel": ["锤子","obj"], "ŝlos": ["锁","obj"],
    "buton": ["按钮","obj"], "aŭt": ["汽车","obj"], "trajn": ["火车","obj"],
    "ŝip": ["船","obj"], "bicikl": ["自行车","obj"], "telefon": ["电话","obj"],
    "rad": ["轮子","obj"], "lamp": ["灯","obj"], "kandel": ["蜡烛","obj"],
    "spegul": ["镜子","obj"], "bild": ["图画","obj"], "fotograf": ["照片","obj"],
    "film": ["电影","obj"], "muzik": ["音乐","obj"], "kolor": ["颜色","obj"],
    "vort": ["词","obj"], "lingv": ["语言","obj"], "nom": ["名字","obj"],
    "nombr": ["数目","obj"], "liter": ["字母","obj"], "fraz": ["句子","obj"],
    "korp": ["身体","obj"], "kap": ["头","obj"], "okul": ["眼睛","obj"],
    "orel": ["耳朵","obj"], "naz": ["鼻子","obj"], "buŝ": ["嘴","obj"],
    "man": ["手","obj"], "pied": ["脚","obj"], "brak": ["手臂","obj"],
    "dent": ["牙","obj"], "har": ["头发","obj"], "sang": ["血","obj"],
    "ost": ["骨头","obj"], "tabak": ["烟草","obj"], "buter": ["黄油","obj"],
    "fromaĝ": ["奶酪","obj"], "ov": ["蛋","obj"], "lakto": ["奶","obj"],
    "legom": ["蔬菜","obj"], "herb": ["草","obj"], "ĉen": ["链条","obj"],
    "glav": ["剑","obj"], "kruc": ["十字","obj"], "social": ["社会","obj"],
    "ide": ["想法","obj"],

    /* 有生命 liv —— 33 */
    "patr": ["父亲","liv"], "frat": ["兄弟","liv"], "fil": ["儿子","liv"],
    "infan": ["孩子","liv"], "knab": ["男孩","liv"], "vir": ["男人","liv"],
    "hom": ["人","liv"], "person": ["个人","liv"], "amik": ["朋友","liv"],
    "najbar": ["邻居","liv"], "bov": ["牛","liv"], "ĉeval": ["马","liv"],
    "hund": ["狗","liv"], "kat": ["猫","liv"], "bird": ["鸟","liv"],
    "fiŝ": ["鱼","liv"], "muŝ": ["苍蝇","liv"], "abel": ["蜜蜂","liv"],
    "ŝaf": ["绵羊","liv"], "pork": ["猪","liv"], "kok": ["鸡","liv"],
    "mus": ["老鼠","liv"], "leon": ["狮子","liv"], "elefant": ["大象","liv"],
    "urs": ["熊","liv"], "vulp": ["狐狸","liv"], "reĝ": ["国王","liv"],
    "sinjor": ["先生","liv"], "av": ["祖父","liv"], "onkl": ["叔父","liv"],
    "kuz": ["表亲","liv"], "edz": ["丈夫","liv"], "beb": ["婴儿","liv"],

    /* 性质 prop —— 48 */
    "grand": ["大","prop"], "bel": ["美","prop"], "bon": ["好","prop"],
    "nov": ["新","prop"], "jun": ["年轻","prop"], "varm": ["热","prop"],
    "rapid": ["快","prop"], "facil": ["容易","prop"], "ĝust": ["正确","prop"],
    "klar": ["清楚","prop"], "fort": ["强","prop"], "pez": ["重","prop"],
    "alt": ["高","prop"], "long": ["长","prop"], "larĝ": ["宽","prop"],
    "profund": ["深","prop"], "ruĝ": ["红","prop"], "verd": ["绿","prop"],
    "blu": ["蓝","prop"], "flav": ["黄","prop"], "nigr": ["黑","prop"],
    "blank": ["白","prop"], "griz": ["灰","prop"], "brun": ["棕","prop"],
    "pur": ["干净","prop"], "sek": ["干","prop"], "plen": ["满","prop"],
    "riĉ": ["富","prop"], "saĝ": ["智慧","prop"], "stult": ["愚蠢","prop"],
    "ĝentil": ["礼貌","prop"], "util": ["有用","prop"], "ver": ["真","prop"],
    "fals": ["假","prop"], "simpl": ["简单","prop"], "komplik": ["复杂","prop"],
    "danĝer": ["危险","prop"], "grav": ["重要","prop"], "silent": ["安静","prop"],
    "liber": ["自由","prop"], "pal": ["苍白","prop"], "mol": ["软","prop"],
    "glat": ["光滑","prop"], "akr": ["尖锐","prop"], "dolĉ": ["甜","prop"],
    "acid": ["酸","prop"], "amar": ["苦","prop"], "freŝ": ["新鲜","prop"],

    /* 数词 num —— 12 */
    "unu": ["一","num"], "du": ["二","num"], "tri": ["三","num"],
    "kvar": ["四","num"], "kvin": ["五","num"], "ses": ["六","num"],
    "sep": ["七","num"], "ok": ["八","num"], "naŭ": ["九","num"],
    "dek": ["十","num"], "cent": ["百","num"], "mil": ["千","num"],

    /* 指示关系 rel —— 8 */
    "ki": ["疑问","rel"], "ti": ["指示","rel"], "ĉi": ["全部","rel"],
    "neni": ["无","rel"], "ali": ["其他","rel"], "sam": ["相同","rel"],
    "mem": ["自己","rel"], "ĉef": ["主要","rel"]
  },

  /* ---------- 整词白名单：这些词不再机械拆分 ---------- */
  whole: [
    "malgraŭ", "ĉiuj", "ĉiu", "ĉio", "ĉie", "ĉiam", "ĉiel", "ĉiom", "ĉu",
    "ankoraŭ", "kvazaŭ", "preskaŭ", "apenaŭ", "almenaŭ", "baldaŭ", "hodiaŭ",
    "hieraŭ", "morgaŭ", "nun", "tuj", "jam", "eĉ", "ja", "jes", "ne", "tre",
    "tro", "pli", "plej", "nur", "ankaŭ", "do", "tamen", "sed", "kaj", "aŭ",
    "ke", "se", "ĉar", "dum", "ĝis", "post", "antaŭ", "inter", "super", "sub",
    "apud", "kontraŭ", "tra", "trans", "preter", "laŭ", "sen", "pri", "pro",
    "por", "el", "en", "sur", "kun", "ĉe", "de", "al", "da", "je", "la",
    "oni", "mi", "vi", "li", "ŝi", "ĝi", "ni", "ili", "si", "estas", "esti",
    "estis", "estos", "estus", "estu"
  ]
};