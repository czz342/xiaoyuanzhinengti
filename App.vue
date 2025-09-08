<script>
import RootStore from '@xkit-yx/im-store'
import { NimKitCore } from '@xkit-yx/core-kit/dist/uniapp-nim-core'
import { getMsgContentTipByType } from './pages/NEUIKit/utils/msg'
import { getUniPlatform } from './pages/NEUIKit/utils'

export default {
  onLaunch: function () {
    console.log('App Launch')
    const token = uni.getStorageSync('token')
    if (token) {
      this.initNim()
    }
  },
  onShow: function () {
    console.log('App Show')
  },
  onHide: function () {
    console.log('App Hide')
  },
  methods: {
    async initNim() {
      // 关键修复：每次初始化前，都先确保上一个实例被彻底销毁
      this.logoutNim(); 

      try {
        const token = uni.getStorageSync('token');
        console.log('🔍 开始初始化NEUIKit，token:', token ? '存在' : '不存在');
        
        if (!token) {
          throw new Error('用户未登录，无法初始化IM服务');
        }

        console.log('📡 正在请求IM注册...');
        const res = await uni.request({
          url: 'http://localhost:3000/api/im/register',
          method: 'POST',
          header: {
            'Authorization': `Bearer ${token}`
          }
        })

        console.log('📡 IM注册响应:', res);

        if (!res.data || !res.data.success) {
          throw new Error(res.data?.message || '获取IM凭证失败')
        }

        const { account, imToken, appKey } = res.data;
        console.log('✅ 获取到IM凭证:', { account, appKey, tokenLength: imToken?.length });

        const isWeixinApp = getUniPlatform() === 'mp-weixin'
        const nim = uni.$UIKitNIM = new NimKitCore({
          initOptions: {
            "appkey": appKey,
            "account": account,
            "token": imToken,
            "lbsUrls": isWeixinApp ? [
              "https://lbs.netease.im/lbs/wxwebconf.jsp"
            ] : [
              "https://lbs.netease.im/lbs/webconf.jsp"
            ],
            "linkUrl": isWeixinApp ? 'wlnimsc0.netease.im' : 'weblink.netease.im',
            "needReconnect": true,
            "isFixedDeviceId": true,
            debugLevel: 'debug',
          },
          platform: 'UniApp',
        })
        
        const store = uni.$UIKitStore = new RootStore(nim, {
          addFriendNeedVerify: false,
          teamBeInviteMode: 'noVerify',
          teamJoinMode: 'noVerify',
          teamUpdateExtMode: 'all',
          teamUpdateTeamMode: 'all',
          teamInviteMode: 'all',
          // 添加消息相关配置
          sendMsgBefore: async (options, type) => {
            const pushContent = getMsgContentTipByType({ body: options.body, type })
            const pushInfo = {
              needPush: true,
              needPushBadge: true,
              pushPayload: '{}',
              pushContent,
              needForcePush: false,
              forcePushIDsList: '[]',
              forcePushContent: pushContent,
            }
            return { ...options, pushInfo }
          },
        })

        nim.connect().then(() => {
          console.log('NEUIKit 初始化并连接成功');
          uni.$emit('IM_LOGIN_SUCCESS'); // 发送登录成功通知
        });

      } catch (error) {
        console.error('❌ 初始化 NEUIKit 失败:', error);
        console.error('❌ 错误详情:', {
          message: error.message,
          stack: error.stack,
          response: error.response || '无响应数据'
        });
        
        uni.showToast({
          title: `IM服务初始化失败: ${error.message}`,
          icon: 'none',
          duration: 5000
        });
      }
    },
    logoutNim() {
      // 关键修复：同时销毁NIM实例和Store实例
      if (uni.$UIKitNIM) {
        uni.$UIKitNIM.destroy();
      }
      if (uni.$UIKitStore) {
        uni.$UIKitStore.destroy();
      }
      uni.$UIKitNIM = null;
      uni.$UIKitStore = null;
      console.log('IM instance and store destroyed.');
    }
  }
}
</script>

<style>
	/*每个页面公共css */
</style>
