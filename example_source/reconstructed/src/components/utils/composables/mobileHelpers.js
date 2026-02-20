import { ref, onBeforeMount, onBeforeUnmount } from 'vue'
// by convention, composable function names start with 'use'
export function useMobileHelpers() {
	// state encapsulated and managed by the composable
	const isMobile = ref(false)
	const isMobileXxs = ref(false)
	const isMobileSm = ref(false)
	const isMobileXsSm = ref(false)
	const isTablet = ref(false)
	const isTabletMd = ref(false)
	const isTabletLg = ref(false)
	const isDesktopXl = ref(false)
	const isDesktopXxl = ref(false)
	const isLargeScreen = ref(false)

	function onResize() {
    isMobileXxs.value = window.innerWidth < 576 // Used in PLPElementNoBg -> change name to MobileXS in the future
		isMobile.value = window.innerWidth < 992
		isMobileSm.value = window.innerWidth < 576
		isMobileXsSm.value = window.innerWidth <= 767
		isTablet.value = window.innerWidth >= 768 && window.innerWidth <= 1199
		isTabletMd.value = window.innerWidth >= 768 && window.innerWidth <= 991
		isTabletLg.value = window.innerWidth >= 992 && window.innerWidth <= 1199
		isDesktopXl.value = window.innerWidth >= 1200 && window.innerWidth <= 1499
		isDesktopXxl.value = window.innerWidth >= 1500
		isLargeScreen.value = window.innerWidth > 1900
	}
	onBeforeMount(() => {
		onResize()
		window.addEventListener('resize', onResize, { passive: true })
	})
	onBeforeUnmount(() => {
		if (typeof window !== 'undefined') {
			window.removeEventListener('resize', onResize, { passive: true })
		}
	})
	// expose managed state as return value
	return { isMobile, isMobileXxs, isMobileSm, isMobileXsSm, isLargeScreen, isTablet, isTabletMd, isTabletLg, isDesktopXl, isDesktopXxl }
}
