<template>
  <div class="account-holder">
    <span class="header">Account</span>
    <span class="content">
      <span class="error text-danger" v-if="errorMessageEmail !== null">
        <b>Oops!</b> {{errorMessageEmail}}
      </span>
      <span class="error text-success" v-if="successMessageEmail !== null">
        {{successMessageEmail}}
      </span>
      <span class="inputs">
        <div class="form-group" style="margin-top: 25px;">
          <label for="address">Username</label>
          <input type="text" class="form-control" placeholder="Enter First Name" v-model="user.username" disabled>
        </div>

        <div class="form-group" style="margin-top: 25px;">
          <label for="address">Email Address</label>
          <input type="text" class="form-control" placeholder="Enter First Name" v-model="email" :disabled="user.subAccount.status !== 'ADMIN'">
        </div>
        <button class="btn btn-primary" style="margin-bottom: 25px;" @click="updateEmail()" v-if="user.subAccount.status === 'ADMIN'">Update Email</button>
      </span>
      <span class="sidebar">
      </span>
    </span>
    <span class="header">Change your password</span>
    <span class="content">
      <span class="error text-danger" v-if="errorMessagePassword !== null">
        <b>Oops!</b> {{errorMessagePassword}}
      </span>
      <span class="error text-success" v-if="successMessagePassword !== null">
        {{successMessagePassword}}
      </span>
      <span class="inputs">
        <div class="form-group" style="margin-top: 25px;">
          <label for="address">New Password</label>
          <input type="password" class="form-control" placeholder="*********" v-model="newPassword">
        </div>

        <div class="form-group" style="margin-top: 25px;">
          <label for="address">Confirm New Password</label>
          <input type="password" class="form-control" placeholder="*********" v-model="newCPassword">
        </div>
        <button class="btn btn-primary" style="margin-bottom: 25px;" @click="updatePassword()">Update</button>
      </span>
      <span class="sidebar">
      </span>
    </span>
    <div v-if="(user.subAccount === null || (user.subAccount !== null && user.subAccount.status === 'ADMIN')) && common.USER_TYPE_SETTING === true">
      <span class="header">Account Type</span>
      <span class="content">
        <span class="error text-danger" v-if="errorMessageType !== null">
          <b>Oops!</b> {{errorMessageType}}
        </span>
        <span class="error text-success" v-if="successMessageType !== null">
          {{successMessageType}}
        </span>
        <span class="inputs">
          <span class="options" v-if="user.subAccount === null || (user.subAccount !== null && user.subAccount.set_types === null)">
            <button v-bind:class="{'btn-primary': user.type === item.title}" class="btn btn-default" @click="updateType(item)" v-bind:style="{width: (parseInt(100 / common.USER_TYPE.length) - 1) + '%'}" v-for="(item, index) in common.USER_TYPE">{{item.title}}</button>
          </span>
          <span class="options" v-else>
            <button class="btn btn-default btn-primary" v-bind:style="{width: (parseInt(100 / common.USER_TYPE.length) - 1) + '%'}">{{user.type}}</button>
          </span>
        </span>
      </span>
    </div>
  </div>
</template>
<style scoped>
.account-holder{
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
.image i{
  font-size: 150px;
  line-height: 200px;
}
.image img{
  border-radius: 5px;
}
.custom-block{
  width: 100%;
  float: left;
}
.custom-block input{
  display: none;
}
.options{
  width: 100%;
  float: left;
  margin-top: 25px;
}
.options button{
  float: left !important;
  height: 60px !important;
  margin-right: 1%;
  margin-left: 0%;
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
  .options button{
    width: 48% !important;
    margin-right: 1%;
    margin-left: 1%;
    margin-bottom: 10px;
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
    this.email = this.user.email
  },
  data(){
    return {
      user: AUTH.user,
      tokenData: AUTH.tokenData,
      config: CONFIG,
      data: null,
      newPassword: null,
      newCPassword: null,
      errorMessagePassword: null,
      errorMessageEmail: null,
      errorMessageType: null,
      successMessageEmail: null,
      successMessagePassword: null,
      successMessageType: null,
      email: null,
      common: COMMON
    }
  },
  methods: {
    initMessages(){
      this.successMessageEmail = null
      this.successMessagePassword = null
      this.successMessageType = null
      this.errorMessageEmail = null
      this.errorMessagePassword = null
      this.errorMessageType = null
    },
    updatePassword(){
      this.initMessages()
      if(this.newPassword === null || this.newPassword === ''){
        this.errorMessagePassword = 'Please fill up all the required fields.'
      }else if(this.newPassword.length < 6){
        this.errorMessagePassword = 'Password must not less than to 6 digit characters.'
      }else if(this.newPassword !== this.newCPassword){
        this.errorMessagePassword = 'Password did not matched.'
      }else{
        this.errorMessagePassword = null
        let parameter = {
          id: this.user.userID,
          password: this.newPassword
        }
        $('#loading').css({display: 'block'})
        this.APIRequest('accounts/update_password', parameter).then(response => {
          $('#loading').css({display: 'none'})
          if(response.data === true){
            // AUTH.checkAuthentication(null)
            this.successMessagePassword = 'Successfully updated!'
          }
        })
      }
    },
    updateType(item){
      this.initMessages()
      let parameter = {
        id: this.user.userID,
        account_type: item.title
      }
      $('#loading').css({display: 'block'})
      this.APIRequest('accounts/update_type', parameter).then(response => {
        $('#loading').css({display: 'none'})
        if(response.data === true){
          // AUTH.checkAuthentication(null)
          this.successMessageType = 'Successfully updated!'
        }
      })
    },
    updateEmail(){
      this.initMessages()
      if(this.email !== null || this.email !== ''){
        let parameter = {
          'id': this.user.userID,
          'email': this.email
        }
        $('#loading').css({'display': 'block'})
        this.APIRequest('accounts/update_email', parameter).then(response => {
          $('#loading').css({display: 'none'})
          if(response.data === true){
            this.errorMessageEmail = null
            // AUTH.checkAuthentication(null)
            this.successMessageEmail = 'Successfully updated!'
          }else{
            this.errorMessageEmail = response.error
          }
        })
      }else{
        this.errorMessageEmail = 'Please fill up all the required fields.'
      }
    }
  }
}
</script>
