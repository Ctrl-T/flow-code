<template>
  <modal
    name="download-modal"
    classes="modal-body"
    @before-open="initData"
    height="400"
    adaptive
  >
    <h3>导出</h3>
    <div class="quit-btn" @click="hide">
      <i class="iconfont icon-close"></i>
    </div>
    <div class="grid-container">
      <div>
        <div>缩放倍率</div>
        <div>
          <input
            v-model="scale100"
            type="number"
            min="0"
            oninput="validity.valid||(value='');"
          />
          %
        </div>
      </div>
      <div>
        <div>图像大小</div>
        <div>
          {{ width + 2 * paddingWidth }}×{{ height + 2 * paddingWidth }}
        </div>
      </div>
      <div>
        <div>文件名</div>
        <div><input type="text" v-model="fileName" /></div>
      </div>
      <div>
        <div>文件类型</div>
        <div>
          <select v-model="fileType">
            <option v-for="type in FILE_TYPES" :value="type" :key="type.id">
              .{{ type.name }}
            </option>
          </select>
        </div>
      </div>
      <div>
        <div>边缘宽度</div>
        <div>
          <input
            v-model="originPaddingWidth"
            type="number"
            min="0"
            oninput="validity.valid||(value='');"
          />
        </div>
      </div>
      <div>
        <div>透明背景</div>
        <div>
          <input
            v-model="bkgTransparent"
            :disabled="fileType ? !fileType.allowNoBkg : true"
            type="checkbox"
          />
        </div>
      </div>
    </div>
    <div class="button-group">
      <button @click="downloadImg(triggerDownload)">下载到本地</button>
      <button @click="downloadImg(openInNewTab)">新窗口打开</button>
    </div>
  </modal>
</template>

<script>
export default {
  name: "downloadModal",
  data() {
    return {
      svgElem: null,
      scale100: 500,
      originWidth: 0,
      originHeight: 0,
      fileName: "flowchart",
      fileType: null,
      bkgTransparent: false,
      originPaddingWidth: 48,
    };
  },
  beforeCreate() {
    this.FILE_TYPES = {
      JPG: { name: "jpeg", allowNoBkg: false },
      PNG: { name: "png", allowNoBkg: true },
      SVG: { name: "svg", allowNoBkg: true },
    };
  },
  watch: {
    fileType: function (newVal) {
      this.bkgTransparent = newVal.allowNoBkg;
    },
  },
  computed: {
    width() {
      return parseInt(this.originWidth * this.scale);
    },
    height() {
      return parseInt(this.originHeight * this.scale);
    },
    paddingWidth() {
      return this.originPaddingWidth * this.scale;
    },
    scale() {
      return Math.abs(this.scale100) / 100;
    },
  },
  methods: {
    hide() {
      this.$modal.hide("download-modal");
    },
    initData(evt) {
      this.svgElem = evt.params;
      this.originWidth = this.svgElem.getAttribute("width");
      this.originHeight = this.svgElem.getAttribute("height");
      this.fileType = this.FILE_TYPES.JPG;
    },
    downloadImg(method) {
      let canvas = document.createElement("canvas"),
        ctx = canvas.getContext("2d");
      canvas.width = this.width + 2 * this.paddingWidth;
      canvas.height = this.height + 2 * this.paddingWidth;
      if (!this.bkgTransparent) {
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      let data = new XMLSerializer().serializeToString(this.svgElem);
      let DOMURL = window.URL || window.webkitURL || window;

      let svgBlob = new Blob([data], { type: "image/svg+xml;charset=utf-8" });
      let url = DOMURL.createObjectURL(svgBlob);
      if (this.fileType == this.FILE_TYPES.SVG) {
        method(url);
        return;
      }
      let img = new Image();
      img.onload = () => {
        ctx.drawImage(
          img,
          this.paddingWidth,
          this.paddingWidth,
          this.width,
          this.height
        );
        DOMURL.revokeObjectURL(url);
        let imgURI = canvas.toDataURL("image/" + this.fileType, 1);
        method(imgURI);
      };
      img.src = url;
    },
    triggerDownload(imgURI) {
      let evt = new MouseEvent("click", {
        view: window,
        bubbles: false,
        cancelable: true,
      });

      let a = document.createElement("a");
      a.setAttribute("download", this.fileName + "." + this.fileType.name);
      a.setAttribute("href", imgURI);
      a.setAttribute("target", "_blank");

      a.dispatchEvent(evt);
    },
    openInNewTab(imgURI) {
      let w = window.open("");
      let newTabImg = new Image();
      newTabImg.src = imgURI;
      w.document.body.appendChild(newTabImg);
    },
  },
};
</script>

<style lang="scss">
@import "../assets/css/dark-theme.scss";

.modal-body {
  background-color: $bk-pop-clr !important;
  color: $txt-head-clr;
  text-align: center;
  padding: 2rem;
  .quit-btn {
    position: absolute;
    right: 1rem;
    top: 1rem;
    cursor: default;
    color: $txt-clr;
    &:hover {
      color: $txt-head-clr;
    }
  }
  .grid-container {
    line-height: 2rem;
    display: grid;
    grid: {
      template-columns: repeat(3, 1fr);
      template-rows: repeat(2, 1fr);
      auto-flow: column;
      // row-gap: 1.5rem;
    }
    & > div {
      padding: 1rem 0;
      &:hover {
        background-color: $bk-hint-clr;
      }
    }
    input {
      text-align: center;
      width: 2.5rem;
      @import "../assets/css/input.scss";
      &[type="text"] {
        width: 5rem;
      }
    }
    select {
      background-color: $bk-active-clr;
      padding: 0.2rem;
      color: $txt-head-clr;
      outline: none;
      border: none;
      font-size: 1rem;
      -webkit-appearance: button;
      appearance: button;
      &:hover {
        background-color: $bk-hover-clr;
      }
    }
  }
  display: flex;
  justify-content: space-around;
  flex-direction: column;
  .button-group {
    display: flex;
    justify-content: space-around;
    padding: 2rem 0;
    button {
      color: $txt-head-clr;
      padding: 0.65em 2em;
      border: none;
      outline: none;
      background-color: $bk-active-clr;
      &:hover {
        background-color: $bk-hover-clr;
      }
    }
  }
}
</style>