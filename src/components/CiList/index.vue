<template>
  <div class="cinema_body">
    <Loading v-if="isLoading"/>
    <Scroller v-else>
    <ul>
      <li v-for="item in cinemaList" :key="item.id">
        <div>
          <span>{{ item.nm }}</span>
          <span class="q">
            <span class="price">{{ item.sellPrice}}</span> 元起
          </span>
        </div>
        <div class="address">
          <span>{{ item.addr }}</span>
          <span>{{ item.distance }}</span>
        </div>
        <div class="card">
          <div v-for="(num,key) in item.tag" v-if="num===1" :key="key" :class="key | classCard">{{ key | formatCard }}</div>
        </div>
        
      </li >
      <!-- <li>
        <div>
          <span>大地影院(澳东世纪店)</span>
          <span class="q">
            <span class="price">22.9</span> 元起
          </span>
        </div>
        <div class="address">
          <span>金州区大连经济技术开发区澳东世纪3层</span>
          <span>1763.5km</span>
        </div>
        <div class="card">
          <div>小吃</div>
          <div>折扣卡</div>
        </div>
      </li>
      <li>
        <div>
          <span>大地影院(澳东世纪店)</span>
          <span class="q">
            <span class="price">22.9</span> 元起
          </span>
        </div>
        <div class="address">
          <span>金州区大连经济技术开发区澳东世纪3层</span>
          <span>1763.5km</span>
        </div>
        <div class="card">
          <div>小吃</div>
          <div>折扣卡</div>
        </div>
      </li>
      <li>
        <div>
          <span>大地影院(澳东世纪店)</span>
          <span class="q">
            <span class="price">22.9</span> 元起
          </span>
        </div>
        <div class="address">
          <span>金州区大连经济技术开发区澳东世纪3层</span>
          <span>1763.5km</span>
        </div>
        <div class="card">
          <div>小吃</div>
          <div>折扣卡</div>
        </div>
      </li>
      <li>
        <div>
          <span>大地影院(澳东世纪店)</span>
          <span class="q">
            <span class="price">22.9</span> 元起
          </span>
        </div>
        <div class="address">
          <span>金州区大连经济技术开发区澳东世纪3层</span>
          <span>1763.5km</span>
        </div>
        <div class="card">
          <div>小吃</div>
          <div>折扣卡</div>
        </div>
      </li>
      <li>
        <div>
          <span>大地影院(澳东世纪店)</span>
          <span class="q">
            <span class="price">22.9</span> 元起
          </span>
        </div>
        <div class="address">
          <span>金州区大连经济技术开发区澳东世纪3层</span>
          <span>1763.5km</span>
        </div>
        <div class="card">
          <div>小吃</div>
          <div>折扣卡</div>
        </div>
      </li>
      <li>
        <div>
          <span>大地影院(澳东世纪店)</span>
          <span class="q">
            <span class="price">22.9</span> 元起
          </span>
        </div>
        <div class="address">
          <span>金州区大连经济技术开发区澳东世纪3层</span>
          <span>1763.5km</span>
        </div>
        <div class="card">
          <div>小吃</div>
          <div>折扣卡</div>
        </div>
      </li> -->
    </ul>
    </Scroller>
  </div>
</template>

<script>
export default {
  name: "ciList",
  data() {
    return {
      cinemaList: [],
      isLoading: true,
      prevCityId: -1
    }
  },
  filters: {
    formatCard(key) {
      var card = [
        {key: 'allowRefund', value: '改签'},
        {key: 'endorse', value: '退'},
        {key: 'sell', value: '折扣卡'},
        {key: 'snack', value: '小吃'},
      ];
      for(var i = 0; i < card.length; i++) {
        if(card[i].key === key) {
          return card[i].value;
        }
      }
      return '';
    },
    classCard(key){
            var card = [
                { key : 'allowRefund' , value : 'bl' },
                { key : 'endorse' , value : 'bl' },
                { key : 'sell' , value : 'or' },
                { key : 'snack' , value : 'or'}
            ];
            for(var i=0;i<card.length;i++){
                if(card[i].key === key){
                    return card[i].value;
                }
            }
            return '';
        }

  },
  activated() {
    // 获取缓存中的城市id
    var cityId = this.$store.state.city.id;
    // 当前点击后的id与缓存id作比较，如果一样，那么说明没有切换城市，那么无需重新发起ajax请求
    if(this.prevCityId === cityId) {
      return;
    }
    // 数据刷新前的Loading
    this.isLoading = true;
    this.axios.get('/api/cinemaList?cityId='+cityId).then((res) => {
      var msg = res.data.msg;
      if(msg === 'ok') {
        this.cinemaList = res.data.data.cinemas;
        this.isLoading = false;
        this.prevCityId = cityId;
        // console.log(this.cinemaList)
      }
    })
  }
};
</script>

<style scoped>
/* #content .cinema_menu{ width: 100%; height: 45px; border-bottom:1px solid #e6e6e6; display: flex; justify-content:space-around; align-items:center; background:white;} */
#content .cinema_body{ flex:1; overflow:auto;}
.cinema_body ul{ padding:20px;}
.cinema_body li{  border-bottom:1px solid #e6e6e6; margin-bottom: 20px;}
.cinema_body div{ margin-bottom: 10px;}
.cinema_body .q{ font-size: 11px; color:#f03d37;}
.cinema_body .price{ font-size: 18px;}
.cinema_body .address{ font-size: 13px; color:#666;}
.cinema_body .address span:nth-of-type(2){ float:right; }
.cinema_body .card{ display: flex;}
.cinema_body .card div{ padding: 0 3px; height: 15px; line-height: 15px; border-radius: 2px; color: #f90; border: 1px solid #f90; font-size: 13px; margin-right: 5px;}
.cinema_body .card div.or{ color: #f90; border: 1px solid #f90;}
.cinema_body .card div.bl{ color: #589daf; border: 1px solid #589daf;}
</style>