import axios, { Axios, AxiosResponse, Method } from "axios"

// interface IAxiosData{
//     url: string 
//     method: Method
//     headers?: any
//     json: boolean
//     contentType?: string 
//     data?: any 
//     params?: any
//     timeout?: number 
//     responseType?: ResponseType
// }

// const axiosInstance =axios.create({
//     timeout: 20000 //设置超市时间
// })

// export default function request(arr: IAxiosData) {
//     return new Promise<any>((resolve, reject) => {
//         axiosInstance({
//             timeout: arr.timeout === undefined ? 10000 : arr.timeout, // 请求超时
//             url: arr.url,
//             method: arr.method || 'POST',
//             header: {
//                 'content-type': arr.contentType ? arr.contentType : arr.json ? 'application/json; charset=UTF-8' : 'application/x-www-form-urlencoded; charset=UTF-8'
//             },
//             params: arr.params || '',
//             data: arr.data || '',
//             responseType: arr.responseType || 'json'
//         }).then((response: AxiosResponse<any>) => {
//             /**
//              * response格式
//              * {
//              *   data:{},
//              *   status:200,
//              *   statusText:'OK',//从服务器返回的http状态文本
//              *   headers: {},//响应头信息
//              *   config: {} //`config`是在请求的时候的一些配置信息
//              *   }
//              */
//             const responseStatus = `${response.status}`;
//             if (responseStatus.charAt(0) === '2') {
//                 if (response.data.code === '1' || response.data.code === 'err_9999') {
//                     ElMessage({
//                         type: 'error',
//                         message: response.data.message
//                     })
//                     reject(response.data)
//                     return
//                 }
//                 resolve(response.data)
//             } else {
//                 ElMessage({
//                     type: 'error',
//                     message: response.data.message
//                 })
//                 reject(response.data)
//             }
//         }).catch((err) => {
//             ElMessage({
//                 type:'error',
//                 message:err.message
//             })
//         })
//     })
// }
