<script lang="ts">
import type { FeedViewPost } from "@atproto/api/dist/client/types/app/bsky/feed/defs";

export let post: FeedViewPost;
</script>

<article class="card p-2 mb-2">
{#if post}
  <div class="d-flex align-items-center">
    <div>
      {#if post.post.author.avatar}
        <img src="{post.post.author.avatar}" alt="" class="avatar">
      {:else}
        <div class="avatar default">
          <img src="/icons/man.svg" alt="" class="inner-icon">
        </div>
      {/if}
    </div>
    <div class="flex-fill ms-2">
      {#if post.post.author.displayName}
      <div class="name">
        {post.post.author.displayName}
      </div>
      <div class="handle">
        @{post.post.author.handle}
      </div>
      {:else}
      <div class="name">
        @{post.post.author.handle}
      </div>
      {/if}
    </div>
    <button class="btn p-1 me-1">
      <img src="/icons/plus-circle.svg" alt="" class="img-fluid">
    </button>
  </div>
  <div class="feed_text mt-1">
    {#if post.post.record.$type === "app.bsky.feed.post"}
      {post.post.record.text}
    {:else if false}
    <!-- else if content here -->
    {:else}
    <!-- else content here -->
    {/if}
  </div>
{/if}
</article>

<style lang="scss">
  .avatar {
    width: 2.2rem;
    height: 2.2rem;
    border-radius: 2rem;
    overflow: hidden;
    display: flex;
    align-items: end;
    justify-content: center;
    &.default {
      border: 0.13rem solid #000;
    }
    >.inner-icon {
      width: 1.6rem;
    }
  }
  .name {
    font-size: 0.9rem;
  }
  .handle {
    font-weight: 700;
    font-size: 0.8rem;
  }
  .feed_text {
    font-size: 0.9rem;
    word-wrap: break-word;
    white-space: pre-wrap;
    // word-break: break-all;
  }
</style>