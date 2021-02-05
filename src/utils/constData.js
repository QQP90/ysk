export default class dicDealer {
    // 临床职称
  static arrayClinicPosition = [
    { id:47, name: "主任医师"},
    { id:49, name: "副主任医师"},
    { id:50, name: "主治医师"},
    { id:52, name: "主管技师"},
    { id:54, name: "住院医师"},
    { id:55, name: "主任技师"},
    { id:56, name: "副主任技师"},
    { id:57, name: "主任检验师"},
    { id:58, name: "副主任检验师"},
    { id:59, name: "助理医师"},
    { id:62, name: "主任药师"},
    { id:63, name: "副主任药师"},
    { id:64, name: "高级按摩师"},
    { id:65, name: "康复治疗师"},
    { id:66, name: "高级美容师"},
    { id:75, name: "技士"},
    { id:77, name: "副主任护师"},
    { id:81, name: "护师"},
    { id:82, name: "护士"},
    { id:83, name: "技师"},
    { id:86, name: "药师"},
    { id:87, name: "药士"},
    { id:88, name: "医师"},
    { id:89, name: "主管护师"},
    { id:91, name: "主管药师"},
    { id:92, name: "主任护师"},
    { id:113, name: "三级心理咨询师"},
    { id:114, name: "一级公共营养师"},
    { id:115, name: "二级公共营养师"},
    { id:116, name: "三级公共营养师"},
    { id:117, name: "一级健康管理师"},
    { id:118, name: "主管营养师"},
    { id:120, name: "二级健康管理师"},
    { id:121, name: "乡村医师"},
    { id:122, name: "一级心理咨询师"},
    { id:123, name: "二级心理咨询师"},
    { id:124, name: "三级心理咨询师"},
    { id:125, name: "其他"},
    { id:139, name: "主任中医师"},
    { id:140, name: "副主任中医师"},
    { id:141, name: "主治中医师"},
    { id:142, name: "营养师"},
    { id:147, name: "业务院长"}
  ];
    // 获取临床职称文本
    static getClinicPositionName(id) {
        return this.getDicNameById(id, this.arrayClinicPosition);
    }
    // 医院等级数组
    static arrayHospitalGrade = [
        { id: 144, name: '三级甲等'},
        { id: 145, name: '三级'},
        { id: 146, name: '二级甲等'},
        { id: 149, name: '二级'},
        { id: 152, name: '一级甲等'},
        { id: 155, name: '一级'},
        { id: 156, name: '特级'},
        { id: 157, name: '一级乙等'},
        { id: 158, name: '一级丙等'},
        { id: 159, name: '二级乙等'},
        { id: 160, name: '二级丙等'},
        { id: 161, name: '三级乙等'},
        { id: 162, name: '三级丙等'}
    ];
    // 获取医院等级名称
    static getHospitalGradeName(id) {
        return this.getDicNameById(id, this.arrayHospitalGrade);
    }

    // 医院性质
    static arrayHospitalNature = [
        { id: 163, name: '国营'},
        { id: 164, name: '民营'},
        { id: 165, name: '中外合资'},
        { id: 166, name: '高端医疗'},
        { id: 862, name: '特色医院'},
    ];
    // 获取医院性质文本
    static getHospitalNatureName(id) {
        return this.getDicNameById(id, this.arrayHospitalNature);
    }

    // 医院类型
    static arrayHospitalType = [
        { id: 1, name: '综合医院'},
        { id: 2, name: '专科医院'},
        { id: 3, name: '中医医院'},
        { id: 4, name: '中西医结合医院'},
        { id: 5, name: '民族医院'},
        { id: 6, name: '康复院'},
        { id: 7, name: '社区卫生服务中心'},
        { id: 8, name: '门诊部'},
        { id: 9, name: '急救中心'},
        { id: 10, name: '妇幼保健院、所'},
        { id: 11, name: '专科疾病防治院(所、中心)'},
        { id: 12, name: '医学专科研究所'},
        { id: 13, name: '其他卫生事业机构'}
    ];
    // 获取医院类型文本
    static getHospitalTypeName(id) {
        return this.getDicNameById(id, this.arrayHospitalType);
    }

    // 获取状态描述文本
    static getStatusName(id) {
        let name = '';
        switch(id) {
            case 0:
                name = '待审核';
                break;
            case 1:
                name = '正常';
                break;
            case 2:
                name = '删除';
                break;
            case 3:
                name = '未通过';
                break;
            default:
                name = '未知';
                break;
        }
        return name;
    }

    // 获取性别文本
    static getSexName(sex) {
        let name = '';
        switch(sex) {
            case 1:
                name = '男';
                break;
            case 2:
                name = '女';
                break;
            default:
                name = '未知';
                break;
        }
        return name;
    }
    // 学历
    static arrayDigree = [
        { id: 106, name: '博士研究生'},
        { id: 107, name: '硕士研究生'},
        { id: 109, name: '本科'},
        { id: 110, name: '大专'},
        { id: 111, name: '其他'}
    ];
    // 获取学历文本描述
    static getDigreeName(id) {
        return this.getDicNameById(id, this.arrayDigree);
    }

    // 从指定的数组中获取指定id的文本值（通用方法）
    static getDicNameById(id, dic) {
        let name = '未知';
        for (let i=0; i<dic.length; i++) {
            if(id === dic[i].id) {
                name = dic[i].name;
                break;
            }
        }
        return name;
    }
}
