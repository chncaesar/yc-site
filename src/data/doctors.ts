/**
 * 医生主数据 —— 全站唯一来源。
 *
 * 「找医生」页面只从这里读取；专访文章不再各自携带姓名、城市、擅长方向，
 * 避免同一医生在两篇文章里写出两套互相矛盾的资料。
 *
 * 字段规范：
 * - name        展示用姓名，不得包含医馆/医院名称
 * - slug        网址标识，中文姓名用全拼（今后可用于独立医生页）
 * - city        所在城市；不详填 '需询问'
 * - specialties 擅长方向，3–5 个自由文本标签
 * - interviews  关联专访的文章标识，引用 src/content/interview 下的文件名（不含 .md）
 *               页面会校验每一条都真实存在，写错会在构建时报错
 */

export interface Doctor {
	name: string;
	slug: string;
	city: string;
	specialties: string[];
	interviews: string[];
}

export const doctors: Doctor[] = [
	// 杭州
	{
		name: '蔡良俊',
		slug: 'cai-liangjun',
		city: '杭州',
		specialties: ['小儿咳嗽', '儿科发烧积食', '妇科调理', '多囊卵巢', '失眠'],
		interviews: ['cai-liangjun-interview', 'cai-liangjun-2025'],
	},
	{
		name: '来建琴',
		slug: 'lai-jianqin',
		city: '杭州',
		specialties: ['脾胃病', '胃肠炎', '失眠', '萎缩性胃炎', '疑难杂症'],
		interviews: ['lai-jianqin-interview'],
	},
	{
		name: '卢继东',
		slug: 'lu-jidong',
		city: '杭州',
		specialties: ['脱发调理', '脂溢性脱发', '产后脱发', '亚健康管理', '中医复方研究'],
		interviews: ['lu-jidong-interview'],
	},
	{
		name: '乃清礼',
		slug: 'nai-qingli',
		city: '杭州',
		specialties: ['肠胃病', '失眠', '鼻炎', '体虚调理', '妇科调理'],
		interviews: ['nai-qingli-interview'],
	},
	{
		name: '沈瑞翔',
		slug: 'shen-ruixiang',
		city: '杭州',
		specialties: ['儿科常见病', '鼻炎', '湿疹', '积食', '腹泻', '夜啼'],
		interviews: ['shen-ruixiang-interview'],
	},
	{
		name: '王泽峰',
		slug: 'wang-zefeng',
		city: '杭州',
		specialties: ['失眠', '慢病综合调理', '新冠后遗症', '全科中医'],
		interviews: ['wang-zefeng-interview'],
	},
	{
		name: '于得水',
		slug: 'yu-deshui',
		city: '杭州',
		specialties: ['正骨整脊', '脑梗后遗症', '颈腰椎病', '帕金森缓解', '静脉曲张'],
		interviews: ['yu-deshui-interview'],
	},
	{
		name: '张航瀚',
		slug: 'zhang-hanghan',
		city: '杭州',
		specialties: ['柔性整骨', '颈腰椎病', '脊柱相关杂症', '运动损伤'],
		interviews: ['zhang-hanhan-interview'],
	},
	{
		name: '章炳炜',
		slug: 'zhang-bingwei',
		city: '杭州',
		specialties: ['中风偏瘫', '脑梗康复', '颈腰椎病', '雷火针'],
		interviews: ['zhang-bingwei-interview'],
	},
	{
		name: '章航',
		slug: 'zhang-hang',
		city: '杭州',
		specialties: ['中风偏瘫', '脑梗康复', '颈腰椎病', '雷火针'],
		interviews: ['zhang-bingwei-interview'],
	},
	{
		name: '邹琦',
		slug: 'zou-qi',
		city: '杭州',
		specialties: ['感冒发烧腹泻', '皮肤病湿疹', '脾胃调理'],
		interviews: ['zou-qi-interview'],
	},
	// 南京
	{
		name: '朱汇滨',
		slug: 'zhu-huibin',
		city: '南京',
		specialties: ['顽固性咳嗽', '肺结节', '失眠多梦', '疲劳乏力', '胃肠不适'],
		interviews: ['zhu-huibin-interview'],
	},
	// 上海
	{
		name: '陈胜',
		slug: 'chen-sheng',
		city: '上海',
		specialties: ['结节肿瘤调理', '慢性病', '失眠焦虑抑郁', '中西医结合'],
		interviews: ['chen-sheng-interview'],
	},
	{
		name: '崔诗然',
		slug: 'cui-shiran',
		city: '上海',
		specialties: ['鼻炎耳鸣', '失眠郁证', '皮肤病湿疹', '胆结石'],
		interviews: ['cui-shiran-interview'],
	},
	{
		name: '代泽宇',
		slug: 'dai-zeyu',
		city: '上海',
		specialties: ['针灸', '痛风', '强直性脊柱炎', '腰痛', '脾胃调理'],
		interviews: ['dai-zeyu-interview'],
	},
	{
		name: '郭小飞',
		slug: 'guo-xiaofei',
		city: '上海',
		specialties: ['痛症针灸', '不孕调理', '内科杂症'],
		interviews: ['guo-xiaofei-interview'],
	},
	{
		name: '王国印',
		slug: 'wang-guoyin',
		city: '上海',
		specialties: ['青少年抑郁焦虑', '情志病', '失眠', '慢性心力衰竭'],
		interviews: ['wang-guoyin-interview'],
	},
	{
		name: '印虎',
		slug: 'yin-hu',
		city: '上海',
		specialties: ['痛经子宫腺肌症', '子宫内膜异位症', '甲状腺', '温病'],
		interviews: ['yin-hu-interview'],
	},
	{
		name: '郑文华',
		slug: 'zheng-wenhua',
		city: '上海',
		specialties: ['膏方调理', '儿科助长', '痛经闭经', '备孕助孕', '结节肾病'],
		interviews: ['zheng-wenhua-interview'],
	},
	// 无锡
	{
		name: '张驰宇',
		slug: 'zhang-chiyu',
		city: '无锡',
		specialties: ['小儿流感咳嗽', '鼻炎腺样体', '小儿推拿', '针灸', '皮肤病'],
		interviews: ['zhang-chiyu-interview'],
	},
	// 武汉
	{
		name: '段正莉',
		slug: 'duan-zhengli',
		city: '武汉',
		specialties: ['不孕不育', '妇科调理', '月经失调', '高龄备孕', '多囊卵巢'],
		interviews: ['duan-zhengli-interview'],
	},
	{
		name: '张虹',
		slug: 'zhang-hong',
		city: '武汉',
		specialties: ['中西医结合眼科', '视神经萎缩', '针灸治眼病', '青光眼', '眼底病'],
		interviews: ['zhang-hong-interview'],
	},
];
