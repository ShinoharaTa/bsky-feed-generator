<script lang="ts">
import { browser } from "$app/environment";
import { goto } from "$app/navigation";
// import { parseCreated } from "$lib/app";
import { bluesky } from "$lib/bluesky";
import Post from "$lib/components/post.svelte";
import SelectedPost from "$lib/components/selectedPost.svelte";
import type { FeedViewPost } from "@atproto/api/dist/client/types/app/bsky/feed/defs";
import { onMount } from "svelte";

let posts: FeedViewPost[] = [];
const init = async () => {
	const result = bluesky.checkSession();
	if (!result) {
		goto("/login");
	}
	posts = await bluesky.getFollowingFeed(100);
};
if (browser) {
	init();
}

// 投稿選択のデータ
let selectedPosts = [
  "今日の夕飯はカレーライス！作り置きしておいたルーを温めるだけで超楽チン😊 #料理 #時短レシピ",
  "新しいカメラが届いた！これから色々な写真を撮るのが楽しみ。とりあえず窓から見える夕焼けを撮ってみた📸✨",
  "気になってた本、やっと読み終わった。めちゃくちゃ面白かったけど、最後の展開は予想外だった…！",
  "電車が遅延してて会社に遅刻しそう😱 今日に限って朝一から会議があるのに…",
  "ついに新作ゲームの発売日！仕事終わりに買いに行くぞ🎮 積みゲー増えるけど気にしない（笑）",
  "雨の予報だったのに急に晴れてきた☀️ 洗濯物が助かる〜",
  "子供が初めて自転車に乗れるようになった！練習の成果が出て親としても嬉しい😆",
  "今日のランチ、同僚と新しくできたパスタ屋さんに行ってきた🍝 ソースが絶品でリピ確定",
  "深夜のコンビニでアイス買ってきた。明日の仕事のこと考えたら寝るべきなんだけどね…",
  "最近始めたヨガ、体が柔らかくなってきた気がする🧘‍♀️ 継続は力なり！"
]// 抽出された単語のデータ
let extractedWords = [];
// 選択された単語のデータ
let selectedWords = [];
// フィルター文字列
let filterString = "";
</script>

{#if posts}
<div class="container-fluid py-3">
  <!-- ヘッダー -->
  <div class="row mb-3">
    <div class="col-12">
      <div class="bg-primary text-white p-3 rounded">
        <h1 class="h4 mb-0">Bluesky フィード作成</h1>
      </div>
    </div>
  </div>

  <!-- Step 1 & 2: 投稿選択と選択済み投稿 -->
  <div class="row mb-3 g-2">
    <!-- 投稿選択 -->
    <div class="col-12 col-md-6">
      <div class="card h-100">
        <div class="card-header bg-primary text-white">
          <h2 class="h5 mb-0">Step 1: 投稿を選択</h2>
        </div>
        <div class="card-body p-0">
          <div class="overflow-auto" style="max-height: 600px;">
            <div class="list-group p-2">
              {#each posts as post}
                {#if post.post.record.$type === "app.bsky.feed.post"}
                <Post {post}></Post>
                {/if}
              {/each}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 選択済み投稿 -->
    <div class="col-12 col-md-6">
      <div class="card h-100">
        <div class="card-header bg-primary text-white">
          <h2 class="h5 mb-0">Step 2: 選択した投稿を確認</h2>
        </div>
        <div class="card-body p-0">
          <div class="overflow-auto" style="max-height: 600px;">
            <div class="list-group p-2">
              {#each selectedPosts as post}
              <SelectedPost {post}></SelectedPost>
              {:else}
                <p class="text-muted">投稿が選択されていません</p>
              {/each}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="text-center mb-3">
    <button class="btn btn-lg btn-primary w-50">単語を抽出</button>
  </div>

<!-- Step 3 & 4: 単語選択とフィルター作成 -->
  <div class="row mb-3 g-2">
    <!-- 単語選択 -->
    <div class="col-12 col-md-6">
      <div class="card h-100">
        <div class="card-header bg-primary text-white">
          <h2 class="h5 mb-0">Step 3: 単語を選択</h2>
        </div>
        <div class="card-body">
          <div class="overflow-auto" style="max-height: 300px;">
            {#if extractedWords.length > 0}
              <div class="d-flex flex-wrap gap-2">
                <!-- 抽出された単語のリスト -->
                <button class="btn btn-outline-primary btn-sm">
                  単語サンプル
                </button>
              </div>
            {:else}
              <p class="text-muted">単語が抽出されていません</p>
            {/if}
          </div>
        </div>
      </div>
    </div>

    <!-- フィルター作成 -->
    <div class="col-12 col-md-6">
      <div class="card h-100">
        <div class="card-header bg-primary text-white">
          <h2 class="h5 mb-0">Step 4: フィルターを作成</h2>
        </div>
        <div class="card-body">
          <div class="mb-3">
            <label class="form-label">選択した単語</label>
            <div class="d-flex flex-wrap gap-2 mb-3">
              {#each selectedWords as word}
                <span class="badge bg-primary">{word}</span>
              {/each}
            </div>
            <label class="form-label">フィルター文字列</label>
            <textarea 
              class="form-control" 
              rows="3" 
              bind:value={filterString}
              placeholder="フィルター文字列を入力または編集"
            ></textarea>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Step 5: プレビューと保存 -->
  <div class="row">
    <div class="col-12">
      <div class="card">
        <div class="card-header bg-primary text-white">
          <h2 class="h5 mb-0">Step 5: プレビューと保存</h2>
        </div>
        <div class="card-body">
          <div class="mb-4">
            <h3 class="h6">プレビュー</h3>
            <div class="border rounded p-3 mb-3">
              <!-- プレビューコンテンツ -->
              <p class="text-muted">フィルター適用結果のプレビュー</p>
            </div>
          </div>
          <div class="d-flex justify-content-end gap-2">
            <button class="btn btn-secondary">キャンセル</button>
            <button class="btn btn-primary">保存</button>
            <button class="btn btn-success">公開</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
{/if}

<style>
  /* カスタムスタイルが必要な場合はここに追加 */
  :global(body) {
    background-color: #f8f9fa;
  }
</style>