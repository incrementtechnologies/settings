<template>
  <div class="update-holder" v-if="tokenData.token !== null">
    <div class="dropdown">
      <button class="btn btn-primary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
        {{!title ? 'Show Menu' : title}}
      </button>
      <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
        <span class="dropdown-item" v-for="(item, index) in menu" :key="index" @click="makeActive(item)" v-if="item.type !== 'merchant' && (user.subAccount === null || (user.subAccount !== null && user.subAccount.status === 'ADMIN'))">{{item.title}}</span>
      </div>
    </div>
    <div class="sidebar">
      <span class="header">
        Personal Settings
      </span>
      <span class="item" v-bind:class="{'make-active': item.type === activeType}" v-for="(item, index) in menu" :key="index" @click="makeActive(item)">
        {{item.title}}
      </span>
    </div>
    <div class="content">
      <profile v-if="activeType === 'profile'" :allowed="allowed"></profile>
      <account v-if="activeType === 'account'"></account>
      <payment v-if="activeType === 'payment_method'"></payment>
      <billing-information v-if="activeType === 'billing_information'"></billing-information>
      <merchant v-if="activeType === 'merchant'" :allowed="allowed" :title="title"></merchant>
      <merchant-with-schedule v-if="activeType === 'merchant-with-schedule'" :allowed="allowed" :title="title"></merchant-with-schedule>
      <notification v-if="activeType === 'notification'"></notification>
    </div>
  </div>

</template>
<style scoped lang="scss">
@import "~assets/style/colors.scss";
.update-holder{
  width: 100%;
  float: left;
  margin-top: 25px;
  margin-bottom: 200px;
}

.sidebar{
  width: 25%;
  float: left;
  border-top: solid 1px #ddd;
  border-right: solid 1px #ddd;
  border-left: solid 1px #ddd;
  border-top-right-radius: 2px;
  border-top-left-radius: 2px;
  min-height: 40px;
  overflow-y: hidden;
}
.sidebar .header{
  height: 40px;
  float: left;
  width: 100%;
  line-height: 40px;
  padding-left: 10px;
  border-bottom: solid 1px #ddd;
  background: #eee;
}
.sidebar .item{
  height: 40px;
  float: left;
  width: 100%;
  line-height: 40px;
  padding-left: 10px;
  border-bottom: solid 1px #ddd;
}
.item:hover{
  cursor: pointer;
  border-left: solid 2px $primary !important;
}
.make-active{
  border-left: solid 2px $primary !important;
}
.content{
  width: 75%;
  float: left;
  min-height: 50px;
  overflow-y: hidden;
}
.dropdown{
  width: 100%;
  display: none;
}
.custom-block-btn{
  width: 100% !important;
  text-align: right;
  padding-right: 10px;
}
@media screen and (max-width: 992px){
  .sidebar{
    display: none;
  }
  .content{
    width: 100%;
  }
  .dropdown{
    display: block;
  }
  .btn-primary.active, .btn-primary:active, .show>.btn-primary.dropdown-toggle{
    background: $primary;
    border-color: $primary;
  }
}
</style>
<script>
import ROUTER from 'src/router'
import AUTH from 'src/services/auth'
import axios from 'axios'
import CONFIG from 'src/config.js'
import COMMON from 'src/common.js'
export default {
  mounted(){
    if(this.parameter !== null){
      let flag = false
      for (var i = 0; i < this.menu.length; i++) {
        if(this.parameter === this.menu[i].type){
          flag = true
          this.makeActive(this.menu[i])
        }
      }
      if(flag === false){
        this.makeActive(this.menu[0])
      }
    }else{
      this.makeActive(this.menu[0])
    }
  },
  data(){
    return {
      user: AUTH.user,
      tokenData: AUTH.tokenData,
      config: CONFIG,
      menu: COMMON.settingsMenu,
      activeType: 'profile',
      parameter: this.$route.params.parameter,
      title: 'Show Menu',
      allowed: []
    }
  },
  components: {
    'profile': require('components/increment/settings/Profile.vue'),
    'account': require('components/increment/settings/Account.vue'),
    'payment': require('components/increment/settings/Payment.vue'),
    'merchant-with-schedule': require('components/increment/settings/MerchantWithSchedule.vue'),
    'billing-information': require('components/increment/settings/BillingInformation.vue'),
    'merchant': require('components/increment/settings/Merchant.vue'),
    'notification': require('components/increment/settings/Notification.vue')
  },
  methods: {
    redirect(path){
      ROUTER.push(path)
    },
    makeActive(params){
      this.allowed = params.allowed
      this.activeType = params.type
      this.title = params.title
    }
  }
}
</script>
