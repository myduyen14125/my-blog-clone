<template>
  <ul>
    <li v-for="(item, index) in children"  :key="index" 
      :class="[( mobileNav === false ) ? 'sub-item' : 'sub-mobile-item']">
      <tree-folder v-if="item.children" :data="item" />
      <span v-else>{{ item.content }}</span>
    </li>
  </ul>
</template>

<script>
export default {
  name: "treeContents",
  props: ["children", "mobileNav"],
  data() {
    return {
    };
  },
};
</script>

<style lang="scss" scoped>
.sub-item {
  text-align: center;
  padding: 12px 10px;
  cursor: pointer;
  position: relative;

  &::before {
    content: "";
    position: absolute;
    width: 70%;
    height: 1px;
    background-color: #d3b062;
    left: 30px;
    top: 100%;
  }

  &:hover {
    color: #d3b062;
  }
}

.sub-mobile-item {
  padding: 14px 10px;
  cursor: pointer;
  position: relative;

  &:hover {
    color: #d3b062;
  }
}

</style>