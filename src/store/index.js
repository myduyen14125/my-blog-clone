import Vue from 'vue'
import Vuex from 'vuex'

import firebase from 'firebase/app'
import 'firebase/auth'
import db from '../firebase/firebaseInit'


Vue.use(Vuex)

export default new Vuex.Store({
  state: { 
    user: null,
    profileAdmin: null,
    profileEmail: null,
    profileFirstName: null,
    profileLastName: null,
    profileUsername: null,
    profileId: null,
    profileInitials: null,

    file: null,
    blogHTML : "Write your blog title here...",
    blogTitle: "",
    blogPhotoName: "",
    blogPhotoFileURL: null,
    blogPhotoPreview: null,
    
    mobileNav : null,

    blogPosts: [],
    postLoaded: null,
    editPost: null,
  },
  getters: {
    blogPostsFeed(state) {
      return state.blogPosts.slice(0, 2);
    },
    blogPostsCards(state) {
      return state.blogPosts.slice(2, 6);
    }
  },
  mutations: {
    setMobileNav(state, payload) {
      state.mobileNav = payload
    },
    toggleMobileNav (state) {
      state.mobileNav = !state.mobileNav
    },
  
    updateUser(state, payload) {
      state.user = payload
    },
    setProfileInfo(state, doc) {
      state.profileId = doc.id;
      state.profileEmail = doc.data().email
      state.profileFirstName = doc.data().firstName
      state.profileLastName = doc.data().lastName
      state.profileUsername = doc.data().username
    },
    setProfileInitials(state) {
      state.profileInitials =
        state.profileFirstName.match(/(\b\S)?/g).join("") + state.profileLastName.match(/(\b\S)?/g).join("");
    },

    toggleEditPost(state, payload) {
      state.editPost = payload
    },
    setBlogState(state, payload) { //contain the edit-blog page with data of blogpost
      state.blogTitle = payload.blogTitle;
      state.blogHTML = payload.blogHTML;
      state.blogPhotoFileURL = payload.blogCoverPhoto;
      state.blogPhotoName = payload.blogCoverPhotoName;
    },
    filterBlogPost(state, payload) {
      state.blogPosts = state.blogPosts.filter(post => post.blogID !== payload)
    },
    newBlogPost(state, payload) {
      state.blogHTML = payload;
    },
    updateBlogTitle(state, payload) {
      state.blogTitle = payload;
    },
    updateFile(state, payload) {
      state.file = payload;
    },
    fileNameChange(state, payload) {
      state.blogPhotoName = payload;
    },
    createFileURL(state, payload) {
      state.blogPhotoFileURL = payload;
    },
    openPhotoPreview(state) {
      state.blogPhotoPreview = !state.blogPhotoPreview;
    },
    setDefaultBlogPost (state) {
      state.blogTitle = "",
      state.blogPhotoName = "",
      state.blogHTML = "Write your blog title here..." ,
      state.file = null,
      state.blogPhotoFileURL = null,
      state.blogPhotoPreview = null
    },
    changeFirstName(state, payload) {
      state.profileFirstName = payload;
    },
    changeLastName(state, payload) {
      state.profileLastName = payload;
    },
    changeUsername(state, payload) {
      state.profileUsername = payload;
    },
  },
  actions: {
    async getCurrentUser({commit}) {
      const dataBase = await db.collection('users').doc(firebase.auth().currentUser.uid)
      const dbResults = await dataBase.get()
      commit("setProfileInfo", dbResults)
      commit("setProfileInitials")
      console.log(this.state.user)
    },
    async getPost({ state }) {
      const dataBase = await db.collection('blogPosts').orderBy('date', 'desc');
      const dbResults = await dataBase.get();
      dbResults.forEach((doc) => {
        if (!state.blogPosts.some(post => post.blogID === doc.id)) {
          const data = {
            blogID: doc.data().blogID,
            blogHTML: doc.data().blogHTML,
            blogCoverPhoto: doc.data().blogCoverPhoto,
            blogTitle: doc.data().blogTitle,
            blogDate: doc.data().date,
            blogCoverPhotoName: doc.data().blogCoverPhotoName,
            profileId : doc.data().profileId
          };
          state.blogPosts.push(data);
        }
        state.postLoaded = true;
      });
    },
    async updatePost({ commit, dispatch }, payload) {
      commit("filterBlogPost", payload);
      await dispatch("getPost");
    },
    async deletePost({ commit }, payload) {
      const getPost = await db.collection("blogPosts").doc(payload);
      await getPost.delete();
      commit('filterBlogPost', payload);
    },
    async updateUserSettings({ commit, state }) {
      const dataBase = await db.collection("users").doc(state.profileId);
      await dataBase.update({
        firstName: state.profileFirstName,
        lastName: state.profileLastName,
        username: state.profileUsername,
      });
      commit("setProfileInitials");
    },
  },
  modules: {}
})