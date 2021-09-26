import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import Login from "../views/Login.vue"
import Register from "../views/Register.vue"
import ResetPassword from "../views/ResetPassword.vue"
import Profile from "../views/Profile.vue"

import Blogs from "../views/Blogs.vue"
import ViewBlog from "../views/ViewBlog.vue"
import EditBlog from "../views/EditBlog.vue"

import CreatePost from "../views/CreatePost.vue"
import BlogPreview from "../views/BlogPreview.vue"
// import { component } from "vue/types/umd";
Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/Login",
    name: "Login",
    component: Login,
  },
  {
    path: "/Register",
    name: "Register",
    component: Register,
  },
  {
    path: "/ResetPassword",
    name: "ResetPassword",
    component: ResetPassword,
  },
  {
    path: "/blogs",
    name: "Blogs",
    component: Blogs,
  },
  {
    path: "/blog/:blogID",
    name: "ViewBlog",
    component: ViewBlog,
    meta: {
      title: "View Blog Post",
    }
  },
  {
    path: "/edit-blog/:blogID",
    name: "EditBlog",
    component: EditBlog,
    meta: {
      title: "Edit Blog Post",
    }
  },
  {
    path: "/CreatePost",
    name: "CreatePost",
    component: CreatePost,
  },
  {
    path: "/Post-Preview",
    name: "BlogPreview",
    component: BlogPreview,
  },
  {
    path: "/profile",
    name: "Profile",
    component: Profile
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
