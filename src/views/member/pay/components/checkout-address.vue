<template>
  <div class="checkout-address">
    <div class="text">
      <div v-if="!showAddress" class="none">您需要先添加收货地址才可提交订单。</div>
      <ul v-if="showAddress">
        <li><span>收<i />货<i />人：</span>{{ showAddress.receiver }}</li>
        <li><span>联系方式：</span>{{ showAddress.contact.replace(/^(\d{3})\d{4}(\d{4})$/,'$1****$2') }}</li>
        <li><span>收货地址：</span>{{ showAddress.fullLocation.replace(/ /g,'') }}{{ showAddress.address }}</li>
      </ul>
      <a @click="openAddressEdit(showAddress)" v-if="showAddress" href="javascript:;">修改地址</a>
    </div>
    <div class="action">
      <tm-button @click="openDialog" class="btn">切换地址</tm-button>
      <tm-button @click="openAddressEdit({})" class="btn">添加地址</tm-button>
    </div>
  </div>
  <!-- 切换收货地址区域 -->
  <tm-dialog title="切换收货地址" v-model:visible="visibleDialog">
    <div @click="selectedAddress = item" :class="{ active: selectedAddress && selectedAddress.id === item.id }" class="text item" v-for="item in list" :key="item.id">
      <ul>
        <li><span>收<i />货<i />人：</span>{{ item.receiver }}</li>
        <li><span>联系方式：</span>{{ item.contact.replace(/^(\d{3})\d{4}(\d{4})$/,'$1****$2') }}</li>
        <li><span>收货地址：</span>{{ item.fullLocation.replace(/ /g,'') + item.address }}</li>
      </ul>
    </div>
    <template #footer>
      <tm-button @click="visibleDialog = false" type="gray" style="margin-right: 20px;">取消</tm-button>
      <tm-button @click="confirmAddressFn" type="primary">确认</tm-button>
    </template>
  </tm-dialog>
  <!-- 收货地址添加和编辑组件 -->
  <address-edit @on-success="successHandler" ref="addressEditRef" />
</template>

<script>
import { ref, watch } from 'vue'
import AddressEdit from './address-edit'
export default {
  name: 'CheckoutAddress',
  components: { AddressEdit },
  props: {
    // 收货地址列表。
    list: {
      type: Array,
      default: () => []
    }
  },
  // 1、在拥有根元素的组件中，触发自定义事件，有没有 emits 选项无所谓；
  // 2、在拥有代码片段的组件中，vue3.0 规范，需要在 emits 中申明所触发的自定义事件。
  emits: ['change'],
  setup (props, { emit }) {
    // 1、找到默认收货地址；2、没有默认收货地址，使用第一条收货地址；3、如果没有数据，提示添加收货地址。
    const showAddress = ref(null)
    // const defaultAddress = props.list.find(item => item.isDefault === 0)
    // if (defaultAddress) {
    //   showAddress.value = defaultAddress
    // } else {
    //   if (props.list.length) {
    //     // 加上一个注释：忽略下面代码 eslint 的检查。
    //     // eslint-disable-next-line vue/no-setup-props-destructure
    //     showAddress.value = props.list[0]
    //   }
    // }
    watch(
      () => props.list,
      newVal => {
        const defaultAddress = props.list.find(item => item.isDefault === 0)
        if (defaultAddress) {
          showAddress.value = defaultAddress
        } else {
          if (props.list.length) {
            // 加上一个注释：忽略下面代码 eslint 的检查。
            // eslint-disable-next-line vue/no-setup-props-destructure
            showAddress.value = props.list[0]
          }
        }
      },
      { immediate: true }
    )

    // 默认通知父组件一个收货地址 ID。
    emit('change', showAddress.value && showAddress.value.id)

    // 切换地址对话框的显示隐藏。
    const visibleDialog = ref(false)

    // 对话框的开启事件。
    const openDialog = () => {
      // 将之前的选中地址改成 null。
      selectedAddress.value = null
      visibleDialog.value = true
    }

    // 记录当前选中的地址 ID。
    const selectedAddress = ref(null)

    // 对话框的确认按钮事件。
    const confirmAddressFn = () => {
      // 显示的地址换成已选中的地址。
      showAddress.value = selectedAddress.value
      // 把已选中的地址 ID 通知给结算组件。
      // emit('change', selectedAddress.value && selectedAddress.value.id)
      emit('change', selectedAddress.value?.id)
      visibleDialog.value = false
    }

    // 打开添加编辑收货地址组件。
    const addressEditRef = ref(null)
    const openAddressEdit = address => {
      // address：添加 {}  修改 { 数据 }。
      addressEditRef.value.open(address)
    }

    const successHandler = formData => {
      // 根据 formData 中的地址 ID 去当前地址列表中查找，有就是修改，否则是添加。
      const address = props.list.find(item => item.id === formData.id)
      if (address) {
        for (const key in address) {
          address[key] = formData[key]
        }
      } else {
        const jsonStr = JSON.stringify(formData)
        // eslint-disable-next-line vue/no-mutating-props
        props.list.unshift(JSON.parse(jsonStr))
      }
    }

    return { showAddress, visibleDialog, selectedAddress, confirmAddressFn, openDialog, openAddressEdit, addressEditRef, successHandler }
  }
}
</script>

<style scoped lang="less">
.tm-dialog {
  .text {
    flex: 1;
    min-height: 90px;
    display: flex;
    align-items: center;
    &.item {
      border: 1px solid #f5f5f5;
      margin-bottom: 10px;
      cursor: pointer;
      &.active,
      &:hover {
        border-color: @tmColor;
        background: lighten(@tmColor, 50%);
      }
      > ul {
        padding: 10px;
        font-size: 14px;
        line-height: 30px;
      }
    }
  }
}
.checkout-address {
  border: 1px solid #f5f5f5;
  display: flex;
  align-items: center;
  .text {
    flex: 1;
    min-height: 90px;
    display: flex;
    align-items: center;
    .none {
      line-height: 90px;
      color: #999;
      text-align: center;
      width: 100%;
    }
    > ul {
      flex: 1;
      padding: 20px;
      li {
        line-height: 30px;
        span {
          color: #999;
          margin-right: 5px;
          > i {
            width: 0.5em;
            display: inline-block;
          }
        }
      }
    }
    > a {
      color: @tmColor;
      width: 160px;
      text-align: center;
      height: 90px;
      line-height: 90px;
      border-right: 1px solid #f5f5f5;
    }
  }
  .action {
    width: 420px;
    text-align: center;
    .btn {
      width: 140px;
      height: 46px;
      line-height: 44px;
      font-size: 14px;
      &:first-child {
        margin-right: 10px;
      }
    }
  }
}
</style>
