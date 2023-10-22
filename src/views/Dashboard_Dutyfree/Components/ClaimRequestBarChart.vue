<template>
  <div class="card" style="margin: 10px;">
    <div class="card-content">
        <div class="column is-two-thirds" style="font-weight: bold; margin-left: 10px">Claim Request Accept or Not
          Responding</div>
      </div>
      <div class="card-content">
      <vue-apex-charts ref="barChart" type="bar" width="600" :options="chartOptions" :series="chartSeries"></vue-apex-charts>
    </div>
  </div>
  
</template>
  
<script>
import VueApexCharts from "vue-apexcharts";
import NetworkManager from "@/network";


export default {
  name: "ClaimRequestBarChart",
  components: {
    VueApexCharts: VueApexCharts,
  },
  data() {
    return {
      chartSeries: [],
      chartOptions: {
        chart: {
          height: 500,
          type: 'bar',
          toolbar: {
            show: false // hide the toolbar
          }
        },
        dataLabels: {
          enabled: false
        },
        colors: ['#48C88F', '#B89404', '#E11A29'],
        columnWidth: 0.6,
        legend: {
          position: 'left',
        },
        plotOptions: {
          bar: {
            columnWidth: "40%",
            dataLabels: {
              position: 'top', // top, center, bottom
            }
        }
      },
      xaxis: {
        categories: []

      },
      yaxis: {
        title: {
          text: 'No of Request'
        }
      }
    },
    }
},

methods: {
  loadData: function() {
  const self = this;

  NetworkManager.apiRequest("api/DFDashboard/bank-total-request", {}, function(e) {
    if (e.statusCode === 200) {
      self.chartSeries = e.data.series.map((series) => ({
        name: series.name,
        data: series.data,
      }));

      // Extract the bankNames from the data property
      self.$refs.barChart.updateOptions({
            xaxis: {
              categories: e.data.bankNames,
            }
          })
        }
        else {
          //
        }
  });
},
},

  mounted() {
    this.loadData();
  },
}
</script>
  
<style scoped></style>
  