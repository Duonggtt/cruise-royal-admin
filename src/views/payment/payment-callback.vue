<template>
    <div class="max-w-md mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
      <h1 class="text-3xl font-bold mb-6 text-center text-gray-800">Thông tin giao dịch</h1>
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <tbody class="bg-white divide-y divide-gray-200">
            <tr>
                <td class="text-center px-6 py-4 whitespace-nowrap text-md font-semibold text-gray-700">Trạng thái:</td>
                <td 
                class="text-center px-6 py-4 whitespace-nowrap text-lg" 
                :class="vnp_ResponseCode === '00' ? 'text-green-500' : 'text-red-500'"
                >
                {{ vnp_ResponseCode === '00' ? 'Thanh toán thành công' : 'Thanh toán thất bại' }}
                </td>
            </tr>
            <tr>
              <td class="text-center px-6 py-4 whitespace-nowrap text-md font-semibold text-gray-700">Số tiền:</td>
              <td class="text-center px-6 py-4 whitespace-nowrap text-md text-gray-900">{{ formatCurrency(vnp_Amount /100) }} vnđ</td>
            </tr>
            <tr>
              <td class="text-center px-6 py-4 whitespace-nowrap text-md font-semibold text-gray-700">Ngân hàng:</td>
              <td class="text-center px-6 py-4 whitespace-nowrap text-md text-gray-900">{{ vnp_BankCode }}</td>
            </tr>
            <tr>
              <td class="text-center px-6 py-4 whitespace-nowrap text-md font-semibold text-gray-700">Loại thẻ:</td>
              <td class="text-center px-6 py-4 whitespace-nowrap text-md text-gray-900">{{ vnp_CardType }}</td>
            </tr>
            <tr>
              <td class="text-center px-6 py-4 whitespace-nowrap text-md font-semibold text-gray-700">Thông tin thanh toán:</td>
              <td class="text-center px-6 py-4 whitespace-nowrap text-md text-gray-900">{{ vnp_OrderInfo }}</td>
            </tr>
            <tr>
              <td class="text-center px-6 py-4 whitespace-nowrap text-md font-semibold text-gray-700">Thời gian giao dịch:</td>
              <td class="text-center px-6 py-4 whitespace-nowrap text-md text-gray-900">{{ formattedPayDate }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </template>
  
  <script>
  
  export default {
    name: 'PaymentCallback',
    computed: {
      vnp_Amount() {
        return this.$route.query.vnp_Amount;
      },
      vnp_BankCode() {
        return this.$route.query.vnp_BankCode;
      },
      vnp_CardType() {
        return this.$route.query.vnp_CardType;
      },
      vnp_OrderInfo() {
        return this.$route.query.vnp_OrderInfo;
      },
      vnp_PayDate() {
        return this.$route.query.vnp_PayDate;
      },
      vnp_ResponseCode() {
        return this.$route.query.vnp_ResponseCode;
      },
      formattedPayDate() {
        const payDate = this.vnp_PayDate;
        if (!payDate) return '';
        const year = payDate.substring(0, 4);
        const month = payDate.substring(4, 6);
        const day = payDate.substring(6, 8);
        const hour = payDate.substring(8, 10);
        const minute = payDate.substring(10, 12);
        const second = payDate.substring(12, 14);
        return `${day}/${month}/${year} ${hour}:${minute}:${second}`;
      }
    },
    methods: {
        formatCurrency(value) {
            if (!value) return '';
            return new Intl.NumberFormat('vi-VN').format(value);
        }
    }
  }
  </script>