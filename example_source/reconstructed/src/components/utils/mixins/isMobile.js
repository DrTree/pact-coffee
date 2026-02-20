export var mixinIsMobile = {
	data() {
		return {
			isMobile: false,
      isMobileSm: false,
      isMobileXsSm: false,
			isLargeScreen: false,
			isTablet: false
		}
	},

	beforeDestroy() {
		if (typeof window !== 'undefined') {
			window.removeEventListener('resize', this.onResize, { passive: true })
		}
	},

	beforeMount() {
		this.onResize()
		window.addEventListener('resize', this.onResize, { passive: true })
	},

	methods: {
		onResize() {
			this.isMobile = window.innerWidth < 992
			this.isMobileSm = window.innerWidth < 577
      this.isMobileXsSm = window.innerWidth <= 767
			this.isLargeScreen = window.innerWidth > 1900
			this.isTablet = window.innerWidth >= 768 && window.innerWidth <= 1199
		},
	},
}
