<script>
import RootStore from '@xkit-yx/im-store'
import { NimKitCore } from '@xkit-yx/core-kit/dist/uniapp-nim-core'
import { getMsgContentTipByType } from './pages/NEUIKit/utils/msg'
import { getUniPlatform } from './pages/NEUIKit/utils'
// #ifdef APP-PLUS
const nimPushPlugin = uni.requireNativePlugin('NIMUniPlugin-PluginModule')
// #endif

export default {
  onLaunch: function () {
    console.log('App Launch')
    // 检查用户是否已登录我们自己的应用
    const token = uni.getStorageSync('token')
    if (token) {
      // 如果已登录，则开始初始化IM
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
      try {
        // 1. 从我们自己的后端获取IM的accid和token
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

        // 2. 严格按照官方文档初始化NimKitCore和RootStore
        const isWeixinApp = getUniPlatform() === 'mp-weixin'
        // @ts-ignore
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
        
        // @ts-ignore
        const store = uni.$UIKitStore = new RootStore(nim, {
          addFriendNeedVerify: false,
          teamBeInviteMode: 'noVerify',
          teamJoinMode: 'noVerify',
          teamUpdateExtMode: 'all',
          teamUpdateTeamMode: 'all',
          teamInviteMode: 'all',
          // ... 其他配置可以根据文档添加
        })

        // 3. 连接IM服务器
        nim.connect()
        console.log('NEUIKit 初始化成功')

      } catch (error) {
        console.error('初始化 NEUIKit 失败:', error)
        uni.showToast({
          title: error.message || 'IM连接失败',
          icon: 'none',
        });
      }
    }
  }
}
</script>

<style>
	/*每个页面公共css */
</style>
