<script lang="ts">
export let post: string;
</script>

<article class="card p-2 mb-2">
{#if post}
  <div class="d-flex justify-content-between align-items-start">
    <div class="feed_text mt-1">
      {post}
    </div>
    <button class="btn p-1 mx-1 flex-shrink-0">
      <img src="/icons/xmark-circle.svg" alt="" class="img-fluid">
    </button>
  </div>
{/if}
</article>

<style lang="scss">
  .feed_text {
    font-size: 0.9rem;
    word-wrap: break-word;
    white-space: pre-wrap;
  }
</style>