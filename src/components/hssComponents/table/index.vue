<template>
  <div>
    <!-- <Table
      border
      :loading="tableData.list && tableData.list.length == 0"
      :columns="columns"
      :data="tableData.list"
    ></Table> -->
    <!-- <div v-if="tableData.list && searchData.length"> -->
    <div>
      <hss-search
        :searchValue="searchData"
        @onSelect="onSelect"
        @onSearch="onSearch"
        v-model="searchResult"
        @changeSearch="changeSearch"
      ></hss-search>
    </div>

    <!-- <Table border :columns="columns" :data="tableData.list"> -->
    <Table :columns="columns" :data="tableData.list" :loading="loading">
      <template
        v-for="(col, colIndex) in columns"
        v-if="col.slot"
        slot-scope="{ row, column, index }"
        :slot="col.slot"
      >
        <table-slot :row="row" :column="column" :index="index"></table-slot>
      </template>
    </Table>
    <Page
      v-if="Object.keys(params).length != 0"
      style="text-align: right"
      :total="tableData.count"
      :current.sync="params.nowPage"
      show-total
      show-elevator
      @on-change="changePage"
    />
  </div>
</template>

<script>
import hssSearch from "./search";
import tableSlot from "./render.js";
export default {
  components: { tableSlot, hssSearch },
  provide() {
    return {
      demoSlot: this,
    };
  },
  props: {
    columns: {
      type: Array,
      default: () => {
        return [];
      },
    },
    searchData: {
      type: Array,
      default: () => {
        return [];
      },
    },
    tableData: {},
    params: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  data() {
    return {
      loading: true,
      searchResult: {},
    };
  },
  created() {},
  mounted() {},
  computed: {},
  watch: {
    searchData(newVal, oldVal) {
      console.log("searchDatasearchData");
    },
    searchResult(newVal, oldVal) {},
    // tableData: {
    //   handler(newVal, oldVal) {
    //     console.log("tableDatatableDatatableDatatableDatatableDatatableData");
    //     if (this.loading) {
    //       this.loading = false;
    //     }
    //   },
    //   // deep: true,
    //   immediate: true,
    // },
    tableData(newVal, oldVal) {
      console.log("tableDatatableDatatableData");
      if (this.loading) {
        this.loading = false;
      }
    },
  },
  methods: {
    changeSearch(v) {
      this.$emit("changeSearchResult", v);
    },
    onSelect(v) {
      this.$emit("onSelect", v);
    },
    onSearch(v) {
      this.loading = true;
      this.searchResult = v;
      this.$emit("onSearch", v);
    },
    changePage(nowPage) {
      this.$emit("changePage", {
        ...this.params,
        nowPage,
        ...this.searchResult,
      });
    },
  },
};
</script>

<style scoped></style>
