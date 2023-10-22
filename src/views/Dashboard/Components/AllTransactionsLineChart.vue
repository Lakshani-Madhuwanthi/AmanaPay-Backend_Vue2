<template>
  <div class="card" style="margin: 15px; height: 300px">
    <div class="card-content">
      <vue-apex-charts ref="lineChart" type="line" height="250" :options="chartOptions" :series="series"></vue-apex-charts>
    </div>
  </div>
</template>

<script>
import VueApexCharts from "vue-apexcharts";
import NetworkManager from "@/network";

export default {
  name: "AllTransactionsLineChart",
  components: {VueApexCharts},
  data() {
    return {

      series: [
      ],
      chartOptions: {
        chart: {
          height: 250,
          type: 'line',
          zoom: {
            enabled: false
          }
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          curve: 'straight'
        },
        title: {
          text: 'Transactions',
          align: 'left'
        },
        grid: {
          row: {
            colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
            opacity: 0.5
          },
        },
        xaxis: {
          categories: [],
        }
      },
    }
  },

  methods: {
    loadData: function (){
      const self = this

      NetworkManager.apiRequest('api/DFDashboard/getTotalTransactionsByMonth', {}, function (e){
        if(e.statusCode === 200){
          self.series = e.data.transactions
          self.$refs.lineChart.updateOptions({
            xaxis: {
              categories: e.data.monthNames,
            }
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
