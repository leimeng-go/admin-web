<template>
  <li :class="{ completed: todo.done, editing: editing }" class="todo">
    <div class="view">
      <input
        :checked="todo.done"
        class="toggle"
        type="checkbox"
        @change="toggleTodo(todo)"
      >
      <label @dblclick="editing = true" v-text="todo.text" />
      <button class="destroy" @click="deleteTodo(todo)" />
    </div>
    <input
      v-show="editing"
      v-focus="editing"
      :value="todo.text"
      class="edit"
      @keyup.enter="doneEdit"
      @keyup.esc="cancelEdit"
      @blur="doneEdit"
    >
  </li>
</template>

<script lang="ts" setup>
import { ref, nextTick } from 'vue'

interface TodoItem {
  text: string
  done: boolean
}

// Props
const props = defineProps<{
  todo: TodoItem
}>()

// Emits
const emit = defineEmits<{
  (e: 'deleteTodo', todo: TodoItem): void
  (e: 'editTodo', payload: { todo: TodoItem, value: string }): void
  (e: 'toggleTodo', todo: TodoItem): void
}>()

// State
const editing = ref(false)

// Methods
const deleteTodo = (todo: TodoItem) => {
  emit('deleteTodo', todo)
}

const editTodo = ({ todo, value }: { todo: TodoItem, value: string }) => {
  emit('editTodo', { todo, value })
}

const toggleTodo = (todo: TodoItem) => {
  emit('toggleTodo', todo)
}

const doneEdit = (e: Event) => {
  const target = e.target as HTMLInputElement
  const value = target.value.trim()
  const { todo } = props
  
  if (!value) {
    deleteTodo(todo)
  } else if (editing.value) {
    editTodo({
      todo,
      value
    })
    editing.value = false
  }
}

const cancelEdit = (e: Event) => {
  const target = e.target as HTMLInputElement
  target.value = props.todo.text
  editing.value = false
}

// Custom directive
const vFocus = {
  mounted: (el: HTMLElement, binding: any) => {
    if (binding.value) {
      nextTick(() => {
        el.focus()
      })
    }
  },
  updated: (el: HTMLElement, binding: any) => {
    if (binding.value) {
      nextTick(() => {
        el.focus()
      })
    }
  }
}
</script>
