const script = {
	"早上好，我今天有什么安排？": {
		type: "card",
		payload: {
			title: "早上好，小明！今天安排很充实哦~",
			items: [
				{
					type: "heading",
					text: "上午第一节课："
				},
				{
					type: "field",
					label: "课程",
					value: "《大学物理》",
					path: "/pages/features/schedule"
				},
				{
					type: "field",
					label: "时间",
					value: "08:30 - 10:05"
				},
				{
					type: "field",
					label: "地点",
					value: "2号教学楼 A301教室",
					path: "/pages/features/map?location=2A301"
				},
			],
			buttons: [{
				text: "地图导航",
				action: "navigate",
				path: "/pages/features/map?location=2A301"
			}],
			footer: "今天天气晴朗，最高温度28度，记得做好防晒哦！☀️"
		}
	},
	"我下午三点到五点没课，想去图书馆自习，帮我预约一个座位。": {
		type: "card",
		payload: {
			title: "预约成功！",
			items: [{
					type: "field",
					label: "地点",
					value: "图书馆三楼电子阅览区"
				},
				{
					type: "field",
					label: "座位",
					value: "B07号"
				},
				{
					type: "field",
					label: "时间",
					value: "今天 15:00 - 17:00"
				},
			],
			qrCode: "/static/images/预约凭证.png",
			buttons: [{
				text: "查看我的凭证",
				action: "navigate",
				path: "/pages/features/studyroom?showVoucher=true"
			}],
			footer: "您的预约凭证已生成，可进入凭证中心查看。"
		}
	},
	"现在哪个食堂人最少？": {
		type: "richContent",
		payload: {
			title: "根据校园实时人流数据分析：",
			list: [
				{ text: "一食堂： 人流密集 🔴", path: "/pages/features/food?canteen=1" },
				{ text: "二食堂： 人流适中 🟡", path: "/pages/features/food?canteen=2" },
				{ text: "清真食堂： 人流稀少 🟢", path: "/pages/features/food?canteen=3" }
			],
			image: "/static/images/canteen_heatmap.png",
			suggestion: "建议： 目前前往【清真食堂】用餐，预计无需排队。"
		}
	},
	"帮我查查有没有快递？": {
		type: "parcel",
		payload: {
			title: "好的，小明。为您找到2个待取包裹：",
			parcels: [{
					title: "包裹1 (京东快递):",
					location: "菜鸟驿站 (三食堂旁)",
					code: "1-2-3456",
					path: "/pages/features/express?id=JD123"
				},
				{
					title: "包裹2 (顺丰快递):",
					location: "丰巢快递柜 (五栋宿舍楼下)",
					code: "886655",
					path: "/pages/features/express?id=SF456"
				}
			]
		}
	},
	"帮我把这个在图书馆里打印出来。": {
		type: "card",
		payload: {
			title: "打印任务已发送",
			items: [{
					type: "field",
					label: "详情",
					value: "已连接到图书馆二楼的A-03号打印机。"
				},
				{
					type: "field",
					label: "状态",
					value: "打印完成，请凭验证码 5278 前往取件。"
				}
			],
			buttons: [{
				text: "查看共享设备",
				action: "navigate",
				path: "/pages/features/shared-devices"
			}]
		}
	},
	"五栋宿舍楼还有空的洗衣机吗？": {
		type: "card",
		payload: {
			title: "洗衣机状态查询",
			items: [{
					type: "field",
					label: "状态",
					value: "您所在位置的洗衣机均在使用中。"
				},
				{
					type: "field",
					label: "推荐",
					value: "位于一楼的07号机将在3分钟后结束，已为您提前锁定15分钟。"
				}
			],
			buttons: [{
				text: "查看附近洗衣机",
				action: "navigate",
				path: "/pages/features/shared-devices"
			}]
		}
	},
	"今晚学校有什么精彩活动吗？": {
		type: "list",
		payload: {
			title: "今晚的校园生活很精彩哦：",
			items: [
				{ text: "【讲座】 《人工智能与未来》- 地点：大礼堂 - 时间：19:30", path: "/pages/events/detail?id=lecture01" },
				{ text: "【电影】 英语角放映《心灵捕手》 - 地点：外语楼报告厅 - 时间：20:00", path: "/pages/events/detail?id=movie02" },
				{ text: "【社团】 吉他社招新表演 - 地点：大学生活动中心 - 时间：19:00", path: "/pages/events/detail?id=club03" }
			]
		}
	}
};

const defaultResponse = {
	type: 'text',
	payload: {
		text: "抱歉，我暂时无法理解您的指令。您可以试试说：'今天有什么安排？'或'哪个食堂人最少？'"
	}
};

export default {
	getResponse(userInput) {
		// 返回一个Promise，模拟异步API调用
		return new Promise(resolve => {
			setTimeout(() => {
				const response = script[userInput] || defaultResponse;
				resolve(response);
			}, 500 + Math.random() * 500); // 模拟网络延迟
		});
	}
}; 