<template>
  <div>
    <!-- <span v-auth="'TAG_MANAGE'">TAG_MANAGE</span>
    <span v-auth="'TAG_MANAGE1'">TAG_MANAGE</span> -->
    <h1>欢迎{{ user.username }}进入控制台！</h1>
    <!-- 第一种情况（报警告），将val作为hssIpt的model里hssIptVal的值 -->
    <!-- <hss-input v-model="val"></hss-input> -->
    <!-- 第二种情况 -->
    <!-- <hss-input :val="val" v-model="val" ref="form1"></hss-input> -->
    <!-- 等价于 -->
    <!-- <hss-input :val="val" v-model="val" @hssChangeIpt="input1"></hss-input> -->
    <!-- 等价于 -->
    <!-- <hss-input :val="val" :hssIptVal="val" @hssChangeIpt="input2"></hss-input> -->
    <!-- 等价于 -->
    <!-- <hss-input
      :val="val"
      :hssIptVal="val"
      @hssChangeIpt="
        (v) => {
          val = v;
        }
      "
    ></hss-input>-->

    <!-- <i-button @click="ppp">ppp</i-button>
    <i-button @click="modal1">a</i-button>
    <hss-modal :val="modalVal" @hssModalOk="ok" @hssModalCancel="cancel"></hss-modal>-->
    <!-- 为ECharts准备一个具备大小（宽高）的Dom -->
    <div ref="echartDemo" style="width: 600px; height: 400px; margin: 10px auto"></div>
  </div>
</template>

