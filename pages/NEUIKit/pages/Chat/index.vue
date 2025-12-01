<template>
  <!-- 处理滚动穿透  此为官方推荐做法 https://uniapp.dcloud.net.cn/component/uniui/uni-popup.html#%E4%BB%8B%E7%BB%8D -->
  <page-meta
    :page-style="'overflow:' + (moveThrough ? 'hidden' : 'visible')"
  ></page-meta>
  <div :class="isH5 ? 'msg-page-wrapper-h5' : 'msg-page-wrapper'">
    <NavBar :title="title" :showLeft="true">
      <template v-slot:left>
        <div @click="backToConversation">
          <Icon type="icon-zuojiantou" :size="22"></Icon>
        </div>
      </template>
    </NavBar>
    <div class="chat-toolbar">
      <view class="toolbar-btn" @tap="handleClearChatHistory">
        <Icon type="icon-qingchu" :size="18"></Icon>
        <text>{{ t('clearChatHistoryText') }}</text>
      </view>
    </div>
    <div class="msg-alert">
      <NetworkAlert />
    </div>
    <div :class="isH5 ? 'msg-wrapper-h5' : 'msg-wrapper'">
      <MessageList
        :scene="scene"
        :to="to"
        :msgs="msgs"
        :loading-more="loadingMore"
        :no-more="noMore"
        :reply-msgs-map="replyMsgsMap"
      />
    </div>
    <AIErrandPanel />
    <UniversalAIAssistant />
    <div style="height: 'auto'">
      <MessageInput :reply-msgs-map="replyMsgsMap" :scene="scene" :to="to" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onHide, onShow } from '@dcloudio/uni-app'
import { events } from '../../utils/constants'
import { trackInit } from '../../utils/reporter'
import { autorun } from 'mobx'
import { ref, onMounted, onUnmounted } from '../../utils/transformVue'
import { parseSessionId } from '../../utils/msg'
import type { TMsgScene } from '@xkit-yx/im-store'
import { deepClone, getUniPlatform } from '../../utils'
import { onLoad, onUnload } from '@dcloudio/uni-app'
import { customSwitchTab } from '../../utils/customNavigate'
import NetworkAlert from '../../components/NetworkAlert.vue'
import NavBar from './message/nav-bar.vue'
import Icon from '../../components/Icon.vue'
import MessageList from './message/message-list.vue'
import MessageInput from './message/message-input.vue'
import AIErrandPanel from './components/AIErrandPanel.vue'
import UniversalAIAssistant from './components/UniversalAIAssistant.vue'
import type { IMMessage } from 'nim-web-sdk-ng/dist/NIM_MINIAPP_SDK/MsgServiceInterface'
import { HISTORY_LIMIT, MSG_ID_FLAG } from '../../utils/constants'
import { t } from '../../utils/i18n'
import { clear } from 'console'

trackInit('ChatUIKit')

const title = ref('')
// @ts-ignore
const sessionId = uni.$UIKitStore.uiStore.selectedSession
const { scene, to }: { scene: TMsgScene; to: string } =
  parseSessionId(sessionId)

const isH5 = getUniPlatform() === 'web'

const CLEAR_STORAGE_KEY = '__chat_clear_time__'
const clearTimestamp = ref(0)

const loadClearTimestamp = () => {
  try {
    const stored = uni.getStorageSync(CLEAR_STORAGE_KEY) || {}
    clearTimestamp.value = stored?.[sessionId] || 0
  } catch (error) {
    console.warn('加载清空时间失败', error)
    clearTimestamp.value = 0
  }
}

loadClearTimestamp()

// 处理uni-popup 引起的滚动穿透
const moveThrough = ref(false)

const backToConversation = () => {
  customSwitchTab({
    url: '/pages/Conversation/index',
  })
}

let isMounted = false

const loadingMore = ref(false)
const noMore = ref(false)

// @ts-ignore
const myAccount = uni.$UIKitStore.userStore.myUserInfo.account

const msgs = ref<IMMessage[]>([])

// 回复
const replyMsgsMap = ref<Record<string, IMMessage>>()

const handleDismissTeam = (data: any) => {
  if (data.teamId === to) {
    uni.showModal({
      content: t('onDismissTeamText'),
      showCancel: false,
      success(data) {
        if (data.confirm) {
          backToConversation()
        }
      },
    })
  }
}

const handleRemoveTeamMembers = (data: any) => {
  if (data.team.teamId === to && data.accounts.includes(myAccount)) {
    uni.showModal({
      content: t('onRemoveTeamText'),
      showCancel: false,
      success(data) {
        if (data.confirm) {
          backToConversation()
        }
      },
    })
  }
}

const handleMsg = (msg: IMMessage) => {
  uni.$emit(events.ON_SCROLL_BOTTOM, msg)
}

