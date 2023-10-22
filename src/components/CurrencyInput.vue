<template>
  <b-field :label="label"
           :label-position="labelPosition"
           :type="type"
           :message="message">
    <b-input :maxlength="maxLength" @keydown.native="onKeyDown" @blur="$emit('on-blur')" :value="inputValue" :disabled="disabled"></b-input>
  </b-field>
</template>

<script>
export default {
  name: "CurrencyInput",
  props: ['value', 'label', 'labelPosition', 'type', 'message', 'disabled', 'decimals', 'maxLength'],
  emits: ['on-blur'],
  data(){
    return {
      inputValue: 0.0,
      newValue: '0',
      numRegex: /\d/
    }
  },

  watch: {
    inputValue(newVal, oldVal){
      this.$emit('input', this.inputValue)
    }
  },

  methods: {
    onKeyDown: function (e){
      const self = this
      e.preventDefault()

      if(e.key !== 'Backspace'){

        if(self.numRegex.test(e.key)){
          const val = 10 ** self.decimals

          self.newValue += e.key
          let x = (self.newValue * 1) / val
          let y = x.toFixed(self.decimals)

          self.inputValue = self.numberWithCommas(y)
        }
      }
      else {
        self.newValue = '0'
        let x = self.newValue * 1
        let y = x.toFixed(self.decimals)

        self.inputValue = self.numberWithCommas(y)
      }
    },

    numberWithCommas: function (x) {
      let y = x.toString().split('.')
      let z = y[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",")

      return z + '.' + y[1]
    }
  },

  mounted() {
    this.inputValue = this.value
    this.newValue = this.value + ''

    if(!this.decimals) this.decimals = 2
    if(!this.maxLength) this.maxLength = 10
  }
}
</script>

<style scoped>

</style>
