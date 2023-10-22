<template>
<div>
    <div class="card" style="margin: 10px;">
            <div class="section">
                <div class="columns">
                    <div class="column is-three-quarters"></div>
                    <div class="column is-flex is-align-items-center">
                        <b-field style="margin-bottom: 0;">
                            <b-datepicker @input="loadData" v-model="dateRange"
                                :mobile-native="false" range>
                                <template v-slot:trigger>
                                    <div style="display: flex; align-items: center;">
                                        <span style="color:blueviolet; margin-right: 5px;"><b>Custom</b></span>
                                        <b-icon icon="calendar-month-outline" custom-color="blueviolet" aria-hidden="true"
                                            aria-label="Calendar icon" style="color:blueviolet;" />
                                    </div>
                                </template>
                            </b-datepicker>
                        </b-field>
                    </div>
                    <div class="column">
                        <b-dropdown @change="loadData" class="is-pulled-right"
                            v-model="selectedFilter" aria-role="list">
                            <template #trigger>
                                <b-button type="is-primary" size="is-small" icon-right="menu-down" outlined
                                    style="border: none; box-shadow: none; font-size: 14px;">
                                    <b>{{ selectedFilter.text }}</b>
                                </b-button>
                            </template>
                            <b-dropdown-item v-for="item in filters" :key="item.id" :value="item" aria-role="listitem">
                                <span>{{ item.text }}</span>
                            </b-dropdown-item>
                        </b-dropdown>
                    </div>

                </div>
                <div class="columns">
                    <div class="column">
                        <div class="card">
                            <div class="card-content">
                                <div style="height: 120px;">
                                    <div class="columns">
                                        <div class="column is-narrow">
                                            <img style="height: 50px" src="../../../assets/Dashboard_Dutyfree/Vector.png" />
                                        </div>
                                        <div class="column">
                                            <span style="font-weight: bold; font-size: 12px">Number of duty free
                                                claims</span>
                                        </div>
                                        <div class="column has-text-right">
                                            <span style="font-weight: bold; font-size: 18px; color: #7A57D5">{{
                                                claimData.tot_df_claims
                                            }}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="column">
                        <div class="card">
                            <div class="card-content">
                                <div style="height: 120px;">
                                    <div class="columns">
                                        <div class="column is-narrow">
                                            <img style="height: 50px"
                                                src="../../../assets/Dashboard_Dutyfree/Vector2.png" />
                                        </div>
                                        <div class="column">
                                            <span style="font-weight: bold; font-size: 12px">Number of invoices</span>
                                        </div>
                                        <div class="column has-text-right">
                                            <span style="font-weight: bold; font-size: 18px; color: #7A57D5">{{
                                                claimData.df_invoices
                                            }}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="column">
                        <div class="card">
                            <div class="card-content">
                                <div style="height: 120px;">
                                    <div class="columns">
                                        <div class="column is-narrow">
                                            <img style="height: 50px"
                                                src="../../../assets/Dashboard_Dutyfree/Vector3.png" />
                                        </div>
                                        <div class="column">
                                            <span style="font-weight: bold; font-size: 12px">Number of Duty Free
                                                Merchants</span>
                                        </div>
                                        <div class="column has-text-right">
                                            <span style="font-weight: bold; font-size: 18px; color: #7A57D5">{{
                                                claimData.df_merchant
                                            }}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


                <div class="columns">
                    <div class="column">
                        <div class="card">
                            <div class="card-content">
                                <div style="height: 120px">
                                    <div class="columns">
                                        <div class="column is-narrow">
                                            <img style="height: 50px"
                                                src="../../../assets/Dashboard_Dutyfree/Vector4.png" />
                                        </div>
                                        <div class="column">
                                            <span style="font-weight: bold; font-size: 12px">Value of Duty Free Claims(<span
                                                    style="color: #7A57D5">USD</span>)</span>
                                        </div>
                                        <div class="column has-text-right">
                                            <span style="font-weight: bold; font-size: 18px; color: #7A57D5">{{
                                                claimData.value_df_claims.toFixed(4) }}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="column">
                        <div class="card">
                            <div class="card-content">
                                <div style="height: 120px">
                                    <div class="columns">
                                        <div class="column is-narrow">
                                            <img style="height: 50px"
                                                src="../../../assets/Dashboard_Dutyfree/Vector5.png" />
                                        </div>
                                        <div class="column">
                                            <span style="font-weight: bold; font-size: 12px">Number of Approved Duty Free
                                                Allowance
                                                by Customs</span>
                                        </div>
                                        <div class="column has-text-right">
                                            <span style="font-weight: bold; font-size: 18px; color: #7A57D5">{{
                                                claimData.cutom_approved }}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="column">
                        <div class="card">
                            <div class="card-content">
                                <div style="height: 120px">
                                    <div class="columns">
                                        <div class="column is-narrow">
                                            <img style="height: 50px"
                                                src="../../../assets/Dashboard_Dutyfree/Vector6.png" />
                                        </div>
                                        <div class="column">
                                            <span style="font-weight: bold; font-size: 12px">Number of Rejected Duty Free
                                                Allowance
                                                by Customs</span>
                                        </div>
                                        <div class="column has-text-right">
                                            <span style="font-weight: bold; font-size: 18px; color: #7A57D5">{{
                                                claimData.cutom_rejected }}</span>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>

                </div>
                <div class="columns">
                    <div class="column">
                        <div class="card">
                            <div class="card-content">
                                <div style="height: 120px">
                                    <div class="columns">
                                        <div class="column is-narrow">
                                            <img style="height: 50px"
                                                src="../../../assets/Dashboard_Dutyfree/Vector7.png" />
                                        </div>
                                        <div class="column">
                                            <span style="font-weight: bold; font-size: 12px">Number of Claim Request to
                                                Bank</span>
                                        </div>
                                        <div class="column has-text-right">
                                            <span style="font-weight: bold; font-size: 18px; color: #7A57D5">{{
                                                claimData.no_df_claims }}</span>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="column">
                        <div class="card">
                            <div class="card-content">
                                <div style="height: 120px">
                                    <div class="columns">
                                        <div class="column is-narrow">
                                            <img style="height: 50px"
                                                src="../../../assets/Dashboard_Dutyfree/Vector8.png" />
                                        </div>
                                        <div class="column">
                                            <span style="font-weight: bold; font-size: 12px">Number of Pending Request to
                                                Bank</span>
                                        </div>
                                        <div class="column has-text-right">
                                            <span style="font-weight: bold; font-size: 18px; color: #7A57D5">{{
                                                claimData.no_pending }}</span>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="column">
                        <div class="card">
                            <div class="card-content">
                                <div style="height: 120px">
                                    <div class="columns">
                                        <div class="column is-narrow">
                                            <img style="height: 50px"
                                                src="../../../assets/Dashboard_Dutyfree/Vector9.png" />
                                        </div>
                                        <div class="column">
                                            <span style="font-weight: bold; font-size: 12px">Number of Bank in the
                                                System</span>
                                        </div>
                                        <div class="column has-text-right">
                                            <span style="font-weight: bold; font-size: 18px; color: #7A57D5">{{
                                                claimData.bank_count }}</span>
                                        </div>
                                    </div>


                                </div>
                            </div>
                        </div>
                    </div>

                </div>
                <div class="columns">
                    <div class="column">
                        <div class="card">
                            <div class="card-content">
                                <div style="height: 120px">
                                    <div class="columns">
                                        <div class="column is-narrow">
                                            <img style="height: 50px"
                                                src="../../../assets/Dashboard_Dutyfree/Vector10.png" />
                                        </div>
                                        <div class="column">
                                            <span style="font-weight: bold; font-size: 12px">Amount of Expired
                                                Allowances(<span style="color: #7A57D5">USD</span>)</span>
                                        </div>
                                        <div class="column has-text-right">
                                            <span style="font-weight: bold; font-size: 18px; color: #7A57D5">{{
                                                claimData.expired_allowance }}</span>
                                        </div>
                                    </div>


                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="column">
                        <div class="card">
                            <div class="card-content">
                                <div style="height: 120px">
                                    <div class="columns">
                                        <div class="column is-narrow">
                                            <img style="height: 50px"
                                                src="../../../assets/Dashboard_Dutyfree/Vector11.png" />
                                        </div>
                                        <div class="column">
                                            <span style="font-weight: bold; font-size: 12px">Eligible Amount of Claim</span>
                                        </div>
                                        <div class="column has-text-right">
                                            <span style="font-weight: bold; font-size: 18px; color: #7A57D5">{{
                                                claimData.claim_amount }}</span>
                                        </div>
                                    </div>


                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="column"></div>
                </div>
            </div>
        </div>
