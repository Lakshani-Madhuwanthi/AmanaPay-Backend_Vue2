<template>
<div>
  <b-modal :can-cancel="false"
           has-modal-card
           trap-focus
           :destroy-on-hide="false"
           aria-role="dialog"
           aria-label="Example Modal"
           close-button-aria-label="Close"
           aria-modal>
    <div class="modal-card" style="height: 300px; width: 500px;">
      <header class="modal-card-head">
        <p class="modal-card-title"
           style="display: flex; justify-content: center; font-size: 16px; font-weight: bold;">
          {{message}}</p>
      </header>
      <section class="modal-card-body"
               style="display: flex; justify-content: center; align-items: center;">
        <b-icon
            :icon="type === 'is-success' ? 'check-circle' : 'close-circle'"
            :type="type"
            size="is-large">
        </b-icon>
      </section>
      <footer class="modal-card-foot" style="display: flex; justify-content: center;">
        <b-button type="is-primary" @click="navigateTo('dutyFreeRequests')">Done</b-button>
      </footer>
    </div>

  </b-modal>
</div>
</template>

<script>
export default {
  name: "PopUpMessage",
  props: ['is_active', 'type', 'message'],
  data(){
    return {
      modalActive: true
    }
  },

  watch: {
  },

  methods: {

  }
}
</script>

<style scoped>

</style>