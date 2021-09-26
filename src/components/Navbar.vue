<template>
<header>
  <!--PC view -->
  <nav class="container" v-show="!mobile">
    <div class="nav-links">
      <ul>
        <Tree class="menu-item" :mobileNav="false" :data="navItem" v-for="(navItem,index) in navItems" :key="index">
        </Tree>
      </ul>
    </div>

    <div v-if="user" class="profile" @click="toggleProfileMenu">
      <span>{{ this.$store.state.profileInitials }}</span>
      <div v-show="profileMenu" class="profile-menu">
            <div class="info">
              <p class="initials">{{ this.$store.state.profileInitials }}</p>
              <div class="right">
                <p>{{ this.$store.state.profileFirstName }} {{ this.$store.state.profileLastName }}</p>
                <p>{{ this.$store.state.profileUsername }}</p>
                <p>{{ this.$store.state.profileEmail }}</p>
              </div>
            </div>
            <div class="options">
              <router-link class="option" :to="{ name: 'Profile' }">
                <userIcon class="icon" />
                <p>Profile</p>
              </router-link>
              <router-link v-if="admin" class="option" :to="{ name: 'Admin' }">
                <adminIcon class="icon" />
                <p>Admin</p>
              </router-link>
              <div @click="signOut" class="option">
                <signOutIcon class="icon" />
                <p>Sign Out</p>
              </div>
            </div>
          </div>
    </div>

    <div v-else class="login-register">
      <li class="menu-item" @click="$router.push('/Login')"> 
        LOGIN/REGISTER
      </li>
    </div>
  </nav>
  
  <!-- Mobile view -->
  <div v-if="user && mobile" class="profile profile-mobile" @click="toggleProfileMenu">
      <span>{{ this.$store.state.profileInitials }}</span>
      <div v-show="profileMenu" class="profile-menu">
            <div class="info">
              <p class="initials">{{ this.$store.state.profileInitials }}</p>
              <div class="right">
                <p>{{ this.$store.state.profileFirstName }} {{ this.$store.state.profileLastName }}</p>
                <p>{{ this.$store.state.profileUsername }}</p>
                <p>{{ this.$store.state.profileEmail }}</p>
              </div>
            </div>
            <div class="options">
              <router-link class="option" :to="{ name: 'Profile' }">
                <userIcon class="icon" />
                <p>Profile</p>
              </router-link>

              <router-link v-if="admin" class="option" :to="{ name: 'Admin' }">
                <adminIcon class="icon" />
                <p>Admin</p>
              </router-link>
            <div @click="signOut" class="option">
                <signOutIcon class="icon" />
                <p>Sign Out</p>
              </div>
            </div>
          </div>
  </div>

  <menuIcon @click="toggleMobileNav" class="menu-icon" v-show="mobile"/>
  
  <transition name="mobile-nav" >
    <ul class="mobile-nav" v-show="mobileNav">
      <Tree class="menu-item" :mobileNav="true" :data="navItem" v-for="(navItem,index) in navItems" :key="index">
      </Tree>
      <li v-if="!user" class="menu-item oddly-mobile-nav-item" @click="$router.push('/Login')"> 
        LOGIN/REGISTER
      </li>
      <li v-if="user" class="menu-item oddly-mobile-nav-item" @click="signOut"> 
        SIGN OUT
      </li>
      
    </ul>
  </transition>
  
</header>
</template>

<script>
import Tree from "../components/Tree.vue"

import menuIcon from "../assets/Icons/bars-regular.svg"
import userIcon from "../assets/Icons/user-alt-light.svg";
import adminIcon from "../assets/Icons/user-crown-light.svg";
import signOutIcon from "../assets/Icons/sign-out-alt-regular.svg";

import firebase from 'firebase/app'
import 'firebase/auth'

