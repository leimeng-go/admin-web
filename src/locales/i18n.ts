import { createI18n } from "vue-i18n";
import zhCN from "./langs/zh-CN.json";
import enUS from "./langs/en-US.json";

const i18n = createI18n({
    locale: "zh-CN",
    fallbackLocale: "en-US",
    globalInjection: true, //全局注入，可以直接使用$t
    legacy: false,
    messages: {
        "zh-CN": zhCN,
        "en-US": enUS
    }
});

export default i18n;