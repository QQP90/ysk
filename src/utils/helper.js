// 基础工具类
export default class helper {
    // 从逗号间隔的多个对象组成的字符串中去除单个对象
    static removeItemFromMultiString(multiString, itemString, splitTag) {
        let split = splitTag || ',';
        let list = multiString.split(split);
        let idx = list.indexOf(itemString);
        list.splice(idx, 1);
        return list.join(split);
    }
}