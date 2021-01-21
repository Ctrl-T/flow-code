<template>
  <div class="tab" v-show="isActive">
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
  },
  data() {
    return {
      isActive: false,
    };
  },
  computed: {
    href() {
      return "#" + this.name.toLowerCase().replace(/ /g, "-");
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