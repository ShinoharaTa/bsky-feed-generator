<script lang="ts">
import type { Post } from "$lib/types";
export let post: Post;
</script>

<article class="card p-2 mb-2">
{#if post}
  <div class="d-flex align-items-center">
    <div>
      {#if post.avatar}
        <img src="{post.avatar}" alt="" class="avatar">
      {:else}
        <div class="avatar default">
          <img src="/icons/man.svg" alt="" class="inner-icon">
        </div>
      {/if}
    </div>
    <div class="flex-fill ms-2">
      {#if post.displayName}
      <div class="name">
        {post.displayName}
      </div>
      <div class="handle">
        @{post.handle}
      </div>
      {:else}
      <div class="name">
        @{post.handle}
      </div>
      {/if}
    </div>
    <button class="btn p-1 me-1">
      <img src="/icons/plus-circle.svg" alt="" class="img-fluid">
    </button>
  </div>
  <div class="feed_text mt-1">
    {post.text}
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