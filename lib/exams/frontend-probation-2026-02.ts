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

export interface FrontendProbationExamSeed {
  category: SeedCategory
  questionSet: SeedQuestionSet
  questions: SeedQuestion[]
}

export const frontendProbationExamSeed: FrontendProbationExamSeed = {
  category: {
    name: '前端转正考核',
    description: '采购端(buyer-web) + 管理后台(admin-ui) 业务与技术能力考核',
    icon: 'Award',
    color: '#0ea5e9',
    sort_order: 10,
    is_active: true,
    is_exam_enabled: true,
    allow_view_score: true
  },
  questionSet: {
    name: '前端转正考核（采购端+管理后台）',
    description: '覆盖 buyer-web 业务流程、鉴权/i18n、SSE、admin-ui 权限与无感刷新等',
    is_active: true,
    allow_view_score: true
  },
  questions: [
    {
      questionType: 'single',
      section: 'BuyerWeb-业务',
      questionText: '采购端购物车页提供的三类批量动作是？',
      optionA: '仅“加入购物车/删除”',
      optionB: '“询价(enquiry) / 申请样品(sample) / 意向(intention)”',
      optionC: '“支付/退款/开票”',
      optionD: '“发货/签收/评价”',
      correctAnswer: 'B',
      explanation: '购物车页顶部 action 区域明确三个按钮，对应弹窗操作。'
    },
    {
      questionType: 'multiple',
      section: 'BuyerWeb-业务',
      questionText: '询价列表在“非草稿(menuIndex==0)”时才显示的列有哪些？',
      optionA: 'maxReplyTime',
      optionB: 'status',
      optionC: 'lastReplyTime',
      optionD: 'deliveryPlace',
      correctAnswer: 'ABC',
      explanation: '询价列表 PC 表头里这三列有 v-if="menuIndex == 0"。'
    },
    {
      questionType: 'single',
      section: 'BuyerWeb-业务',
      questionText: '询价列表“催办(urge)”调用的接口是？',
      optionA: '/buyer-api/buyer/case-urge-log/create',
      optionB: '/buyer-api/buyer/case-draft/get-enquiry',
      optionC: '/buyer-api/buyer/cart/remove',
      optionD: '/buyer-api/buyer/chat/message/feedback',
      correctAnswer: 'A',
      explanation: 'urgeItem 在非草稿且允许催办时 POST 到该接口。'
    },
    {
      questionType: 'single',
      section: 'BuyerWeb-业务',
      questionText: '样品列表草稿编辑时获取草稿详情调用哪个接口？',
      optionA: '/buyer-api/buyer/case-draft/get-samplereq',
      optionB: '/buyer-api/buyer/case-draft/get-intention',
      optionC: '/buyer-api/buyer/case-draft/get-enquiry',
      optionD: '/buyer-api/buyer/case/samplereq/create-record',
      correctAnswer: 'A',
      explanation: '样品页 editItem 调用该草稿接口并打开 samplePopup。'
    },
    {
      questionType: 'single',
      section: 'BuyerWeb-业务',
      questionText: '意向列表草稿编辑时获取草稿详情调用哪个接口？',
      optionA: '/buyer-api/buyer/case-draft/get-intention',
      optionB: '/buyer-api/buyer/case-draft/get-samplereq',
      optionC: '/buyer-api/buyer/case-draft/get-enquiry',
      optionD: '/buyer-api/buyer/category/list',
      correctAnswer: 'A',
      explanation: '意向页 editItem 在草稿态获取草稿详情调用 get-intention。'
    },
    {
      questionType: 'single',
      section: 'BuyerWeb-业务',
      questionText: '产品详情页点击“Enquire price now”实际触发的是？',
      optionA: '跳转到 /pages/inquiry/index',
      optionB: '打开 pageLayout.inquiyPopup(pageData)',
      optionC: '直接调用 /buyer-api/buyer/case/enquiry/create',
      optionD: '打开支付弹窗',
      correctAnswer: 'B',
      explanation: '按钮直接调用 @tap.stop="$refs.pageLayout.inquiyPopup(pageData)"。'
    },
    {
      questionType: 'multiple',
      section: 'BuyerWeb-业务',
      questionText: '购物车列表数据的展示分组维度是？',
      optionA: '按 company 分组',
      optionB: '按 category 分组',
      optionC: '按 supplier region 分组',
      optionD: '每组内部按该 company 的商品 list 展示',
      correctAnswer: 'AD',
      explanation: '/buyer-api/buyer/cart/list-by-company 返回 [{ company, list: [] }] 结构。'
    },
    {
      questionType: 'single',
      section: 'BuyerWeb-业务',
      questionText: '购物车删除单条时给后端的 ids 形态是？',
      optionA: '数组 ids: [id]',
      optionB: '字符串 ids: "1,2,3"',
      optionC: '单值 ids: id',
      optionD: '不传 ids，传 cartId',
      correctAnswer: 'C',
      explanation: 'del(val) 里 ids: val，批量才 join 成字符串。'
    },
    {
      questionType: 'single',
      section: 'BuyerWeb-业务',
      questionText: '买家端 AI 消息不满意反馈弹窗依赖哪个字典类型，否则会 toast 提示缺失？',
      optionA: 'ai_feedback',
      optionB: 'formulation_list',
      optionC: 'buyer_demand_service_type',
      optionD: 'infra_boolean_string',
      correctAnswer: 'A',
      explanation: '首页 AI 模块对反馈类型 options 为空会提示缺少字典 ai_feedback。'
    },
    {
      questionType: 'single',
      section: 'BuyerWeb-业务',
      questionText: '买家端“购物车数量”从哪个接口获取？',
      optionA: '/buyer-api/buyer/cart/total',
      optionB: '/buyer-api/buyer/cart/list-by-company',
      optionC: '/buyer-api/buyer/cart/add',
      optionD: '/buyer-api/buyer/cart/remove',
      correctAnswer: 'A',
      explanation: 'util.getCartTotal 调用 GET /buyer-api/buyer/cart/total。'
    },
    {
      questionType: 'multiple',
      section: 'BuyerWeb-业务',
      questionText: '买家端“基础字典类”接口包含哪些？',
      optionA: 'currency',
      optionB: 'country',
      optionC: 'timezone',
      optionD: 'category/list',
      correctAnswer: 'ABC',
      explanation: 'dict-data/currency、dict-data/country、dict-data/timezone 属于字典；分类是 category/list。'
    },
    {
      questionType: 'single',
      section: 'AdminUI-业务',
      questionText: '后台通过指令 v-hasPermi 控制按钮显示的策略是？',
      optionA: '没权限时禁用按钮（disabled）',
      optionB: '没权限时隐藏按钮（从 DOM 移除）',
      optionC: '没权限时跳转 403 页面',
      optionD: '没权限时显示“申请权限”弹窗',
      correctAnswer: 'B',
      explanation: 'hasPermi 指令在无权限时会移除节点。'
    },
    {
      questionType: 'single',
      section: 'BuyerWeb-业务',
      questionText: '买家端请求头里用于国际化的字段是？',
      optionA: 'Content-Language',
      optionB: 'Accept-Language',
      optionC: 'X-Locale',
      optionD: 'lang',
      correctAnswer: 'B',
      explanation: 'buyer-web 请求封装在 header 设置 Accept-Language。'
    },
    {
      questionType: 'multiple',
      section: 'BuyerWeb-业务',
      questionText: '询价/样品/意向列表都支持的共同能力有哪些？',
      optionA: '关键词搜索（queryData.keyword watch）',
      optionB: '草稿与非草稿切换（menuIndex）',
      optionC: '批量选择（selectIdArr + isSelectAll）',
      optionD: '导出动作（menuExportAction）',
      correctAnswer: 'ABCD',
      explanation: '三个列表页面结构相似：搜索、菜单切换、批量勾选、导出。'
    },
    {
      questionType: 'single',
      section: 'BuyerWeb-业务',
      questionText: '询价列表中“查看/回复/编辑”的行为差异，主要由哪个状态决定？',
      optionA: 'menuIndex（草稿/非草稿）',
      optionB: 'isPC',
      optionC: 'pageOffset',
      optionD: 'showLeftMenu',
      correctAnswer: 'A',
      explanation: '草稿态允许编辑，非草稿态允许催办/回复等。'
    },
    {
      questionType: 'single',
      section: 'BuyerWeb-业务',
      questionText: '会员配额信息从哪个接口获取？',
      optionA: '/buyer-api/buyer/membermng/quota',
      optionB: '/buyer-api/buyer/user/query-info',
      optionC: '/buyer-api/buyer/vip-permission/dashboard',
      optionD: '/buyer-api/buyer/vip-permission/refresh-cache',
      correctAnswer: 'A',
      explanation: 'util.getCompanyQuota 调用 GET /buyer-api/buyer/membermng/quota。'
    },
    {
      questionType: 'single',
      section: 'BuyerWeb-技术',
      questionText: 'buyer-web/config/api.js 里在客户端请求头设置 Access-Control-Allow-Origin: * 的效果是？',
      optionA: '正确启用 CORS',
      optionB: '只对服务端响应头有效，客户端设置基本无效',
      optionC: '会导致浏览器拒绝请求',
      optionD: '会自动携带 cookie',
      correctAnswer: 'B',
      explanation: 'CORS 由服务端响应头控制；客户端加这个 header 基本不起作用。'
    },
    {
      questionType: 'multiple',
      section: 'BuyerWeb-技术',
      questionText: 'apisNotHasToken 的匹配方式带来的潜在问题有哪些？',
      optionA: 'indexOf 子串匹配可能误命中，导致本该登录的接口被当作白名单',
      optionB: '完全匹配，安全性最高',
      optionC: 'map 仅用于副作用，语义不清晰，应改 some',
      optionD: '路径包含时可能绕过登录校验',
      correctAnswer: 'ACD',
      explanation: '代码用 indexOf 做子串判断且使用 map 副作用，存在误命中与可读性问题。'
    },
    {
      questionType: 'single',
      section: 'BuyerWeb-技术',
      questionText: 'buyer-web/pages/product/detail.vue 中“剂型(formulation)”展示文本的来源优先级是？',
      optionA: '永远使用后端原始 pageData.formulation',
      optionB: '优先字典 formulation_list 映射，否则回退原值',
      optionC: '优先 i18n key，否则回退字典',
      optionD: '固定写死中文',
      correctAnswer: 'B',
      explanation: 'formulationText 优先用 dictData 里的 formulation_list 映射。'
    },
    {
      questionType: 'single',
      section: 'BuyerWeb-技术',
      questionText: 'buyer-web/pages/cart/index.vue 中 isSelectAll 为避免空列表误判做了什么处理？',
      optionA: '空列表返回 true',
      optionB: '空列表返回 false',
      optionC: '空列表抛异常',
      optionD: '空列表随机',
      correctAnswer: 'B',
      explanation: 'isSelectAll 在 pageData.length == 0 时返回 false。'
    },
    {
      questionType: 'multiple',
      section: 'BuyerWeb-技术',
      questionText: 'buyer-web/config/eventSource.js SSE 封装中，哪些做法是为了降低“页面切后台/请求被打断”的问题？',
      optionA: 'openWhenHidden: true',
      optionB: 'isAbortError 对 AbortError 做忽略',
      optionC: 'withCredentials: true',
      optionD: 'onclose 时 resolve 最后一条消息',
      correctAnswer: 'ABD',
      explanation: 'SSE 设置 openWhenHidden，并忽略 AbortError，onclose 返回最后消息。'
    },
    {
      questionType: 'single',
      section: 'BuyerWeb-技术',
      questionText: '购物车批量删除在调用接口前会弹出什么交互？',
      optionA: 'uni.showToast',
      optionB: 'uni.showModal 确认框',
      optionC: 'uni.navigateTo',
      optionD: '无确认直接删除',
      correctAnswer: 'B',
      explanation: 'multiDel 使用 uni.showModal 进行二次确认。'
    },
    {
      questionType: 'single',
      section: 'BuyerWeb-技术',
      questionText: '在 buyer-web/pages/index/index.vue 对 AI 消息点赞时，若消息 id 不存在会怎么处理？',
      optionA: '静默失败',
      optionB: 'toast 提示“消息尚未同步…”，并尝试重新 initConversation',
      optionC: '强制刷新页面',
      optionD: '直接跳登录',
      correctAnswer: 'B',
      explanation: 'likeMessage 会提示并在有 conversationId 时尝试重新同步。'
    },
    {
      questionType: 'multiple',
      section: 'AdminUI-技术',
      questionText: 'admin-ui 的 axios request 拦截器里，对 GET 请求做了哪些防缓存设置？',
      optionA: 'Cache-Control: no-cache',
      optionB: 'Pragma: no-cache',
      optionC: 'Expires: 0',
      optionD: '强制加随机 query',
      correctAnswer: 'AB',
      explanation: 'GET 请求会设置 Cache-Control 与 Pragma 为 no-cache。'
    },
    {
      questionType: 'single',
      section: 'AdminUI-技术',
      questionText: 'admin-ui 无感刷新 token 的“请求队列”主要用于解决什么问题？',
      optionA: '减少包体大小',
      optionB: '多个并发请求同时 401 时，只刷新一次 token，其余请求等待并回放',
      optionC: '支持文件上传进度',
      optionD: '支持 GraphQL batching',
      correctAnswer: 'B',
      explanation: '401 时用队列暂存请求，刷新成功后回放。'
    },
    {
      questionType: 'multiple',
      section: 'AdminUI-技术',
      questionText: 'admin-ui/src/config/axios/service.ts 里，当收到 401 且当前不在刷新中时，可能发生哪些分支？',
      optionA: '没 refreshToken：直接走登出/重新登录流程',
      optionB: 'refresh 成功：回放队列请求 + 重试当前请求',
      optionC: 'refresh 失败：仍然重试当前请求直到成功',
      optionD: 'refresh 失败：回放队列请求，但当前请求不再递归重试，提示重新登录',
      correctAnswer: 'ABD',
      explanation: '无 refreshToken 直接登出；成功则回放并重试；失败则回放队列但当前请求不递归，转登录。'
    },
    {
      questionType: 'single',
      section: 'AdminUI-技术',
      questionText: '多租户开启时，租户信息通过哪个 header 传递？',
      optionA: 'x-tenant',
      optionB: 'tenant-id',
      optionC: 'X-Tenant-Token',
      optionD: 'tenant',
      correctAnswer: 'B',
      explanation: 'request 拦截器在租户开启时设置 tenant-id。'
    },
    {
      questionType: 'multiple',
      section: 'AdminUI-技术',
      questionText: 'paramsSerializer 使用 qs.stringify(params, { allowDots: true }) 的直接影响是？',
      optionA: '支持把嵌套对象序列化成点语法参数（如 a.b=1）',
      optionB: '会把数组强制转成逗号字符串',
      optionC: '避免后端无法解析复杂 query 的问题',
      optionD: '会自动进行加密',
      correctAnswer: 'AC',
      explanation: 'allowDots 让嵌套对象变成点语法，便于后端解析复杂参数。'
    },
    {
      questionType: 'single',
      section: 'AdminUI-技术',
      questionText: 'hasPermi 指令在无权限时为什么选择“移除 DOM”而非“隐藏(display:none)”？',
      optionA: '性能更差',
      optionB: '避免无权限元素仍可被键盘/读屏/脚本访问或误触',
      optionC: '方便截图',
      optionD: '因为 ElementPlus 必须这么做',
      correctAnswer: 'B',
      explanation: '移除 DOM 能减少误操作与信息泄露面。'
    },
    {
      questionType: 'multiple',
      section: '通用-前端',
      questionText: '下面哪些属于“把业务字典写死在前端”带来的风险？',
      optionA: '多语言与业务调整时需要发版，响应慢',
      optionB: '与后端字典不一致导致显示/筛选错乱',
      optionC: '更安全',
      optionD: '难以做运营配置化',
      correctAnswer: 'ABD',
      explanation: '硬编码字典会导致变更成本高、数据不一致、不可配置。'
    },
    {
      questionType: 'single',
      section: '通用-前端',
      questionText: '在 Vue2/uni-app 里对数组对象新增属性时常用 this.$set 的目的是什么？',
      optionA: '触发网络请求',
      optionB: '让新增属性具备响应式能力',
      optionC: '加速渲染',
      optionD: '避免 TS 报错',
      correctAnswer: 'B',
      explanation: 'Vue2 对新增属性不自动响应，需要 $set。'
    },
    {
      questionType: 'multiple',
      section: '通用-前端',
      questionText: '多选题（checkbox）在提交到后端前做 normalize 的必要性有哪些？',
      optionA: '防止 CA 与 AC 被判为不同',
      optionB: '去重，防止重复勾选造成脏数据',
      optionC: '便于存储与对比',
      optionD: '会提升 UI 动画',
      correctAnswer: 'ABC',
      explanation: 'normalize 可排序、去重并统一格式，便于判分与存储。'
    },
    {
      questionType: 'single',
      section: 'BuyerWeb-技术',
      questionText: 'buyer-web/config/api.js 中“未登录且接口不在白名单”时的行为是？',
      optionA: '仍然发请求，后端 401 再处理',
      optionB: '直接 jumpToLoginPage() 并 return，不发请求',
      optionC: 'toast 后继续请求',
      optionD: '重试 3 次',
      correctAnswer: 'B',
      explanation: '请求封装会在未登录且非白名单时直接跳登录并 return。'
    },
    {
      questionType: 'single',
      section: 'BuyerWeb-技术',
      questionText: 'buyer-web/config/api.js 中当返回 result.code == 401，白名单外接口会如何处理？',
      optionA: 'resolve 后继续业务',
      optionB: 'reject',
      optionC: '跳登录页（非白名单）并 resolve(result)',
      optionD: '强制刷新 token',
      correctAnswer: 'C',
      explanation: '401 时若非白名单会跳登录，但仍 resolve(result) 给调用方。'
    },
    {
      questionType: 'multiple',
      section: 'BuyerWeb-技术',
      questionText: 'buyer-web/pages/product/detail.vue 中 ingredients 字段按语言切换 key 的逻辑是？',
      optionA: 'zh-Hans 用 name/content',
      optionB: '非 zh-Hans 用 name_en/content_en',
      optionC: '通过 getCurrentLocale() 判断',
      optionD: '统一用 name_en/content_en',
      correctAnswer: 'ABC',
      explanation: 'ingredientsLang 根据当前语言返回不同字段映射。'
    },
    {
      questionType: 'single',
      section: 'AdminUI-技术',
      questionText: 'ignoreMsgs 的存在主要是为了避免哪类体验问题？',
      optionA: '401 时重复弹窗/提示导致无法正常跳转登出',
      optionB: '500 时不提示',
      optionC: 'Excel 导出失败',
      optionD: 'i18n 丢失',
      correctAnswer: 'A',
      explanation: '忽略特定刷新令牌错误提示，避免 401 循环与重复提示。'
    },
    {
      questionType: 'multiple',
      section: '安全与工程化',
      questionText: '采购端产品详情使用 rich-text :nodes="pageData.description" 时需要关注的风险是？',
      optionA: 'XSS/注入（后端返回 HTML）',
      optionB: '影响 SEO',
      optionC: '需要对富文本做白名单过滤/清洗',
      optionD: '必然导致 CORS 问题',
      correctAnswer: 'AC',
      explanation: '富文本渲染要关注 XSS，必要时做清洗/白名单。'
    },
    {
      questionType: 'single',
      section: 'AdminUI-技术',
      questionText: 'response 拦截器对 blob/arraybuffer 的处理逻辑是？',
      optionA: '一律当作文件下载',
      optionB: '若返回 application/json 则先解析为 JSON 再按错误码处理',
      optionC: '直接丢弃',
      optionD: '自动转 base64',
      correctAnswer: 'B',
      explanation: '二进制响应若实际是 JSON，会解析后按 code/msg 走错误处理。'
    },
    {
      questionType: 'multiple',
      section: '考核系统-技术',
      questionText: '为让考核系统支持多选题，必须改动到哪些环节？',
      optionA: 'DB：答案字段长度与题型字段',
      optionB: '考试页：单选选择 -> 多选勾选',
      optionC: '判分：单值比较 -> 集合一致性比较',
      optionD: '结果页：高亮逻辑支持 includes',
      correctAnswer: 'ABCD',
      explanation: '多选题是全链路需求：存储、出题、作答、判分、展示都要支持。'
    },
    {
      questionType: 'single',
      section: '考核系统-技术',
      questionText: '多选题判分“全对才对”的实现本质是比较什么？',
      optionA: '选项文本是否相同',
      optionB: '选项顺序是否相同',
      optionC: '选择集合与正确集合是否完全一致（normalize 后相等）',
      optionD: '只要包含任意一个正确项就算对',
      correctAnswer: 'C',
      explanation: '应比较集合一致性：normalize 后字符串相等。'
    }
  ]
}

