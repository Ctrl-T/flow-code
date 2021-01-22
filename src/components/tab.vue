<template>
  <div
    class="tab"
    v-show="isActive"
  >
    <slot></slot>
    <!-- <i>href : {{ href }}</i> -->
  </div>
</template>

<script>
export default {
  name: "tab",
  props: {
    name: { required: true },
    selected: { default: false },
    activeIconUrl: { default: "" },
    iconUrl: { default: "" },
  },
  data() {
    return {
      isActive: false,
      isHover: false,
    };
  },
  computed: {
    href() {
      return "#" + this.name.toLowerCase().replace(/ /g, "-");
    },
    currIconUrl() {
      return this.isActive ? this.activeIconUrl : this.iconUrl;
    },
  },
  mounted() {
    this.isActive = this.selected;
  },
};
</script>

<style scoped>
.tab {
  width: 100%;
  height: 100%;
}
</style>