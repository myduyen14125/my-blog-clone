<template>
  <div class="home">
    <BlogPost :post="welcomeScreen" />
    <BlogPost :post="post" v-for="(post, index) in blogPostsFeed" :key="index" />
    <div class="blog-card-wrap">
      <div class="container">
        <h3 @click="$router.push({ path: '/blogs'})">Xem thêm những blogs gần đây <Arrow class="arrow"/></h3>
        <div class="blog-cards">
          <BlogCard :post="post" v-for="(post, index) in blogPostsCards" :key="index" />
        </div>
      </div>
    </div>
    <div v-if="!user" class="updates">
      <div class="container">
        <h2>Never miss a post. Register for your  free account today!</h2>
        <router-link class="router-button" to="/Register">
          Register for FireBlogs <Arrow class="arrow-light" style="color: white;"/>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import BlogPost from "../components/Blogs/BlogPost.vue"
import BlogCard from "../components/Blogs/BlogCard.vue"
import Arrow from "../assets/Icons/arrow-right-light.svg";
export default {
  name: "Home",
  components: { BlogPost, BlogCard, Arrow },
  data() {
    return {
      welcomeScreen: {
        title: "WELCOME!",
        blogPost: "Mình là hehe. Chào mừng bạn đến với blog của mình. Đây là nơi mình thường xuyên chia sẻ về những câu chuyện nho nhỏ trong đời sống thường ngày của mình. Mình tin rằng, hạnh phúc đến từ những điều giản dị nhất. Hi vọng bạn sẽ tìm thấy được sự bình yên và một chút niềm vui khi đọc blog của mình.",
        welcomeScreen: true,
        photo: "minimalism",
      },      
    }
  },
  computed: {
    blogPostsFeed(){
      return this.$store.getters.blogPostsFeed;
    },
    blogPostsCards(){
      return this.$store.getters.blogPostsCards;
    },
    user() {
      return this.$store.state.user
    }
  }
};
</script>

<style lang="scss" scoped>
.blog-card-wrap {
  h3 {
    display: block;
    background-color: #fff;
    width: fit-content;
    padding: 10px 35px;
    font-weight: 300;
    font-size: 26px;
    margin-bottom: 32px;
    cursor: pointer;
    transition: 0.3s;
    &:hover {
      color: black;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    }
    &:hover .arrow{
      transform: translateX(15px);
    }
  }
  .arrow {
    width: 16px;
    transition: 0.4s;
  }
}
.updates {
  .container {
    padding: 100px 25px;
    display: flex;
    flex-direction: column;
    align-items: center;
    @media (min-width:800px) {
      padding: 125px 25px;
      flex-direction: row;
    }

    .router-button {
      display: flex;
      font-size: 14px;
      text-decoration: none;
      @media (min-width:800px) {
        margin-left: auto;
      }
    }

    h2 {
      font-size: 32px;
      font-weight: 300;
      max-width: 425px;
      width: 100%;
      text-transform: uppercase;
      text-align: center;
      @media (min-width:800px) {
        text-align: initial;
        font-size: 40px;
      }
    }
  }
}
</style>