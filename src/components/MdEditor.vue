<template>
  <div class=" tw-border tw-border-solid tw-rounded-md">
    <mavon-editor
      :value="value"
      @input="em"
      style="z-index: 0; border: none"
      :boxShadow="false"
      :subfield="true"
      :autofocus="false"
      :toolbars="toolbars"
      />
  </div>
</template>

<script>
export default {

  methods: {
    em(e) {
      this.$emit('input', e)
    }
  },
  props: ['value'],

  data() {
    return {
      // value: "",

      toolbars: {
        bold: true, // 粗体
        italic: true, // 斜体
        header: true, // 标题
        underline: true, // 下划线
        strikethrough: true, // 中划线
        mark: true, // 标记
        superscript: true, // 上角标
        subscript: true, // 下角标
        quote: true, // 引用
        ol: true, // 有序列表
        ul: true, // 无序列表
        link: true, // 链接
        imagelink: false, // 图片链接
        code: true, // code
        table: true, // 表格
        fullscreen: true, // 全屏编辑
        readmodel: true, // 沉浸式阅读
        htmlcode: true, // 展示html源码
        help: true, // 帮助
        undo: true, // 上一步
        redo: true, // 下一步
        trash: true, // 清空
        save: false, // 保存（触发events中的save事件）
        navigation: true, // 导航目录
        alignleft: true, // 左对齐
        aligncenter: true, // 居中
        alignright: true, // 右对齐
        subfield: true, // 单双栏模式
        preview: true, // 预览
      }
    };
  },
};
</script>

<style>
</style>