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
import { json, redirect } from "@sveltejs/kit";
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

const getEditUrl = (feed: GeneratorView) => {
  const rkey = feed.uri.split("/").slice(-1)
  return `/feed/${rkey}`
}

const getUrl = (feed: GeneratorView) => {
  const handle = feed.creator.handle
  const rkey = feed.uri.split("/").slice(-1)
  return `https://bsky.app/profile/${handle}/feed/${rkey}`
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
  <div class="row g-2 mt-4">
    <div class="col-12 mb-4 text-center"><a class="btn btn-lg btn-primary">フィード新規作成</a></div>
    <h2 class="col-12 mb-4">登録済みフィード一覧</h2>
  {#each feeds as feed}
    <!-- <div class="col-12">{JSON.stringify(feed)}</div> -->
    <div class="col-3"><strong>{feed.displayName}</strong></div>
    <div class="col-9">
      <div class="d-flex justify-content-between">
        <div>
          {feed.did}
        </div>
        <div>
          <a href="{getEditUrl(feed)}" class="btn btn-sm btn-primary">編集</a>
          <a href="{getUrl(feed)}" target="_blank" class="btn btn-sm btn-outline-primary">フィードに移動</a>
          <a href="" class="btn btn-sm btn-outline-danger">削除</a>
        </div>
      </div>
    </div>
  {/each}
  </div>
</div>

<style>
</style>
