import { defineStore } from 'pinia'

interface TagView {
  path: string
  name?: string
  title?: string
  fullPath?: string
  query?: Record<string, string>
  meta?: any
}

interface TagsViewState {
  visitedViews: TagView[]
  cachedViews: string[]
}

export const useTagsViewStore = defineStore('tagsView', {
  state: (): TagsViewState => ({
    visitedViews: [],
    cachedViews: []
  }),
  
  actions: {
    addView(view: TagView) {
      this.addVisitedView(view)
      this.addCachedView(view)
    },
    
    addVisitedView(view: TagView) {
      if (this.visitedViews.some(v => v.path === view.path)) return
      
      this.visitedViews.push(
        Object.assign({}, view, {
          title: view.meta?.title || 'no-name'
        })
      )
    },
    
    addCachedView(view: TagView) {
      if (this.cachedViews.includes(view.name as string)) return
      if (!view.meta?.noCache && view.name) {
        this.cachedViews.push(view.name as string)
      }
    },
    
    delView(view: TagView) {
      return new Promise(resolve => {
        this.delVisitedView(view)
        this.delCachedView(view)
        resolve({
          visitedViews: [...this.visitedViews],
          cachedViews: [...this.cachedViews]
        })
      })
    },
    
    delVisitedView(view: TagView) {
      return new Promise(resolve => {
        for (const [i, v] of this.visitedViews.entries()) {
          if (v.path === view.path) {
            this.visitedViews.splice(i, 1)
            break
          }
        }
        resolve([...this.visitedViews])
      })
    },
    
    delCachedView(view: TagView) {
      return new Promise(resolve => {
        const index = this.cachedViews.indexOf(view.name as string)
        if (index > -1) {
          this.cachedViews.splice(index, 1)
        }
        resolve([...this.cachedViews])
      })
    },
    
    delOthersViews(view: TagView) {
      return new Promise(resolve => {
        this.delOthersVisitedViews(view)
        this.delOthersCachedViews(view)
        resolve({
          visitedViews: [...this.visitedViews],
          cachedViews: [...this.cachedViews]
        })
      })
    },
    
    delOthersVisitedViews(view: TagView) {
      return new Promise(resolve => {
        this.visitedViews = this.visitedViews.filter(v => {
          return v.meta?.affix || v.path === view.path
        })
        resolve([...this.visitedViews])
      })
    },
    
    delOthersCachedViews(view: TagView) {
      return new Promise(resolve => {
        const index = this.cachedViews.indexOf(view.name as string)
        if (index > -1) {
          this.cachedViews = this.cachedViews.slice(index, index + 1)
        } else {
          this.cachedViews = []
        }
        resolve([...this.cachedViews])
      })
    },
    
    delAllViews() {
      return new Promise(resolve => {
        this.delAllVisitedViews()
        this.delAllCachedViews()
        resolve({
          visitedViews: [...this.visitedViews],
          cachedViews: [...this.cachedViews]
        })
      })
    },
    
    delAllVisitedViews() {
      return new Promise(resolve => {
        const affixTags = this.visitedViews.filter(tag => tag.meta?.affix)
        this.visitedViews = affixTags
        resolve([...this.visitedViews])
      })
    },
    
    delAllCachedViews() {
      return new Promise(resolve => {
        this.cachedViews = []
        resolve([...this.cachedViews])
      })
    },
    
    updateVisitedView(view: TagView) {
      for (let i = 0; i < this.visitedViews.length; i++) {
        if (this.visitedViews[i].path === view.path) {
          this.visitedViews[i] = Object.assign(this.visitedViews[i], view)
          break
        }
      }
    }
  }
}) 