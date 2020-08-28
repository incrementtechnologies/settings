<template>
  <div class="notification-holder">
    <span class="header">Email</span>
    <span class="content">
      <span class="inputs">
        <div class="item" style="margin-top: 25px;" v-for="(item, index) in options" :key="index" >
          <span v-if="common.notificationSeting[index].flag === true">
            <span class="details">
              <label class="title">{{item.title}}</label>
              <label class="definition">{{item.description}}</label>
            </span>
            <span class="icon" v-if="data !== null">
              <i class="fa fa-toggle-on text-primary action-link" v-if="parseInt(data[item.column]) === 1" @click="update(data.id, item.column, 0)"></i>
              <i class="fa fa-toggle-off text-danger action-link"  v-if="parseInt(data[item.column]) === 0" @click="update(data.id, item.column, 1)"></i>
            </span>
            <span class="icon" v-if="data === null">
              <i class="fa fa-toggle-off text-danger action-link" @click="create(item.column)"></i>
            </span> 
          </span>
        </div>
      </span>
      <span class="sidebar">
      </span>
    </span>
  </div>
</template>
<style scoped>
.notification-holder{
  width: 95%;
  float: left;
  margin-left: 5%;
}
.header{
  width: 100%;
  height: 50px;
  line-height: 50px;
  font-size: 24px;
  border-bottom: solid 1px #ddd;
  float: left;
}
.content{
  width: 100%;
  min-height: 50px;
  float: left;
  overflow-y: hidden;
}
.content .error{
  width: 100%;
  float: left;
  height: 40px;
  line-height: 40px;
}
.inputs{
  width: 65%;
  float: left;
  margin-right: 5%;
  min-height: 50px;
  overflow-y: hidden;
}
.sidebar{
  width: 30%;
  float: left;
  min-height: 50px;
  overflow-y: hidden;
}
.sidebar-header{
  height: 40px;
  line-height: 40px;
  width: 100%;
  float: left;
}
.sidebar .image{
  width: 100%;
  float: left;
  min-height: 200px;
  overflow-y: hidden;
  text-align: center;
}
.item{
  width: 100%;
  float: left;
  min-height: 50px;
  overflow-y: hidden;
}
.item .details{
  width: 80%;
  float: left;
  min-height: 50px;
  overflow-y: hidden;
}
.details label{
  width: 100%;
  float: left;
}
.details .definition{
  color: #555;
}
.item .icon{
  width: 20%;
  float: left;
  height: 50px;
  text-align: right;
  line-height: 50px;
}
.icon i{
  font-size: 35px;
}
@media screen and (max-width: 992px){
  .holder{
    width: 96%;
    margin-left: 2%;
    margin-right: 2%;
  }
  .sidebar, .inputs{
    width: 100%;
    margin-right: 0%;
    margin-left: 0%;
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
    this.retrieve()
  },
  data(){
    return {
      user: AUTH.user,
      tokenData: AUTH.tokenData,
      config: CONFIG,
      data: null,
      options: [{
        title: 'Login',
        description: 'Send me an email everytime there\'s a login with my account.',
        column: 'email_login'
      }, {
        title: 'One Time Password(OTP)',
        description: 'Enable OTP everytime there\'s a login with my account.',
        column: 'email_otp'
      }, {
        title: 'Account PIN',
        description: 'Receive new PIN from email everytime there\'s a login with my account.',
        column: 'email_pin'
      }],
      common: COMMON
    }
  },
  methods: {
    retrieve(){
      let parameter = {
        condition: [{
          value: this.user.userID,
          column: 'account_id',
          clause: '='
        }]
      }
      $('#loading').css({display: 'block'})
      this.APIRequest('notification_settings/retrieve', parameter).then(response => {
        $('#loading').css({display: 'none'})
        if(response.data.length > 0){
          this.data = response.data[0]
        }else{
          this.data = null
        }
      })
    },
    create(type){
      let parameter = {
        account_id: this.user.userID,
        email_login: (type === 'email_login') ? 1 : 0,
        email_otp: (type === 'email_otp') ? 1 : 0,
        email_pin: (type === 'email_pin') ? 1 : 0,
        sms_login: (type === 'sms_login') ? 1 : 0,
        sms_otp: (type === 'sms_otp') ? 1 : 0
      }
      $('#loading').css({display: 'block'})
      this.APIRequest('notification_settings/create', parameter).then(response => {
        this.retrieve()
      })
    },
    update(id, type, value){
      let parameter = null
      switch(type){
        case 'email_login': parameter = {
          id: id,
          email_login: value
        }
          break
        case 'email_otp': parameter = {
          id: id,
          email_otp: value
        }
          break
        case 'email_pin': parameter = {
          id: id,
          email_pin: value
        }
          break
        case 'sms_login': parameter = {
          id: id,
          sms_login: value
        }
          break
        case 'sms_otp': parameter = {
          id: id,
          sms_otp: value
        }
          break
      }
      this.updateRequest(parameter)
    },
    updateRequest(parameter){
      $('#loading').css({display: 'block'})
      this.APIRequest('notification_settings/update', parameter).then(response => {
        this.retrieve()
      })
    }
  }
}
</script>
