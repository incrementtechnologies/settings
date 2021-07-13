<template>
  <div class="profile-holder">
    <span class="header">Profile</span>
    <span v-if="alertMessage.message !== null" class="alert-message">
      <p :class="`alert ${alertMessage.type ? `alert-${alertMessage.type}` : ''} alert-dismissible fade show`" role="alert">
        {{ alertMessage.message }}
        <button @click="alertMessage = { type: null, message: null }" type="button" class="close" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </p>
    </span>
    <span class="content">
      <span class="inputs" v-if="data !== null">
        <div class="form-group" style="margin-top: 25px;">
          <label for="address">First Name <label class="text-danger">*</label></label>
          <input type="text" class="form-control" placeholder="Enter First Name" v-model="data.first_name">
        </div>

        <div class="form-group" v-if="allowed.indexOf('middle_name') > -1">
          <label for="address">Middle Name</label>
          <input type="text" class="form-control" placeholder="Enter Middle Name" v-model="data.middle_name">
        </div>

        <div class="form-group">
          <label for="address">Last Name <label class="text-danger">*</label></label>
          <input type="text" class="form-control" placeholder="Enter Last Name" v-model="data.last_name">
        </div>

        <div class="form-group" v-if="allowed.indexOf('sex') > -1">
          <label for="address">Gender</label>
          <select class="form-control" v-model="data.sex">
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="others">Others</option>
          </select>
        </div>

        <div class="form-group" v-if="allowed.indexOf('cellular_number') > -1">
          <label for="address">Phone Number</label>
          <input type="text" class="form-control" placeholder="Optional" v-model="data.cellular_number">
        </div>

        <div class="form-group" v-if="allowed.indexOf('address') > -1">
          <label for="address">Address</label>
          <input type="text" class="form-control" placeholder="Enter Address" v-model="data.address">
        </div>

        <div class="form-group" v-if="allowed.indexOf('birth_date') > -1">
          <label for="address">Birthdate</label>
          <input type="date" class="form-control" v-model="data.birth_date" placeholder="Select your birthdate">
        </div>

        <button class="btn btn-primary" style="margin-bottom: 25px;" @click="update()">Update</button>
      
      </span>
      <span class="sidebar">
        <span class="sidebar-header" style="margin-top: 25px; font-weight: bold;">Profile Picture</span>
        <span class="image" v-if="user.profile !== null" >
          <img :src="config.BACKEND_URL + user.profile.url" style="background-size: cover;"  height="200px" width="200px" >
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
  top: 60px;
  right: 10px;
  /* z-index: 1000; */
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

.alert-message {
    width: 100%;
    height: 28px;
    float: left;
    margin-top: 14px;
}
</style>
<script>
import ROUTER from 'src/router'
import AUTH from 'src/services/auth'
import axios from 'axios'
import CONFIG from 'src/config.js'
export default {
  mounted(){
    $('#loading').css({'display': 'block'})
    this.retrieve()
  },
  data(){
    return {
      user: AUTH.user,
      tokenData: AUTH.tokenData,
      config: CONFIG,
      data: null,
      newProfile: {
        account_id: null,
        url: null
      },
      alertMessage: {
        type: null,
        message: null
      },
      temp: {
        fname: null,
        lname: null,
        number: null,
        address: null,
        mname: null,
        bdate: null
      }
    }
  },
  props: ['allowed'],
  components: {
    'browse-images-modal': require('components/increment/generic/image/BrowseModal.vue')
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
      this.APIRequest('account_informations/retrieve', parameter).then(response => {
        $('#loading').css({'display': 'none'})
        if(response.data.length > 0){
          this.data = response.data[0]
          this.temp = {
            fname: this.data.first_name,
            lname: this.data.last_name,
            number: this.data.cellular_number,
            address: this.data.address,
            mname: this.data.middle_name,
            bdate: this.data.birth_date
          }
        }else{
          this.data = null
        }
      })
    },
    update(){
      console.log(this.temp)
      if(this.validate()){
        if(this.temp.fname !== this.data.first_name || this.temp.lname !== this.data.last_name || this.temp.mname !== this.data.middle_name || this.temp.number !== this.data.cellular_number || this.temp.address !== this.data.address || this.temp.bdate !== this.data.birth_date) {
          $('#loading').css({'display': 'block'})
          this.APIRequest('account_informations/update', this.data).then(response => {
            if(response.data === true){
              this.alertMessage = {
                type: 'success',
                message: 'Updated successfully!'
              }
              this.retrieve()
            } else {
              this.alertMessage = {
                type: 'warning',
                message: 'Error updating profile. Try again'
              }
            }
          }).fail(() => {
            this.alertMessage = {
              type: 'danger',
              message: 'Error updating profile'
            }
          })
        } else {
          this.alertMessage = {
            type: 'success',
            message: 'You did not change anything!'
          }
        }
      }
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
    validate(){
      let i = this.data
      if(i.first_name !== null && i.last_name !== null){
        return true
      }
      return false
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
