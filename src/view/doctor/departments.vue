<template>
    <div>
        <Table stripe  :columns="columns" :data="dataList" :loading="loading"></Table>
        <div class="action-box">
            <Button type="primary" @click="handleNew">绑定新科室</Button>
        </div>
        <Modal title="绑定新科室" width="900" :styles="{top: '20px'}" v-model="isShowNewForm" footer-hide>
            <Form inline class="form-c" ref="searchData" :model="departmentSearchParams">
                <FormItem prop="id">
                    <Input type="text" placeholder="医院名称" @on-enter="handleSearchDepartment" clearable v-model="departmentSearchParams.hospitalName" />
                </FormItem>
                <FormItem prop="name">
                    <Input type="text" placeholder="科室名称" @on-enter="handleSearchDepartment" clearable v-model="departmentSearchParams.name" />
                </FormItem>
                <FormItem>
                    <Button type="primary" @click="handleSearchDepartment">查询</Button>
                </FormItem>
            </Form>
            <Table border stripe  :columns="departmentColumns" :data="departmentList"  height="500" :loading="departmentLoading"></Table>
            <Page style="margin-top:10px;" v-if="departmentTotalCount>departmentPageSize" :total="departmentTotalCount" :page-size="departmentPageSize" :current="departmentPageIndex" @on-change="handleDepartmentChangePage" @on-page-size-change="handleDepartmentChangePageSize" show-sizer show-elevator show-total class="pageing" />
        </Modal>
    </div>
</template>
<script>
import apiDoctor from '@/api/apiDoctor';
import apiDepartment from '@/api/apiDepartment';

export default {
    props: {
        doctorInfo: {
            type: Object,
            required: true,
            default: {
                id: 0
            }
        }
    },
    data() {
        return {
            isShowNewForm: false, // 是否显示绑定新科室弹窗
            departmentSearchParams: {}, // 科室查找参数
            departmentList: [], // 科室列表数据
            departmentTotalCount: 0, // 科室数据总数
            departmentLoading: false, // 科室加载效果
            departmentPageIndex: 1,
            departmentPageSize: 20,
            departmentColumns: [
                {
                    title: 'ID',
                    key: 'id',
                    width: 80
                },
                {
                    title: '医院',
                    key: 'hospitalName'
                },
                {
                    title: '科室',
                    key: 'name'
                },
                {
                    title: '#',
                    width: 60,
                    align: 'right',
                    render: (h, params) => {
                        return h('div', [
                            h('Button', {
                                props: {
                                    type: 'success',
                                    size: 'small',
                                    shape: 'circle',
                                    icon: 'md-checkmark'
                                },
                                on: {
                                    click: () => {
                                        this.handleRelationDepartment(params.row);
                                    }
                                }
                            })
                        ]);
                    }
                }
            ],
            loading: false,
            dataList: [],
            columns: [
                {
                    title: 'ID',
                    key: 'id',
                    width: 80
                },
                {
                    title: '医生',
                    key: 'doctorName',
                    width: 120
                },
                {
                    title: '科室',
                    key: 'labName'
                },
                {
                    title: '医院',
                    key: 'hospitalName'
                },
                {
                    title: '#',
                    width: 150,
                    align: 'right',
                    render: (h, params) => {
                        return h('div', [
                            h('Button', {
                                props: {
                                    type: 'dashed',
                                    size: 'small',
                                    shape: 'circle',
                                    icon: 'md-close'
                                    //icon: 'ios-trash-outline'
                                },
                                on: {
                                    click: () => {
                                        this.handleRemove(params.row);
                                    }
                                }
                            })
                        ]);
                    }
                }
            ]
        };
    },
    mounted() {
        this.loadData();
    },
    methods: {
        loadData() {
            if (this.doctorInfo.id > 0) {
                this.loading = true;
                apiDoctor.getDepartmentOfDoctor({
                    doctorId: this.doctorInfo.id,
                    pageNum: 1,
                    pageSize: 100
                }).then(res => {
                    this.loading = false;
                    let j = res.data;
                    if (j.code === 200) {
                        this.dataList = j.data.list;
                    } else {
                        this.$Message.error(`加载失败，${j.message}`);
                    }
                });
            }
        },
        handleSearchDepartment() {
            this.departmentPageIndex = 1;
            this.loadDepartments();
        },
        loadDepartments() {
            this.departmentLoading = true;
            let params = Object.assign({
                pageNum: this.departmentPageIndex,
                pageSize: this.departmentPageSize
            }, this.departmentSearchParams);
            apiDepartment.getList(params).then(res => {
                this.departmentLoading = false;
                if (res.data.code === 200) {
                    this.departmentList = res.data.data.list;
                    this.departmentTotalCount = res.data.data.total;
                }
            });
        },
        handleRelationDepartment(departInfo) {
            let that = this;
            this.$Modal.confirm({
                title: '提示',
                content: `确定将医生【${this.doctorInfo.name}】关联到 【${departInfo.hospitalName}】的 【${departInfo.name}】吗？`,
                onOk() {
                    apiDoctor.addDepartmentRelation({
                        doctorId: that.doctorInfo.id,
                        labId: departInfo.id
                    }).then(res => {
                        if (res.data.code === 200) {
                            this.$Message.success('关联成功');
                            that.loadData();
                            that.isShowNewForm = false;
                        } else {
                            this.$Message.error(`关联失败，${res.data.message}`);
                        }
                    });

                }
            });
        },
        handleDepartmentChangePage (value) {
            this.departmentPageIndex = value
            this.loadDepartments()
        },
        handleDepartmentChangePageSize (value) {
            this.departmentPageSize = value
            this.loadDepartments()
        },
        handleNew() {
            this.isShowNewForm = true;
        },
        handleRemove(doctorInfo) {
            let that = this;
            this.$Modal.confirm({
                title: '提示',
                content: `确定要将医生【${doctorInfo.doctorName}】从 【${doctorInfo.hospitalName}】 的 【${doctorInfo.labName}】 中移除吗？`,
                onOk() {
                    apiDoctor.deleteDepartmentRelation(doctorInfo.id).then(res => {
                        if (res.data.code === 200) {
                            this.$Message.success('移除成功');
                            that.loadData();
                        } else {
                            this.$Message.error(`移除失败，${res.data.message}`);
                        }
                    });

                }
            });
        }
    }
}
</script>
<style lang="less" scoped>
.action-box {
    margin-top: 20px;
}
</style>
