<template>
	<transition name="swing">
		<div>
			<x-header></x-header>    
			<div v-transfer-dom>
					<actionsheet  v-model="showMenus" show-cancel></actionsheet>
			</div>
			<img class="_404" src="../../../static/img/undefined.png"/>
		</div>
	</transition>    
</template>

<script>
import { XHeader, Actionsheet, TransferDom} from 'vux'

export default {
	directives: {
			TransferDom
	},
	components: {
			XHeader,
			Actionsheet
	},
	data () {
			return {      
			showMenus: false
			}
	}
}
</script>
<style>
.swing-enter-active {
  animation: pulse 0.8s;
}
.swing-leave-active {
  animation: pulseOut 0.8s;
}

@keyframes pulse {
  from {
    transform: scale3d(1, 1, 1);
  }

  50% {
    transform: scale3d(1.2, 1.2, 1.2);
  }

  to {
    transform: scale3d(1, 1, 1);
  }
}

@keyframes pulseOut {
  from {
    transform: scale3d(1, 1, 1);
  }

  50% {
    transform: scale3d(1.05, 1.05, 1.05);
  }

  to {
    transform: scale3d(0, 0, 0);
  }
}

.swing {
  transform-origin: top center;
  animation-name: swing;
}
</style>


