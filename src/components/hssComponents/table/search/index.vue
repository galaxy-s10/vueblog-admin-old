<template>
  <!-- <div> -->
  <div style="display: flex; width: 100%">
    <div
      style="
        display: flex;
        width: 90%;
        justify-content: flex-end;
        align-items: center;
        flex-wrap: wrap;
      "
    >
      <div
        class="ivu-form"
        v-for="(item, index) in searchValue"
        style="margin: 0 10px 10px"
      >
        <div v-if="item.type == 'Date'">
          <label class="ivu-form-item-label" for="">{{ item.name }}</label>
          <DatePicker
            :value="item.val"
            type="date"
            :format="item.format ? item.format : 'yyyy-MM-dd'"
            :options="item.options"
            @on-change="(v) => (item.val = v)"
            :placeholder="item.placeholder"
          ></DatePicker>
        </div>
        <div v-else-if="item.type == 'DateTime'">
          <label class="ivu-form-item-label" for="">{{ item.name }}</label>
          <DatePicker
            :value="item.val"
            type="datetime"
            :format="item.format ? item.format : 'yyyy-MM-dd HH:mm:ss'"
            :options="item.options"
            @on-change="(v) => (item.val = v)"
            :placeholder="item.placeholder"
          ></DatePicker>
        </div>

        <div v-else-if="item.type == 'Year'">
          <label class="ivu-form-item-label" for="">{{ item.name }}</label>
          <DatePicker
            :value="item.val"
            type="year"
            :format="item.format ? item.format : 'yyyy'"
            :options="item.options"
            @on-change="(v) => (item.val = v)"
            :placeholder="item.placeholder"
          ></DatePicker>
        </div>
        <div v-else-if="item.type == 'Month'">
          <label class="ivu-form-item-label" for="">{{ item.name }}</label>
          <DatePicker
            :value="item.val"
            type="month"
            :format="item.format ? item.format : 'yyyy-MM'"
            :options="item.options"
            @on-change="(v) => (item.val = v)"
            :placeholder="item.placeholder"
          ></DatePicker>
        </div>

        <div v-else-if="item.type == 'DateTimeRange'">
          <label class="ivu-form-item-label" for="">{{ item.name }}</label>
          <DatePicker
            :value="item.val"
            type="datetimerange"
            :format="item.format ? item.format : 'yyyy-MM-dd HH:mm:ss'"
            :options="item.options"
            :placeholder="item.placeholder"
            @on-change="(v) => (item.val = v)"
            :style="{ width: item.width + 'px' }"
          ></DatePicker>
        </div>
        <div v-else-if="item.type == 'Select'">
          <label class="ivu-form-item-label" for="">{{ item.name }}</label>
          <Select
            v-model="item.val"
            :placeholder="item.placeholder"
            clearable
            @on-select="onSelect"
            :style="{ width: item.width + 'px' }"
          >
            <Option v-for="(el, i) in item.data" :value="el.value" :key="i">{{
              el.label
            }}</Option>
          </Select>
        </div>
        <div v-else>
          <label class="ivu-form-item-label" for="">{{ item.name }}</label>
          <Input
            :style="{ width: item.width + 'px' }"
            v-model="item.val"
            :placeholder="item.placeholder"
            clearable
          />
        </div>
      </div>
    </div>
    <div>
      <i-button style="margin-left: 10px" type="info" @click="handleSearch"
        >搜索</i-button
      >
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    // searchValue: [],
    searchValue: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  model: {
    prop: "vvv",
    event: "changeSearch",
  },
  data() {
    return {};
  },
  watch: {
    searchValue: {
      handler(newVal, oldVal) {
        let temp = {};
        newVal.forEach((item) => {
          if (item.val != undefined) {
            temp[item.key] = item.val;
          }
        });
        this.$emit("changeSearch", temp);
      },
      deep: true,
      // immediate: true,
    },
  },
  created() {},
  mounted() {},
  computed: {},
  methods: {
    onSelect(v) {
      this.$emit("onSelect", v);
    },
    handleSearch() {
      let temp = {};
      this.searchValue.forEach((item) => {
        if (item.val == 0 || (item.val != "" && item.val != undefined)) {
          temp[item.key] = item.val;
        }
      });
      this.$emit("onSearch", temp);
    },
  },
};
</script>

<style scoped></style>
