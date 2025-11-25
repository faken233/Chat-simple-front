<template>
  <div class="chat-layout">
    <aside class="sidebar">
      <div class="sidebar-header">
        <span>聊天</span>
        <button class="btn small" @click="logout">注销</button>
      </div>
      
      <div class="tabs">
        <button :class="['tab', { active: activeTab === 'room' }]" @click="activeTab = 'room'">房间</button>
        <button :class="['tab', { active: activeTab === 'user' }]" @click="activeTab = 'user'">用户</button>
      </div>

      <div v-if="activeTab === 'room'" class="tab-content">
        <div class="room-actions">
          <input v-model="newRoomName" placeholder="新建房间名" />
          <button class="btn" @click="createRoom">创建</button>
        </div>
        <ul class="list">
          <li 
            v-for="r in rooms" 
            :key="r.id" 
            @click="selectTarget(r.id, 'room')" 
            :class="['item', { active: currentTargetId === r.id && currentTargetType === 'room' }]"
          >
            {{ r.name || ('房间 ' + r.id) }}
          </li>
        </ul>
      </div>

      <div v-else class="tab-content">
        <!-- 示例用户列表，实际应从接口获取 -->
        <ul class="list">
          <li 
            v-for="u in users" 
            :key="u.username" 
            @click="selectTarget(u.username, 'user')" 
            :class="['item', { active: currentTargetId === u.username && currentTargetType === 'user' }]"
          >
            {{ u.username }}
          </li>
        </ul>
      </div>
    </aside>
    <section class="chat-area">
      <div class="chat-header">
        {{ currentTargetType === 'room' ? '房间' : '用户' }}: {{ currentTargetId || '未选择' }}
      </div>
      <div class="messages" ref="msgBox">
        <div v-for="m in messages" :key="m.id" class="message">
          <div class="meta">{{ m.fromUserId || '用户' }} · {{ m.clientTime || '' }}</div>
          <div class="body">{{ m.message }}</div>
        </div>
      </div>
      <div class="composer">
        <input v-model="outgoing" placeholder="输入消息并回车发送" @keyup.enter="sendMessage" />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import api from '../services/api'
import wsService from '../services/ws'
import type { ApiResponse, Room, Message, User } from '../types'

const router = useRouter()
const rooms = ref<Room[]>([])
const users = ref<User[]>([
  { username: 'user1', phone: '123' }, // 模拟数据
  { username: 'user2', phone: '456' }
])
const newRoomName = ref('')

const activeTab = ref<'room' | 'user'>('room')
const currentTargetId = ref<string | number | null>(null)
const currentTargetType = ref<'room' | 'user'>('room')

const messages = ref<Message[]>([])
const outgoing = ref('')
const msgBox = ref<HTMLElement | null>(null)

onMounted(async () => {
  // 获取公共资源或房间 r1（示例）
  try {
    await api.get('/room/r1')
    // TODO: 业务：这里可以根据接口返回更新 rooms（保留为空实现细节）
    // 模拟房间数据
    rooms.value = [{ id: 1, name: '公共大厅' }, { id: 2, name: '摸鱼群' }]
  } catch (e) {
    console.warn('获取初始房间失败', e)
  }


  // 连接 WebSocket
  wsService.connect((msg: MessageEvent) => {
    // TODO: ws 服务收到消息后的处理逻辑——留空，按提示词要求保留空白实现点
    // 例如：解析 msg.type 并分发到不同处理器
    // TODO: WebSocket 消息处理逻辑
    try {
      const payload = JSON.parse(msg.data)
      messages.value.push(payload)
      nextTick(() => {
        if (msgBox.value) {
          msgBox.value.scrollTop = msgBox.value.scrollHeight
        }
      })
    } catch (err) {
      console.warn('WS 非 JSON 消息', msg)
    }
  })
})

const createRoom = async () => {
  try {
    const res = await api.post<ApiResponse<boolean>>('/room/create', {
      name: newRoomName.value,
      description: '',
      avatar: ''
    })
    if (res.data.data) {
      alert('创建成功')
      // TODO: 可刷新房间列表
    } else {
      alert('创建失败')
    }
  } catch (err: any) {
    alert('创建房间出错：' + (err.message || err))
  }
}

const selectTarget = async (id: string | number, type: 'room' | 'user') => {
  currentTargetId.value = id
  currentTargetType.value = type
  messages.value = [] // 切换时清空消息，实际应加载历史消息

  if (type === 'room') {
    // 加入房间逻辑
    try {
      await api.post('/room/join', null, { params: { roomId: id } })
      // TODO: 业务：加入房间后的一些处理
    } catch (e) {
      console.error('加入房间失败', e)
    }
  }

  // TODO: 调用接口获取未读消息/历史消息
  // await fetchHistory(id, type)
}

const sendMessage = () => {
  if (!outgoing.value) return
  const payload: Message = {
    messageType: 1,
    message: outgoing.value,
    fromUserId: undefined, // TODO: 实际应填当前用户ID
    targetId: typeof currentTargetId.value === 'number' ? currentTargetId.value : 0, // TODO: 暂定
    clientTime: Date.now()
  }
  wsService.send(JSON.stringify(payload))
  outgoing.value = ''
}

const logout = () => {
  localStorage.removeItem('AUTH_TOKEN')
  wsService.disconnect()
  router.push('/login')
}

onBeforeUnmount(() => {
  wsService.disconnect()
})
</script>
