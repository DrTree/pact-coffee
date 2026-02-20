<template>
	<div>
		<form action="https://api.ometria.com/forms/signup" method="post" class="subscribe-newsletter container">
			<input type="hidden" name="__form_id" :value="form_value" />
			<input type="hidden" name="email" value="" autocomplete="off" />
			<div style="display: none !important">
				<input name="__email" type="email" value="" autocomplete="off" />
			</div>
			<input name="@account" type="hidden" :value="ometria_id" />
      <input name="@return_url" type="hidden" :value="return_url" />
			<input name="@subscription_status" type="hidden" value="SUBSCRIBED" />
			<input name="@add_to_lists[]" type="hidden" :value="list_value" />
			<input name="properties.signup_source" type="hidden" value="footer" />

			<!-- Form elements go here: Style as you wish -->
			<div class="row mx-0">
				<input
					v-model="email"
					type="text"
					:class="{ 'col-12 col-sm-9 my-1 b-none': true }"
					placeholder="Email Address"
					name="ue"
          style="height: 40px; border-radius: 5px;"
				/>
				<div class="col-12 col-sm-3 my-1 pl-sm-2 px-0">
					<button
						type="submit"
						:class="{ 'btn btn-primary-secondary-txt t-uppercase hand-pointer full-width': true, locked: email === '' }"
						name="submit"
					>
						Sign up
					</button>
				</div>
			</div>

			<!-- End of form elements -->
		</form>
	</div>
</template>

<script>
	import { mapActions } from 'vuex'
	export default {
		name: 'NewsletterForm',
		data() {
			return {
				email: '',
				check: false,
				ometria_id_qa: 'eef9f8da13a01c91',
				list_qa_value: ['3288'],
				ometria_id_production: 'bf77bf311decb37c',
				list_production_value: ['10235'],
			}
		},
		computed: {
			list_value() {
				return process.env.NODE_ENV === 'production' ? this.list_production_value : this.list_qa_value
			},
			ometria_id() {
				return process.env.NODE_ENV === 'production' ? this.ometria_id_production : this.ometria_id_qa
			},
			form_value() {
				return '60d96f274a8e2f989e8c9c2254d78c89'
			},
      return_url(){
        return window.location.href ? window.location.href : ''
      }
		},
		watch: {
			email: function (newValue) {
				if (newValue === '') this.check = false
			},
		},
		mounted() {
			var urlParams = new URLSearchParams(window.location.search)
			if (urlParams.get('ometria_form_ok') === 'Y' && ( !urlParams.has('nw') || urlParams.get('nw') !== 'no')) {
				this.showNotification({ message: 'Thanks for signing up!', timer: 5, type: 'ok' })
			}
		},
		methods: {
			...mapActions('notifications', ['showNotification']),
		},
	}
</script>

<style lang="scss">
	.locked {
		pointer-events: none;
	}

	#newsletter-form {
		.btn {
			height: 40;
			-webkit-border-radius: 5px;
			-moz-border-radius: 5px;
			-ms-border-radius: 5px;
			border-radius: 5px;
			min-width: 95px;
			position: relative;
			right: 0;
			top: 0;
			line-height: 40px;
		}
	}
</style>
