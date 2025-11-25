<template>
  <div class="card auth-card">
    <h2>登录</h2>
    <form @submit.prevent="login" class="form">
      <label>手机号
        <input v-model="phone" placeholder="请输入手机号" />
      </label>
      <label>密码
        <input v-model="password" type="password" placeholder="请输入密码" />
      </label>
      <div class="actions">
        <button type="submit" class="btn primary">登录</button>
        <button type="button" class="btn" @click="$router.push('/register')">注册</button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '../services/api'
import type { ApiResponse, LoginResult } from '../types'

const router = useRouter()
const phone = ref('')
const password = ref('')

const login = async () => {
  try {
    const res = await api.post<ApiResponse<LoginResult>>('/user/login', {
      phone: phone.value,
      password: password.value
    })
    const token = res.data.data?.token
    if (token) {
      localStorage.setItem('AUTH_TOKEN', token)
      router.push('/chat')
    } else {
      alert('登录失败：未收到 token')
    }
  } catch (err: any) {
    alert('登录出错：' + (err.message || err))
  }
}
</script>
