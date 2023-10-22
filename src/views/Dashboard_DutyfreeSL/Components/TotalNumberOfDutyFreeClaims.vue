<template>
    <div>
        <div class="card" style="margin-left: 10px; margin-right: 10px">
      <div class="card-content" style="padding: 5px!important;">
        <div class="columns" style="padding: 10px">
          <div class="column is-two-fifths">
            <p><b>Total no of Remittance transactions <span style="margin-left: 10px; color: #7A57D5">{{dfClaim.tot_df_claims}}</span></b></p>
          </div>
          <div class="column">
            <p><b>Total Value of Remittance transactions (USD) <span style="margin-left: 10px; color: #7A57D5">{{dfClaim.value_df_claims}}</span></b></p>
          </div>
        </div>
      </div>
    </div>
    </div>
</template>

<script>
import NetworkManager from "@/network";


export default {
    name: "TotalNumberOfDutyFreeClaims",
    data() {
        return {
            dfClaim: {}
        }
    },

    methods: {
        loadData: function () {
            const self = this

            NetworkManager.apiRequest('api/DFDashboard/custom-df-claims', {}, function (e) {
                if (e.statusCode === 200) {
                    self.dfClaim = e.data
                }
                else {
                    //
                }
            })
        }
    },

    mounted() {
        this.loadData()
    }
}
</script>

<style></style>