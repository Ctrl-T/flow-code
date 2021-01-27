<template>
  <div class="tab-pane">
    <div class="tabs">
      <ul>
        <li
          v-for="tab in tabs"
          :key="tab.id"
          :class="{ 'is-active': tab.isActive }"
        >
          <div
            :class="{ 'is-active': tab.isActive }"
            class="tab-btn"
            :href="tab.href"
            @click="selectTab(tab)"
          >
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

<style lang="scss" scoped>
@import "../assets/css/dark-theme.scss";

* {
  margin: 0;
  padding: 0;
}
.tab-pane {
  display: flex;
  flex-direction: row;
  height: 100%;
  .tabs {
    & > ul {
      display: flex;
      flex-direction: column;
      height: 100%;
      & > li {
        display: block;
        flex: auto;
        .tab-btn {
          position: relative;
          color: $txt-clr;
          height: 100%;
          background: $bk-pop-clr;
          display: flex;
          text-align: center;
          justify-content: center;
          flex-direction: column;
          text-orientation: upright;
          cursor: pointer;
          width: 3rem;
          & .iconfont {
            font-size: 2rem;
          }
          &:hover,
          &.is-active {
            color: $txt-head-clr;
          }
          &.is-active::before {
            content: "";
            position: absolute;
            background: $txt-head-clr;
            width: 2px;
            height: 100%;
            left: 0;
          }
        }
      }
    }
  }
  .tabs-details {
    width: 100%;
    height: 100%;
  }
}
</style>