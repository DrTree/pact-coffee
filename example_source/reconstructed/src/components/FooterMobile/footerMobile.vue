<template>
	<div id="mobile-footer-accordion" class="col-12 row mx-0 px-0 mobile-xs">
		<accordion-footer
			v-for="(column, j) in sectionData['leftcolumns']"
			class="col-12 col-sm-6 px-0 px-sm-2"
			:key="j"
			:scroll="true"
			:name="column.columntitle.replace(' ', '-')"
			:transitionTime="'0.7'"
			:secondary="true"
			:flipMode="true"
			:title="column.columntitle"
			:chevronImage="'/assets/icons/orange/chevron_down.svg'"
		>
			<template #content>
				<ul class="pb-1">
					<li v-for="(line, i) in column.links" :key="i" class="pb-2">
						<a :href="line.url" class="t-capitalize t-white">{{ line.display }}</a>
					</li>
				</ul>
			</template>
		</accordion-footer>
	</div>

	<div class="desktop-xs row mx-0 justify-content-between">
		<!-- TABLET PT-1 -->
		<div id="tablet-footer-accordion-pt1" class="col-6 row ml-0 pl-0">
			<div 
				v-for="(column, j) in sectionData['leftcolumns']"
				class="col-12 pl-0 pr-md-1"
				:key="j"
			>
				<accordion-footer
					v-if="j < 2"
					:scroll="true"
					:name="column.columntitle.replace(' ', '-')+'-tbl'"
					:transitionTime="'0.7'"
					:secondary="true"
					:flipMode="true"
					:title="column.columntitle"
					:chevronImage="'/assets/icons/orange/chevron_down.svg'"
				>
					<template #content>
						<ul class="pb-1">
							<li v-for="(line, i) in column.links" :key="i" class="pb-2">
								<a :href="line.url" class="t-capitalize t-white">{{ line.display }}</a>
							</li>
						</ul>
					</template>
				</accordion-footer>
			</div>
		</div>
		<!-- TABLET PT-2 -->
		<div id="tablet-footer-accordion-pt2" class="col-6 row mr-0 pr-0">
			<div 
				v-for="(column, j) in sectionData['leftcolumns']"
				class="col-12 pr-0 pl-md-1"
				:key="j"
			>
				<accordion-footer
					v-if="j >= 2"
					:scroll="true"
					:name="column.columntitle.replace(' ', '-')+'-tbl'"
					:transitionTime="'0.7'"
					:secondary="true"
					:flipMode="true"
					:title="column.columntitle"
					:chevronImage="'/assets/icons/orange/chevron_down.svg'"
				>
					<template #content>
						<ul class="pb-1">
							<li v-for="(line, i) in column.links" :key="i" class="pb-2">
								<a :href="line.url" class="t-capitalize t-white">{{ line.display }}</a>
							</li>
						</ul>
					</template>
				</accordion-footer>
			</div>
		</div>
		<!-- END TABLET -->
	</div>
</template>

<script>
import AccordionFooter from '../utils/accordion/accordionFooter.vue'
import * as yaml from 'js-yaml'
import * as fs from 'fs'
export default {
	name: 'FooterMobile',
	components: {
		AccordionFooter,
	},
	data() {
		return {
			sectionData: {},
			currentOpened: null,
		}
	},
	mounted() {
		try {
			const fileContents = fs.readFileSync('_data/footer.yml', 'utf8')
			this.sectionData = yaml.safeLoad(fileContents)
		} catch (e) {
			console.log('error fething cms info', e)
		}
	},
	methods: {
		clickFunction(id) {
			if (this.currentOpened === id) this.currentOpened = null
			else {
				if (this.currentOpened != null) {
					var button_mbl = document.getElementById(
						'button-' 
						+ this.sectionData.leftcolumns[this.currentOpened].columntitle.replace(
							' ',
							'-'
						)
					)
					var button_tbl = document.getElementById(
						'button-' 
						+ this.sectionData.leftcolumns[this.currentOpened].columntitle.replace(
							' ',
							'-'
						+'-tbl'
						)
					)
					button_mbl && button_mbl.click()
					button_tbl && button_tbl.click()
				}
				this.currentOpened = id
			}
		},
	},
}
</script>

<style lang="scss">
@use '../../../assets/sass/inc/default/grid/grid-vue-mixins.scss' as *;


#mobile-footer-accordion,
#tablet-footer-accordion-pt1,
#tablet-footer-accordion-pt2 {
	margin-bottom: 20px;
	.accordion .card { 
		background-color: #1d4045;
		border-top: none;
		border-bottom: solid 1px grey;

		.card-content div ul { margin: 0; }
		.card-content div ul li { margin-bottom: 12px; }
		.card-content div ul li a { color: white; }
		.card-header .card-header-icon svg > * { fill: white !important; }
		.card-active .card-header .card-header-icon svg > * { fill: #ffaa2b !important; }
	}

	.panel.slide {
		max-height: 500px;
		transition: all 1s ease-in;
	}
	.panel {
		padding: 0;
		background-color: #1d4045;
		max-height: 0;
		transition: all 1s ease-in-out;
		-webkit-transition: all 1s ease-in-out;
		-moz-transition: all 1s ease-in-out;
		-ms-transition: all 1s ease-in-out;
		-o-transition: all 1s ease-in-out;
		overflow: hidden;

		ul {
			margin-bottom: 15px;
			margin-top: 20px;

			li {
				a {
					display: block;
					color: $white;
					text-transform: capitalize;
					font-size: 14px;
					letter-spacing: 0.5px;
					padding-bottom: 5px;

          @include target-md{
  					font-size: 18px;
          }

					&:hover {
						@include transform(translateX(10px));
					}

					&:hover,
					&:focus,
					&:active,
					&.active {
						color: $brand-primary;
					}
				}
			}
		}
	}
	.accordion-row {
		color: white;
		cursor: pointer;
		padding: 20px 0px;
		border: none;
		text-align: left;
		outline: none;
		font-weight: bold;

		&.line-secondary {
			border-top: none;
			border-bottom: 1px solid $brand-secondary-light-blue;
		}
	}

	.accordion-arrow {
		top: 27px;
		width: 18px;

		@include target-xl {
			top: 31px;
			width: 33px;
		}
	}

	.accordion {
		button {
			p {
				line-height: 100%;
			}
		}
		border: none;
	}
}
</style>
