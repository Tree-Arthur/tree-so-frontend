<template>
  <div id="app">
    <div class="index-page">
      <a-input-search
        v-model:value="searchParams.text"
        placeholder="input search text"
        enter-button="Search"
        size="large"
        @search="onSearch"
      />
    </div>
    <my-divider />
    <a-tabs v-model:activeKey="activeKey" @change="onTabChange">
      <a-tab-pane key="post" tab="文章">
        <PostList :post-list="postList" />
      </a-tab-pane>
      <a-tab-pane key="picture" tab="图片">
        <PictureList :picture-list="pictureList" />
      </a-tab-pane>
      <a-tab-pane key="user" tab="用户">
        <UserList :user-list="userList" />
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script setup lang="ts">
import { ref, watchEffect } from "vue";
import PostList from "@/components/PostList.vue";
import PictureList from "@/components/PictureList.vue";
import UserList from "@/components/UserList.vue";
import MyDivider from "@/components/MyDivider.vue";
import { useRoute, useRouter } from "vue-router";
import myAxios from "@/plugins/myAxios";

const postList = ref([]); //文章列表
myAxios.post("/post/list/page/vo", {}).then((res: any) => {
  postList.value = res.records;
});

const userList = ref([]); //用户列表
myAxios.post("/user/list/page/vo", {}).then((res: any) => {
  userList.value = res.records;
});

const pictureList = ref([]); //图片列表
myAxios.post("/picture/list/page/vo", {}).then((res: any) => {
  pictureList.value = res.records;
});

const router = useRouter(); //路由导航
const route = useRoute(); //获取当前页面信息
const activeKey = route.params.category; //动态路由
//初始化搜索参数添加分页参数
const initSearchParams = {
  text: "",
  pageSize: 10,
  pageNum: 1,
};
//搜索参数
const searchParams = ref(initSearchParams);
//监听这个函数发生改变就执行
watchEffect(() => {
  searchParams.value = {
    ...initSearchParams,
    text: route.query.text,
  } as any;
});
//点击搜索事件
const onSearch = (value: string) => {
  alert(value);
  router.push({
    query: searchParams.value,
  });
};

const onTabChange = (key: string) => {
  router.push({
    path: `/${key}`,
    query: searchParams.value,
  });
};
</script>
