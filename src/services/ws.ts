const WS_BASE = import.meta.env.VITE_WS_BASE + '/onMessage' || ''

type MessageHandler = (msg: MessageEvent) => void

class WSService {
  private socket: WebSocket | null = null
  private onMessage: MessageHandler | null = null

  connect(onMessage: MessageHandler) {
    this.onMessage = onMessage
    const token = localStorage.getItem('AUTH_TOKEN')
    
    const params = new URLSearchParams()
    if (token) params.append('token', token)
    params.append('device', 'pc')

    const url = `${WS_BASE}?${params.toString()}`
    
    this.socket = new WebSocket(url)

    this.socket.addEventListener('open', () => {
      console.log('WS connected')
    })
    
    this.socket.addEventListener('message', (msg) => {
      if (this.onMessage) this.onMessage(msg)
    })
    
    this.socket.addEventListener('close', () => {
      console.log('WS closed')
    })
    
    this.socket.addEventListener('error', (err) => {
      console.error('WS error', err)
    })
  }

  send(data: string | ArrayBufferLike | Blob | ArrayBufferView) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(data)
    } else {
      console.warn('WS not connected')
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.close()
      this.socket = null
    }
  }
}

export default new WSService()
