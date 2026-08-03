export type SeedQuestionType = 'single' | 'multiple'

export interface SeedCategory {
  name: string
  description?: string
  icon?: string
  color?: string
  sort_order?: number
  is_active?: boolean
  is_exam_enabled?: boolean
  allow_view_score?: boolean
}

export interface SeedQuestionSet {
  name: string
  description?: string
  is_active?: boolean
  allow_view_score?: boolean
}

export interface SeedQuestion {
  questionType: SeedQuestionType
  section?: string
  questionText: string
  optionA: string
  optionB: string
  optionC: string
  optionD: string
  correctAnswer: string
  explanation?: string
}

export interface JiaheBusinessQuestionSet {
  questionSet: SeedQuestionSet
  questions: SeedQuestion[]
}

export interface JiaheBusinessOnboardingSeed {
  category: SeedCategory
  questionSets: JiaheBusinessQuestionSet[]
}

export const jiaheBusinessOnboardingSeed: JiaheBusinessOnboardingSeed = {
  category: {
    name: '嘉禾业务入职培训考核',
    description: 'Nova 嘉禾植保业务入职培训考核：市场篇、业务篇、业务操作流程、销售技巧',
    icon: 'Briefcase',
    color: '#16a34a',
    sort_order: 20,
    is_active: true,
    is_exam_enabled: true,
    allow_view_score: true
  },
  questionSets: [
    {
      questionSet: {
        name: '嘉禾业务入职培训考核（一）',
        description: '覆盖市场篇、业务篇、业务操作流程、销售技巧四大板块',
        is_active: true,
        allow_view_score: true
      },
      questions: [
        {
          questionType: 'single',
          section: '市场篇',
          questionText: '根据资料，2022年全球作物保护农药销售额达到多少美元？',
          optionA: '约 653.1 亿美元',
          optionB: '约 677.5 亿美元',
          optionC: '约 720 亿美元',
          optionD: '约 551.5 亿美元',
          correctAnswer: 'B',
          explanation: '2021 年达 653.1 亿美元，2022 年全球作物保护农药销售额达到 677.5 亿美元，同比增长 3.74%。'
        },
        {
          questionType: 'single',
          section: '市场篇',
          questionText: '根据资料，全球农药第一大市场是哪个地区？',
          optionA: '拉丁美洲',
          optionB: '北美',
          optionC: '亚太地区',
          optionD: '欧洲',
          correctAnswer: 'C',
          explanation: '亚太地区是全球农药第一大市场，2022 年农药销售额占比达 31.59%，拉丁美洲次之占比 27.62%。'
        },
        {
          questionType: 'single',
          section: '市场篇',
          questionText: '我国农药行业产量中，大约有多大比例需要出口消化？',
          optionA: '约 30%',
          optionB: '约 50%',
          optionC: '约 70%',
          optionD: '约 90%',
          correctAnswer: 'C',
          explanation: '我国农药行业严重依赖出口，近几年产量 70% 左右需要出口消化。'
        },
        {
          questionType: 'single',
          section: '市场篇',
          questionText: '2022 年我国农药进口贸易关口前三名是？',
          optionA: '上海、江苏、浙江',
          optionB: '北京、上海、广东',
          optionC: '山东、江苏、浙江',
          optionD: '广东、福建、上海',
          correctAnswer: 'A',
          explanation: '2022 年农药进口贸易关口明显，前三甲分别为上海、江苏和浙江。'
        },
        {
          questionType: 'multiple',
          section: '市场篇',
          questionText: '根据资料，Nova 的目标客户特征包括哪些？',
          optionA: '有中国农药进口需求，制剂为主',
          optionB: '经销商或农场主',
          optionC: '定制要求高',
          optionD: '必须为进口原药为主',
          correctAnswer: 'ABC',
          explanation: '目标客户清晰三点：有中国农药进口需求且制剂为主；经销商或农场主；定制要求高。'
        },
        {
          questionType: 'single',
          section: '市场篇',
          questionText: '资料中推荐指数最高（★★★★）的客户开发渠道是？',
          optionA: '展会',
          optionB: '社交平台',
          optionC: '海关数据',
          optionD: 'B2B 平台',
          correctAnswer: 'C',
          explanation: '海关数据推荐指数 ★★★★，信息完整精准、易分析、节省筛选时间。'
        },
        {
          questionType: 'multiple',
          section: '业务篇',
          questionText: '全球农药销售额中，作物保护类农药按用途可分为哪些？',
          optionA: '除草剂',
          optionB: '杀菌剂',
          optionC: '杀虫剂',
          optionD: '其他农药',
          correctAnswer: 'ABCD',
          explanation: '作物保护类农药按用途可分为除草剂、杀菌剂、杀虫剂和其他农药。'
        },
        {
          questionType: 'single',
          section: '市场篇',
          questionText: '常用农药剂型中，乳油的英文代码是？',
          optionA: 'SC',
          optionB: 'EC',
          optionC: 'WP',
          optionD: 'WG',
          correctAnswer: 'B',
          explanation: 'EC 是 emulsifiable concentrate 乳油；SC 是悬浮剂，WP 是可湿性粉剂，WG 是水分散粒剂。'
        },
        {
          questionType: 'single',
          section: '市场篇',
          questionText: '悬浮剂（aqueous suspension concentrate）的代码是？',
          optionA: 'SC',
          optionB: 'SL',
          optionC: 'ME',
          optionD: 'OD',
          correctAnswer: 'A',
          explanation: 'SC 即 aqueous suspension concentrate 悬浮剂。'
        },
        {
          questionType: 'multiple',
          section: '市场篇',
          questionText: '优秀业务员应具备哪些特征？',
          optionA: '悟性（学习及思维能力）',
          optionB: '诚信',
          optionC: '热情不减（韧性及勤奋）',
          optionD: '言出必践（目标承诺及追求）',
          correctAnswer: 'ABCD',
          explanation: '资料归纳优秀业务员特征包括悟性、诚信、热情不减、OPEN、要性、喜欢干销售、言出必践等。'
        },
        {
          questionType: 'single',
          section: '市场篇',
          questionText: '海关数据分析中，若客户"杀虫杀菌为主、除草剂较少或无"，且优势吻合、可做产品差异化，合作难度为几星？',
          optionA: '1 星',
          optionB: '2 星',
          optionC: '3 星',
          optionD: '4 星',
          correctAnswer: 'A',
          explanation: '杀虫杀菌为主、除草剂较少时优势吻合，产品差异化策略，合作难度 1 星。'
        },
        {
          questionType: 'single',
          section: '业务篇',
          questionText: '作物保护类农药市场约占农药市场总体的比例是？',
          optionA: '约 50%',
          optionB: '约 70%',
          optionC: '约 90%',
          optionD: '约 95%',
          correctAnswer: 'C',
          explanation: '作物保护类农药市场占比约 90%，按用途可分为除草剂、杀菌剂、杀虫剂和其他农药。'
        },
        {
          questionType: 'single',
          section: '业务篇',
          questionText: '负责全国农药登记、使用和监督管理工作，并负责农药登记证企业更名的行政主管部门是？',
          optionA: '工信部',
          optionB: '农业部',
          optionC: '应急管理部',
          optionD: '中国农药工业协会',
          correctAnswer: 'B',
          explanation: '农业部负责全国农药登记、使用和监督管理工作，负责农药登记证企业更名等。'
        },
        {
          questionType: 'single',
          section: '业务篇',
          questionText: '以下哪个是"丙硫菌唑"的本类开发公司及所属类别？',
          optionA: '先正达开发的甲氧基丙烯酸酯类',
          optionB: '拜耳开发的三唑硫酮类杀菌剂',
          optionC: 'BASF 开发的羧酰胺类',
          optionD: '先正达开发的甲氧基丙烯酸酯类',
          correctAnswer: 'B',
          explanation: '丙硫菌唑是拜耳公司开发的三唑硫酮类新型杀菌剂，2022 年销售额超过 12 亿美元，全球第二大杀菌剂。'
        },
        {
          questionType: 'single',
          section: '业务篇',
          questionText: '被种植户称为保护性杀菌剂中"天花板"的是？',
          optionA: '嘧菌酯',
          optionB: '代森锰锌',
          optionC: '戊唑醇',
          optionD: '铜制剂',
          correctAnswer: 'B',
          explanation: '代森锰锌是第一代预防保护性杀菌剂，杀菌谱广稳定高效，被称为保护性杀菌剂中的"天花板"。'
        },
        {
          questionType: 'single',
          section: '业务篇',
          questionText: '杀虫剂销售额占杀虫剂销售总额超过 50% 的三大类产品是？',
          optionA: '新烟碱类、拟除虫菊酯类、有机磷类',
          optionB: '双酰胺类、抗生素类、氨基甲酸酯类',
          optionC: '新烟碱类、双酰胺类、拟除虫菊酯类',
          optionD: '有机磷类、氨基甲酸酯类、昆虫生长调节剂类',
          correctAnswer: 'A',
          explanation: '杀虫剂主要产品类型包括新烟碱类、拟除虫菊酯类、有机磷类，这三类销售额占杀虫剂销售总额超过 50%。'
        },
        {
          questionType: 'single',
          section: '业务篇',
          questionText: '新烟碱类杀虫剂的主要产品包括？',
          optionA: '毒死蜱、辛硫磷',
          optionB: '吡虫啉、噻虫嗪、啶虫脒',
          optionC: '溴氰菊酯、氯氰菊酯',
          optionD: '氯虫苯甲酰胺、氟苯虫酰胺',
          correctAnswer: 'B',
          explanation: '新烟碱类主要产品有吡虫啉、啶虫脒、噻虫嗪、烯啶虫胺、噻虫啉、噻虫胺等。'
        },
        {
          questionType: 'single',
          section: '业务篇',
          questionText: '国际贸易术语（Incoterms）目前更新至哪个版本？',
          optionA: '2015 版本',
          optionB: '2018 版本',
          optionC: '2020 版本',
          optionD: '2022 版本',
          correctAnswer: 'C',
          explanation: '国际贸易术语由国际商会（ICC）于 1936 年起草，经多次修正发展至今，目前更新至 2020 年版本。'
        },
        {
          questionType: 'single',
          section: '业务篇',
          questionText: '以下哪组贸易术语仅适用于海运？',
          optionA: 'EXW、FCA、CPT、CIP',
          optionB: 'EXW、FOB、CFR、CIF',
          optionC: 'FOB、FAS、CFR、CIF',
          optionD: 'DAP、DPU、DDP、FOB',
          correctAnswer: 'C',
          explanation: '仅适用海运的术语为 FOB、FAS、CFR、CIF；适用于任何运输方式的是 EXW、FCA、CPT、CIP、DAP、DPU、DDP。'
        },
        {
          questionType: 'single',
          section: '业务篇',
          questionText: '按 EXW 术语成交时，卖方承担的风险、责任以及费用状况如何？',
          optionA: '最大',
          optionB: '最小',
          optionC: '中等',
          optionD: '与买方相同',
          correctAnswer: 'B',
          explanation: '按 EXW 术语成交时，卖方承担的风险、责任以及费用都是最小的。'
        },
        {
          questionType: 'single',
          section: '业务篇',
          questionText: 'CIF 的全称是？',
          optionA: 'Cost Insurance and Freight',
          optionB: 'Cost and Freight',
          optionC: 'Cost Insurance and Price',
          optionD: 'Carriage Insurance and Freight',
          correctAnswer: 'A',
          explanation: 'CIF 全称是 Cost Insurance and Freight，即成本加保险费加运费（指定目的港）。'
        },
        {
          questionType: 'single',
          section: '业务篇',
          questionText: '以下哪种结算方式属于银行信用？',
          optionA: '电汇（T/T）',
          optionB: '托收（D/P）',
          optionC: '信用证（L/C）',
          optionD: '票汇（D/D）',
          correctAnswer: 'C',
          explanation: '汇付和托收以商业信用为基础，信用证（L/C）以银行信用为基础，风险较小。'
        },
        {
          questionType: 'single',
          section: '业务篇',
          questionText: '中信保是我国唯一的一家政策性保险公司，其经营性质是？',
          optionA: '以盈利为目的',
          optionB: '以扩大出口支持经营为目的',
          optionC: '不以盈利为目的',
          optionD: '以竞争为目标',
          correctAnswer: 'C',
          explanation: '中信保是政策性保险公司，不以盈利为目的，专门为支持企业扩大出口提供服务的专业公司。'
        },
        {
          questionType: 'single',
          section: '业务篇',
          questionText: '海运提单（B/L）的性质不包括以下哪一项？',
          optionA: '货物收据',
          optionB: '物权凭证',
          optionC: '运输契约的证明',
          optionD: '保险单',
          correctAnswer: 'D',
          explanation: '提单是货物收据、物权凭证和运输契约的证明，不是保险单。'
        },
        {
          questionType: 'single',
          section: '业务篇',
          questionText: '出口信用保险理赔中，拖欠风险下风险发生后多少天内提交《可损通知书》？',
          optionA: '10 天',
          optionB: '20 天',
          optionC: '30 天',
          optionD: '60 天',
          correctAnswer: 'C',
          explanation: '拖欠风险下，风险发生后 30 天内提交《可损通知书》；拒收风险下，风险发生后 10 个工作日内报损。'
        },
        {
          questionType: 'single',
          section: '业务操作流程',
          questionText: '客户开发前准备工作不包括以下哪项？',
          optionA: '目标市场定位及分析',
          optionB: '目标客户信息收集',
          optionC: '客户背调',
          optionD: '直接下单发货',
          correctAnswer: 'D',
          explanation: '客户开发前准备工作包括目标市场定位及分析、目标客户信息收集、客户背调、客户与公司业务匹配度。'
        },
        {
          questionType: 'single',
          section: '业务操作流程',
          questionText: '根据农药中国年进口体量划分，超过 $500w 的客户属于哪一档？',
          optionA: '小',
          optionB: '中小',
          optionC: '中大',
          optionD: '大',
          correctAnswer: 'D',
          explanation: '经营规模按进口额划分：小 $0-100w、中小 $100-200w、中大 $200-500w、大 $500w 以上。'
        },
        {
          questionType: 'multiple',
          section: '业务操作流程',
          questionText: 'Nova 公司（嘉禾）的优势包括哪些？',
          optionA: '国企背景、经营农药行业 20+ 年',
          optionB: '2 家工厂 + 3 个海外分公司',
          optionC: '数百个海外产品登记',
          optionD: '专业实验室与登记团队支撑',
          correctAnswer: 'ABCD',
          explanation: '公司优势包括国企背景、20+ 年经验、2 家工厂+3 个海外分公司、数百个海外产品登记、专业实验室与登记团队支撑等。'
        },
        {
          questionType: 'single',
          section: '业务操作流程',
          questionText: '开发信准备工作不包括以下哪项？',
          optionA: '客户背调',
          optionB: '邮件主题',
          optionC: '开发信称呼',
          optionD: '附件压缩包',
          correctAnswer: 'D',
          explanation: '开发信准备工作包括客户背调、邮件主题（清晰/吸引）、开发信称呼、内容构成；附件压缩包属于开发信禁忌。'
        },
        {
          questionType: 'single',
          section: '业务操作流程',
          questionText: '报价核算表需要核算的因素不包括以下哪项？',
          optionA: '采购价、汇率、退税',
          optionB: '港杂、海运+保险',
          optionC: '信保、用款利息',
          optionD: '广告投放费用',
          correctAnswer: 'D',
          explanation: '报价核算表包括采购价、汇率、退税、港杂、海运+保险、信保、用款利息、利润率等，不含广告投放费用。'
        },
        {
          questionType: 'single',
          section: '业务操作流程',
          questionText: '申请了信保的客户，双方签订的合同抬头与信保抬头应如何？',
          optionA: '可随意',
          optionB: '务必保持一致',
          optionC: '必须不同',
          optionD: '无需关注',
          correctAnswer: 'B',
          explanation: '申请了信保的客户，双方签订的合同抬头务必和信保抬头保持一致。'
        },
        {
          questionType: 'single',
          section: '销售技巧',
          questionText: '客户决策树中，拥有最终决策权、一票否决权的是？',
          optionA: '批准人（采购/登记负责人）',
          optionB: '评估者（登记、技术、采购）',
          optionC: '关键决策人（分管领导/CEO）',
          optionD: '普通业务员',
          correctAnswer: 'C',
          explanation: '关键决策人（分管领导/CEO）拥有最终决策权、一票否决权；批准人有审批权；评估者有评价权和选择权。'
        },
        {
          questionType: 'single',
          section: '销售技巧',
          questionText: '邮件开发的核心原则是？',
          optionA: '不要试图去卖，跟客户一起买',
          optionB: '尽可能夸大产品功效',
          optionC: '长篇大论展示产品',
          optionD: '发送大量附件',
          correctAnswer: 'A',
          explanation: '邮件的核心是"不要试图去卖，跟客户一起买"，基于客户痛点解决现存问题。'
        },
        {
          questionType: 'single',
          section: '销售技巧',
          questionText: '开发信禁忌不包括以下哪项？',
          optionA: '长篇大论',
          optionB: '附件有压缩包、文档、链接',
          optionC: '给客户造成群发体验',
          optionD: '邮件主题简洁清晰',
          correctAnswer: 'D',
          explanation: '开发信禁忌包括长篇大论、附件有压缩包/文档/链接、避免群发体验；邮件主题简洁清晰是应做的。'
        },
        {
          questionType: 'single',
          section: '销售技巧',
          questionText: '客户跟进时间分配中，应投入最多时间的是哪类客户？',
          optionA: '新客户',
          optionB: '老客户',
          optionC: '寄过样品的客户',
          optionD: '在谈客户',
          correctAnswer: 'B',
          explanation: '50% 的时间跟进维护老客户（最容易下单），30% 给寄过样品的客户，剩下各 10% 给在谈客户和新客户。'
        },
        {
          questionType: 'single',
          section: '销售技巧',
          questionText: '关于报价技巧，以下说法正确的是？',
          optionA: '报价可以不标注有效期',
          optionB: '针对不同付款方式给予不同报价',
          optionC: '所有客户统一报价',
          optionD: '报价后无需跟进',
          correctAnswer: 'B',
          explanation: '根据不同的付款方式给予不同报价，引导客户前 T/T 报价可偏低，账期报价可偏高；报价要标注有效期。'
        },
        {
          questionType: 'single',
          section: '销售技巧',
          questionText: '降价技巧中，以下说法不正确的是？',
          optionA: '降幅不宜过大',
          optionB: '降价次数不宜过于频繁',
          optionC: '采用条件式阶梯降价',
          optionD: '一口价大幅让利',
          correctAnswer: 'D',
          explanation: '降价应降幅不宜过大、次数不宜频繁、采用条件式阶梯降价（结合采购量和付款方式），不能一口价大幅让利。'
        },
        {
          questionType: 'single',
          section: '销售技巧',
          questionText: '"FOLLOW UP≠PUSH" 的含义是？',
          optionA: '跟进客户就是紧逼客户',
          optionB: '跟进客户不是紧逼客户',
          optionC: '不需要跟进客户',
          optionD: '只跟价格不跟人',
          correctAnswer: 'B',
          explanation: '跟进客户（FOLLOW UP）不等于紧逼（PUSH）客户，要注意避免给客户压迫感。'
        },
        {
          questionType: 'single',
          section: '销售技巧',
          questionText: '样品提供中，关于费用收取的说法正确的是？',
          optionA: '样品价值高的也免收样品费',
          optionB: '坚持收取快递费，使客户付出交易成本',
          optionC: '所有样品全部免费',
          optionD: '样品费与邮寄费只能一起收',
          correctAnswer: 'B',
          explanation: '坚持收取快递费，使客户付出一定交易成本，客户会更重视此次交易；样品价值高的可承诺下单后减免样品费。'
        },
        {
          questionType: 'single',
          section: '销售技巧',
          questionText: '谈判阶段技巧中，以下说法正确的是？',
          optionA: '一开始就大幅让步亮出底牌',
          optionB: '开始阶段尽量不以公司制度压对方',
          optionC: '有为难的要求一律拒绝',
          optionD: '谈判中不管理客户预期',
          correctAnswer: 'B',
          explanation: '谈判中底牌不能亮太早，开始阶段尽量不以公司制度压对方，可采用"以一换一"原则，并管理好客户预期。'
        },
        {
          questionType: 'multiple',
          section: '销售技巧',
          questionText: '履约阶段的新订单推进技巧包括？',
          optionA: '继续分享市场行情走势',
          optionB: '进行新品推荐',
          optionC: '关注客户领英，反馈我方动态',
          optionD: '汇报订单进度的同时聊其他需求',
          correctAnswer: 'ABCD',
          explanation: '新订单推进包括继续分享市场行情走势、进行新品推荐、关注客户领英反馈我方动态、汇报订单进度同时聊其他需求。'
        }
      ]
    },
    {
      questionSet: {
        name: '嘉禾业务入职培训考核（二）',
        description: '覆盖市场篇、业务篇、业务操作流程、销售技巧四大板块',
        is_active: true,
        allow_view_score: true
      },
      questions: [
        {
          questionType: 'single',
          section: '市场篇',
          questionText: '21 世纪以来，全球农药行业进入哪个发展阶段？',
          optionA: '快速增长阶段',
          optionB: '萎缩阶段',
          optionC: '成熟发展阶段',
          optionD: '起步阶段',
          correctAnswer: 'C',
          explanation: '2011 年以来，全球农药行业进入成熟发展阶段。'
        },
        {
          questionType: 'single',
          section: '市场篇',
          questionText: '2022 年我国农药贸易总额约为多少？',
          optionA: '约 150 亿美元',
          optionB: '约 220 亿美元',
          optionC: '约 300 亿美元',
          optionD: '约 500 亿美元',
          correctAnswer: 'B',
          explanation: '2022 年我国农药贸易总额约为 220 亿美元，同比增长 30% 以上。'
        },
        {
          questionType: 'single',
          section: '市场篇',
          questionText: '2022 年我国农药进口数量同比变化为？',
          optionA: '同比增长 14%',
          optionB: '同比下降 14%',
          optionC: '同比增长 38.7%',
          optionD: '同比下降 38.7%',
          correctAnswer: 'B',
          explanation: '2022 年我国农药进口数量同比下降 14%，进口贸易额同比增长 4.2%。'
        },
        {
          questionType: 'single',
          section: '市场篇',
          questionText: 'Nova 的目标国家不包括以下哪个？',
          optionA: '秘鲁',
          optionB: '印尼',
          optionC: '俄罗斯',
          optionD: '日本',
          correctAnswer: 'D',
          explanation: '目标国家包括秘鲁、厄瓜多尔、哥伦比亚、加拿大、印尼、越南、澳大利亚、俄罗斯、哈萨克斯坦、乌兹别克斯坦、伊朗、肯尼亚、埃及、尼日利亚、埃塞俄比亚、南非等，不含日本。'
        },
        {
          questionType: 'single',
          section: '市场篇',
          questionText: '市场开发基础能力中，语言基础要求是？',
          optionA: '熟练运用英语是基础',
          optionB: '必须掌握法语',
          optionC: '必须掌握日语',
          optionD: '没有语言要求',
          correctAnswer: 'A',
          explanation: '语言基础要求熟练运用一门外语，英语是基础。'
        },
        {
          questionType: 'single',
          section: '市场篇',
          questionText: '资料中推荐指数为 ★★★ 的客户开发渠道包括？',
          optionA: '海关数据和展会',
          optionB: '展会、社交平台',
          optionC: 'B2B 平台和网络搜索',
          optionD: '口碑和圈层',
          correctAnswer: 'B',
          explanation: '展会（CAC 展会、国外农药展）和社交平台（LinkedIn、Facebook、YouTube、Twitter）推荐指数均为 ★★★。'
        },
        {
          questionType: 'single',
          section: '市场篇',
          questionText: '可湿性粉剂（wettable powder）的英文代码是？',
          optionA: 'WP',
          optionB: 'SP',
          optionC: 'SG',
          optionD: 'WDG',
          correctAnswer: 'A',
          explanation: 'WP 是 wettable powder 可湿性粉剂；SP 是可溶粉剂，SG 是可溶粒剂，WDG 是水分散粒剂。'
        },
        {
          questionType: 'single',
          section: '市场篇',
          questionText: '水分散粒剂（water dispersible granule）的代码是？',
          optionA: 'GR',
          optionB: 'WDG/WG',
          optionC: 'DP',
          optionD: 'TK',
          correctAnswer: 'B',
          explanation: '水分散粒剂 water dispersible granule 代码为 WDG/WG。'
        },
        {
          questionType: 'single',
          section: '市场篇',
          questionText: '客户开发流程的正确顺序是？',
          optionA: '信息搜集分析→客户触达→多次交流→合作登记→询价及订单',
          optionB: '客户触达→信息搜集分析→多次交流→询价及订单→合作登记',
          optionC: '多次交流→信息搜集分析→客户触达→合作登记→询价及订单',
          optionD: '信息搜集分析→客户触达→合作登记→多次交流→询价及订单',
          correctAnswer: 'A',
          explanation: '客户开发流程为：1 信息搜集与分析→2 客户触达→3 多次交流→4 合作登记→5 询价及订单。'
        },
        {
          questionType: 'single',
          section: '市场篇',
          questionText: '海关数据分析中，若客户"除草剂为主、杀虫剂较少或无"，且除草剂为大陆货、供应商是贸易商，合作难度为几星？',
          optionA: '1 星',
          optionB: '2 星',
          optionC: '3 星',
          optionD: '4 星',
          correctAnswer: 'C',
          explanation: '除草剂为大陆货、供应商是贸易商，可尝试但合作难度 3 星。'
        },
        {
          questionType: 'single',
          section: '业务篇',
          questionText: '农药的定义中，按大类划分作物保护类农药约占 90%，不包括以下哪类？',
          optionA: '杀菌剂',
          optionB: '杀虫剂',
          optionC: '除草剂',
          optionD: '包装材料',
          correctAnswer: 'D',
          explanation: '作物保护类农药按用途可分为除草剂、杀菌剂、杀虫剂和其他农药，包装材料不属于农药。'
        },
        {
          questionType: 'multiple',
          section: '业务篇',
          questionText: '以下哪些属于"仅适用于海运"的贸易术语？',
          optionA: 'FOB',
          optionB: 'CIF',
          optionC: 'CFR',
          optionD: 'DDP',
          correctAnswer: 'ABC',
          explanation: '仅适用海运的术语为 FOB、FAS、CFR、CIF；DDP 适用于任何运输方式。'
        },
        {
          questionType: 'multiple',
          section: '销售技巧',
          questionText: '客户跟进中增加客户粘性的方式包括？',
          optionA: '关注客户 WhatsApp/LinkedIn 动态',
          optionB: '在重要节日向客户发邮件',
          optionC: '提供有价值的市场行情与价格走势',
          optionD: '只在客户下单时才联系',
          correctAnswer: 'ABC',
          explanation: '增加客户粘性要关注客户动态、节日邮件维护、提供有价值信息（市场行情、价格走势等），不能只在需要时联系。'
        },
        {
          questionType: 'single',
          section: '业务篇',
          questionText: '以下哪个产品的开发公司是"先正达"？',
          optionA: '嘧菌酯',
          optionB: '丙硫菌唑',
          optionC: '氟唑菌酰胺',
          optionD: '戊唑醇',
          correctAnswer: 'A',
          explanation: '嘧菌酯由先正达开发（甲氧基丙烯酸酯类）；丙硫菌唑由拜耳开发；氟唑菌酰胺由 BASF 开发；戊唑醇由拜耳研发。'
        },
        {
          questionType: 'single',
          section: '业务篇',
          questionText: '戊唑醇的杀菌机理主要是？',
          optionA: '抑制麦角甾醇的生物合成',
          optionB: '抑制几丁质合成',
          optionC: '激活鱼尼丁受体',
          optionD: '抑制胆碱酯酶',
          correctAnswer: 'A',
          explanation: '戊唑醇属三唑类杀菌剂，杀菌机理主要是抑制病原菌的麦角甾醇生物合成。'
        },
        {
          questionType: 'single',
          section: '业务篇',
          questionText: '氟唑菌酰胺的专利保护期预计到哪一年到期？',
          optionA: '2024 年',
          optionB: '2025 年',
          optionC: '2026 年',
          optionD: '2030 年',
          correctAnswer: 'C',
          explanation: '氟唑菌酰胺仍处于专利保护期（2026 年到期）。'
        },
        {
          questionType: 'single',
          section: '业务篇',
          questionText: '双酰胺类杀虫剂的主要产品包括？',
          optionA: '吡虫啉、噻虫嗪',
          optionB: '氟苯虫酰胺、氯虫苯甲酰胺',
          optionC: '毒死蜱、辛硫磷',
          optionD: '阿维菌素、多杀霉素',
          correctAnswer: 'B',
          explanation: '双酰胺类杀虫剂主要产品有氟苯虫酰胺、氯虫苯甲酰胺，该类产品效果明显、毒性较强、属高毒范围。'
        },
        {
          questionType: 'single',
          section: '业务篇',
          questionText: '国际贸易术语新版分成 2 类、4 组、多少个贸易术语？',
          optionA: '9 个',
          optionB: '10 个',
          optionC: '11 个',
          optionD: '13 个',
          correctAnswer: 'C',
          explanation: '新版的国际贸易术语分成 2 类、4 组、11 个贸易术语。'
        },
        {
          questionType: 'single',
          section: '业务篇',
          questionText: 'FOB 的全称是？',
          optionA: 'Free on Board',
          optionB: 'Free alongside Ship',
          optionC: 'Cost and Freight',
          optionD: 'Delivered at Place',
          correctAnswer: 'A',
          explanation: 'FOB 全称是 Free on Board（...named port of shipment），即装运港船上交货。'
        },
        {
          questionType: 'multiple',
          section: '业务篇',
          questionText: '以下哪些属于汇付（Remittance）的结算方式？',
          optionA: '电汇（T/T）',
          optionB: '票汇（D/D）',
          optionC: '信汇（M/T）',
          optionD: '承兑交单（D/A）',
          correctAnswer: 'ABC',
          explanation: '汇付包括电汇（T/T）、票汇（D/D）、信汇（M/T）；承兑交单（D/A）属于托收。'
        },
        {
          questionType: 'single',
          section: '业务篇',
          questionText: '托收属于商业信用，对出口商风险较大，一般可用于？',
          optionA: '从未合作过的陌生客户',
          optionB: '有过合作经历、但尚待考察的贸易伙伴',
          optionC: '信用极差的新客户',
          optionD: '所有客户',
          correctAnswer: 'B',
          explanation: '托收属于商业信用，银行只提供服务不提供信用，一般用于有过合作经历但尚待考察的贸易伙伴。'
        },
        {
          questionType: 'single',
          section: '业务篇',
          questionText: '海运集装箱中，20GP 的正常装方量约为？',
          optionA: '20 方',
          optionB: '28 方',
          optionC: '58 方',
          optionD: '68 方',
          correctAnswer: 'B',
          explanation: '20GP 体积约 33.1 m³，正常装 28 方；40GP 正常装 58 方，40HQ 正常装 68 方。'
        },
        {
          questionType: 'single',
          section: '业务篇',
          questionText: '出运申报中，投保金额应等于？',
          optionA: '发票金额',
          optionB: '发票金额 - 预付款金额（实际应收款）',
          optionC: '合同金额',
          optionD: '采购金额',
          correctAnswer: 'B',
          explanation: '投保金额 = 发票金额 - 预付款金额（实际应收款），出运申报需按照发票号逐票申报。'
        },
        {
          questionType: 'single',
          section: '业务操作流程',
          questionText: '目标客户信息收集渠道不包括以下哪项？',
          optionA: '领英推广',
          optionB: 'Google 搜索',
          optionC: '国内外展会',
          optionD: '公司内部财务报表',
          correctAnswer: 'D',
          explanation: '信息收集渠道包括领英推广、Google 搜索、国内外展会、B2B 平台+其他社媒、海关数据系统、其他等，不含公司内部财务报表。'
        },
        {
          questionType: 'multiple',
          section: '业务操作流程',
          questionText: '目标客户的主要类型包括哪些？',
          optionA: '农药经销商',
          optionB: '农药进口贸易商',
          optionC: '农场主',
          optionD: '政府机关',
          correctAnswer: 'ABC',
          explanation: '目标客户主要类型为农药经销商、农药进口贸易商、农场主。'
        },
        {
          questionType: 'single',
          section: '业务操作流程',
          questionText: '客户背调中，经营规模的"中大"档对应进口额多少？',
          optionA: '$0-100w',
          optionB: '$100-200w',
          optionC: '$200-500w',
          optionD: '$500w 以上',
          correctAnswer: 'C',
          explanation: '经营规模：小 $0-100w、中小 $100-200w、中大 $200-500w、大 $500w 以上。'
        },
        {
          questionType: 'single',
          section: '业务操作流程',
          questionText: '开发信技巧中，针对不同角色的沟通重点正确的是？',
          optionA: '面对管理层谈产品细节',
          optionB: '面对技术讲技术优势，面对采购讲行情/价格优势',
          optionC: '面对所有人都陷于价格',
          optionD: '无需区分角色',
          correctAnswer: 'B',
          explanation: '开发信要面对管理层谈趋势、讲战略，面对技术讲技术优势，面对采购讲行情/价格优势。'
        },
        {
          questionType: 'single',
          section: '业务操作流程',
          questionText: '产品登记评估中，ICAMA List 用于判断什么？',
          optionA: '产品是否在清单内',
          optionB: '客户信用',
          optionC: '付款方式',
          optionD: '运输方式',
          correctAnswer: 'A',
          explanation: '产品登记评估通过 ICAMA List 判断产品是否在清单内，进而评估登记周期与文件制作。'
        },
        {
          questionType: 'single',
          section: '业务操作流程',
          questionText: '合同谈判中，若客户有账期，需提前评估什么？',
          optionA: '广告投放',
          optionB: '信保',
          optionC: '包装设计',
          optionD: '展会安排',
          correctAnswer: 'B',
          explanation: '合同谈判关注客户资信，有账期的提前评估信保。'
        },
        {
          questionType: 'single',
          section: '销售技巧',
          questionText: '客户决策树中，批准人（采购/登记负责人）拥有什么权限？',
          optionA: '最终决策权',
          optionB: '审批权',
          optionC: '评价权和选择权',
          optionD: '一票否决权',
          correctAnswer: 'B',
          explanation: '批准人（采购/登记负责人）拥有审批权；评估者（登记、技术、采购）拥有评价权和选择权。'
        },
        {
          questionType: 'single',
          section: '销售技巧',
          questionText: '邮件开发信发送时间应注意？',
          optionA: '随时发送',
          optionB: '看好客户的上班时间',
          optionC: '只在周末发送',
          optionD: '半夜发送',
          correctAnswer: 'B',
          explanation: '邮件发送时间要看好客户的上班时间，以提高打开率。'
        },
        {
          questionType: 'single',
          section: '销售技巧',
          questionText: '开发信邮件结构的三段式是？',
          optionA: '介绍产品→介绍价格→介绍发货',
          optionB: '我能带给客户什么好处→客户凭什么相信我→引导客户下一步',
          optionC: '公司介绍→产品介绍→联系方式',
          optionD: '价格→交期→售后',
          correctAnswer: 'B',
          explanation: '邮件结构：第一段我能带给客户什么好处；第二段客户凭什么相信我；第三段引导客户下一步进展。'
        },
        {
          questionType: 'single',
          section: '销售技巧',
          questionText: '客户跟进中，A 类客户（✮✮✮✮✮）通常对应哪类客户？',
          optionA: '潜在目标客户',
          optionB: '洽谈客户',
          optionC: '履约客户',
          optionD: '跟进客户',
          correctAnswer: 'C',
          explanation: '金字塔顶部 A 类客户价值最高，对应履约客户，成功概率越高。'
        },
        {
          questionType: 'single',
          section: '销售技巧',
          questionText: '客户一般性跟进的基本原则中，说法正确的是？',
          optionA: '回复慢也无所谓',
          optionB: '快速回复客人很重要，但回复快不代表随意回',
          optionC: '与客户争辩更有说服力',
          optionD: '盲目揣测客户意图',
          correctAnswer: 'B',
          explanation: '客户跟进要注重时效，快速回复客人很重要，但回复快不代表随意回；不要争辩、停止盲目揣测、展示专业、条理清晰。'
        },
        {
          questionType: 'single',
          section: '销售技巧',
          questionText: '展会开发中，展后跟进的做法不包括？',
          optionA: '客户信息+需求梳理',
          optionB: '客户资料补充+建档',
          optionC: '客户回访+跟进计划',
          optionD: '展会结束后不再联系',
          correctAnswer: 'D',
          explanation: '展后跟进包括客户信息+需求梳理、客户资料补充+建档、客户回访+跟进计划、回访邮件、回访电话等。'
        },
        {
          questionType: 'single',
          section: '销售技巧',
          questionText: '报价跟进中，客户报价后不回复或迟迟不决策，应如何处理？',
          optionA: '不断发邮件催问进展',
          optionB: '分析具体原因，有节奏地跟进，通过专业度和服务打动客户',
          optionC: '停止跟进',
          optionD: '直接降价跳楼',
          correctAnswer: 'B',
          explanation: '报价后客户不回复要分析具体原因，有节奏地跟进，通过专业度和服务侧面打动客户，而不是干硬逼单。'
        },
        {
          questionType: 'single',
          section: '销售技巧',
          questionText: '登记跟进中，免费登记的条件是？',
          optionA: '任何客户都可以免费登记',
          optionB: '整体评估质量高（业务匹配度高、发展方向一致、态度积极、独家登记、登记后采购量大等）',
          optionC: '非独家登记且投入较大的',
          optionD: '从未采购过的客户',
          correctAnswer: 'B',
          explanation: '整体评估质量高（业务匹配度高、发展方向一致、态度积极、独家登记、登记后采购量大等）的客户可支持免费登记。'
        },
        {
          questionType: 'single',
          section: '销售技巧',
          questionText: '意向客户跟进技巧中，报价之后、合同之前应采取的做法是？',
          optionA: '减少跟进频率',
          optionB: '加大跟进频率，了解库存、货物使用情况、审批流程等',
          optionC: '不再联系客户',
          optionD: '只谈价格不谈服务',
          correctAnswer: 'B',
          explanation: '掌握客户采购周期且有明确采购意向时，报价之后合同之前要加大跟进频率，了解库存情况、货物使用情况、审批流程等。'
        },
        {
          questionType: 'single',
          section: '销售技巧',
          questionText: '售后服务中，以下哪项不属于服务内容？',
          optionA: '订单返利/节日礼品，关系维护',
          optionB: '公司动态及时反馈',
          optionC: '市场情报、价格走势提供',
          optionD: '只等下一单，不主动联系',
          correctAnswer: 'D',
          explanation: '服务包括订单返利/节日礼品关系维护、公司动态反馈、市场情报与价格走势提供、新品推荐等，不能被动等待。'
        }
      ]
    },
    {
      questionSet: {
        name: '嘉禾业务入职培训考核（三）',
        description: '覆盖市场篇、业务篇、业务操作流程、销售技巧四大板块',
        is_active: true,
        allow_view_score: true
      },
      questions: [
        {
          questionType: 'single',
          section: '市场篇',
          questionText: '2022 年全球作物保护农药销售额同比增长多少？',
          optionA: '1.74%',
          optionB: '3.74%',
          optionC: '5.74%',
          optionD: '10%',
          correctAnswer: 'B',
          explanation: '2022 年全球作物保护农药销售额达到 677.5 亿美元，同比增长 3.74%。'
        },
        {
          questionType: 'single',
          section: '市场篇',
          questionText: '拉丁美洲农药销售额占全球的比例约为？',
          optionA: '31.59%',
          optionB: '27.62%',
          optionC: '20%',
          optionD: '15%',
          correctAnswer: 'B',
          explanation: '亚太地区占比 31.59%，拉丁美洲次之占比 27.62%。'
        },
        {
          questionType: 'single',
          section: '市场篇',
          questionText: '2022 年我国农药出口呈现什么特点？',
          optionA: '量减额减',
          optionB: '量额双增',
          optionC: '量增额减',
          optionD: '量减额增',
          correctAnswer: 'B',
          explanation: '2022 年农药出口呈现"量额双增"特点，出口数量同比增长 2%，出口贸易额同比增长 38.7%。'
        },
        {
          questionType: 'single',
          section: '市场篇',
          questionText: 'Nova 的目标客户中，经销商的进口特征为？',
          optionA: '以原药进口为主',
          optionB: '中等以上规模、以制剂进口为主',
          optionC: '以小规模为主',
          optionD: '以成品出口为主',
          correctAnswer: 'B',
          explanation: '目标客户为有中国农药进口需求的经销商或农场主，中等以上规模、以制剂进口为主、定制要求高。'
        },
        {
          questionType: 'single',
          section: '市场篇',
          questionText: '市场开发基础能力中，"产品基础"不包括以下哪项？',
          optionA: '产品基础知识',
          optionB: '产品应用领域',
          optionC: '产品市场行情',
          optionD: '外语口音',
          correctAnswer: 'D',
          explanation: '产品基础包括产品基础知识、产品应用领域、产品市场行情；外语口音属于语言基础的范畴。'
        },
        {
          questionType: 'single',
          section: '市场篇',
          questionText: '原药（technical material）的英文代码是？',
          optionA: 'TC',
          optionB: 'TK',
          optionC: 'DP',
          optionD: 'GR',
          correctAnswer: 'A',
          explanation: '原药 technical material 代码为 TC；母药 TK，粉剂 DP，颗粒剂 GR。'
        },
        {
          questionType: 'single',
          section: '市场篇',
          questionText: '微乳剂（micro-emulsion）的代码是？',
          optionA: 'EC',
          optionB: 'EW',
          optionC: 'ME',
          optionD: 'SC',
          correctAnswer: 'C',
          explanation: '微乳剂 micro-emulsion 代码为 ME；乳油 EC，水乳剂 EW，悬浮剂 SC。'
        },
        {
          questionType: 'single',
          section: '市场篇',
          questionText: '客户开发中，开发信沟通的特点不包括？',
          optionA: '邮件：开发信',
          optionB: '电话',
          optionC: '视频',
          optionD: '只发传单',
          correctAnswer: 'D',
          explanation: '客户触达方式包括邮件开发信、电话、视频、面对面交流，不含发传单。'
        },
        {
          questionType: 'single',
          section: '市场篇',
          questionText: '海关数据分析中，若客户"原产中国、供应商中国"，且供应商为制剂商，合作难度为几星？',
          optionA: '1 星',
          optionB: '2 星',
          optionC: '3 星',
          optionD: '4 星',
          correctAnswer: 'B',
          explanation: '原产中国、供应商为中国时：贸易商合作难度 1 星，制剂商 2 星，原药厂 3 星。'
        },
        {
          questionType: 'single',
          section: '市场篇',
          questionText: '客户画像中，"经营状况"维度包括哪些内容？',
          optionA: '国别地区、企业规模',
          optionB: '销售规模、公司信用、近年采购变化',
          optionC: '采购需求、供应商',
          optionD: '宗教信仰、生活规律',
          correctAnswer: 'B',
          explanation: '客户画像经营状况包括销售规模、公司信用、近年采购变化等；基本面包括国别地区、企业规模等；业务面包括采购需求、供应商等。'
        },
        {
          questionType: 'single',
          section: '业务篇',
          questionText: '农药的广义定义中，不包括以下哪类？',
          optionA: '杀灭病虫草有害生物的物质',
          optionB: '调节植物、昆虫生长的物质',
          optionC: '化学合成或源于生物、其他天然物质',
          optionD: '普通食品添加剂',
          correctAnswer: 'D',
          explanation: '农药指用于预防、消灭或控制危害农业、林业的病、虫、草和其他有害生物以及有目的地调节植物、昆虫生长的物质，普通食品添加剂不属于农药。'
        },
        {
          questionType: 'single',
          section: '业务篇',
          questionText: '制剂加工的意义不包括以下哪项？',
          optionA: '高毒农药低毒化',
          optionB: '提高农药药效',
          optionC: '扩大使用范围',
          optionD: '降低农药价格',
          correctAnswer: 'D',
          explanation: '制剂加工的意义包括不能直接使用、无法均匀使用、部分产品毒性强、提高农药药效、扩大使用范围，不含降低价格。'
        },
        {
          questionType: 'single',
          section: '业务篇',
          questionText: '全球销量排名前十的杀菌剂中，"代森锰锌"属于哪一类？',
          optionA: '甲氧基丙烯酸酯类',
          optionB: '三唑类',
          optionC: '硫代氨基甲酸酯类',
          optionD: '羧酰胺类',
          correctAnswer: 'C',
          explanation: '代森锰锌 Mancozeb 属于硫代氨基甲酸酯类。'
        },
        {
          questionType: 'single',
          section: '业务篇',
          questionText: '吡唑醚菌酯相比嘧菌酯，在大田（如小麦白粉病、锈病、水稻纹枯病）防治方面表现如何？',
          optionA: '不如嘧菌酯',
          optionB: '更有优势、更有前景',
          optionC: '两者完全相同',
          optionD: '无法比较',
          correctAnswer: 'B',
          explanation: '跟嘧菌酯比较，在卵菌纲方面差不多，但在大田如小麦白粉病、锈病、水稻纹枯病防治方面，吡唑醚菌酯更有优势。'
        },
        {
          questionType: 'single',
          section: '业务篇',
          questionText: '铜制剂杀菌剂的特点不包括？',
          optionA: '杀菌谱广，粘着性强',
          optionB: '耐雨水冲刷，持效期长',
          optionC: '来源方便，价格低廉',
          optionD: '混用性极好',
          correctAnswer: 'D',
          explanation: '铜制剂杀菌谱广、粘着性强、耐雨水冲刷、持效期长、来源方便、价格低廉、性价比高，但混用性差。'
        },
        {
          questionType: 'single',
          section: '业务篇',
          questionText: '昆虫生长调节剂类杀虫剂的主要产品包括？',
          optionA: '虫酰肼、噻嗪酮、除虫脲',
          optionB: '吡虫啉、噻虫嗪',
          optionC: '毒死蜱、辛硫磷',
          optionD: '阿维菌素、多杀霉素',
          correctAnswer: 'A',
          explanation: '昆虫生长调节剂类主要产品有虫酰肼、噻嗪酮、抑食肼、除虫脲。'
        },
        {
          questionType: 'single',
          section: '业务篇',
          questionText: 'EXW 术语中，卖方负责办理出口报关手续吗？',
          optionA: '负责',
          optionB: '不负责',
          optionC: '视情况而定',
          optionD: '只负责一半',
          correctAnswer: 'B',
          explanation: 'EXW 术语下卖方不负责将货物装上买方安排的车或船，也不办理出口报关手续，买方负担一切费用和风险。'
        },
        {
          questionType: 'single',
          section: '业务篇',
          questionText: 'FOB 术语下，卖方是否有办理货运保险的义务？',
          optionA: '有',
          optionB: '没有',
          optionC: '必须办理',
          optionD: '由买方指定保险',
          correctAnswer: 'B',
          explanation: 'FOB 术语下卖方没有办理货运保险的义务，买方应根据情况自行办理。'
        },
        {
          questionType: 'single',
          section: '业务篇',
          questionText: '信用证（L/C）的特点说法正确的是？',
          optionA: '属于商业信用，风险较大',
          optionB: '属于银行信用，付款风险较小，但成本增加',
          optionC: '收款周期很短',
          optionD: '对制单要求很低',
          correctAnswer: 'B',
          explanation: 'L/C 属于银行信用，付款方式风险较小，但成本增加，收款周期较长，信用证软条款风险对制单要求较高。'
        },
        {
          questionType: 'single',
          section: '业务篇',
          questionText: '中信保的理赔中，拒收风险下风险发生后多少个工作日内报损？',
          optionA: '5 个工作日',
          optionB: '10 个工作日',
          optionC: '30 个工作日',
          optionD: '60 个工作日',
          correctAnswer: 'B',
          explanation: '拒收风险下，风险发生后 10 个工作日内报损；拖欠风险下 30 天内提交《可损通知书》。'
        },
        {
          questionType: 'multiple',
          section: '业务操作流程',
          questionText: '客户开发前准备工作包括哪些？',
          optionA: '目标市场定位及分析',
          optionB: '目标客户信息收集',
          optionC: '客户背调',
          optionD: '客户与公司业务匹配度',
          correctAnswer: 'ABCD',
          explanation: '客户开发前准备工作包括目标市场定位及分析、目标客户信息收集、客户背调、客户与公司业务匹配度。'
        },
        {
          questionType: 'single',
          section: '业务操作流程',
          questionText: '客户背调中，"经营范围"信息一般不通过以下哪个渠道获取？',
          optionA: '公司网站',
          optionB: '当地农业部网站',
          optionC: 'Google 搜索',
          optionD: '客户内部聊天记录',
          correctAnswer: 'D',
          explanation: '经营范围背调渠道包括公司网站、当地农业部网站（登记产品清单）、Google 搜索（公司相关新闻）等，不含内部聊天记录。'
        },
        {
          questionType: 'single',
          section: '业务操作流程',
          questionText: '客户与公司业务匹配度评估中，不涉及以下哪项？',
          optionA: '业务方向（农药--制剂高匹配）',
          optionB: '需求和痛点',
          optionC: '竞争优势',
          optionD: '客户的血型',
          correctAnswer: 'D',
          explanation: '业务匹配度评估包括业务方向、需求和痛点、主要产品、竞争优势、竞争对手等，与客户血型无关。'
        },
        {
          questionType: 'single',
          section: '业务操作流程',
          questionText: '开发信强调"知己知彼"，其中"知彼"不包括？',
          optionA: '客户所在国家市场环境、登记政策、主要作物、用药偏好',
          optionB: '客户网站及近三年海关数据',
          optionC: '竞争对手的产品特点并对比利弊',
          optionD: '客户的家庭宠物数量',
          correctAnswer: 'D',
          explanation: '知彼包括了解客户所在国市场环境、登记政策、主要作物、用药偏好，研究客户网站和海关数据，了解竞争对手等，与宠物数量无关。'
        },
        {
          questionType: 'single',
          section: '业务操作流程',
          questionText: '产品报价中，"正式报价"应通过什么方式发送？',
          optionA: '口头',
          optionB: '务必用报价格式，通过邮件发送',
          optionC: '短信',
          optionD: '微信',
          correctAnswer: 'B',
          explanation: '正式报价务必用报价格式，通过邮件发送；区分正式专业的报价单与口头报价。'
        },
        {
          questionType: 'single',
          section: '业务操作流程',
          questionText: '合同签订中，付款与回款对应的跟进方式正确的是？',
          optionA: 'T/T 按进度跟进回款',
          optionB: 'OA 按最迟装船日',
          optionC: 'L/C 按提单日/收汇日',
          optionD: 'T/T 不需要跟进',
          correctAnswer: 'A',
          explanation: '回款跟进：T/T 按进度跟进回款；OA 按提单日/收汇日；L/C 按最迟装船日。'
        },
        {
          questionType: 'single',
          section: '销售技巧',
          questionText: '邮件开发的增值服务不包括？',
          optionA: '免费提供几个样品',
          optionB: '免费提供中国农药市场情报',
          optionC: '提供市场行情与价格走势',
          optionD: '承诺无条件长期赊账',
          correctAnswer: 'D',
          explanation: '增值服务包括免费提供样品、免费提供中国农药市场情报、提供市场行情等；无条件长期赊账不属于合理增值服务。'
        },
        {
          questionType: 'single',
          section: '销售技巧',
          questionText: '展会开发中，"展中互动"的做法不包括？',
          optionA: '主动搭讪，提供帮助',
          optionB: '索要名片、引导至座位',
          optionC: '根据名片快速做简单客户背调',
          optionD: '展会现场直接签大额合同',
          correctAnswer: 'D',
          explanation: '展中互动包括主动搭讪、提供茶点、索要名片、根据名片做快速背调、展示公司+互动多提问+倾听、合照等，不直接签大额合同。'
        },
        {
          questionType: 'single',
          section: '销售技巧',
          questionText: '客户跟进中增加客户粘性的做法不包括？',
          optionA: '关注客户 WhatsApp/LinkedIn 动态',
          optionB: '在客户生日、圣诞节等节日发邮件',
          optionC: '提供有价值的资讯、情绪价值和商业价值',
          optionD: '只在自己需要时才联系客户',
          correctAnswer: 'D',
          explanation: '增加客户粘性要关注客户动态、节日维护、提供有价值信息（资讯、情绪价值、商业价值），不能只在需要时联系。'
        },
        {
          questionType: 'single',
          section: '销售技巧',
          questionText: '报价技巧中，若客户反馈报价高，以下应对不正确的是？',
          optionA: '判断询盘真实性，虚盘时提供市场参考价',
          optionB: '相对同行偏高时强调品质稳定性和后续服务',
          optionC: '采购价高时给出不同采购量的报价',
          optionD: '立即大幅降价证明诚意',
          correctAnswer: 'D',
          explanation: '客户反馈报价高时，要判断询盘真实性、了解市场价格强调品质和服务、给出不同采购量报价，不应立即大幅降价（会显得报价水分大）。'
        },
        {
          questionType: 'single',
          section: '销售技巧',
          questionText: '谈判技巧中，"以一换一"原则适用于？',
          optionA: '客户提出难以满足的要求时',
          optionB: '客户要求降价时',
          optionC: '客户要求延长账期时',
          optionD: '客户提出任何要求时',
          correctAnswer: 'A',
          explanation: '如果顾客提出的要求有些为难的话，可以采用"以一换一"的原则，并管理好客户的预期。'
        },
        {
          questionType: 'single',
          section: '销售技巧',
          questionText: '履约阶段订单履约的原则是？',
          optionA: '有变化先找解决办法，再跟客户反馈协商',
          optionB: '有变化直接告知客户',
          optionC: '隐瞒变化',
          optionD: '只要按时发货即可',
          correctAnswer: 'A',
          explanation: '履约中如果有变化或调整（如生产延误、船期推迟、产品涨价、无货源等），要先找到解决办法，再跟客户反馈协商。'
        },
        {
          questionType: 'single',
          section: '销售技巧',
          questionText: '售后阶段"订单售后"的做法是？',
          optionA: '关心客户动态、产品销路和使用情况、市场反馈',
          optionB: '收款后不再关注',
          optionC: '只处理投诉',
          optionD: '等客户主动联系',
          correctAnswer: 'A',
          explanation: '售后要关心客户动态、产品销路/使用情况、市场反馈情况，让客户觉得你不只盯着单子，而是帮他更好地销售产品。'
        }
      ]
    }
  ]
}