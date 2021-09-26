<template>
  <div class="form-res-wrap">
    <div class="background"></div>
    <form class="login-form">
      <div class="home"> <router-link class="router-link" :to="{name: 'Home'}"> Trang chủ </router-link></div>
      <div class="register-suggest">
        Bạn chưa có tài khoản?
        <router-link class="router-link" :to="{ name: 'Register' }">
          Đăng ký
        </router-link>
      </div>
      <h2>Đăng nhập</h2>
      <div class="input-fields">
        <div class="input-field">
          <EmailIcon class="icon" />
          <input type="text" placeholder="Email" v-model="email" />
        </div>
        <div class="input-field">
          <PasswordIcon class="icon" />
          <input type="password" placeholder="Mật khẩu" v-model="password" />
        </div>
        <div v-show="error" class="error">{{ errorMessage }}</div>
      </div>
      <router-link class="forgot-password" :to="{name: 'ResetPassword'}">Forgot your password?</router-link>
      <button @click.prevent="signIn">ĐĂNG NHẬP</button>
    </form>
  </div>
</template>

<script>
import EmailIcon from "../assets/Icons/envelope-regular.svg";
import PasswordIcon from "../assets/Icons/lock-alt-solid.svg";

import firebase from "firebase/app";
import "firebase/auth";

export default {
  name: "Login",
  components: { EmailIcon, PasswordIcon },
  data() {
    return {
      email: '',
      password: '',
      error: null,
      errorMessage: '',
    }
  },
  methods: {
    signIn() {
      firebase
        .auth()
        .signInWithEmailAndPassword(this.email, this.password)
        .then(() => {
          this.$router.push({ name: "Home" });
          this.error = false;
          this.errorMessage = "";
          console.log(firebase.auth().currentUser.uid);
        })
        .catch((err) => {
          this.error = true;
          this.errorMessage = err.message;
        });
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
  position: absolute;
  top: 0;
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
    .register-suggest {
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
    
    .forgot-password {
      text-decoration: none;
      color: black;
      cursor: pointer;
      font-size: 14px;
      margin: 16px 0 32px;
      border-bottom: 1px solid rgba(0,0,0,0);
      transition: ease all 0.5s;

      &:hover {
        border-bottom-color: black;
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