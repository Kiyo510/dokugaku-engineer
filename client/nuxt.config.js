require("dotenv").config()

import axios from "axios"
import qs from 'qs'

export default {
  mode: "spa",
  /*
   ** Headers of the page
   */
  head: {
    title: process.env.npm_package_name || "",
    meta: [{
        charset: "utf-8"
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1, minimum-scale=1"
      },
      {
        hid: "description",
        name: "description",
        content: process.env.npm_package_description || ""
      },
      {
        "http-equiv": "X-UA-Compatible",
        content: "IE=edge"
      },
      {
        name: "twitter:card",
        content: "summary_large_image"
      }
    ],
    script: [{
      src: "https://kit.fontawesome.com/381734123f.js",
      crossorigin: "anonymous"
    }],
    link: []
  },
  /*
   ** Customize the progress-bar color
   */
  loading: {
    color: "#fff"
  },
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    "./plugins/axios.js",
    "./plugins/mixins/validation.js",
    "./plugins/vuelidate.js",
    "./plugins/auth0.js",
    "./plugins/click-outside.js",
  ],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: ["@nuxtjs/dotenv"],
  /*
   ** Nuxt.js modules
   */
  modules: [
    "@nuxtjs/axios",
    "@nuxtjs/style-resources",
    '@nuxtjs/toast',
  ],
  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    extend() {}
  },
  /*
   ** Generate configuration
   */
  generate: {
    async routes() {
      console.log(10)
      console.log(`https://${process.env.AUTH0_DOMAIN}/oauth/token`)
      console.log(process.env.AUTH0_MANAGEMENT_API_CLIENT_ID)
      console.log(process.env.AUTH0_MANAGEMENT_API_CLIENT_SECRET)
      console.log(process.env.AUTH0_MANAGEMENT_API_AUDIENCE)
      console.log(`${process.env.API_URL}/courses`)
      // Machine to mechine用のアクセストークンを取得する
      const data = {
        grant_type: 'client_credentials',
        client_id: process.env.AUTH0_MANAGEMENT_API_CLIENT_ID,
        client_secret: process.env.AUTH0_MANAGEMENT_API_CLIENT_SECRET,
        audience: process.env.AUTH0_MANAGEMENT_API_AUDIENCE
      };
      const options = {
        method: 'POST',
        headers: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        data: qs.stringify(data),
        url: `https://${process.env.AUTH0_DOMAIN}/oauth/token`,
      }
      console.log(11)
      const access_token = await axios(options)
        .then((res) => {
          return res['data']['access_token']
        })

      console.log(12)

      const authorizationOptions = {
        headers: {
          Authorization: `Bearer ${access_token}`
        }
      }

      console.log(13)

      let courses = axios.get(`${process.env.API_URL}/courses`, authorizationOptions)
        .then((res) => {
          return res.data.map((course) => {
            return '/course/' + course.name
          })
        })

      console.log(14)

      let lectures = axios.get(`${process.env.API_URL}/courses/lectures`, authorizationOptions)
        .then((res) => {
          let courseLectures = []
          res.data.forEach(course => {
            course.parts.forEach(part => part.lessons.forEach(lesson => lesson.lectures.forEach(lecture => {
              courseLectures.push('/course/' + course.name + '/lecture/' + lecture.slug)
            })))
          })
          return courseLectures
        })

      console.log(15)

      return Promise.all([courses, lectures]).then(values => {
        return [...values[0], ...values[1]]
      })
    }
  },
  /*
   ** Global CSS
   */
  css: ["ress/dist/ress.min.css", "~assets/styles/app.scss"],
  /*
   ** Global CSS variables
   */
  styleResources: {
    scss: ["~assets/styles/variables.scss"]
  },
  axios: {},
  dotenv: {},
  toast: {
    position: 'top-right',
    register: [{
      name: 'instant_success',
      message: payload => {
        if (!payload.message) return '保存しました'
        return payload.message
      },
      options: {
        type: 'success',
        duration: 3000,
        className: ['toast-success']
      }
    }]
  }
}