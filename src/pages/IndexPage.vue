<template>
  <div id="app">
    <div class="index-page">
      <a-input-search
        v-model:value="searchParams.text"
        placeholder="请输入搜索内容"
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

const router = useRouter(); //路由导航
const route = useRoute(); //获取当前页面信息
const activeKey = route.params.category; //动态路由
//初始化搜索参数添加分页参数
const initSearchParams = {
  text: "",
  pageSize: 10,
  pageNum: 1,
};

const postList = ref([]); //文章列表
const userList = ref([]); //用户列表
const pictureList = ref([]); //图片列表
//加载数据 一次性加载过期
const loadDataOld = (params: any) => {
  const postQuery = {
    ...params,
    searchText: params.text,
  };
  myAxios.post("/post/list/page/vo", postQuery).then((res: any) => {
    postList.value = res.records;
  });
  const userQuery = {
    ...params,
    userName: params.text,
  };
  myAxios.post("/user/list/page/vo", userQuery).then((res: any) => {
    userList.value = res.records;
  });
  const pictureQuery = {
    ...params,
    searchText: params.text,
  };
  myAxios.post("/picture/list/page/vo", pictureQuery).then((res: any) => {
    pictureList.value = res.records;
  });
};

/**
 * 加载数据
 * @param params
 */
const loadData = (params: any) => {
  const query = {
    ...params,
    searchText: params.text,
  };
  myAxios.post("/search/all", query).then((res: any) => {
    postList.value = res.postList;
    userList.value = res.userList;
    pictureList.value = res.pictureList;
  });
};

//搜索参数
const searchParams = ref(initSearchParams);
//首次请求
loadData(initSearchParams);

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
  loadData(searchParams.value);
};

const onTabChange = (key: string) => {
  router.push({
    path: `/${key}`,
    query: searchParams.value,
  });
};
</script>
