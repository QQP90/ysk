<template>
  <div class="app-container">
    <div class="toolbar-top">
      <Form inline>
        <FormItem>
          <Input
            type="text"
            placeholder="科室类型"
            clearable
            v-model="keyword"
          />
        </FormItem>
        <FormItem>
          <Button type="primary" @click="handleSearch">查询</Button>
        </FormItem>
      </Form>
    </div>
    <Table
      stripe
      :columns="columns"
      :data="dataList"
      :height="tableHeight"
      :loading="loading"
    ></Table>
    <div class="toolbar-bottom">
      <div class="action-box">
        <Button type="success" @click="handleNew"
          ><span class="icon-xinzeng font-icon"></span>新增科室类型</Button
        >
      </div>
      <div class="paging-box">
        <Page
          :total="dataCount"
          :page-size="pageSize"
          :current="pageIndex"
          @on-change="changePage"
          @on-page-size-change="changePageSize"
          show-total
          show-sizer
          show-elevator
          class="pageing"
        />
      </div>
    </div>
    <Modal
      v-model="isShowEditForm"
      class-name="vertical-center-modal"
      :styles="{ top: '20px' }"
    >
      <p slot="header" style="text-align:left">
        <span v-if="currentDepartmentType.id > 0">编辑科室科室类型</span>
        <span v-else>新增科室类型</span>
      </p>
      <Form
        :model="currentDepartmentType"
        ref="editForm"
        :label-width="100"
        :rules="formRules"
      >
        <FormItem label="上级类型" prop="parentId">
          <Select v-model="currentDepartmentType.parentId" filterable>
            <Option value="0">无</Option>
            <Option
              v-for="(option, index) in allParentTypes"
              :value="option.id"
              :key="index"
              >{{ option.name }}</Option
            >
          </Select>
        </FormItem>
        <FormItem label="名称" prop="name">
          <Input type="text" v-model="currentDepartmentType.name" />
        </FormItem>
        <FormItem label="简介" prop="intro" class="desc-form">
          <Input
            type="textarea"
            :rows="6"
            v-model="currentDepartmentType.intro"
          />
        </FormItem>
      </Form>
      <div slot="footer">
        <Button
          type="primary"
          size="large"
          :loading="loadingSave"
          @click="handleSave"
          >保存</Button
        >
      </div>
    </Modal>
  </div>
</template>

<script>
import apiDepartment from '@/api/apiDepartment';
import { formatDate } from '@/utils/formatDate';

export default {
  components: {},
  data () {
    return {
      tableHeight: document.documentElement.clientHeight - 215,
      keyword: '',
      loading: false,
      loadingSave: false,
      dataCount: 0,
      pageSize: 20,
      pageIndex: 1,
      dataList: [],
      columns: this.buildColumns(),
      allParentTypes: [], // 所有父级类型
      allHosptials: [], // 所有医院
      isShowEditForm: false, // 是否显示编辑表单弹窗
      formRules: {
        name: [{ required: true, message: '名称不能为空', trigger: 'blur' }]
      },
      currentDepartmentType: {}
    }
  },
  mounted () {
    this.loadData()
    this.loadParentTypes()
  },
  methods: {
    buildColumns () {
      return [
        {
          title: 'ID',
          key: 'id',
          width: 80
        },
        {
          title: '上级类型',
          key: 'parentName',
          width: 150
        },
        {
          title: '名称',
          key: 'name',
          width: 150
        },
        // {
        //     title: '层级',
        //     key: 'level',
        //     width: 70
        // },
        {
          title: '简介',
          key: 'intro'
        },
        {
          title: '最近修改',
          key: 'modifyTime',
          align: 'center',
          width: 150,
          render: (h, params) => {
            return h('div', [
              h('p', params.row.modifyUser),
              h('p', params.row.modifyTime)
            ])
          }
        },
        {
          title: '操作',
          key: 'action',
          align: 'center',
          width: 170,
          render: (h, params) => {
            return h(
              'div',
              {
                attrs: {
                  class: 'r-row'
                }
              },
              [
                h('span', {
                  attrs: {
                    class: 'icon-bianji font-icon',
                    title: '编辑该科室类型'
                  },
                  on: {
                    click: () => {
                      this.currentDepartmentType = Object.assign(
                        {},
                        params.row
                      )
                      this.isShowEditForm = true
                    }
                  }
                }),
                h('span', {
                  attrs: {
                    class: 'icon-shanchu1 font-icon',
                    title: '删除该科室类型'
                  },
                  on: {
                    click: () => {
                      this.handleDelete(params.row)
                    }
                  }
                })
              ]
            )
          }
        }
      ]
    },
    handleSearch () {
      this.pageIndex = 1
      this.loadData()
    },
    loadData () {
      this.loading = true
      apiDepartment
        .getTypeList({
          name: this.keyword,
          pageNum: this.pageIndex,
          pageSize: this.pageSize
        })
        .then(res => {
          this.loading = false
          let j = res.data
          if (j.code === 200) {
            this.dataCount = res.data.data.total
            this.dataList = res.data.data.list
          } else {
            this.$Message.error(`加载失败：${j.message}`)
          }
        })
        .catch(err => {
          this.loading = false
          console.log(err)
        })
    },
    // 加载一级类型，用于表单中选择上级类型用
    loadParentTypes () {
      apiDepartment
        .getTypeList({
          parentId: 0,
          pageNum: 1,
          pageSize: 1000
        })
        .then(res => {
          let j = res.data
          if (j.code === 200) {
            this.allParentTypes = res.data.data.list
          } else {
            this.$Message.error(`加载失败：${j.message}`)
          }
        })
        .catch(err => {
          this.loading = false
          console.log(err)
        })
    },

    handleNew () {
      this.isShowEditForm = true
      this.currentDepartmentType = { id: 0 }
    },
    handleSave () {
      this.loadingSave = true
      apiDepartment.saveType(this.currentDepartmentType).then(res => {
        this.loadingSave = false
        let j = res.data
        if (j.code === 200) {
          this.$Message.success('保存成功')
          this.isShowEditForm = false
          this.loadData()
          // 如果添加是的一级类型，则重新加载所有一级类型
          if (tihs.currentDepartmentType.parentId === 0) {
            this.loadParentTypes()
          }
        } else {
          this.$Message.error(`保存失败，${j.message}`)
        }
      })
    },
    handleDelete (currentType) {
      this.$Modal.confirm({
        title: '提示',
        content: `是否确认删除科室类型：${currentType.name}`,
        okText: '确定',
        cancelText: '取消',
        onOk: () => {
          apiDepartment
            .deleteType(currentType.id)
            .then(res => {
              let j = res.data
              if (j.code === 200) {
                this.$Message.success('删除成功')
                // 重新查询数据
                this.loadData()
                // 如果操作的是一级类型，则重新加载所有一级类型
                if (currentType.parentId === 0) {
                  this.loadParentTypes()
                }
              }
            })
            .catch(err => {
              this.$Message.success(err.message)
            })
        },
        onCancel: () => {
          this.$Message.info('已取消')
        }
      })
    },
    changePage (value) {
      this.pageIndex = value
      this.loadData()
    },
    changePageSize (value) {
      this.pageSize = value
      this.pageIndex = 1
      this.loadData()
    }
  }
}
</script>
<style scoped>
.desc-form {
  margin-top: 10px;
}
</style>
