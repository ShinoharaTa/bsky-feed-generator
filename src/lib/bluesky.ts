import { browser } from '$app/environment'
import { goto } from '$app/navigation'
import { AtpAgent } from '@atproto/api'
import type { AtpSessionData} from '@atproto/api'
import { writable, type Writable } from 'svelte/store'

export interface SessionState {
  isLoggedIn: boolean
  handle?: string
  error?: string
}

export class Bluesky {
  private agent: AtpAgent
  public sessionStore: Writable<SessionState>
  private initializationPromise: Promise<boolean>

  constructor() {
    this.agent = new AtpAgent({
      service: 'https://bsky.social',
      persistSession: (evt, sess) => {
        if(evt === "create" || evt === "update"){
          localStorage.setItem('bsky-session', JSON.stringify(sess))
        }
        else {
          this.logout();
        }
      }
    })

    this.sessionStore = writable({
      isLoggedIn: false
    })
    this.initializationPromise = this.initializeSession()
  }

  private async initializeSession(): Promise<boolean> {
    if (!browser) return false
    try {
      const savedSession = localStorage.getItem('bsky-session')
      if (!savedSession) {
        throw new Error("Session Nothing.")
      }

      const session = JSON.parse(savedSession) as AtpSessionData
      await this.agent.resumeSession(session)

      this.sessionStore.set({
        isLoggedIn: true,
        handle: this.agent.session?.handle
      })
      return true
    } catch (error) {
      console.error('Session initialization error:', error)
      localStorage.removeItem('bsky-session')
      await this.agent.logout()

      this.sessionStore.set({
        isLoggedIn: false,
        error: error instanceof Error ? error.message : 'Session initialization failed'
      })

      goto("/login")
      return false
    }
  }

  async login(identifier: string, password: string): Promise<{ success: boolean; error?: string }> {
    try {
      await this.agent.login({
        identifier,
        password
      })

      this.sessionStore.set({
        isLoggedIn: true,
        handle: this.agent.session?.handle
      })

      return { success: true }
    } catch (error) {
      console.error('Login error:', error)
      const errorMessage = error instanceof Error ? error.message : 'Login failed'

      this.sessionStore.set({
        isLoggedIn: false,
        error: errorMessage
      })

      return {
        success: false,
        error: errorMessage
      }
    }
  }

  async logout() {
    if (!browser) return
    try {
      localStorage.removeItem('bsky-session')
      await this.agent.logout()
      this.sessionStore.set({
        isLoggedIn: false
      })
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  async checkSession(): boolean {
    if (!browser) return true;
    return this.agent.session !== null
  }

  // // APIリクエストのためのメソッドを追加
  // getAgent(): AtpAgent {
  //   return this.agent
  // }

  // フォローしているユーザーの投稿を取得
  async getFollowingFeed(limit = 50) {
    try {
      const response = await this.agent.getTimeline({
        limit: limit
      })
      return response.data.feed
    } catch (error) {
      console.error('Feed error:', error)
      throw error
    }
  }
}

// シングルトンインスタンスとしてエクスポート
export const bluesky = new Bluesky()

// カスタムフィードの作成
// export async function createCustomFeed(name, description, filter) {
//   try {
//     // 実際のフィード作成APIを呼び出す
//     // 注: APIの詳細仕様に応じて実装を調整する必要があります
//     const response = await agent.api.app.bsky.feed.generator.create({
//       name,
//       description,
//       filter
//     })
//     return response
//   } catch (error) {
//     console.error('Create feed error:', error)
//     throw error
//   }
// }