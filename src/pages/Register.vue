<template>
  <div class="card auth-card">
    <h2>注册</h2>
    <form @submit.prevent="register" class="form">
      <label>用户名
        <input v-model="username" placeholder="请输入用户名" />
      </label>
      <label>手机号
        <input v-model="phone" placeholder="请输入手机号" />
      </label>
      <label>密码
        <input v-model="password" type="password" placeholder="请输入密码" />
      </label>
      <div class="actions">
        <button type="submit" class="btn primary">注册</button>
        <button type="button" class="btn" @click="$router.push('/login')">去登录</button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '../services/api'
import type { ApiResponse } from '../types'

const router = useRouter()
const username = ref('')
const phone = ref('')
const password = ref('')

const register = async () => {
  try {
    const res = await api.post<ApiResponse<boolean>>('/user/register', {
      username: username.value,
      phone: phone.value,
      password: password.value
    })
    if (res.data.data) {
      alert('注册成功，请登录')
      router.push('/login')
    } else {
      alert('注册失败')
    }
  } catch (err: any) {
    alert('注册出错：' + (err.message || err))
  }
}
</script>
