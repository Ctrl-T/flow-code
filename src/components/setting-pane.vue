<template>
  <div class="setting-pane">
    <div class="setting-item">
      <div>线宽</div>
      <div>
        <input type="number" min="0" oninput="validity.valid||(value='');" />
      </div>
    </div>
    <div class="setting-item">
      <div>字号</div>
      <div>
        <input type="number" min="0" oninput="validity.valid||(value='');" />
      </div>
    </div>
    <div class="setting-item">
      <div>“开始”框文字</div>
      <div>
        <input type="text" />
      </div>
    </div>
    <div class="setting-item">
      <div>“结束”框文字</div>
      <div>
        <input type="text" />
      </div>
    </div>
    <div class="setting-item">
      <div>“Yes”分支文字</div>
      <div>
        <input type="text" />
      </div>
    </div>
    <div class="setting-item">
      <div>“No”分支文字</div>
      <div>
        <input type="text" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "settingPane",
};
</script>

<style scoped lang="scss">
@import "../assets/css/dark-theme.scss";

.setting-pane {
  overflow: auto;
  background-color: $bk-clr;
  line-height: 2rem;
  color: $txt-clr;
  height: 100%;
  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
  .setting-item {
    padding: 1rem 2rem;
    &:hover {
      background-color: $bk-hint-clr;
    }
  }
  input {
    @import "../assets/css/input.scss";
  }
}
</style>