<template>
  <div class="profile-holder">
    <span class="header">Profile</span>
    <span class="content">
      <center><span style="color:green; font-size:25px;" v-if="sucMessage">Saved Changes✔✔✔</span></center>
      <span class="inputs" v-if="data !== null">
        <div class="form-group" style="margin-top: 25px;">
          <label for="address">First Name</label>
          <i style="color:red; font-style:italic;" v-if="fNameShow">Firstname required!</i>
          <p class="dataDesign" v-if="!inputEnable">&ensp;{{data.first_name}}</p>
          <input type="text" v-if="inputEnable" class="form-control" placeholder="Enter First Name" v-model="data.first_name">
        </div>

        <div class="form-group" v-if="allowed.indexOf('middle_name') > -1">
          <label for="address">Middle Name</label>
          <input type="text" v-if="inputEnable" class="form-control" placeholder="Enter Middle Name" v-model="data.middle_name">
        </div>

        <div class="form-group">
          <label for="address">Last Name</label>
          <i style="color:red; font-style:italic;" v-if="lNameShow">Lastname required!</i>
          <p class="dataDesign" v-if="!inputEnable">&ensp;{{data.last_name}}</p>
          <input type="text" v-if="inputEnable" class="form-control" placeholder="Enter Last Name" v-model="data.last_name">
        </div>

        <div class="form-group" v-if="allowed.indexOf('sex') > -1">
          <label for="address">Gender</label>
          <p class="dataDesign" v-if="!inputEnable">&ensp;{{data.sex}}</p>
          <select class="form-control" v-if="inputEnable" v-model="data.sex">
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="others">Others</option>
          </select>
        </div>

        <div class="form-group" v-if="allowed.indexOf('cellular_number') > -1">
          <label for="address">Phone Number(Optional)</label>
          <i style="color:red; font-style:italic;" v-if="cpShow">Invalid phone number</i>
          <p class="dataDesign" v-if="!inputEnable">&ensp;{{data.cellular_number}}</p>
          <input type="number" class="form-control" v-if="inputEnable" placeholder="63+" v-model="data.cellular_number">
        </div>

        <div class="form-group" v-if="allowed.indexOf('address') > -1">
          <label for="address">Address</label>
          <i style="color:red; font-style:italic;" v-if="addressShow">Address required!</i>
          <p class="dataDesign" v-if="!inputEnable">&ensp;{{data.address}}</p>
          <input type="text" class="form-control" v-if="inputEnable" placeholder="Enter Address" v-model="data.address">
        </div>

        <div class="form-group" v-if="allowed.indexOf('birth_date') > -1">
          <label for="address">Birthdate</label>
          <i style="color:red; font-style:italic;" v-if="dateInvalidShow">Invalid date!</i>
          <i style="color:red; font-style:italic;" v-if="bdateShow">Birthdate required!</i>
          <p class="dataDesign" v-if="!inputEnable">&ensp;{{data.birth_date}}</p>
          <input type="date" class="form-control" v-if="inputEnable" :max="dateLimit" v-model="data.birth_date" placeholder="Select your birthdate">
        </div>

        <button class="btn btn-primary" v-if="btnUpdate" style="margin-bottom: 25px;" @click="enableUpdate">Update</button>
        <button class="btn btn-primary" v-if="!btnUpdate" style="margin-bottom: 25px;" @click="validate">Save Changes</button>
      
      </span> 
      <span class="sidebar">
        <span class="sidebar-header" style="margin-top: 25px; font-weight: bold;">Profile Picture</span>
        <span class="image" v-if="user.profile !== null" >
          <img :src="config.BACKEND_URL + user.profile.url" height="auto" width="100%" >
        </span>
        <span class="image" v-else  style="border: 2px solid gray; border-radius: 5px;">
          <i class="far fa-user-circle profile-icon"></i>
        </span>
        <label class="remove-image text-danger" id="featured-image-remove" @click="removeImage(user.profile.id)" v-if="user.profile !== null">
          <i class="fa fa-times"></i>
        </label>
        <button class="btn btn-primary custom-block" style="margin-top: 5px;" @click="showImages()">{{user.profile !== null ? 'Change Profile Picture' : 'Select from images'}}
        </button>
      </span>
    </span>
    <browse-images-modal :object="user.profile" v-if="user.profile !== null"></browse-images-modal>
    <browse-images-modal :object="newProfile" v-if="user.profile === null"></browse-images-modal>
  </div>
