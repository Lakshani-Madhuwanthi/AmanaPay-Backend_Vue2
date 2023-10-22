<template>
  <div class="columns">
    <div class="column is-half has-text-right">
      <p class="comparison-header">{{ header }} :</p>
    </div>
    <div class="column is-half has-text-left">
      <div>{{ newValue.value }}</div>
      <div v-if="((oldValue !== undefined && oldValue !== null) && oldValue.value !== newValue.value)" class="old-value">{{ oldValue.value }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ChangeRequestStringComparisonItem",
  props: ['header', 'newValue', 'oldValue'],
  data(){
    return {

    }
  },

  methods: {

  },

  mounted() {
    console.log(this.header)
  }
}
</script>

<style scoped>
  .comparison-header {
    font-weight: bold;
  }

  .old-value {
    color: #ff4d4d;
    text-decoration: line-through;
  }
</style>
