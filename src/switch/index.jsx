{
  /* <template>
  <div
    class="hss-switch"
    :class="{ 'hss-switch-checked': isChecked }"
    @click="changeSwitch"
  >
    <span class="hss-switch-inner">
      {{ this.$attrs.openText && isChecked ? this.$attrs.openText : "" }}
      {{ this.$attrs.closeText && !isChecked ? this.$attrs.closeText : "" }}
      <slot name="openSlot" v-if="isChecked"></slot>
      <slot name="closeSlot" v-else></slot>
    </span>
  </div>
</template> */
}
// import "./style/index.less";
export default {
  inheritAttrs: false, //将自定义组件的attrs不显示在渲染的html元素上，防止冲突（比如title）
  components: {},
  data() {
    return {
      isChecked: false,
    };
  },
  render() {
    return (
      <div>
        <div
          class="hss-switch"
          class={{ "hss-switch-checked": this.isChecked }}
          // vOn:click={this.changeSwitch}
        >
          <span class="hss-switch-inner">
            1111
            {this.$attrs.openText && isChecked ? this.$attrs.openText : ""}
            {this.$attrs.closeText && !isChecked ? this.$attrs.closeText : ""}
            {this.isChecked ? (
              <slot name="openSlot"></slot>
            ) : (
              <slot name="closeSlot"></slot>
            )}
          </span>
        </div>
      </div>
    );
  },
  computed: {},
  created() {},
  mounted() {
    console.log(1, this.$scopedSlots);
    console.log(2, this.$slots);
  },
  methods: {
    changeSwitch() {
      console.log("changeSwitch");
      this.isChecked = !this.isChecked;
    },
  },
};
