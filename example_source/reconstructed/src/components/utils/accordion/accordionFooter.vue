<template>
  <div :class="{ accordion: true, 'line-secondary': secondary }">
    <button
      v-if="title"
      :id="'button-' + name"
      :class="{'accordion-row p-relative': true, 'line-secondary': secondary }"
      :style="{
        'transition-duration': transitionTime + 's',
      }"
      @click.prevent="clickAction($event)"
    >
      <h2
        id="p-title"
        :class="{
          'h4 custom-h4 t-primary t-bold t-uppercase no-m d-inline-block': true,
          'apercu-medium': mediumTitle
        }"
        style="max-width: 90%"
      >
        {{ title }}
      </h2>
      <span v-if="showBubble && clientHeight <= 0" class="accordion-arrow-notify-bubble" />
      <img
        :class="{ 'accordion-arrow': true, 'arrow-inner': inner, 'with-notification': true }"
        :style="{
          transform: flipStyle,
        }"
        :src="chevronImage"
				alt="arrow"
      >
    </button>
    <button
      v-else
      :id="'button-' + name"
      class="accordion-row"
      @click="clickAction($event)"
    >
      <slot name="title" />
    </button>
    <div :id="'panel-' + name" class="p-0 panel">
      <slot id="slot-content" class="m-lg" name="content" />
    </div>
  </div>
</template>

<script>
	export default {
		name: 'AccordionFooter',
		props: {
			title: { type: [String, Number], required: false, default: '' },
			mediumTitle: { type: Boolean, required: false, default: false },
			name: { type: String, required: true },
			clickFunction: { type: Function, required: false },
			clickFArg: { required: false },
			transitionTime: { type: String, required: false, default: '1' },
			inner: { type: Boolean, default: false },
			secondary: { type: Boolean, default: false },
			scroll: { type: Boolean, default: false },
			flipMode: { type: Boolean, default: false, required: false },
			chevronImage: { type: String, required: false, default: "https://res.cloudinary.com/pactcoffee/image/upload/v1606843877/website-d2c/assets/kopi/icon/brand-secondary/Pact-icons_Chevron_secondary.svg" },
			showBubble: { type: Boolean, default: false, required: false },
			startOpen: { type: Boolean, default: false, required: false },
		},
		emits: ['resizeaccordion'],
		data() {
			return {
				clientHeight: 0,
			}
		},
		mounted() {
			const script = document.createElement('script')
			script.setAttribute('src', 'https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js')
			document.head.appendChild(script)
      var el = document.getElementById('panel-' + this.name)
      if(!this.startOpen){
        el.style.maxHeight = '0px'
        this.clientHeight = 0
      }else{
        var totalHeight = 0
        el.childNodes.forEach((node) => {
          if (node.clientHeight) totalHeight += node.clientHeight
        })
        this.clientHeight = totalHeight + 60
        el.style.maxHeight = this.clientHeight + 'px'
      }
		},
		computed: {
			flipStyle() {
				var result = ''
				if (!this.flipMode) result = this.clientHeight > 0 ? 'rotate(-180deg)' : 'rotate(0deg)'
				else result = this.clientHeight > 0 ? 'rotate(0deg) scaleY(-1)' : 'rotate(0deg) scaleY(1)'
				return result
			},
		},
		methods: {
			clickAction(event) {
				// eslint-disable-next-line max-len
				if (typeof this.clickFunction === 'function' && this.clickFArg !== undefined) this.clickFunction(this.clickFArg)
				else if (typeof this.clickFunction === 'function') this.clickFunction()
				//
				this.clickUpdateHeight()
				event.isTrusted && this.scroll && setTimeout(this.scrollTo, 1000, '#button-' + this.name)
			},
			// use this function when the contents varies in height (with $refs)
			updateHeight(val) {
				var el = document.getElementById('panel-' + this.name)
				setTimeout(
					function () {
						var totalHeight = 0
						el.childNodes.forEach((node) => {
							if (node.clientHeight) totalHeight += node.clientHeight
						})
						this.clientHeight = totalHeight + val+ 60
						el.style.maxHeight = this.clientHeight + 'px'
					}.bind(this),
					200
				)
			},
			clickUpdateHeight() {
				var el = document.getElementById('panel-' + this.name)
				if (this.clientHeight === 0) {
					setTimeout(
						function () {
							var totalHeight = 0
							el.childNodes.forEach((node) => {
								if (node.clientHeight) totalHeight += node.clientHeight
							})
							this.clientHeight = totalHeight + 60
							el.style.maxHeight = this.clientHeight + 'px'
							this.$emit('resizeaccordion',this.clientHeight)
						}.bind(this),
						200
					)
				} else {
					this.clientHeight = 0
					el.style.maxHeight = '0px'
					//this.$emit('clickaccordion', this.clientHeight)
				}
			},
			scrollTo(query) {
				$('html, body').animate(
					{
						scrollTop: $(query).offset().top - 150,
					},
					1000
				)
			},
		},
	}
</script>
<style lang="scss">
	@use '../../../../assets/sass/inc/default/grid/grid-vue-mixins.scss' as *;
	.custom-h4 {
		@include target-md-lg{
			font-size: 20px;
			line-height: 24px;
			letter-spacing: 1.5px;
		}
	}
	.accordion {
		button {
			p {
				line-height: 100%;
			}
			//border-bottom: 1px solid red;
		}
		&.line-secondary {
			button {
				border-bottom: 1px solid #1d4045;
			}
		}
	}
	.accordion-row {
		color: #1d4045;
		cursor: pointer;
		padding: 15px 0 10px;
		width: 100%;
		border: none;
		text-align: left;
		outline: none;
		transition-duration: 1s;
		font-weight: bold;
	}
	.accordion-arrow {
		position: absolute;
		right: 0px;
		width: 25px;
		display: inline;
		transition-duration: 1.5s;
		&.arrow-inner {
			right: 45px;
		}
	}
	.panel.slide {
		max-height: 1500px;
		transition: max-height 1.5s ease-in;
	}
	.panel {
		padding: 0 18px;
		background-color: white;
		max-height: 0;
		transition: max-height 1.5s ease-out;
		overflow: hidden;
	}
</style>
