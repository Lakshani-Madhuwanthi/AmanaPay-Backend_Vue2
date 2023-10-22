<template>
  <div class="columns">
    <div class="column is-half has-text-right">
      <p class="comparison-header">{{ header }} :</p>
    </div>
    <div class="column is-half has-text-left">
      <div>
        <p>New Image</p>
        <img type="is-primary is-light" style="max-height: 70px" :src="getImageUrl(newValue.value)"/>
      </div>
      <div v-if="(oldValue !== undefined && oldValue !== null && oldValue.value !== newValue.value)" class="old-value">
        <p>Old Image</p>
        <img type="is-primary is-light" style="max-height: 70px" :src="getImageUrl(oldValue.value)"/>
      </div>
    </div>
  </div>
</template>

<script>
import {appSettings} from "@/appSettings"

export default {
  name: "ChangeRequestImageComparisonItem",
  props: ['header', 'newValue', 'oldValue'],
  data(){
    return {

    }
  },
  methods: {
    getImageUrl(path){
      return appSettings.$api_url + "/" + path + "?" + new Date().getTime()
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
