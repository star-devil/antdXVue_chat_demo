<template>
  <Sender
    class="sender-input-comp"
    :loading="senderLoading"
    :value="question"
    placeholder="Hello? this is X!"
    @change="changeValue"
    @submit="sendMessage"
    @cancel="cancelSend"
  >
    <template #prefix>
      <a-space>
        <a-button type="text" @click="handleOpenHeader">
          <template #icon>
            <LinkOutlined />
          </template>
        </a-button>
        <a-tag
          v-if="selectedFile"
          class="flex items-center gap-1"
          color="processing"
          :bordered="false"
          closable
          @close="handleRemoveFile"
        >
          <template #closeIcon>
            <a-tooltip>
              <template #title>取消在对话中添加此文件</template>
              <DeleteOutlined class="text-red-600" />
            </a-tooltip>
          </template>
          <span class="truncate max-w-[150px]" :title="selectedFile.filename">
            {{ selectedFile.filename }}
          </span>
          <EyeOutlined
            class="cursor-pointer text-blue-600"
            @click="handlePreviewFile"
          />
        </a-tag>
      </a-space>
    </template>
    <template #header>
      <Sender.Header title="请上传附件" :open="openHeader" class="bg-white">
        <a-row :gutter="16">
          <a-col :span="14">
            <a-upload-dragger
              v-model:fileList="uploadFileList"
              name="file"
              :showUploadList="false"
              :multiple="false"
              :maxCount="1"
              :disabled="uploadLoading"
              :customRequest="customRequest"
              @change="handleChange"
            >
              <div class="flex flex-col items-center justify-center h-full">
                <p class="ant-upload-drag-icon">
                  <LoadingOutlined v-if="uploadLoading" class="text-6xl" />
                  <CloudUploadOutlined v-else class="text-6xl" />
                </p>
                <p class="ant-upload-text">点击或者拖动到此上传</p>
                <p class="ant-upload-hint">文件大小不超过20MB</p>
              </div>
            </a-upload-dragger>
          </a-col>
          <a-col :span="10">
            <div class="upload-files-wrap">
              <div class="mb-1 ml-1">
                <a-typography-text type="secondary"
                  >或 选择“其他文件”</a-typography-text
                >
              </div>

              <div class="scroll-list-wrap h-44 overflow-y-auto">
                <small>可以自己实现一个文件列表</small>
              </div>
            </div>
          </a-col>
        </a-row>
      </Sender.Header>
    </template>
  </Sender>
</template>

<script setup lang="ts">
import { Sender, useXAgent, useXChat } from 'ant-design-x-vue';
import { message as Msg } from 'ant-design-vue';
import { useUpload } from '@/utils/upload.ts';
import { mockUploadApi } from '@/api/files.ts';
import { mockChatStreamApi } from '@/api/chat.ts';
import { useDialogueStore } from '@/stores/modules/dialogues';

interface selectedFileItem {
  id: string;
  uuid: string;
  filename: string;
  file_size: number;
  ext: string;
}

const emit = defineEmits(['messagesChange', 'loadingChange']);

const dialogueStores = useDialogueStore();

/** 重置所有数据，开启了新对话 */
const newChat = () => {
  selectedFile.value = null;
  selectedFileUuid.value = '';
  conversation_uuid.value = undefined;
  messages.value = [];
  dialogueStores.resetHistory();
  dialogueStores.setCurrentConversitionUuid(undefined);
  emit('messagesChange', []);
};

defineExpose({
  newChat
});

/** 发送消息 */
const question = ref('');
const senderLoading = ref<boolean>(false);
const waitResponse = ref<boolean>(false);
const conversation_uuid = ref<string | undefined>(undefined);
const isCode = ref<boolean>(false); // 本次对话内容是否是代码
let controller: AbortController;

const [agent] = useXAgent({
  request: async ({ message }, { onSuccess, onUpdate, onError }) => {
    controller = new AbortController();

    senderLoading.value = true;
    waitResponse.value = true;
    console.log('message', message);
    // 读取流数据
    let fullContent = '';
    try {
      // 模拟对话接口，没有传入任何参数
      await mockChatStreamApi(
        (chunk: string) => {
          waitResponse.value = false;
          const jsonData = JSON.parse(chunk.replace('data: ', ''));
          conversation_uuid.value = jsonData.conversation_uuid;
          if (jsonData.message === '[DONE]') {
            onSuccess(fullContent);
            return;
          }
          fullContent += jsonData.message;
          onUpdate(fullContent);
        },
        {
          maxRetries: 3,
          retryDelay: 1000,
          signal: controller.signal
        }
      );
    } catch (streamError: any) {
      Msg.error(streamError.message);
      onError(streamError);
    } finally {
      senderLoading.value = false;
      waitResponse.value = false;
      isCode.value = false;
    }
  }
});

const { onRequest, messages } = useXChat({
  agent: agent.value
});

watch(messages, (newMessages) => {
  emit('messagesChange', newMessages);
});

watch(
  () => waitResponse.value,
  (newVal) => {
    if (typeof newVal === 'boolean') {
      emit('loadingChange', newVal);
    }
  },
  {
    flush: 'post'
  }
);

watch(
  () => senderLoading.value,
  (newVal) => {
    dialogueStores.setIsChatting(newVal);
  }
);

const changeValue = (val: string) => {
  question.value = val;
};

const sendMessage = (value: any) => {
  onRequest(value);
  question.value = '';
  openHeader.value = false;
};

const cancelSend = () => {
  if (controller) {
    controller.abort();
  }
  waitResponse.value = false;
  question.value = '';
  senderLoading.value = false;
};

/** 上传附件 **/
const openHeader = ref<boolean>(false);
const handleOpenHeader = () => {
  openHeader.value = !openHeader.value;
};
// 上传方法
const { uploadLoading, uploadFileList, customRequest, handleChange } =
  useUpload({
    uploadRequest: mockUploadApi,
    requestParams: {
      isAttachment: true,
      successRate: 0.8, // mock参数
      delay: 1500
    },
    onSuccess: (file: any) => {
      selectedFile.value = {
        id: file.id,
        uuid: file.id,
        filename: file.name,
        file_size: file.size,
        ext: file.type
      };
      selectedFileUuid.value = '';
      openHeader.value = false;
    },
    maxSize: 20 // 20MB
  });

// 选中文件
const selectedFile = ref<selectedFileItem | null>(null);
const selectedFileUuid = ref<string>(''); // 用来再次打开是选中文件卡片

// 文件预览
const handlePreviewFile = () => {
  Msg.info('预览文件');
};
// 文件删除
const handleRemoveFile = () => {
  selectedFile.value = null;
  selectedFileUuid.value = '';
};

// 监听selectedFile 和conversation_uuid，有变化就给dialogueStores 赋值
watch(
  [() => selectedFile.value, () => conversation_uuid.value],
  ([newFile, newUuid]) => {
    dialogueStores.setCurrentFileInfo(newFile);
    dialogueStores.setCurrentConversitionUuid(newUuid);
  }
);
</script>
