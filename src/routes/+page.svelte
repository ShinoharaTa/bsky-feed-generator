<script lang="ts">
import { browser } from "$app/environment";
import { goto } from "$app/navigation";
// import { parseCreated } from "$lib/app";
import { bluesky } from "$lib/bluesky";
import type { FeedViewPost, GeneratorView } from "@atproto/api/dist/client/types/app/bsky/feed/defs";
import { redirect } from "@sveltejs/kit";
import { onMount } from "svelte";

let feeds: GeneratorView[] = [];
const init = async () => {
  const isSessionValid = await bluesky.initializationPromise
  if(isSessionValid){
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
{#each feeds as feed}
  <div>{JSON.stringify(feed)}
  </div>
{/each}

<style>
</style>
