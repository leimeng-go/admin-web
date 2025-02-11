<script setup lang="ts">
import type { ToolbalType } from './types';
import { computed } from 'vue';

interface Props {
    toolbarList?: ToolbalType[];
}

defineOptions({
    name: 'AuthenticationToolbal',
})

const props = withDefaults(defineProps<Props>(),{
    toolbarList: () => ['color','language','layout', 'theme']
})

const showColor = computed(() => props.toolbarList.includes('color'))
const showLayout = computed(() => props.toolbarList.includes('layout'))
const showLanguage = computed(() => props.toolbarList.includes('language'))
const showTheme = computed(() => props.toolbarList.includes('theme'))

</script>

<template>
    <div
      :class="{
        'bg-accent rounded-3xl px-3 py-1': toolbarList.length >1,
      }"
    >

    </div>
</template>