<script>
import hssInput from "./custom/hssInput";
import hssModal from "./custom/hssModal";
import { getArticleList, updateArticle, deleteArticle } from "@/api/article";
import { mapState } from "vuex";
export default {
  components: { hssInput, hssModal },
  data() {
    return {
      // option.xAxis.data
      option: {
        title: {
          text: "流量概况"
          // subtext:'subtext'
        },
        tooltip: {
          trigger: "axis"
        },
        legend: {
          data: ["访问量", "访客量"]
        },
        xAxis: {
          boundaryGap: false,
          data: [],
          axisLabel: { interval: 0 }
          // data: [
          //   "2021-02-01",
          //   "2021-02-02",
          //   "2021-02-03",
          //   "2021-02-04",
          //   "2021-02-05",
          //   "2021-02-06",
          //   "2021-02-07",
          // ],
        },
        yAxis: {},
        series: [
          {
            name: "访问量",
            type: "line",
            // smooth: true,
            data: [],
            // markPoint: {
            //   data: [
            //     { type: "max", name: "最大值" },
            //     { type: "min", name: "最小值" },
            //   ],
            // },
            markLine: {
              data: [{ type: "average", name: "平均值" }]
            }
          },
          {
            name: "访客量",
            type: "line",
            // smooth: true,
            data: [],
            // markPoint: {
            //   data: [
            //     { type: "max", name: "最大值" },
            //     { type: "min", name: "最小值" },
            //   ],
            // },
            markLine: {
              data: [{ type: "average", name: "平均值" }]
            }
          }
        ]
      },
      val: "10",
      modalVal: false,
      masonryParams: {
        column: 2,
        gap: 10
      },
      params: {
        pageSize: 10,
        nowPage: 1
      },
      articleList: [],
      imgLoadNum: 0,
      isLoad: false,
      showMasonry: false
    };
  },
  computed: {
    ...mapState({ user: v => v.user })
  },
  created() {
  },
  mounted() {
    console.log("mountedmountedmounted");
    this.getVisitInfo();
    let that = this;
    this.$bus.$on("overScroll", function() {
      console.log("1111111111");
      // if (this.isLoad) return;
      // that.params.nowPage += 1;
      // that.getArticleList();
      if (that.isLoad) {
        console.log("正在ajax");
      } else {
        console.log("发ajax");
        that.params.nowPage += 1;
        that.getArticleList();
      }
    });
  },
  watch: {
    imgLoadNum(newVal) {
      console.log(this.imgLoadNum);
      if (this.imgLoadNum == this.articleList.length) {
        this.showMasonry = true;
        this.isLoad = false;
        this.masonry();
      }
    }
  },
  methods: {
    getDay(day) {
      function doHandleMonth(month) {
        var m = month;
        if (month.toString().length == 1) {
          m = "0" + month;
        }
        return m;
      }
      var today = new Date();

      var targetday_milliseconds = today.getTime() + 1000 * 60 * 60 * 24 * day;

      today.setTime(targetday_milliseconds); //注意，这行是关键代码

      var tYear = today.getFullYear();
      var tMonth = today.getMonth();
      var tDate = today.getDate();
      tMonth = doHandleMonth(tMonth + 1);
      tDate = doHandleMonth(tDate);
      return tYear + "-" + tMonth + "-" + tDate;
    },
    async getVisitInfo() {
      let params = {};
      params.startDate = this.getDay(-6);
      params.endDate = this.getDay(0);
      this.$http({
        url: "/api/log/getRangeVisitInfo",
        method: "get",
        params
      }).then(res => {
        console.log(res);
        res.data.rangeData.forEach(i => {
          this.option.xAxis.data.push(i.today);
          this.option.series[0].data.push(i.allVisiteTotal);
          this.option.series[1].data.push(i.allVisitorTotal);
        });
        this.option.title.text =
          "历史总访问量：" + res.data.allData[0].allVisiteTotal;
        this.option.title.subtext =
          "历史总访客量：" + res.data.allData[0].allVisitorTotal;
        // this.$nextTick(() => {
        this.drawEchart();
        // });
      });
      // console.log(res);
    },
    drawEchart() {
      console.log(this.$echarts);
      let myChart = this.$echarts.init(this.$refs.echartDemo);
      myChart.setOption(this.option);
    },
    aaa() {
      this.params.nowPage += 1;
      this.getArticleList();
    },
    imgLoad() {
      this.imgLoadNum++;
      console.log("imgLoad");
    },
    masonry() {
      // 获取数组最小值的下标
      function getMinIndex(arr) {
        return [].indexOf.call(arr, Math.min.apply(null, arr));
      }
      // 列数
      const column = this.masonryParams.column;
      // 间隙
      const gap = this.masonryParams.gap;
      // const wrap = document.getElementsByClassName("masonry-wrap")
      // const item = wrap[0].getElementsByClassName("masonry-item")
      const wrap = this.$refs["masonry-wrap"];
      const item = this.$refs["masonry-item"];
      const width1 = window.getComputedStyle(wrap, null)["width"];
      const width2 = width1.slice(0, width1.length - 2) - (column - 1) * gap;
      // 计算减去间隙后，每个item的平均宽度
      const width = width2 / column;
      // 保存当前列的offsetHeight的高度
      const offsetList = [];
      wrap.style.position = "relative";
      console.log(wrap, item);
      console.log(this.$refs);
      for (let i = 0; i < item.length; i++) {
        wrapHeight += item[i].offsetHeight + gap;
        // console.log(wrapHeight);
        item[i].style.width = "100%";
        item[i].style.display = "block";
        item[i].style.position = "absolute";
        item[i].style.width = width + "px";

        if (i < column) {
          // 将第一行的offsetHeight都保存在数组里
          console.log(item[i]);
          console.log(item[i].offsetHeight);
          offsetList.push(
            i == 0 ? item[i].offsetHeight + gap : item[i].offsetHeight
          );
          item[i].style.top = "0";
          if ((i + 1) % column == 1) {
            item[i].style.left = 0;
            item[i].style.opacity = 1;
          } else {
            let w = i * width;
            let g = i * gap;
            item[i].style.left = `calc(${w}px + ${g}px)`;
            item[i].style.opacity = 1;
          }
        } else {
          // 当前数组的最低offsetHeight索引
          const minIndex = getMinIndex(offsetList);
          let w = minIndex * width;
          let g = minIndex * gap;
          item[i].style.top = offsetList[minIndex] + g + "px";
          item[i].style.left = w + g + "px";
          item[i].style.opacity = 1;
          offsetList[minIndex] += item[i].offsetHeight + gap;
        }
      }
      function format(v) {
        return v.slice(0, v.length - 2);
      }
      let wrapHeight =
        parseInt(format(item[item.length - 1].style.top)) +
        parseInt(item[item.length - 1].offsetHeight);
      console.log(wrapHeight, 999999999);
      wrap.style.height = wrapHeight + "px";
    },
    async getArticleList(v) {
      // console.log(v);
      // console.log({ ...v });
      this.isLoad = true;
      let { rows } = await getArticleList(this.params);
      if (this.articleList.length == 0) {
        this.articleList = rows;
      } else {
        this.articleList = this.articleList.concat(rows);
      }

      // setTimeout(() => {
      //   this.masonry();
      // }, 300);
    },
    ppp() {
      this.$refs.form1.handleSubmit(x => {
        console.log("ooo");
        console.log(x);
      });
      // console.log(this.$refs.form1.handleSubmit())
      // console.log(this.$refs.form1.handleSubmit(x=>{
      //   console.log(x)
      // }))
      console.log("最后");
    },
    ok() {
      console.log("ok");
      this.modalVal = false;
    },
    cancel() {
      console.log("cancel");
      this.modalVal = false;
    },
    modal1() {
      console.log("object");
      this.modalVal = !this.modalVal;
    },
    input1(v) {
      console.log("父组件input");
      // do some things
    },
    input2(v) {
      console.log("父组件input");
      //必须，因为这相当于传统的父子传值，子组件的val和hssIptVal都依赖父组件的val
      this.val = v;
      // do some things
    }
  }
};
</script>

<style>
.demo-spin-icon-load {
  animation: ani-demo-spin 1s linear infinite;
}
@keyframes ani-demo-spin {
  from {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(180deg);
  }
  to {
    transform: rotate(360deg);
  }
}
img {
  background-position: 50% 50%;
  background-size: cover;
  height: 100%;
  width: 100%;
  transition: all 0.5s ease 0s;
}
</style>
