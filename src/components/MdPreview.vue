<!-- 用的 @kangc/v-md-editor组件，可以自己替换 -->
<template>
  <div class="md-editor w-full h-full">
    <v-md-preview
      :text="newText"
      mode="preview"
      class="h-full"
      @copy-code-success="handleCopyCodeSuccess"
    />
  </div>
</template>

<script setup lang="ts">
import { message } from 'ant-design-vue';

const props = defineProps({
  // 绑定文本
  text: {
    type: String,
    default: ''
  }
});

// 编辑器内容
const newText = computed(() => props.text); // 预览

const handleCopyCodeSuccess = () => {
  message.info('复制成功');
};
</script>

<style lang="scss">
.vuepress-markdown-body {
  padding: unset !important;
  font-size: 14px;
  background: unset;

  pre {
    color: #fff;
  }
}
</style>
