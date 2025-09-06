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
        const res = await uni.request({
          url: 'http://localhost:3000/api/im/register', // 请确保这是您后端服务的正确地址
          method: 'POST',
          header: {
            'Authorization': `Bearer ${uni.getStorageSync('token')}`
          }
        })

        if (!res.data.success) {
          throw new Error(res.data.message || '获取IM凭证失败')
        }

        const { account, imToken, appKey } = res.data;

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
        })

        nim.connect().then(() => {
          console.log('NEUIKit 初始化并连接成功');
          uni.$emit('IM_LOGIN_SUCCESS'); // 发送登录成功通知
        });

      } catch (error) {
        console.error('初始化 NEUIKit 失败:', error)
        uni.showToast({
          title: error.message || 'IM连接失败',
          icon: 'none',
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
