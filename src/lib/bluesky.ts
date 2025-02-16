import { browser } from '$app/environment'
import { goto } from '$app/navigation'
import { AtpAgent } from '@atproto/api'
import type { AtpSessionData} from '@atproto/api'
import type { InputSchema } from '@atproto/api/dist/client/types/com/atproto/repo/putRecord'
import { formatISO } from 'date-fns'
import { get, writable, type Writable } from 'svelte/store'

export interface SessionState {
  did: string | null
  handle: string | null
}

const initSessionState = {
  did: null,
  handle: null,
}

export class Bluesky {
  private agent: AtpAgent
  public sessionStore: Writable<SessionState>
  public initializationPromise: Promise<boolean>

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

    this.sessionStore = writable(initSessionState)
    this.initializationPromise = this.initializeSession()
  }

  private async initializeSession(): Promise<boolean> {
    if (!browser) return false
    try {
      const savedSession = localStorage.getItem('bsky-session')
      if (!savedSession) throw new Error("Session Nothing.");

      const session = JSON.parse(savedSession) as AtpSessionData
      const result = await this.agent.resumeSession(session)
      console.log(result.data)
      if(!result.success) throw new Error("Session Expired.");
      this.sessionStore.set({
        did: result.data.did,
        handle: result.data.handle
      })
      return true
    } catch (error) {
      console.error('Session initialization error:', error)
      localStorage.removeItem('bsky-session')
      await this.agent.logout()

      this.sessionStore.set(initSessionState)

      goto("/login")
      return false
    }
  }

  async login(identifier: string, password: string): Promise<{ success: boolean; error?: string }> {
    try {
      const result = await this.agent.login({
        identifier,
        password
      })
      if(!result.success) throw new Error("Login failed")
      this.sessionStore.set({
        did: result.data.did,
        handle: result.data.handle
      })

      return { success: true }
    } catch (error) {
      console.error('Login error:', error)
      const errorMessage = error instanceof Error ? error.message : 'Login failed'

      this.sessionStore.set(initSessionState)

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
      this.sessionStore.set(initSessionState)
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  checkSession(): boolean {
    if (!browser) return true;
    return this.agent.session !== null
  }

  getHandle() {
    const session = get(this.sessionStore)
    console.log(session)
    if(!session.handle) throw new Error("Nothing handle");
    return session.handle
  }

  // フォローしているユーザーの投稿を取得
  async getFollowingFeed(limit = 50) {
    try {
      const response = await this.agent.getTimeline({
        limit
      })
      return response.data.feed
    } catch (error) {
      console.error('Feed error:', error)
      throw error
    }
  }

  async getActorFeed(limit = 50) {
    const session = get(this.sessionStore)
    console.log(session)
    if(!session.did) throw new Error("Nothing did");
    const response = await this.agent.app.bsky.feed.getActorFeeds({actor: session.did, limit})
    console.log(response)
    return response.data.feeds
  }

  async publishFeed (params: {rkey: string, displayName: string, description?: string, tag: string}) {
    const session = get(this.sessionStore)
    console.log(session)
    if(!session.did) throw new Error("Nothing did");
    const data: InputSchema = {
      "repo": session.did,
      "collection": "app.bsky.feed.generator",
      "rkey": params.rkey,
      "record": {
        "did": "did:web:customfeed.shigepon.net",
        "displayName": params.displayName,
        "description": params.description ?? "",
        "descriptionFacets": [
          {
            "index": {
              "byteStart": 0,
              "byteEnd": 1
            },
            "features": [
              {
                "$type": "app.bsky.richtext.facet#tag",
                "tag": params.tag
              }
            ]
          }
        ],
        "createdAt": formatISO(new Date()),
      }
    }
    const result = await this.agent.com.atproto.repo.putRecord(data)
    if(!result.success) throw new Error("Failed publish record.");
    return result.data
  }
}

// シングルトンインスタンスとしてエクスポート
export const bluesky = new Bluesky()
