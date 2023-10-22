<template>
  <div class="card" style="margin: 10px;">
    <div class="card-content">
      <vue-apex-charts ref="pieChart" type="pie" width="380" :options="chartOptions" :series="series"></vue-apex-charts>
    </div>
  </div>
</template>

<script>
import VueApexCharts from "vue-apexcharts";
import NetworkManager from "@/network";

export default {
  name: "TransactionPercentagePieChart",
  components: {
    VueApexCharts: VueApexCharts,
  },
  data() {
    return {

      series: [],
      chartOptions: {
        chart: {
          width: 380,
          type: 'pie',
        },
        title: {
          text: 'Overall Transactions',
          align: 'left'
        },
        labels: [],
        responsive: [{
          breakpoint: 480,
          options: {
            chart: {
              width: 200
            },
            legend: {
              position: 'bottom'
            }
          }
        }]
      },
    }
  },

  methods: {
    loadData: function (){
      const self = this

      NetworkManager.apiRequest('api/DFDashboard/overallTransactionCounts', {}, function (e){
        if(e.statusCode === 200){
          self.series = e.data.counts
          self.$refs.pieChart.updateOptions({
            labels: e.data.categories,
          })
        }
        else {
          //
        }
      })
    },
  },

  mounted() {
    this.loadData()
  }

}
</script>

<style scoped>

</style>
