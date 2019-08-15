<template>
  <div class="account-holder">
    <span class="header">Account</span>
    <span class="content">
      <span class="error text-danger" v-if="errorMessageEmail !== null">
        <b>Oops!</b> {{errorMessageEmail}}
      </span>
      <span class="error text-success" v-if="successMessage !== null">
        {{successMessage}}
      </span>
      <span class="inputs">
        <div class="form-group" style="margin-top: 25px;">
          <label for="address">Username</label>
          <input type="text" class="form-control" placeholder="Enter First Name" v-model="user.username" disabled>
        </div>

        <div class="form-group" style="margin-top: 25px;">
          <label for="address">Email Address</label>
          <input type="text" class="form-control" placeholder="Enter First Name" v-model="email">
        </div>
        <button class="btn btn-primary" style="margin-bottom: 25px;" @click="updateEmail()">Update Email</button>
      </span>
      <span class="sidebar">
      </span>
    </span>
    <span class="header">Change your password</span>
    <span class="content">
      <span class="error text-danger" v-if="errorMessage !== null">
        <b>Oops!</b> {{errorMessage}}
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
    <div v-if="user.subAccount === null || (user.subAccount !== null && user.subAccount.status === 'ADMIN')">
      <span class="header">Change your Account Type</span>
      <span class="content">
        <span class="error text-danger" v-if="errorMessage !== null">
          <b>Oops!</b> {{errorMessage}}
        </span>
        <span class="error text-success" v-if="successMessagePassword !== null">
          {{successMessagePassword}}
        </span>
        <span class="inputs">
          <span class="options" v-if="config.USER_TYPE.length === 3">
            <button v-bind:class="{'btn-primary': user.type === item.title}" class="btn btn-default" @click="updateType(item)" v-bind:style="{width: (parseInt(100 / config.USER_TYPE.length) - 1) + '%'}" v-for="(item, index) in config.USER_TYPE">{{item.title}}</button>
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
import ROUTER from '../../../router'
import AUTH from '../../../services/auth'
import axios from 'axios'
import CONFIG from '../../../config.js'
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
      errorMessage: null,
      errorMessageEmail: null,
      successMessage: null,
      successMessagePassword: null,
      email: null
    }
  },
  methods: {
    updatePassword(){
      this.successMessagePassword = null
      this.successMessage = null
      if(this.newPassword === null || this.newPassword === ''){
        this.errorMessage = 'Please fill up all the required fields.'
      }else if(this.newPassword.length < 6){
        this.errorMessage = 'Password must not less than to 6 digit characters.'
      }else if(this.newPassword !== this.newCPassword){
        this.errorMessage = 'Password did not matched.'
      }else{
        this.errorMessage = null
        let parameter = {
          id: this.user.userID,
          password: this.newPassword
        }
        this.APIRequest('accounts/update_password', parameter).then(response => {
          if(response.data === true){
            AUTH.checkAuthentication(null)
            this.successMessagePassword = 'Successfully updated!'
          }
        })
      }
    },
    updateType(item){
      let parameter = {
        id: this.user.userID,
        account_type: item.title
      }
      $('#loading').css({display: 'block'})
      this.APIRequest('accounts/update_type', parameter).then(response => {
        $('#loading').css({display: 'none'})
        if(response.data === true){
          AUTH.checkAuthentication(null)
        }
      })
    },
    updateEmail(){
      this.successMessagePassword = null
      this.successMessage = null
      if(this.email !== null || this.email !== ''){
        let parameter = {
          'id': this.user.userID,
          'email': this.email
        }
        this.APIRequest('accounts/update_email', parameter).then(response => {
          if(response.data === true){
            this.errorMessageEmail = null
            AUTH.checkAuthentication(null)
            this.successMessage = 'Successfully updated!'
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
