<template>
  <div style="background: green">
    <h1>我是foo组件</h1>
    我是foo
    {{arrlist}}
    {{obj}}
    <span @click="test">111</span>
    <div
      class="detail-bmi"
      style="overflow:hidden"
      hover-class="none"
      hover-stop-propagation="false"
    >
      <div class="fenxi-wrap" hover-class="none" hover-stop-propagation="false">
        <div
          class="wrap"
          style="background:rgba(246, 238, 220, 1)"
          hover-class="none"
          hover-stop-propagation="false"
        >
          <div
            class="active"
            :style="{width:weightWidth+'%',background:'rgba(233, 187, 109, 1)'}"
            hover-class="none"
            hover-stop-propagation="false"
          ></div>
          <div
            class="active-value"
            :style="{left:weightWidth+'%',background:'rgba(233, 187, 109, 1)'}"
            hover-class="none"
            hover-stop-propagation="false"
          >{{weightValue}}</div>
          <div
            class="flag start-flag"
            style="background-color:rgba(233, 187, 109, 1)"
            hover-class="none"
            hover-stop-propagation="false"
          ></div>
          <div
            class="flag center-flag"
            style="background-color:rgba(233, 187, 109, 1)"
            hover-class="none"
            hover-stop-propagation="false"
          ></div>
          <div
            class="flag end-flag"
            style="background-color:rgba(233, 187, 109, 1)"
            hover-class="none"
            hover-stop-propagation="false"
          ></div>
          <div class="bottom-text start-text" hover-class="none" hover-stop-propagation="false">107</div>
          <div
            class="bottom-text center-text"
            hover-class="none"
            hover-stop-propagation="false"
          >138.8</div>
          <div class="bottom-text end-text" hover-class="none" hover-stop-propagation="false">161.8</div>
          <div class="top-text one-text" hover-class="none" hover-stop-propagation="false">偏轻</div>
          <div class="top-text two-text" hover-class="none" hover-stop-propagation="false">健康</div>
          <div class="top-text three-text" hover-class="none" hover-stop-propagation="false">超重</div>
          <div class="top-text four-text" hover-class="none" hover-stop-propagation="false">偏胖</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  props: {},
  data() {
    return {
      weightValue: 10, //体重：0-250
      weightWidth: 0, //体重进度条：0-100
      arrlist: ["11", "22"],
      obj: { name: 123 }
    };
  },
  created() {},
  mounted() {
    // 0-107，有20%的长度
    // 107-138.8，有25%的长度
    // 138.8-161.8，有25%的长度
    // 161.8-250，有30%的长度
    var weightValue = this.weightValue;
    var weightWidth = 0;
    if (weightValue <= 107) {
      weightWidth = 20 * (weightValue / 107);
    } else if (weightValue <= 138.8 && weightValue > 107) {
      var all = 138.8 - 107;
      var item = 138.8 - weightValue;
      var val = 1 - item / all;
      weightWidth = 20 + 25 * val;
    } else if (weightValue <= 161.8 && weightValue > 138) {
      var all = 161.8 - 138;
      var item = 161.8 - weightValue;
      var val = 1 - item / all;
      weightWidth = 45 + 25 * val;
    } else {
      var all = 250 - 161.8;
      var item = 250 - weightValue;
      var val = 1 - item / all;
      weightWidth = 70 + 30 * val;
    }
    this.weightWidth = weightWidth;
  },
  computed: {},
  methods: {
    test() {
      console.log("111");
      this.arrlist[1] = new Date().getTime()+324523;
      this.obj.name = new Date().getTime();
    }
  }
};
</script>

<style scoped>
.detail-bmi .fenxi-wrap {
  width: 100%;
  padding-top: 60px;
  margin-bottom: 30px;
}

.detail-bmi .fenxi-wrap .wrap {
  position: relative;
  width: 100%;
  border-radius: 10px;
  background-color: #e8f5fe;
  height: 8px;
}

.detail-bmi .fenxi-wrap .wrap .active {
  position: absolute;
  width: 10%;
  height: 100%;
  background-color: #87c1f3;
  border-radius: 10px;
  z-index: 999;
}

.detail-bmi .fenxi-wrap .wrap .active-value {
  position: absolute;
  top: -350%;
  z-index: 999;
  transform: translateX(-50%);
  padding: 0 10px;
  background-color: #87c1f3;
  border-radius: 10px;
  color: white;
  font-size: 12px;
}

.detail-bmi .fenxi-wrap .wrap .flag {
  position: absolute;
  top: 0;
  height: 100%;
  width: 2px;
  background-color: #b2d0e3;
}

.detail-bmi .fenxi-wrap .wrap .flag.start-flag {
  left: 20%;
}

.detail-bmi .fenxi-wrap .wrap .flag.center-flag {
  left: 45%;
}

.detail-bmi .fenxi-wrap .wrap .flag.end-flag {
  left: 70%;
}

.detail-bmi .fenxi-wrap .wrap .bottom-text {
  position: absolute;
  top: 180%;
  color: #9d9d9d;
  height: 100%;
  transform: translateX(-50%);
}

.detail-bmi .fenxi-wrap .wrap .bottom-text.start-text {
  left: 20%;
}

.detail-bmi .fenxi-wrap .wrap .bottom-text.center-text {
  left: 45%;
}

.detail-bmi .fenxi-wrap .wrap .bottom-text.end-text {
  left: 70%;
}

.detail-bmi .fenxi-wrap .wrap .top-text {
  position: absolute;
  color: #9d9d9d;
  top: -700%;
  height: 100%;
  transform: translateX(-50%);
}

.detail-bmi .fenxi-wrap .wrap .top-text.one-text {
  left: 10%;
}

.detail-bmi .fenxi-wrap .wrap .top-text.two-text {
  left: 30%;
}

.detail-bmi .fenxi-wrap .wrap .top-text.three-text {
  left: 57%;
}

.detail-bmi .fenxi-wrap .wrap .top-text.four-text {
  left: 85%;
}
</style>