<template>
  <div id="sidewide-banner">
    <div v-if="showRotatingSitewide">
      <div
        v-if="bannerVisible"
        class="div-banner-text"
        :style="{
          'font-size': bannerContentIsDesktopOrMobile.fontsize + 'px',
          'background-color': bannerContentIsDesktopOrMobile.bgcolor,
          color: bannerContentIsDesktopOrMobile.textcolor,
        }"
      >
        <div v-if="bannerContent.rotating_text_toggle">
          <div class="glide glide--vertical" id="sitewide-glide">
            <div class="glide__track" data-glide-el="track">
              <ul id="slides-container" class="glide__slides">
                <li
                  v-for="text in bannerContentIsDesktopOrMobile.rotating_texts"
                  :key="item"
                  class="glide__slide sitewide-banner-text t-white mb-0 t-center p-2"
                  v-html="compiledCarouselText(text.text)"
                >
                </li>
              </ul>
            </div>
          </div>
        </div>
        <p
          v-else
          :id="bannerIdDesktopOrMobile"
          class="sitewide-banner-text t-white mb-0 t-center p-2"
          v-html="compiledText"
        ></p>
      </div>
    </div>
    <div v-else>
      <div
        v-if="bannerVisible"
        class="desktop div-banner-text"
        :style="{
          'font-size': bannerContent.desktop.fontsize + 'px',
          'background-color': bannerContent.desktop.bgcolor,
          color: bannerContent.desktop.textcolor,
        }"
      >
        <p
          id="sitewide-banner-text-desktop"
          class="t-white mb-0 t-center p-2"
          v-html="compiledDesktopText"
        ></p>
      </div>
      <div
        v-if="bannerVisible"
        class="mobile"
        :style="{
          'font-size': bannerContent.mobile.fontsize + 'px',
          'background-color': bannerContent.mobile.bgcolor,
          color: bannerContent.mobile.textcolor,
        }"
      >
        <p
          id="sitewide-banner-text-mobile"
          class="t-white mb-0 t-center p-2"
          v-html="compiledMobileText"
        ></p>
      </div>
    </div>
  </div>
</template>

