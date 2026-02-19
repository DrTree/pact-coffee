import { onMounted, ref } from 'vue'
import { Cloudinary } from '@cloudinary/url-gen'
// by convention, composable function names start with 'use'
// https://cloudinary.com/documentation/sdks/js/url-gen/index.html#Setup
export function useCloudinaryHelpers() {
	// state encapsulated and managed by the composable
	const cld = ref(null)
	const cloudName = ref(process.env.NODE_ENV === 'production' ? process.env.CLOUDINARY_CLOUD_NAME : 'pactcoffee-dev')
	const noImg = 'https://res.cloudinary.com/pactcoffee/image/upload/v1597850071/website-d2c/assets/kopi/not-found.png'

	function optimizeImage(url) {
		if (cld.value) {
			// Use the image with url
      // https://cloudinary.com/documentation/javascript_image_transformations#specifying_the_delivery_type
			const cld_image = cld.value.image(url).setDeliveryType('fetch')

			// Request automatic format and quality.
      // https://cloudinary.com/documentation/javascript_image_transformations#image_optimizations
			cld_image.format('auto').quality('auto')

			return cld_image.toURL()
		} else return noImg
	}

	onMounted(() => {
		cld.value = new Cloudinary({
			cloud: {
				cloudName: cloudName.value,
			},
		})
		// To remove the background hack
		//this.setWidth()
		//window.addEventListener('resize', this.setWidth)
	})
	// expose managed state as return value
	return { optimizeImage }
}
