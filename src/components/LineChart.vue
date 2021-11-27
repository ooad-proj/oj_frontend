<template>
  <vue-frappe
    id="what"
    :labels="labels"
    type="line"
    :lineOptions="{ regionFill: 1 }"
    :height="height"
    :colors="['#009688']"
    :dataSets="this.dataStd"
  >
  </vue-frappe>
</template>

<script>
export default {
  props: {
    labels: Array,
    data: Array,
    height: Number
  },
  data() {
    return {
      dataStd: [
        {
          values: this.data,
        },
      ],
    };
  },
};
</script>

<style>
</style>