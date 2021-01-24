<template>
  <div class="tab-pane">
    <div class="tabs">
      <ul>
        <li
          v-for="tab in tabs"
          :key="tab.id"
          :class="{ 'is-active': tab.isActive }"
        >
          <div class="tab-btn" :href="tab.href" @click="selectTab(tab)">
            <!-- {{ tab.name }} -->
            <i :class="tab.iconClass"></i>
          </div>
        </li>
      </ul>
    </div>
    <div class="tabs-details">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "tabs",
  data() {
    return {
      tabs: [],
    };
  },
  created() {
    this.tabs = this.$children;
  },
  methods: {
    selectTab(selectedTab) {
      this.tabs.forEach((tab) => {
        tab.isActive = tab.name == selectedTab.name;
      });
    },
  },
};
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
.tab-pane {
  display: flex;
  flex-direction: row;
  height: 100%;
}
.tabs {
  /* height: 100%; */
}
.tabs > ul {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.tabs > ul > li {
  display: block;
  flex: auto;
}
.tabs-details {
  width: 100%;
  height: 100%;
}
.tab-btn {
  position: relative;
  color: #b6b6b6;
  height: 100%;
  background: #44475a;
  display: flex;
  text-align: center;
  justify-content: center;
  flex-direction: column;
  text-orientation: upright;
  cursor: pointer;
  width: 3rem;
}
.tab-btn:hover,
.is-active > .tab-btn {
  color: #e5e5e5;
}
.is-active > .tab-btn::before {
  content: "";
  position: absolute;
  background: #e5e5e5;
  width: 2px;
  height: 100%;
  left: 0;
}
.tab-btn .iconfont {
  font-size: 2rem;
}
</style>