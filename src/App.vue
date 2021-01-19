<template>
  <div id="app">
    <div><textarea id="code" style="width: 100%" rows="11"> </textarea></div>
    <div><button id="run" type="button">Run</button></div>
    <div id="diagram"></div>
    <!-- <flowchart /> -->
  </div>
</template>

<script>
// import flowchart from "./components/flowchart.vue";
import Lexer from "./assets/parser/lexer";
import Parser from "./assets/parser/parser";
import Intepreter from "./assets/interpreter/interpreter"

window.onload = function () {
  let btn = document.getElementById("run"),
    editor = document.getElementById("code");

  btn.onclick = function () {
    let lexer = new Lexer(editor.value);
    let parser = new Parser(lexer);
    let interperter = new Intepreter(parser);
    let diagram = window.flowchart.parse(interperter.interpret());
    let diagramDiv = document.getElementById("diagram");
    diagramDiv.innerHTML = "";
    diagram.drawSVG(diagramDiv)
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
</style>
