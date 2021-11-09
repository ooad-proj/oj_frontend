<template>
<div>
    <mavon-editor
      :value="value"
      style="z-index: 0; border: none"
      :boxShadow="false"
      :subfield="false"
      :defaultOpen="'preview'"
      :autofocus="false"
      :toolbarsFlag="false"
      :editable="false"
      :previewBackground="'#ffffff'"
    />
</div>
</template>

<script>
export default {
  props: {
    value: String
  }
}
</script>

<style>

</style>