import {MockMethod} from "vite-plugin-mock"

const mock: Array<MockMethod> =[
   {
      url: '/api/getUserInfo',
      method: 'get',
      response: () => {
         return {
            code: 0,
            message: 'success',
            data: {
               name: 'vben',
               age: 18
            }
         }
      }
   }
]