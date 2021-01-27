<template>
  <div class="edit-wrapper">
    <div id="editor" class="editor" style="width: 100%" rows="11"></div>
  </div>
</template>

<script>
import debounce from "../assets/js/utils";

export default {
  name: "codeEditor",
  data() {
    return {
      editor: null,
    };
  },
  props: {
    editorSize: Array,
  },
  watch: {
    editorSize: function () {
      this.editor.resize();
    },
  },
  mounted() {
    let editorDiv = document.getElementById("editor");
    window.ace.config.set(
      "basePath",
      "https://cdnjs.cloudflare.com/ajax/libs/ace/1.4.12/"
    );
    this.editor = window.ace.edit(editorDiv);
    this.editor.setOptions({
      theme: "ace/theme/dracula",
      mode: "ace/mode/javascript",
      fontSize: "14pt",
      wrap: true,
    });
    this.editor.resize();
    this.editor.getSession().on("change", debounce(this.onCodeChange, 200));
    this.onCodeChange();
  },
  methods: {
    onCodeChange() {
      this.$emit("code-change", this.editor.getValue());
    },
  },
};
</script>

<style lang="scss">
.edit-wrapper {
  height: 100%;
  .editor {
    height: 100% !important;
  }
}
</style>