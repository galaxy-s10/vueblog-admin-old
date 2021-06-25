// import "./index.less";
// import "./index.css";
import aaa from "../../dist/index";
console.log(aaa);
export default {
  components: { HSwitch:aaa.HSwitch },
  data() {
    return {};
  },
  render() {
    console.log();
    return (
      <div>
        <h-switch></h-switch>
        <div class="hello-wrap">
          <span class="redfont">我是hello,index.jsx</span>
        </div>
      </div>
    );
  },
  computed: {},
  created() {},
  mounted() {},
  methods: {},
};
