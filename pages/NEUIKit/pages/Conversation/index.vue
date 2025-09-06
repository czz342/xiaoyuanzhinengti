<template>
  <ConversationList v-if="isReady" />
</template>

<script lang="ts" setup>
import ConversationList from './conversation-list/index.vue'
import { trackInit } from '../../utils/reporter'
import { onShow } from '@dcloudio/uni-app'
import { ref, nextTick } from '@vue/composition-api' // 引入 ref 和 nextTick

import { setContactTabUnread, setTabUnread } from '../../utils/msg'

trackInit('ConversationUIKit')

// 控制组件是否渲染的关键
const isReady = ref(true)

// 强制组件重新渲染的函数
const forceRerender = async () => {
  console.log('Force re-rendering conversation list...');
  isReady.value = false;
  await nextTick(); // 等待DOM更新，确保旧组件被销毁
  isReady.value = true; // 重新创建新组件
}

onShow(async () => {
  // 每次页面显示时，都强制重新渲染列表
  await forceRerender();

  // 确保在组件重新渲染后更新角标
  // @ts-ignore
  if (uni.$UIKitStore) {
    uni.$UIKitStore.uiStore.selectSession('');
    setTabUnread();
    setContactTabUnread();
  }
})
</script>

<style lang="scss">
@import '../styles/common.scss';

page {
  height: 100vh;
  overflow: hidden;
}
</style>
