<template>
  <div class="columns">
    <div class="column is-half has-text-right">
      <p class="comparison-header">{{ header }} :</p>
    </div>
    <div class="column is-half has-text-left">
      <b-taglist>
        <b-tag v-for="value in newValue.value" :key="value.id" type="is-primary is-light">{{value}}</b-tag>
      </b-taglist>
      <b-taglist v-if="((oldValue !== undefined && oldValue !== null && !isArrayEqual(oldValue.value, newValue.value)))" class="old-value">
        <b-tag v-for="value in oldValue.value" :key="value.id" type="is-primary is-light">{{value}}</b-tag>
      </b-taglist>
    </div>
  </div>
</template>

<script>
export default {
  name: "ChangeRequestStringArrayComparisonItem",
  props: ['header', 'newValue', 'oldValue'],
  data(){
    return {

    }
  },
  methods: {
    isArrayEqual: function (arr1, arr2){
      let isEqual = true

      if(arr1.length !== arr2.length){
        isEqual = false
      }
      else {
        for(let i = 0; i < arr1.length; i++){
          if(arr1[i] !== arr2[i] ){
            isEqual = false
          }
        }
      }

      return isEqual
    }
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
