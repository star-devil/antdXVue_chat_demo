import { MessageItem } from '@/dataTypes/chatType.ts';

export const useDialogueStore = defineStore('dialogue', () => {
  const currentFile = ref<any>();
  const currentConversitionUuid = ref<string | undefined>('');
  const dialogueRecord = ref<Array<MessageItem>>([]);
  const isChatting = ref<boolean>(false);

  const getCurrentFileUuid = computed(() => currentFile.value.uuid);
  const getCurrentFilename = computed(() => currentFile.value.filename);
  const getCurrentConversitionUuid = computed(
    () => currentConversitionUuid.value
  );
  const getDialogueRecord = computed(() => dialogueRecord.value);
  const getIsChatting = computed(() => isChatting.value);

  function setCurrentFileInfo(file: any) {
    currentFile.value = file;
  }

  function setCurrentConversitionUuid(uuid: string | undefined) {
    currentConversitionUuid.value = uuid;
  }

  function setDialogueRecord(record: MessageItem[]) {
    dialogueRecord.value = record;
  }

  function setIsChatting(status: boolean) {
    isChatting.value = status;
  }

  function resetHistory() {
    currentConversitionUuid.value = undefined;
    dialogueRecord.value = [];
  }

  return {
    getCurrentFileUuid,
    getCurrentFilename,
    getCurrentConversitionUuid,
    getDialogueRecord,
    getIsChatting,
    setCurrentFileInfo,
    setCurrentConversitionUuid,
    setDialogueRecord,
    setIsChatting,
    resetHistory
  };
});
