<template>
  <div class="card" style="margin: 10px;">
    <div class="card-content">
        <div  style="font-weight: bold; margin-left: 10px">Weekly Claim Amount - Customers
        </div>
       
    <div class="card-content">
      <vue-apex-charts ref="barChart" type="bar" width="480" :options="chartOptions" :series="series"></vue-apex-charts>
    </div>
  </div>
  </div>
</template>
  
<script>
import VueApexCharts from "vue-apexcharts";
import NetworkManager from "@/network";



export default {
  name: "WeeklyClaimAmountBarChart",
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
          width: 480,
          type: 'bar',
          toolbar: {
        show: false
        },
        },
        colors: ['#7A57D5'],
        xaxis: {
          categories: [],
          title: {
            text: 'week'
          }
        },
        yaxis: {
          title: {
            text: 'Number of Allowances'
          }
        },
        dataLabels: {
              enabled: false // set this to false to remove the data labels
            },
      },
    }
  },

  methods: {
    loadData: function () {
      const self = this
      NetworkManager.apiRequest('api/DFDashboard/custom-claimed-amount', {}, function (e) {
        if (e.statusCode === 200) {
          self.series = [{
            name: 'Amount',
            data: e.data.claimed_amount
          }]
          self.$refs.barChart.updateOptions({
            xaxis: {
              categories: e.data.day,
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
  
<style scoped></style>
  