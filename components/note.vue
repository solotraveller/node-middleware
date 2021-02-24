<template>
	<div class="noteClass">
		<h3> {{ message }} </h3>
		<input type="button" @click="getData" value="访问测试接口" />
		<input type="button" @click="getData2" value="访问MongoDB数据" />
		<!-- <h3> {{ v_data }} </h3> -->

		<div class="list" v-for="(n, index) in v_data">
			<label style="float: left;clear: both;">第{{ ++index }}条</label>
			<msg_item 
				:itemObj = n 
				@getDataFn="getData2" />
		</div>
		
		<div style="margin: 20px 0;">
			用户名:<input type="text" v-model="v_name" />
		</div>
		<div style="margin: 20px 0;">
			留&nbsp;&nbsp;&nbsp;言:<input type="text" v-model="v_msg" />
		</div>
			<input type="button" @click="insertFn" value="增加留言" />

		<div style="margin: 20px 0;">
			<input type="text" v-model="v_searchVal" />
			<input type="button" @click="searchBtn" value="搜索按钮" />
		</div>

		<div>
			搜索结果：{{ v_searchResult }}
		</div>
	</div>
</template>

<script>
import axios from 'axios'
import msg_item from './msg_item'

export default{
	name: 'note',
	data() {
		return {
			message: 'note记事本',
			v_data: '',
			v_name: '',
			v_msg: '',
			v_searchVal: '',
			v_searchResult: ''
		}
	},
	components: {msg_item},
	created() {
		this.getData2();
	},
	methods: {
		// 获取测试接口数据
		getData() {
			axios.get('http://localhost:9090/text')
				.then(_d => {
					console.log(_d.data);
				});
		},
		// 获取MongoDB数据,接口
		getData2() {
			axios.get('http://localhost:9090/search_data')
				.then(_d => {
					// console.log(_d.data);
					this.v_data = _d.data;
				});
		},
		// 插入数据
		insertFn() {
			let _msgObj = {
				txt : this.v_name,
				msg : this.v_msg
			}

			axios.get('http://localhost:9090/insert_data', {
				params : _msgObj
			})
				.then(() => {
					// 更新页面
					this.getData2();
					this.v_name = '';
					this.v_msg = '';
				});
		},
		// 搜索按钮
		searchBtn() {
			// console.log(this.v_searchVal);
			axios.get('http://localhost:9090/find_data', {
				params: {_txt: this.v_searchVal}
			})
				.then((_d) => {
					// 更新页面
					// this.getData2();
					// console.log(_d.data.txt);
					if(_d.data.txt === undefined){
						console.log("用户不存在");
						this.v_searchResult = "用户不存在!";
					} else {
						console.log(_d.data.txt);
						this.v_searchResult = _d.data.msg;
					}
				});
		}

	}
}
</script>

<style scoped>
*{
	margin: 0;
	padding: 0;
}
.list{
	background-color: #ddd;
	margin: 10px 0;
	padding: 0 10px;
	overflow: hidden;
}
label, span{
	display: block;
}
</style>
