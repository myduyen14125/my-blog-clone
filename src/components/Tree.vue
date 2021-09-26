<template>
  <li v-if="mobileNav && (user || data.showUnauth)" class="nav-item mobile-nav-item">
    <div class="mobile-nav-item-name" @click="changeRoute">{{ data.content }} </div>
    <div v-if="mobileNav && data.child.length !== 0" class="toggle-tree"  @click="toggleSubNavMobile"> <i class="fas fa-angle-down"></i> </div>
    <TreeContents 
      :mobileNav="mobileNav"
      :children="data.child" 
      :class="{'sub-nav-mobile': data.child.length !== 0 }"
      v-show="subNavMobile | mobileNav === false"
    />
  </li>
  <li v-else-if="(user || data.showUnauth)" class="nav-item" @click="changeRoute">
    <span>{{ data.content }}</span>
    <TreeContents
      :mobileNav="mobileNav"
      :children="data.child" 
      :class="{'sub-nav': data.child.length !== 0 }"
      v-show="subNavMobile | mobileNav === false"
    />
  </li>
</template>

<script>
import TreeContents from "./Tree-content.vue";
export default {
  name: "tree",
  props: ["data" , "mobileNav"],
  components: {
    TreeContents,
  },
  data () {
    return {
      subNavMobile : false,
    }
  },
  computed: {
    user() {
      return this.$store.state.user
    }
  },
  methods: {
    changeRoute() {
      this.$router.push(this.data.link)
      if(this.mobileNav)
        this.$store.commit("toggleMobileNav")
    },
    toggleSubNavMobile() {
      this.subNavMobile = !this.subNavMobile
    }
  }
};
</script>

<style lang="scss" scoped>

.nav-item:hover .sub-nav {
  display: block;
}
.mobile-nav-item {
  display: flex !important;
  align-items: center;
  flex-direction: row;
  flex-wrap: wrap;
  height: auto;

  div {
    transition: ease all 0.3s;
    &:hover {
      background: white;
      color: black;
    }
  }

  .mobile-nav-item-name {
    flex: 5;
    padding: 20px;
    box-sizing: border-box;
  }

  .toggle-tree {
    height: 56px;
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
  }

}



.sub-nav {
  display: none;
  position: absolute;
  top: 90%;
  left: calc(-109px + 50%);
  list-style: none;
  width: 218px;
  background-color: #fff;
  border: 2px solid #d3b062;
  color: #000;

  &::before {
    content: "";
    left: calc(50% - 5px);
    position: absolute;
    z-index: 1;
    background-color: #fff;
    width: 10px;
    height: 10px;
    transform: rotate(-45deg);
    border: 1px solid #d3b062;
    top:-5px;
  }
}

.sub-nav-mobile {
  position: relative;
  list-style: none;
  color: #fff;
  left: 20px;
}

</style>