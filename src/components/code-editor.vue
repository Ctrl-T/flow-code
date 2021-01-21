<template>
  <div class="edit-wrapper">
    <div id="editor" class="editor" style="width: 100%" rows="11"></div>
  </div>
</template>

<script>
import debounce from "../assets/utils"
import Lexer from "../assets/parser/lexer";
import Parser from "../assets/parser/parser";
import Intepreter from "../assets/interpreter/interpreter";

export default {
  name: "codeEditor",
  data() {
      return {
          editor: null
      }
  },
  mounted() {
    let editorDiv = document.getElementById("editor");
    window.ace.config.set(
      "basePath",
      "https://cdn.bootcdn.net/ajax/libs/ace/test/"
    );
    this.editor = window.ace.edit(editorDiv);
    this.editor.setOptions({
      theme: "ace/theme/dracula",
      mode: "ace/mode/javascript",
      fontSize: "14pt",
      wrap: true
    });
    this.editor.resize();
    this.editor.getSession().on("change", debounce(this.onCodeChange, 200));
    this.onCodeChange();
  },
  methods: {
      onCodeChange() {
      let lexer = new Lexer(this.editor.getValue());
      let parser = new Parser(lexer);
      let interperter = new Intepreter(parser);
      this.$emit("code-change", interperter.interpret())
      }
  }
};
</script>

<style>
.edit-wrapper {
  height: 100%;
}
.editor {
    height: 100% !important;
}
</style>