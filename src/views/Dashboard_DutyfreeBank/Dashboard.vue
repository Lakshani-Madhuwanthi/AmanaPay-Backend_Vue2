<template>
    <div class="block">
    <div style=" overflow-y: auto; overflow-x: hidden">
      <div class="container" style="height: 78vh; width: 75vw;">

        <total-number-of-duty-free-claims></total-number-of-duty-free-claims>
        <range-of-duty-free-claims></range-of-duty-free-claims>
         <div class="columns">
          <div class="column">
            <range-of-duty-free-pie-chart></range-of-duty-free-pie-chart>
          </div>
          <div class="column">
            <weekly-claim-amount-bar-chart></weekly-claim-amount-bar-chart>
          </div>
        </div>
      </div>
    </div>
  </div>
    
</template>
<script>
import TotalNumberOfDutyFreeClaims from "@/views/Dashboard_DutyfreeBank/Components/TotalNumberOfDutyFreeClaims";
import RangeOfDutyFreePieChart from "@/views/Dashboard_DutyfreeBank/Components/RangeOfDutyFreePieChart";
import WeeklyClaimAmountBarChart from "@/views/Dashboard_DutyfreeBank/Components/WeeklyClaimAmountBarChart";
import RangeOfDutyFreeClaims from "@/views/Dashboard_DutyfreeBank/Components/RangeOfDutyFreeClaims"


export default{
    name: "Dashboard_DutyfreeBank",
    components:{
        TotalNumberOfDutyFreeClaims,
        RangeOfDutyFreePieChart,
        WeeklyClaimAmountBarChart,
        RangeOfDutyFreeClaims
    
    }
}
</script>
<style></style>