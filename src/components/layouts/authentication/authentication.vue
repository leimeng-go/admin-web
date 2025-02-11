<script lang="ts" setup>
import { ToolbalType } from './types';
import { ref } from 'vue';


interface Props {
    appName?: string;
    logo?: string;
    pageTitle?: string;
    pageDescription?: string;
    sloganImage?: string;
    toolbar?: boolean;
    copyright?: boolean;
    toolbarList?: ToolbalType[];
}

withDefaults(defineProps<Props>(),{
    appName: '',
    copyright: true,
    log:'',
    pageDescription: '',
    pageTitle: '',
    sloganImage: '',
    toolbar: true,
    toolbarList: ()=>['color','language','layout','theme'],
});

// TODO: 首页布局
const authPanelCenter = ref('')
const authPanelLeft = ref('')
const authPanelRight = ref('')
const isDark = ref('auto')


</script>

<template>
    <div
      :class="[isDark]"
      class="flex min-h-full flex-1 select-none overflow-hidden"
    >
      <template v-if="toolbar">
         <slot name="toolbar">

         </slot>
      </template>

    </div>
</template>