<script>
import { marked } from 'marked'
import * as fs from 'fs'
import * as yaml from 'js-yaml'
import cookieHandler from '../utils/cookies/cookieHandler.js'
import { mixinIsMobile } from '../utils/mixins/isMobile'
import Glide from '../../../assets/js/glide.js'
import { useAuthUser } from '../../utils/stores/modules/authUser'
export default {
	name: 'SitewideBanner',
	mixins: [mixinIsMobile],
	data() {
		return {
			sectiondata: {},
			sitewideActive: true,
			accountActive: true,
		}
	},
  props: {
		rotatingsitewide: { type: String, required: false },
  },
  setup(){
    const userStore = useAuthUser()
    return {
      userStore
    }
  },
	computed: {
    isOnline(){
      return this.userStore.isOnline
    },
    showRotatingSitewide() {
      return this.rotatingsitewide === 'true'
    },
		bannerContent() {
			if (Object.keys(this.sectiondata).length === 0) return null
			return this.isInAccount ? this.sectiondata.account : this.sectiondata.sitewide
		},
    bannerContentIsDesktopOrMobile() {
      return this.isMobile ? this.bannerContent.mobile : this.bannerContent.desktop
    },
    bannerIdDesktopOrMobile() {
      return this.isMobile ? 'sitewide-banner-text-mobile' : 'sitewide-banner-text-desktop'
    },
    compiledMobileText() {
			return marked.parse(this.bannerContent?.mobile.text) || ''
		},
		compiledDesktopText() {
			return marked.parse(this.bannerContent?.desktop.text) || ''
		},
		compiledText() {
			return marked.parse(this.bannerContentIsDesktopOrMobile?.text) || ''
		},
		bannerVisible() {
			if (this.isInAccount)
				return (
					this.bannerContent &&
					this.bannerContent.toggle &&
					(this.bannerContent.ispermanent || this.accountActive)
				)
			else
				return (
					this.bannerContent &&
					this.bannerContent.toggle &&
					(this.bannerContent.ispermanent || this.sitewideActive)
				)
		},
		isInAccount() {
			return (
				this.isOnline &&
				(window.location.pathname.includes('/account') ||
					window.location.pathname.includes('/login'))
			)
		},
	},
  methods: {
		compiledCarouselText(text) {
			return marked.parse(text) || ''
		},
  },
	watch: {
		isOnline() {
			if (cookieHandler.getCookie('sitewide-banner')) this.sitewideActive = false
			if (cookieHandler.getCookie('account-banner')) this.accountActive = false
			if (this.isInAccount) cookieHandler.setCookie('account-banner', false, '15d')
			else cookieHandler.setCookie('sitewide-banner', false, '15d')

			setTimeout(function () {
				//const banner = document.getElementById('sitewide-banner')
				if (this.bannerVisible){
        	var hero = document.getElementById('hero-banner')
					// if(hero){
					//   hero.classList.add('sitewide-adjust')
					// }
				}
			}.bind(this), 500)
		},
	},
	mounted() {
		try {
			const fileContents = fs.readFileSync('_data/sitewidebanner/sitewide-banner.yml', 'utf8')
			const data = yaml.safeLoad(fileContents)
			this.sectiondata = data
		} catch (e) {
			console.log('error fething cms info', e)
		}

		if (cookieHandler.getCookie('sitewide-banner')) this.sitewideActive = false
		if (cookieHandler.getCookie('account-banner')) this.accountActive = false
		if (this.isInAccount) cookieHandler.setCookie('account-banner', false, '15d')
		else cookieHandler.setCookie('sitewide-banner', false, '15d')

		setTimeout(function () {
			//const banner = document.getElementById('sitewide-banner')
			if (this.bannerVisible){
        var hero = document.getElementById('hero-banner')
        // if(hero){
        //   hero.classList.add('sitewide-adjust')
        // }
      }
		}.bind(this), 500)

    if(this.showRotatingSitewide && this.bannerContent.rotating_text_toggle) {
      this.$nextTick(() => {
        const slideId = document.getElementById("sitewide-glide")
        const slidesContainer = document.getElementById("slides-container")
        const slides = slidesContainer.querySelectorAll(".glide__slide")
        const countSlides = slides.length
        const perView = 1
        var glide = new Glide("#sitewide-glide", {
          type: "slider",
          autoplay: 5000,
          perView: perView,
          animationDuration: 1500,
          bound: true,
          dragThreshold: false,
          swipeThreshold: false,
          hoverpause: true,
          rewind: true
        }).on("build.after", function () {
          slides.forEach((s) => { // Fix height calculation
            s.style.height = slideId.clientHeight + "px"
          })
          glide.on("run", function () { // Update vertical translation
            var translateY = glide.index * (-100 / perView / (countSlides / perView))
            slidesContainer.style.transform = "translate3d(0, " + translateY + "% , 0)"
          })
        })
        slideId.addEventListener('mouseenter', () => { return glide.pause() })
        slideId.addEventListener('mouseleave', () => { return glide.play() })
        glide.mount()
      })
    }
	},
}
</script>

<style lang="scss">
#sitewide-banner-text-desktop,
#sitewide-banner-text-mobile,
.sitewide-banner-text {
	p {
		margin-bottom: 0px !important;
		a {
			color: white;
			text-decoration: underline;
		}
	}
}
</style>

<style lang="scss" scoped>
  #sitewide-glide {
    height: 40px;
    z-index: 10;
    position: relative;

    &.glide { overflow: hidden; }
    &.glide--vertical {
      .glide__slides {
        width: auto;
        flex-direction: column;
        transform: translate3d(0, 0, 0); /* Reset transform */
      }
      .glide__slide { display: block; }
    }

    .glide__track { display: flex; }
    .glide__slides {
      display: flex;
      flex-direction: column;
    }
  }
</style>