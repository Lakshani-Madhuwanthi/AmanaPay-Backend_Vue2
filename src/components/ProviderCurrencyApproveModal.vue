<template>

  <b-modal v-model="modelVisible" :width="450" scroll="keep" animation="zoom-out" :can-cancel="false">
    <div class="model-card">

      <header class="modal-card-head">
        <p class="modal-card-title">{{ modelHeader.type }}<b-tag :type="modelHeader.tagClass" style="margin-left: 10px">{{ modelHeader.tag }}</b-tag></p>
        <button @click="$emit('close-modal')" type="button" class="delete"></button>
      </header>

      <div class="modal-card-body" style="max-height: 50vh; overflow-y: auto">
        <b-table
            :data="newRecord"
        >

          <b-table-column field="currency_code" label="Currency Code" sortable v-slot="props">
            {{ props.row.currency_code }}
          </b-table-column>
          <b-table-column field="transaction_rate" label="Transaction Rate" sortable v-slot="props">
            <div>{{ props.row.transaction_rate }}</div>
            <div v-if="oldRecord[props.index].transaction_rate !== props.row.transaction_rate" class="old-value">{{ oldRecord[props.index].transaction_rate }}</div>
          </b-table-column>
          <b-table-column field="settlement_rate" label="Settlement Rate" sortable v-slot="props">
            <div>{{ props.row.settlement_rate }}</div>
            <div v-if="oldRecord[props.index].settlement_rate !== props.row.settlement_rate" class="old-value">{{ oldRecord[props.index].settlement_rate }}</div>
          </b-table-column>
          <b-table-column field="disable" label="Status" sortable v-slot="props">
            <div>{{ props.row.disabled === 0 ? 'Active' : 'Inactive' }}</div>
            <div v-if="oldRecord[props.index].disabled !== props.row.disabled" class="old-value">{{ oldRecord[props.index].disabled === 0 ? 'Active' : 'Inactive' }}</div>
          </b-table-column>

        </b-table>
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
// import ChangeRequestStringComparisonItem from "@/components/ChangeRequestStringComparisonItem"
// import ChangeRequestStringArrayComparisonItem from "@/components/ChangeRequestStringArrayComparisonItem"
// import ChangeRequestImageComparisonItem from "@/components/ChangeRequestImageComparisonItem"
// import ChangeRequestImageArrayComparisonItem from "@/components/ChangeRequestImageArrayComparisonItem"

export default {
  name: "ChangeRequestApproveModal",
  components: {  },
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
      },

      newRecord: [],
      oldRecord: [],
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

  },

  mounted() {

  },

  watch: {
    isVisible: function (newVal) // this is watching changes for 'isVisible' prop
    {
      this.modelVisible = newVal
    },

    changeRequest: function (newVal){
      this.newRecord = newVal ? newVal.newRecord.currencies : []
      this.oldRecord = newVal ? newVal.originalRecord.currencies : []

      console.log(this.newRecord)
      console.log(this.oldRecord)
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
