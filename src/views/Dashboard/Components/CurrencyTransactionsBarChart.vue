<template>
  <div class="card" style="margin: 10px;">
    <div class="card-content">
      <vue-apex-charts ref="barChart" type="bar" width="300" :options="chartOptions" :series="series"></vue-apex-charts>
    </div>
  </div>
</template>

<script>
import VueApexCharts from "vue-apexcharts";
import NetworkManager from "@/network";

export default {
  name: "CurrencyTransactionsBarChart",
  components: {
    VueApexCharts: VueApexCharts,
  },
  data() {
    return {

      series: [{
        name: 'Amount',
        data: []
      }],
      chartOptions: {
        chart: {
          height: 500,
          type: 'bar',
        },
        plotOptions: {
          bar: {
            dataLabels: {
              position: 'bottom', // top, center, bottom
            },
          }
        },
        xaxis: {
          categories: []
        },
        title: {
          text: 'Currency Transactions',
        }
      },
    }
  },

  methods: {
    loadData: function (){
      const self = this

      NetworkManager.apiRequest('api/DFDashboard/currencyWiseTransactionValues', {}, function (e){
        if(e.statusCode === 200){
          self.series = [{
            name: 'Amount',
            data: e.data.amounts
          }]
          self.$refs.barChart.updateOptions({
            xaxis: {
              categories: e.data.currencies
            },
          })
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
