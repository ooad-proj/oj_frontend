<template>
  <vue-frappe
    id="what"
    :labels="labels"
    type="line"
    :lineOptions="{ regionFill: 1 }"
    :height="height"
    :colors="['#009688']"
    :dataSets="dataStd"
    :discreteDomains="false"
    :axisOptions="{ xIsSeries: true }"
  >
  </vue-frappe>
</template>

<script>
export default {
  props: {
    height: Number
  },
  data() {
    return {
      labels : ["0","0"],
      dataStd: [
        {
          values: [0,0],
        },
      ],
    };
  },
};
</script>

<style>
</style>