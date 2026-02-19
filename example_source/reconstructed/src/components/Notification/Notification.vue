<template>
  <div v-if="!lock" style="position: absolute" :style="{'z-index': zindex}">
    <div
      v-if="countdown > 0"
      :class="{
        'notification t-center d-flex': true,
        [type]: true,
      }"
    >
      <button v-if="dismissible" class="notification-close" @click="turnOff">
        x
      </button>
      <div class="notification-message m-auto" v-html="compileMD()"></div>
    </div>
  </div>
</template>

<script>
	import { mapGetters, mapMutations, mapActions } from 'vuex'
  import { marked } from 'marked'

	export default {
		name: 'Notification',
		props: {
			dismissible: {
				type: Boolean,
				default: true,
        required: false
			},
		},
		computed: {
			...mapGetters('notifications', ['notificationMessage', 'countdown', 'type', 'lock', 'zindex']),
		},
		mounted() {
      this.hideNotification()
		},
		methods: {
			...mapMutations('notifications', ['hideNotification']),
			...mapActions('notifications', ['startCountdown']),
			turnOff() {
				this.hideNotification()
			},
      compileMD(){
			  return marked.parse(this.notificationMessage)
      },
		},
	}
</script>
<style lang="scss">
	.notification {
		margin-bottom: 0;
		padding: 10px 20px;
		position: fixed;
		left: 0;
		z-index: 102; //change from 90 to 9999 in order to overlap modals overlays
		min-height: 50px;
		width: 100%;
		-webkit-box-shadow: 0px 4px 0px 0px rgba(214, 211, 214, 0.2);
		-moz-box-shadow: 0px 4px 0px 0px rgba(214, 211, 214, 0.2);
		box-shadow: 0px 4px 0px 0px rgba(214, 211, 214, 0.2);
    top: 80px;
    @media(max-width: 575px) { top: 60px; }

		&.ok {
			background-color: #3f8a93;
		}
		&.error {
			background-color: #EB5757; // #c41d1d;
		}
    &.voucher-ok {
			background-color: #CBEFE9;
      .notification-message {
        text-align: center;
        p{
          color: #212427;
          font-family: 'Apercu';
          font-size: 14px;
          font-style: normal;
          font-weight: 300;
          line-height: 20px; /* 142.857% */
          letter-spacing: 0px;
          margin-bottom: 0px;
        }
      }
		}
    &.cs{
			background-color: #a6d5d5;
      color: black;
    }
		.notification-close {
			position: absolute;
			top: 0;
			right: 0;
			z-index: 2;
			padding: 0.75rem 1.25rem;
			color: inherit;
			color: #fff;
      font-weight: 700;
		}
	}

	/* Extra small devices (phones, 600px and down) */
	@media only screen and (max-width: 600px) {
		.notification-close,
		.notification-message {
      p{
			  font-size: 14px;
        font-family: 'Apercu';
        font-weight: bold;
        color: #ffffff;
        margin-bottom: 0px;
        letter-spacing: 0;

        >a {
          text-decoration: underline;
          color: var(--link-color) !important;
          cursor: pointer !important;

          &:hover {
            text-decoration: none;
          }
        }
      }
		}
	}

	/* Small devices (portrait tablets and large phones, 600px and up) */
	@media only screen and (min-width: 601px) {
		.notification-close,
		.notification-message {
      p{
  			font-size: 16px;
        font-family: 'Apercu';
        font-weight: bold;
        color: #ffffff;
        margin-bottom: 0px;
        letter-spacing: 0;

        >a {
          text-decoration: underline;
          color: #ffffff !important;
          cursor: pointer !important;

          &:hover {
            text-decoration: none;
          }
        }
      }
		}
	}

	/* Medium devices (landscape tablets, 768px and up) */
	@media only screen and (min-width: 768px) {
		.notification-close,
		.notification-message {
      p{
  			font-size: 17px;
        font-family: 'Apercu';
        font-weight: bold;
        color: #ffffff;
        margin-bottom: 0px;
        letter-spacing: 0;

        >a {
          text-decoration: underline;
          color: #ffffff !important;
          cursor: pointer !important;

          &:hover {
            text-decoration: none;
          }
        }
      }
		}
	}

	/* Large devices (laptops/desktops, 992px and up) */
	@media only screen and (min-width: 992px) {
		.notification-close,
		.notification-message {
      p{
  			font-size: 20px;
        font-family: 'Apercu';
        font-weight: bold;
        color: #ffffff;
        margin-bottom: 0px;
        letter-spacing: 0;

        >a {
          text-decoration: underline;
          color: #ffffff !important;
          cursor: pointer !important;

          &:hover {
            text-decoration: none;
          }
        }
      }
		}
	}
</style>
