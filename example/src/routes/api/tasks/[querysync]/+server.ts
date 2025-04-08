import { json } from "@sveltejs/kit";
import { tasksQS } from "../../../tasks/[querysync]/qs.svelte";

export async function GET({ params }../../[querysync]/$types.js) {
  const filters = await tasksQS.fromString(params.querysync);

  console.log(filters);

  return json({
    return: "some data"
  });
}
