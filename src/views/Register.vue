<template>
  <div class="form-res-wrap">
    <div class="background"></div>
    <form class="register-form">
      <div class="home">
        <router-link class="router-link" :to="{ name: 'Home' }">
          Trang chủ
        </router-link>
      </div>
      <div class="login-suggest">
        Đã có tài khoản?
        <router-link class="router-link" :to="{ name: 'Login' }">
          Đăng nhập
        </router-link>
      </div>
      <h2>Tạo tài khoản</h2>
      <div class="input-fields">
        <div class="input-field">
          <UserIcon class="icon" />
          <input type="text" placeholder="Họ" v-model="firstName" />
        </div>
        <div class="input-field">
          <UserIcon class="icon" />
          <input type="text" placeholder="Tên" v-model="lastName" />
        </div>
        <div class="input-field">
          <UserIcon class="icon" />
          <input type="text" placeholder="Tên tài khoản" v-model="username" />
        </div>
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
      <button @click.prevent="signUp">ĐĂNG KÝ</button>
    </form>
  </div>
</template>

<script>
import UserIcon from "../assets/Icons/user-alt-light.svg";
import EmailIcon from "../assets/Icons/envelope-regular.svg";
import PasswordIcon from "../assets/Icons/lock-alt-solid.svg";

import firebase from "firebase/app";
import "firebase/auth";
import db from "../firebase/firebaseInit";

export default {
  name: "Login",
  components: { UserIcon, EmailIcon, PasswordIcon },
  data() {
    return {
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      password: "",
      error: null,
      errorMessage: "",
    };
  },
  methods: {
    isValidEmail(email) {
      var reg = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
      return reg.test(email)
    },
    isValidUserName(username) {
      if(username.length < 6)
        return false;
      return true;
    },
    async signUp() {
      if (
        this.firstName == "" ||
        this.lastName == "" ||
        this.username == "" ||
        this.email == "" ||
        this.password == ""
      ) {
        this.error = true;
        this.errorMessage = "Xin hãy nhập đủ thông tin!";
        return;
      } 
      if( !this.isValidUserName(this.username)) {
        this.error = true;
        this.errorMessage = "Tên tài khoản phải có độ dài lớn hơn 6";
        return;
      }

      this.error = false;
      this.errorMsg = "";
      const firebaseAuth = await firebase.auth();
      firebaseAuth.createUserWithEmailAndPassword(this.email, this.password).then( (result) => {
        console.log("result", result);
        const dataBase = db.collection("users").doc(result.user.uid);
        dataBase.set({
          firstName: this.firstName,
          lastName: this.lastName,
          username: this.username,
          email: this.email,
        });
        this.$router.push({ name: "Home" });
      }).catch( (err) => {
        console.log(err);
        this.error = true;
        this.errorMessage = err.message;
      });
      return;      
    },
  },
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
  position: absolute;
  top: 0;
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

    @media (min-width: 900px) {
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
      @media (min-width: 900px) {
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
          background-color: rgb(242, 247, 246);
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

      @media (max-width: 400px) {
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
    @media (min-width: 900px) {
      display: initial;
    }
  }
}
</style>