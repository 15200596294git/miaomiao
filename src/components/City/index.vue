<template>
  <div class="city_body">
    
    <div class="city_list">
      <Loading v-if="isLoading"/>
      <Scroller v-else ref="city_list">
      <div>
      <div class="city_hot">
        <h2>热门城市</h2>
        <ul class="clearfix">
          <li v-for="hotCity in hotList" :key="hotCity.id" @tap="handleToCity(hotCity.nm,hotCity.id)"> {{ hotCity.nm }}</li>
        </ul>
      </div>
      <div class="city_sort" ref="city_sort">
        <div v-for="cities in cityList" :key="cities.indexs">
          <h2>{{ cities.index }}</h2>
          <ul>
            <li v-for="city in cities.list" @tap="handleToCity(city.nm,city.id)" :key="city.id"> {{ city.nm }}</li>
          </ul>
        </div>
      </div>
      </div>
      </Scroller>
    </div>
    <div class="city_index">
      <ul>
        <li v-for="(item,index) in cityList" :key="item.index" @touchstart="handleToIndex(index)"> {{ item.index}} </li>
      </ul>
    </div>
    <div style="overflow: hidden;"></div>
  </div>
</template>

<script>
export default {
  name: "city",
  data() {
    return {
      cityList: [],
      hotList: [],
      isLoading: true
    }
  },
  mounted() {

    // 如果有本地存储，用本地存储
    var cityList = window.localStorage.getItem('cityList');
    var hotList = window.localStorage.getItem('hotList');
    // 如果在缓存中两者都有缓存，那么启用缓存中的数据
    if(cityList && hotList) {
      this.cityList = JSON.parse(cityList);
      this.hotList = JSON.parse(hotList);
      this.isLoading = false;
    }
    this.axios.get("/api/cityList").then(res => {
      console.log(res);
      var msg = res.data.msg;
      if (msg === "ok") {
        this.isLoading = false;
        var cities = res.data.data.cities;
        var { cityList, hotList} = this.formatCityList(cities);
        this.cityList = cityList;
        this.hotList = hotList;
        // 数据请求之后进行本地缓存
        window.localStorage.setItem('cityList',JSON.stringify(cityList));
        window.localStorage.setItem('hotList',JSON.stringify(hotList));
      }
		});
  },
  methods: {
    // {index: 首字母,list: [nm: '广州',id: 123]}
    formatCityList(cities) {
      var cityList = [];
      var hotList = [];

      // 循环拿到热门城市
      for(var i = 0; i < cities.length; i++) {
        // 如果为1，就是热门城市
        if(cities[i].isHot ===1) {
          hotList.push(cities[i]);
        }
      }

     // 循环服务器返回数据，拿到第一个字母
     for(var i = 0; i < cities.length; i++) {
        var firstLetter = cities[i].py.substring(0,1).toUpperCase();
        if(toCom(firstLetter)) {
          // 如果不存在这个字母，手动添加
          cityList.push({ index: firstLetter, list: [ { nm: cities[i].nm, id: cities[i].id} ]});
        } else {
          // 如果为false,(存在)
          // 将与之相符的首字母添加到对应数组中
          for( var j = 0; j < cityList.length; j++) {
            if(cityList[j].index === firstLetter) {
              cityList[j].list.push({ nm: cities[i].nm, id: cities[i].id} );
            }
          }
        }
      }
      cityList.sort((n1,n2) => {
         return n1.index > n2.index ? 1 : -1;
      });

      // 创建一个函数，验证字母是否存在于cityList数组中
      function toCom(firstLetter) {
        // 循环cityList
        for(var i = 0; i < cityList.length; i++) {
          if(firstLetter === cityList[i].index) {
            return false;
          }
        }
        return true;
      }
      console.log(cityList)
      return {
        cityList,
        hotList
      }
    },
    handleToIndex(index) {
      console.log(index)
    // 获取到循环列表中的h2(跳到h2标签部分)
    var h2 = this.$refs.city_sort.getElementsByTagName('h2');
    // console.log(h2[index].offsetTop)
    this.$refs.city_list.toScrollTop(-h2[index].offsetTop);
    // this.$refs.city_sort.parentNode.parentNode.parentNode.scrollTop = h2[index].offsetTop;
    },
    handleToCity(nm,id) {
      // console.log(nm,id)
      // 修改vuex中的数据
      this.$store.commit('city/CITY_INFO',{nm,id});
      window.localStorage.setItem('nowNm',nm);
      window.localStorage.setItem('nowId',id);
      this.$router.push('/movie/nowPlaying');
    }
  }
};
</script>

<style scoped>
#content .city_body {
  margin-top: 45px; display: flex; width:100%; position: absolute; top: 0; bottom: 0;
  /* min-height: 1550px; */
}
.city_body .city_list {
  flex: 1;
  overflow: auto;
  background: #fff5f0;
}
.city_body .city_list::-webkit-scrollbar {
  background-color: transparent;
  width: 0;
}
.city_body .city_hot {
  margin-top: 20px;
}
.city_body .city_hot h2 {
  padding-left: 15px;
  line-height: 30px;
  font-size: 14px;
  background: #f0f0f0;
  font-weight: normal;
}
.city_body .city_hot ul li {
  float: left;
  background: #fff;
  width: 29%;
  height: 33px;
  margin-top: 15px;
  margin-left: 3%;
  padding: 0 4px;
  border: 1px solid #e6e6e6;
  border-radius: 3px;
  line-height: 33px;
  text-align: center;
  box-sizing: border-box;
}
.city_body .city_sort div {
  margin-top: 20px;
}
.city_body .city_sort h2 {
  padding-left: 15px;
  line-height: 30px;
  font-size: 14px;
  background: #f0f0f0;
  font-weight: normal;
}
.city_body .city_sort ul {
  padding-left: 10px;
  margin-top: 10px;
}
.city_body .city_sort ul li {
  line-height: 30px;
  
}
.city_body .city_index {
  width: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
  border-left: 1px #e6e6e6 solid;
}
</style>