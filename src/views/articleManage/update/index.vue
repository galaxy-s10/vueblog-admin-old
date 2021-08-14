<template>
  <div>
    <base-form
      ref="hssBaseForm"
      v-if="initData.id"
      :fromData="columnForm"
      :initData="initData"
      :init="init"
      @onSubmit="onSubmit"
    >
    </base-form>
    <div v-else>请在文章列表选择要编辑的文章</div>
    <!-- <i-button @click="confirm">修改</i-button> -->
    <!-- <markdown ref="md" v-if="this.form.content != null" /> -->
  </div>
</template>

<script>
// import markdown from "../../../components/markdown/index";
import hssUpload from "../../../components/upload/index";
import baseForm from "../../../components/hssComponents/form/base-form/index";
import { findArticle, updateArticle } from "@/api/article";
import { getTagList, updateTag, deleteTag, addTag } from "@/api/tag";
import { getTypeList } from "../../../api/type";

// import { updatearticle } from '../../../../../vueblog-client/src/api/article';
export default {
  components: { baseForm, hssUpload },
  data() {
    return {
      tagList: [],
      form: {
        id: "",
        title: "",
        tags: "",
        type: "",
        content: "",
        img: "",
        createdAt: "",
        updatedAt: "",
      },
      columnForm: {},
      initData: {},
      // init: false,
      init: true,
      headerImg: [],
      oldImgList: [],
      newimg: null,
      typeList: [],
    };
  },
  computed: {},
  methods: {
    async getArticleTypeList(v) {
      let typeList = [];
      let res = await getTypeList(v);
      res.rows.forEach((item) => {
        let temp = {};
        temp.label = item.name;
        temp.value = item.id;
        typeList.push(temp);
      });
      this.typeList = typeList;
    },
    onSubmit() {
      this.$refs.hssBaseForm.submit((v) => {
        if (v) {
          console.log(v);
          updateArticle({ ...v, type_id: v.type })
            .then((res) => {
              console.log(res);
              this.$Message.success({
                content: res.message,
              });
            })
            .catch((err) => {
              console.log(err);
            });
        } else {
        }
      });
    },
    confirm() {},
  },
  async created() {
    console.log(this.$route);
    console.log(this.$route.params.id)
    if (!this.$route.params.id) {
      return;
    }
    console.log('00')
    await getTagList({ nowPage: 1, pageSize: 100 }).then((res) => {
      this.tagList = res.rows;
    });
    await this.getArticleTypeList({ nowPage: 1, pageSize: 10 });
    await findArticle(this.$route.params.id)
      .then((res) => {
        this.columnForm = {
          submitBtn: true,
          list: [
            {
              // name: "id",
              // type: "Input",
              prop: "id",
              isNumber: true,
              // placeholder: "",
              // display:'none'
            },
            {
              name: "标题",
              type: "Input",
              prop: "title",
              placeholder: "请输入标题",
              required: true,
            },
            {
              name: "类型",
              type: "Select",
              prop: "type",
              placeholder: "请选择文章类型",
              required: true,
              data: this.typeList,
            },
            {
              name: "浏览量",
              type: "Input",
              prop: "click",
              placeholder: "请输入角色浏览量",
              isNumber: true,
            },
            {
              name: "标签",
              type: "Check",
              data: [],
              prop: "tags",
              isArray: true,
              // required: true,
            },
            {
              name: "发布状态",
              type: "Radio",
              data: [
                { label: "已发布", value: 1 },
                { label: "待审核", value: 0 },
              ],
              prop: "status",
              // required: true,
            },

            {
              name: "评论状态",
              type: "Radio",
              // type: "Select",
              data: [
                { label: "开启", value: 1 },
                { label: "关闭", value: 0 },
              ],
              prop: "is_comment",
              // isString:true,
              // required: true,
            },

            {
              name: "内容",
              type: "Editor",
              prop: "content",
              content: "",
              placeholder: "请输入内容",
              required: true,
            },
            {
              name: "封面图",
              type: "Upload",
              prop: "img",
              placeholder: "请选择封面图",
              // required: true,
            },
            {
              name: "发布时间",
              type: "Date",
              prop: "createdAt",
              placeholder: "请选择发布时间",
              isDate: true,
              required: true,
            },
            // {
            //   name: "最后更新",
            //   type: "Date",
            //   prop: "updatedAt",
            //   placeholder: "请选择最后更新时间",
            //   isDate: true,
            //   required: true,
            // },
          ],
        };
        let tagTemp1 = [];
        res.detail.tags.forEach((item) => {
          tagTemp1.push(item.id);
        });
        // let deepTags = JSON.parse(JSON.stringify(res.detail.tags));
        res.detail.tags = tagTemp1;
        
        // console.log(this.initData);
        this.form.id = res.detail.id;
        this.form.title = res.detail.title;
        this.form.type = res.detail.types[0].id;
        this.form.tags = res.detail.tags;
        this.form.content = res.detail.content;
        this.columnForm.list[this.columnForm.list.length - 3].content =
          res.detail.content;
        let tagTemp = [];
        this.tagList.forEach((item) => {
          // console.log(item);
          let temp = {};
          temp.label = item.name;
          temp.value = item.id;
          tagTemp.push(temp);
          // tagTemp.push(item.id);
        });
        // console.log(tagTemp);
        // 标签
        this.columnForm.list[4].data = tagTemp;

        // 保存文章所有图片
        // this.oldImgList = this.regMd(res.detail.content);
        // 保存封面图
        if (res.detail.img) {
          this.headerImg.push({ name: "", url: res.detail.img });
        }
        console.log(res.detail)
        this.initData = res.detail;
        this.initData.type = res.detail.types[0].id;
      })
      .catch((err) => {
        console.log(err);
      });
  },
  mounted() {},
};
</script>

<style scoped></style>