export default {
  name :"navbar",
  components: {
    Tree, menuIcon, userIcon, adminIcon, signOutIcon,   
  },
  data () {
    return {
      profileMenu: null,
      mobile: null,
      windowWidth: null,
      navItems : [
                {
                    content: 'HOME',
                    link: '/',
                    showUnauth: true,
                    child : [
                    ],
                },
                {
                    content: 'BLOG',
                    link: '/blogs',
                    showUnauth: true,
                    child : [
                      {
                        content: 'Minimalism',
                        link: '', 
                        child : [],
                      },
                      {
                        content: 'Lifestyle',
                        link: '',
                        child : [],
                      },
                      {
                        content: 'Nhật ký',
                        link: '',
                        child : [],
                      },
                      {
                        content: 'Cuộc sống ở Nhật Bản',
                        link: '',
                        child : [],
                      },
                      {
                        content: 'Cuộc sống ở Hà Nội',
                        link: '',
                        child : [],
                      },
                      {
                        content: 'Hành trình của mình',
                        link: '',
                        child : [],
                      },
                      {
                        content: 'Học ngoại ngữ',
                        link: '',
                        child : [],
                      },
                      {
                        content: 'Productivity',
                        link: '',
                        child : [],
                      },
                      {
                        content: 'Đọc sách',
                        link: '',
                        child : [],
                      },
                      {
                        content: 'Nấu ăn',
                        link: '',
                        child : [],
                      },
                      {
                        content: 'Khám phá & Du lịch',
                        link: '',
                        child : [],
                      }
                    ],
                },
                {
                    content: 'CREATE-POST',
                    link: '/CreatePost',
                    showUnauth: false,
                    child : [],
                },
      ]
    }
  },
  created () {
    window.addEventListener("resize",this.checkScreen);
    this.checkScreen();
  },
  methods: {
    checkScreen() {
      this.windowWidth = window.innerWidth;
      if(this.windowWidth <= 800 ) {
        this.mobile = true;
        return;
      } 
      this.mobile = false;
      this.$store.commit('setMobileNav', false)
      return;
    },
    toggleMobileNav() {
      this.$store.commit('toggleMobileNav')
    },
    toggleProfileMenu() {
      this.profileMenu = !this.profileMenu
    },
    signOut() {
      firebase.auth().signOut();
      window.location.reload();
    },
  },
  computed: {
    user() {
      return this.$store.state.user
    },
    admin() {
      return this.$store.state.profileAdmin
    },
    mobileNav() {
      return this.$store.state.mobileNav
    }
  }
}
</script>

<style lang="scss" scoped>
.link-template {
    color: #252525;
    padding: 19px 14px;
    font-size: 13px;
    text-decoration: none;
    margin: 0;
    position: relative;
    transition: .08s all linear;
    font-weight: 400;
    letter-spacing: 1px;
    cursor: pointer;
}

.profile {
      position: relative;
      width: 40px;
      height: 40px;
      margin: 0 20px;
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      background: #252525;
      color: white;
      cursor: pointer;
  
      .profile-menu {
        position: absolute;
        top: 120%;
        right: 0;
        width: 250px;
        background-color: #252525;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        border-radius: 5px;
        text-align: left;
        overflow: hidden;

        .info {
          display: flex;
          align-items: center;
          padding: 15px;
          border-bottom: 1px solid white;
          cursor: initial; 
          
          .initials {
            position: initial;
            width: 40px;
            height: 40px;
            background: white;
            color: #252525;
            display: flex;
            justify-content: center;
            align-items: center;
            border-radius: 50%;
            cursor: default;
          }

          .right {
            flex: 1;
            margin-left: 24px;
            cursor: initial;

            p {
              font-size: 12px;
            }
            p:nth-child(1) {
              font-size: 14px;
            }
          }
        }

        .options {
          .option {
            text-decoration: none;
            color: #fff;
            display: flex;
            align-items: center;
            padding: 15px;
            transition: ease all 0.3s;
            cursor: pointer;

            &:hover {
              color: black;
              background-color: white;
            }
            .icon {
              width: 18px;
              height: auto;
            }
            p {
              font-size: 14px;
              margin-left: 12px;
            }
            &:last-child {
              margin-bottom: 0px;
            }

          }
        }
      }


}

.profile-mobile {
  position: absolute;
  top: 7.5px;
  .profile-menu {
    left: -5px;
  }
}

header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 55px;
  z-index: 70;
  background-color: #ececec;
  font-family: 'Montserrat',sans-serif;
  text-align: right;
  box-shadow: 0 6px 10px -1px rgba(0, 0, 0, 0.1), 0 2px 8px -1px rgba(0, 0, 0, 0.06);
  

  .container {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .nav-links {
      padding: 0 15px;

      .menu-item {
        display: inline-block;
        text-align: center;
        &:hover {
          color: #d3b062;
        }
        @extend .link-template
      }
    }
    .login-register {
      padding: 0 15px;

      .menu-item {
        display: inline-block;
        text-align: center;
        @extend .link-template
      }
    }
  }

  .menu-icon {
    cursor: pointer;
    width: auto;
    position: absolute;
    top: 16px;
    right: 25px;
    height: 25px;
  }

  .mobile-nav {
    width: 70%;
    max-width: 250px;
    display: flex;
    flex-direction: column;
    position: fixed;
    height: 100%;
    background-color: #252525 ;
    top: 0;
    left: 0;

    .menu-item {
      display: inline-block;
      text-align: left;
      width: 100%;
      color: #fff;
      padding: 0;

      @extend .link-template
    }

    .oddly-mobile-nav-item {
      padding: 20px;
      transition: ease all 0.3s;
      &:hover {
        background: white;
        color: black;
      }
    }

  }

  .mobile-nav-enter-active,
  .mobile-nav-leave-active {
    transition: all 1s ease;
  }

  .mobile-nav-enter {
    transform: translateX(-250px);
  }

  .mobile-nav-enter-to {
    transform: translateX(0);
  }

  .mobile-nav-leave-to {
    transform: translateX(-250px);
  }
}
</style>