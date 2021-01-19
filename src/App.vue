<template>
  <div id="app">
    <div class="container">
      <header>
        <div class="logo">FlowCode</div>
      </header>
      <div id="main">
        <div id="input-pane">
          <div class="edit-wrapper">
            <div id="editor" class="editor" style="width: 100%" rows="11"></div>
          </div>
        </div>
        <div id="output-pane">
          <div id="diagram"></div>
        </div>
      </div>
    </div>

    <!-- <flowchart /> -->
  </div>
</template>

<script>
// import flowchart from "./components/flowchart.vue";
import Lexer from "./assets/parser/lexer";
import Parser from "./assets/parser/parser";
import Intepreter from "./assets/interpreter/interpreter";

window.onload = function () {
  let editorDiv = document.getElementById("editor");
  window.ace.config.set(
    "basePath",
    "https://cdn.bootcdn.net/ajax/libs/ace/test/"
  );
  let editor = window.ace.edit(editorDiv);
  editor.setOptions({
      theme: "ace/theme/monokai",
      mode: "ace/mode/javascript",
      fontSize: "14pt"
  })
//   editor.setTheme("ace/theme/monokai");
//   editor.getSession().setMode("ace/mode/javascript");
  editor.resize();
  editor.getSession().on("change", debounce(on_change, 200));
  on_change();
  function on_change() {
    let lexer = new Lexer(editor.getValue());
    let parser = new Parser(lexer);
    let interperter = new Intepreter(parser);
    let diagram = window.flowchart.parse(interperter.interpret());
    let diagramDiv = document.getElementById("diagram");
    diagramDiv.innerHTML = "";
    diagram.drawSVG(diagramDiv);
  }
  function debounce(func, wait, immediate) {
    var timeout;
    return function executedFunction() {
      var context = this;
      var args = arguments;
      var later = function () {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      var callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    };
  }
};

export default {
  name: "App",
  components: {
    // flowchart,
  },
};
</script>

<style>
#app {
}
html,
body {
  min-height: 100%;
  min-width: 100%;
  margin: 0;
}
#container {
  display: flex;
  flex-direction: column;
  height: 100vh;
}
header {
  flex: none;
  min-height: 2rem;
}
.logo {
    /* display: inline-block; */
    padding: 1rem;
    font-size: 1.5rem;
    line-height: 1.5rem;
}
#main {
  display: flex;
  flex: auto;
  flex-direction: row;
  min-height: 0.05rem;
  /* height: 100%; */
}
#input-pane {
  flex: auto;
  /* height: 100%; */
}
#output-pane {
  flex: auto;
}
#diagram > svg {
  margin: 2rem auto;
  display: block;
}
.edit-wrapper {
  /* height: 100%; */
}
.editor {
  height: calc(100vh - 3.5rem);
}
</style>
