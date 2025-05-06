<template>
  <div>
    <div class="handle-list-wrap mb-3">
      <a-flex justify="space-between">
        <a-button type="primary" @click="newChat">
          <template #icon>
            <CommentOutlined />
          </template>
          新对话
        </a-button>
      </a-flex>
    </div>
    <div ref="bubbleListContentRef" class="bubble-list">
      <BubbleList :roles="roles" :items="messageItemList" />

      <Bubble
        v-if="loading"
        :loading="loading"
        :avatar="roles.ai.avatar"
        :placement="roles.ai.placement"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Bubble, BubbleList } from 'ant-design-x-vue';
import { Avatar } from 'ant-design-vue';
import MdPreview from '@/components/MdPreview.vue';
import { MessageItem } from '@/dataTypes/chatType';
import SimpleBar from 'simplebar';

const props = defineProps({
  messages: {
    type: Array as PropType<MessageItem[]>,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['newChat']);

// 新对话
const newChat = () => {
  messageItemList.value = [];
  emit('newChat');
};

// 渲染对话
const roles: (typeof Bubble.List)['roles'] = {
  ai: {
    placement: 'start',
    avatar: {
      icon: h(
        Avatar,
        {
          style: {
            color: '#fff',
            background: '#87d068',
            lineHeight: '26px'
          }
        },
        () => 'AI'
      ),
      style: {
        background: 'unset'
      }
    }
  },
  local: {
    placement: 'end',
    avatar: {
      icon: h(
        Avatar,
        {
          style: {
            color: '#f56a00',
            background: '#fde3cf',
            lineHeight: '26px'
          }
        },
        () => 'user'
      ),
      style: {
        background: 'unset'
      }
    }
  }
};

const messageItemList = ref<(typeof Bubble.List)['items']>([]);

watch(
  () => props.messages,
  (newMessage) => {
    // 更新为最新的消息列表
    messageItemList.value =
      newMessage?.map(({ id, message, status }) => ({
        key: id,
        role: status === 'local' ? 'local' : 'ai',
        content: message,
        // @ts-expect-error-next-line 暂时忽略content类型
        messageRender: (content) =>
          h(MdPreview, {
            text: content,
            needScroll: false
          })
      })) || [];

    scrollToBottom();
  },
  { immediate: true }
);

/** message变化时自动滚动到底部 */
let simpleBarInstance: SimpleBar | null = null;
const bubbleListContentRef = ref<HTMLElement | null>(null);

function scrollToBottom() {
  nextTick(() => {
    const scrollElement = simpleBarInstance?.getScrollElement();
    if (scrollElement) {
      scrollElement.scrollTo({
        top: scrollElement.scrollHeight,
        behavior: 'smooth'
      });
    }
  });
}

onMounted(() => {
  if (bubbleListContentRef.value) {
    simpleBarInstance = new SimpleBar(bubbleListContentRef.value);
  }
});

onUnmounted(() => {
  if (simpleBarInstance) {
    simpleBarInstance.unMount();
    simpleBarInstance = null;
  }
});
</script>

<style lang="scss" scoped>
.bubble-list {
  height: calc(100% - 32px - 0.75rem);
}

.active-template {
  border-color: #1677ff;
}
</style>
