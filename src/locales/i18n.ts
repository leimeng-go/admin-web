import { createI18n } from "vue-i18n";
import zhCn from "./zh-cn";
import en from "./en";

const i18n =createI18n({
    locale: localStorage.getItem("language") || "zhCn", //语言标识
    globalInjection: true, //全局注入，可以直接使用$t
    legacy: false,
    messages: {
        zhCn,
        en
    }

})

export default i18n;