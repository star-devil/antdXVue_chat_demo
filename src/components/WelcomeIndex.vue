<template>
  <div class="welcome-wrap">
    <Welcome
      :style="welcomeStyle"
      icon="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*s5sNRo5LjfQAAAAAAAAAAAAADgCCAQ/fmt.webp"
      title="Hello, I'm Ant Design X"
      description="Base on Ant Design, AGI product interface solution, create a better intelligent vision~"
    />
    <div class="welcome-image"></div>
    <Prompts
      title="✨ Inspirational Sparks and Marvelous Tips"
      :items="promptItems"
      wrap
      :styles="promptStyle"
    />
  </div>
</template>

<script setup lang="ts">
import { Welcome, Prompts, type PromptsProps } from 'ant-design-x-vue';
import { BulbOutlined, InfoCircleOutlined } from '@ant-design/icons-vue';

const welcomeStyle = {
  background:
    'linear-gradient(97deg, rgba(90,196,255,0.12) 0%, rgba(174,136,255,0.12) 100%)',
  borderStartStartRadius: 4
};

const promptItems: PromptsProps['items'] = [
  {
    key: 'analysis',
    icon: h(BulbOutlined, { style: { color: '#FFD700' } }),
    label: 'Ignite Your Creativity',
    description: 'Got any sparks for a new project?'
  },
  {
    key: 'Modeling',
    icon: h(InfoCircleOutlined, {
      style: { color: '#1890FF' }
    }),
    label: 'Uncover Background Info',
    description: 'Help me understand this topic.'
  }
];
const promptStyle = {
  item: {
    width: 'calc(50% - 6px)'
  }
};
</script>

<style scoped lang="scss">
.welcome-wrap {
  .welcome-image {
    height: calc(100vh - 85px - 2rem - 82px - 106px - 1rem);
    background-image: url('@/assets/welcome.svg');
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;
  }
}
</style>
