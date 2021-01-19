<template>
  <div id="app">
    <div><textarea id="code" style="width: 100%" rows="11"> </textarea></div>
    <div><button id="run" type="button">Run</button></div>
    <flowchart />
  </div>
</template>

<script>
import flowchart from "./components/flowchart.vue";
import Lexer from "./assets/parser/lexer";
import Parser from "./assets/parser/parser";

window.onload = function () {
  let btn = document.getElementById("run"),
    cd = document.getElementById("code");

  btn.onclick = function () {
    let lexer = new Lexer(cd.value);
    let parser = new Parser(lexer);
    console.log(parser.parse());
  }
};

export default {
  name: "App",
  components: {
    flowchart,
  },
};
</script>

<style>
#app {
}
</style>
