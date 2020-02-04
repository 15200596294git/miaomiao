<template>
  <div class="city_body">
    <div class="city_list">
      <div class="city_hot">
        <h2>热门城市</h2>
        <ul class="clearfix">
          <li v-for="hotCity in hotList" :key="hotCity.id"> {{ hotCity.nm }}</li>
          <!-- <li>北京</li>
          <li>上海</li>
          <li>北京</li>
          <li>上海</li>
          <li>北京</li>
          <li>上海</li>
          <li>北京</li> -->
        </ul>
      </div>
      <div class="city_sort" ref="city_sort">
        <div v-for="cities in cityList" :key="cities.indexs">
          <h2>{{ cities.index }}</h2>
          <ul>
            <li v-for="city in cities.list" :key="city.id"> {{ city.nm }}</li>
            <!-- <li>鞍山</li>
            <li>安庆</li>
            <li>安阳</li> -->
          </ul>
        </div>
        <!-- <div>
          <h2>B</h2>
          <ul>
            <li>北京</li>
            <li>保定</li>
            <li>蚌埠</li>
            <li>包头</li>
          </ul>
        </div>
        <div>
          <h2>A</h2>
          <ul>
            <li>阿拉善盟</li>
            <li>鞍山</li>
            <li>安庆</li>
            <li>安阳</li>
          </ul>
        </div>
        <div>
          <h2>B</h2>
          <ul>
            <li>北京</li>
            <li>保定</li>
            <li>蚌埠</li>
            <li>包头</li>
          </ul>
        </div>
        <div>
          <h2>A</h2>
          <ul>
            <li>阿拉善盟</li>
            <li>鞍山</li>
            <li>安庆</li>
            <li>安阳</li>
          </ul>
        </div>
        <div>
          <h2>B</h2>
          <ul>
            <li>北京</li>
            <li>保定</li>
            <li>蚌埠</li>
            <li>包头</li>
          </ul>
        </div> -->
      </div>
    </div>
    <div class="city_index">
      <ul>
        <li v-for="(item,index) in cityList" :key="item.index" @touchstart="handleToIndex(index)"> {{ item.index}} </li>
        <!-- <li>A</li>
        <li>B</li>
        <li>C</li>
        <li>D</li>
        <li>E</li> -->
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
      hotList: []
    }
  },
  mounted() {
    this.axios.get("/api/cityList").then(res => {
      console.log(res);
      var msg = res.data.msg;
      if (msg === "ok") {
        var cities = res.data.data.cities;
        var { cityList, hotList} = this.formatCityList(cities);
        this.cityList = cityList;
        this.hotList = hotList;
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
    // 获取到循环列表中的h2(跳到h2标签部分)
    var h2 = this.$refs.city_sort.getElementsByTagName('h2');
    // console.log(h2[index].offsetTop)
    this.$refs.city_sort.parentNode.scrollTop = h2[index].offsetTop;
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