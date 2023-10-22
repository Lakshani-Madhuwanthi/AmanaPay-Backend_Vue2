<template>
  <div>
    <div class="card" style="margin-left: 10px; margin-right: 10px">
      <div class="card-content" style="padding: 5px!important;">
        <div class="columns">
          <div class="column is-two-fifths">
            <p>Total no of Remittance transactions <span style="margin-left: 10px; color: blue">{{tranData.ceftTransactions}}</span></p>
          </div>
          <div class="column">
            <p>Total Value of Remittance transactions (LKR) <span style="margin-left: 10px; color: blue">{{tranData.totalCeftValueLKR}}</span></p>
          </div>
        </div>
      </div>
    </div>

    <div class="section">
      <div class="columns">
        <div class="column">
          <div class="card">
            <div class="card-content">
              <div style="height: 100px">
                <img
                    style="height: 50px"
                    src="../../../assets/Dashboard/ceft.png"
                />
                <div style="font-weight: bold; font-size: 12px">Total Number of Remittances</div>
                <div style="font-weight: bold; font-size: 18px">{{tranData.ceftTransactions}}</div>
              </div>
            </div>
          </div>
        </div>

        <div class="column">
          <div class="card">
            <div class="card-content">
              <div style="height: 100px">
                <img
                    style="height: 50px"
                    src="../../../assets/Dashboard/bill.png"
                />
                <div style="font-weight: bold; font-size: 12px">Total Number of Bill Payments</div>
                <div style="font-weight: bold; font-size: 18px">{{tranData.billTransactions}}</div>
              </div>
            </div>
          </div>
        </div>

        <div class="column">
          <div class="card">
            <div class="card-content">
              <div style="height: 100px">
                <img
                    style="height: 50px"
                    src="../../../assets/Dashboard/echannelling.png"
                />
                <div style="font-weight: bold; font-size: 12px">Total Number of EChannelling</div>
                <div style="font-weight: bold; font-size: 18px">{{tranData.ecTransactions}}</div>
              </div>
            </div>
          </div>
        </div>

        <div class="column">
          <div class="card">
            <div class="card-content">
              <div style="height: 100px">
                <img
                    style="height: 50px"
                    src="../../../assets/Dashboard/thyaga.png"
                />
                <div style="font-weight: bold; font-size: 12px">Total Number of Thyaga</div>
                <div style="font-weight: bold; font-size: 18px">{{tranData.thyagaTransactions}}</div>
              </div>
            </div>
          </div>
        </div>

        <div class="column">
          <div class="card">
            <div class="card-content">
              <div style="height: 100px">
                <img
                    style="height: 50px"
                    src="../../../assets/Dashboard/appusers.png"
                />
                <div style="font-weight: bold; font-size: 12px">Total Number of App Users</div>
                <div style="font-weight: bold; font-size: 18px">{{tranData.appUsers}}</div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import NetworkManager from "@/network";

export default {
  name: "TransactionCounts",
  data(){
    return {
      tranData: {
        ceftTransactions: 0.0 ,
        billTransactions: 0.0 ,
        thyagaTransactions: 0.0 ,
        ecTransactions: 0.0 ,
        appUsers: 0.0 ,
        totalCeftValueLKR: 0.0 ,
      }
    }
  },

  methods: {
    loadData: function (){
      const self = this

      NetworkManager.apiRequest('api/DFDashboard/totalCountsAndValues', {}, function (e){
        if(e.statusCode === 200){
          self.tranData = e.data
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

<style scoped>

</style>
