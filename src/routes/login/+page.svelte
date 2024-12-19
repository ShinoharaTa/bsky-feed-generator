<script lang="ts">
import { goto } from "$app/navigation";
import { bluesky } from "$lib/bluesky";

let username = "";
let password = "";
let message = "";
let disabled = false

const auth = async () => {
  disabled = true;
	const result = await bluesky.login(username, password);
	if (result) {
		goto("/");
	} else {
		message = "ログインに失敗しました";
	}
  disabled = false;
};
</script>
<div class="container">
  <div class="card p-3">
    <form class="form text-center">
      <input type="text" bind:value={username} placeholder="username" class="form-control mt-2">
      <input type="password" bind:value={password} placeholder="password" class="form-control mt-2">
      <p class="text-danger mt-3">{message}</p>
      <button on:click={auth} type="button" {disabled} class="btn btn-primary">login</button>
    </form>
  </div>
</div>
