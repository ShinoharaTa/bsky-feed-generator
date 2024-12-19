<script lang="ts">
import { browser } from "$app/environment";
import { goto } from "$app/navigation";
// import { parseCreated } from "$lib/app";
import { bluesky } from "$lib/bluesky";
import type { FeedViewPost } from "@atproto/api/dist/client/types/app/bsky/feed/defs";
import { redirect } from "@sveltejs/kit";
import { onMount } from "svelte";

let posts: FeedViewPost[] = [];
const init = async () => {
	const result = bluesky.checkSession();
	if (!result) {
		goto("/login");
		return;
	}
	posts = await bluesky.getFollowingFeed(100);
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
{#each posts as post}
  <!-- <div>{JSON.stringify(post)} -->
  <!-- </div> -->
{/each}

<style>
</style>