</template>
<style scoped>
.dataDesign{
  border: solid 1px;
  border-radius: 10px;
  width: 100%;
  padding: 5px;
  font-size: 15px;
}
.profile-holder{
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
  position: relative;
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

.remove-image{
  position: absolute;
}

.remove-image:hover{
  cursor: pointer;
}

#featured-image-remove{
  top: 50px;
  right: 5px;
  z-index: 1000;
  font-size: 24px;
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
import moment from 'moment'
export default {
  mounted(){
    $('#loading').css({'display': 'block'})
    this.retrieve()
  },
  data(){
    return {
      dateLimit: moment(new Date(), 'YYYY-MM-DD').format('YYYY-MM-DD'),
      dateInvalidShow: false,
      btnUpdate: true,
      inputEnable: false,
      secData: [],
      sucMessage: false,
      cpShow: false,
      lNameShow: false,
      fNameShow: false,
      addressShow: false,
      bdateShow: false,
      user: AUTH.user,
      tokenData: AUTH.tokenData,
      config: CONFIG,
      data: null,
      newProfile: {
        account_id: null,
        url: null
      }
    }
  },
  props: ['allowed'],
  components: {
    'browse-images-modal': require('components/increment/generic/image/BrowseModal.vue')
  },
  computed: {
    showFname(){
      return this.fNameShow
    },
    showLname(){
      return this.lNameShow
    }
  },
  methods: {
    enableUpdate(){
      this.btnUpdate = false
      this.inputEnable = true
    },
    retrieve(){
      let parameter = {
        condition: [{
          value: this.user.userID,
          column: 'account_id',
          clause: '='
        }]
      }
      this.APIRequest('account_informations/retrieve', parameter).then(response => {
        $('#loading').css({'display': 'none'})
        if(response.data.length > 0){
          this.data = response.data[0]
        }else{
          this.data = null
        }
      })
    },
    update(){
      $('#loading').css({'display': 'block'})
      this.APIRequest('account_informations/update', this.data).then(response => {
        if(response.data === true){
          this.sucMessage = true
          this.intervalMessage()
          this.retrieve()
          this.btnUpdate = true
          this.inputEnable = false
        }
      })
    },
    intervalMessage(){
      setInterval(() => {
        this.sucMessage = false
      }, 3000)
      clearInterval(this.polling)
    },
    updatePhoto(object){
      $('#loading').css({'display': 'block'})
      this.APIRequest('account_profiles/update', object).then(response => {
        if(response.data === true){
          this.hideImages()
          this.retrieve()
          AUTH.checkAuthentication()
        }
      })
    },
    createPhoto(object){
      this.APIRequest('account_profiles/create', object).then(response => {
        if(response.data > 0){
          this.hideImages()
          AUTH.checkAuthentication()
        }
      })
    },
    valid(){
      if(this.data.last_name === null || this.data.last_name === ''){
        this.lNameShow = true
      }
      if(this.data.first_name === null || this.data.first_name === ''){
        this.fNameShow = true
      }
      if(this.data.address === null || this.data.address === ''){
        this.addressShow = true
      }
      if(this.data.birth_date === null || this.data.birth_date === ''){
        this.bdateShow = true
      }
      if(this.data.birth_date > this.dateLimit){
        this.dateInvalidShow = true
      }
      if(this.data.last_name !== ''){
        this.lNameShow = false
      }
      if(this.data.first_name !== ''){
        this.fNameShow = false
      }
      if(this.data.address !== ''){
        this.addressShow = false
      }
      if(this.data.birth_date !== ''){
        this.bdateShow = false
      }
      if(this.data.birth_date <= this.dateLimit){
        this.dateInvalidShow = false
      }
    },
    validate(){
      if(this.data.cellular_number !== null && this.data.cellular_number !== ''){
        this.valid()
        if(this.data.cellular_number.length > 11){
          this.data.cellular_number = this.data.cellular_number.slice(0, 11)
          this.cpShow = true
        }else if(this.data.cellular_number.slice(0, 2) !== '09'){
          this.cpShow = true
        }else if((this.data.cellular_number.length < 11 && this.data.cellular_number.length >= 1)){
          this.cpShow = true
          if(this.data.cellular_number.slice(0, 2) !== '09'){
            this.cpShow = true
          }
        }else{
          if(this.data.last_name !== '' && this.data.first_name !== '' && this.data.address !== '' && this.data.birth_date !== '' && this.dateInvalidShow === false){
            this.cpShow = false
            this.lNameShow = false
            this.fNameShow = false
            this.update()
          }
        }
      }else if(this.data.cellular_number === null || this.data.cellular_number === ''){
        this.valid()
        if(this.data.last_name !== '' && this.data.first_name !== '' && this.data.address !== '' && this.data.birth_date !== '' && this.dateInvalidShow === false){
          this.cpShow = false
          this.lNameShow = false
          this.fNameShow = false
          this.update()
        }
      }
    },
    showImages(){
      $('#browseImagesModal').modal('show')
    },
    hideImages(){
      $('#browseImagesModal').modal('hide')
    },
    manageImageUrl(url){
      if(this.user.profile !== null){
        this.user.profile.url = url
        this.updatePhoto(this.user.profile)
      }else{
        this.newProfile.account_id = this.user.userID
        this.newProfile.url = url
        this.createPhoto(this.newProfile)
      }
    },
    removeImage(id){
      let parameter = {
        id: id
      }
      $('#loading').css({'display': 'block'})
      this.APIRequest('account_profiles/delete', parameter).then(response => {
        $('#loading').css({'display': 'none'})
        AUTH.checkAuthentication()
      })
    }
  }
}
</script>
