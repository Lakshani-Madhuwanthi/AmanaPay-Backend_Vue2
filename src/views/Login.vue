<template>
  <section class="hero is-fullheight">
     <full-screen-loader></full-screen-loader>
     <div class="hero-body has-text-centered">
       <div class="container">
         <div class="columns is-centered">
           <div class="column is-two-thirds-tablet is-half-desktop">
             <div class="card" style="padding-bottom: 1.5rem;">
               <form class="card-content" @submit.prevent="login">
                 <img src="../assets/lanka_remit_logo.png" alt="logo">
                 <p class="title is-3 has-text-primary responsive-title" style="letter-spacing: 0.5rem;">DUTY&nbsp;&nbsp; FREE</p>
                 <b-field label="Username" label-position="on-border" :type="loginData.username.class" :message="loginData.username.message">
                   <b-input maxlength="30" icon="account" v-model="loginData.username.value" @input="loginData.username.blur()"></b-input>
                 </b-field>
 
                 <b-field label="Password" label-position="on-border" :type="loginData.password.class" :message="loginData.password.message">
                   <b-input :type="passwordVisible ? '' : 'password'" icon="form-textbox-password" maxlength="30" v-model="loginData.password.value" @input="loginData.password.blur()" password-reveal></b-input>
                 </b-field>
 
                 <div class="buttons">
                   <b-button type="is-primary" native-type="submit" :loading="btnLoading" expanded>Login</b-button>
                 </div>
               </form>
               <div class="has-text-small">Version <strong>{{ getAppVersionData().version }}</strong> © {{ getAppVersionData().year }} LankaPay (Pvt) Ltd. All Rights Reserved</div>
             </div>
           </div>
         </div>
       </div>
     </div>
     <terms-and-conditions :tcAccepted="tcAccepted" @tcAccepted="handleTCAccepted" @tcRejected="handleTCRejected" />
   </section>
 </template>

<script>
import jwtUtils from "@/helpers/jwtUtils"
import NetworkManager from "@/network"
import {FieldValidator} from "@/helpers/validators/fieldValidator"
import FullScreenLoader from "@/components/FullScreenLoader";
import termsAndConditions from "@/components/TermsAndConditionsModal";
import {appSettings} from "@/appSettings";
import User from "@/mixins/modules/authMixins";

export default {
  name: 'loginPage',
  components: {FullScreenLoader,termsAndConditions},
  data() {
    return {
      tcAccepted: 1,
      tcAgreed: true,
      btnLoading: false,
      passwordVisible: false,
      loginData: {
        username: new FieldValidator(),
        password: new FieldValidator()
      },

    }
  },

  methods: {
    getAppVersionData: function (){
      return {
        version: appSettings.version,
        year: appSettings.year
      }
    },

    validate: function (){
      let isValid = true

      let usernameErrorMessage = "Username cannot contain spaces or special characters except '_'"
      if(!this.loginData.username.validate(usernameErrorMessage)) isValid = false

      let passwordErrorMessage =  "Please enter a valid password"
      if(!this.loginData.password.validate(passwordErrorMessage)) isValid = false

      return isValid
    },

    login: async function () {
      //e.preventDefault()
      const self = this

      if(self.validate()){
        self.btnLoading = true

        const data = {
          username: self.loginData.username.value,
          password: self.loginData.password.value
        }

        await NetworkManager.apiRequest('api/Auth', data,
            function (e) {
              
              let params = {
                type: '',
                message: ''
              }

              switch (e.statusCode) {
                case 200:
                  jwtUtils.saveToken(e.data.token)
                  if (e.data.tcAccepted === 0) {
                  self.tcAccepted = 0;
                  console.log(self.tcAccepted);
                  self.btnLoading = false; // Ensure the button is not in the loading state
                  return;
                }
                  
                  if(e.data.resetPassword === 1){
                    self.showFullScreenLoader()
                    self.navigateTo('ResetPassword')
                  }
                  else {
                    self.showFullScreenLoader()

                    if(User.hasPermission('df-bank-view') && !User.hasSuperPermission()){
                      self.navigateTo('DashboardDFBank')
                    }
                    else if(User.hasPermission('df-ministry-view') || User.hasSuperPermission()){
                      self.navigateTo('DashboardDFMinistry')
                    }
                    else if(User.hasPermission('df-customs-view')){
                      self.navigateTo('DashboardDFCustoms')
                    }
                    else if(User.hasPermission('df-cbsl-view')){
                      self.navigateTo('DutyFreeUpdateTodaysRate')
                    }
                    else if(User.hasPermission('df-merchant-data-view')){
                      self.navigateTo('DutyFreeMerchant')
                    }
                    else {
                      self.navigateTo('Dashboard')
                    }
                  }
                  break
                case 400:
                  params = {
                    type: 'is-warning',
                    message: 'Username or Password is invalid!'
                  }
                  self.$buefy.toast.open(params)
                  self.loginData.username.value = ''
                  self.loginData.password.value = ''
                  break
                case 404:
                  params = {
                    type: 'is-warning',
                    message: 'Username or Password is invalid!'
                  }
                  self.$buefy.toast.open(params)
                  self.loginData.username.value = ''
                  self.loginData.password.value = ''
                  break
                  case 422:
                  params = {
                    type: 'is-warning',
                    message: 'Username or Password is invalid!'
                  }
                  self.$buefy.toast.open(params)
                  self.loginData.username.value = ''
                  self.loginData.password.value = ''
                  break
                case 500:
                  params = {
                    type: 'is-warning',
                    message: 'Username or Password is invalid!'
                  }
                  self.$buefy.toast.open(params)
                  self.loginData.username.value = ''
                  self.loginData.password.value = ''
                  break
              }

              self.btnLoading = false
            }, false)
      }
    },
    handleTCAccepted(){
      const self = this
      const data={
        tcAgree: self.tcAgreed
      }

      NetworkManager.apiRequest('api/dutyfree/DFAuth/tc-agree', data, function (e) {
        if (e.statusCode === 200) {
          const params = {
            type: 'is-success',
            message: e.data.message + ' successfully'
          }
          self.$buefy.toast.open(params)
          // location.reload()
        } else {
          const params = {
            type: 'is-warning',
            message: e.data.message + ' failed!'
          }
          self.$buefy.toast.open(params)
        }

        self.crIsLoading = false
      })
    },
    handleTCRejected(){
      this.tcAccepted = 1
    }
  },
   mounted() {
     this.stopTokenTimer()
   }
}
</script>

<style scoped>
.hero{
  background-image: url(../assets/Login.png);
  background-size: cover;
}
</style>
