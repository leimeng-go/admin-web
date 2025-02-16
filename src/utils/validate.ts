/**
 * 验证是否为外部链接
 * @param {string} path
 * @returns {boolean}
 */
export function isExternal(path: string): boolean {
    return /^(https?:|mailto:|tel:)/.test(path)
  }
  
  /**
   * 验证用户名
   * @param {string} str
   * @returns {boolean}
   */
  export function validUsername(str: string): boolean {
    const validMap: string[] = ['admin', 'editor']
    return validMap.includes(str.trim())
  }
  
  /**
   * 验证URL
   * @param {string} url
   * @returns {boolean}
   */
  export function validURL(url: string): boolean {
    const reg = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
    return reg.test(url)
  }
  
  /**
   * 验证小写字母
   * @param {string} str
   * @returns {boolean}
   */
  export function validLowerCase(str: string): boolean {
    const reg = /^[a-z]+$/
    return reg.test(str)
  }
  
  /**
   * 验证大写字母
   * @param {string} str
   * @returns {boolean}
   */
  export function validUpperCase(str: string): boolean {
    const reg = /^[A-Z]+$/
    return reg.test(str)
  }
  
  /**
   * 验证字母
   * @param {string} str
   * @returns {boolean}
   */
  export function validAlphabets(str: string): boolean {
    const reg = /^[A-Za-z]+$/
    return reg.test(str)
  }
  
  /**
   * 验证邮箱
   * @param {string} email
   * @returns {boolean}
   */
  export function validEmail(email: string): boolean {
    const reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return reg.test(email)
  }
  
  /**
   * 判断是否为字符串
   * @param {unknown} str
   * @returns {boolean}
   */
  export function isString(str: unknown): boolean {
    return typeof str === 'string' || str instanceof String
  }
  
  /**
   * 判断是否为数组
   * @param {unknown} arg
   * @returns {boolean}
   */
  export function isArray(arg: unknown): arg is Array<unknown> {
    if (typeof Array.isArray === 'undefined') {
      return Object.prototype.toString.call(arg) === '[object Array]'
    }
    return Array.isArray(arg)
  }
  
  /**
   * 验证表单字段
   */
  export interface ValidateRule {
    field: string
    value: unknown
    type?: 'string' | 'email' | 'url' | 'username'
    required?: boolean
    min?: number
    max?: number
    message?: string
  }
  
  /**
   * 通用验证函数
   * @param {ValidateRule} rule
   * @returns {string | null} 返回错误信息或null
   */
  export function validate(rule: ValidateRule): string | null {
    const { field, value, type = 'string', required = true, min, max, message } = rule
  
    // 必填检查
    if (required && (value === undefined || value === null || value === '')) {
      return message || `${field} is required`
    }
  
    // 类型检查
    if (value !== undefined && value !== null && value !== '') {
      switch (type) {
        case 'email':
          if (!validEmail(String(value))) {
            return message || `${field} is not a valid email`
          }
          break
        case 'url':
          if (!validURL(String(value))) {
            return message || `${field} is not a valid URL`
          }
          break
        case 'username':
          if (!validUsername(String(value))) {
            return message || `${field} is not a valid username`
          }
          break
      }
  
      // 长度检查
      const strValue = String(value)
      if (min !== undefined && strValue.length < min) {
        return message || `${field} must be at least ${min} characters`
      }
      if (max !== undefined && strValue.length > max) {
        return message || `${field} cannot exceed ${max} characters`
      }
    }
  
    return null
  } 