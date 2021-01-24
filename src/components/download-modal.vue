<template>
  <modal name="download-modal" classes="modal-body" @before-open="initData">
    <table>
      <tr>
        <th>缩放倍率</th>
        <th>图像大小</th>
        <th>文件名</th>
        <th>文件类型</th>
      </tr>
      <tr>
        <td>
          <input
            v-model="scale100"
            type="number"
            min="0"
            oninput="validity.valid||(value='');"
          />
          %
        </td>
        <td>{{ width }}×{{ height }}</td>
        <td><input type="text" v-model="fileName" /></td>
        <td>
          <select v-model="fileType">
            <option value="jpg">.jpg</option>
            <option value="png">.png</option>
            <option value="svg">.svg</option>
          </select>
        </td>
      </tr>
    </table>
    <div class="button-group">
      <button @click="downloadImg('download')">下载到本地</button>
      <button @click="downloadImg('tab')">新窗口打开</button>
    </div>
  </modal>
</template>

<script>
export default {
  name: "downloadModal",
  data() {
    return {
      svgElem: null,
      scale100: 300,
      originWidth: 0,
      originHeight: 0,
      fileName: "flowchart",
      fileType: "jpg",
    };
  },
  computed: {
    width() {
      return parseInt(this.originWidth * this.scale);
    },
    height() {
      return parseInt(this.originHeight * this.scale);
    },
    paddingWidth() {
      return 48 * this.scale;
    },
    scale() {
      return Math.abs(this.scale100) / 100;
    },
  },
  methods: {
    initData(evt) {
      this.svgElem = evt.params;
      this.originWidth = this.svgElem.getAttribute("width");
      this.originHeight = this.svgElem.getAttribute("height");
    },
    downloadImg(method) {
      let canvas = document.createElement("canvas"),
        ctx = canvas.getContext("2d");
      ctx.canvas.width = this.width + 2 * this.paddingWidth;
      ctx.canvas.height = this.height + 2 * this.paddingWidth;
      let data = new XMLSerializer().serializeToString(this.svgElem);
      let DOMURL = window.URL || window.webkitURL || window;

      let img = new Image();
      let svgBlob = new Blob([data], { type: "image/svg+xml;charset=utf-8" });
      let url = DOMURL.createObjectURL(svgBlob);

      img.onload = () => {
        ctx.drawImage(
          img,
          this.paddingWidth,
          this.paddingWidth,
          this.width,
          this.height
        );
        DOMURL.revokeObjectURL(url);
        let imgURI = canvas.toDataURL("image/" + this.fileType);
        if (method == "download") {
          this.triggerDownload(imgURI);
        } else if (method == "tab") {
          this.openInNewTab(imgURI);
        }
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
      a.setAttribute("download", this.fileName + "." + this.fileType);
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
$bk-color: #44475a;
$bk-color-lighter-1: #5d6178;
$bk-color-lighter-2: #8186a0;
$bk-color-darder: #282a36;
.modal-body {
  background-color: $bk-color !important;
  color: white;
  text-align: center;
  padding: 2rem;
  display: flex;
  justify-content: space-around;
  flex-direction: column;
  table {
    line-height: 2rem;
    table-layout: fixed;
    width: 100%;
    input {
      text-align: center;
      background-color: $bk-color-darder;
      color: white;
      border: 0 {
        radius: 0;
      }
      padding: 0.2rem;
      outline: 0;
      width: 2.5rem;
      font-size: 1rem;
      &::-webkit-inner-spin-button,
      &::-webkit-outer-spin-button {
        display: none;
      }
      &[type="text"] {
        width: 5rem;
      }
    }
    select {
      background-color: $bk-color-lighter-1;
      padding: 0.2rem;
      color: white;
      outline: none;
      border: none;
      font-size: 1rem;
      -webkit-appearance: button;
      appearance: button;
      &:hover {
        background-color: $bk-color-lighter-2;
      }
    }
  }
  .button-group {
    display: flex;
    justify-content: space-around;
    button {
      color: white;
      padding: 0.65em 2em;
      border: none;
      outline: none;
      background-color: $bk-color-lighter-1;
      &:hover {
        background-color: $bk-color-lighter-2;
      }
    }
  }
}
</style>