const handleSyncOfflineMsgs = () => {
  const timer = setTimeout(() => {
    uni.$emit(events.ON_SCROLL_BOTTOM)
    clearTimeout(timer)
  }, 300)
}

const getHistory = async (endTime: number, lastMsgId?: string) => {
  try {
    if (noMore.value) {
      return []
    }
    if (loadingMore.value) {
      return []
    }
    loadingMore.value = true
    if (sessionId) {
      // @ts-ignore
      const historyMsgs = await uni.$UIKitStore.msgStore.getHistoryMsgActive({
        sessionId,
        endTime,
        lastMsgId,
        limit: HISTORY_LIMIT,
      })
      loadingMore.value = false
      if (historyMsgs.length < HISTORY_LIMIT) {
        noMore.value = true
      }
      return historyMsgs
    }
  } catch (error) {
    loadingMore.value = false
    throw error
  }
}

const handleLoadMore = async (lastMsg: IMMessage) => {
  const res = await getHistory(lastMsg.time, lastMsg.idServer)
  return res
}

const handleClearChatHistory = () => {
  uni.showModal({
    title: t('clearChatHistoryText'),
    content: t('clearChatHistoryConfirmText'),
    showCancel: true,
    confirmText: t('clearText'),
    confirmColor: '#ff4444',
    success: async (res) => {
      if (!res.confirm) return
      try {
        uni.showLoading({ title: t('clearingText') })
        // @ts-ignore
        const sessionMsgs = uni.$UIKitStore.msgStore.getMsg(sessionId) || []
        if (!sessionMsgs.length) {
          uni.hideLoading()
          uni.showToast({
            title: t('noMessagesToClearText'),
            icon: 'none',
          })
          return
        }

        // @ts-ignore
        await uni.$UIKitStore.msgStore.deleteMsgActive(sessionMsgs)
        // 记录最新清空时间，过滤旧消息
        const stored = uni.getStorageSync(CLEAR_STORAGE_KEY) || {}
        stored[sessionId] = Date.now()
        uni.setStorageSync(CLEAR_STORAGE_KEY, stored)
        clearTimestamp.value = stored[sessionId]
        msgs.value = []
        noMore.value = false
        uni.hideLoading()
        uni.showToast({
          title: t('clearChatHistorySuccessText'),
          icon: 'success',
        })
      } catch (error) {
        console.error('清空聊天记录失败:', error)
        uni.hideLoading()
        uni.showToast({
          title: t('clearChatHistoryFailText'),
          icon: 'none',
        })
      }
    },
  })
}

onShow(function () {
  autorun(() => {
    if (scene === 'p2p') {
      // @ts-ignore
      title.value = deepClone(
        // @ts-ignore
        uni.$UIKitStore.uiStore.getAppellation({ account: to })
      )
    } else if (scene === 'team') {
      // @ts-ignore
      const team = uni.$UIKitStore.teamStore.teams.get(to)
      const subTitle = `(${team?.memberNum || 0})`
      title.value = (team?.name || '') + subTitle
    }
  })
})

onLoad(() => {
  uni.$on(events.HANDLE_MOVE_THROUGH, (flag) => {
    moveThrough.value = flag
  })
  // @ts-ignore
  uni.$currentAudioContext = ''
})

onMounted(() => {
  const timer = setTimeout(() => {
    uni.$emit(events.ON_SCROLL_BOTTOM)
    clearTimeout(timer)
  }, 300)

  if (scene === 'p2p') {
    // @ts-ignore
    title.value = deepClone(
      // @ts-ignore
      uni.$UIKitStore.uiStore.getAppellation({ account: to })
    )
  } else if (scene === 'team') {
    // @ts-ignore
    const team = uni.$UIKitStore.teamStore.teams.get(to)
    const subTitle = `(${team?.memberNum || 0})`
    title.value = (team?.name || '') + subTitle
  }

  // @ts-ignore
  uni.$UIKitNIM.on('msg', handleMsg)
  // @ts-ignore
  uni.$UIKitNIM.on('dismissTeam', handleDismissTeam)
  // @ts-ignore
  uni.$UIKitNIM.on('removeTeamMembers', handleRemoveTeamMembers)
  // @ts-ignore
  uni.$UIKitNIM.on('syncOfflineMsgs', handleSyncOfflineMsgs)

  uni.$on(events.GET_HISTORY_MSG, (msg: IMMessage) => {
    handleLoadMore(msg)
      .then((res: IMMessage[]) => {
        if (res?.[0]) {
          // uni.pageScrollTo 微信小程序指定滚动位置不起作用 https://ask.dcloud.net.cn/question/173874?item_id=258278&rf=false
          setTimeout(() => {
            uni.pageScrollTo({
              selector: `#${MSG_ID_FLAG + res[0].idClient}`,
              scrollTop: 0,
              duration: 0,
              fail: (error) => {
                console.log('error', error)
              },
            })
          }, 300)
        }
      })
      .finally(() => {
        // uni.stopPullDownRefresh();
      })
  })
})

