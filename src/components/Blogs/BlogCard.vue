<template>
  <div class="blog-card">
    <div class="image">
      <img
      :src="post.blogCoverPhoto" alt=""/>
    </div>
    
    <div class="info">
      <h4><router-link class="link" :to="`blog/`+this.post.blogID">{{ post.blogTitle }} </router-link></h4>
      <h6>Posted on: {{ new Date(post.blogDate).toLocaleString('en-us', { dateStyle: "long" }) }}</h6>
      <router-link class="link" :to="`blog/`+this.post.blogID">
        View The Post <Arrow class="arrow" />
      </router-link>
    </div>
  </div>
</template>

<script>
import Arrow from "../../assets/Icons/arrow-right-light.svg";


export default {
  name: "blogCard",
  props: ["post"],
  components: { Arrow },
  methods: { 

  },

};
</script>

<style lang="scss" scoped>
$darkYellow: #b68723;
.blog-card {
  display: flex;
  flex-direction: column;
  position: relative;
  background-color: #fff;
  min-height: 420px;
  cursor: pointer;
  transition: 0.5s ease all;
  overflow: hidden;

  &:hover {
    box-shadow: 0 6px 10px -1px rgba(0, 0, 0, 0.1), 0 2px 8px -1px rgba(0, 0, 0, 0.06);
  }
  &:hover img {
    transform: scale(1.08);
    object-fit: cover;
  }
  .link:hover {
    color: $darkYellow;
  }

  .image {
    overflow: hidden;
    min-height: 200px;
  }
  img {
    display: block;
    z-index: 1;
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: 0.3s;
  }

  .info{
    display: flex;
    flex-direction: column;
    height: 100%;
    z-index: 3;
    padding: 32px 16px;
    color: #252525;
    h4{
      padding-bottom: 8px;
      font-size: 20px;
      font-weight: 300;
      .link {
        font-weight: 300;
      }
    }
    h6 {
      font-weight: 400;
      font-size: 12px;
      padding-bottom: 16px;
    }
    .link {
      display: inline-flex;
      align-items: center;
      margin-top: auto;
      font-weight: 500;
      padding-top: 20px;
      padding-bottom: 4px;
      transition: 0.3s;
    }
  }
}
</style>
