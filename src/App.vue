<template>
  <div id="app" v-if="this.$store.state.postLoaded">
    <Navbar v-show="activeNav"/>
    <router-view/>
    <MyFooter v-show="activeNav"/>
  </div>
</template>

<script>
import Navbar from './components/Navbar.vue'
import MyFooter from './components/Footer.vue'

import firebase from 'firebase/app'
import 'firebase/auth'

export default {
  components: { Navbar, MyFooter },
  data() {
    return {
      activeNav: null,
    }
  },
  methods: {
    checkActiveNav() {
      if(this.$route.name == "Login" || this.$route.name == "Register" || this.$route.name == "ResetPassword") {
        this.activeNav = false
        return
      }
      this.activeNav = true
      return
    }
  },
  created() {
    this.checkActiveNav()
    this.$store.dispatch("getPost");
    
    firebase.auth().onAuthStateChanged((user) => {
      this.$store.commit("updateUser", user)
      if(user) {
        this.$store.dispatch("getCurrentUser")
      }
    });
  },
  watch: {
    $route() {
      this.checkActiveNav()
    }
  }
}
</script>
<style lang="scss">
// @import url("https://fonts.googleapis.com/css2?family=Quicksand:wght@300;400;500;600;700&display=swap");
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@100;200;300;400;500;600;700;900&display=swap');
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Montserrat',sans-serif;
  // font-family: "Quicksand", sans-serif;
}

#app {
  padding-top: 55px;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
}

.error {
  text-align: center;
  font-size: 14px;
  color: red;
}

button {
      margin-top: 20px;
      transition: ease all 0.5s;
      cursor: pointer;
      padding: 12px 24px;
      background-color: black;
      color: #fff;
      border: none;

      &:hover {
        background-color: #555555;
      }
    }

.link {
  cursor: pointer;
  text-decoration: none;
  text-transform: uppercase;
  color: #252525;
  transition: 0.3s;


  &:hover {
    color: #b68723;
  }
}
.arrow {
  margin-left: 8px;
  width: 12px;
  path {
    fill: #b68723;
  }
}
.arrow-light {
  margin-left: 8px;
  width: 12px;
  path {
    fill: #fff;
  }
}

button, .router-button {
  transition: 0.5s ease all;
  cursor: pointer;
  margin-top: 24px;
  padding: 12px 24px;
  background-color: #303030;
  color: #fff;
  border-radius: 3px;
  border: none;
  text-transform: uppercase;
  text-decoration: none;
  &:focus {
    outline: none;
  }
  &:hover {
    background-color: #b68723;
  }
}

.blog-card-wrap {
  position: relative;
  padding: 80px 16px;
  background-color: #f1f1f1;
  @media (min-width: 500px) {
    padding: 100px 16px;
  }

  .blog-cards {
    display: grid;
    gap: 32px;
    grid-template-columns: 1fr;
    @media (min-width: 500px) {
      grid-template-columns: repeat(2, 1fr);
    }
    @media (min-width: 900px) {
      grid-template-columns: repeat(3, 1fr);
    }
    @media (min-width: 1200px) {
      grid-template-columns: repeat(4, 1fr);
    }
  }
}

.button-inactive {
  pointer-events: none !important;
  cursor: none !important;
  background-color: rgba(128, 128, 128, 0.5) !important;
}

</style>
