<template>
  <div class="form-res-wrap">
    <Modal v-show="modalActive" :modalMessage="modalMessage" v-on:close-modal="closeModal" />
    <div class="background"></div>
    <form class="login-form">
      <div class="home"> <router-link class="router-link" :to="{name: 'Home'}"> Trang chủ </router-link></div>
      <div class="login-suggest">
        Trở lại 
        <router-link class="router-link" :to="{ name: 'Login' }">
           đăng nhập
        </router-link>
      </div>
      <h2>Đặt lại mật khẩu</h2>
      <div class="input-fields">
        <div class="input-field">
          <EmailIcon class="icon" />
          <input type="text" placeholder="Email" v-model="email" />
        </div>
      </div>
      <button @click.prevent="resetPassword">ĐĂNG NHẬP</button>
    </form>
  </div>
</template>

<script>
import EmailIcon from '../assets/Icons/envelope-regular.svg';
import Modal from '../components/Modal.vue'

import firebase from "firebase/app";
import "firebase/auth";

export default {
  name: "ResetPassword",
  components: { EmailIcon, Modal },
  data() {
    return {
      email: "",
      modalActive: false,
      modalMessage: 'test message hehehehehe',
      loading: null, 
    }
  },
  methods: {
    resetPassword() {
      this.loading = true;
      firebase
        .auth()
        .sendPasswordResetEmail(this.email)
        .then(() => {
          this.modalMessage = "If your account exists, you will receive a email";
          this.loading = false;
          this.modalActive = true;
          this.email = ""
        })
        .catch((err) => {
          this.modalMessage = err.message;
          this.loading = false;
          this.modalActive = true;
        });
    },
    closeModal() {
      this.modalActive = false;
    }
  }
};
</script>


<style lang="scss" scoped>
.router-link {
        color: black;
        &:hover {
          color: #d3b062;
        }
      }

.form-res-wrap { 
  overflow: hidden;
  display: flex;
  height: 100vh;
  justify-content: center;
  align-self: center;
  margin: 0 auto;
  width: 100%;

  form {
    padding: 0 10px;
    padding: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    flex: 1;
    
    @media(min-width: 900px) {
      padding: 0 50px;
    }

    .home {
      position: absolute;
      top: 20px;
    }

    .login-suggest {
      margin-bottom: 32px;
      
    }

    h2 {
      font-weight: 900;
      font-size: 30px;
      color: black;
      margin-bottom: 40px;
      @media(min-width: 900px) {
        font-size: 40px;
      }

    }
    
    .input-fields {
      width: 100%;
      max-width: 350px;

      .input-field {
        display: flex;
        position: relative;
        justify-self: center;
        align-items: center;
        margin-bottom: 8px;

        input {
          width: 100%;
          border: none;
          background-color: rgb(242,247,246);
          font-size: 14px;
          height: 50px;
          padding: 4px 4px 4px 30px;
        } 
        
        .icon {
          width: 16px;
          position: absolute;
          left: 7px;
        }
      }

      @media(max-width: 400px) {
        max-width: 300px;
        .input-field input {
          font-size: 13px;
        }
      }
    }

    
  }

  .background {
    display: none;
    flex: 1.8;
    background: url("../assets/background.jpg");
    transform: scaleX(-1);
    background-position: center;
    background-size: cover;
    @media(min-width: 900px) {
      display: initial;
    }
  }
}
</style>