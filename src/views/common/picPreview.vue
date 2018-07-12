<template>
    <div class="pic-preview-box" :style="{'backgroundImage':'url('+this.backgroundPicUrl+')'}">
        
        <div class="wap">
            <img style="width:100%;height:100%" :src="backgroundPicUrl" :data-original="backgroundPicUrl" alt="">
            <!-- <i :src="backgroundPicUrl" :data-original="backgroundPicUrl" class="el-icon-view"></i> -->
        </div>
    </div>
</template>
<script>
export default {
    props:{
		backgroundPicUrl:{
            type:String,
            default:''
	    }
	},
    data(){
        return {
            backgroundStyleObj:{
                backgroundImage: 'url('+this.backgroundPicUrl+')'
            }
        }
    },
    methods:{
        previewImg(){
            if(!this.backgroundPicUrl){
                this.$message({
                    message:'图片src不存在',
                    type:'error  .'
                })
                return;
            }
            this.$alert('<img style="width:100%" src="'+this.backgroundPicUrl+'">', '预览图', {
                dangerouslyUseHTMLString: true
            }).catch(err => {
                
            })
        }
    }
}
</script>
<style scoped>
    .pic-preview-box{
        display: inline-block;
        width: 148px!important;
        height: 148px;
        border-radius: 5px;
        overflow:hidden;
        position: relative;
        cursor: pointer;
        margin-right: 20px;
        box-shadow: 0px 0px 10px #666;
        background-position: center;
        background-size: cover;
        background-repeat: no-repeat
    }
    .pic-preview-box .wap{
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      background: rgba(0,0,0,.5);
      text-align: center;
      opacity: 0;
      transition: all .5s;
    }
    .pic-preview-box .wap i{
      color: #f1f1f1;
      font-size: 18px;
      line-height: 148px;
      position: absolute;
      left: 50%;
      top: 0;
      margin-left:-9px;
    }
    .pic-preview-box:hover .wap{opacity: 1;}
</style>



