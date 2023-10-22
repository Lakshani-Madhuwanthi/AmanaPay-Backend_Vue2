<template>
  <div>
    <b-modal :active.sync="modalActive" has-modal-card trap-focus :destroy-on-hide="false" aria-role="dialog"
      aria-label="Example Modal" close-button-aria-label="Close" aria-modal>
      <div class="modal-card">
        <header class="modal-card-head">
              <p class="modal-card-title has-text-centered">Notice of Disclaimer</p> 
              <button type="button" class="delete" @click="modalActive = false" />
            </header>
            <section class="modal-card-body">
              <p style="font-weight: bold;">Use at your own risk</p>
              <p>All information in the Service is provided "as is", with no guarantee of completeness, accuracy and timeliness or of the results obtained from the use of this information. Full responsibility for any risks associated with its use shall be with the User.</p><br>
              <p style="font-weight: bold;">No Liability for Damages</p>
              <p>LankaPay (Private) Limited and affiliates, officers, directors, employees, agents, agents and partners shall not be liable for the User or to any third party for any decision made or action taken in reliance of the information provided in the App or for any direct or indirect damages including but not limited to loss of data, business, revenue arising out of or in connection with the use of the App or any content or service through the App</p>
            <p style="font-weight: bold;">Third Party Content.</p><br>
              <p>The App may contain links to third-party websites, services, or content. LankaPay (Private) Limited do not endorse or assume any responsibility for the content or practices of these third-party sites. User’s interactions with third-party content or services are solely between the User and the third party, and LankaPay (Private) Limited shall not responsible for any damages or issues that may arise from such interactions.</p><br>
              <p style="font-weight: bold;">Indemnification.</p>
              <p>By using this App, the User agrees to indemnify and hold LankaPay (Private) Limited harmless from any claims, losses, liabilities, damages, costs, or expenses (including attorneys' fees) arising out of or related to the use of the App or any violation of these terms by the User.</p>
              <div style="display: flex; align-items: center; justify-content: center; flex-direction: column;" class="m-4">
                <img src="../assets/brand-logo.png" width="100px" alt="Lanka-pay">
                <p style="font-weight: bold;">LankaPay (Pvt) Ltd</p>
              </div>

        </section>

        <footer class="modal-card-foot is-flex is-justify-content-center">
          <button class="button is-success is-medium" label="Approve" @click="acceptTerms">Agree</button>
          <button class="button is-danger is-medium" label="Reject" @click="rejectTerms">Reject</button>
        </footer>
      </div>
    </b-modal>
  </div>
</template>

<script>
export default {
  name: 'termsAndConditions',
  props: {
    tcAccepted: Number, // Receive the prop tcAccepted
  },
  data() {
    return {
      modalActive: this.tcAccepted == 0 ,
    };
  },
  watch: {
  tcAccepted: function(newVal) {
    this.modalActive = newVal === 0;
  },
},
  methods: {
    acceptTerms() {
      console.log(this.modalActive);
      this.$emit("tcAccepted")
      this.modalActive = false;
    },
    rejectTerms() {
      this.$emit("tcRejected")
      this.modalActive = false;     
    },
  },
};
</script>
