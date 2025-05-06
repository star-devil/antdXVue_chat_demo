<template>
  <div ref="scholarAiRef" class="chat-comp">
    <div class="content-wrap">
      <WelcomeIndex v-if="!messages.length" class="mb-4" />
      <ChatBubble
        v-else
        class="bubble-list-wrap mb-4"
        :messages="messages"
        :loading="waitResponse"
        @new-chat="resetChat"
      />
    </div>
    <div class="sender-wrap">
      <SenderInput
        ref="senderInputRef"
        @messages-change="handleMessagesChange"
        @loading-change="handleLoading"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
// 监听消息变化
const messages = ref<any[]>([]);
const handleMessagesChange = (newMessages: any[]) => {
  messages.value = newMessages;
};

const waitResponse = ref<boolean>(false);
const handleLoading = (loading: boolean) => {
  waitResponse.value = loading;
};
// 重置对话
const senderInputRef = ref();
const resetChat = () => {
  waitResponse.value = false;
  senderInputRef.value?.newChat();
};
</script>

<style lang="scss" scoped>
.chat-comp {
  position: relative;
  width: 100%;
  height: calc(100vh - 60px);

  .content-wrap {
    padding-bottom: 56px; // 为固定定位的 SenderInput 预留空间
    .bubble-list-wrap {
      height: 100%;
    }
  }

  .sender-wrap {
    position: absolute;
    bottom: 0;
    z-index: 10;
    width: 100%;
    background: white;
  }
}
</style>
