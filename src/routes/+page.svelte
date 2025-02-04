<script lang="ts">
import { browser } from "$app/environment";
import { goto } from "$app/navigation";
// import { parseCreated } from "$lib/app";
import { bluesky } from "$lib/bluesky";
  import { AtUri } from "@atproto/api";
import type {
	FeedViewPost,
	GeneratorView,
} from "@atproto/api/dist/client/types/app/bsky/feed/defs";
import { redirect } from "@sveltejs/kit";
import { onMount } from "svelte";

let feeds: GeneratorView[] = [];
const init = async () => {
	const isSessionValid = await bluesky.initializationPromise;
	if (isSessionValid) {
		const result = bluesky.checkSession();
		if (!result) {
			goto("/login");
			return;
		}
		feeds = await bluesky.getActorFeed(100);
	}
};
if (browser) {
	init();
}
</script>



<!-- <NavigationBar>
  <div slot="left">
    <img src="/blank.svg" alt="" height="24px" />
  </div>
  <div slot="right">
    <a href="/settings/keys"><img src="/gear.svg" class="path" alt="" height="24px" /></a>
  </div>
</NavigationBar> -->
<div class="container py-3">
  <div class="row">
    <h2 class="col-12">登録済みフィード一覧</h2>
  </div>
  <div class="row g-2 mt-4">
  {#each feeds as feed}
    <div class="col-4"><strong>{feed.displayName}</strong></div>
    <div class="col-8">
      <div class="d-flex justify-content-between">
        <div>
          {feed.did}
        </div>
        <div>
          <a href="" class="btn btn-sm btn-primary">編集</a>
          <a href="{feed.viewer.like}" class="btn btn-sm btn-success">フィードを開く</a>
        </div>
      </div>
    </div>
  {/each}
  </div>
</div>

<style>
</style>
