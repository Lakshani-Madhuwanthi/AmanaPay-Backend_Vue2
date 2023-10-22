<template>

  <b-modal v-model="modelVisible" :width="450" scroll="keep" animation="zoom-out" :can-cancel="false">
    <div class="model-card">

      <header class="modal-card-head">
        <p class="modal-card-title">{{ modelHeader.type }}<b-tag :type="modelHeader.tagClass" style="margin-left: 10px">{{ modelHeader.tag }}</b-tag></p>
        <button @click="$emit('close-modal')" type="button" class="delete"></button>
      </header>

      <div class="modal-card-body" style="max-height: 50vh; overflow-y: auto">
        <div class="content pt-2">
          <div v-for="field in fields" :key="field.id">
            <div v-if="field.newValue.type === 'STRING'">
              <change-request-string-comparison-item
                  :header="field.header"
                  :new-value="field.newValue"
                  :old-value="field.oldValue" >
              </change-request-string-comparison-item>
            </div>
            <div v-if="field.newValue.type === 'STRING_ARRAY'">
              <change-request-string-array-comparison-item
                  :header="field.header"
                  :new-value="field.newValue"
                  :old-value="field.oldValue" >
              </change-request-string-array-comparison-item>
            </div>
            <div v-if="field.newValue.type === 'IMAGE'">
              <change-request-image-comparison-item
                  :header="field.header"
                  :new-value="field.newValue"
                  :old-value="field.oldValue" >
              </change-request-image-comparison-item>
            </div>

            <div v-if="field.newValue.type === 'IMAGE_ARRAY'">
              <change-request-image-array-comparison-item
                  :header="field.header"
                  :new-value="field.newValue"
                  :old-value="field.oldValue" >
              </change-request-image-array-comparison-item>
            </div>
          </div>
        </div>

      </div>

      <footer class="modal-card-foot">
        <div class="is-full column py-0 px-0">
          <div class="column">
            <div class="columns">
              <div class="column"></div>
              <div class="buttons">
                <b-button
                    type="is-primary is-small" @click="$emit('approve-or-reject', 'approve')" :loading="isLoading" >Approve</b-button>
                <b-button
                    type="is-danger is-small" @click="$emit('approve-or-reject', 'reject')" :loading="isLoading" >Reject</b-button>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  </b-modal>
</template>

<script>
import ChangeRequestStringComparisonItem from "@/components/ChangeRequestStringComparisonItem"
import ChangeRequestStringArrayComparisonItem from "@/components/ChangeRequestStringArrayComparisonItem"
import ChangeRequestImageComparisonItem from "@/components/ChangeRequestImageComparisonItem"
import ChangeRequestImageArrayComparisonItem from "@/components/ChangeRequestImageArrayComparisonItem"

export default {
  name: "ChangeRequestApproveModal",
  components: { ChangeRequestStringComparisonItem, ChangeRequestStringArrayComparisonItem,
    ChangeRequestImageComparisonItem, ChangeRequestImageArrayComparisonItem },
  props: ['changeRequest', 'isVisible', 'filterOut', 'isLoading'],
  emits: ['close-modal', 'approve-or-reject'],

  data() {
    return {
      modelVisible: false,
      fields: [],
      pendingActions: {
        'CREATE': 'is-success',
        'EDIT': 'is-warning',
        'DELETE': 'is-danger'
      }
    }
  },

  computed: {
    modelHeader(){
      let type =   ''
      let tag = ''
      let tagClass = 'is-light '

      if(this.changeRequest !== undefined && this.changeRequest !== null){
        type = this.changeRequest.type
        tag = this.changeRequest.pendingAction
        tagClass += this.pendingActions[tag]
      }

      return {type: type, tag: tag, tagClass: tagClass}
    }
  },

  methods: {
    manipulateData: function (){
      const self = this
      this.fields = []

      if(this.changeRequest !== undefined && this.changeRequest !== null){
        const newRecord = this.changeRequest.newRecord
        const originalRecord = this.changeRequest.originalRecord

        const output = Object.entries(newRecord).map(([key, value]) => ({key,value}))

        output.forEach(function (item){
          let data = {
            header: newRecord[item.key].header,
            newValue: newRecord[item.key],
            oldValue: (originalRecord !== undefined && originalRecord !== null) ? originalRecord[item.key] : undefined
          }

          if(!self.excludeFromList(item.key)) self.fields.push(data)
        })
      }
    },

    excludeFromList: function (key){
      if(this.filterOut !== null && this.filterOut !== undefined){
        for (let i = 0; i < this.filterOut.length; i++){
          if(key === this.filterOut[i]){
            return true
          }
        }

        return false
      }
    }
  },

  mounted() {

  },

  watch: {
    isVisible: function (newVal) // this is watching changes for 'isVisible' prop
    {
      this.modelVisible = newVal
    },

    changeRequest: function (){
      this.manipulateData()
    }
  }
}
</script>

<style scoped>

</style>
