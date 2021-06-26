// import "./index.less";
// import "./index.css";
// import {Switch} from "../../dist/index";
// import Switch from "../switch/index";
// import 'billd-ui/dist/switch/style/index.css'
// import "../switch/switch.css";
// import { Button } from "ant-design-vue";


import { Switch } from "billd-ui";


export default {
  components: { HSwitch: Switch, AButton: Button },
  data() {
    return {};
  },
  render() {
    console.log();
    return (
      <div>
        sds
        <h-switch
          switchVal
          closeText="no"
          openText="ok"
          defaultChecked={false}
        ></h-switch>
        <div class="hello-wrap">
          <span class="redfont">我是hello,index.jsx</span>
        </div>
        <a-button>we</a-button>
      </div>
    );
  },
  computed: {},
  created() {},
  mounted() {},
  methods: {},
};
