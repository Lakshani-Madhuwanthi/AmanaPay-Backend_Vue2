<template>
  <section class="app-main" style="margin: 0; width: 100%;">
    <transition name="fade-transform" mode="out-in">
      <div class="container" style="width: 100%;">
        <full-screen-loader></full-screen-loader>
        <router-view :key="key" />
      </div>
    </transition>
  </section>
</template>

<script>
import FullScreenLoader from "@/components/FullScreenLoader";
export default {
  name: 'AppMain',
  components: {FullScreenLoader},
  computed: {
    key() {
      return this.$route.path
    }
  }
}
</script>


<style>
.cover-spin {
  position:fixed;
  width:100%;
  left:0;right:0;top:0;bottom:0;
  background-color: rgba(255,255,255,0.7);
  z-index:9999;
  display: none;
}

@-webkit-keyframes spin {
  from {-webkit-transform:rotate(0deg);}
  to {-webkit-transform:rotate(360deg);}
}

@keyframes spin {
  from {transform:rotate(0deg);}
  to {transform:rotate(360deg);}
}

.cover-spin::after {
  content:'';
  display:block;
  position:absolute;
  left:48%;top:40%;
  width:50px;height:50px;
  border-style:solid;
  border-color:#5b5fe1;
  border-top-color:transparent;
  border-width: 4px;
  border-radius:50%;
  -webkit-animation: spin .8s linear infinite;
  animation: spin .8s linear infinite;
}
</style>