onUnload(() => {
  uni.$off(events.CONFIRM_FORWARD_MSG)
  uni.$off(events.CANCEL_FORWARD_MSG)
})

const uninstallHistoryWatch = autorun(() => {
  // @ts-ignore
  if (uni.$UIKitStore.connectStore.connectState === 'connected') {
    getHistory(Date.now()).then(() => {
      if (!isMounted) {
        uni.$emit(events.ON_SCROLL_BOTTOM)
        isMounted = true
      }
    })
  }
})

// 动态更新消息
const uninstallMsgsWatch = autorun(() => {
  // @ts-ignore
  let sessionMsgs = deepClone(uni.$UIKitStore.msgStore.getMsg(sessionId))

  if (clearTimestamp.value) {
    sessionMsgs = sessionMsgs.filter(
      (msg: IMMessage) => msg.time >= clearTimestamp.value
    )
  }

  msgs.value = sessionMsgs

  // 遍历所有消息，找出被回复消息，储存在map中
  if (msgs.value.length !== 0) {
    const _replyMsgsMap: any = {}
    const reqMsgs: Array<{
      scene: 'p2p' | 'team'
      from: string
      to: string
      idServer: string
      time: number
    }> = []
    const idClients: Record<string, string> = {}
    msgs.value.forEach((msg) => {
      if (msg.ext) {
        try {
          // yxReplyMsg 存储着被回复消息的相关消息
          const { yxReplyMsg } = JSON.parse(msg.ext)
          if (yxReplyMsg) {
            // 从消息列表中找到被回复消息，replyMsg 为被回复的消息
            const replyMsg = msgs.value.find(
              (item) => item.idClient === yxReplyMsg.idClient
            )
            // 如果直接找到，存储在map中
            if (replyMsg) {
              _replyMsgsMap[msg.idClient] = replyMsg
              // 如果没找到，说明被回复的消息可能有三种情况：1.被删除 2.被撤回 3.不在当前消息列表中（一次性没拉到，在之前的消息中）
            } else {
              _replyMsgsMap[msg.idClient] = { idClient: 'noFind' }
              const { scene, from, to, idServer, time } = yxReplyMsg
              if (scene && from && to && idServer && time) {
                reqMsgs.push({ scene, from, to, idServer, time })
                idClients[idServer] = msg.idClient
              }
            }
          }
        } catch {}
      }
    })

    if (reqMsgs.length > 0) {
      // 从服务器拉取被回复消息, 但是有频率控制
      // @ts-ignore
      uni.$UIKitStore.msgStore
        .getMsgByIdServerActive({ reqMsgs })
        .then((res: IMMessage[]) => {
          if (res?.length > 0) {
            res.forEach((item: IMMessage) => {
              if (item.idServer) {
                _replyMsgsMap[idClients[item.idServer]] = item
              }
            })
          }
          replyMsgsMap.value = { ..._replyMsgsMap }
        })
        .catch(() => {
          replyMsgsMap.value = { ..._replyMsgsMap }
        })
    } else {
      replyMsgsMap.value = { ..._replyMsgsMap }
    }
  }

  // 当聊天消息小于6条时，由于页面被键盘撑起，导致已经发出的消息不可见，所以需要隐藏键盘
  if (msgs.value.length < 6) {
    uni.hideKeyboard()
  }
})

onUnmounted(() => {
  // @ts-ignore
  uni.$UIKitNIM.off('dismissTeam', handleDismissTeam)
  // @ts-ignore
  uni.$UIKitNIM.off('removeTeamMembers', handleRemoveTeamMembers)
  // @ts-ignore
  uni.$UIKitNIM.off('msg', handleMsg)
  // @ts-ignore
  uni.$UIKitNIM.off('syncOfflineMsgs', handleSyncOfflineMsgs)

  uni.$off(events.GET_HISTORY_MSG)

  uninstallHistoryWatch()
  uninstallMsgsWatch()
})
</script>

<style scoped lang="scss">
page {
  height: 100%;
  overflow: hidden;
}

.msg-page-wrapper {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
}

.chat-toolbar {
  display: flex;
  justify-content: flex-end;
  padding: 6px 12px 0 12px;
}

.toolbar-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #ff4d4f;
  background: #ffeaea;
  border-radius: 20px;
  padding: 4px 10px;
}

.msg-page-wrapper-h5 {
  width: 100%;
  height: 100%;
  max-width: 100%;
  overflow: hidden;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  position: relative;
}

.msg-alert {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: auto;
  z-index: 1;
}

.msg-wrapper {
  width: 100%;
  overflow: hidden;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  position: relative;
  flex: 1;
}

.msg-wrapper-h5 {
  width: 100%;
  height: 100%;
  max-width: 100%;
  overflow: hidden;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  position: relative;
}

.msg-wrapper > message-list {
  height: 100%;
}
</style>
