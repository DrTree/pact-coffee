<template>
	<div :class="{ 'delivery-bar main': true, [customization]: true }">
		<div
			:class="{ 'delivery-bar inner': true, [customization]: true, complete: complete }"
			:style="delivery_fill"
		></div>
	</div>
</template>

<script setup>
	import { computed, toRefs } from 'vue'
	// Props (defineProps)
	const props = defineProps({
		complete: {
			type: Boolean,
			required: false,
			default: false,
		},
		filled: {
			type: Number,
			required: false,
			default: 0,
		},
		customization: {
			type: String,
			required: false,
			default: 'delivery',
		},
	})
	// Emits (defineEmits)
	// Reactive variables (inc composables)
	const { complete, filled, customization } = toRefs(props)
	// Computed
	const delivery_fill = computed(() => {
		return 'width:' + filled.value + '%;'
	})
	// Methods
	// Watchers
	// Lifecycle Hooks
	// Expose (defineExpose)
</script>

<style lang="scss" scoped>
	.delivery-bar {
		height: 15px;
		width: 100%;
		&.main {
			z-index: 1;
		}
		&.inner {
			z-index: 2;
		}
		&.delivery {
			border-radius: 100px;
			&.main {
				background-color: #ebebeb;
			}
			&.inner {
				background-image: linear-gradient(
					-45deg,
					#1d4045 25%,
					#4A666A 25%,
					#4A666A 50%,
					#1d4045 50%,
					#1d4045 75%,
					#4A666A 75%,
					#4A666A
				);
				animation: animateBar 1s linear infinite;
				background-size: 15px 15px;
				&.complete {
					background-image: linear-gradient(
						-45deg,
						#ffad32 25%,
						#FFBD5B 25%,
						#FFBD5B 50%,
						#ffad32 50%,
						#ffad32 75%,
						#FFBD5B 75%,
						#FFBD5B
					);
				}
			}
		}
	}

	@keyframes animateBar {
		0% {
			background-position: -15px 0;
		}

		100% {
			background-position: 0 0;
		}
	}
</style>
