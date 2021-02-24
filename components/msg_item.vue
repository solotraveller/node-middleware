<template>
	<div>
		<span style="float: left;clear: both;">用户名: {{ itemObj.txt }}</span>
			<span style="float: left;clear: both;">{{ itemObj.msg }}</span>
			<input style="float: right;clear: both;" type="button" 
				@click="delData(itemObj._id)" value="删除" />

			<input style="float: right;margin-right: 10px;" type="button" 
				@click="upData(itemObj._id)" value="修改" />

			<input style="float: right;margin-right: 10px;" type="button" 
				v-show="isUpdataBtn"
				@click="upData_no()" value="取消修改" />

			<input style="float: right;margin-right: 10px;" type="button" 
				v-show="isUpdataBtn"
				@click="upData_yes(itemObj._id)" value="确认修改" />

			<!-- 修改框 -->
			<input type="text" style="float: left;" v-model="resultMsg" v-show="isShow" placeholder="请输入修改内容" />
	</div>
</template>

<script>
import axios from 'axios'

export default{
	name: 'msg_item',
	data() {
		return {
			isShow: false,
			isUpdataBtn: false,

			resultMsg: '',
			resultTxt: ''
		}
	},
	// 接收父组件传递的值
	props: ['itemObj'],
	methods: {
		/*
				第一步，获得之前的留言
				第二步，修改内容
		*/
		// 修改按钮 (改)， 根据 id 修改
		upData( _findId ) {
			// console.log( _findId );
			// 修改框显示
			this.isShow = true;

			// 取消、确认修改按钮显示
			this.isUpdataBtn = true;

			axios.get('http://localhost:9090/find_id', {
				params:{ _id : _findId }
			})
				.then(_d => {
					// console.log(_d.data);
					this.resultMsg = _d.data.msg;
					this.resultTxt = _d.data.txt;
				});
		},
		// 更新修改
		upData_yes( _saveId ){
			// console.log( this.resultMsg );

			/*
				在更新的时候，更新整条数据，不是某一个值
				所以要把整个数据所有的属性值，都一次再更新
			*/
			axios.get('http://localhost:9090/save_id', {
				params:{ 
					_id : _saveId,
					txt : this.resultTxt,
					msg : this.resultMsg 
					}
			})
				.then(_d => {
					// console.log(_d.data);
					this.isShow = false;
					this.isUpdataBtn = false;

					this.$emit('getDataFn');
				});
		},
		// 取消修改
		upData_no(){
			// 修改框隐藏
			this.isShow = false;

			// 取消以及确认修改按钮隐藏
			this.isUpdataBtn = false;
		},
		// 删除数据 
		delData(delId) {
			axios.get('http://localhost:9090/del_data', {
				params: {"_id": delId}
			})
				.then(() => {
					// 更新页面
					this.$emit('getDataFn');
				});
		}
		
	}
}
</script>
