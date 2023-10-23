<template>
  <b-field
      horizontal
      grouped>
    <template slot="label">{{ header }} <span class="has-text-danger">*</span></template>
    <b-field
        :type="versionData.major.class"
        :message="versionData.major.message">
      <b-input ref="major" @keydown.native="onKeyDown" @input="onInput(versionData.major.value, null)" placeholder="major" @blur="onBlur('major')" v-model="versionData.major.value" maxlength="4" ></b-input>
    </b-field>
    <p style="font-size: 25px; font-weight: bold">.</p>
    <b-field
        :type="versionData.minor.class"
        :message="versionData.minor.message">
      <b-input ref="minor" @keydown.native="onKeyDown" @input="onInput(versionData.minor.value, 'major')" placeholder="minor" @blur="onBlur('minor')" v-model="versionData.minor.value" maxlength="4" ></b-input>
    </b-field>
    <p style="font-size: 25px; font-weight: bold">.</p>
    <b-field
        :type="versionData.patch.class"
        :message="versionData.patch.message">
      <b-input ref="patch" @keydown.native="onKeyDown" @input="onInput(versionData.patch.value, 'minor')" placeholder="patch" @blur="onBlur('patch')" v-model="versionData.patch.value" maxlength="4" ></b-input>
    </b-field>
    <p style="font-size: 25px; font-weight: bold">+</p>
    <b-field
        :type="versionData.build.class"
        :message="versionData.build.message">
      <b-input ref="build" @keydown.native="onKeyDown" @input="onInput(versionData.build.value, 'patch')" placeholder="build" @blur="onBlur('build')" v-model="versionData.build.value" maxlength="4" ></b-input>
    </b-field>
  </b-field>
</template>

<script>
import {FieldValidator} from "@/helpers/validators/fieldValidator";

export default {
  name: "AppVersionInput",
  props: ['message', 'type', 'header'],
  emits: ['on-blur'],
  data(){
    return {
      versionData: {
        major: new FieldValidator(/\d/, 'Please enter a value'),
        minor: new FieldValidator(/\d/, 'Please enter a value'),
        patch: new FieldValidator(/\d/, 'Please enter a value'),
        build: new FieldValidator(/\d/, 'Please enter a value')
      },

      version: '',
      numRegex: /\d/
    }
  },

  watch: {
    versionData: {
      handler(){
        const self = this

        self.version = self.versionData.major.value + '.' + self.versionData.minor.value + '.' +
            self.versionData.patch.value + '+' + self.versionData.build.value

        self.$emit('input', self.version)
      },

      deep: true
    },

    type(newVal){
      const self = this

      if(newVal === 'is-danger'){
        self.validate()
      }
    }
  },

  methods: {
    validate: function (){
      const self = this
      let isValid = true

      Object.keys(self.versionData).forEach(function(key) {
        console.log(self.versionData[key].validate())
        if(!self.versionData[key].validate()) isValid = false
      })

      return isValid
    },

    onBlur(input){
      this.versionData[input].blur()
      this.$emit('on-blur')
    },

    onInput: function (val, ref){
      const self = this

      if(val === ''){
        if(ref !== null){
          self.$refs[ref].focus()
        }
      }
    },

    onKeyDown: function (e){
      const self = this

      if(e.key !== 'Backspace' && e.key !== 'Tab'){
        if(!self.numRegex.test(e.key)){
          e.preventDefault()
        }
      }
    }
  },

  mounted() {

  }
}
</script>

<style scoped>

</style>
