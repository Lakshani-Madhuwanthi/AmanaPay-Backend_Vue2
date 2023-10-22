<template>
  <div class="block">
    <img
        style="height: 50px"
        src="../../assets/lanka_remit_logo.png"
    />
    <div style=" overflow-y: auto; overflow-x: hidden">
<!--      <div class="container" style="height: 78vh; width: 75vw;">-->

<!--        <transaction-counts></transaction-counts>-->

<!--        <div class="columns">-->
<!--          <div class="column">-->
<!--            <all-transactions-table></all-transactions-table>-->
<!--          </div>-->
<!--          <div class="column">-->
<!--            <all-transactions-line-chart></all-transactions-line-chart>-->
<!--          </div>-->
<!--        </div>-->

<!--        <div class="columns">-->
<!--          <div class="column">-->
<!--            <app-users-pie-chart></app-users-pie-chart>-->
<!--          </div>-->
<!--          <div class="column">-->
<!--            <currency-transactions-bar-chart></currency-transactions-bar-chart>-->
<!--          </div>-->
<!--        </div>-->

<!--        <div class="columns">-->
<!--          <transaction-percentage-pie-chart class="column"></transaction-percentage-pie-chart>-->
<!--        </div>-->
<!--      </div>-->
    </div>
  </div>
</template>

<script>

// import NumericPieChart from "@/views/Dashboard/Components/NumericPieChart"
// import NetworkManager from "@/network";
// import TransactionCounts from "@/views/Dashboard/Components/TransactionCounts";
// import AllTransactionsTable from "@/views/Dashboard/Components/AllTransactionsTable";
// import AllTransactionsLineChart from "@/views/Dashboard/Components/AllTransactionsLineChart";
// import AppUsersPieChart from "@/views/Dashboard/Components/AppUsersPieChart";
// import CurrencyTransactionsBarChart from "@/views/Dashboard/Components/CurrencyTransactionsBarChart";
// import TransactionPercentagePieChart from "@/views/Dashboard/Components/TransactionPercentagePieChart";

export default {
  name: "defaultDashboard",
  components: {

  },
  data() {
    return {
      transactionCounts: {
        data: [],
        labels: []
      },

      transactionValues: {
        data: [],
        labels: []
      }
    }
  },

  methods: {
    // loadCountChartData: function (e){
    //   const self = this
    //
    //   let data = {
    //     range: e
    //   }
    //
    //   NetworkManager.apiRequest('api/dashboard/tranCount', data, function (e){
    //     if(e.statusCode === 200){
    //       self.transactionCounts.data = e.data.tranCounts
    //       self.transactionCounts.labels = e.data.labels
    //     }
    //     else {
    //       //
    //     }
    //   })
    // },
    //
    // loadValueChartData: function (e){
    //   const self = this
    //
    //   let data = {
    //     range: e
    //   }
    //
    //   NetworkManager.apiRequest('api/dashboard/tranValue', data, function (e){
    //     if(e.statusCode === 200){
    //       self.transactionValues.data = e.data.tranValues
    //       self.transactionValues.labels = e.data.labels
    //     }
    //     else {
    //       //
    //     }
    //   })
    // }
  },

  mounted() {
    // this.loadValueChartData(7)
    // this.loadCountChartData(7)
  }
}
</script>

<style scoped>

</style>
