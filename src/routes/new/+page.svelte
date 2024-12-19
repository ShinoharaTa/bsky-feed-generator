<script lang="ts">
import { browser } from "$app/environment";
import { goto } from "$app/navigation";
// import { parseCreated } from "$lib/app";
import { bluesky } from "$lib/bluesky";
import Post from "$lib/components/post.svelte";
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
let selectedPosts = [];
// 抽出された単語のデータ
let extractedWords = [];
// 選択された単語のデータ
let selectedWords = [];
// フィルター文字列
let filterString = "";
</script>

{#if posts}
<div class="container-fluid py-3">
  <!-- ヘッダー -->
  <div class="row mb-4">
    <div class="col-12">
      <div class="bg-primary text-white p-3 rounded">
        <h1 class="h4 mb-0">Bluesky フィード作成</h1>
      </div>
    </div>
  </div>

  <!-- Step 1 & 2: 投稿選択と選択済み投稿 -->
  <div class="row mb-4 g-4">
    <!-- 投稿選択 -->
    <div class="col-12 col-md-6">
      <div class="card h-100">
        <div class="card-header bg-primary text-white">
          <h2 class="h5 mb-0">Step 1: 投稿を選択</h2>
        </div>
        <div class="card-body p-0">
          <div class="overflow-auto" style="max-height: 400px;">
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
        <div class="card-body">
          <div class="overflow-auto" style="max-height: 400px;">
            {#if selectedPosts.length > 0}
              <div class="list-group">
                <!-- 選択された投稿のリスト -->
              </div>
            {:else}
              <p class="text-muted">投稿が選択されていません</p>
            {/if}
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Step 3 & 4: 単語選択とフィルター作成 -->
  <div class="row mb-4 g-4">
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
  <div class="row mb-4">
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