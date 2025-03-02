<template>
  <section class="todoapp">
    <!-- header -->
    <header class="header">
      <input class="new-todo" autocomplete="off" placeholder="Todo List" @keyup.enter="addTodo">
    </header>
    <!-- main section -->
    <section v-show="todos.length" class="main">
      <input id="toggle-all" :checked="allChecked" class="toggle-all" type="checkbox" @change="toggleAll(!allChecked)">
      <label for="toggle-all" />
      <ul class="todo-list">
        <todo
          v-for="(todo, index) in filteredTodos"
          :key="index"
          :todo="todo"
          @toggleTodo="toggleTodo"
          @editTodo="editTodo"
          @deleteTodo="deleteTodo"
        />
      </ul>
    </section>
    <!-- footer -->
    <footer v-show="todos.length" class="footer">
      <span class="todo-count">
        <strong>{{ remaining }}</strong>
        {{ pluralize(remaining, 'item') }} left
      </span>
      <ul class="filters">
        <li v-for="(val, key) in filters" :key="key">
          <a :class="{ selected: visibility === key }" @click.prevent="visibility = key">{{ capitalize(key) }}</a>
        </li>
      </ul>
      <!-- <button class="clear-completed" v-show="todos.length > remaining" @click="clearCompleted">
        Clear completed
      </button> -->
    </footer>
  </section>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import Todo from './Todo.vue'

interface TodoItem {
  text: string
  done: boolean
}

interface Filters {
  [key: string]: (todos: TodoItem[]) => TodoItem[]
}

// Constants
const STORAGE_KEY = 'todos'
const defaultList: TodoItem[] = [
  { text: 'star this repository', done: false },
  { text: 'fork this repository', done: false },
  { text: 'follow author', done: false },
  { text: 'vue-element-admin', done: true },
  { text: 'vue', done: true },
  { text: 'element-ui', done: true },
  { text: 'axios', done: true },
  { text: 'webpack', done: true }
]

// Filters
const filters: Filters = {
  all: todos => todos,
  active: todos => todos.filter(todo => !todo.done),
  completed: todos => todos.filter(todo => todo.done)
}

// State
const visibility = ref('all')
const todos = ref<TodoItem[]>(defaultList)

// Helper functions
const pluralize = (n: number, w: string): string => n === 1 ? w : w + 's'
const capitalize = (s: string): string => s.charAt(0).toUpperCase() + s.slice(1)

// Computed
const allChecked = computed(() => todos.value.every(todo => todo.done))
const filteredTodos = computed(() => filters[visibility.value](todos.value))
const remaining = computed(() => todos.value.filter(todo => !todo.done).length)

// Methods
const setLocalStorage = (): void => {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(todos.value))
}

const addTodo = (e: Event): void => {
  const target = e.target as HTMLInputElement
  const text = target.value
  if (text.trim()) {
    todos.value.push({
      text,
      done: false
    })
    setLocalStorage()
  }
  target.value = ''
}

const toggleTodo = (todo: TodoItem): void => {
  todo.done = !todo.done
  setLocalStorage()
}

const deleteTodo = (todo: TodoItem): void => {
  todos.value.splice(todos.value.indexOf(todo), 1)
  setLocalStorage()
}

const editTodo = ({ todo, value }: { todo: TodoItem, value: string }): void => {
  todo.text = value
  setLocalStorage()
}

const clearCompleted = (): void => {
  todos.value = todos.value.filter(todo => !todo.done)
  setLocalStorage()
}

const toggleAll = (done: boolean): void => {
  todos.value.forEach(todo => {
    todo.done = done
  })
  setLocalStorage()
}
</script>

<style lang="scss">
  @import './index.scss';
</style>