</div>
</template>

<script>
import NetworkManager from "@/network";

const today = new Date()
export default {
    name: "RangeOfDutyFreeClaims",
    data() {
        return {
            dateRange: [today, today],
            selectedFilter: { value: 365, text: 'Last Year' },
            filters: [
                { value: 7, text: 'This Week' },
                { value: 14, text: 'Last Two Weeks' },
                { value: 30, text: 'Last Month' },
                { value: 90, text: 'Last Three Months' },
                { value: 365, text: 'Last Year' },
                { value: 0, text: 'Custom' },
            ],
            claimData:{}
            
        }
    },
    watch: {
    dateRange(){
      this.selectedFilter = { value: 0, text: 'Custom' }
    },
  },

  methods: {
    formatDate: function (date) {
      let d = new Date(date),
          month = '' + (d.getMonth() + 1),
          day = '' + d.getDate(),
          year = d.getFullYear();

      if (month.length < 2)
        month = '0' + month;
      if (day.length < 2)
        day = '0' + day;

      return [year, month, day].join('-');
    },

    loadData: function (){
      const self = this

      setTimeout(() => {
        const data = {
          range: self.selectedFilter.value,
          fromDate: self.formatDate(self.dateRange[0]),
          toDate: self.formatDate(self.dateRange[1])
        }

        NetworkManager.apiRequest('api/DFDashboard/count-dutyfree-claims', data, function (e){
          if(e.statusCode === 200){
            self.claimData = e.data
          }
          else {
            //
          }
          
        })
      }, 200)
    }
  },

  mounted() {
    this.loadData()
  }
}
</script>