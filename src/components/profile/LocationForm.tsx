import { component$ } from "@builder.io/qwik";

type LocationFormProps = {
  data: { when: string; what: string; where: string };
};

export default component$<LocationFormProps>(({ data }) => {
  return (
    <form class="flex flex-col gap-4">
      <div class="flex flex-col gap-2">
        <label>When are you going?</label>
        <select class="rounded-lg border border-gray-500 bg-gray-50 p-3 text-sm text-black focus:border-green-500">
          <option>12h</option>
          <option>13h</option>
        </select>
      </div>
      <div class="flex flex-col gap-2">
        <label for="what">What are you working on?</label>
        <input
          class="rounded-lg border border-gray-500 bg-gray-50 p-3 text-sm text-black focus:border-green-500"
          type="text"
          id="what"
          name="what"
          value={data.what}
        />
      </div>
      <div class="flex flex-col gap-2">
        <label>Where will you be?</label>
        <input
          class="rounded-lg border border-gray-500 bg-gray-50 p-3 text-sm text-black focus:border-green-500"
          type="text"
          id="where"
          name="where"
          value={data.where}
        />
      </div>
    </form>
  );
});
